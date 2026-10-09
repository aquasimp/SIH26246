# ANTIGRAVITY MASTER BUILD PROMPT
## SIH 2026 — PS 26242
## AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine

You are a **senior product engineer + product designer + data visualization engineer + AI/ML UX architect** building a **winner-level Smart India Hackathon prototype** for:

**Problem Statement ID:** 26242  
**Problem Statement:** AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine  
**Organization:** Ministry of Skill Development and Entrepreneurship (MSDE)  
**Category:** Software  
**Theme:** Miscellaneous

Your task is to build a **FULLY WORKING, INTERACTIVE, DEMO-READY prototype**, not a static UI mockup.

---

# 1. FIRST UNDERSTAND WHAT THIS PRODUCT ACTUALLY IS

DO NOT interpret this as:

- a job portal
- a job-search website
- a generic Power BI dashboard
- a generic analytics admin panel
- an AI chatbot wrapped around charts
- a collection of disconnected charts

The product is a:

# LABOUR MARKET INTELLIGENCE + FORECASTING + DECISION SUPPORT PLATFORM

The system must communicate this chain visually:

```text
LABOUR DEMAND
     ↓
NORMALISATION / OCCUPATION MAPPING
     ↓
LABOUR SUPPLY
     ↓
DEMAND–SUPPLY ANALYSIS
     ↓
FORECAST
     ↓
SHORTAGE / OVERSUPPLY DETECTION
     ↓
EARLY WARNING
     ↓
RECOMMENDED GOVERNMENT ACTION
     ↓
SCENARIO / POLICY SIMULATION
```

The prototype must make the user think:

> “This system tells a government planner what is happening, what will happen next, where the mismatch will happen, and what should be done about it.”

That is the core product.

---

# 2. IMPORTANT — DO NOT BREAK OR OVER-SIMPLIFY THE CORE LOGIC

The underlying research defines the proposed architecture around:

- NCO / occupation standardisation
- LGD district hierarchy
- NQR / NSQF qualification linkage
- multi-source demand aggregation
- demand volume + pressure index
- staged training supply
- effective employable supply
- forecasting
- gap scoring
- early warnings
- recommendations
- scenario simulation
- API/export
- planner dashboard

The architecture should conceptually preserve:

```text
Training
   ↓
Certified
   ↓
Available Labour
   ↓
Effective Employable Supply
```

rather than treating “training seats” as equivalent to actual labour supply.

---

# 3. DESIGN PHILOSOPHY — THIS IS CRITICAL

## THE VISUAL STYLE

Build a:

# PREMIUM LIQUID GLASS GOVERNMENT INTELLIGENCE UI

The visual language should combine:

- liquid glass
- frosted glass
- translucent surfaces
- soft depth
- subtle blur
- layered cards
- premium gradients
- controlled reflections
- elegant borders
- smooth micro-interactions
- restrained shadows
- high information density without looking cluttered

The UI should feel:

**Apple Vision Pro × premium enterprise intelligence platform × modern Indian government digital product**

but DO NOT copy Apple or any existing product.

Create an original design system.

---

# 4. ABSOLUTELY NO GENERIC “AI DASHBOARD” DESIGN

DO NOT use:

- dark navy everywhere
- black dashboard background
- neon blue AI glow
- excessive purple/blue gradients
- cyberpunk styling
- excessive glowing borders
- generic SaaS admin templates
- oversized meaningless illustrations
- giant KPI cards everywhere
- excessive rounded pills
- random glass cards with no hierarchy

The product must NOT look like:

“ChatGPT dashboard + charts.”

It should look like:

**A serious national labour intelligence platform with premium modern UX.**

---

# 5. GLASS / LIQUID GLASS SYSTEM

Create a coherent glass system.

### Base environment

Use a sophisticated light-first environment.

Think:

- warm/off-white base
- extremely subtle tonal gradients
- soft atmospheric background
- faint abstract depth layers
- restrained accent colors

The background should not be plain white.

It should feel dimensional but quiet.

### Glass cards

Use:

- translucent white surfaces
- backdrop blur
- subtle transparency
- 1px low-contrast borders
- tiny internal highlights
- soft shadows
- slight depth

Example conceptual style:

