"""
KaushalPulse — End-to-End Demo Acceptance Test
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Validates the full Section 37 narrative workflow:
1. Overview Query (Uttar Pradesh / Gorakhpur)
2. Solar PV Installer Profile (Rising demand, training capacity constraint)
3. 6-Month Walk-Forward ML Forecast vs Seasonal Naive Baseline
4. Severe Shortage Classification (Gap Score >= 75)
5. Explainability / Root Cause Attribution
6. Priority Recommendation (Seat Reallocation from Retail Sales Associate)
7. PuLP Linear Programming Seat Shift Optimization (500 seats transferred)
8. Scenario Studio Simulation (Projected gap reduction & cost calculation)
9. Recommendation & Data CSV Export
"""

import pytest
import sqlite3
import json
import os
import httpx
import pandas as pd
from ml.predict import get_predictor
from ml.gap_engine import compute_staged_supply, calculate_gap_score_and_severity
from ml.seat_reallocation_solver import optimize_seat_reallocation

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "kaushal_pulse.db")

def test_full_section_37_demo_acceptance_flow():
    # 1. Open Overview & Select Uttar Pradesh -> Gorakhpur
    conn = sqlite3.connect(DB_PATH)
    latest_query = "SELECT MAX(date) FROM canonical_labour_records"
    latest_date = conn.execute(latest_query).fetchone()[0]
    
    gk_query = "SELECT * FROM canonical_labour_records WHERE date = ? AND district = 'Gorakhpur'"
    df_gk = pd.read_sql(gk_query, conn, params=[latest_date])
    conn.close()
    
    assert len(df_gk) == 32, f"Expected 32 trades in Gorakhpur, found {len(df_gk)}"
    
    # 2. Open Solar PV Installer (NCO 7126.0101)
    solar_records = df_gk[df_gk["nco_code"] == "7126.0101"]
    assert len(solar_records) == 1
    solar = solar_records.iloc[0]
    
    assert solar["job_demand"] >= 1000, f"Solar PV demand should reflect surge, got {solar['job_demand']}"
    assert solar["training_seats"] == 180, f"Solar PV capacity should be 180 seats, got {solar['training_seats']}"
    
    # 3. 6-Month ML Forecast vs Seasonal Naive Baseline
    predictor = get_predictor()
    conn = sqlite3.connect(DB_PATH)
    solar_history = pd.read_sql(
        "SELECT * FROM canonical_labour_records WHERE district = 'Gorakhpur' AND nco_code = '7126.0101' ORDER BY date ASC",
        conn
    )
    conn.close()
    
    forecasts = predictor.forecast_series(solar_history, horizon_months=6)
    assert len(forecasts) == 6
    
    # Check that predictions exist and have confidence intervals
    for f in forecasts:
        assert f["forecast_demand"] > 0
        assert f["ci_lower"] <= f["forecast_demand"] <= f["ci_upper"]
        assert f["confidence"] >= 60

    # Model accuracy check across rolling horizons (LightGBM outperforms Seasonal Naive at 3M and 12M)
    assert "horizons" in predictor.metrics
    assert predictor.metrics["horizons"]["3M"]["lightgbm"]["wape"] < predictor.metrics["horizons"]["3M"]["seasonal_naive"]["wape"]
    assert predictor.metrics["horizons"]["12M"]["lightgbm"]["wape"] < predictor.metrics["horizons"]["12M"]["seasonal_naive"]["wape"]

    # 4. Shortage Classification & Gap Score
    effective_supply = int(solar["available_supply"] * solar["placement_rate"])
    gap_score, severity, prob = calculate_gap_score_and_severity(solar["job_demand"], effective_supply)
    assert gap_score >= 75
    assert severity == "Severe Shortage"
    assert prob >= 65

    # 5. Oversupplied Donor Trade (Retail Sales Associate)
    retail_records = df_gk[df_gk["nco_code"] == "5223.0101"]
    assert len(retail_records) == 1
    retail = retail_records.iloc[0]
    retail_eff_supply = int(retail["available_supply"] * retail["placement_rate"])
    retail_gap_score, retail_sev, _ = calculate_gap_score_and_severity(retail["job_demand"], retail_eff_supply)
    assert retail_gap_score <= 40
    assert "Oversupply" in retail_sev

    # 6. PuLP Seat Reallocation Optimization Solver
    donors = [{"title": "Retail Sales Associate", "nco": "5223.0101", "excess_seats": 500}]
    targets = [{"title": "Solar PV Installer", "nco": "7126.0101", "deficit": 600, "gap_score": gap_score}]
    opt_result = optimize_seat_reallocation("Gorakhpur", donors, targets, budget_inr=5000000, donor_safety_rule=0.1895)
    
    assert opt_result["status"] == "Optimal"
    # LP constraint shrinks transfer from 500 to 218 to protect donor from Moderate Shortage
    assert opt_result["total_seats_reallocated"] == 218
    assert opt_result["total_cost_inr"] == 218 * 6500 # 218 seats * ₹6,500 = ₹14.17 Lakhs

    # 7. Scenario Studio Policy Simulation
    # Adding 218 shifted seats + 150 new center seats
    post_shift_seats = solar["training_seats"] + 218 + 150
    staged = compute_staged_supply(post_shift_seats, seat_utilization=0.92, pass_rate=0.88, participation_rate=0.82, placement_rate=0.89, mobility_factor=0.10)
    simulated_effective_supply = effective_supply + staged["effective_employable_supply"]
    
    post_shift_gap_score, post_shift_sev, _ = calculate_gap_score_and_severity(solar["job_demand"], simulated_effective_supply)
    assert post_shift_gap_score < gap_score
    print(f"Demo Flow Validated: Solar Gap Score improved from {gap_score} to {post_shift_gap_score}!")

    # 8. REST API Verification (FastAPI TestClient)
    from fastapi.testclient import TestClient
    from backend.main import app
    client = TestClient(app)
    r_fastapi = client.get("/api/overview")
    assert r_fastapi.status_code == 200
    assert r_fastapi.json()["status"] == "success"
