# KAUSHALYUVA UI OVERHAUL — ARCHITECTURE-TAILORED GEMINI PROMPT

> **Stack**: Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript · d3-geo · lucide-react · cmdk · sonner
> **Repo Root**: `frontend/`
> **Key Config**: `tailwind.config` is implicit (Tailwind v4 via `@import "tailwindcss"` in `globals.css`) · `postcss.config.mjs` · `next.config.ts`

Act as a Principal Staff UI/UX Designer and Frontend Architect. We need a complete visual overhaul of the **KaushalYuva** frontend to strip out the "liquid glass / AI-generated template" aesthetic (frosted blur surfaces, cyan glow shadows, `rounded-2xl`/`rounded-3xl` everywhere, decorative sparklines inside KPI cards, `//` code-comment section headers in the sidebar, and robotic marketing copy) and rebuild it into a **high-density, authoritative government/enterprise intelligence platform** inspired by Palantir Foundry, Linear, and Stripe Dashboard.

---

## PROJECT FILE MAP (Every instruction below references these exact paths)

```
frontend/src/
├── app/
│   ├── globals.css                          ← Design tokens, glass system, CSS vars
│   ├── layout.tsx                           ← Root layout (fonts, metadata, <body> class)
│   ├── page.tsx                             ← "/" redirect → HeroPage via MarketingShell
│   ├── providers.tsx                        ← next-themes
│   ├── overview/page.tsx                    ← Dashboard: KPI grid, FilterBar, Map, alerts
│   ├── alerts/...                           ← Early Warning Center
│   ├── districts/...                        ← District Intelligence
│   ├── forecasts/...                        ← Demand & Supply Forecast
│   ├── gaps/...                             ← Skill Gap Intelligence
│   ├── intelligence/...                     ← Labour Intelligence
│   ├── recommendations/...                  ← Recommended Actions
│   └── scenarios/...                        ← Scenario Studio
├── components/
│   ├── charts/                              ← Chart components
│   ├── common/
│   │   ├── Badge.tsx                        ← Status badge component
│   │   ├── DataSourceControl.tsx            ← "SIH Data / Demo Data" toggle
│   │   ├── KpiCard.tsx                      ← Individual KPI metric card
│   │   ├── Provenance.tsx                   ← Dataset provenance pill
│   │   └── SystemStatusLine.tsx             ← Pipeline status
│   ├── glass/
│   │   ├── GlassButton.tsx                  ← Frosted glass button
│   │   ├── GlassCard.tsx                    ← hud-card with cyan glow hover
│   │   ├── GlassPanel.tsx                   ← Glass panel wrapper
│   │   └── GlassSelect.tsx                  ← Glass-styled select
│   ├── layout/
│   │   ├── AppShell.tsx                     ← Marketing vs Dashboard shell router
│   │   ├── FilterBar.tsx                    ← Context Filters (sticky bar)
│   │   ├── Header.tsx                       ← Top header bar
│   │   ├── LanguageSelector.tsx             ← 7-language switcher
│   │   ├── MobileBottomNav.tsx              ← Mobile dock
│   │   ├── MobileNavDrawer.tsx              ← Mobile drawer nav
│   │   ├── Sidebar.tsx                      ← Desktop sidebar nav
│   │   └── ThemeToggle.tsx                  ← Sun/Moon/Monitor theme switcher
│   ├── maps/
│   │   └── IndiaIntelligenceMap.tsx          ← SVG India map + right diagnostic panel
│   ├── marketing/
│   │   ├── HeroPage.tsx                     ← Landing page hero + alert card + map
│   │   └── MarketingShell.tsx               ← Marketing topbar + footer
│   ├── modals/                              ← EvidenceDrawer, CopilotModal, etc.
│   ├── typography/                          ← Typography components
│   └── ui/
│       └── BrandLogo.tsx                    ← KaushalYuva logo
├── data/
│   ├── india_choropleth.json                ← TopoJSON district boundaries
│   └── trade_district_metrics.json          ← Per-trade per-district data
├── lib/
│   ├── demoData.ts                          ← OCCUPATIONS, DISTRICTS, STATES, RECOMMENDATIONS, etc.
│   ├── formatters.ts                        ← formatNumber, formatDate, etc.
│   ├── i18n.ts                              ← translations object + l() + 7 languages
│   ├── store.tsx                            ← AppContext (React Context + useState)
│   ├── types.ts                             ← TypeScript interfaces (ForecastHorizon, etc.)
│   └── ...
└── fonts/
    └── display.ts                           ← Plus Jakarta Sans, Space Grotesk, Khand, etc.
```

