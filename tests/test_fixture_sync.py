"""
Test Fixture Sync
Verifies that frontend demoData fixtures exactly match engine output and database records.
"""

import sqlite3
import json
import os
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "kaushal_pulse.db")
FIXTURES_JSON = os.path.join(BASE_DIR, "data", "engine_export_fixtures.json")
DEMO_DATA_TS = os.path.join(BASE_DIR, "frontend", "src", "lib", "demoData.ts")


def test_fixtures_match_database():
    assert os.path.exists(FIXTURES_JSON), "Fixtures JSON file must exist"
    with open(FIXTURES_JSON, "r", encoding="utf-8") as f:
        fixtures = json.load(f)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. District count and names
    db_districts = sorted([r[0] for r in cursor.execute("SELECT DISTINCT district FROM sih_monthly_intelligence").fetchall()])
    fixture_districts = sorted([d["name"] for d in fixtures["districts"]])
    assert fixture_districts == db_districts, f"Districts mismatch: {fixture_districts} vs {db_districts}"
    assert len(fixture_districts) == 16, "Must have exactly 16 districts"

    # 2. State count and names
    db_states = sorted([r[0] for r in cursor.execute("SELECT DISTINCT state FROM sih_monthly_intelligence").fetchall()])
    fixture_states = sorted(fixtures["states"])
    assert fixture_states == db_states, f"States mismatch: {fixture_states} vs {db_states}"
    assert len(fixture_states) == 5, "Must have exactly 5 states"

    # 3. Trades count and NCO codes
    db_ncos = sorted([r[0] for r in cursor.execute("SELECT DISTINCT nco_code FROM sih_monthly_intelligence").fetchall()])
    fixture_ncos = sorted([t["ncoCode"] for t in fixtures["occupations"]])
    assert fixture_ncos == db_ncos, f"NCO codes mismatch: {fixture_ncos} vs {db_ncos}"
    assert len(fixture_ncos) == 16, "Must have exactly 16 trades"

    # 4. Gorakhpur Solar PV (7126.0101) values
    cursor.execute("SELECT job_demand, available_supply, training_seats FROM sih_monthly_intelligence WHERE district='Gorakhpur' AND nco_code='7126.0101' ORDER BY date DESC LIMIT 1")
    row = cursor.fetchone()
    solar_trade = next(t for t in fixtures["occupations"] if t["ncoCode"] == "7126.0101")
    assert solar_trade["currentDemand"] == row[0] == 808
    assert solar_trade["effectiveSupply"] == int(round(row[1] * 0.70)) == 97
    assert solar_trade["stagedSupply"]["trainingSeats"] == row[2] == 217

    # 5. Gorakhpur Retail Sales (5223.0101) values
    cursor.execute("SELECT job_demand, available_supply, training_seats FROM sih_monthly_intelligence WHERE district='Gorakhpur' AND nco_code='5223.0101' ORDER BY date DESC LIMIT 1")
    row_retail = cursor.fetchone()
    retail_trade = next(t for t in fixtures["occupations"] if t["ncoCode"] == "5223.0101")
    assert retail_trade["currentDemand"] == row_retail[0] == 380
    assert retail_trade["stagedSupply"]["trainingSeats"] == row_retail[2] == 916

    conn.close()


def test_demo_data_ts_contains_metadata():
    with open(DEMO_DATA_TS, "r", encoding="utf-8") as f:
        content = f.read()

    assert "Precomputed from run RUN-SIH-001" in content
    assert "Oct 2024" in content
    assert "SIH dummy dataset" in content
    assert "7126.0101" in content
    assert "5223.0101" in content
    assert "Gorakhpur" in content
    assert "Coimbatore" in content
    assert "Tamil Nadu" in content
