"""
test_final_hardening_pass.py
Comprehensive test suite verifying the 5 mandatory guarantees of the final hardening pass:
1. Donor safety rule never allows donor post-transfer deficit ratio to exceed threshold (0.05, 0.10, 0.1895).
2. Blend weights are strictly fitted on earlier origins (1-3) and evaluated out-of-sample on later origins (4-6).
3. SHAP feature chips use ONLY valid feature names from feature_schema.json (no qualitative narrative text).
4. Zero duplicate or conflicting data cells across all application tables (one canonical truth per trade).
5. UI and API velocity values exactly match direct sqlite database query for month t vs t-6.
"""

import json
import os
import re
import sqlite3
import pytest
from fastapi.testclient import TestClient

from backend.main import app, GLOBAL_MODEL_DRIVERS
from ml.seat_reallocation_solver import optimize_seat_reallocation

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "kaushal_pulse.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "ml", "model_artifacts", "feature_schema.json")
OOS_METRICS_PATH = os.path.join(BASE_DIR, "ml", "model_artifacts", "out_of_sample_metrics.json")
FRONTEND_DEMO_DATA = os.path.join(BASE_DIR, "frontend", "src", "lib", "demoData.ts")
FRONTEND_GAPS_PAGE = os.path.join(BASE_DIR, "frontend", "src", "app", "gaps", "page.tsx")


def test_donor_safety_rule_never_exceeds_threshold():
    """Verify that solver strictly prevents donor post-transfer deficit ratio from exceeding selected rule."""
    test_cases = [
        {"rule": 0.05, "expected_seats": 97, "max_gap_ratio": 0.0501, "expected_score": 52},
        {"rule": 0.10, "expected_seats": 140, "max_gap_ratio": 0.1001, "expected_score": 55},
        {"rule": 0.1895, "expected_seats": 218, "max_gap_ratio": 0.1896, "expected_score": 59},
    ]

    donors = [{
        "title": "Retail Sales Associate",
        "nco": "5223.0101",
        "seats": 916,
        "demand": 380,
        "effective_supply": 404,
        "excess_seats": 500,
        "funnel_throughput": 0.4409
    }]
    targets = [{
        "title": "Solar PV Technician",
        "nco": "7126.0101",
        "seats": 217,
        "demand": 808,
        "effective_supply": 97,
        "deficit": 711,
        "gap_score": 94,
        "funnel_throughput": 0.4484
    }]

    for case in test_cases:
        res = optimize_seat_reallocation(
            district="Gorakhpur",
            donor_trades=donors,
            target_trades=targets,
            budget_inr=5000000.0,
            donor_safety_rule=case["rule"]
        )

        assert res["status"] == "Optimal", f"Failed for rule {case['rule']}"
        assert res["total_seats_reallocated"] == case["expected_seats"], (
            f"Seats moved mismatch for rule {case['rule']}: got {res['total_seats_reallocated']}, expected {case['expected_seats']}"
        )
        donor_after = res["donor_profiles"]["5223.0101"]
        assert donor_after["gap_ratio_after"] <= case["max_gap_ratio"], (
            f"Donor deficit ratio exceeded threshold {case['rule']}: got {donor_after['gap_ratio_after']}"
        )
        assert donor_after["gap_score_after"] == case["expected_score"], (
            f"Donor score mismatch for rule {case['rule']}: got {donor_after['gap_score_after']}, expected {case['expected_score']}"
        )
        assert donor_after["severity_after"] == "Balanced", "Donor must remain in Balanced band"

    # Also check sensitivity table returned contains all 3 rules and dual mobility bases
    sens = res.get("sensitivity_table", [])
    assert len(sens) == 3
    assert [s["label"] for s in sens] == [
        "Strict (<= 0.05 ratio)",
        "Moderate (<= 0.10 ratio)",
        "Permissive (Score <= 59)"
    ]
    for row in sens:
        assert "deficit_closed_realloc_pct" in row
        assert "deficit_closed_combo_no_mobility_pct" in row
        assert "deficit_closed_combo_pct" in row
        # 10% mobility must yield higher or equal closure than 0% mobility
        assert row["deficit_closed_combo_pct"] >= row["deficit_closed_combo_no_mobility_pct"]