```css
background:
rgba(255,255,255,0.55)

backdrop-filter:
blur(20px) saturate(140%)

border:
1px solid rgba(255,255,255,0.7)

box-shadow:
0 10px 40px rgba(...)
```

Do not blindly use this exact CSS. Establish a complete design token system.

---

# 6. GLASS HIERARCHY

Create at least 4 surface levels:

### Level 1
Background atmosphere

### Level 2
Primary glass panels

### Level 3
Elevated glass cards

### Level 4
Focused/active liquid-glass controls

Use depth intentionally.

Not every object should have the same glass treatment.

---

# 7. COLOUR SYSTEM

Use colour semantically.

Recommended conceptual mapping:

### Neutral
For normal information.

### Demand
Warm/coral/amber family.

### Supply
Cool green/teal family.

### Shortage
Strong red/orange.

### Oversupply
Blue/purple or indigo.

### Forecast
Professional violet/blue accent.

### Recommendation
Green/teal success accent.

### Warning
Amber.

Do not allow the interface to become rainbow-colored.

Keep the palette controlled.

The majority of the UI should remain neutral.

---

# 8. TYPOGRAPHY

Typography must feel premium and authoritative.

Use:

**Trade Gothic** as the primary display/UI font where available, with a highly legible fallback stack.

Do not use excessively thin typography.

Hierarchy should be extremely clear:

```text
Page title
Section title
Metric
Supporting value
Metadata
Helper text
```

Numbers should be visually powerful because this is an intelligence platform.

Example:

```text
17.4K
Projected Demand

+18.6%
6M growth

84
Gap Score
```

---

# 9. DESIGN PRINCIPLE — INFORMATION HIERARCHY FIRST

Every screen must answer:

### What is happening?
### Why is it happening?
### What will happen?
### What should the planner do?

Do NOT fill screens simply because there is available space.

Avoid decorative charts.

Every chart must answer a real planning question.

---

# 10. GLOBAL APPLICATION SHELL

Create a professional application shell.

## LEFT SIDEBAR

Use a refined glass navigation rail.

Logo:

**KaushalPulse**

Sub-label:

**Labour Market Intelligence**

Navigation:

```text
Overview
Labour Intelligence
Forecasts
Skill Gaps
Early Warnings
Recommendations
Scenario Studio
Districts
Occupations
Qualifications
Data & Model Health
API & Exports
Settings
```

Use intuitive icons.

The active navigation item should have a subtle liquid-glass highlight.

Sidebar should collapse elegantly.

---

# 11. TOP HEADER

Create a clean floating top bar.

Include:

Left:

**Current view / breadcrumb**

Right:

- Data freshness
- Last pipeline run
- language switcher
- notifications
- profile / planner identity

Example:

```text
MSDE Intelligence / India / Uttar Pradesh

Data refreshed
2h ago

EN | हिन्दी
```

Make these look elegant, not like plain buttons.

---

# 12. GLOBAL FILTER BAR

Create a highly polished contextual filter system.

Filters:

```text
Time
State
District
Sector
Occupation
Qualification
Demand/Supply
Forecast Horizon
```

Use glass dropdowns.

Changing filters MUST update the dashboard data.

Do not make fake controls.

---

# 13. SCREEN 1 — EXECUTIVE OVERVIEW

This is the hero screen.

The first 5 seconds must communicate the entire product.

Hero heading:

# National Labour Market Intelligence

Supporting copy:

**See where demand is rising, where training capacity is falling behind, and what MSDE should act on next.**

Top metrics:

### Demand
Current demand volume

### Effective Supply
Employable workforce

### Net Gap
Demand vs effective supply

### At-Risk Trades
Trades approaching shortage/saturation

### Early Warnings
Active alerts

### Recommended Interventions
Actions requiring attention

Do NOT make these giant generic KPI blocks.

Build a sophisticated asymmetric composition.

---

# 14. MAIN HERO VISUAL

Create a large central intelligence visualization.

Potential layout:

**India map + intelligence overlay**

Map should support:

- demand
- supply
- shortage
- oversupply
- training centres
- forecast
- district priority

Clicking a district updates surrounding analytics.

Use smooth animated transitions.

Do not use a decorative map.

The map must be analytically useful.

---

# 15. “WHAT CHANGED?” INTELLIGENCE STRIP

Create an elegant insight feed:

