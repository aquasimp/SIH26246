# KAUSHALPULSE — FINAL MASTER PROMPT
## 10/10 Premium Liquid-Glass UI/UX Transformation (Light + Dark + English + Hindi)

**Project:** KaushalPulse
**Problem statement:** SIH 2026 — PS 26246 (MSDE) — AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine
**Live references:** https://kaushalpulse.vercel.app/ · https://sih-26246.vercel.app/scenarios
**Repo layout:** backend/ML at repo root (`pytest tests/ -v`), Next.js frontend in `frontend/` (`npm run build`)

This single document is the complete instruction set. Nothing else needs to be appended.

---

# 0. HOW TO RUN THIS (READ FIRST)

You are a combined World-class Product Designer, Senior UX Architect, Senior Frontend Engineer, Design-Systems Engineer, Data-Visualization Designer, Accessibility Engineer, Performance Engineer, SIH Demo-Experience Designer and Government Digital Product Designer.

Your task is **NOT** to rebuild KaushalPulse. Transform the EXISTING application into a **premium, liquid-glass, government-grade national intelligence platform** with a strict 10/10 quality bar across every route, theme, device, language, state and interaction.

**Work in phases. Commit after each phase. Run the gates at each checkpoint. Do NOT touch everything at once.**

| Phase | Scope | Gate before moving on |
|---|---|---|
| 1 — Truth & tokens | §4: mismatch fixes, single source of truth, tokens, glass, theme provider + toggle, typography | `pytest tests/ -v` = 27 passed · `npm run build` = 30/30 · no flash of wrong theme |
| 2 — Shell & primitives | §5: sidebar, topbar, Data Source control, command palette, KPI/Badge/Provenance components, states, tables, chart palette, dark map, focus mode | build green + screenshots light/dark |
| 3 — Demo-critical routes | §6: Overview, Forecasts, Recommendations, Scenario Studio — full QA in light, dark, EN, HI, 375/768/1280/1920 | Playwright UI-vs-API tests green for these routes |
| 4 — Remaining routes | §7: Intelligence, Gaps, Alerts, Districts, District detail, Occupations, Occupation detail, Qualifications, Data & Model Health, API & Exports, Settings, Copilot | route audit table filled |
| 5 — Reduction & proof | §9: visual-reduction pass, destructive test, axe + Lighthouse, screenshots, final report | all gates in §9 |

Phases 1–3 are the **minimum shippable product**. If time runs short, finish those completely instead of half-finishing everything.

Operating principle: **Inspect. Measure. Compare. Fix. Retest. Polish. Retest again.** Do not stop at "looks good" or after the first green build. Do not only recommend — do the work. Do not remove functionality for visual simplicity. Do not add unnecessary features or libraries.

---

# 1. ABSOLUTE RULES

## 1.1 Preserve the existing system
DO NOT redesign from scratch. DO NOT rewrite the backend. DO NOT change ML logic, forecasting logic, demand/supply calculations, the gap engine, the recommendation engine, scenario mathematics, donor-safety rules, database architecture or API contracts — unless a clearly identified credibility/UI-integration problem requires it. Adding a **read-only** endpoint that serves existing artifacts (e.g. benchmark metrics, alert counts) is allowed; changing any computation is not.

Quality gates that MUST remain true after every phase: **27/27 backend/ML tests passing · 30/30 Next.js routes building · zero TypeScript errors · zero ESLint errors · zero hydration errors.**

## 1.2 This is NOT a generic AI dashboard
DO NOT produce: dark-navy AI SaaS, cyberpunk, neon dashboard, generic admin panel, Power BI clone, generic startup dashboard, excessive purple/blue glow, excessive rounded cards, excessive pill components, card-inside-card-inside-card layouts, or a developer-tool look.

The product must feel like **executive intelligence software + modern government digital infrastructure + liquid glass + editorial hierarchy + high-end data visualization.** Original design only. Personality: calm, premium, authoritative, intelligent, modern, restrained, highly polished — never flashy, gamer-like, childish or over-futuristic.

## 1.3 No misrepresentation
Never claim "Live NCS data", "Live government feed", "AI confidence 99%" or "Model accuracy 99%" unless actually verified. Display the data mode clearly. The data is a **pipeline snapshot**, not a live feed.

## 1.4 No hardcoded analytics, no hardcoded colours
Every analytical number comes from the canonical API/data source. No component-level `#fff`, `#000`, `bg-white`, `text-gray-*` or random inline colours outside the token file (documented exceptions only).

