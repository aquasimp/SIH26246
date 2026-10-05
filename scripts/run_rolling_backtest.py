"""
KaushalPulse: High-Performance Vectorized Rolling-Origin Backtest Runner
Evaluates LightGBM, Seasonal Naive, ETS, and Theta across >= 6 origins and horizons 3, 6, 12.
"""

import os
import sys
import json
import sqlite3
import numpy as np
import pandas as pd
import lightgbm as lgb

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from ml.features import create_features, FEATURE_COLUMNS
from ml.evaluate import (
    calculate_metrics, seasonal_naive_forecast, ets_forecast, theta_forecast, compute_insample_scale
)

def run_backtest_for_table(table_name="sih_monthly_intelligence"):
    conn = sqlite3.connect(os.path.join(ROOT_DIR, "data", "kaushal_pulse.db"))
    df_raw = pd.read_sql(f"SELECT * FROM {table_name}", conn)
    conn.close()

    df_raw["date"] = pd.to_datetime(df_raw["date"])
    df_raw = df_raw.sort_values(by=["district", "nco_code", "date"]).reset_index(drop=True)
    all_dates = sorted(df_raw["date"].unique())

    print(f"Running rolling-origin backtest on {table_name} ({len(df_raw)} rows, {len(all_dates)} dates)...", flush=True)

    # Feature engineering over the full dataset
    df_feat = create_features(df_raw)
    df_valid = df_feat.dropna(subset=["lag_12"]).reset_index(drop=True)
    valid_dates = sorted(df_valid["date"].unique())

    # Origins with >= 12 months ahead
    eligible_origins = [d for d in valid_dates if all_dates.index(d) + 12 < len(all_dates)]
    origins = eligible_origins[-6:] if len(eligible_origins) >= 6 else eligible_origins

    print(f"Selected {len(origins)} rolling origins: {[o.strftime('%Y-%m') for o in origins]}", flush=True)

    horizons = [3, 6, 12]
    models = ["lightgbm", "seasonal_naive", "ets", "theta"]
    results = {
        h: {m: {"actuals": [], "preds": [], "scales": []} for m in models}
        for h in horizons
    }

    group_keys = sorted(df_raw.groupby(["district", "nco_code"]).groups.keys())
    groups = {k: v.sort_values("date").reset_index(drop=True) for k, v in df_raw.groupby(["district", "nco_code"])}

    for o_idx, origin_date in enumerate(origins):
        origin_idx = all_dates.index(origin_date)
        print(f"  Origin {o_idx + 1}/{len(origins)}: {origin_date.strftime('%Y-%m')}...", flush=True)

        # Train LightGBM on data up to origin_date
        train_slice = df_valid[df_valid["date"] <= origin_date]
        X_train = train_slice[FEATURE_COLUMNS]
        y_train = train_slice["job_demand"]

        lgb_params = {
            "objective": "regression",
            "metric": "l1",
            "boosting_type": "gbdt",
            "learning_rate": 0.05,
            "num_leaves": 31,
            "max_depth": 6,
            "feature_fraction": 0.85,
            "bagging_fraction": 0.85,
            "bagging_freq": 1,
            "min_child_samples": 15,
            "verbosity": -1,
            "random_state": 42
        }
        lgb_model = lgb.LGBMRegressor(**lgb_params, n_estimators=200)
        lgb_model.fit(X_train, y_train)

        # Setup state for all series
        series_state = []
        for key in group_keys:
            grp = groups[key]
            hist_grp = grp[grp["date"] <= origin_date]
            if len(hist_grp) < 12:
                continue
            hist_demand = list(hist_grp["job_demand"].values)
            hist_emp = list(hist_grp["employer_count"].values)
            scale = compute_insample_scale(hist_demand, m=12)
            last_rec = hist_grp.iloc[-1]

            sn_preds = seasonal_naive_forecast(hist_demand, 12, m=12)
            ets_preds = ets_forecast(hist_demand, 12, m=12)
            th_preds = theta_forecast(hist_demand, 12, m=12)

            series_state.append({
                "key": key,
                "grp": grp,
                "demands": hist_demand,
                "employers": hist_emp,
                "scale": scale,
                "last_rec": last_rec,
                "sn_preds": sn_preds,
                "ets_preds": ets_preds,
                "th_preds": th_preds,
                "lgb_preds": []
            })

        # Multi-step recursive simulation with batch prediction
        for step in range(1, 13):
            step_date = all_dates[origin_idx + step]
            step_month = step_date.month
            step_quarter = (step_month - 1) // 3 + 1

            batch_rows = []
            for s in series_state:
                dem = s["demands"]
                emp = s["employers"]
                rec = s["last_rec"]

                l1 = dem[-1]
                l3 = dem[-3] if len(dem) >= 3 else dem[-1]
                l6 = dem[-6] if len(dem) >= 6 else dem[-1]
                l12 = dem[-12] if len(dem) >= 12 else dem[-1]

                r3 = np.mean(dem[-3:])
                r6 = np.mean(dem[-6:])
                r12 = np.mean(dem[-12:])
                rstd6 = np.std(dem[-6:]) if len(dem) >= 6 else 0.0

                g3 = (l1 - l3) / (l3 + 1.0)
                g12 = (l1 - l12) / (l12 + 1.0)

                l1_e = emp[-1]
                l3_e = emp[-3] if len(emp) >= 3 else emp[-1]
                eg3 = (l1_e - l3_e) / (l3_e + 1.0)

                batch_rows.append({
                    "lag_1": l1, "lag_3": l3, "lag_6": l6, "lag_12": l12,
                    "rolling_mean_3": r3, "rolling_mean_6": r6, "rolling_mean_12": r12, "rolling_std_6": rstd6,
                    "demand_growth_3m": g3, "demand_growth_12m": g12,
                    "lag_1_employer": l1_e, "employer_growth_3m": eg3,
                    "lag_1_training_seats": rec["training_seats"],
                    "lag_1_effective_supply": int(rec["available_supply"] * rec["placement_rate"]),
                    "lag_1_wage_signal": rec["wage_signal"],
                    "lag_1_industry_signal": rec["industry_signal"],
                    "month": step_month, "quarter": step_quarter,
                    "sector": rec["sector"], "nco_code": rec["nco_code"],
                    "district": rec["district"], "state": rec["state"]
                })

            df_batch = pd.DataFrame(batch_rows)
            for cat in ["sector", "nco_code", "district", "state"]:
                df_batch[cat] = df_batch[cat].astype("category")

            preds = lgb_model.predict(df_batch[FEATURE_COLUMNS])
            for i, p_val in enumerate(preds):
                pred_clean = max(10, float(p_val))
                series_state[i]["lgb_preds"].append(pred_clean)
                series_state[i]["demands"].append(pred_clean)
                series_state[i]["employers"].append(int(round(pred_clean * 0.055)))

        # Accumulate horizon evaluations
        for s in series_state:
            grp = s["grp"]
            scale = s["scale"]
            for h in horizons:
                act_date = all_dates[origin_idx + h]
                act_row = grp[grp["date"] == act_date]
                if len(act_row) == 0:
                    continue
                act_val = float(act_row.iloc[0]["job_demand"])
                idx_h = h - 1

                results[h]["lightgbm"]["actuals"].append(act_val)
                results[h]["lightgbm"]["preds"].append(s["lgb_preds"][idx_h])
                results[h]["lightgbm"]["scales"].append(scale)

                results[h]["seasonal_naive"]["actuals"].append(act_val)
                results[h]["seasonal_naive"]["preds"].append(s["sn_preds"][idx_h])
                results[h]["seasonal_naive"]["scales"].append(scale)

                results[h]["ets"]["actuals"].append(act_val)
                results[h]["ets"]["preds"].append(s["ets_preds"][idx_h])
                results[h]["ets"]["scales"].append(scale)

                results[h]["theta"]["actuals"].append(act_val)
                results[h]["theta"]["preds"].append(s["th_preds"][idx_h])
                results[h]["theta"]["scales"].append(scale)

    summary = {
        "dataset": table_name,
        "origins_count": len(origins),
        "origins": [o.strftime("%Y-%m-%d") for o in origins],
        "horizons": {}
    }

    for h in horizons:
        h_key = f"{h}M"
        summary["horizons"][h_key] = {}
        for m in models:
            acts = np.array(results[h][m]["actuals"])
            preds = np.array(results[h][m]["preds"])
            mean_scale = float(np.mean(results[h][m]["scales"])) if results[h][m]["scales"] else 1.0
            summary["horizons"][h_key][m] = calculate_metrics(acts, preds, insample_scale=mean_scale)

    return summary

if __name__ == "__main__":
    table = "sih_monthly_intelligence" if len(sys.argv) < 2 else sys.argv[1]
    res = run_backtest_for_table(table)
    print("\n" + "=" * 60)
    print(f"FINAL BACKTEST SUMMARY FOR {table}:")
    print(json.dumps(res, indent=2))

    # Also save to metrics.json
    out_path = os.path.join(ROOT_DIR, "ml", "model_artifacts", "rolling_backtest_metrics.json")
    with open(out_path, "w") as f:
        json.dump(res, f, indent=2)
    print(f"\nSaved metrics to {out_path}")
