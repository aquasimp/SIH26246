"""
KaushalPulse Test Suite: Feature Leakage Audit
Validates that NO contemporaneous (same-period t) metrics are used in LightGBM features.
Ensures zero future data leakage across all feature definitions and transformations.
"""

import pytest
import pandas as pd
import numpy as np
import datetime
from ml.features import create_features, FEATURE_COLUMNS

FORBIDDEN_CONTEMPORANEOUS_NAMES = {
    "job_demand",
    "employer_count",
    "training_seats",
    "enrolled",
    "certified",
    "available_supply",
    "placement_rate",
    "effective_supply",
    "wage_signal",
    "industry_signal"
}

ALLOWED_STATIC_OR_CALENDAR = {
    "month", "quarter", "sector", "nco_code", "district", "state"
}

def test_feature_columns_contain_no_contemporaneous_metrics():
    """
    Every metric in FEATURE_COLUMNS must either be:
    1. A calendar feature (month, quarter)
    2. A static identifier (sector, nco_code, district, state)
    3. Explicitly lagged (lag_1, lag_3, lag_12, rolling_mean, etc.)
    NO unlagged contemporaneous metric is allowed.
    """
    for col in FEATURE_COLUMNS:
        if col in ALLOWED_STATIC_OR_CALENDAR:
            continue
        
        # Check against raw forbidden column names
        assert col not in FORBIDDEN_CONTEMPORANEOUS_NAMES, (
            f"LEAKAGE DETECTED: Feature '{col}' is a contemporaneous metric at time t without a lag!"
        )

        # Ensure that any demand, seat, supply, wage, or employer feature has lag >= 1
        is_lagged = col.startswith("lag_") or col.startswith("rolling_") or "growth_" in col
        assert is_lagged, f"LEAKAGE RISK: Feature '{col}' must be an explicit lag or rolling window over past data."

def test_contemporaneous_invariance_leakage_proof():
    """
    Destructive proof:
    Mutating contemporaneous values at time t (job_demand, training_seats, effective_supply, wage, employers)
    MUST NOT change any feature values at row t.
    """
    dates = pd.date_range("2023-01-01", periods=20, freq="MS")
    records = []
    for d in dates:
        records.append({
            "date": d,
            "district": "Gorakhpur",
            "state": "Uttar Pradesh",
            "sector": "Green Jobs",
            "occupation": "Solar PV Installer",
            "nco_code": "7126.0101",
            "qualification": "QP-01",
            "nsqf_level": 4,
            "job_demand": 500 + int(np.sin(len(records)) * 50),
            "employer_count": 30,
            "training_seats": 200,
            "enrolled": 180,
            "certified": 160,
            "available_supply": 140,
            "placement_rate": 0.85,
            "wage_signal": 22000,
            "industry_signal": 1.2,
            "source": "test",
            "data_mode": "test",
            "confidence": 0.95
        })

    df_base = pd.DataFrame(records)
    feat_base = create_features(df_base)

    # Now make a mutated copy where row t=15 has drastically different contemporaneous values
    df_mutated = pd.DataFrame(records)
    target_idx = 15
    df_mutated.loc[target_idx, "job_demand"] = 99999
    df_mutated.loc[target_idx, "training_seats"] = 88888
    df_mutated.loc[target_idx, "available_supply"] = 77777
    df_mutated.loc[target_idx, "placement_rate"] = 0.12
    df_mutated.loc[target_idx, "employer_count"] = 55555
    df_mutated.loc[target_idx, "wage_signal"] = 44444
    df_mutated.loc[target_idx, "industry_signal"] = 9.99

    feat_mutated = create_features(df_mutated)

    # Check that for row target_idx, ALL features in FEATURE_COLUMNS are IDENTICAL
    for col in FEATURE_COLUMNS:
        val_base = feat_base.loc[target_idx, col]
        val_mut = feat_mutated.loc[target_idx, col]
        if pd.isna(val_base) and pd.isna(val_mut):
            continue
        assert val_base == val_mut, (
            f"LEAKAGE CONFIRMED: Feature '{col}' at time t changed when contemporaneous t values were mutated! "
            f"Base: {val_base}, Mutated: {val_mut}"
        )