---

## 1. GLOBAL DESIGN SYSTEM & TOKENS — `globals.css`

### 1A. Canvas & Surfaces — Replace CSS Custom Properties

In `frontend/src/app/globals.css`, inside the `:root` block (lines ~6–65), make these changes:

```diff
- --bg: #F4F8FD;
- --bg-atmo-1: rgba(0, 85, 165, 0.08);
- --bg-atmo-2: rgba(0, 194, 203, 0.06);
- --glass: rgba(255, 255, 255, 0.86);
- --glass-strong: rgba(255, 255, 255, 0.96);
+ --bg: #F8FAFC;
+ --bg-atmo-1: transparent;
+ --bg-atmo-2: transparent;
+ --glass: #FFFFFF;
+ --glass-strong: #FFFFFF;
  --overlay: rgba(255, 255, 255, 0.98);
  --surface-solid: #FFFFFF;
- --surface-muted: #EAF1FA;
+ --surface-muted: #F1F5F9;

- --border: rgba(30, 49, 91, 0.14);
- --border-strong: rgba(0, 85, 165, 0.35);
- --highlight: rgba(255, 255, 255, 0.95);
+ --border: #E2E8F0;
+ --border-strong: #CBD5E1;
+ --highlight: transparent;

- --shadow: 0 4px 20px rgba(0, 85, 165, 0.08);
+ --shadow: 0 1px 2px rgba(15, 23, 42, 0.04);

- --brand: #0055A5;
- --brand-secondary: #008B94;
- --ring: rgba(0, 85, 165, 0.4);
+ --brand: #0F172A;
+ --brand-secondary: #0369A1;
+ --ring: rgba(15, 23, 42, 0.2);
```

### 1B. Remove Atmospheric Background Animation

Delete the entire `body::before` pseudo-element block (lines ~174–186) and the `@keyframes atmo-drift` block (lines ~188–192). The animated radial gradient atmosphere is the signature "AI aesthetic" — replace with nothing (flat `#F8FAFC` canvas).

### 1C. Flatten Glass Surface Classes

Replace the `.glass`, `.glass-strong`, `.overlay` rules (lines ~206–240) to remove all `backdrop-filter`, `blur`, `saturate`, and colored `box-shadow`:

```css
.glass, .glass-strong, .overlay {
  background: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: 8px;   /* was var(--radius) = 16px */
  box-shadow: var(--shadow);
  transition: border-color 0.2s ease;
}

.glass:hover, .glass-strong:hover {
  border-color: var(--border-strong);
}
```

Delete the `@supports not` fallback block entirely — no longer needed.

### 1D. Kill the HUD Card Glow System

Replace `.hud-card` and `.hud-card:hover` (lines ~373–387):

```css
.hud-card {
  background: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow);
  transition: border-color 0.2s ease;
}

.hud-card:hover {
  border-color: var(--border-strong);
}
```

Delete `.hud-glow-cyan` and `.hud-glow-orange` entirely.
Delete `.hud-pill` and `.hud-pill:hover` entirely.

### 1E. Flatten the Header

Replace `.liquid-glass-header` (lines ~243–268):

```css
.liquid-glass-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: #FFFFFF;
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.dark .liquid-glass-header {
  background: #0F172A;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

Delete `.liquid-sheen-line` and `.dark .liquid-sheen-line` entirely.

### 1F. Kill the Pill System

Delete `.liquid-glass-pill`, `.liquid-glass-pill:hover`, `.dark .liquid-glass-pill`, `.dark .liquid-glass-pill:hover` entirely (lines ~297–332).

Replace `.liquid-control` (lines ~335–356):

```css
.liquid-control {
  background: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: var(--shadow);
  color: var(--text);
  transition: all 0.15s ease;
}

.liquid-control:hover {
  background: #F8FAFC;
  border-color: var(--border-strong);
}

