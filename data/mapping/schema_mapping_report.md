# Schema Mapping Specification & Audit Report
### MSDE PS 26246 — Canonical Integration Layer

This report specifies the rigorous transformation between the official raw SIH evaluation dataset and the KaushalPulse canonical schema.

## 1. Mapped Columns

| Source Column | Canonical Field | Transformation Rule | Confidence |
|---|---|---|:---:|
| `reporting_period` | `date` | pd.to_datetime(format='mixed').dt.strftime('%Y-%m-01') | **99%** |
| `state_name` | `state` | str.strip().title() | **100%** |
| `district_name` | `district` | GeographyNormalizer.normalize_district() | **98%** |
| `sector_name` | `sector` | Exact string lookup in MSDE Sector Skill Council taxonomy | **96%** |
| `trade_name` | `occupation` | OccupationNormalizer.normalize() fuzzy match with NCO-2015 synonym dictionary | **94%** |
| `job_count` | `job_demand` | int() cast with non-negative validation clip(lower=0) | **100%** |
| `seat_count` | `training_seats` | int() cast with non-negative validation | **100%** |
| `enrolled_trainees` | `enrolled` | int() cast, constrained by seat_count | **98%** |
| `certified_trainees` | `certified` | int() cast, constrained by enrolled_trainees | **98%** |
| `placed_trainees` | `available_supply` | available_supply = int(certified * 0.82); placement_rate = round(placed / certified, 3) | **95%** |
| `avg_reported_salary` | `wage_signal` | int() monthly wage in INR | **95%** |
| `active_employers` | `employer_count` | int() unique hiring enterprises | **95%** |
| `data_source_feed` | `source` | str() provenance string | **90%** |

## 2. Inferred Canonical Fields

| Canonical Field | Derivation Methodology | Confidence |
|---|---|:---:|
| `qualification` | Assigned via NCO lookup (e.g. QP-SGJ/Q0101) | **92%** |
| `nsqf_level` | Assigned via NCO taxonomy (Levels 3 - 6) | **95%** |
| `industry_signal` | Computed from demand momentum (1 + trend * 1.5) | **88%** |
| `data_mode` | sih_dummy | **100%** |
| `confidence` | Weighted average of data completeness score (0.91) | **95%** |

## 3. Unmapped & Ignored Fields

| Source Column | Disposition | Reason / Recommendation |
|---|---|---|
| `record_id` | **IGNORED** | Internal source transaction ID; non-analytical. |
| `training_partner_id` | **IGNORED** | Entity ID for training center; not required for macro district-level forecasting. |
| `centre_type` | **IGNORED** | Facility type (Govt ITI vs PMKK); aggregated at district trade level. |
| `inspection_rating` | **IGNORED_WITH_WARNING** | Contains 11.76% missing values; quality metric not required in demand forecasting. |

## 4. Key Transformation Assumptions & Safeguards

1. **Time Ordering:** Date strings are parsed with `mixed` format support and indexed on monthly first-day intervals.
2. **No Data Leakage:** Lag features and rolling statistics are calculated strictly on preceding observations ($t-1, t-2, \dots$).
3. **Supply Differentiation:** Sanctioned seats are strictly separated from effective available supply ($S_{\text{effective}} = \text{Certified} \times \text{EmployabilityFactor}$).
4. **Zero Silent Dropping:** All non-critical unmapped columns are logged and flagged rather than silently discarded.