```text
↑ Solar PV Installer demand accelerated 21%
↓ Retail Sales Associate demand softened 8%
⚠ Gorakhpur shortage probability crossed 70%
↑ 4 emerging occupations detected
```

Each insight should be clickable.

---

# 16. TOP PRIORITY ACTIONS

Create a high-end recommendation panel:

### Priority interventions

Example:

```text
01
SOLAR PV INSTALLER
Gorakhpur, Uttar Pradesh

Projected shortage
Next 6 months

Gap Score
84 / 100

Recommended action
Redirect 500 training seats

Expected effect
−62% projected shortage
```

Add:

**View evidence**

**Simulate**

**Export action**

These interactions must actually work.

---

# 17. SCREEN 2 — LABOUR INTELLIGENCE

Page title:

# Labour Intelligence

Purpose:

Understand current labour demand.

Create:

### Demand trend
Time-series

### Demand Pressure Index
0–100

### Demand volume
Actual estimated demand

### Employer activity
Number of hiring organisations

### Skill momentum
Fast-growing skills

### Geographic concentration
District ranking

### Occupation table

Columns:

```text
Occupation
NCO
Sector
Demand
Growth
District concentration
Pressure
Confidence
```

Rows should be clickable.

---

# 18. SCREEN 3 — FORECASTS

This is a major judge-facing screen.

Title:

# Demand & Supply Forecast

Create a sophisticated forecast visualization.

Allow:

```text
3 months
6 months
12 months
```

Show:

### Historical demand
solid line

### Forecast demand
forecast line

### Effective supply
second line

### Confidence interval
subtle transparent band

### Gap region
visual difference between demand and supply

Include:

**Model:** Global LightGBM Ensemble

**Baseline:** Seasonal Naive

**Confidence:** 71%

**Last trained:** date

Also show:

### Model performance

```text
Model                WAPE
Seasonal Naive       18.4%
LightGBM Ensemble    12.7%
```

DO NOT fabricate believable “production” claims.

Clearly label demo/synthetic results as:

**Demo Dataset**

---

# 19. FORECAST EXPLANATION

Under the chart create:

# Why is demand changing?

Example contributors:

```text
+31% vacancy growth
+18% employer activity
+12% industrial signal
+9% skill momentum
−4% seasonal correction
```

Use a clean contribution visualization.

This is much more important than a random SHAP chart.

---

# 20. SCREEN 4 — SKILL GAP INTELLIGENCE

Title:

# Skill Gap Intelligence

Create a powerful overview of shortages and oversupply.

Hero section:

```text
SHORTAGE
124 occupations

BALANCED
416 occupations

OVERSUPPLY
87 occupations
```

Then:

### Gap severity table

```text
Occupation
District
Current gap
Forecast gap
Probability
Confidence
Severity
```

Use strong but controlled semantic styling.

---

# 21. GAP SCORE

Create a clear visual:

# Gap Score 84

Subtext:

**Severe shortage**

Then:

```text
Demand pressure       91
Effective supply      54
Forecast pressure     87
Persistence             82
Confidence             71%
```

The user should immediately understand the result.

---

# 22. EARLY WARNING CENTER

Title:

# Early Warning Center

Build a serious command-centre style screen.

Alert types:

### Emerging shortage
### Emerging oversupply
### Saturation risk
### Emerging occupation
### Geographic imbalance
### Skill obsolescence

Each alert:

```text
Severity
Affected geography
Occupation
Trigger
Forecast horizon
Confidence
Recommended action
```

Allow:

**Acknowledge**

**Investigate**

**Simulate**

**Export**

---

# 23. SCREEN 5 — DISTRICT INTELLIGENCE

Title:

# District Intelligence

Use a split-screen layout:

Left:

Interactive district map.

Right:

Selected district intelligence.

Example:

**Gorakhpur**

Cards:

```text
Demand Index
78

Effective Supply
51

Gap Score
84

6M Shortage Probability
71%

Training Capacity
2 Centres
180 Seats
```

Then:

### Top shortage occupations

### Top oversupplied occupations

### Employer signals

### Training capacity

### Recommended actions

---

# 24. DISTRICT DETAIL

When clicking a district, navigate to:

```text
India
→ Uttar Pradesh
→ Gorakhpur
```

Show full intelligence profile.

Include:

### Labour demand

### Training supply