## 1.5 Data-availability rule (prevents fabrication)
Several requested sections may have no backing data (occupation Skills, Qualifications distribution, Employers, Notifications, model-evaluation artifacts, Copilot grounding).
- If a field does not exist in the API/dataset: **do not invent it and do not silently delete the section.** Render a quiet "Not available in this dataset" state and list it under *Remaining weaknesses* in the final report.
- **Refresh** control: never imply a live feed. Label it "Last run" / "Re-run pipeline".
- **Alert actions** (Investigate / Simulate / Act): each must navigate to a real screen with context pre-filled (District/Occupation page, Scenario Studio, Recommendations). No dead buttons.
- **Copilot**: answers must be built from API values with citation chips. If the backend has no grounded answering, restrict to templated answers over current API data and show "Answers use current dashboard data only." Never present canned text as live analysis; never fabricate numbers; if data is insufficient, say so.

---

# 2. 10/10 QUALITY BAR

Aim for 10/10 in all of: visual design · liquid-glass quality · dark mode · light mode · information hierarchy · data visualization · Scenario Studio · responsiveness · accessibility · English/Hindi · navigation · interaction quality · data credibility · source/provenance visibility · performance · government-grade professionalism · SIH demo experience · consistency across every route. Do not optimize one area by damaging another. **Do not claim 10/10 unless measured evidence proves it.**

---

# 3. THE PRODUCT STORY THE UI MUST TELL

INTELLIGENCE → FORECAST → GAP → EXPLANATION → ACTION → SIMULATION

A judge who has never seen the app must understand: within 10 s — this is a labour-market planning system; within 30 s — it predicts future skill gaps; within 2 min — it converts predictions into government actions; within 3 min — they have seen Forecast + Gap + Recommendation + Scenario impact + Export.

---

# 4. PHASE 1 — TRUTH & TOKENS

## 4.1 Known mismatches to eliminate (found on the live deploy, 6 Oct 2026)
Search the whole repo for the source of each (almost certainly hardcoded fixtures/strings) and bind it to the canonical API.

