"""
KaushalPulse Canonical Data Contract & Schema Specification
Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26242
"""

from dataclasses import dataclass, asdict
from typing import Optional, List, Dict, Any
import datetime

CANONICAL_COLUMNS = [
    "date",
    "state",
    "district",
    "sector",
    "occupation",
    "nco_code",
    "qualification",
    "nsqf_level",
    "job_demand",
    "employer_count",
    "training_seats",
    "enrolled",
    "certified",
    "available_supply",
    "placement_rate",
    "wage_signal",
    "industry_signal",
    "source",
    "data_mode",
    "confidence",
    "updated_at"
]

@dataclass
class CanonicalRecord:
    date: str                        # YYYY-MM-01
    state: str                       # e.g. "Uttar Pradesh"
    district: str                    # e.g. "Gorakhpur"
    sector: str                      # e.g. "Green Jobs & Renewable Energy"
    occupation: str                  # e.g. "Solar PV Installer"
    nco_code: str                    # e.g. "7126.0101"
    qualification: str               # e.g. "QP-SGJ/Q0101"
    nsqf_level: int                  # e.g. 4
    job_demand: int                  # Monthly estimated demand
    employer_count: int              # Hiring firms
    training_seats: int              # ITI / PMKK capacity
    enrolled: int                    # Enrolled students
    certified: int                   # Passed graduates
    available_supply: int            # Active labor market entrants
    placement_rate: float            # 0.0 - 1.0
    wage_signal: int                 # Median monthly INR
    industry_signal: float           # Capex / tender expansion index (0.5 - 2.0)
    source: str = "Skill India Digital + NCS Aggregates"
    data_mode: str = "synthetic"     # synthetic, sih_dummy, public_aggregate, official_feed
    confidence: float = 0.85
    updated_at: str = datetime.datetime.now(datetime.timezone.utc).isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
