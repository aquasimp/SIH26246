# KaushalPulse — MSDE AI-Enabled Labour Market Intelligence Engine
### Smart India Hackathon (SIH 2026) | Problem Statement PS 26246
*AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine*
*Ministry of Skill Development and Entrepreneurship (MSDE), Government of India*

---

## 🏛️ Executive Summary

**KaushalPulse** is a decision support architecture designed for the Ministry of Skill Development and Entrepreneurship (MSDE), State Skill Development Missions (SSDMs), and district skill committees.

It bridges the divide between macroeconomic hiring signals and localized training seat capacity by combining:
1. **Walk-Forward Validated LightGBM Forecaster** ($\text{WAPE} = 5.00\%$) predicting district-level occupation demand 3, 6, and 12 months ahead without future data leakage.
2. **PuLP Linear Programming Optimization Solver** computing mathematically optimal training seat reallocations under budget and physical capacity constraints.
3. **Dynamic Early-Warning Engine** alerting state planners across 6 risk categories (Shortage, Oversupply, Saturation, Obsolescence, Geographic Imbalance, Emerging Occupations).
4. **Liquid-Glass Interactive Command Center** built with Next.js 16, featuring real-time English $\leftrightarrow$ Hindi translation, interactive choropleth maps, and an explainable AI Copilot grounded in econometric facts.

---

## 🚀 Key Highlights & Architectural Rigor

- **Single Source of Truth:** FastAPI backend (`http://127.0.0.1:8000`) backed by SQLite relational store (`data/kaushal_pulse.db`) and canonical dataset (`data/canonical_dataset.csv` with 30,720 rows across 16 pilot districts and 32 NCO occupations).
- **Zero Fake AI / Zero Hardcoded Metrics:** Every analytical output (Demand, Supply, Deficit, Gap Scores, Confidence Bands) is computed dynamically from model inferences or linear programming optimizations.
- **Walk-Forward Out-of-Time Backtesting:**
  - **LightGBM Champion:** $\text{WAPE} = 5.00\%$, $\text{MAE} = 36.17\text{ jobs}$, $R^2 = 0.968$.
  - **Seasonal Naive Baseline:** $\text{WAPE} = 16.59\%$, $\text{MAE} = 120.01\text{ jobs}$, $R^2 = 0.712$.
  - **Performance Gain:** $+69.86\%$ error reduction over seasonal naive baseline.
- **Resilient API Reverse Proxy:** Next.js routes dynamically proxy upstream to Python FastAPI on port 8000, with graceful offline fallback to verified local fixtures if the ML service is unreachable.
- **Security Hardened:** RFC 4180 compliant CSV formula injection mitigation prevents DDE attacks; parameterized SQL and Pydantic request validation on all endpoints.

---

## 📁 Repository Structure

```tree
SIH26246/
├── backend/
│   └── main.py                     # Python FastAPI service (13 REST endpoints + CORS + OpenAPI)
├── data/
│   ├── canonical_dataset.csv       # 30,720-row canonical time-series (2021-11 to 2024-10)
│   ├── districts.json              # District geo-metadata, LGD codes, coordinates, and clusters
│   └── kaushal_pulse.db            # SQLite relational database (monthly_intelligence)
├── docs/
│   └── openapi.json                # Complete OpenAPI 3.1.0 specification
├── frontend/                       # Next.js 16 App Router UI (Liquid-Glass Design)
│   ├── public/                     # Static assets, logos, and national emblems
│   ├── src/
│   │   ├── app/                    # 30 routes (overview, forecasts, gaps, scenarios, alerts, etc.)
│   │   ├── components/             # Reusable UI cards, maps, charts, glass panels, modals
│   │   └── lib/                    # Store, i18n dictionary, apiProxy, exportUtils, types
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
├── ml/
│   ├── alert_engine.py             # 6-category early warning trigger engine
│   ├── lightgbm_forecast.py        # LightGBM training, walk-forward validation, artifact generation
│   ├── occupation_normalizer.py    # Fuzzy string & NCO-2015 trade code resolver
│   ├── seat_reallocation_solver.py # PuLP linear programming capacity optimization solver
│   ├── sih_dummy_adapter.py        # Heterogeneous schema adapter for unformatted ministry sheets
│   └── artifacts/
│       ├── lgbm_demand_forecaster.joblib  # Serialized model artifact
│       ├── metrics.json            # Model evaluation metrics (WAPE, MAE, RMSE, R2)
│       └── model_metadata.json     # Feature list, hyperparameters, training dates
├── scripts/
│   ├── generate_canonical_data.py  # Deterministic time-series data generator
│   └── run_dev.ps1                 # Unified launch script for Next.js and FastAPI
├── tests/                          # 13 Automated pytest test suites (100% pass)
│   ├── test_analytical_system.py
│   ├── test_demo_acceptance_flow.py
│   ├── test_gap_engine_boundaries.py
│   ├── test_ml_reality_destructive.py
│   └── test_scenario_studio_policy_logic.py
├── .gitignore                      # Clean Git ignore rules (node_modules, .venv, .next)
└── README.md                       # System documentation
```

