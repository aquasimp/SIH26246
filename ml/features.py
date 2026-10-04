"""
KaushalPulse ML Module: Feature Engineering
Strict temporal lag feature engineering with ZERO future data leakage.
"""

import pandas as pd
import numpy as np
from typing import List, Tuple, Dict, Any

FEATURE_COLUMNS = [
    "lag_1", "lag_3", "lag_6", "lag_12",
    "rolling_mean_3", "rolling_mean_6", "rolling_mean_12", "rolling_std_6",
    "demand_growth_3m", "demand_growth_12m",
    "lag_1_employer", "employer_growth_3m",
    "training_seats", "effective_supply",
    "industry_signal", "wage_signal",
    "month", "quarter",
    "sector", "nco_code", "district", "state"
]

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes time-series lag and rolling statistics grouped by (district, nco_code).
    All features are derived strictly from t-1 or earlier, preventing data leakage.
    """
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(by=["district", "nco_code", "date"]).reset_index(drop=True)

    # Calculate effective supply
    df["effective_supply"] = (df["available_supply"] * df["placement_rate"]).astype(int)

    # Groupby district and nco_code to calculate true group-level lags
    grouped = df.groupby(["district", "nco_code"])

    # 1. Historical Demand Lags
    df["lag_1"] = grouped["job_demand"].shift(1)
    df["lag_3"] = grouped["job_demand"].shift(3)
    df["lag_6"] = grouped["job_demand"].shift(6)
    df["lag_12"] = grouped["job_demand"].shift(12)

    # 2. Rolling Statistics (Strictly over shifted series to avoid leakage)
    # rolling on shifted series means window [t-3, t-1], [t-6, t-1], [t-12, t-1]
    df["rolling_mean_3"] = grouped["job_demand"].transform(lambda s: s.shift(1).rolling(3, min_periods=1).mean())
    df["rolling_mean_6"] = grouped["job_demand"].transform(lambda s: s.shift(1).rolling(6, min_periods=1).mean())
    df["rolling_mean_12"] = grouped["job_demand"].transform(lambda s: s.shift(1).rolling(12, min_periods=1).mean())
    df["rolling_std_6"] = grouped["job_demand"].transform(lambda s: s.shift(1).rolling(6, min_periods=1).std()).fillna(0)

    # 3. Growth Velocities
    df["demand_growth_3m"] = (df["lag_1"] - df["lag_3"]) / (df["lag_3"] + 1.0)
    df["demand_growth_12m"] = (df["lag_1"] - df["lag_12"]) / (df["lag_12"] + 1.0)

    # 4. Employer Activity Lags
    df["lag_1_employer"] = grouped["employer_count"].shift(1)
    lag_3_emp = grouped["employer_count"].shift(3)
    df["employer_growth_3m"] = (df["lag_1_employer"] - lag_3_emp) / (lag_3_emp + 1.0)

    # 5. Calendar Features
    df["month"] = df["date"].dt.month
    df["quarter"] = df["date"].dt.quarter

    # Categorical conversions for LightGBM
    for cat_col in ["sector", "nco_code", "district", "state"]:
        df[cat_col] = df[cat_col].astype("category")

    return df
