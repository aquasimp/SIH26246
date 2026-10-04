"""
KaushalPulse ML Module: Staged Supply & Skill Gap Engine
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Computes staged workforce conversion and deterministic Gap Score classification.
"""

from typing import Dict, Any, Tuple
import numpy as np

def compute_staged_supply(
    training_seats: int,
    seat_utilization: float = 0.92,
    pass_rate: float = 0.88,
    participation_rate: float = 0.82,
    placement_rate: float = 0.78,
    mobility_factor: float = 0.0
) -> Dict[str, Any]:
    """
    Computes staged labour supply:
    Seats -> Enrolled -> Certified -> Available Labour -> Effective Employable Supply
    """
    enrolled = int(round(training_seats * seat_utilization))
    certified = int(round(enrolled * pass_rate))
    available = int(round(certified * participation_rate))
    base_effective = int(round(available * placement_rate))
    effective_employable = int(round(base_effective * (1.0 + mobility_factor)))

    return {
        "training_seats": training_seats,
        "enrolled": enrolled,
        "certified": certified,
        "available_labour": available,
        "effective_employable_supply": effective_employable,
        "seat_utilization_rate": round(seat_utilization, 2),
        "certification_rate": round(pass_rate, 2),
        "labor_participation_rate": round(participation_rate, 2),
        "employability_factor": round(placement_rate, 2)
    }

def calculate_gap_score_and_severity(
    projected_demand: int,
    effective_supply: int,
    persistence_factor: float = 0.82
) -> Tuple[int, str, int]:
    """
    Computes normalized Gap Score (0 - 100), Shortage Probability (%), and Classification.
    Thresholds:
      >= 75: Severe Shortage
      60-74: Moderate Shortage
      40-59: Balanced
      25-39: Moderate Oversupply
      < 25:  Severe Oversupply
    """
    if projected_demand <= 0:
        return 15, "Severe Oversupply", 5

    raw_gap = projected_demand - effective_supply
    gap_ratio = raw_gap / float(projected_demand)

    # 50 is equilibrium
    gap_score = int(np.clip(round(50.0 + (gap_ratio * 50.0)), 10, 98))

    # Shortage probability
    if gap_score >= 75:
        prob = int(np.clip(round(gap_score * 0.85 + (persistence_factor * 10)), 65, 95))
        severity = "Severe Shortage"
    elif gap_score >= 60:
        prob = int(np.clip(round(gap_score * 0.80), 50, 68))
        severity = "Moderate Shortage"
    elif gap_score >= 40:
        prob = int(np.clip(round(gap_score * 0.50), 20, 45))
        severity = "Balanced"
    elif gap_score >= 25:
        prob = int(np.clip(round(gap_score * 0.40), 10, 22))
        severity = "Moderate Oversupply"
    else:
        prob = int(np.clip(round(gap_score * 0.30), 5, 12))
        severity = "Severe Oversupply"

    return gap_score, severity, prob