### Forecast

### Qualification coverage

### Training centres

### Geographic access

### Recommendations

### Scenarios

---

# 25. OCCUPATION DETAIL

Clicking an occupation should open a deep-dive page.

Example:

# Solar PV Installer

Display:

```text
NCO Code
XXXX.XXXX

Sector
Green Jobs

NSQF
Level X

Current Demand
820

Effective Supply
430

Gap Score
84

6M forecast
1,020 demand

Shortage probability
71%
```

Then:

### Demand history

### Forecast

### Supply pipeline

### Employer signals

### Skills

### Qualifications

### Training centres

### District distribution

### Explainability

### Recommendation

---

# 26. QUALIFICATION / NSQF VIEW

Create:

# Qualification Intelligence

Show relationship:

```text
Occupation
↓
NCO
↓
Qualification Pack
↓
NSQF Level
↓
Skills
↓
Training Providers
```

Highlight:

- coverage
- demand
- supply
- relevance
- emerging skill requirements
- potential obsolescence

---

# 27. SCENARIO STUDIO — THE WOW SCREEN

This should be one of the strongest screens in the entire prototype.

Title:

# Scenario Studio

Subheading:

**Test policy decisions before implementing them.**

Left:

Current scenario

Right:

Scenario impact

Controls:

```text
Increase seats
[ +20% ]

Reduce seats
[ −10% ]

Shift seats
[ 500 ]

Demand shock
[ +15% ]

New centre
[ ON ]

Mobility factor
[ +10% ]
```

Then animate the results.

Before:

```text
Solar PV Installer
Gap Score: 84
Shortage: Severe
```

After:

```text
Gap Score: 39
Shortage: Moderate
```

Show:

### Projected impact

```text
−62% shortage
+14% supply coverage
₹X estimated intervention cost
```

Make the simulation feel real.

The controls MUST update numbers/charts.

---

# 28. POLICY RECOMMENDATION SCREEN

Title:

# Recommended Actions

Create ranked government interventions.

Example:

```text
#01
REDIRECT TRAINING CAPACITY

From:
Retail Sales Associate

To:
Solar PV Installer

District:
Gorakhpur

Seats:
500

Reason:
Persistent forecasted shortage

Expected impact:
62% gap reduction

Confidence:
71%
```

Buttons:

**Simulate**

**Approve draft**

**Export**

**View evidence**

---

# 29. RECOMMENDATION EXPLANATION

Every recommendation must show:

### Evidence

What data produced this decision?

### Forecast

What is expected to happen?

### Rationale

Why this intervention?

### Constraint

What prevents a bigger intervention?

### Expected outcome

What changes?

Use a beautiful expandable evidence drawer.

---

# 30. AI COPILOT

Add a premium floating assistant:

# Kaushal Copilot

But DO NOT make this the centre of the application.

It should be an assistant for the analytical system.

Examples:

> “Which occupations are likely to face shortages in Gorakhpur in the next 6 months?”

> “Why is Solar PV Installer showing a severe shortage?”

> “Where should Uttar Pradesh increase training capacity?”

> “What happens if we move 500 seats from retail to solar?”

Support English and Hindi.

Example Hindi:

> “गोरखपुर में सोलर इंस्टॉलर की कमी क्यों है?”

Responses MUST use application metrics and datasets.

Never allow the AI to invent values.

Every response should display:

```text
Source:
LMIS Analytics

Run:
RUN-2026-10-04-001

Confidence:
71%
```

---

# 31. DATA & MODEL HEALTH

Create a trustworthy governance page.

Title:

# Data & Model Health

Cards:

```text
Sources connected
8 / 11

Freshness
98%

Mapping confidence
91%

Forecast confidence
78%

Data quality
94%

Last successful run
2 hours ago
```

Then:

### Data source status

### Mapping quality

### Model performance

### Drift detection

### Pipeline history

### Data provenance

This gives the product credibility.

---

# 32. API & EXPORT

Build an actual export experience.

Create:

# API & Exports

Sections:

### Forecast API
### Gap API
### Recommendation API
### District API
### Occupation API

Show sample JSON.

Include:

**Download CSV**

**Download XLSX**

**Copy API endpoint**

Buttons should work.

---

# 33. RESPONSIVE DESIGN

The prototype must work on:

### Desktop
primary

