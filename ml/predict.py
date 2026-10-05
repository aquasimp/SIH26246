"""
KaushalPulse ML Module: Inference & Forward Projections
Generates multi-horizon forecasts with 95% Confidence Intervals using the production
Tri-Model Ensemble Blend (LightGBM + Theta + ETS) with inverse-WAPE weights.
"""

import os
import pickle
import json
import datetime
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple

from ml.evaluate import theta_forecast, ets_forecast

ARTIFACTS_DIR = "ml/model_artifacts"
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "demand_model.pkl")
SCHEMA_PATH = os.path.join(ARTIFACTS_DIR, "feature_schema.json")
METRICS_PATH = os.path.join(ARTIFACTS_DIR, "metrics.json")

# Inverse-WAPE weights empirically derived from rolling-origin backtest (no lookahead)
BLEND_WEIGHTS = {
    3: {"lgb": 0.3225, "ets": 0.3064, "theta": 0.3710},
    6: {"lgb": 0.3062, "ets": 0.3254, "theta": 0.3684},
    12: {"lgb": 0.2816, "ets": 0.3799, "theta": 0.3385}
}

FEATURE_DESCRIPTIONS = {
    "month": "Calendar seasonality and fiscal procurement milestones",
    "quarter": "Quarterly corporate workforce planning cycle",
    "demand_growth_12m": "12-month structural industry expansion momentum",
    "demand_growth_3m": "Recent 3-month quarterly hiring acceleration",
    "rolling_std_6": "6-month vacancy volatility & recruitment clustering amplitude",
    "rolling_mean_3": "Short-term moving average baseline demand",
    "rolling_mean_6": "Medium-term 6-month smoothed hiring capacity",
    "rolling_mean_12": "Annualized moving average labour demand",
    "lag_1": "Preceding month recruitment order baseline (t-1)",
    "lag_3": "Quarter-lagged recruitment benchmark (t-3)",
    "lag_6": "Semi-annual lagged hiring baseline (t-6)",
    "lag_12": "Prior-year same-month seasonal anchor (t-12)",
    "lag_1_wage_signal": "Lagged compensation index premium (t-1)",
    "lag_1_industry_signal": "Lagged regional industrial order book momentum",
    "lag_1_training_seats": "Authorized institutional training capacity (t-1)",
    "lag_1_effective_supply": "Lagged certified employable supply throughput (t-1)",
    "lag_1_employer": "Active employer count in preceding month (t-1)",
    "employer_growth_3m": "Quarterly employer establishment growth rate",
    "district": "District-specific labour market geographic fixed effect",
    "state": "State-level vocational ecosystem policy environment",
    "sector": "Broad industry sector macroeconomic growth trajectory",
    "nco_code": "Occupation-specific skill specialization barrier"
}