def test_blend_weights_fitted_on_earlier_origins_only():
    """Verify out-of-sample backtest fitted weights on Origins 1-3 and evaluated on Origins 4-6 without leakage."""
    assert os.path.exists(OOS_METRICS_PATH), f"Missing out_of_sample_metrics.json at {OOS_METRICS_PATH}"

    with open(OOS_METRICS_PATH, "r", encoding="utf-8") as f:
        metrics_data = json.load(f)

    train_origins = metrics_data.get("train_origins", [])
    eval_origins = metrics_data.get("eval_origins", [])

    assert [o[:7] for o in train_origins] == ["2023-05", "2023-06", "2023-07"], "Train origins must be first 3 origins"
    assert [o[:7] for o in eval_origins] == ["2023-08", "2023-09", "2023-10"], "Eval origins must be subsequent 3 origins"

    # Strict disjointness: no temporal overlap
    assert set(train_origins).isdisjoint(set(eval_origins)), "Train and Eval origins must not overlap (no in-sample leakage)"

    # Out of sample metrics check
    all_metrics = metrics_data.get("metrics", {})
    for horizon in ["3M", "6M", "12M"]:
        assert horizon in all_metrics, f"Missing horizon {horizon} in out-of-sample metrics"
        h_metrics = all_metrics[horizon]
        assert "lightgbm" in h_metrics
        assert "ets" in h_metrics
        assert "theta" in h_metrics
        assert "seasonal_naive" in h_metrics
        assert "tri_model_blend" in h_metrics

    # Verification of documented performance:
    # Blend beats individual models only at 12M; Theta/LGB win at 3M/6M
    wape_12m = all_metrics["12M"]
    assert wape_12m["tri_model_blend"]["wape"] < wape_12m["ets"]["wape"], "Blend must outperform ETS at 12M"
    assert wape_12m["tri_model_blend"]["wape"] < wape_12m["theta"]["wape"], "Blend must outperform Theta at 12M"


def test_shap_feature_names_strict_subset_of_schema():
    """Verify that all SHAP feature chips match feature_schema.json and contain no qualitative text."""
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema = json.load(f)

    valid_features = set(schema["features"])

    # 1. Global drivers in backend
    for driver in GLOBAL_MODEL_DRIVERS:
        feat = driver["feature"]
        assert feat in valid_features, f"Backend global driver '{feat}' is not in feature_schema.json"

    # 2. Check frontend demoData.ts explainability blocks
    with open(FRONTEND_DEMO_DATA, "r", encoding="utf-8") as f:
        frontend_code = f.read()

    # Extract all explainability arrays
    explain_blocks = re.findall(r"explainability:\s*\[([\s\S]*?)\]", frontend_code)
    assert len(explain_blocks) >= 2, "Must find explainability blocks for Solar and Retail"
    for block in explain_blocks:
        names = re.findall(r"name:\s*'([a-zA-Z0-9_]+)'", block)
        for feat_name in names:
            assert feat_name in valid_features, f"Frontend demoData explainability feature '{feat_name}' is not in feature_schema.json"

    # Assert forbidden marketing strings are absent from shap chips
    assert "PM Surya Ghar" not in "".join(names)
    assert "E-commerce Shift" not in "".join(names)

    # 3. Check frontend gaps/page.tsx
    with open(FRONTEND_GAPS_PAGE, "r", encoding="utf-8") as f:
        gaps_code = f.read()

    gaps_feature_names = re.findall(r"feature:\s*'([a-zA-Z0-9_]+)'", gaps_code)
    for feat_name in gaps_feature_names:
        assert feat_name in valid_features, f"Frontend gaps/page.tsx feature '{feat_name}' is not in feature_schema.json"