### Laptop
fully functional

### Tablet
usable

### Mobile
simplified but functional

Do NOT simply shrink the desktop UI.

Recompose layouts intelligently.

---

# 34. MOTION DESIGN

Use motion heavily but tastefully.

Interactions:

- page transition
- glass surface hover
- chart reveal
- number count-up
- map transitions
- filter changes
- scenario calculations
- alert appearance
- recommendation expansion
- sidebar transition

Use Framer Motion or an equivalent.

Animations must feel:

**smooth, expensive, intentional**

not flashy.

Duration generally:

150–500ms.

Avoid excessive bouncing.

---

# 35. MICRO-INTERACTIONS

Add:

- hover depth
- cursor response
- subtle reflections
- active state transitions
- smooth toggles
- chart crosshair
- map hover
- contextual tooltips
- filter chips
- animated confidence indicators

The interface should feel “alive”.

---

# 36. DATA VISUALISATION STYLE

Use professional charts.

Prefer:

- area charts
- line charts
- ranked bar charts
- slope charts
- heatmaps
- distribution charts
- radial score indicators
- compact sparklines
- waterfall/contribution charts
- choropleths
- network/flow diagrams where appropriate

Do NOT use 3D pie charts.

Do NOT overload with charts.

Every visualization requires a clear question.

---

# 37. MAP STYLE

Use MapLibre GL JS or equivalent modern map technology.

Map should support:

### Normal
### Demand
### Supply
### Shortage
### Oversupply
### Forecast
### Training Centres

Use elegant map styling consistent with the liquid-glass UI.

Glass floating map controls.

Map tooltips must be beautiful.

---

# 38. DEMO DATA — MAKE THE PRODUCT FEEL REAL

Create a high-quality synthetic dataset.

At minimum include:

```text
4 States
16 Districts
4+ Sectors
30+ Occupations
50+ Qualifications
60+ months
Monthly observations
Training centres
Training seats
Certifications
Demand signals
Employer activity
Wage signals
PLFS-style labour context
e-Shram-style supply aggregates
Forecast data
Recommendations
Alerts
```

Seed realistic relationships.

---

# 39. CREATE A STRONG STORY IN THE DATA

Plant at least one major scenario.

## DEMO STORY

Create an emerging shortage in:

**Solar PV Installer**

in:

**Gorakhpur, Uttar Pradesh**

At the same time create an oversupply situation in:

**Retail Sales Associate**

The system should detect:

```text
Demand rising
+
Employer activity rising
+
Supply not keeping pace
=
Emerging shortage
```

Then:

### Alert

↓

### Forecast

↓

### Explainability

↓

### Recommendation

↓

### Scenario

↓

### Seat reallocation

↓

### Improved projected gap

This should be completely reproducible.

---

# 40. EVERYTHING MUST BE FUNCTIONAL

THIS IS NOT A FIGMA MOCKUP.

Implement real interactions.

For example:

### Filters
Actually update data.

### District map
Click → update dashboard context.

### Occupation
Click → detail page.

### Forecast horizon
3M / 6M / 12M changes forecast.

### Scenario sliders
Update calculated output.

### Recommendation
Open evidence.

### Export
Generate real downloadable CSV/XLSX.

### Language
EN / HI switches UI labels.

### Search
Search occupation/district.

### Notifications
Open alert centre.

### API
Return actual seeded data.

---

# 41. ROUTING

Create a proper route structure:

```text
/
 /overview
 /intelligence
 /forecasts
 /gaps
 /alerts
 /recommendations
 /scenarios
 /districts
 /districts/[id]
 /occupations
 /occupations/[nco]
 /qualifications
 /data-health
 /api
 /settings
```

No broken links.

No placeholder routes.

No dead buttons.

---

# 42. TECHNICAL STACK

Use a production-quality but hackathon-feasible stack.

Preferred:

### Frontend
Next.js
React
TypeScript
Tailwind CSS

### Motion
Framer Motion

### Charts
ECharts or Recharts

### Maps
MapLibre GL JS

### Backend
FastAPI

### Database
PostgreSQL
PostGIS

### Data
JSON/CSV/Parquet seeded fixtures

### ML
Python
LightGBM
statsforecast / equivalent baseline forecasting

### API
REST
OpenAPI

Use clean architecture and modular components.

