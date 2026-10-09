# KaushalPulse — Architecture & Technical Specification
## Ministry of Skill Development and Entrepreneurship (MSDE) — PS 26242
### AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine

---

## 1. System Vision & Paradigm Shift

Traditional government skill planning treats **training seats** as equivalent to **actual employable labour supply**. This false assumption causes acute shortages in emerging green/advanced manufacturing trades while simultaneously producing hundreds of thousands of unemployable certified candidates in saturated legacy trades.

**KaushalPulse** solves this by establishing a closed-loop intelligence architecture:

```text
LABOUR DEMAND (NCS, Job Portals, PLFS Signals, State Tenders)
     ↓
NORMALISATION (NCO-2015 Classification + LGD District Hierarchy)
     ↓
LABOUR SUPPLY (Staged Funnel: Seats → Enrolled → Certified → Available → Employable)
     ↓
DEMAND–SUPPLY ANALYSIS (Multi-Horizon Econometric Modeling)
     ↓
FORECAST (Global LightGBM Ensemble vs. Seasonal Naive Benchmark)
     ↓
SHORTAGE / OVERSUPPLY DETECTION (Structural Gap Scoring 0–100)
     ↓
EARLY WARNING CENTER (6 Strategic Alert Categories)
     ↓
RECOMMENDED GOVERNMENT ACTION (Evidence-Backed Seat Reallocation)
     ↓
SCENARIO STUDIO (Real-Time Interactive Sandbox with Cost Models)
```

---

## 2. Core Mathematical Formulations

### 2.1 Staged Employable Labour Supply Formula

Rather than counting raw capacity, effective employable supply $S_{\text{effective}}$ is calculated via a multi-stage attrition funnel:

$$S_{\text{effective}} = \left[ S_{\text{seats}} \cdot \eta_{\text{util}} \cdot \eta_{\text{cert}} \cdot \eta_{\text{part}} \cdot \eta_{\text{emp}} \right] \cdot (1 + \mu_{\text{mobility}})$$

Where:
- $S_{\text{seats}}$: Total authorized training seats across ITIs and PMKK centers.
- $\eta_{\text{util}}$: Seat utilization rate ($\approx 0.92$).
- $\eta_{\text{cert}}$: Candidate assessment pass rate ($\approx 0.88$).
- $\eta_{\text{part}}$: Labour force participation rate of certified graduates ($\approx 0.82$).
- $\eta_{\text{emp}}$: Skill relevance & industry placement employability factor ($\approx 0.78$).
- $\mu_{\text{mobility}}$: Inter-district worker commute / migration multiplier ($0\% - 30\%$).

### 2.2 Normalized Gap Score ($0 - 100$)

The Gap Score normalizes trade equilibrium around 50 (balanced):

$$\text{Gap Ratio} = \frac{D_{\text{forecast}} - S_{\text{effective}}}{D_{\text{forecast}}}$$

$$\text{Gap Score} = \min\left(98, \max\left(10, \text{round}\left(50 + 50 \cdot \text{Gap Ratio}\right)\right)\right)$$

- $\text{Gap Score} \ge 75$: **Severe Shortage** (Red)
- $60 \le \text{Gap Score} < 75$: **Moderate Shortage** (Orange)
- $40 \le \text{Gap Score} < 60$: **Balanced Market Alignment** (Green)
- $\text{Gap Score} < 40$: **Severe Oversupply / Saturation** (Indigo)

### 2.3 Model Benchmark: Weighted Absolute Percentage Error (WAPE)

$$\text{WAPE} = \frac{\sum_{t=1}^n |y_t - \hat{y}_t|}{\sum_{t=1}^n y_t}$$

- **Seasonal Naive Benchmark (12M Lag):** $18.4\%$ WAPE
- **Global LightGBM Ensemble v3.2:** $12.7\%$ WAPE (Relative error reduction of $+31.0\%$)

---

## 3. UI/UX Liquid Glass Design System

The application strictly implements a **Liquid Glass Government Intelligence UI**:
- Light-first warm atmospheric base environment (`#f8fafc` with subtle atmospheric depth glows).
- Layered translucent panels (`backdrop-filter: blur(20px) saturate(150%)`, 1px low-contrast highlight borders).
- 4-Tier Surface Hierarchy:
  - **Level 1**: Soft atmospheric background canvas.
  - **Level 2**: Primary glass panels (`.glass-panel`).
  - **Level 3**: Elevated insight cards (`.glass-card`).
  - **Level 4**: Focused active liquid controls (`.liquid-control`).
- Strict Semantic Color Mapping:
  - Neutral: Slate (`#0f172a`, `#475569`)
  - Demand: Warm Amber / Orange (`#ea580c`)
  - Supply: Emerald (`#059669`)
  - Shortage: Crimson (`#dc2626`)
  - Oversupply: Indigo (`#4f46e5`)
  - Forecast: Sapphire (`#2563eb`)

---

## 4. 15-Step Winning SIH Demonstration Flow

| Step | Action | Screen | Key Proof Point Shown |
|---|---|---|---|
| **01** | Open Overview | `/overview` | National intelligence metrics (Demand 17.4K, Gap -6.2K, 14 At-Risk trades). |
| **02** | Select State | Header / Filter | Pick "Uttar Pradesh". Dashboard updates immediately. |
| **03** | Select District | Map / Filter | Pick "Gorakhpur" (LGD 178). Map beacon activates. |
| **04** | Observe Trade Shortage | What Changed Strip | Solar PV Installer demand accelerated $+21.4\%$; Gorakhpur risk crosses $70\%$. |
| **05** | Open Forecast | `/forecasts` | 36-Month trajectory; LightGBM vs Seasonal Naive WAPE comparison (12.7% vs 18.4%). |
| **06** | Toggle Horizon | Horizon Pills | Switch 3M → 6M → 12M; confidence intervals expand dynamically. |
| **07** | Inspect Gap Diagnostics | `/gaps` | Hero Gap Score 84 visual with sub-index radial ring and decomposition. |
| **08** | Open Explainability | `/forecasts` | Factor decomposition: PM Surya Ghar (+31%), EPC hiring (+18%), Monsoon (-4%). |
| **09** | Open Recommendations | `/recommendations` | Ranked Policy Action #01: Redirect 500 seats from Retail to Solar PV in Gorakhpur. |
| **10** | Inspect Evidence | Evidence Drawer | Real-time vacancy logs, employer letters of intent, and budget constraint ₹32.5L. |
| **11** | Launch Scenario Studio | `/scenarios` | Interactive levers for seat shift, batch scaling, demand shock, and new center. |
| **12** | Apply Intervention | Studio Controls | Move slider to 500 seats shifted; new ITI center ON (+150 seats). |
| **13** | Show Simulated Impact | Studio Comparison | Gap Score drops from **84 → 39**; shortage deficit decreases **-62%**. |
| **14** | Query Kaushal Copilot | Floating AI | Ask in Hindi: *"गोरखपुर में सोलर इंस्टॉलर की कमी क्यों है?"* — Receives grounded response with Run ID. |
| **15** | Export Policy Action | API / Drawer | Click "Export Action Brief (CSV)" — Genuine structured file downloads to browser. |

---

## 5. Trust, Governance & Provenance

In compliance with Ministry of Skill Development guidelines:
- Synthetic and simulated training cohorts are visibly labeled **Demo Dataset**.
- Ingested feeds from official sources are flagged as **Public Aggregate** or **Planned Government Feed**.
- All analytical decisions cite pipeline run metadata: `RUN-2026-10-04-001`.
