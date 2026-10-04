"""
KaushalPulse ML Module: Evaluation & Walk-Forward Backtesting
Compares Global LightGBM against Seasonal Naive Baseline without random leakage.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any

def calculate_metrics(actual: np.ndarray, predicted: np.ndarray) -> Dict[str, float]:
    actual = np.array(actual, dtype=float)
    predicted = np.array(predicted, dtype=float)
    
    mae = float(np.mean(np.abs(actual - predicted)))
    rmse = float(np.sqrt(np.mean((actual - predicted) ** 2)))
    sum_actual = float(np.sum(actual))
    wape = float(np.sum(np.abs(actual - predicted)) / sum_actual) if sum_actual > 0 else 0.0

    return {
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "wape": round(wape * 100, 2), # percentage
        "sample_count": len(actual)
    }

def run_seasonal_naive_benchmark(df_eval: pd.DataFrame) -> Dict[str, float]:
    """
    Seasonal Naive baseline predicts the current month using the same month from 12 months ago (lag_12).
    """
    valid = df_eval.dropna(subset=["job_demand", "lag_12"])
    actual = valid["job_demand"].values
    predicted = valid["lag_12"].values
    return calculate_metrics(actual, predicted)
