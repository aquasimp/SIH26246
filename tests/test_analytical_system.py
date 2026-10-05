"""
KaushalPulse Automated Test Suite
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Validates Canonical Data, Feature Engineering, LightGBM Inference,
PuLP Optimization, SIH Adapter, and FastAPI Endpoints.
"""

import os
import sys
import pytest
import pandas as pd
import numpy as np
from fastapi.testclient import TestClient

# Ensure root in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
from ml.data_loader import load_canonical_data
from ml.features import create_features, FEATURE_COLUMNS
from ml.predict import get_predictor
from ml.gap_engine import compute_staged_supply, calculate_gap_score_and_severity
from ml.seat_reallocation_solver import optimize_seat_reallocation
from ml.occupation_normalizer import normalize_occupation
from data.adapters.sih_dummy_adapter import SIHDummyDataAdapter

client = TestClient(app)

def test_canonical_dataset_integrity():
    df = load_canonical_data()
    assert len(df) >= 30000, f"Expected at least 30,000 rows, got {len(df)}"
    assert df["district"].nunique() == 16, "Expected 16 districts"
    assert df["state"].nunique() == 4, "Expected 4 states"
    assert df["nco_code"].nunique() >= 30, "Expected at least 30 trades"
    assert not df["job_demand"].isna().any(), "job_demand contains NaN"
    assert not df["training_seats"].isna().any(), "training_seats contains NaN"

def test_feature_engineering_no_leakage():
    df = load_canonical_data()
    df_feat = create_features(df.head(2000))
    for col in FEATURE_COLUMNS:
        assert col in df_feat.columns, f"Feature column {col} missing"
    # Ensure warm-up rows have expected lag behavior
    assert df_feat.iloc[0]["lag_1"] is np.nan or pd.isna(df_feat.iloc[0]["lag_1"])

def test_model_artifacts_and_inference():
    predictor = get_predictor()
    assert predictor.model is not None
    assert predictor.rmse > 0

    df = load_canonical_data()
    solar_gk = df[(df["district"] == "Gorakhpur") & (df["nco_code"] == "7126.0101")]
    preds = predictor.forecast_series(solar_gk, horizon_months=6)

    assert len(preds) == 6
    for p in preds:
        assert "month" in p
        assert p["forecast_demand"] > 0
        assert p["ci_lower"] <= p["forecast_demand"] <= p["ci_upper"]
        assert 50 <= p["confidence"] <= 100

def test_planted_demo_scenario():
    df = load_canonical_data()
    latest_date = df["date"].max()

    # 1. Gorakhpur Solar PV Installer should have severe shortage
    solar = df[(df["date"] == latest_date) & (df["district"] == "Gorakhpur") & (df["nco_code"] == "7126.0101")].iloc[0]
    solar_eff_supply = int(solar["available_supply"] * solar["placement_rate"])
    solar_score, solar_sev, _ = calculate_gap_score_and_severity(solar["job_demand"], solar_eff_supply)
    assert solar_score >= 75, f"Expected Solar PV Gap Score >= 75, got {solar_score}"
    assert solar_sev == "Severe Shortage"

    # 2. Gorakhpur Retail Sales Associate should have oversupply
    retail = df[(df["date"] == latest_date) & (df["district"] == "Gorakhpur") & (df["nco_code"] == "5223.0101")].iloc[0]
    retail_eff_supply = int(retail["available_supply"] * retail["placement_rate"])
    retail_score, retail_sev, _ = calculate_gap_score_and_severity(retail["job_demand"], retail_eff_supply)
    assert retail_score <= 40, f"Expected Retail Sales Gap Score <= 40, got {retail_score}"
    assert "Oversupply" in retail_sev

def test_pulp_seat_reallocation_solver():
    donors = [{"title": "Retail Sales Associate", "nco": "5223.0101", "excess_seats": 500}]
    targets = [{"title": "Solar PV Installer", "nco": "7126.0101", "deficit": 600, "gap_score": 84}]
    
    # 1. Default strict rule (gap ratio <= 0.05)
    res_strict = optimize_seat_reallocation("Gorakhpur", donors, targets, donor_safety_rule=0.05)
    assert res_strict["status"] == "Optimal"
    assert res_strict["total_seats_reallocated"] == 97
    assert res_strict["total_cost_inr"] == 97 * 6500.0

    # 2. Permissive rule (gap score <= 59, 218 seats)
    res = optimize_seat_reallocation("Gorakhpur", donors, targets, donor_safety_rule=0.1895)
    assert res["status"] == "Optimal"
    assert res["total_seats_reallocated"] == 218
    assert res["total_cost_inr"] == 218 * 6500.0

def test_sih_dummy_adapter_mapping():
    adapter = SIHDummyDataAdapter()
    test_df = pd.DataFrame({
        "time": ["2026-01-01", "2026-02-01"],
        "dist_name": ["Gorakhpur", "Lucknow"],
        "trade_role": ["Solar PV Installer", "Retail Sales"],
        "vacancies": [1200, 350],
        "seats_available": [180, 850]
    })
    review = adapter.review_schema_mapping(test_df)
    assert review["is_valid"] or len(review["mapped_mappings"]) >= 4
    col_maps = {m["source_column"]: m["canonical_column"] for m in review["mapped_mappings"]}
    assert "job_demand" in col_maps.values()
    assert "district" in col_maps.values()

def test_occupation_normalizer():
    res1 = normalize_occupation("Solar technician")
    assert res1["mapped_nco"] == "7126.0101"
    assert res1["confidence"] >= 0.90

    res2 = normalize_occupation("Store salesperson")
    assert res2["mapped_nco"] == "5223.0101"

def test_fastapi_endpoints():
    # 1. Overview
    r = client.get("/api/overview")
    assert r.status_code == 200
    assert r.json()["metrics"]["projected_demand"] > 0

    # 2. Demand
    r = client.get("/api/demand?nco=7126.0101&district=Gorakhpur")
    assert r.status_code == 200
    assert r.json()["demand_pressure_index"] > 0

    # 3. Supply
    r = client.get("/api/supply?nco=7126.0101&district=Gorakhpur")
    assert r.status_code == 200
    assert "staged_supply" in r.json()

    # 4. Forecasts
    r = client.get("/api/forecasts?nco=7126.0101&district=Gorakhpur&horizon=6M")
    assert r.status_code == 200
    assert len(r.json()["time_series"]) > 0

    # 5. Gaps
    r = client.get("/api/gaps")
    assert r.status_code == 200
    assert r.json()["count"] > 0

    # 6. Alerts
    r = client.get("/api/alerts")
    assert r.status_code == 200
    assert len(r.json()["alerts"]) >= 5

    # 7. Recommendations (Hardened default: post-transfer gap ratio <= 0.05 -> 97 seats)
    r = client.get("/api/recommendations?district=Gorakhpur")
    assert r.status_code == 200
    assert r.json()["recommendations"][0]["recommendedSeats"] == 97

    # 8. Scenarios POST
    r = client.post("/api/scenarios", json={
        "occupationNco": "7126.0101",
        "districtId": "gorakhpur",
        "seatShiftAmount": 500,
        "seatPercentAdjustment": 20.0,
        "demandShockPercent": 0.0,
        "newCentreActive": True,
        "mobilityFactorPercent": 10.0
    })
    assert r.status_code == 200
    sim = r.json()
    assert sim["simulatedGapScore"] < sim["baselineGapScore"]

    # 9. Model Health
    r = client.get("/api/model-health")
    assert r.status_code == 200
    assert r.json()["lightgbm_metrics"]["wape"] < 15.0