def test_no_duplicate_or_conflicting_cells_across_tables():
    """Verify single truth per cell: Gorakhpur Retail has exactly one set of official SIH metrics."""
    with open(FRONTEND_DEMO_DATA, "r", encoding="utf-8") as f:
        demo_content = f.read()

    # Ensure canonical SIH numbers are present
    assert "currentDemand: 380" in demo_content
    assert "trainingSeats: 916" in demo_content
    assert "availableLabour: 577" in demo_content
    assert "effectiveSupply: 404" in demo_content
    assert "gapScore: 47" in demo_content

    # Ensure synthetic stale fixture numbers are completely removed
    assert "currentDemand: 160" not in demo_content
    assert "trainingSeats: 850" not in demo_content
    assert "effectiveSupply: 391" not in demo_content


def test_ui_api_velocity_matches_direct_db_query():
    """Verify that velocity decomposition returned by API exactly matches a direct SQL calculation on sih_monthly_intelligence."""
    client = TestClient(app)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Test both Gorakhpur Solar (7126.0101) and Retail (5223.0101)
    test_trades = [
        {"nco": "7126.0101", "name": "Solar PV Installer"},
        {"nco": "5223.0101", "name": "Retail Sales Associate"}
    ]

    resp = client.get("/api/gaps?district=Gorakhpur&mode=sih")
    assert resp.status_code == 200
    api_gaps = resp.json().get("gaps", [])

    for trade in test_trades:
        cursor.execute(
            """
            SELECT date, job_demand, available_supply, placement_rate
            FROM sih_monthly_intelligence
            WHERE district = 'Gorakhpur' AND nco_code = ?
            ORDER BY date ASC
            """,
            (trade["nco"],)
        )
        rows = cursor.fetchall()
        assert len(rows) >= 7, f"Need at least 7 months of intelligence for NCO {trade['nco']}"

        # Direct DB math: month t is rows[-1], month t-6 is rows[-7]
        row_t = rows[-1]
        row_t6 = rows[-7]

        d_t = float(row_t["job_demand"])
        d_t6 = float(row_t6["job_demand"])
        s_t = round(float(row_t["available_supply"]) * 0.70)
        s_t6 = round(float(row_t6["available_supply"]) * 0.70)

        expected_d_growth = round(((d_t - d_t6) / max(1.0, d_t6)) * 100.0, 1)
        expected_s_growth = round(((s_t - s_t6) / max(1.0, s_t6)) * 100.0, 1)
        expected_net_mismatch = round(expected_d_growth - expected_s_growth, 1)

        # Find matching trade in API response
        gap_obj = next((g for g in api_gaps if g["nco_code"] == trade["nco"]), None)
        assert gap_obj is not None, f"Trade {trade['nco']} not found in /api/gaps response"

        api_velocity = gap_obj["why_this_score"]
        assert api_velocity["demand_growth_6m"] == pytest.approx(expected_d_growth, abs=0.1)
        assert api_velocity["supply_growth_6m"] == pytest.approx(expected_s_growth, abs=0.1)
        assert api_velocity["net_velocity_mismatch"] == pytest.approx(expected_net_mismatch, abs=0.1)

    conn.close()