.liquid-control:active, .liquid-control[aria-checked="true"], .liquid-control.active {
  background: #F1F5F9;
  border-color: var(--brand);
  box-shadow: 0 0 0 2px var(--ring);
}
```

### 1G. Border Radius Token Reduction

Update the CSS custom properties:

```diff
- --radius: 16px;
- --radius-sm: 8px;
- --radius-lg: 20px;
- --radius-xl: 28px;
+ --radius: 8px;
+ --radius-sm: 6px;
+ --radius-lg: 8px;
+ --radius-xl: 8px;
```

### 1H. Tabular Nums Global

The `.tabular-nums` and `.kpi-numeral` classes already exist — keep them. Additionally, add a global rule:

```css
/* Force tabular figures on all numeric-heavy elements */
[data-numeric], .tabular-nums, .kpi-numeral, td, th {
  font-variant-numeric: tabular-nums;
}
```

---

## 2. SIDEBAR REFACTOR — `Sidebar.tsx`

**File**: `frontend/src/components/layout/Sidebar.tsx`

### 2A. Remove Floating Card Wrapper

The sidebar `<aside>` currently wraps content in a `glass-strong rounded-3xl ... shadow-xl` div (line ~128). Change:

```diff
- <div className="glass-strong rounded-3xl h-full flex flex-col justify-between p-3 relative overflow-hidden border border-[var(--border)] shadow-xl">
+ <div className="bg-white h-full flex flex-col justify-between p-3 relative overflow-hidden border-r border-slate-200">
```

And update the `<aside>` wrapper (line ~122–127):

```diff
- className={`hidden md:flex flex-col shrink-0 transition-all duration-300 z-30 sticky top-0 h-screen py-3 pl-3 select-none ${
+ className={`hidden md:flex flex-col shrink-0 transition-all duration-300 z-30 sticky top-0 h-screen select-none ${
```

### 2B. Remove `//` Code-Comment Headers

In `navGroups` array (lines ~67–118), change the `title` properties:

```diff
- title: l('// INTELLIGENCE', '// इंटेलिजेंस'),
+ title: l('Intelligence', 'इंटेलिजेंस'),

- title: l('// DECISION SUPPORT', '// कार्रवाई एवं सिमुलेशन'),
+ title: l('Planning & Action', 'कार्रवाई एवं सिमुलेशन'),

- title: l('// EXPLORE & TAXONOMY', '// अन्वेषण एवं वर्गीकरण'),
+ title: l('Taxonomy & Directory', 'अन्वेषण एवं वर्गीकरण'),

- title: l('// SYSTEM & GOVERNANCE', '// प्रणाली एवं मॉडल'),
+ title: l('System & Governance', 'प्रणाली एवं मॉडल'),
```

Update the group title rendering (line ~163):

```diff
- <span className="px-2.5 text-[9px] font-mono font-bold tracking-widest uppercase text-cyan-600/80 dark:text-cyan-400/80 block">
+ <span className="px-3 pt-4 pb-1 text-[11px] font-semibold tracking-wider uppercase text-slate-400 block">
```

### 2C. Active Nav State — Kill Cyan Pill

Replace the active link styling (line ~176–179):

```diff
- isActive
-   ? 'bg-cyan-500/10 text-[var(--brand)] shadow-xs border-l-2 border-l-[#00c2cb] font-bold dark:bg-cyan-500/15 dark:text-[#00c2cb]'
-   : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)] hover:border-l hover:border-l-[var(--border-strong)]'
+ isActive
+   ? 'bg-slate-100 text-slate-900 font-medium rounded-md border-l-[3px] border-l-slate-900'
+   : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md'
```

Change the nav link base classes (line ~176):

```diff
- className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all relative group cursor-pointer ${
+ className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all relative group cursor-pointer ${
```

Update icon color for active state (line ~183–185):

```diff
- isActive ? 'text-[#00c2cb]' : 'text-[var(--text-faint)]'
+ isActive ? 'text-slate-900' : 'text-slate-400'
```

### 2D. Delete the Bottom Copilot Promo Card

Delete lines ~213–253 (the entire `{/* Bottom Copilot Cockpit Mini Card */}` section). It duplicates the `Copilot AI` button in `Header.tsx`.

### 2E. Kill the Gradient "STUDIO" Badge

Replace the `STUDIO` badge (line ~200):

```diff
- <span className="px-1.5 py-0.2 text-[9px] font-mono font-extrabold uppercase rounded-md bg-gradient-to-r from-cyan-500 to-[#0055a5] text-white shadow-xs">
+ <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded bg-slate-900 text-white">
```

### 2F. Status Badges — Kill `rounded-full`

Update badge rendering (line ~194):

```diff
- <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full border ${item.badgeColor}`}>
+ <span className={`px-1.5 py-0.5 text-[11px] font-medium rounded border ${item.badgeColor}`}>
```

---

## 3. TOP HEADER BAR REFACTOR — `Header.tsx`

**File**: `frontend/src/components/layout/Header.tsx`

### 3A. Remove Liquid Sheen Line

Delete `<div className="liquid-sheen-line" aria-hidden="true" />` (line ~75).

### 3B. Flatten Header Container

Change header class (line ~74):

```diff
- <header className="liquid-glass-header relative px-3 sm:px-5 py-2 select-none">
+ <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-3 sm:px-5 py-2 select-none">
```

### 3C. Consolidate Data Source & Run ID

In `Header.tsx`, find where `RUN-SIH-001 · Oct 2024 Data` and the `DataSourceControl` are rendered. Consolidate them into a single compact dropdown button:

```tsx
<button className="border border-slate-200 bg-white rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 flex items-center gap-1.5">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
  Dataset: SIH Oct 2024
  <ChevronDown className="w-3 h-3 text-slate-400" />
</button>
```

### 3D. Collapse Theme Switcher

**File**: `frontend/src/components/layout/ThemeToggle.tsx`

Replace the 3-icon Sun/Moon/Monitor theme switcher with a single compact toggle button (icon-only, cycles through themes on click).

### 3E. Restyle Copilot Button

Find the Copilot AI button in `Header.tsx` and restyle:

```diff
- className="... bg-gradient-to-r from-[#0055a5] to-[#00c2cb] ..."
+ className="bg-slate-900 text-white rounded-md px-3 py-1.5 text-xs font-medium flex items-center gap-1.5"
```

Change label from `Copilot AI` / `Ask Copilot` to `Ask Assistant` and add a `⌘K` badge:

```tsx
<span>Ask Assistant</span>
<kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px] font-mono">⌘K</kbd>
```

---

## 4. OVERVIEW DASHBOARD REFACTOR — `overview/page.tsx`

**File**: `frontend/src/app/overview/page.tsx`

### 4A. Compact Executive Header

Delete the `NATIONAL INTELLIGENCE DASHBOARD` pill badge and `Provenance` chip (lines ~66–72).
Delete the marketing subtitle `<p>` (lines ~76–78).

Collapse to a single header row:

```tsx
<div className="flex items-center justify-between gap-4">
  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
    {l('District Skill & Capacity Overview', 'ज़िला कौशल एवं क्षमता सारांश')}
  </h1>
  <Link
    href="/scenarios?preset=rec01"
    className="bg-slate-900 hover:bg-slate-800 text-white rounded-md px-3.5 py-2 text-sm font-medium flex items-center gap-2 shrink-0"
  >
    <Sliders className="w-4 h-4" />
    {l('Open Scenario Studio', 'परिदृश्य स्टूडियो खोलें')}
  </Link>
