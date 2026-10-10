"""
Automated Test Suite: Official SIH Dataset Ingestion, ML Training, & Dual-Mode API Verification
Problem Statement: PS 26246 (PS 26242) - MSDE
Verifies Section 33 and 34 of Prompt 4.
"""

import os
import pytest
import sqlite3
import pandas as pd
import numpy as np
from fastapi.testclient import TestClient

from backend.main import app, resolve_table_name
from data.adapters.sih_dummy_adapter import SIHDummyDataAdapter
from ml.train_demand_model import train_and_evaluate
from ml.occupation_normalizer import normalize_occupation

client = TestClient(app)

def test_sih_raw_dataset_exists_and_valid():
    csv_path = "data/raw/sih_official_dummy_dataset.csv"
    assert os.path.exists(csv_path), "Raw SIH dataset must exist"
    df = pd.read_csv(csv_path)
    assert len(df) >= 5000, f"Expected at least 5000 rows, found {len(df)}"
    assert "job_count" in df.columns, "Must have job_count column"
    assert "seat_count" in df.columns, "Must have seat_count column"
    assert "trade_name" in df.columns, "Must have trade_name column"
    assert "reporting_period" in df.columns, "Must have reporting_period column"

def test_sih_adapter_ingestion_and_normalization():
    adapter = SIHDummyDataAdapter()
    res = adapter.run_full_pipeline("data/raw/sih_official_dummy_dataset.csv")
    assert res["clean_records"] > 0, "Clean records must be greater than 0"
    assert res["occupation_mapping_accuracy"] >= 0.95, "Mapping accuracy must be >= 95%"
    assert res["dropped_records"] == 0, "No valid records should be dropped"

    # Verify SQLite database table
    conn = sqlite3.connect("data/kaushal_pulse.db")
    df_sih = pd.read_sql("SELECT * FROM sih_monthly_intelligence", conn)
    conn.close()
    assert len(df_sih) == res["clean_records"]
    assert "nco_code" in df_sih.columns
    assert "job_demand" in df_sih.columns
    assert "available_supply" in df_sih.columns
    assert (df_sih["data_mode"] == "sih_dummy").all()

def test_sih_occupation_normalizer_accuracy():
    test_cases = [
        ("Solar PV Installer (Suryamitra)", "7126.0101"),
        ("Retail Store Sales Associate", "5223.0101"),
        ("Electric Vehicle (EV) Service Technician", "7233.0102"),
        ("Indic Speech AI & Data Annotation Specialist", "2512.0101"),
        ("CNC Milling and Turning Operator", "8151.0101"),
        ("General Duty Healthcare Assistant (GDA)", "5321.0101"),
        ("Agricultural Drone Maintenance & Pilot", "7212.0101")
    ]
    for raw_title, expected_nco in test_cases:
        res = normalize_occupation(raw_title)
        assert res["mapped_nco"] == expected_nco, f"Failed mapping for {raw_title}: got {res['mapped_nco']}"
        assert res["confidence"] >= 0.90, f"Confidence too low for {raw_title}: {res['confidence']}"

def test_dual_mode_fastapi_endpoints():
    # 1. Overview dual mode
    res_sih = client.get("/api/overview?mode=sih")
    assert res_sih.status_code == 200
    data_sih = res_sih.json()
    assert data_sih["data_mode"] == "sih_dummy"
    assert data_sih["data_source"] == "Official SIH Evaluation Dataset"

    res_syn = client.get("/api/overview?mode=synthetic")
    assert res_syn.status_code == 200
    data_syn = res_syn.json()
    assert data_syn["data_mode"] == "synthetic"
    assert data_syn["data_source"] == "Synthetic Benchmark Dataset"
    assert data_sih["metrics"]["projected_demand"] != data_syn["metrics"]["projected_demand"]

    # 2. Demand dual mode
    res_d_sih = client.get("/api/demand?nco=7126.0101&district=Gorakhpur&mode=sih")
    assert res_d_sih.status_code == 200
    assert res_d_sih.json()["data_mode"] == "sih_dummy"

    # 3. Supply dual mode
    res_s_sih = client.get("/api/supply?nco=7126.0101&district=Gorakhpur&mode=sih")
    assert res_s_sih.status_code == 200
    assert res_s_sih.json()["data_mode"] == "sih_dummy"

    # 4. Gaps dual mode
    res_g_sih = client.get("/api/gaps?district=Gorakhpur&mode=sih")
    assert res_g_sih.status_code == 200
    assert res_g_sih.json()["data_mode"] == "sih_dummy"

    # 5. Alerts dual mode
    res_a_sih = client.get("/api/alerts?mode=sih")
    assert res_a_sih.status_code == 200
    assert res_a_sih.json()["data_mode"] == "sih_dummy"

    # 6. Model health dual mode
    res_h_sih = client.get("/api/model-health?mode=sih")
    assert res_h_sih.status_code == 200
    h_sih = res_h_sih.json()
    assert h_sih["total_observations"] == 8704
    assert h_sih["lightgbm_metrics"]["wape"] <= 7.5
    assert "horizons" in h_sih
    assert "3M" in h_sih["horizons"] and "6M" in h_sih["horizons"] and "12M" in h_sih["horizons"]

def test_sih_scenario_simulation():
    payload = {
        "occupationNco": "7126.0101",
        "districtId": "Gorakhpur",
        "seatShiftAmount": 500,
        "seatPercentAdjustment": 10.0,
        "demandShockPercent": 0.0,
        "newCentreActive": True,
        "mobilityFactorPercent": 10.0
    }
    res = client.post("/api/scenarios?mode=sih", json=payload)
    assert res.status_code == 200
    body = res.json()
    assert body["data_mode"] == "sih_dummy"
    assert body["simulatedSupply"] > body["baselineSupply"]
    assert body["gapReductionPercent"] > 0
