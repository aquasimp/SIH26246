"""
KaushalPulse — Scenario Studio & Policy Logic Sanity Test
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246 (PS 26242)

Validates Section 12 & 13:
- Tests +10%, +20%, -10%, -20% seat adjustments
- Tests +15%, -15% demand shocks
- Tests seat reallocation solver constraints
- Asserts policy sanity: no negative capacity, no counter-productive reallocations
"""

import pytest
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ml.gap_engine import compute_staged_supply, calculate_gap_score_and_severity
from ml.seat_reallocation_solver import optimize_seat_reallocation

def test_scenario_studio_parametric_adjustments():
    base_seats = 500
    base_demand = 800
    
    # Baseline
    staged_base = compute_staged_supply(base_seats, placement_rate=0.80)
    baseline_supply = staged_base["effective_employable_supply"]
    baseline_score, _, _ = calculate_gap_score_and_severity(base_demand, baseline_supply)
    
    # 1. +10% Seats
    seats_p10 = int(base_seats * 1.10)
    supply_p10 = compute_staged_supply(seats_p10, placement_rate=0.80)["effective_employable_supply"]
    score_p10, _, _ = calculate_gap_score_and_severity(base_demand, supply_p10)
    assert supply_p10 > baseline_supply, "+10% seats must produce more employable supply"
    assert score_p10 <= baseline_score, "+10% seats must decrease or maintain gap score"
    
    # 2. +20% Seats
    seats_p20 = int(base_seats * 1.20)
    supply_p20 = compute_staged_supply(seats_p20, placement_rate=0.80)["effective_employable_supply"]
    score_p20, _, _ = calculate_gap_score_and_severity(base_demand, supply_p20)
    assert supply_p20 > supply_p10, "+20% seats must produce more supply than +10%"
    assert score_p20 <= score_p10, "+20% seats must lower gap score further"
    
    # 3. -10% Seats
    seats_m10 = int(base_seats * 0.90)
    supply_m10 = compute_staged_supply(seats_m10, placement_rate=0.80)["effective_employable_supply"]
    score_m10, _, _ = calculate_gap_score_and_severity(base_demand, supply_m10)
    assert supply_m10 < baseline_supply, "-10% seats must produce less supply"
    assert score_m10 >= baseline_score, "-10% seats must increase or maintain gap score"
    
    # 4. -20% Seats
    seats_m20 = int(base_seats * 0.80)
    supply_m20 = compute_staged_supply(seats_m20, placement_rate=0.80)["effective_employable_supply"]
    score_m20, _, _ = calculate_gap_score_and_severity(base_demand, supply_m20)
    assert supply_m20 < supply_m10, "-20% seats must produce less supply than -10%"
    assert score_m20 >= score_m10, "-20% seats must increase gap score further"
    
    # 5. +15% Demand Shock
    demand_p15 = int(base_demand * 1.15)
    score_dp15, _, _ = calculate_gap_score_and_severity(demand_p15, baseline_supply)
    assert score_dp15 > baseline_score, "+15% demand shock must worsen shortage"
    
    # 6. -15% Demand Shock
    demand_m15 = int(base_demand * 0.85)
    score_dm15, _, _ = calculate_gap_score_and_severity(demand_m15, baseline_supply)
    assert score_dm15 < baseline_score, "-15% demand shock must relieve shortage"

def test_policy_logic_sanity_constraints():
    # Saturated donor: 850 seats, excess 500
    donors = [{"title": "Retail Sales Associate", "nco": "5223.0101", "excess_seats": 500}]
    # Shortage target: deficit 600
    targets = [{"title": "Solar PV Installer", "nco": "7126.0101", "deficit": 600, "gap_score": 84}]
    
    res = optimize_seat_reallocation("Gorakhpur", donors, targets, budget_inr=5000000)
    
    assert res["status"] == "Optimal"
    # Never reallocate more seats than donor excess
    assert res["total_seats_reallocated"] <= 500
    # Capacity must remain positive
    assert res["total_seats_reallocated"] > 0
    # Budget constraint strictly respected
    assert res["total_cost_inr"] <= 5000000
    
    # Verify no seat reallocation if budget is 0
    res_zero_budget = optimize_seat_reallocation("Gorakhpur", donors, targets, budget_inr=0)
    assert res_zero_budget["total_seats_reallocated"] == 0
