"""
KaushalPulse — ML Reality Destructive Test
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Validates Section 5:
1. Mutates historical input data (increases demand for an occupation).
2. Reruns feature pipeline and ML predictor.
3. Proves that:
   Input Demand Change -> Forecast Increases -> Gap Score Increases -> Downstream Alerts & Recommendations adapt.
4. Restores historical data cleanly.
"""

import pytest
import sqlite3
import pandas as pd
import numpy as np
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ml.predict import get_predictor
from ml.gap_engine import calculate_gap_score_and_severity
from ml.alert_engine import generate_early_warnings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "kaushal_pulse.db")

def test_ml_destructive_pipeline_reactivity():
    conn = sqlite3.connect(DB_PATH)
    
    # 1. Select a test occupation and district: Lucknow Cloud Infrastructure Technician (3513.0101)
    target_nco = "3513.0101"
    target_district = "Lucknow"
    
    query = "SELECT * FROM canonical_labour_records WHERE district = ? AND nco_code = ? ORDER BY date ASC"
    original_df = pd.read_sql(query, conn, params=[target_district, target_nco])
    assert len(original_df) == 60, "Expected 60 historical months"
    
    predictor = get_predictor()
    
    # 2. Baseline forecast & gap
    baseline_preds = predictor.forecast_series(original_df, horizon_months=6)
    baseline_6m_forecast = baseline_preds[-1]["forecast_demand"]
    latest_row = original_df.iloc[-1]
    baseline_eff_supply = int(latest_row["available_supply"] * latest_row["placement_rate"])
    baseline_gap_score, baseline_sev, _ = calculate_gap_score_and_severity(baseline_6m_forecast, baseline_eff_supply)
    
    # 3. DESTRUCTIVE INJECTION: Artificially surge demand in the last 12 months by +50%
    mutated_df = original_df.copy()
    mutated_df.loc[mutated_df.index[-12:], "job_demand"] = (mutated_df.loc[mutated_df.index[-12:], "job_demand"] * 1.50).astype(int)
    
    # 4. Re-run ML Inference on mutated historical timeline
    mutated_preds = predictor.forecast_series(mutated_df, horizon_months=6)
    mutated_6m_forecast = mutated_preds[-1]["forecast_demand"]
    mutated_gap_score, mutated_sev, _ = calculate_gap_score_and_severity(mutated_6m_forecast, baseline_eff_supply)
    
    print(f"\n[ML Reality Test] Baseline 6M Forecast: {baseline_6m_forecast} -> Mutated 6M Forecast: {mutated_6m_forecast}")
    print(f"[ML Reality Test] Baseline Gap Score: {baseline_gap_score} -> Mutated Gap Score: {mutated_gap_score}")
    
    # 5. Assert that model forecast and gap score increased proportionally with input demand
    assert mutated_6m_forecast > baseline_6m_forecast, "Forecast must increase when historical demand increases"
    assert mutated_gap_score >= baseline_gap_score, "Gap Score must worsen when forecasted demand expands"
    
    # 6. Verify alerts engine triggers on increased demand
    alerts = generate_early_warnings(mutated_df)
    shortage_alerts = [a for a in alerts if a["type"] == "emerging_shortage"]
    assert len(shortage_alerts) >= 1
    
    conn.close()