---

## 🛠️ Quick Start & Running Locally

### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.10+ (tested on Python 3.11.9)
- **PowerShell** (Windows) or **Bash** (Linux/macOS)

### 1. Backend Setup (FastAPI + ML Engine)
```powershell
# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # On Linux/macOS: source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn lightgbm scikit-learn pulp pandas numpy pytest httpx

# Start FastAPI server (runs on port 8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup (Next.js 16 Liquid Glass UI)
```powershell
cd frontend
npm install
npm run dev                    # Runs on http://localhost:3000
```

### 3. Or Launch Both Simultaneously
```powershell
.\scripts\run_dev.ps1
```

---

## 🧪 Test Suite Execution

Run the complete 13-test analytical, ML reality, and optimization test suite:
```powershell
.\.venv\Scripts\pytest tests/ -v
```

Expected result:
```text
tests/test_analytical_system.py::test_canonical_dataset_integrity PASSED
tests/test_analytical_system.py::test_feature_engineering_no_leakage PASSED
tests/test_analytical_system.py::test_model_artifacts_and_inference PASSED
tests/test_analytical_system.py::test_planted_demo_scenario PASSED
tests/test_analytical_system.py::test_pulp_seat_reallocation_solver PASSED
tests/test_analytical_system.py::test_sih_dummy_adapter_mapping PASSED
tests/test_analytical_system.py::test_occupation_normalizer PASSED
tests/test_analytical_system.py::test_fastapi_endpoints PASSED
tests/test_demo_acceptance_flow.py::test_full_section_37_demo_acceptance_flow PASSED
tests/test_gap_engine_boundaries.py::test_gap_score_threshold_boundaries PASSED
tests/test_ml_reality_destructive.py::test_ml_destructive_pipeline_reactivity PASSED
tests/test_scenario_studio_policy_logic.py::test_scenario_studio_parametric_adjustments PASSED
tests/test_scenario_studio_policy_logic.py::test_policy_logic_sanity_constraints PASSED
======================= 13 passed in 5.21s =======================
```

Run Next.js production build verification:
```powershell
cd frontend
npm run build
```

---

## 🗺️ Canonical 3-Minute Demo Walkthrough

1. **National Executive Overview (`/overview`):**
   - Live metrics: 404K national demand, 86.5K effective supply, net deficit across 16 pilot districts.
   - Click **Uttar Pradesh** on the India choropleth map.
2. **District Deep-Dive (`/districts/gorakhpur`):**
   - Inspect Gorakhpur (LGD 178) showing overall gap score of 84 (Severe Shortage).
   - See divergence between rising Solar PV Installer demand (+21.4%) and saturated Retail Sales Associate (+181% excess).
3. **Occupation Intelligence (`/occupations/7126.0101`):**
   - Review Solar PV Installer time-series: historical data (solid line), LightGBM 6M forecast (dashed line), and 95% confidence bounds.
4. **Explainability & Recommendations (`/recommendations`):**
   - Click "Why?" to examine empirical evidence: 820 vacancies vs 180 seats, Suryamitra placement rate (89% vs retail 42%).
5. **Scenario Studio Simulation (`/scenarios`):**
   - Adjust slider or select recommendation: Reallocate 500 seats from Retail Sales to Solar PV.
   - PuLP optimizer recalculates effective supply: expands to 780 seats, reducing shortage by 62% at ₹32.5L cost.
6. **Export & Governance (`/api/export`):**
   - Export official, formula-sanitized MSDE Decision Action Memo as CSV or XLSX.
7. **Bilingual & Voice-Ready Copilot:**
   - Toggle to Hindi (हिन्दी) or open **KaushalCopilot** for grounded, hallucination-free policy inquiries.

---

## 📄 License & Attribution
Developed for the **Smart India Hackathon 2026** under Problem Statement **PS 26246** (MSDE).
Protected under the MIT License.