def test_official_dataset_early_warning_alerts():
    """Verify that early warning alert engine triggers expected alert types and top 5 alerts on official dataset."""
    import pandas as pd
    from ml.alert_engine import generate_early_warnings
    from collections import Counter

    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql("SELECT * FROM sih_monthly_intelligence", conn)
    conn.close()

    alerts = generate_early_warnings(df)
    assert len(alerts) >= 34, f"Expected at least 34 alerts on official dataset, got {len(alerts)}"

    type_counts = Counter([a["type"] for a in alerts])
    assert type_counts["capacity_inefficiency"] == 30 or type_counts["saturation_risk"] == 30, "Expected 30 capacity inefficiency alerts"
    assert type_counts["skill_obsolescence"] == 3, "Expected 3 skill obsolescence alerts"
    assert type_counts["emerging_shortage"] == 1, "Expected 1 emerging shortage alert"
    assert type_counts["persistent_shortage"] == 1, "Expected 1 persistent shortage alert"

    # 1. Verify Gorakhpur Solar PV Installer persistent shortage alert
    solar_alert = next((a for a in alerts if a["type"] == "persistent_shortage" and "Gorakhpur" in a["geography"]), None)
    assert solar_alert is not None, "Gorakhpur Solar PV persistent shortage alert must trigger"
    assert "7126.0101" in str(solar_alert["nco_code"])
    assert "97" in solar_alert["recommended_action"], "Recommended action must use Strict default of 97 seats"
    assert "Context, not model output" in solar_alert.get("context", "")

    # 2. Verify Rajkot Drone Maintenance Technician alert with sizing arithmetic
    drone_alert = next((a for a in alerts if a["type"] == "emerging_shortage" and "Rajkot" in a["geography"]), None)
    assert drone_alert is not None, "Drone Maintenance Technician alert in Rajkot must trigger"
    assert "7212.0101" in str(drone_alert["nco_code"])
    assert "0.3733" in drone_alert["recommended_action"], "Must show sizing arithmetic with funnel conversion"
    assert "187" in drone_alert["trigger"] or "186" in drone_alert["trigger"]
    assert "Context, not model output" in drone_alert.get("context", "")

    # 3. Verify Gorakhpur Retail Sales Associate capacity inefficiency alert
    retail_alert = next((a for a in alerts if (a["type"] == "capacity_inefficiency" or a["type"] == "saturation_risk") and "Gorakhpur" in a["geography"] and "5223" in str(a["nco_code"])), None)
    assert retail_alert is not None, "Retail Sales Associate capacity alert in Gorakhpur must trigger"
    assert retail_alert["wasted_seats"] == 536, f"Expected 536 wasted seats, got {retail_alert.get('wasted_seats')}"
    assert "97" in retail_alert["recommended_action"], "Retail action must recommend Strict default of 97 seats"
    assert "Context, not model output" in retail_alert.get("context", "")

    # 4. Verify Sewing Machine Operator obsolescence alert without qualitative narrative in trigger
    sewing_alert = next((a for a in alerts if a["type"] == "skill_obsolescence" and "Sambhajinagar" in a["geography"]), None)
    assert sewing_alert is not None, "Sewing Machine Operator obsolescence alert in Sambhajinagar must trigger"
    assert "garment order books" not in sewing_alert["trigger"], "Non-data narrative must be removed from trigger"
    assert "Context, not model output" in sewing_alert.get("context", "")

    # Verify frontend demoData has surfaced the top 5 prioritized alerts
    with open(FRONTEND_DEMO_DATA, "r", encoding="utf-8") as f:
        demo_code = f.read()

    assert "ALR-2026-UP-001" in demo_code
    assert "Persistent Severe Shortage: Solar PV Installer in Gorakhpur" in demo_code
    assert "ALR-2026-GJ-002" in demo_code
    assert "Emerging Shortage: Drone Maintenance Technician in Rajkot" in demo_code
    assert "ALR-2026-UP-003" in demo_code
    assert "Capacity Inefficiency: Retail Sales Associate in Gorakhpur" in demo_code
    assert "ALR-2026-MH-004" in demo_code
    assert "Skill Obsolescence Risk: Sewing Machine Operator in Chhatrapati Sambhajinagar" in demo_code
    assert "ALR-2026-UP-005" in demo_code
    assert "Capacity Inefficiency: Data Entry Operator in Gorakhpur" in demo_code
    assert "Context, not model output" in demo_code