---

# 43. PROJECT STRUCTURE

Create:

```text
frontend/
backend/
ml/
data/
scripts/
docs/
```

Within frontend:

```text
components/
charts/
maps/
layout/
glass/
filters/
tables/
modals/
screens/
lib/
hooks/
```

Create a reusable design system rather than manually styling every page.

---

# 44. DESIGN SYSTEM COMPONENTS

Build reusable components:

```text
GlassCard
GlassPanel
GlassButton
GlassSelect
GlassTabs
MetricCard
TrendCard
InsightCard
AlertCard
RecommendationCard
EvidenceDrawer
ForecastChart
GapChart
DistrictMap
DataTable
ScoreRing
ScenarioSlider
ConfidenceBadge
SourceBadge
EmptyState
LoadingState
CommandPalette
```

Every component must share the same visual language.

---

# 45. LIQUID GLASS DETAILS

Add subtle:

- internal highlight
- blur
- refraction-like gradients
- edge light
- hover movement
- background glow
- depth separation

BUT:

DO NOT make every card heavily translucent.

Use liquid glass mainly for:
- key controls
- navigation
- important panels
- hero metrics
- scenario controls
- floating elements

Use flatter surfaces where dense data tables need readability.

---

# 46. TABLE DESIGN

Government planners will use tables heavily.

Create premium data tables with:

- sticky headers
- sorting
- filtering
- pagination
- row hover
- column density controls
- severity badges
- confidence
- trend indicators
- row click

Tables should feel like high-end intelligence software.

---

# 47. EMPTY / LOADING / ERROR STATES

Do not use generic:

“Something went wrong.”

Instead create polished states:

### Loading

“Updating Labour Intelligence…”

### Data unavailable

“Forecast temporarily unavailable for this district.”

### Low confidence

“Limited source coverage — prediction confidence reduced.”

### No result

“No occupations match the current filters.”

---

# 48. ACCESSIBILITY

Maintain accessibility despite the premium visuals.

Ensure:

- adequate contrast
- keyboard navigation
- focus states
- screen reader labels
- semantic HTML
- reduced-motion support
- chart descriptions
- readable font sizes

Do not sacrifice usability for glass effects.

---

# 49. PERFORMANCE

Target:

- fast initial load
- lazy load heavy charts
- lazy load maps
- memoised expensive computations
- virtualised large tables
- cached dashboard queries

Avoid unnecessary dependencies.

---

# 50. DEMO MODE

Create a hidden/demo toggle:

**DEMO MODE**

When enabled:

- uses deterministic seeded data
- disables external API dependency
- makes every scenario reproducible
- shows “Demo Dataset” visibly
- ensures the prototype works offline

This is extremely important for SIH judging.

---

# 51. DO NOT CLAIM REAL LIVE GOVERNMENT DATA

Where data is synthetic or simulated:

display:

**Demo Dataset**

Where data comes from a public aggregate:

display:

**Public Aggregate**

Where future integration is intended:

display:

**Planned Government Feed**

Never create fake labels saying:

“Live NCS Data”

unless the actual feed exists.

---

# 52. TRUST / PROVENANCE UX

Every major analytical result should be traceable.

Example:

```text
Gap Score 84

Based on:
NCS-like demand feed
Training capacity
Certification pipeline
District labour context
Forecast model

Run ID:
RUN-2026-10-04-001
```

Use expandable provenance.

This should make the system feel government-grade.

---

# 53. DESIGN THE FIRST SCREEN LIKE A WINNING PRODUCT

The initial viewport must immediately communicate:

```text
WHERE?
WHAT?
WHY?
WHAT NEXT?
```

Example composition:

```text
┌────────────────────────────────────────────────────────┐
│ National Labour Market Intelligence         04 Oct     │
│ See what is changing — and what MSDE should do next.  │
├────────────────────────────────────────────────────────┤
│ Demand      Effective Supply      Net Gap     Alerts   │
├────────────────────────────────────────────────────────┤
│                                                        │
│              INDIA INTELLIGENCE MAP                    │
│                                                        │
├──────────────────────────┬─────────────────────────────┤
│ What changed             │ Priority Actions            │
│ ↑ Solar +21%             │ Solar PV / Gorakhpur        │
│ ↓ Retail −8%             │ Redirect 500 seats          │
├──────────────────────────┴─────────────────────────────┤
│ 6-Month Outlook                                        │
└────────────────────────────────────────────────────────┘
```