class DemandPredictor:
    def __init__(self, model_path: str = MODEL_PATH):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model artifact not found at {model_path}. Run ml/train_demand_model.py first.")
        
        with open(model_path, "rb") as f:
            self.model = pickle.load(f)
            
        with open(SCHEMA_PATH, "r") as f:
            self.schema = json.load(f)

        self.metrics = {}
        if os.path.exists(METRICS_PATH):
            with open(METRICS_PATH, "r") as f:
                self.metrics = json.load(f)

        self.features = self.schema["features"]
        self.rmse = self.metrics.get("tri_model_blend", {}).get("rmse", 31.5)

    def forecast_series(
        self,
        recent_history: pd.DataFrame,
        horizon_months: int = 6
    ) -> List[Dict[str, Any]]:
        """
        Generates recursive multi-step monthly forward projections starting after the last date in recent_history.
        Uses the production Tri-Model Ensemble Blend (LightGBM + Theta + ETS) with inverse-WAPE weights.
        """
        history = recent_history.copy().sort_values("date").reset_index(drop=True)
        if len(history) < 12:
            raise ValueError("At least 12 months of historical observations required for feature lags.")

        last_record = history.iloc[-1]
        district = last_record["district"]
        state = last_record["state"]
        sector = last_record["sector"]
        nco_code = last_record["nco_code"]
        training_seats = last_record["training_seats"]
        wage = last_record["wage_signal"]
        industry_sig = last_record["industry_signal"]

        # Track rolling series of demand values
        demands = list(history["job_demand"].values)
        employers = list(history["employer_count"].values)

        # Baselines computed over historical sequence
        ets_proj = ets_forecast(demands, horizon_months, m=12)
        th_proj = theta_forecast(demands, horizon_months, m=12)

        last_date = pd.to_datetime(last_record["date"])
        projections = []

        w = BLEND_WEIGHTS.get(horizon_months, BLEND_WEIGHTS[6])

        for step in range(1, horizon_months + 1):
            # Calculate next month date
            year = last_date.year + (last_date.month - 1 + step) // 12
            month = (last_date.month - 1 + step) % 12 + 1
            cur_date = datetime.date(year, month, 1)

            # Lags from the growing trajectory
            lag_1 = demands[-1]
            lag_3 = demands[-3] if len(demands) >= 3 else demands[-1]
            lag_6 = demands[-6] if len(demands) >= 6 else demands[-1]
            lag_12 = demands[-12] if len(demands) >= 12 else demands[-1]

            rolling_3 = np.mean(demands[-3:])
            rolling_6 = np.mean(demands[-6:])
            rolling_12 = np.mean(demands[-12:])
            rolling_std = np.std(demands[-6:]) if len(demands) >= 6 else 0.0

            growth_3m = (lag_1 - lag_3) / (lag_3 + 1.0)
            growth_12m = (lag_1 - lag_12) / (lag_12 + 1.0)

            lag_1_emp = employers[-1]
            lag_3_emp = employers[-3] if len(employers) >= 3 else employers[-1]
            emp_growth_3m = (lag_1_emp - lag_3_emp) / (lag_3_emp + 1.0)

            # Effective employable supply using documented 0.70 job-readiness rate
            eff_supply = int(round(last_record["available_supply"] * 0.70 * (1 + 0.002 * step)))

            row = {
                "lag_1": lag_1,
                "lag_3": lag_3,
                "lag_6": lag_6,
                "lag_12": lag_12,
                "rolling_mean_3": rolling_3,
                "rolling_mean_6": rolling_6,
                "rolling_mean_12": rolling_12,
                "rolling_std_6": rolling_std,
                "demand_growth_3m": growth_3m,
                "demand_growth_12m": growth_12m,
                "lag_1_employer": lag_1_emp,
                "employer_growth_3m": emp_growth_3m,
                "lag_1_training_seats": training_seats if step == 1 else training_seats,
                "lag_1_effective_supply": int(round(last_record["available_supply"] * 0.70)) if step == 1 else projections[-1]["effective_supply"],
                "lag_1_wage_signal": wage,
                "lag_1_industry_signal": industry_sig,
                "month": month,
                "quarter": (month - 1) // 3 + 1,
                "sector": sector,
                "nco_code": nco_code,
                "district": district,
                "state": state
            }

            X_step = pd.DataFrame([row])
            for cat in ["sector", "nco_code", "district", "state"]:
                X_step[cat] = X_step[cat].astype("category")

            lgb_pred = float(self.model.predict(X_step[self.features])[0])
            ets_pred = ets_proj[step - 1]
            th_pred = th_proj[step - 1]

            # Production Multi-Model Inverse-WAPE Blend
            blended_val = w["lgb"] * lgb_pred + w["ets"] * ets_pred + w["theta"] * th_pred
            pred = max(20, int(round(blended_val)))

            # 95% Confidence Interval band (expanding with forecast horizon)
            uncertainty = float(1.96 * self.rmse * np.sqrt(1 + 0.15 * step))
            ci_lower = max(0, int(round(pred - uncertainty)))
            ci_upper = int(round(pred + uncertainty))

            # Baseline Naive projection for reference
            naive_pred = int(round(lag_12 * 1.02))

            # Append to trajectory
            demands.append(pred)
            employers.append(int(round(pred * 0.055)))

            projections.append({
                "month": cur_date.strftime("%Y-%m"),
                "forecast_demand": pred,
                "lgb_component": int(round(lgb_pred)),
                "ets_component": int(round(ets_pred)),
                "theta_component": int(round(th_pred)),
                "ci_lower": ci_lower,
                "ci_upper": ci_upper,
                "baseline_naive": naive_pred,
                "effective_supply": eff_supply,
                "confidence": round(max(60, min(95, 100 - (self.rmse / pred * 100))), 1)
            })

        return projections

    def compute_local_shap(self, recent_history: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Computes per-prediction local TreeSHAP feature contributions for the selected series.
        Returns top 5 feature contributors with magnitude, direction, and description.
        """
        history = recent_history.copy().sort_values("date").reset_index(drop=True)
        if len(history) < 12:
            return []

        last_record = history.iloc[-1]
        demands = list(history["job_demand"].values)
        employers = list(history["employer_count"].values)

        last_date = pd.to_datetime(last_record["date"])
        next_month = (last_date.month % 12) + 1
        quarter = (next_month - 1) // 3 + 1

        lag_1 = demands[-1]
        lag_3 = demands[-3] if len(demands) >= 3 else demands[-1]
        lag_6 = demands[-6] if len(demands) >= 6 else demands[-1]
        lag_12 = demands[-12] if len(demands) >= 12 else demands[-1]

        row = {
            "lag_1": lag_1,
            "lag_3": lag_3,
            "lag_6": lag_6,
            "lag_12": lag_12,
            "rolling_mean_3": np.mean(demands[-3:]),
            "rolling_mean_6": np.mean(demands[-6:]),
            "rolling_mean_12": np.mean(demands[-12:]),
            "rolling_std_6": np.std(demands[-6:]) if len(demands) >= 6 else 0.0,
            "demand_growth_3m": (lag_1 - lag_3) / (lag_3 + 1.0),
            "demand_growth_12m": (lag_1 - lag_12) / (lag_12 + 1.0),
            "lag_1_employer": employers[-1],
            "employer_growth_3m": (employers[-1] - employers[-3]) / (employers[-3] + 1.0) if len(employers) >= 3 else 0.0,
            "lag_1_training_seats": last_record["training_seats"],
            "lag_1_effective_supply": int(round(last_record["available_supply"] * 0.70)),
            "lag_1_wage_signal": last_record["wage_signal"],
            "lag_1_industry_signal": last_record["industry_signal"],
            "month": next_month,
            "quarter": quarter,
            "sector": last_record["sector"],
            "nco_code": last_record["nco_code"],
            "district": last_record["district"],
            "state": last_record["state"]
        }

        X = pd.DataFrame([row])
        for cat in ["sector", "nco_code", "district", "state"]:
            X[cat] = X[cat].astype("category")

        # TreeSHAP via LightGBM booster
        contrib = self.model.booster_.predict(X[self.features], pred_contrib=True)[0]
        # Drop the last element (bias term)
        feat_contrib = contrib[:-1]

        shap_list = []
        for feat, val in zip(self.features, feat_contrib):
            shap_list.append({
                "feature": feat,
                "shap_value": round(float(val), 2),
                "abs_impact": round(abs(float(val)), 2),
                "direction": "positive" if val >= 0 else "negative",
                "desc": FEATURE_DESCRIPTIONS.get(feat, feat)
            })

        # Sort by absolute impact magnitude
        shap_list = sorted(shap_list, key=lambda x: x["abs_impact"], reverse=True)
        return shap_list[:5]

_cached_predictor = None

def get_predictor() -> DemandPredictor:
    global _cached_predictor
    if _cached_predictor is None:
        _cached_predictor = DemandPredictor()
    return _cached_predictor