| Where | UI currently shows | Canonical (verified audit) |
|---|---|---|
| Overview → What Changed | Solar PV demand **+21.4%**, Retail **-8.2%** | Solar **-0.1%**, Retail **-10.0%** (6M, t-6→t) |
| Overview → Gorakhpur panel | Gap Score **84**, Shortage Risk **71%** | Solar Gap Score **94**, 6M shortage probability **88%** |
| Overview → Gorakhpur panel | **2 Centres / 180 Active Seats** | Solar **217** seats, Retail **916** seats |
| Overview KPI vs nav badge | Active Alerts **5** vs badge **4** | one count from the alert engine (35 anomalies; Persistent Shortage = Alert #1) |
| Scenario Studio default | **99 seats**, ₹18.43L, -15.8%, donor score **53** | **97 seats**, ₹18.31L, -15.6%, donor score **52** |
| Scenario Studio sentence | "6.1% to 13.8%" | **6.2%–13.8%** |
| Scenario Studio target card | "Net Deficit: -17%" (it is the reduction) | shortfall 711 → 588; reduction labelled separately |
| Scenario Studio donor check | "Protected (Score ≤ 59)" under Strict | Strict limit is Score ≤ 52 |

**Reference values to verify against (fetch from the canonical source — NEVER hardcode into components):**
- Gorakhpur Solar PV Installer (NCO 7126.0101, Official SIH): Demand 808 · Training Seats 217 · Available Supply 139 · Effective Supply 97 · Gap Score 94 · Severe Shortage.
- Gorakhpur Retail Sales Associate (NCO 5223.0101, Official SIH): Demand 380 · Training Seats 916 · Available Supply 577 · Effective Supply 404 · Gap Score 47 · Balanced.
- Scenario Studio Strict default: 97 seats · donor score 52 · package cost ₹18.31L · reallocation-alone deficit closure 6.2% · combo closure 15.6%.
- Verified out-of-sample benchmark (must stay dynamically sourced from evaluation artifacts): 3M LightGBM WAPE 3.71% · 6M LightGBM WAPE 3.58% · 12M ensemble WAPE 3.41% · Seasonal Naive worse at every horizon.

**"Load Recommendation #01 Preset" must land exactly on 97 seats / donor 52 / ₹18.31L / 6.2% alone / 15.6% combo.** Add a Playwright test asserting this against the API.

## 4.2 One truth per cell
Every analytical number in Overview, Labour Intelligence, Forecasts, Skill Gaps, Alerts, Recommendations, District pages, Occupation pages, Scenario Studio, Copilot and Exports must come from the same source and equal the corresponding API result. Add automated checks (see §9.2).

## 4.3 Sign convention, scope, provenance, data source
- **Sign convention:** show shortages as a positive **SHORTFALL 711**, never `-711` / `-17%` / "Net Deficit -17%". A percentage that represents reduction is labelled **DEFICIT REDUCTION -17%**. Users must never interpret signs.
- **Scope visibility:** every analytical card/table/chart shows scope where needed, e.g. `Gorakhpur · Solar PV Installer · 6M`, so a "National" title never sits above a district-specific number without a scope label.
- **Provenance:** reusable `<Provenance>` chip on every major data component — `Official SIH` · `Synthetic Demo` · `Public Aggregate` · `Future Feed`. Subtle, never overwhelming.
- **Data Source control:** replace the ambiguous "SIH Mode / Demo Mode" pair with one segmented control **DATA SOURCE: [ SIH DATASET ] [ DEMO DATASET ]** plus an info tooltip explaining the difference.
- **Breadcrumb:** `MSDE Intelligence / India / Uttar Pradesh / Gorakhpur / Overview` (do not uppercase the district).
- **Safety-rule labels, one unit everywhere:** `Strict ≤ 5% deficit` · `Moderate ≤ 10%` · `Permissive ≤ 18.9% (Score ≤ 59)`.

## 4.4 Design tokens (graphite dark, ivory light — adjust only if axe contrast fails)
One token system consumed by every page. Central tokens: background, glass, glass-strong, overlay, border, border-strong, highlight, text, text-muted, text-faint, brand, brand-secondary, ring, shadow; semantic: severe, moderate, balanced, oversupply, warning, success, forecast.

```css
:root {
  color-scheme: light;
  --radius: 14px;
  --bg: #F7F6F2;
  --bg-atmo-1: rgba(63,81,199,.07);
  --bg-atmo-2: rgba(18,129,138,.06);
  --glass: rgba(255,255,255,.66);
  --glass-strong: rgba(255,255,255,.82);
  --overlay: rgba(255,255,255,.90);
  --surface-solid: #FFFFFF;
  --border: rgba(20,23,28,.08);
  --border-strong: rgba(20,23,28,.14);
  --highlight: rgba(255,255,255,.85);
  --text: #14171C;
  --text-muted: #434A57;
  --text-faint: #5E6573;
  --brand: #3F51C7;
  --brand-secondary: #12818A;
  --ring: rgba(63,81,199,.45);
  --shadow: 0 1px 2px rgba(20,23,28,.05), 0 10px 30px rgba(20,23,28,.06);
  --severe: #C62828;  --moderate: #955800;  --balanced: #0B7A55;
  --oversupply: #1D5FC4;  --warning: #955800;  --success: #0B7A55;  --forecast: #3F51C7;
}
.dark {
  color-scheme: dark;
  --bg: #090A0C;            /* graphite scale: #090A0C #0F1115 #14171C #1A1E24 */
  --bg-atmo-1: rgba(140,156,245,.07);
  --bg-atmo-2: rgba(95,196,201,.05);
  --glass: rgba(255,255,255,.045);
  --glass-strong: rgba(255,255,255,.065);
  --overlay: rgba(26,30,36,.82);
  --surface-solid: #14171C;
  --border: rgba(255,255,255,.08);
  --border-strong: rgba(255,255,255,.14);
  --highlight: rgba(255,255,255,.07);
  --text: #E9ECF1;
  --text-muted: #A7AEBB;
  --text-faint: #7D8593;
  --brand: #8C9CF5;
  --brand-secondary: #5FC4C9;
  --ring: rgba(140,156,245,.55);
  --shadow: 0 14px 44px rgba(0,0,0,.50);
  --severe: #F2706B;  --moderate: #E9B44C;  --balanced: #4FC79A;
  --oversupply: #6FA8F0;  --warning: #E9B44C;  --success: #4FC79A;  --forecast: #8C9CF5;
}
body { background: var(--bg); color: var(--text); font-family: var(--font-sans), system-ui, sans-serif; }

/* atmosphere: fixed layer, extremely slow drift, transform-only, no neon blobs */
body::before {
  content: ""; position: fixed; inset: -10%; z-index: -1; pointer-events: none;
  background:
    radial-gradient(900px 520px at 12% -8%, var(--bg-atmo-1), transparent 60%),
    radial-gradient(800px 500px at 95% 0%,  var(--bg-atmo-2), transparent 60%);
  animation: atmo-drift 120s ease-in-out infinite alternate;
  will-change: transform;
}
@keyframes atmo-drift { to { transform: translate3d(-2%, 1.5%, 0) scale(1.03); } }
@media (prefers-reduced-motion: reduce) { body::before { animation: none; } }
```
If Tailwind is present: `darkMode: 'class'` and map every token in `theme.extend.colors` as `var(--token)`. Severity colours must match the map legend exactly: Severe Shortage (Gap > 75) · Moderate (60–75) · Balanced (40–60) · Oversupply (< 40).

## 4.5 Surface model and liquid glass
Do NOT make every section a rounded card. Hierarchy comes from spacing + typography + light + transparency + depth, not borders everywhere. The UI must feel like ONE PRODUCT, not "50 cards placed next to one another."

| Surface | Use | Style |
|---|---|---|
| `flat` | page background, section headings, text blocks, most content | no container: spacing + typography only |
| `glass` (L1) | primary panels (map panel, chart panel, filter bar) | blur 14px |
| `glass-strong` (L2) | focused cards, sidebar, topbar, recommendation cards | blur 24px |
| `overlay` (L3) | modals, command palette, Copilot drawer, WHY panel | blur 32px |

```css
.glass, .glass-strong, .overlay {
  border: 1px solid var(--border); border-radius: var(--radius);
  box-shadow: inset 0 1px 0 var(--highlight), var(--shadow);
}
.glass        { background: var(--glass);        -webkit-backdrop-filter: blur(14px) saturate(140%); backdrop-filter: blur(14px) saturate(140%); }
.glass-strong { background: var(--glass-strong); -webkit-backdrop-filter: blur(24px) saturate(150%); backdrop-filter: blur(24px) saturate(150%); }
.overlay      { background: var(--overlay); border-color: var(--border-strong);
                -webkit-backdrop-filter: blur(32px) saturate(160%); backdrop-filter: blur(32px) saturate(160%); }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass, .glass-strong, .overlay { background: var(--surface-solid); }
}
```
Rules: never nest glass inside glass · never apply `backdrop-filter` to table rows or list rows · at most ~6 heavy blurred layers visible at once · tables and dense analytics prioritize readability · glass must never reduce text contrast below WCAG AA (check against the worst-case spot of the atmosphere).

## 4.6 True dark mode and light mode
- **Dark:** first-class on EVERY route; not an inversion of light. Feels like night intelligence + executive operations + premium glass. Graphite/charcoal foundation (not navy). Very subtle indigo/teal atmosphere only; no neon. Dark glass uses translucent whites (.045 / .065 / .085), low-opacity borders, soft shadows, subtle inner highlights, and stays readable.
- **Light:** keep and refine the current premium light-glass identity — ivory/white base, very subtle blue/indigo atmosphere; refine transparency, borders, shadows, spacing, typography, chart presentation.
- Theme transitions smooth but subtle; no flash of wrong theme on load (verify with CPU throttling + hard reload).

## 4.7 Theme wiring (adapt if an equivalent already exists; do not add a second system)
```tsx
// app/providers.tsx
'use client';
import { ThemeProvider } from 'next-themes';
export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>{children}</ThemeProvider>;
}
// app/layout.tsx → <html lang={locale} suppressHydrationWarning> … <Providers>{children}</Providers>
```
```tsx
// ThemeToggle — Light / Dark / System, radiogroup, no hydration mismatch; also mirrored in Settings
'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
const OPTIONS = [{ id: 'light', icon: Sun, label: 'Light' }, { id: 'dark', icon: Moon, label: 'Dark' }, { id: 'system', icon: Monitor, label: 'System' }] as const;
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-[104px]" aria-hidden />;
  return (
    <div role="radiogroup" aria-label="Theme" className="glass inline-flex rounded-full p-0.5">
      {OPTIONS.map(({ id, icon: Icon, label }) => (
        <button key={id} role="radio" aria-checked={theme === id} aria-label={label} onClick={() => setTheme(id)}
          className={`grid h-9 w-9 place-items-center rounded-full transition ${theme === id ? 'bg-[var(--glass-strong)] text-[var(--brand)]' : 'text-[var(--text-faint)] hover:text-[var(--text)]'}`}>
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
```
```ts
// Chart palette: re-read tokens after the class has actually changed (avoids the timing race)
export function useChartPalette() {
  const { resolvedTheme } = useTheme();
  const [p, setP] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const s = getComputedStyle(document.documentElement);
      const v = (n: string) => s.getPropertyValue(n).trim();
      setP({ text: v('--text-muted'), grid: v('--border'), brand: v('--brand'), forecast: v('--forecast'),
             severe: v('--severe'), moderate: v('--moderate'), balanced: v('--balanced'), oversupply: v('--oversupply') });
    });
    return () => cancelAnimationFrame(raf);
  }, [resolvedTheme]);
  return p;
}
```

## 4.8 Typography
- **Primary UI font: Inter via `next/font`**, exposed as `--font-sans`. Trade Gothic is a commercial typeface and cannot be shipped without a licensed web-font file or Adobe Fonts kit — use it only if licensed files are supplied in the repo; switching must be a one-line change to `--font-sans`.
- `--font-mono`: Geist Mono or JetBrains Mono (NCO codes, run IDs). Hindi: **Noto Sans Devanagari**, applied when `lang="hi"`.
- `font-variant-numeric: tabular-nums` on KPIs, tables, charts, scores, currency, percentages, run IDs; right-align numeric columns.
- Clear type scale (e.g. 12 / 13 / 14 / 16 / 20 / 28 / 36), one H1 per page, never tiny unreadable text for important analytics. Number formatting helper (`10.3K`, `₹18.31 L`, `+6.2%`), Indian digit grouping where full numbers are shown.

---

# 5. PHASE 2 — SHELL & PRIMITIVES

## 5.1 Sidebar
Floating glass-strong navigation, ~270–285px expanded. **Below 1366px viewport width it defaults to the collapsed icon rail.** Group navigation:
- **INTELLIGENCE** — Overview, Labour Intelligence, Forecasts, Skill Gaps
- **ACTION** — Early Warnings, Recommendations, Scenario Studio
- **EXPLORE** — Districts, Occupations, Qualifications
- **SYSTEM** — Data & Model Health, API & Exports, Settings

Active state: subtle glass fill + brand tint + 2px accent indicator + soft depth. Remove harsh dark outlines. Badges as small severity-tinted pills. Collapsed state must work beautifully. Full keyboard navigation. Mobile (< 1024px): drawer.

## 5.2 Topbar
Sticky glass-strong. LEFT: breadcrumb `MSDE Intelligence / India / State / District`. CENTER: global search trigger (`Ctrl K` / `⌘ K`). RIGHT: Data Source · "Last run" status · Theme · Language (EN / हिन्दी) · Copilot · Notifications · Planner profile. Do not overload; collapse secondary controls into a menu on small screens. Replace "Refreshed 2h ago | RUN-SIH-001" with a status dot + `Last run RUN-SIH-001 · 2h ago` and a tooltip with model/data version.

## 5.3 Command palette (`cmdk`, overlay glass, `Ctrl K` / `⌘ K`)
Search districts, occupations, NCO codes, sectors, qualifications, pages, recommendations. Commands: Go to Overview · Go to District · Search Occupation · Search NCO · Search Qualification · Open Scenario Studio · **Load Recommendation #01 preset** · **Toggle theme** · Jump to district.

## 5.4 Reusable components (one of each; no random variants)
- **KPI:** Label · big number (count-up only where useful; respect reduced motion) · delta chip (▲/▼ + colour + explicit label) · scope subtitle · mini trend (6 points) · provenance. Severe cards get a subtle severity-tinted edge.
- **Badge:** variants `severe | moderate | balanced | oversupply | neutral | official | synthetic`. Colour is always paired with icon + text.
- **Provenance chip, Skeleton (glass shimmer), EmptyState, ErrorState, Toast** (`sonner`).
- **System status line** (tiny, elegant, on analytical pages): `RUN-SIH-XXX · SIH Dataset · Model vX.X · Updated X ago · ● Systems Operational`.

## 5.5 Loading / empty / error copy
Loading: "Updating labour intelligence…" · Empty: "No occupations match the current filters." · Insufficient data: "Not enough historical observations for a reliable forecast." · Low confidence: "Limited source coverage — confidence reduced." · Error: "Unable to load this intelligence view. [Retry]". No raw technical errors reach the user.

## 5.6 Tables (premium intelligence software)
Sticky header, subtle row separators, sortable columns (`aria-sort`), severity pills, confidence, trend indicators, inline sparklines where useful, row actions, CSV export, horizontal scroll with sticky first column on mobile. No heavy grid, no giant cell padding, no backdrop-filter on rows.

## 5.7 Chart system (light + dark)
Charts respond to theme changes (use `useChartPalette`). Never a white chart background in dark mode. Theme-aware axes, labels, grid (`--border`), tooltips (glass), forecast, confidence, selection, severity colours. `tabular-nums` on axes.

## 5.8 Map
Supports layers: Demand · Supply · Shortage · Oversupply · Forecast · Training Centres. Light and dark map styles (e.g. a dark basemap in dark mode, or token-filled SVG choropleth). Liquid-glass controls and legend. Selected district: brand ring. Severity: semantic signal with soft glow. Tooltips: premium glass. The map must never become decorative. Map and tables use exactly the same backend values.

## 5.9 Focus Mode
Optional FOCUS MODE hides secondary UI (sidebar, secondary panels) and maximizes the primary analytical surface — for maps, forecast charts, Scenario Studio and judge demonstrations. Toggle via topbar button and command palette; `Esc` exits.

---

# 6. PHASE 3 — DEMO-CRITICAL ROUTES

## 6.1 Overview
Must answer within 10 seconds: WHAT IS HAPPENING? WHERE? WHAT WILL HAPPEN? WHAT SHOULD WE DO? **No wall of KPI cards.**
- Hero: "National Labour Market Intelligence" → compact row: Demand Pressure · Effective Workforce · Structural Gap (as Shortfall) · Early Warnings · Priority Actions. Every KPI carries a scope subtitle.
- **One dominant visualization: the map** (primary visual), with the Selected Geography panel beside it.
- **What changed** — intelligent insight stream, based on actual current data (e.g. "Solar PV Installer — shortage persists", "Retail Sales Associate — capacity inefficient", "Drone Maintenance Technician — demand accelerating"). Generated from the alert engine / velocity data, never typed in.
- **Decision ribbon** where useful: `ACTION REQUIRED · Gorakhpur · Solar PV Installer · Projected shortage XX% · Recommended +XXX seats · [Investigate] [Simulate]` (all values from the API).
- Filters: collapse the stacked filter groups into one sticky glass row of pills (State · District · Sector · Occupation · Horizon) with Reset. Occupation becomes a searchable combobox grouped by sector; Horizon becomes a segmented 3M / 6M / 12M control.

## 6.2 Forecasts
Visually communicate HISTORICAL → FORECAST → SUPPLY → GAP:
- Historical: solid line · Forecast: dashed line · Confidence: transparent area (80% / 95% in two opacities) · Supply: second line · Gap: subtle shaded region.
- Controls 3M / 6M / 12M. Compact model metadata: Model · Baseline · WAPE · Confidence · Run ID — technical details must not dominate the hierarchy.
- **Forecast credibility:** any displayed benchmark metric (WAPE, RMSE, MASE, coverage) is sourced dynamically from the actual evaluation artifacts — never typed in. The Seasonal-Naive baseline is shown as the comparison. Reference verified values are listed in §4.1.

## 6.3 Recommendations
Actionable policy intelligence. Example card — `RECOMMENDATION #01 · Redirect training capacity · Source Trade: Retail Sales Associate · Target Trade: Solar PV Installer · Seats: 97 · Expected impact (computed) · Confidence (computed)`; actions **Simulate** · **View Evidence** (drawer) · **Export**. Rank number in a brand ring, KPIs in an aligned 3-column mini-grid, premium hierarchy.

## 6.4 Scenario Studio — the visual centrepiece
It must feel like POLICY SIMULATION, not a form with sliders.

**Layout:** three columns (Policy Controls | Intervention Preview | Projected Outcome) only at ≥ 1536px. At 1024–1535px use two columns: sticky Controls on the left, Impact Summary on top of a stacked Preview + Outcome on the right. Below 1024px: single column with a sticky Impact Summary bar.

**Impact Summary (top of results):** Gap Score `94 → 86` · Shortfall `711 → 588` · Deficit Reduction `XX%` · Package Cost `₹XX.XXL` — all computed, animated transitions.

**Controls** (easy for non-technical planners; value + minus/plus + slider where appropriate; real switches `role="switch"`; inline help tooltips): Transfer Seats · Batch Capacity Scaling · Demand Shock · New Training Centre (Greenfield ITI) · Mobility Factor.

**Seat slider:** draw the **donor-safe cap directly on the track** (`SAFE CAP 97 SEATS`), colour the track beyond it as "blocked by policy constraint", value bubble follows the thumb, ticks at 0 / 250 / 500 / 1,000.

**Constraint visualization — never silently auto-shrink.** If the donor cannot safely provide the requested number, show: `Requested: 500 · Safe: 97 · Constraint: Donor would enter shortage territory`, with a clear explanation.

**Safety rule:** replace the large static policy block with a compact "Safety constraints active" chip; **WHY?** opens an overlay-glass explanation panel with the donor math and the three rules (`Strict ≤ 5% deficit · Moderate ≤ 10% · Permissive ≤ 18.9% / Score ≤ 59`).

**Before/After hero:** BEFORE `94 Severe Shortage` → POLICY INTERVENTION → AFTER `86 Severe Shortage`, then Added effective candidates · Deficit reduction · Package cost. Underneath, a **supply-vs-demand bullet bar** with the added supply segment in `--brand`, making visible that reallocation alone does not solve the shortage (an important intelligence insight). Donor card shows its safe-equilibrium band with a clear check.

**Sensitivity matrix:** Strict / Moderate / Permissive; highlight the active rule, pin Strict with a "Default" pill; tabular numbers, small severity indicators, minimal borders, collapsible accounting-basis notes.

**Real Donor Analysis:** compact ranked visualization of Effective Supply ÷ Demand per district/trade with the 1.2× threshold line, so the insight "No safe donor exists above X" is immediate.

**Other:** `aria-live="polite"` on results; "Export Report" shows loading → success toast; calculations memoised.

---

# 7. PHASE 4 — REMAINING ROUTES

Every route must work in LIGHT, DARK, ENGLISH and HINDI, and use the same tokens/components.

- **Labour Intelligence / Skill Gaps:** Gap intelligence with SHORTAGE / BALANCED / OVERSUPPLY and severity; Gap Score, Shortfall, Shortage Probability, Data Confidence. Never colour alone — always icon + text.
- **Early Warnings → "INTELLIGENCE SIGNALS":** not generic notifications. Supported types: Persistent Shortage · Emerging Shortage · Capacity Inefficiency · Emerging Oversupply · Emerging Occupation · Geographic Imbalance · Skill Obsolescence. **Only show alerts produced by the actual alert engine; no manually injected values.** Each alert: Severity · Occupation · District · Trigger · Forecast Horizon · Confidence; actions Investigate · Simulate · Act (each navigates per §1.5). Qualitative domain context is a clearly separated callout labelled "Context, not model output".
- **Districts:** STATE → DISTRICT → OCCUPATION; highly visual. Show Demand · Effective Supply · Gap · Forecast · Top Shortages · Top Oversupply · Training Capacity · Alerts · Actions. Map and tables use identical backend values.
- **Occupation detail — an intelligence dossier** (e.g. `SOLAR PV INSTALLER · NCO 7126.0101 · Current Demand · Effective Supply · Gap Score · Severity`), then: Demand history · Forecast · Supply · Skills · Qualifications · District distribution · Evidence · Recommendation (apply §1.5 for any field that does not exist).
- **Qualifications, Data & Model Health, API & Exports, Settings:** same system; API page code blocks respect tokens; Settings mirrors Theme (Light/Dark/System) and Language.
- **Kaushal Copilot:** right-side overlay-glass drawer, secondary (not the centre of the app). Suggested questions: "Which occupations face shortages?" · "Why is Solar PV Installer showing a shortage?" · "Where should Gujarat increase training?" · "What happens if we add 150 seats?" · "Which districts have capacity inefficiency?" English + Hindi; citation chips; rules in §1.5.

---

# 8. CROSS-CUTTING REQUIREMENTS

- **Responsive** — test 375 / 768 / 1280 / 1920px. Desktop: full dashboard. Tablet: recomposed layouts. Mobile: drawer navigation, condensed topbar, stacked insights, horizontal table scroll, touch targets ≥ 40px. No horizontal page scroll.
- **Hindi** — check navigation, filters, Overview, Scenario Studio, Alerts, Recommendations, Copilot. Hindi strings run ~20–30% longer: use `min-w-0`, wrapping and truncate-with-tooltip on filter pills, KPI labels and table headers; verify no clipping, overflow, alignment, button-width, table-width, chart-label or navigation-width problems at 375px.
- **Accessibility (WCAG AA)** — contrast, visible 2px `--ring` focus with offset, keyboard navigation, semantic HTML, screen-reader labels, `aria-live`, reduced motion, accessible tooltips, colour + text redundancy, skip-to-content link. Glass must never reduce readability.
- **Performance** — audit first load, maps, charts, tables, route transitions, scenario calculations, bundle size. Use lazy loading, memoisation, caching, virtualization, code splitting. No unnecessary libraries.
- **Motion** — 150–300ms; page transitions, chart reveal, KPI transitions, card hover lift (2px), map transitions, scenario result transitions, drawer transitions; KPI cards stagger ~40ms. No bounce, nothing flashy. Everything disabled under `prefers-reduced-motion`.
- **Metadata** — favicon, route-specific `<title>`, OG metadata (dark OG image), `theme-color` for light and dark, app metadata.

---

# 9. PHASE 5 — REDUCTION, PROOF, QA

## 9.1 Visual-reduction pass
For every visible element ask: does it improve understanding, decision-making, navigation, trust or usability? If not, remove it, simplify it or reduce its visual weight. The result must have more whitespace and hierarchy, not more clutter.

## 9.2 UI/API consistency tests (Playwright)
Open Overview, Scenario Studio, Forecasts, Recommendations, Alerts (and other routes where practical); collect displayed analytical values; compare with API values. No displayed number may silently diverge from the API. Include the §4.1 preset assertion.

## 9.3 Destructive test
Change a real input (e.g. increase Solar PV demand) and verify that Demand, Forecast, Gap, Alert (may), Recommendation (may) and Scenario change accordingly. If the UI does not react to underlying data, find and fix the disconnect (restore the input afterwards).

## 9.4 Theme QA
Hard-reload every major route in dark mode, then light mode. Verify: no white flashes · no unreadable text · no invisible icons · no white chart backgrounds · no light-only shadows · no broken map styling · no broken dropdowns · no broken inputs. Repeat key screens in Hindi.

## 9.5 Route audit
For every route verify LIGHT · DARK · ENGLISH · HINDI · DESKTOP · TABLET · MOBILE · LOADING · EMPTY · ERROR · REAL DATA. Routes: `/overview` `/intelligence` `/forecasts` `/gaps` `/alerts` `/recommendations` `/scenarios` `/districts` `/districts/[id]` `/occupations` `/occupations/[nco]` `/qualifications` `/data-health` `/api` `/settings`. No route may remain visually inconsistent.

## 9.6 Automated quality gates
Run `pytest tests/ -v`, `npm run build`, `npm test` (if configured), Playwright, an axe accessibility audit and Lighthouse where available. Also `grep` for hardcoded colours (`#[0-9a-fA-F]{3,8}`, `bg-white`, `text-gray`) outside the token file.

Targets: backend tests 27/27 or better · Next.js routes 30/30 · Accessibility ≥ 95 · Performance ≥ 90 on desktop where realistically achievable · no critical contrast failure · no hydration error · no TypeScript error · no broken route · theme persists across reload, respects system preference, no flash.

## 9.7 Screenshot audit
Generate screenshots of EVERY major route in Light and Dark (and key screens in Hindi) into `docs/ui-audit/`. Review them for alignment, spacing, typography, clipping, inconsistency, dark-mode problems, excessive cards and visual noise — then fix and re-shoot. Also write a short `docs/UI_CHANGELOG.md` listing what changed per route.

---

# 10. FINAL JUDGE EXPERIENCE — 3-MINUTE DEMO PATH

Optimize navigation, speed and clarity for:
**Overview → State → District → Occupation → Forecast → Why? → Recommendation → Scenario Studio → Impact → Export.**
No unnecessary screens; every step reachable in one click from the previous one, and every handoff pre-fills context (district, occupation, horizon).

The finished application must feel like **a real national government intelligence product** — not a student dashboard, a hackathon mockup, a generic SaaS template, a Power BI clone or an AI chatbot interface. It must communicate TRUST + INTELLIGENCE + PREDICTION + ACTION.

---

# 11. FINAL OUTPUT FORMAT

Report back with **measured, pasted results — no estimates**:

1. Issues found
2. Issues fixed
3. Theme system status
4. Route audit status (the full §9.5 table)
5. API/UI consistency status (Playwright pass counts)
6. Accessibility result (axe score per route)
7. Performance result (Lighthouse scores)
8. Test result (pytest count, build route count)
9. Visual improvements
10. Remaining weaknesses (include every field/section that was unavailable in the data, per §1.5)
11. Final **GO / NO-GO** — GO only if the Phase 1–3 gates pass with evidence; otherwise NO-GO with the exact blockers.

**DO NOT CLAIM 10/10 UNLESS THE PROJECT ACTUALLY MEETS THE DEFINED QUALITY BAR.**

DO THE WORK.
