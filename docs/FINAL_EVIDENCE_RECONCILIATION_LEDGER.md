# KAUSHALYUVA (कौशलयुवा) — MASTER EVIDENCE RECONCILIATION LEDGER
## Safe Final No-Regression Audit & Empirical Truth Reconciliation
**Project:** KaushalYuva (कौशलयुवा)  
**Problem Statement:** SIH 2026 — PS 26246  
**Ministry:** Ministry of Skill Development and Entrepreneurship (MSDE)  
**Canonical Deployment URL:** [https://kaushalyuva.vercel.app/](https://kaushalyuva.vercel.app/)  
**Audit Timestamp:** October 2026

---

## 1. MASTER DISCREPANCY RECONCILIATION LEDGER

| # | Topic / Claim | Conflicting Values in Past Reports | Authoritative Source of Truth | Verified Result | Action Taken | Test Evidence & Reproducibility | Remaining Uncertainty |
|---|---|---|---|---|---|---|---|
| **1** | **Synthetic Dataset Date Range** | Phase 0 stated: `2020–2024`<br>Final Report stated: `2021–2025` | `data/canonical_dataset.csv`<br>(min & max date calculation) | **2021-11-01 to 2026-10-01** (Exactly 60 monthly periods starting Nov 2021 through Oct 2026).<br>SIH Dataset: **2022-01-01 to 2024-10-01** (34 monthly periods). | Reconciled date ranges in documentation to exact min/max timestamps. | Evaluated via Pandas: `df['date'].min() = '2021-11-01'`, `df['date'].max() = '2026-10-01'`, `nunique() = 60`. | **Zero uncertainty.** Verified empirically directly against CSV data. |
| **2** | **Forecast Evaluation & Sample Counts** | Reports varied between 1,536 and 768 observations; relative reductions reported as "40–50%" vs exact per-horizon numbers. | `ml/model_artifacts/out_of_sample_metrics.json` & `rolling_backtest_metrics.json` | **Out-of-Sample Test (Origins 4–6):**<br>• 3M: Blend WAPE **4.17%** vs Seasonal Naive **6.49%** (35.7% rel. red.)<br>• 6M: Blend WAPE **4.18%** vs Seasonal Naive **6.05%** (30.9% rel. red.)<br>• 12M: Blend WAPE **3.41%** vs Seasonal Naive **6.93%** (50.8% rel. red.)<br>**Sample Counts:** 768 out-of-sample series forecasts per horizon (256 series $\times$ 3 eval origins). Across all 6 origins combined (`rolling_backtest_metrics.json`): 1,536 series evaluations per horizon (where 12M Naive WAPE is 6.70%). | Reconciled documentation to clearly distinguish 768 out-of-sample forecasts from the 1,536 6-origin backtest evaluations and the 8,704 historical rows. | `tests/test_final_hardening_pass.py::test_blend_weights_fitted_on_earlier_origins_only` passed. | **Zero uncertainty.** All numbers directly read from reproducible JSON artifacts. |
| **3** | **Combined Mobility Deficit Closure** | Phase 0 stated: `25.6%`<br>Final Report stated: `17.2%` | `ml/seat_reallocation_solver.py`<br>`optimize_seat_reallocation()` | **Both are exact engine outputs under different donor safety rules:**<br>• **Strict Mode ($\delta \le 0.05$):** 97 seats moved, Donor score 52 (Balanced), Combo deficit closure with 10% mobility = **17.2%** (15.6% without mobility).<br>• **Permissive Mode (Score $\le 59$):** 218 seats moved, Donor score 59 (Balanced), Combo deficit closure with 10% mobility = **25.6%** (23.2% without mobility).<br>• **Moderate Mode ($\delta \le 0.10$):** 140 seats moved, Donor score 55, Combo with 10% mobility = **20.1%** (18.3% without mobility). | Documented both variants in sensitivity table; established Strict Mode (17.2%) as the hardened default while explaining the legacy Permissive origin of 25.6%. | `tests/test_final_hardening_pass.py::test_donor_safety_rule_never_exceeds_threshold` & `tests/test_demo_scenario_numbers.py` passed. | **Zero uncertainty.** Directly computed from solver PuLP equations. |
| **4** | **Geographic Coverage & States in SIH Dataset** | Past reports mentioned 4 states or listed synthetic districts (Chennai, Madurai, Tiruchirappalli, Mumbai Suburban). | `data/sih_canonical_dataset.csv`<br>(unique states and district groupby) | **5 States and 16 Districts:**<br>1. Gujarat (4): Ahmedabad, Rajkot, Surat, Vadodara<br>2. Karnataka (3): Bengaluru Urban, Dharwad, Mysuru<br>3. Maharashtra (4): Chhatrapati Sambhajinagar, Nagpur, Nashik, Pune<br>4. Tamil Nadu (1): Coimbatore<br>5. Uttar Pradesh (4): Gorakhpur, Kanpur Nagar, Lucknow, Varanasi | Corrected geographic breakdown in documentation. Eliminated conflation between official SIH pilot districts and synthetic benchmark districts. | Evaluated via Pandas: `df['state'].nunique() = 5`, `df['district'].nunique() = 16`. | **Zero uncertainty.** Exact match with CSV schema. |
| **5** | **Gorakhpur LGD Code** | Past report listed `171`. | Ministry of Panchayati Raj Local Government Directory (`lgd.gov.in`), `data/districts.json` line 6, `scripts/build_choropleth_data.py` line 124. | **LGD Code: 178**<br>(State Code: 09, District Code: 178 for Gorakhpur, Uttar Pradesh). Verified against official government LGD register as of October 2026. | Standardized Gorakhpur LGD code across all documentation, metadata, and data files to **178**. | `data/districts.json` and `scripts/build_choropleth_data.py` inspect confirmed 178. | **Zero uncertainty.** Authoritative government register. |
| **6** | **Language System & Quality Coverage** | Key parity (214/214) was conflated with full native translation quality. | `frontend/messages/*.json`, `master_lexicon.json`, automated text crawls, and linguistic audits. | **Segregated Language Audit:**<br>• **Key Parity:** 214/214 keys (100%) across all 7 languages.<br>• **Lexicon Parity:** 1,014/1,014 terms translated across all 7 languages.<br>• **Script Authenticity:** Native script present in $>95\%$ of strings for all Indic targets.<br>• **Review Status:** English & Hindi (Production Verified, Native Reviewed); Marathi (Verified); Tamil, Telugu, Kannada, Bengali (Designated **Beta** pending field native-speaker review). | Added explicit Beta badges and disclosures for Southern Indic and Bengali languages; avoided claiming unverified 100% human translation perfection. | `node scripts/test_i18n_parity.js` & `tests/test_allowlist.py` passed; `judge-audit.spec.ts` Hindi deep-crawl returned `{}`. | Quality distinction clearly established. |
| **7** | **Route Inventory & Playwright Test Coverage** | Build reported 17 UI pages; Playwright crawl only tested 16 routes (`/methodology` was omitted). | Next.js filesystem router (`frontend/src/app/**/page.tsx`) & `judge-audit.spec.ts`. | **17 Next.js App UI Routes:**<br>`/`, `/overview`, `/forecasts`, `/gaps`, `/alerts`, `/recommendations`, `/scenarios`, `/districts`, `/districts/[id]`, `/occupations`, `/occupations/[nco]`, `/qualifications`, `/intelligence`, `/data-health`, `/methodology`, `/api`, `/settings`. | Added `/methodology` to `ALL_ROUTES` in `judge-audit.spec.ts`. Localized milestone tags and formula blocks. Captured 24 updated screenshots across **1440px** and **390px** viewports for Landing, Scenarios, and affected KPI screens. | `judge-audit.spec.ts` passed 5/5 across all 17 routes with zero horizontal overflow at 375px, 768px, and 1440px. `capture-audit-screenshots.spec.ts` passed. | **Zero uncertainty.** 100% route coverage verified. |
| **8** | **Feature & Engine Preservation** | Risk of regression from hardening changes. | Git working tree diff against commit `05f0148`. | **Zero analytical mutations, zero removed features:**<br>• All models, formulas, and PuLP equations preserved.<br>• All 17 UI routes and 14 API routes active.<br>• Working filters, theme toggles, and language selectors preserved.<br>• Responsive fixes resolved KPI wrapping and tablet header clipping without deleting UI components. | Clean Git commit checkpoints created. | All 30 pytest unit/integration tests passed; Next.js production build compiled cleanly in 1.9s; all 18 Playwright E2E tests passed. | **Zero regressions detected.** |

---

## 2. DETAILED EVIDENCE LEDGER BY TOPIC

### Topic 1: Dataset Dates
- **Empirical Check on `data/sih_canonical_dataset.csv`:**
  - `min_date`: `2022-01-01`
  - `max_date`: `2024-10-01`
  - `total_distinct_months`: 34
  - `total_rows`: 8,704 ($16 \text{ districts} \times 16 \text{ trades} \times 34 \text{ months}$)
- **Empirical Check on `data/canonical_dataset.csv` (Synthetic Benchmark):**
  - `min_date`: `2021-11-01`
  - `max_date`: `2026-10-01`
  - `total_distinct_months`: 60
  - `total_rows`: 30,720 ($16 \text{ districts} \times 32 \text{ trades} \times 60 \text{ months}$)
- **Resolution:** Earlier reports loosely stated "2020–2024" or "2021–2025" without calculating exact timestamps. The authoritative start and end dates are **November 1, 2021 through October 1, 2026** for the benchmark, and **January 1, 2022 through October 1, 2024** for the official SIH dataset.

---

### Topic 2: Forecast Evaluation Reconciled
- **Fitted Window:** Origins 1–3 (`2023-05-01`, `2023-06-01`, `2023-07-01`).
- **Evaluation Window:** Origins 4–6 (`2023-08-01`, `2023-09-01`, `2023-10-01`).
- **Sample Count per Horizon:** 256 series $\times$ 3 evaluation origins = **768 out-of-sample forecasts**.
- **Metrics Breakdown (`ml/model_artifacts/out_of_sample_metrics.json`):**
  - **3-Month Horizon (3M):**
    - Tri-Model Blend: WAPE **4.17%**, MAE 18.69, RMSE 23.18, MASE 0.602, 80% Coverage 80.2%, 95% Coverage 95.1%
    - Seasonal Naive Baseline: WAPE **6.49%**, MAE 29.08, RMSE 35.83, MASE 0.937
    - Relative Error Reduction: **35.7%**
    - Individual Models: LightGBM 3.71%, Theta 4.24%, ETS 5.19%
  - **6-Month Horizon (6M):**
    - Tri-Model Blend: WAPE **4.18%**, MAE 20.06, RMSE 24.82, MASE 0.646, 80% Coverage 76.6%, 95% Coverage 95.4%
    - Seasonal Naive Baseline: WAPE **6.05%**, MAE 29.03, RMSE 35.82, MASE 0.935
    - Relative Error Reduction: **30.9%**
    - Individual Models: LightGBM 3.58%, ETS 4.51%, Theta 5.32%
  - **12-Month Horizon (12M):**
    - Tri-Model Blend: WAPE **3.41%**, MAE 16.26, RMSE 20.30, MASE 0.524, 80% Coverage 78.9%, 95% Coverage 94.5%
    - Seasonal Naive Baseline: WAPE **6.93%**, MAE 33.08, RMSE 40.81, MASE 1.066
    - Relative Error Reduction: **50.8%**
    - Individual Models: LightGBM 3.55%, ETS 3.73%, Theta 4.18% (Blend beats every single individual model).
- **Distinction of Observation Units:**
  - Historical SIH dataset rows: **8,704 rows**
  - Synthetic benchmark rows: **30,720 rows**
  - Full 6-origin rolling backtest evaluations: **1,536 series evaluations** ($256 \times 6$)
  - Out-of-sample evaluation forecasts: **768 out-of-sample forecasts** ($256 \times 3$) per horizon, totaling **2,304 evaluations** across 3 horizons.

---

### Topic 3: Combined Mobility Deficit Closure Reconciled
- **Target Trade:** Gorakhpur Solar PV Installer (NCO 7126.0101) | Demand: 808, Supply: 97, Baseline Deficit: 711, Score: 94.
- **Donor Trade:** Gorakhpur Retail Sales Associate (NCO 5223.0101) | Demand: 380, Seats: 916, Supply: 404, Score: 47 (Balanced).
- **Solver Equation Output (`ml/seat_reallocation_solver.py`):**
  ```python
  optimize_seat_reallocation(district='Gorakhpur', donor_trades=[...], target_trades=[...])
  ```
- **Sensitivity Matrix Output:**
  1. **Strict Guardrail ($\text{gap ratio} \le 0.05$):**
     - Seats shifted: **97 seats**
     - Donor post-transfer: Supply 361, Score **52 (Balanced)**, Ratio 0.05
     - Reallocation alone shortfall closure: **6.0%–6.2%**
     - Combined (+150-seat lab, 0% mobility): **15.6%**
     - Combined (+150-seat lab, +10% mobility): **17.2%**
     - Investment capex: **₹18.31 Lakh**
  2. **Moderate Guardrail ($\text{gap ratio} \le 0.10$):**
     - Seats shifted: **140 seats**
     - Donor post-transfer: Supply 342, Score **55 (Balanced)**, Ratio 0.10
     - Reallocation alone shortfall closure: **8.9%**
     - Combined (+150-seat lab, 0% mobility): **18.3%**
     - Combined (+150-seat lab, +10% mobility): **20.1%**
     - Investment capex: **₹21.10 Lakh**
  3. **Permissive Guardrail (Legacy, $\text{gap score} \le 59$):**
     - Seats shifted: **218 seats**
     - Donor post-transfer: Supply 308, Score **59 (Balanced)**, Ratio 0.1895
     - Reallocation alone shortfall closure: **13.8%**
     - Combined (+150-seat lab, 0% mobility): **23.2%**
     - Combined (+150-seat lab, +10% mobility): **25.6%**
     - Investment capex: **₹26.17 Lakh**
- **Conclusion:** Both 17.2% and 25.6% are mathematically valid outputs of the exact same solver function. 25.6% reflects the legacy Permissive setting, whereas 17.2% is the hardened default Strict setting where donor score is strictly bounded at 52 (Balanced).

---

### Topic 4: Geographic Coverage Reconciled
- **Official SIH Dataset (`data/sih_canonical_dataset.csv`):**
  - **5 States, 16 Districts:**
    - **Gujarat (4):** Ahmedabad, Rajkot, Surat, Vadodara
    - **Karnataka (3):** Bengaluru Urban, Dharwad, Mysuru
    - **Maharashtra (4):** Chhatrapati Sambhajinagar, Nagpur, Nashik, Pune
    - **Tamil Nadu (1):** Coimbatore
    - **Uttar Pradesh (4):** Gorakhpur, Kanpur Nagar, Lucknow, Varanasi
- **Synthetic Benchmark Dataset (`data/canonical_dataset.csv`):**
  - **4 States, 16 Districts:**
    - **Gujarat (4):** Ahmedabad, Rajkot, Surat, Vadodara
    - **Karnataka (4):** Bengaluru Urban, Dakshina Kannada, Dharwad, Mysuru
    - **Maharashtra (4):** Mumbai Suburban, Nagpur, Nashik, Pune
    - **Uttar Pradesh (4):** Gautam Buddha Nagar, Gorakhpur, Lucknow, Varanasi
- **Correction:** Prior documentation conflated the benchmark state list with the official SIH list. The official SIH dataset covers **5 states** across 16 districts.

---

### Topic 5: Gorakhpur LGD Code Reconciled
- **Authoritative Register:** Ministry of Panchayati Raj, Government of India Local Government Directory (`https://lgd.gov.in/`).
- **State Code:** 09 (Uttar Pradesh).
- **District Code:** **178** (Gorakhpur).
- **Internal Repository Consistency:**
  - `data/districts.json` (line 6): `"lgd_code": 178`
  - `scripts/build_choropleth_data.py` (line 124): `'lgd_code': 178`
- **Correction:** The errant value `171` in earlier text (which corresponds to Gautam Buddha Nagar) has been corrected to **178** across all documentation.

---

### Topic 6: Language System & Quality Ledger
- **Dictionary Key Parity:** Exactly 214 keys in all 7 dictionaries (`en`, `hi`, `mr`, `ta`, `te`, `kn`, `bn`) with 0 missing keys.
- **Master Lexicon Coverage:** Exactly 1,014 terms translated in all 7 languages.
- **Script Density:**
  - English: 208 keys Latin (97.2%)
  - Hindi: 206 keys Devanagari (96.3%)
  - Marathi: 205 keys Devanagari (95.8%)
  - Tamil: 205 keys Tamil (95.8%)
  - Telugu: 205 keys Telugu (95.8%)
  - Kannada: 205 keys Kannada (95.8%)
  - Bengali: 212 keys Bengali (99.1%)
- **Quality Status:**
  - **English & Hindi:** Production Verified; automated deep-crawl verified across all 17 routes with zero unexempt tokens; native-speaker verified.
  - **Marathi:** Production Verified; Devanagari validated.
  - **Tamil, Telugu, Kannada, Bengali:** Fully operational with 100% key parity, font rendering, and layout stability, but transparently labeled as **Beta** pending dedicated field native-speaker review.

---

### Topic 7: Route Inventory & Screenshot Capture
- **Next.js UI Pages (17 Total):**
  1. `/` (Landing Page)
  2. `/overview` (Executive Dashboard & Choropleth Map)
  3. `/forecasts` (Demand & Forecast Analytics)
  4. `/gaps` (Structural Shortfall Matrix)
  5. `/alerts` (Early Warning Intelligence Signals)
  6. `/recommendations` (Action Dossiers)
  7. `/scenarios` (PuLP Scenario Studio)
  8. `/districts` (Geographic Directory)
  9. `/districts/[id]` (District Deep-Dive)
  10. `/occupations` (NCO-2015 Occupation Directory)
  11. `/occupations/[nco]` (Occupation Deep-Dive)
  12. `/qualifications` (NSQF & Staged Funnel Architecture)
  13. `/intelligence` (Velocity Decomposition)
  14. `/data-health` (Data Provenance & Engine Health)
  15. `/methodology` (Mathematical Formulation & Assumptions)
  16. `/api` (OpenAPI Swagger Documentation & Exports)
  17. `/settings` (Preferences, Theme, Language)
- **Playwright Crawl:** `judge-audit.spec.ts` updated to include `/methodology`, achieving **17 / 17 route coverage** with 0px horizontal overflow across Mobile (375px), Tablet (768px), and Desktop (1440px).
- **Screenshots Captured (24 Total in `docs/ui-audit/after/`):**
  - **1440px Desktop:**
    - `landing-1440-en.png` & `landing-1440-hi.png`
    - `overview-1440-en.png` & `overview-1440-hi.png`
    - `scenarios-1440-en.png` & `scenarios-1440-hi.png`
    - `data-health-1440-en.png` & `data-health-1440-hi.png`
    - `recommendations-1440-en.png` & `recommendations-1440-hi.png`
    - `qualifications-1440-en.png` & `qualifications-1440-hi.png`
  - **390px Mobile:**
    - `landing-390-en.png` & `landing-390-hi.png`
    - `overview-390-en.png` & `overview-390-hi.png`
    - `scenarios-390-en.png` & `scenarios-390-hi.png`
    - `data-health-390-en.png` & `data-health-390-hi.png`
    - `recommendations-390-en.png` & `recommendations-390-hi.png`
    - `qualifications-390-en.png` & `qualifications-390-hi.png`

---

## 3. VERIFICATION & TEST SUMMARY

```
┌──────────────────────────────────────────┬─────────────────────────────┬───────────────────────────┐
│ Verification Suite                       │ Framework / Tool            │ Final Result              │
├──────────────────────────────────────────┼─────────────────────────────┼───────────────────────────┤
│ Backend Unit & Regression Tests          │ pytest (11 test files)      │ 30 / 30 Passed (5.69s)    │
│ Production Frontend Compilation          │ Next.js 16.3.8 Turbopack    │ 34 / 34 Routes Built      │
│ i18n Key Parity Check                    │ Node.js Parity Checker      │ 214 / 214 Keys (100%)     │
│ Map Verification Suite                   │ Playwright E2E              │ 6 / 6 Passed              │
│ Scenario Studio Policy Logic             │ Playwright E2E              │ 6 / 6 Passed              │
│ Judge Audit (Overflow on 17 routes)      │ Playwright E2E              │ 5 / 5 Passed              │
│ Full 1440px & 390px Screenshot Capture   │ Playwright E2E              │ 24 / 24 Screenshots Saved │
└──────────────────────────────────────────┴─────────────────────────────┴───────────────────────────┘
```

**Git Audit Trail:**
- Checkpoint `8da178d`: Initial hardening pass (KPI card overflow, responsive breakpoints, doc reconciliation).
- Checkpoint `3761ad1`: Documentation artifact sync.
- Checkpoint `b85a511`: Final evidence reconciliation pass (17 routes in test suite, 24 screenshots at 1440px and 390px, formula tag localization).
- Working tree status: **Clean (`main` branch, zero uncommitted changes).**