</div>
```

### 4B. Unified Filter Bar — `FilterBar.tsx`

**File**: `frontend/src/components/layout/FilterBar.tsx`

Replace the floating glass wrapper (line ~54):

```diff
- <div className="sticky top-14 z-10 glass-strong backdrop-blur-md rounded-2xl p-2.5 sm:p-3 mb-6 border border-[var(--border)] shadow-md">
+ <div className="sticky top-14 z-10 bg-white rounded-lg p-2 mb-6 border border-slate-200">
```

Each filter cell should have a stacked 10px uppercase muted label above a borderless select:

```tsx
<div className="flex flex-col gap-0.5">
  <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
    State
  </span>
  <select className="text-xs font-medium text-slate-900 bg-transparent border-0 outline-none p-0 cursor-pointer">
    ...
  </select>
</div>
```

Style the `3M | 6M | 12M` Forecast Horizon toggle as a tight segmented control:

```tsx
<div className="bg-slate-100 p-0.5 rounded-md flex">
  {(['3M', '6M', '12M'] as const).map(h => (
    <button
      key={h}
      className={`px-2.5 py-1 text-xs font-semibold rounded ${
        forecastHorizon === h
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {h}
    </button>
  ))}
</div>
```

### 4C. Fix the 6 KPI Cards — `KpiCard.tsx` + `overview/page.tsx`

**File**: `frontend/src/components/common/KpiCard.tsx`

The core problems:
1. Each card is an isolated `glass-strong rounded-2xl` surface with a sparkline SVG that steals space
2. Bottom text truncates with `...` (`truncate` class)
3. The decorative sparkline polylines look like broken chart fragments

**Replace the entire `KpiCard` component** with a unified grid approach. In `overview/page.tsx`, replace the 6-card grid (lines ~96+) with:

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 bg-white border border-slate-200 rounded-lg overflow-hidden">
  {/* Each metric cell */}
  <div className="p-4">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {l('Demand', 'मांग')}
    </div>
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-2xl font-bold text-slate-900 tabular-nums">9,000</span>
      <span className="text-xs font-medium text-emerald-600">+10.6%</span>
    </div>
    <div className="text-xs text-slate-500 mt-1">Projected 6-month growth</div>
  </div>
  {/* ... repeat for all 6 metrics ... */}
</div>
```

Delete the sparkline SVG from `KpiCard.tsx` entirely (lines ~70–83). Delete the `trend` prop.

**Full 6-cell data (use these exact values, do NOT truncate the bottom text):**

| Cell | Label | Value | Badge | Subtext |
|------|-------|-------|-------|---------|
| 1 | DEMAND | 9,000 | +10.6% (emerald) | Projected 6-month growth |
| 2 | EFFECTIVE SUPPLY | 2,700 | 0.70 Readiness (slate) | Active staged candidate pool |
| 3 | STRUCTURAL DEFICIT | 6,300 | Critical (red) | Unmet district training need |
| 4 | AT-RISK TRADES | 13 | Score >75 / <25 (amber) | Severe supply-demand imbalance |
| 5 | INTELLIGENCE ALERTS | 35 | Active (amber) | District anomalies detected |
| 6 | RECOMMENDATIONS | 4 | Ranked (sky) | Ready for seat reallocation |

### 4D. Action Required Banner

Find the `ACTION REQUIRED` banner in `overview/page.tsx`. Restyle:

```tsx
<div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg p-4 flex items-center justify-between gap-4">
  <div className="min-w-0">
    <div className="flex items-center gap-2 mb-0.5">
      <span className="px-1.5 py-0.5 text-[11px] font-medium rounded bg-amber-50 text-amber-700 border border-amber-200">
        PRIORITY INTERVENTION
      </span>
      <span className="text-sm font-semibold text-slate-900">
        Gorakhpur · Solar PV Installer (NCO 7126.0101)
      </span>
    </div>
    <p className="text-xs text-slate-600 mt-0.5">
      711-seat deficit projected in 6 months (88% probability). Reallocate 97 surplus seats from Retail Sales Associate to save ₹6.3L vs. adding new capacity.
    </p>
  </div>
  <div className="flex items-center gap-2 shrink-0">
    <button className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-md px-3 py-1.5 text-xs font-medium">
      View Diagnostics
    </button>
    <button className="bg-slate-900 hover:bg-slate-800 text-white rounded-md px-3 py-1.5 text-xs font-medium">
      Simulate Reallocation
    </button>
  </div>
</div>
```

### 4E. Pipeline Run Strip

Find `"WHAT CHANGED IN CURRENT PIPELINE RUN?"` in `overview/page.tsx`. Replace:

- Label: `Key Shifts Since Last Forecast`
- Style: `text-xs font-semibold uppercase tracking-wider text-slate-500`
- Replace the 3 rounded pill chips with a 3-column grid using semantic status dots:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white border border-slate-200 rounded-lg overflow-hidden">
  <div className="p-3 flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
    <span className="text-xs text-slate-700">Solar PV Installer demand accelerated +21%</span>
  </div>
  <div className="p-3 flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
    <span className="text-xs text-slate-700">Retail Sales supply normalized (−8%)</span>
  </div>
  <div className="p-3 flex items-center gap-2">
    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
    <span className="text-xs text-slate-700">Gorakhpur shortage probability crossed 88%</span>
  </div>
</div>
```

---

## 5. LANDING PAGE REFACTOR — `HeroPage.tsx`

**File**: `frontend/src/components/marketing/HeroPage.tsx`

### 5A. Eyebrow — Kill the Pill

Replace the eyebrow pill (lines ~34–40):

```diff
- <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0055a5]/10 dark:bg-cyan-950/40 border border-[#00c2cb]/35 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold tracking-wider">
-   <span className="relative flex h-2 w-2">
-     <span className="animate-ping ..." />
-     <span className="relative ..." />
-   </span>
-   <span>SMART INDIA HACKATHON 2026 · PS 26246 · MSDE</span>
- </div>
+ <span className="text-xs font-semibold tracking-widest text-sky-700 uppercase">
+   SMART INDIA HACKATHON 2026 · PS 26246 · MSDE
+ </span>
```

### 5B. Headline

Replace (lines ~43–48):

```diff
- <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[var(--text)] tracking-tight font-display leading-[1.12]">
-   {t.hero?.titlePrefix || 'FORECAST THE SKILL GAP.'}{' '}
-   <span className="text-[#0055a5] dark:text-[#00c2cb]">
-     {t.hero?.titleAction || 'FUND THE FIX.'}
-   </span>
- </h1>
+ <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">
+   Forecast District Skill Gaps.{' '}
+   <span className="text-sky-700">Reallocate Training Capacity.</span>
+ </h1>
```

Also update the `translations` object in `frontend/src/lib/i18n.ts` — find the `hero.titlePrefix` and `hero.titleAction` keys and update their English values.

### 5C. Subheadline

Replace (lines ~51–56):

```diff
- 'KaushalYuva turns official SIH dataset (NCS / e-Shram / PLFS adapters ready) into granular district-level forecasts, early warnings, and mathematically guarded seat reallocations.'
+ 'Turn NCS, e-Shram, and PLFS labour-market datasets into district-level shortage forecasts, early warnings, and cost-optimized ITI seat reallocations.'
```

### 5D. Primary CTA Button

Replace (lines ~61–69):

```diff
- className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] hover:from-[#004488] hover:to-[#00a2ab] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#00c2cb]/20 hover:-translate-y-0.5 transition-all cursor-pointer font-sans"
+ className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
```

### 5E. Right-Hand Alert Card

In the Priority Intervention card (lines ~73+):

1. Remove `<Provenance source="SIH dummy dataset" note="RUN-SIH-001" .../>` (line ~82)
2. Change `TOP EXECUTIVE ALERT · GORAKHPUR` → `PRIORITY INTERVENTION · GORAKHPUR, UP`
3. Change `Gorakhpur is short by 711 solar installers.` → `711-Seat Deficit in Solar PV Installers`
4. Remove `hud-card` class and all cyan glow styles from the card wrapper
5. Restyle the card as `bg-white border border-slate-200 rounded-lg p-5`
6. Make the demand/supply progress bar `h-2 rounded-sm`
7. Change the bottom CTA to `rounded-md bg-slate-900 text-white w-full py-2 text-xs font-medium`
8. Update copy: `Simulate Gorakhpur Seat Transfer (97 Seats) →`

### 5F. Metadata Strip

The 4-column coverage strip (`COVERAGE`, `TRADES`, `HORIZONS`, `WAPE`) — style as:

```tsx
<div className="border-y border-slate-200 bg-white py-3 px-6 grid grid-cols-4 divide-x divide-slate-200">
```

---

## 6. INDIA MAP REFACTOR — `IndiaIntelligenceMap.tsx`

**File**: `frontend/src/components/maps/IndiaIntelligenceMap.tsx`

### 6A. Eliminate Duplicate State Filter Bars

There are currently TWO state filter bars stacked above the map. **Delete the upper `STATE FILTER` bar entirely.** Keep a single unified map control header with:
1. `Trade:` dropdown
2. `Metric:` segmented toggle
3. `State:` segmented filter
4. `View as Table` toggle

### 6B. Map Background

Change the SVG map canvas background from white to `#F1F5F9` (slate-100). Render faint base state boundary polygons for ALL Indian states (using the TopoJSON data in `frontend/src/data/india_choropleth.json`) so the 16 active districts have geographic context.

### 6C. District Labels — Fix Collision

Add label collision detection. Only render static text labels for the selected district and non-overlapping major nodes. Show the rest on hover tooltip only. Style visible labels:

```
bg-white/90 border border-slate-300 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-800 shadow-sm
```

### 6D. Remove Floating Provenance Pill from Map

Find `MSDE / SIH Dataset · RUN-2026-10-04-EVAL · Data through Oct 2024` floating inside the map. Move it to a `text-[11px] text-slate-400` caption at the bottom-left of the map container.

### 6E. Right-Hand District Diagnostic Panel

Join the map canvas and the right diagnostic panel into a single split-pane container:

```tsx
<div className="grid grid-cols-12 bg-white border border-slate-200 rounded-lg overflow-hidden">
  <div className="col-span-8">{/* Map SVG */}</div>
  <div className="col-span-4 border-l border-slate-200 p-5">{/* District panel */}</div>
</div>
```

Replace the 4 floating metric boxes (`GAP SCORE`, `DEMAND`, `EFFECTIVE SUPPLY`, `NET BALANCE`) with:

```tsx
<div className="grid grid-cols-2 divide-x divide-y divide-slate-200 border-y border-slate-200 -mx-5 my-4">
  <div className="p-3.5">...</div>
  <div className="p-3.5">...</div>
  <div className="p-3.5">...</div>
  <div className="p-3.5">...</div>
</div>
```

Bottom CTAs:

```tsx
<button className="w-full bg-slate-900 text-white rounded-md py-2 text-xs font-medium">
  Simulate District Scenarios
</button>
<button className="w-full border border-slate-200 bg-white text-slate-700 rounded-md py-2 text-xs font-medium mt-2">
  View Full District Profile
</button>
```

---

## 7. GLASS COMPONENT OVERHAUL — `components/glass/`

### GlassCard.tsx

```diff
- 'hud-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300',
- hoverEffect && 'cursor-pointer hover:border-[#00c2cb]/60 hover:shadow-[0_8px_30px_rgba(0,194,203,0.15)]',
+ 'bg-white border border-slate-200 rounded-lg p-5 transition-all',
+ hoverEffect && 'cursor-pointer hover:border-slate-300',
```

Delete the specular highlight `<div>` (line ~42).

Update `accentBorder` to use:
```ts
shortage: 'border-l-4 border-l-red-600',
warning: 'border-l-4 border-l-amber-500',
```

### GlassButton.tsx, GlassPanel.tsx, GlassSelect.tsx

Apply the same pattern: replace all glass/blur/gradient styles with flat white surfaces, `border-slate-200`, `rounded-md`/`rounded-lg`.

---

## 8. COLOR PALETTE REPLACEMENT — Global Search & Replace

Run these replacements across the **entire** `frontend/src/` codebase:

| Pattern to Find | Replace With | Rationale |
|---|---|---|
| `bg-gradient-to-r from-[#0055a5] to-[#00c2cb]` | `bg-slate-900` | Kill gradient buttons |
| `bg-gradient-to-r from-cyan-500 to-[#0055a5]` | `bg-slate-900` | Kill gradient badges |
| `hover:from-[#004488] hover:to-[#00a2ab]` | `hover:bg-slate-800` | Kill gradient hover |
| `shadow-[#00c2cb]/20` | `shadow-sm` | Kill colored shadows |
| `shadow-[var(--brand)]/20` | `shadow-sm` | Kill brand shadows |
| `text-[#00c2cb]` | `text-slate-900` | Kill cyan accent text |
| `text-cyan-600/80` | `text-slate-400` | Kill cyan muted text |
| `text-cyan-400/80` | `text-slate-400` | Kill cyan dark mode text |
| `border-[#00c2cb]/50` | `border-slate-300` | Kill cyan borders |
| `bg-cyan-500/10` | `bg-slate-100` | Kill cyan bg tints |
| `bg-cyan-500/15` | `bg-slate-100` | Kill cyan bg tints |
| `rounded-2xl` | `rounded-lg` | Kill large radius on cards |
| `rounded-3xl` | `rounded-lg` | Kill XL radius |
| `rounded-full` (on buttons/selects/inputs) | `rounded-md` | Kill pills (careful: keep `rounded-full` on status dots and avatars) |
| `shadow-xl` | `shadow-sm` | Kill heavy shadows |
| `shadow-lg` | `shadow-sm` | Kill heavy shadows |
| `shadow-md` | `shadow-sm` | Flatten shadows |
| `animate-pulse` (on decorative elements) | (remove) | Kill pulsing dots |

---

## 9. COMPLETE STRING-BY-STRING COPYWRITING REPLACEMENTS

Search the codebase (primarily `i18n.ts`, `overview/page.tsx`, `HeroPage.tsx`, `Sidebar.tsx`, `IndiaIntelligenceMap.tsx`) for these exact strings and replace:

| # | Find (English) | Replace With |
|---|---|---|
| 1 | `// INTELLIGENCE` | `Intelligence` |
| 2 | `// DECISION SUPPORT` | `Planning & Action` |
| 3 | `// EXPLORE & TAXONOMY` | `Taxonomy & Directory` |
| 4 | `// SYSTEM & GOVERNANCE` | `System & Governance` |
| 5 | `National Intelligence Command Center` | `District Skill & Capacity Overview` |
| 6 | `ACTION REQUIRED` | `Priority Intervention` |
| 7 | `WHAT CHANGED IN CURRENT PIPELINE RUN?` | `Key Shifts Since Last Forecast` |
| 8 | `FORECAST THE SKILL GAP. FUND THE FIX.` | `Forecast District Skill Gaps. Reallocate Training Capacity.` |
| 9 | `KaushalYuva turns official SIH dataset...mathematically guarded seat reallocations.` | `Turn NCS, e-Shram, and PLFS labour-market datasets into district-level shortage forecasts, early warnings, and cost-optimized ITI seat reallocations.` |
| 10 | `TOP EXECUTIVE ALERT` | `PRIORITY INTERVENTION` |
| 11 | `Gorakhpur is short by 711 solar installers.` | `711-Seat Deficit in Solar PV Installers` |
| 12 | `Simulate Fix` | `Simulate Reallocation` |

Also update the corresponding Hindi translations in `i18n.ts` to match (keep the Hindi meaning, just adjust to match the tone change).

---

## 10. ADDITIONAL DARK MODE CLEANUP

In `globals.css`, update the `.dark` block (lines ~67–107) to use a professional dark mode palette instead of "Pitch Black Obsidian":

```css
.dark {
  --bg: #0F172A;
  --glass: #1E293B;
  --glass-strong: #1E293B;
  --surface-solid: #1E293B;
  --surface-muted: #0F172A;
  --border: rgba(255, 255, 255, 0.1);
  --border-strong: rgba(255, 255, 255, 0.2);
  --text: #F8FAFC;
  --text-muted: #94A3B8;
  --text-faint: #64748B;
  --brand: #38BDF8;
  --brand-secondary: #0EA5E9;
  --ring: rgba(56, 189, 248, 0.3);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
```

---

## 11. ROOT LAYOUT — `layout.tsx`

Update the theme color meta tags:

```diff
- { media: "(prefers-color-scheme: light)", color: "#F4F8FD" },
+ { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
- { media: "(prefers-color-scheme: dark)", color: "#000000" },
+ { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
```

Update the body class:

```diff
- <body className="notranslate min-h-screen text-[var(--text)] bg-[var(--bg)] antialiased selection:bg-[#ff6600]/30 selection:text-[#ff9944]">
+ <body className="notranslate min-h-screen text-[var(--text)] bg-[var(--bg)] antialiased selection:bg-sky-600/20 selection:text-sky-900">
```

---

## EXECUTION ORDER

1. **Start with `globals.css`** — all design tokens, glass system, shadows, radii, header, controls
2. **Then `Sidebar.tsx`** — nav groups, active state, delete copilot card
3. **Then `Header.tsx`** + `ThemeToggle.tsx` — flatten, consolidate
4. **Then `KpiCard.tsx`** + `overview/page.tsx` — unified metric grid
5. **Then `FilterBar.tsx`** — high-density inline bar
6. **Then `HeroPage.tsx`** — landing page overhaul
7. **Then `IndiaIntelligenceMap.tsx`** — map + panel refactor
8. **Then `GlassCard.tsx`, `GlassButton.tsx`, etc.** — flatten glass components
9. **Then global search-replace** — gradients, shadows, radii, colors
10. **Then `i18n.ts`** — string replacements
11. **Then `layout.tsx`** — meta and body updates

**After each file change, run `npm run build` from `frontend/` to verify no TypeScript or build errors.**
