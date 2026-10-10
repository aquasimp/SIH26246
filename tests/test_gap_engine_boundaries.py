"""
KaushalPulse — Gap Engine Boundary Testing
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246 (PS 26242)

Rigorous boundary tests for all 5 classification states:
  >= 75: Severe Shortage
  60-74: Moderate Shortage
  40-59: Balanced
  25-39: Moderate Oversupply
  < 25:  Severe Oversupply
"""

import pytest
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ml.gap_engine import calculate_gap_score_and_severity

def test_gap_score_threshold_boundaries():
    # Helper to calculate from synthetic demand/supply combinations
    # raw_gap = demand - supply; gap_ratio = raw_gap / demand; gap_score = 50 + gap_ratio * 50
    # To get exact gap_score S:
    # (S - 50) / 50 = gap_ratio = (demand - supply) / demand
    # 1 - supply/demand = (S - 50) / 50 => supply = demand * (1 - (S - 50) / 50)
    
    demand = 1000
    
    # 1. Boundary 75 (Severe Shortage vs Moderate Shortage)
    # Target 74: supply = 1000 * (1 - 24/50) = 520
    score_74, sev_74, prob_74 = calculate_gap_score_and_severity(1000, 520)
    assert score_74 == 74
    assert sev_74 == "Moderate Shortage"

    # Target 75: supply = 1000 * (1 - 25/50) = 500
    score_75, sev_75, prob_75 = calculate_gap_score_and_severity(1000, 500)
    assert score_75 == 75
    assert sev_75 == "Severe Shortage"
    assert prob_75 >= 65

    # Target 76: supply = 1000 * (1 - 26/50) = 480
    score_76, sev_76, _ = calculate_gap_score_and_severity(1000, 480)
    assert score_76 == 76
    assert sev_76 == "Severe Shortage"

    # 2. Boundary 60 (Moderate Shortage vs Balanced)
    # Target 59: supply = 1000 * (1 - 9/50) = 820
    score_59, sev_59, _ = calculate_gap_score_and_severity(1000, 820)
    assert score_59 == 59
    assert sev_59 == "Balanced"

    # Target 60: supply = 1000 * (1 - 10/50) = 800
    score_60, sev_60, _ = calculate_gap_score_and_severity(1000, 800)
    assert score_60 == 60
    assert sev_60 == "Moderate Shortage"

    # Target 61: supply = 1000 * (1 - 11/50) = 780
    score_61, sev_61, _ = calculate_gap_score_and_severity(1000, 780)
    assert score_61 == 61
    assert sev_61 == "Moderate Shortage"

    # 3. Boundary 40 (Balanced vs Moderate Oversupply)
    # Target 39: supply = 1000 * (1 - (-11)/50) = 1220
    score_39, sev_39, _ = calculate_gap_score_and_severity(1000, 1220)
    assert score_39 == 39
    assert sev_39 == "Moderate Oversupply"

    # Target 40: supply = 1000 * (1 - (-10)/50) = 1200
    score_40, sev_40, _ = calculate_gap_score_and_severity(1000, 1200)
    assert score_40 == 40
    assert sev_40 == "Balanced"

    # Target 41: supply = 1000 * (1 - (-9)/50) = 1180
    score_41, sev_41, _ = calculate_gap_score_and_severity(1000, 1180)
    assert score_41 == 41
    assert sev_41 == "Balanced"

    # 4. Boundary 25 (Moderate Oversupply vs Severe Oversupply)
    # Target 24: supply = 1000 * (1 - (-26)/50) = 1520
    score_24, sev_24, prob_24 = calculate_gap_score_and_severity(1000, 1520)
    assert score_24 == 24
    assert sev_24 == "Severe Oversupply"
    assert prob_24 <= 12

    # Target 25: supply = 1000 * (1 - (-25)/50) = 1500
    score_25, sev_25, _ = calculate_gap_score_and_severity(1000, 1500)
    assert score_25 == 25
    assert sev_25 == "Moderate Oversupply"

    # Target 26: supply = 1000 * (1 - (-24)/50) = 1480
    score_26, sev_26, _ = calculate_gap_score_and_severity(1000, 1480)
    assert score_26 == 26
    assert sev_26 == "Moderate Oversupply"

    # 5. Extreme Boundary Protections (Zero demand, massive oversupply)
    score_zero, sev_zero, _ = calculate_gap_score_and_severity(0, 500)
    assert score_zero == 15
    assert sev_zero == "Severe Oversupply"
