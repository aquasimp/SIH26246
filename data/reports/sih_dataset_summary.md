# Official SIH Evaluation Dataset — Inspection Summary
**Dataset File:** `sih_official_dummy_dataset.csv` | **Format:** `CSV`

- **Total Observations:** 8,704
- **Total Columns:** 17
- **Time-Series Horizon:** 2022-01-01 to 2024-10-01 (34 monthly periods)
- **States Represented:** 5 (Uttar Pradesh, Maharashtra, Gujarat, Karnataka, Tamil Nadu)
- **Normalized Districts:** 16
- **Industry Sectors:** 13
- **Distinct Trade Roles:** 16

## Schema & Data Quality Profile

| Column Name | Inferred Type | Missing Count | Missing % | Domain Category |
|---|---|---|---|---|
| `record_id` | `str` | 0 | 0.0% | Identifier |
| `reporting_period` | `str` | 0 | 0.0% | Date |
| `state_name` | `str` | 0 | 0.0% | Geo |
| `district_name` | `str` | 0 | 0.0% | Geo |
| `sector_name` | `str` | 0 | 0.0% | Metadata |
| `trade_name` | `str` | 0 | 0.0% | Metadata |
| `job_count` | `int64` | 0 | 0.0% | Demand |
| `seat_count` | `int64` | 0 | 0.0% | Supply |
| `enrolled_trainees` | `int64` | 0 | 0.0% | Supply |
| `certified_trainees` | `int64` | 0 | 0.0% | Supply |
| `placed_trainees` | `int64` | 0 | 0.0% | Supply |
| `avg_reported_salary` | `int64` | 0 | 0.0% | Metadata |
| `active_employers` | `int64` | 0 | 0.0% | Metadata |
| `training_partner_id` | `str` | 0 | 0.0% | Identifier |
| `centre_type` | `str` | 0 | 0.0% | Metadata |
| `inspection_rating` | `float64` | 1024 | 11.76% | Metadata |
| `data_source_feed` | `str` | 0 | 0.0% | Metadata |

## Aggregated Macro Totals

- **Total Vacancy Demand:** 3,976,062 jobs (Monthly Mean: 456.8)
- **Total Sanctioned Intake:** 2,762,334 seats (Monthly Mean: 317.4)
- **Integrity Flag:** 0 duplicate observations, 0 negative values.
