"""
KaushalPulse ML Module: Staged Supply & Skill Gap Engine
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246

Computes:
1. Staged workforce conversion funnel
2. Deterministic Gap Score classification (0-100) with strict severity bands
3. Confidence score (0-1) from data completeness, forecast interval width, and sample size
4. Multi-period band persistence flag (same band in 2 of the last 3 periods)
"""

from typing import Dict, Any, Tuple, List, Optional
import numpy as np

SEVERITY_BANDS = [
    (75, 100, "Severe Shortage"),
    (60, 74, "Moderate Shortage"),
    (40, 59, "Balanced"),
    (25, 39, "Moderate Oversupply"),
    (0, 24, "Severe Oversupply")
]

def classify_band(score: int) -> str:
    """Classifies a 0-100 gap score into canonical MSDE severity bands."""
    if score >= 75:
        return "Severe Shortage"
    elif score >= 60:
        return "Moderate Shortage"
    elif score >= 40:
        return "Balanced"
    elif score >= 25:
        return "Moderate Oversupply"
    else:
        return "Severe Oversupply"

def compute_staged_supply(
    training_seats: int,
    seat_utilization: float = 0.92,
    pass_rate: float = 0.88,
    participation_rate: float = 0.82,
    job_readiness_rate: float = 0.70,
    mobility_factor: float = 0.0,
    placement_rate: Optional[float] = None
) -> Dict[str, Any]:
    """
    Computes staged labour supply:
    Seats -> Enrolled -> Certified -> Available Labour -> Effective Employable Supply
    
    Hardening Fix: Replaced circular placement_rate multiplier with a documented 
    job-seeking / workforce-readiness rate (default 0.70). Placement is an outcome of 
    market clearing (oversupply depresses placement), so using placement rate directly as 
    a supply multiplier falsely understates supply in saturated trades.
    """
    enrolled = int(round(training_seats * seat_utilization))
    certified = int(round(enrolled * pass_rate))
    available = int(round(certified * participation_rate))
    base_effective = int(round(available * job_readiness_rate))
    effective_employable = int(round(base_effective * (1.0 + mobility_factor)))

    return {
        "training_seats": training_seats,
        "enrolled": enrolled,
        "certified": certified,
        "available_labour": available,
        "effective_employable_supply": effective_employable,
        "seat_utilization_rate": round(seat_utilization, 3),
        "certification_rate": round(pass_rate, 3),
        "labor_participation_rate": round(participation_rate, 3),
        "job_readiness_rate": round(job_readiness_rate, 3),
        "employability_factor": round(job_readiness_rate, 3), # Kept for schema compatibility
        "placement_rate_corroboration": round(placement_rate, 3) if placement_rate is not None else None
    }

def calculate_gap_score_and_severity(
    projected_demand: int,
    effective_supply: int,
    persistence_factor: float = 0.82
) -> Tuple[int, str, int]:
    """
    Computes normalized Gap Score (0 - 100), Shortage Probability (%), and Classification.
    Strict Thresholds:
      >= 75: Severe Shortage (Red)
      60-74: Moderate Shortage (Amber)
      40-59: Balanced (Green)
      25-39: Moderate Oversupply (Indigo)
      < 25:  Severe Oversupply (Deep Indigo)
    """
    if projected_demand <= 0:
        return 15, "Severe Oversupply", 5

    raw_gap = projected_demand - effective_supply
    gap_ratio = raw_gap / float(projected_demand)

    # 50 is equilibrium
    gap_score = int(np.clip(round(50.0 + (gap_ratio * 50.0)), 10, 98))
    severity = classify_band(gap_score)

    # Shortage probability
    if gap_score >= 75:
        prob = int(np.clip(round(gap_score * 0.85 + (persistence_factor * 10)), 65, 95))
    elif gap_score >= 60:
        prob = int(np.clip(round(gap_score * 0.80), 50, 68))
    elif gap_score >= 40:
        prob = int(np.clip(round(gap_score * 0.50), 20, 45))
    elif gap_score >= 25:
        prob = int(np.clip(round(gap_score * 0.40), 10, 22))
    else:
        prob = int(np.clip(round(gap_score * 0.30), 5, 12))

    return gap_score, severity, prob

def calculate_gap_confidence(
    sample_size: int,
    expected_samples: int = 34,
    ci_width: float = 40.0,
    forecast_demand: float = 500.0,
    placement_rate: Optional[float] = None,
    effective_supply: Optional[float] = None
) -> Tuple[float, str]:
    """
    Computes a normalized confidence score (0.0 to 1.0) derived from:
    1. Data completeness (fraction of expected time-series observations)
    2. Forecast interval precision (width of 95% confidence interval relative to demand)
    3. Sample size adequacy
    4. Placement rate corroboration (placement is an outcome metric that corroborates market tension)
    Returns: (confidence_score, confidence_status) where score < 0.5 is 'Indicative'.
    """
    # 1. Completeness: ratio of observed periods to expected periods
    c_completeness = min(1.0, max(0.0, float(sample_size) / max(1.0, float(expected_samples))))

    # 2. Interval width precision: narrower CI relative to demand yields higher confidence
    rel_width = float(ci_width) / max(1.0, 2.0 * float(forecast_demand))
    c_interval = max(0.0, min(1.0, 1.0 - rel_width))

    # 3. Sample size adequacy (>= 24 months for 2 full seasonal cycles is ideal)
    c_samples = min(1.0, max(0.0, float(sample_size) / 24.0))

    # 4. Placement rate corroboration:
    # High placement corroborates shortage; low placement corroborates oversupply.
    c_corrob = 1.0
    if placement_rate is not None and effective_supply is not None:
        pr = float(placement_rate)
        # Shortage case: high placement should corroborate high hiring tension
        if forecast_demand > effective_supply and pr < 0.35:
            c_corrob = 0.85 # Slight penalty if shortage claimed but placement is extremely low
        elif effective_supply > 1.2 * forecast_demand and pr > 0.85:
            c_corrob = 0.85 # Slight penalty if oversupply claimed but placement is near 100%

    # Weighted composite score
    base_score = 0.35 * c_completeness + 0.40 * c_interval + 0.25 * c_samples
    score = round(base_score * c_corrob, 3)
    score = float(np.clip(score, 0.05, 0.98))

    status = "Actionable" if score >= 0.50 else "Indicative"
    return score, status

def compute_persistence_flag(history_scores: List[int]) -> Tuple[bool, str]:
    """
    Determines if a trade's gap severity band has persisted across recent runs:
    True if the current band appeared in at least 2 of the last 3 periods.
    """
    if not history_scores:
        return False, "Insufficient History"

    recent = history_scores[-3:]
    if len(recent) < 2:
        return False, "Single Period Only"

    bands = [classify_band(s) for s in recent]
    current_band = bands[-1]
    matches = bands.count(current_band)

    is_persistent = (matches >= 2)
    status_label = f"Persistent ({matches}/3 periods in {current_band})" if is_persistent else f"Transient ({matches}/3 periods)"
    return is_persistent, status_label