But do not literally reproduce this crude wireframe visually. Turn it into a sophisticated premium composition.

---

# 54. PRODUCT PERSONALITY

The platform should feel:

**Authoritative**  
**Calm**  
**Intelligent**  
**Predictive**  
**Evidence-driven**  
**Government-ready**  
**Modern**  
**Premium**

It should NOT feel:

**Playful**  
**Cyberpunk**  
**Startup-y**  
**Overly futuristic**  
**Consumer social app**

---

# 55. LOGO / BRAND

Use:

# KaushalPulse

Descriptor:

**Labour Market Intelligence**

Create a minimal text-based brand mark / icon if needed.

Do not spend excessive development time on logo illustration.

The product itself is the hero.

---

# 56. IMPORTANT — JUDGE-FIRST UX

Every screen should help answer an SIH judge's questions:

### “Where is the demand?”

### “Where is the supply?”

### “What happens next?”

### “How accurate is the prediction?”

### “Why does the system say this?”

### “What should the government do?”

### “What happens if the government follows that recommendation?”

### “Can this integrate into government workflows?”

The UI must visually answer these questions.

---

# 57. FINAL DEMO FLOW

Build the application so the team can perform this exact demo:

### STEP 1
Open Overview.

### STEP 2
Select Uttar Pradesh.

### STEP 3
Open Gorakhpur.

### STEP 4
Show rising Solar PV Installer demand.

### STEP 5
Open Forecast.

### STEP 6
Switch 3M → 6M → 12M.

### STEP 7
Show shortage probability.

### STEP 8
Open explanation.

### STEP 9
Open Recommendation.

### STEP 10
Show:

**Redirect 500 seats from Retail Sales Associate → Solar PV Installer**

### STEP 11
Open Scenario Studio.

### STEP 12
Apply the intervention.

### STEP 13
Show projected gap reduction.

### STEP 14
Ask Kaushal Copilot in Hindi.

### STEP 15
Export recommendation.

This should be smooth enough to perform live without searching around.

---

# 58. FINAL QUALITY BAR

Before considering the prototype complete, perform a complete product audit.

Check:

## UX
- no broken navigation
- no dead buttons
- clear information hierarchy
- consistent spacing
- consistent typography
- consistent glass treatment

## Data
- deterministic
- believable
- internally consistent
- connected to charts

## Functional
- filters work
- maps work
- scenarios work
- exports work
- language toggle works
- routing works

## Technical
- no console errors
- no TypeScript errors
- no broken API calls
- no hydration errors
- responsive layouts

## Presentation
- polished first viewport
- no placeholder lorem ipsum
- no “coming soon” unless intentionally shown
- no fake live-data claims
- no unfinished components

---

# 59. MOST IMPORTANT DIRECTIVE

DO NOT rush to make 30 screens.

Prioritize **depth over breadth**.

A smaller number of extremely polished, interconnected screens is better than dozens of shallow pages.

The core experience must be:

# INTELLIGENCE → FORECAST → GAP → ACTION → SIMULATION

If a feature does not strengthen this flow, deprioritize it.

---

# 60. START BUILDING

Do NOT merely return a design proposal.

DO NOT return a wireframe.

DO NOT return pseudo-code.

DO NOT create static screenshots.

Actually generate the complete working application.

Start by:

1. establishing the design system
2. creating the application shell
3. creating deterministic demo data
4. implementing the dashboard
5. implementing the forecast experience
6. implementing gap detection
7. implementing recommendations
8. implementing Scenario Studio
9. implementing map intelligence
10. implementing the copilot
11. implementing exports
12. testing the entire flow

Then perform a final visual and functional QA pass.

The final result should look like a **national-scale Labour Market Intelligence product that could plausibly be shown to MSDE leadership**, while remaining a fast, reliable, fully interactive SIH prototype.

# FINAL SUCCESS CRITERION

A judge should be able to look at the first screen and understand in under 10 seconds:

> **“This platform predicts where India will have skill shortages or oversupply, explains why, and tells MSDE exactly how to adjust training capacity.”**

And after a 3-minute demo:

> **“This is not just a dashboard. It is a decision engine.”**
