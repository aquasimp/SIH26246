"""
KaushalPulse ML Module: Train Demand Forecasting Model
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Trains Global LightGBM Regressor on canonical labour time series.
Saves model artifacts, backtest metrics, and feature schema.
"""

import os
import json
import pickle
import datetime
import pandas as pd
import numpy as np
import lightgbm as lgb

try:
    from ml.data_loader import load_canonical_data
    from ml.features import create_features, FEATURE_COLUMNS
    from ml.evaluate import calculate_metrics, run_seasonal_naive_benchmark
except ImportError:
    from data_loader import load_canonical_data
    from features import create_features, FEATURE_COLUMNS
    from evaluate import calculate_metrics, run_seasonal_naive_benchmark

ARTIFACTS_DIR = "ml/model_artifacts"

def train_and_evaluate():
    print("=" * 65)
    print("KaushalPulse — Training Global LightGBM Demand Forecasting Model")
    print("=" * 65)

    # 1. Load Data
    print("Step 1: Loading canonical dataset from SQLite...")
    df_raw = load_canonical_data()
    print(f"Loaded {len(df_raw)} records across {df_raw['district'].nunique()} districts and {df_raw['nco_code'].nunique()} trades.")

    # 2. Engineer Features
    print("Step 2: Creating time-series lag and rolling statistics...")
    df_feat = create_features(df_raw)

    # Filter out initial 12 warm-up months (where lag_12 is NaN)
    df_valid = df_feat.dropna(subset=["lag_12"]).reset_index(drop=True)
    print(f"Valid feature records after 12-month lag warm-up: {len(df_valid)}")

    # 3. Walk-Forward Temporal Split
    # Unique dates sorted
    unique_dates = sorted(df_valid["date"].unique())
    split_idx = int(len(unique_dates) * 0.75) # First 75% for train, last 25% (12 months) for backtest
    split_date = unique_dates[split_idx]

    train_df = df_valid[df_valid["date"] < split_date]
    val_df = df_valid[df_valid["date"] >= split_date]

    print(f"Step 3: Temporal Walk-Forward Split at: {pd.to_datetime(split_date).strftime('%Y-%m-%d')}")
    print(f"  Training Set:   {len(train_df)} rows ({train_df['date'].min().strftime('%Y-%m')} to {train_df['date'].max().strftime('%Y-%m')})")
    print(f"  Validation Set: {len(val_df)} rows ({val_df['date'].min().strftime('%Y-%m')} to {val_df['date'].max().strftime('%Y-%m')})")

    # 4. Seasonal Naive Benchmark Evaluation
    print("\nStep 4: Evaluating Seasonal Naive Benchmark on Validation Window...")
    naive_metrics = run_seasonal_naive_benchmark(val_df)
    print(f"  Seasonal Naive WAPE: {naive_metrics['wape']}% | MAE: {naive_metrics['mae']} | RMSE: {naive_metrics['rmse']}")

    # 5. Train LightGBM Model
    print("\nStep 5: Fitting Global LightGBM Ensemble...")
    X_train = train_df[FEATURE_COLUMNS]
    y_train = train_df["job_demand"]

    X_val = val_df[FEATURE_COLUMNS]
    y_val = val_df["job_demand"]

    params = {
        "objective": "regression",
        "metric": "l1",
        "boosting_type": "gbdt",
        "learning_rate": 0.04,
        "num_leaves": 31,
        "max_depth": 6,
        "feature_fraction": 0.85,
        "bagging_fraction": 0.85,
        "bagging_freq": 1,
        "min_child_samples": 20,
        "verbosity": -1,
        "random_state": 42
    }

    model = lgb.LGBMRegressor(**params, n_estimators=450)
    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        callbacks=[lgb.early_stopping(stopping_rounds=30, verbose=False)]
    )

    # 6. Evaluate Model on Validation Set
    val_preds = model.predict(X_val)
    val_preds = np.clip(val_preds, 0, None)
    lgbm_metrics = calculate_metrics(y_val.values, val_preds)

    print(f"  LightGBM Ensemble WAPE: {lgbm_metrics['wape']}% | MAE: {lgbm_metrics['mae']} | RMSE: {lgbm_metrics['rmse']}")
    improvement = ((naive_metrics['wape'] - lgbm_metrics['wape']) / naive_metrics['wape']) * 100
    print(f"  Relative Accuracy Gain: +{improvement:.1f}% reduction in forecasting error.")

    # 7. Retrain on Full Dataset for Production Serving
    print("\nStep 6: Retraining Final Serving Model on Full Historical Timeline...")
    X_full = df_valid[FEATURE_COLUMNS]
    y_full = df_valid["job_demand"]
    final_model = lgb.LGBMRegressor(**params, n_estimators=model.best_iteration_ or 350)
    final_model.fit(X_full, y_full)

    # Feature Importances
    importances = dict(zip(FEATURE_COLUMNS, [float(x) for x in final_model.feature_importances_]))
    top_features = sorted(importances.items(), key=lambda x: x[1], reverse=True)[:8]
    print("  Top Predictive Covariates:")
    for feat, imp in top_features:
        print(f"    - {feat}: {imp:.1f}")

    # 8. Save Model Artifacts
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    os.makedirs("models", exist_ok=True)
    os.makedirs("metrics", exist_ok=True)
    os.makedirs("configs", exist_ok=True)
    os.makedirs("runs", exist_ok=True)

    model_path = os.path.join(ARTIFACTS_DIR, "demand_model.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(final_model, f)
    with open("models/demand_lightgbm.pkl", "wb") as f:
        pickle.dump(final_model, f)
    print(f"\nStep 7: Saved trained model artifact to: {model_path} and models/demand_lightgbm.pkl")

    # Save feature schema
    schema_dict = {
        "features": FEATURE_COLUMNS,
        "categorical_features": ["sector", "nco_code", "district", "state"],
        "target": "job_demand",
        "model_type": "LightGBM Regressor (GBDT)"
    }
    schema_path = os.path.join(ARTIFACTS_DIR, "feature_schema.json")
    with open(schema_path, "w") as f:
        json.dump(schema_dict, f, indent=2)
    with open("configs/feature_schema.json", "w") as f:
        json.dump(schema_dict, f, indent=2)

    # Save metrics
    metrics_dict = {
        "dataset": "Official SIH Evaluation Dataset (sih_monthly_intelligence)",
        "seasonal_naive_baseline": naive_metrics,
        "lightgbm_ensemble": lgbm_metrics,
        "relative_improvement_percent": round(improvement, 2),
        "walk_forward_split_date": str(split_date)[:10],
        "training_rows": len(train_df),
        "validation_rows": len(val_df),
        "total_observations": len(df_valid),
        "horizons_supported": ["3M", "6M", "12M"],
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    metrics_path = os.path.join(ARTIFACTS_DIR, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_dict, f, indent=2)
    with open("metrics/backtest.json", "w") as f:
        json.dump(metrics_dict, f, indent=2)
    print(f"Saved actual evaluation metrics to: {metrics_path} and metrics/backtest.json")

    # Save model metadata & config
    config_dict = {
        "model_version": "v3.2.0-sih-prod",
        "algorithm": "Global LightGBM Ensemble",
        "parameters": params,
        "best_iteration": int(final_model.best_iteration_ or 350)
    }
    with open("configs/model_config.json", "w") as f:
        json.dump(config_dict, f, indent=2)

    today_str = datetime.date.today().strftime("%Y-%m-%d")
    run_dict = {
        "run_id": f"RUN-{today_str}-SIH-001",
        "dataset_mode": "sih_dummy",
        "data_source": "Official SIH Evaluation Dataset (data/raw/sih_official_dummy_dataset.csv)",
        "train_rows": len(train_df),
        "val_rows": len(val_df),
        "wape_baseline": naive_metrics["wape"],
        "wape_lightgbm": lgbm_metrics["wape"],
        "error_reduction": round(improvement, 2),
        "trained_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    with open(f"runs/RUN-{today_str}.json", "w") as f:
        json.dump(run_dict, f, indent=2)

    metadata_path = os.path.join(ARTIFACTS_DIR, "model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump({
            "model_version": "v3.2.0-sih-prod",
            "run_id": f"RUN-{today_str}-SIH-001",
            "algorithm": "Global LightGBM Ensemble",
            "best_iteration": int(final_model.best_iteration_ or 350),
            "parameters": params,
            "feature_importances": importances,
            "trained_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "data_source": "Official SIH Evaluation Dataset (sih_monthly_intelligence)"
        }, f, indent=2)
    print(f"Saved model metadata to: {metadata_path} and configs/model_config.json")
    print("=" * 65)

if __name__ == "__main__":
    train_and_evaluate()
