# KAUSHALYUVA — ROUND 2 MASTER PROMPT
## Rebrand · 100% Hindi · MVP Hero Page · Trade Gothic Heading System · UI Polish

**Project (new name):** **KaushalYuva** (formerly KaushalPulse)
**Problem statement:** SIH 2026 — PS 26246 (MSDE) — AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine
**Live:** https://kaushalyuva.vercel.app/
**Repo:** backend/ML at repo root (`pytest tests/ -v`), Next.js frontend in `frontend/` (`npm run build`)

This is a single self-contained instruction set. Nothing else needs to be appended.

---

# 0. CONTEXT & RUN ORDER

Round 1 (design system, dark mode, glass tiers, sidebar groups, Data Source control, ⌘K, provenance chips, reconciled numbers) is largely in place — verified on the live site: Solar PV 808 / 217 seats / 97 effective / Gap 94 / 88% shortage probability, 35 alerts, 97-seat Strict preset. **Do not redo or regress any of it.** Preserve the existing tokens, `glass / glass-strong / overlay` surfaces, `next-themes` setup, chart palette hook, severity colours and all verified analytics.

Round 2 delivers five things: (1) rename to KaushalYuva, (2) **100% Hindi** — not partial, (3) a well-organised **MVP hero page**, (4) a **Trade Gothic heading system** that is distinctive but cheap to load and read, (5) a UI polish list found in a fresh audit.

**Work in phases. Commit after each. Run the gates (§10) at each checkpoint.**

| Phase | Scope |
|---|---|
| 1 | §2 Rebrand to KaushalYuva |
| 2 | §3 i18n foundation (server-resolved locale, dictionaries, glossary, formatting, CI checks) |
| 3 | §4 Typography: Trade Gothic display system + Hindi display stack |
| 4 | §5 Hero page at `/` (marketing layout) |
| 5 | §3.6–3.8 Hindi sweep of EVERY route + backend narrative templates + exports + Copilot |
| 6 | §6 UI polish list |
| 7 | §10–§11 proof: crawl tests, axe, Lighthouse, screenshots, final report |

Phases 1–4 are the minimum shippable product for the demo.

## Hard rules
- UI/i18n only. Do NOT change ML, forecasting, gap engine, recommendation engine, scenario maths, donor-safety rules or DB schema. **Additive** API fields are allowed (e.g. `template_key` + `params` beside existing text) and read-only endpoints serving existing artifacts are allowed; breaking any existing API contract is not.
- `pytest tests/ -v` must stay **27 passed**. Frontend must build with zero TypeScript / ESLint / hydration errors. (Route count will grow if you add locale-prefixed routes — see §3.2; the gate becomes "every route builds in both locales".)
- Never hardcode analytical numbers; everything from the API. Never claim live feeds. Show "Not available in this dataset" instead of inventing data.
- Light + dark + EN + HI + 375/768/1280/1920px for everything you touch.

---

# 1. AUDIT FINDINGS (static fetch of the live site, 6 Oct 2026)

Verify each, then fix:

1. **Old brand everywhere.** Page `<title>` and meta still say "KaushalPulse — AI-Enabled Labour Market Intelligence…"; the sidebar lockup reads "KP KaushalPulse · Labour Market Intelligence".
2. **No real front door.** `/` renders the same operational dashboard as `/overview`. There is no hero/landing that explains the product in 10 seconds.
3. **Server HTML is English-only.** Every label, filter option (states, districts, sectors, occupations) and all narrative text (recommendation rationales, "what changed", action ribbon) arrive in English; the EN/हिन्दी toggle therefore can only act after hydration (flash of English, `lang` mismatch) and any string not routed through a dictionary stays English. Backend-generated sentences (e.g. "Persistent acute shortage in Solar PV Installer… 536 wasted seats over demand…") are pre-rendered English and cannot be translated by a UI dictionary.
4. **Scenario Studio server HTML is just "Loading Scenario Studio…"** — no skeleton that matches the layout (CLS, blank first paint).
5. **`theme-color` is a single `#090A0C`** — must be a light/dark pair.
6. **Provenance chips repeated** ("Official SIH" ×5 on one screen) → visual noise.
7. **Sign wording:** Recommendation card shows "Deficit Reduction **-6.2%**" — a negative sign on a reduction label.
8. **Map legend** lists three bands ("Balanced < 60") while the severity model has four (Oversupply < 40).
9. **Ambiguous "4" badge** beside the Copilot button in the topbar.
10. Verify (cannot be seen in static HTML): dark/light rendering of every route, Hindi rendering, overflow at 375px.

---

# 2. REBRAND → KAUSHALYUVA

Rename every user-visible and metadata occurrence of **KaushalPulse / Kaushal Pulse / KP** to **KaushalYuva / KY**.

- **Lockup:** "KY" mark + **KaushalYuva** wordmark (display font, §4) + small descriptor "Labour Market Intelligence" (Hindi: "श्रम-बाज़ार आकलन"). In Hindi mode copy and headings write the name as **कौशलयुवा**; the logo graphic stays constant.
- **Tagline (EN):** "Skills for India's youth, planned before the shortage." **(HI):** "देश के युवाओं के कौशल की योजना, कमी आने से पहले।"
- **Title pattern:** `KaushalYuva — Labour Market Intelligence | MSDE` (home), `<Page> · KaushalYuva` (routes), per locale. Update meta description, OG title/description/image (dark), Twitter card, `manifest`, favicon (KY), `apple-touch-icon`, `theme-color` pair.
- **Everywhere else:** `package.json` name, README, docs, FastAPI/OpenAPI title & description, Copilot copy ("Kaushal Copilot" may stay), export filenames (`kaushalyuva-<route>-<run-id>.csv/pdf`), PDF/report headers & footers, API & Exports page examples, Settings page, empty/error copy, code comments in user-facing strings, `docs/`.
- **Storage keys:** rename `kaushalpulse-*` localStorage/cookie keys to `kaushalyuva-*` with a one-time silent migration (read old → write new → delete old).
- **Do NOT break internals:** DB filename (`data/kaushal_pulse.db`), Python module names and test fixtures may stay unless a rename is trivially safe AND all 27 tests still pass. List every deliberate leftover in the final report.
- Run `grep -rIi "kaushal.\?pulse\|kaushal_pulse"` (and `\bKP\b`) over the repo; the only allowed hits are the documented internals.
- Vercel project/domain are already `kaushalyuva` — no code change needed. Renaming the GitHub repo is optional; do not do it automatically.

---

# 3. HINDI — 100% COVERAGE

"100%" means: **every string a user can see, hear (screen reader), copy, download or hover is Hindi in Hindi mode**, and this is proven by automated checks, not by eye.

## 3.1 Allowed to stay Latin (allow-list, single file `i18n/allowlist.ts`)
Acronyms and identifiers: SIH, MSDE, NCO, LGD, API, CSV, PDF, JSON, ITI, PMKVY, RUN-SIH-001, NCO codes (`7126.0101`), model names (LightGBM, ETS, Theta), units/symbols (₹, %, M, K). First use per page of an acronym gets a Hindi expansion in a tooltip and `aria-label` (e.g. MSDE → कौशल विकास एवं उद्यमशीलता मंत्रालय). Everything else must be Hindi.

## 3.2 Architecture (resolve the locale on the SERVER)
First inspect the current mechanism. If it is a client-side dictionary/toggle, migrate to **next-intl** (or the existing library if it already supports server locale resolution).
- **Preferred:** locale-prefixed routes with `localePrefix: 'as-needed'` → `/overview` (EN) and `/hi/overview` (HI), every route including `/` and dynamic ones (`/hi/districts/[id]`, `/hi/occupations/[nco]`). Static generation for both locales; `<html lang="hi">`; `hreflang` alternates + canonical per locale; shareable Hindi links for judges.
- Language switcher keeps the current route, query params (filters, `preset`, horizon), scroll position and open drawers; stores preference in a cookie; first visit honours `Accept-Language`; no flash of the wrong language.
- Messages in `messages/en.json` and `messages/hi.json`, namespaced per route/component; ICU MessageFormat with `plural`/`select`; **no string concatenation to build sentences**.

## 3.3 Formatting (all via `Intl`, locale `hi-IN` / `en-IN`)
- Numbers: Indian grouping. Compact units in Hindi: `10.3K` → `10.3 हज़ार`, lakh/crore → `लाख` / `करोड़`; currency `₹18.31L` → `₹18.31 लाख`. Provide one `formatNumber / formatCurrency / formatPercent / formatDate / formatRelativeTime` helper set used everywhere (KPIs, tables, charts, tooltips, exports).
- Digits: Latin digits by default (`nu-latn`) for consistency with codes and charts; if time allows add a Settings option "अंक: 0–9 / ०–९".
- Dates/months/"2h ago" → localized via `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat`.

## 3.4 Reference data (names)
Add Hindi names for every entity shown: **states, districts (keyed by LGD code), sectors, occupations (keyed by NCO code), qualifications, training-centre types, alert types, severity bands**. Store as `messages/hi.reference.json` (or additive `name_hi` fields) — do NOT change API contracts. Sorting and search must work with Devanagari collation (`Intl.Collator('hi')`). The ⌘K palette and every combobox must match **both** Hindi and English names (and common transliterations such as "gorakhpur" for गोरखपुर).

## 3.5 Starting glossary (use consistently; **a native Hindi speaker must review before the demo** — flag in the report)
| EN | HI | EN | HI |
|---|---|---|---|
| Overview | अवलोकन | Demand | मांग |
| Labour Intelligence | श्रम-बाज़ार आकलन | Effective Supply | प्रभावी आपूर्ति |
| Forecasts | पूर्वानुमान | Shortfall | कमी |
| Skill Gaps | कौशल अंतराल | Gap Score | अंतराल स्कोर |
| Early Warnings / Intelligence Signals | पूर्व चेतावनियाँ / संकेत | Severe Shortage | गंभीर कमी |
| Recommendations | सिफ़ारिशें | Moderate Shortage | मध्यम कमी |
| Scenario Studio | परिदृश्य स्टूडियो | Balanced | संतुलित |
| Districts | ज़िले | Oversupply | अधिशेष आपूर्ति |
| Occupations | व्यवसाय | Training Seats | प्रशिक्षण सीटें |
| Qualifications | योग्यताएँ | Source / Target trade | स्रोत ट्रेड / लक्ष्य ट्रेड |
| Data & Model Health | डेटा एवं मॉडल स्थिति | Seat reallocation | सीट पुनर्आवंटन |
| API & Exports | API एवं निर्यात | Shortfall closed | कमी की भरपाई |
| Settings | सेटिंग्स | Package cost | पैकेज लागत |
| Data source | डेटा स्रोत | Confidence | विश्वसनीयता स्तर |
| Official SIH dataset | आधिकारिक SIH डेटासेट | Demo dataset | डेमो डेटासेट |
| Last run | अंतिम रन | Forecast horizon (3M/6M/12M) | पूर्वानुमान अवधि (3/6/12 माह) |
| Simulate | सिमुलेट करें | Why? | क्यों? |
| Safe cap | सुरक्षित सीमा | Export | निर्यात करें |

## 3.6 Coverage checklist — EVERY one of these must be Hindi
- All 15 routes (`/`, `/overview`, `/intelligence`, `/forecasts`, `/gaps`, `/alerts`, `/recommendations`, `/scenarios`, `/districts`, `/districts/[id]`, `/occupations`, `/occupations/[nco]`, `/qualifications`, `/data-health`, `/api`, `/settings`).
- Chrome: sidebar groups, topbar, breadcrumbs, search placeholder, Data Source control + tooltip, status line, footer, skip link.
- **Overlays & hidden text:** tooltips, dropdown/combobox options, modals, drawers (Copilot, WHY panel, Evidence), ⌘K palette (groups, commands, empty state), toasts, confirmation dialogs.
- **States:** loading, empty, insufficient data, low confidence, error + Retry, 404/500 pages, offline.
- **Data visualisation:** chart titles, axis titles/ticks, legends, tooltips, annotations ("Safe cap", threshold lines), map layer names, legend, tooltips, selected-geography panel, sparkline `aria-label`s.
- **Tables:** headers, sort/aria-sort announcements, pagination, row actions, CSV export headers, "Not available in this dataset".
- **Forms:** labels, placeholders, helper text, validation, slider value text (`aria-valuetext`), switch states (चालू/बंद).
- **Accessibility strings:** every `aria-label`, `aria-describedby`, `alt`, `title`, live-region message.
- **Metadata:** `<title>`, description, OG/Twitter per locale.
- **Scenario Studio:** all controls, the donor-constraint explanation ("Requested 500 · Safe 97 …"), WHY panel, before/after, sensitivity matrix, accounting notes, Real Donor Analysis, export report.

## 3.7 Backend-generated narrative → structured templates (the part most projects miss)
Alert triggers, recommendation rationales, "What changed", action ribbon, scenario guard explanations, evidence panels and Copilot answers are currently English sentences. **Do not machine-translate at runtime.**
- Add additive fields beside the existing text: `template_key` + `params` (e.g. `{ occupation_nco, district_lgd, demand, supply, wasted_seats, gap_score }`). Keep the old English `text` for backward compatibility.
- Render with ICU messages in `en.json` / `hi.json`; params are formatted with the helpers in §3.3 and entity names resolved through §3.4.
- Every alert type (Persistent Shortage, Emerging Shortage, Capacity Inefficiency, Emerging Oversupply, Emerging Occupation, Geographic Imbalance, Skill Obsolescence) and every recommendation template needs a Hindi message.
- Qualitative "Context, not model output" callouts also need Hindi versions.
- **Copilot:** if template/tool-based, add Hindi templates and answer in the active locale with numbers taken verbatim from the API; if LLM-backed, pass the locale in the system prompt, require numbers verbatim from tool results, and state "I don't have that in the current data" (Hindi: "वर्तमान डेटा में यह उपलब्ध नहीं है") when data is insufficient. Suggested-question chips are localized too.

## 3.8 Exports & documents
- CSV: Hindi column headers when Hindi is active (UTF-8 **with BOM** so Excel opens Devanagari correctly).
- PDF/report: Devanagari needs proper shaping and an embedded font. Client-side PDF libraries (e.g. jsPDF) usually render conjuncts/matras incorrectly — generate reports through an HTML print stylesheet or server-side headless-Chromium `page.pdf()` with **Noto Sans Devanagari embedded**, then visually verify the Hindi PDF.

## 3.9 Hindi typography & layout rules (scope with `:lang(hi)`)
- Never apply `text-transform: uppercase` or negative/positive `letter-spacing` to Devanagari. Body line-height ≥ 1.5, headings ≥ 1.25 (matras and shirorekha must not clip). Never truncate mid-conjunct; prefer wrapping, then tooltip.
- Hindi text runs ~20–30% longer: buttons, pills, KPI labels, table headers, filter chips, sidebar items use `min-w-0`, flexible widths, wrapping. Verify at 375px.
- Fonts: **Noto Sans Devanagari** (variable if available) for UI and body; display stack in §4.4.

## 3.10 Proof that Hindi is 100%
1. **Key parity** (`scripts/i18n-check.ts`, runs in CI and `npm run build` pre-step): every key in `en.json` exists in `hi.json` and vice-versa; no empty values; no `hi` value identical to `en` unless allow-listed; ICU parameter sets match.
2. **No hardcoded UI strings:** enable `eslint-plugin-i18next` `no-literal-string` (JSX text + `aria-label/title/placeholder/alt`) — zero violations.
3. **Playwright Hindi crawl:** for every route in `hi` (plus each overlay/state: open Copilot, ⌘K, WHY, Evidence, tooltips on hover/focus, error and empty states, a toast), collect all visible text nodes plus `aria-label`, `title`, `placeholder`, `alt`, `document.title`; fail on any Latin word of ≥ 3 letters not in the allow-list or any raw message key (`overview.title`). Save screenshots.
4. `<html lang="hi">` and `Content-Language` correct; the switcher round-trips EN → HI → EN without losing state.

---

# 4. TYPOGRAPHY — TRADE GOTHIC DISPLAY SYSTEM

## 4.1 Roles
| Role | Font | Where |
|---|---|---|
| **Display / headings** | **Trade Gothic (Bold Condensed / Next Condensed)** | hero H1, page H1, section H2, the KaushalYuva wordmark, hero stat numerals |
| UI & body | Inter (`--font-sans`) | everything else: nav, buttons, tables, forms, chart labels, KPI labels |
| Codes | Geist Mono / JetBrains Mono (`--font-mono`) | NCO codes, run IDs, eyebrows |
| Hindi UI/body | Noto Sans Devanagari | all Hindi text |
| Hindi display | Noto Sans Devanagari, weight 700–800, semi-condensed width (`wdth` axis ≈ 87.5 if the variable font provides it) | Hindi headings |

Efficiency rule: **the display font is used for headings only** — never tables, nav, buttons, tooltips, chart labels or paragraphs.

## 4.2 Licensing (important)
Trade Gothic is a commercial typeface. Use it only through a license you hold: Adobe Fonts (Trade Gothic Next is offered there — verify availability and web licence on fonts.adobe.com) via a kit `<link>`, or a purchased web-font licence self-hosted as woff2 (check whether the licence allows subsetting).
**Until licensed files/kit exist, ship the free OFL look-alike Barlow Condensed** (condensed grotesque, similar gothic proportions) through the same variable so switching is a three-line change and nothing else in the codebase knows which font is active:
```ts
// src/fonts/display.ts — default: free fallback, active today
import { Barlow_Condensed } from 'next/font/google';
export const displayFont = Barlow_Condensed({
  subsets: ['latin'], weight: ['600', '700'], display: 'swap',
  variable: '--font-display', preload: true, adjustFontFallback: true,
});
// When licensed: replace with next/font/local pointing at
// public/fonts/trade-gothic/TradeGothicNextCondensed-Bold.woff2 (and -Regular if used),
// same `variable: '--font-display'`, `display: 'swap'`, `preload: true`.
// Adobe Fonts alternative: add the kit <link> from NEXT_PUBLIC_ADOBE_KIT_ID and set
// --font-display: "trade-gothic-next-condensed", "Barlow Condensed", sans-serif;
```
Document the switch in `docs/FONTS.md`. In the final report state which font is actually active.

## 4.3 Performance budget
≤ 2 display font files (Bold + optionally Regular), woff2, Latin + digits + ₹ + punctuation only (no italics, no extra weights), `font-display: swap`, **only the hero display file is preloaded**, fallback metrics adjusted (`adjustFontFallback` / `size-adjust`) so swapping causes **CLS < 0.02**. Display font ≤ ~40 KB total transferred. LCP element on the hero is the H1 text (no hero image).

## 4.4 Heading system (CSS + component)
```css
:root {
  --font-display-stack: var(--font-display), "Archivo Narrow", "Arial Narrow", sans-serif;
  --font-deva-display: "Noto Sans Devanagari", "Mukta", sans-serif;
  --fs-display: clamp(2.75rem, 1.4rem + 5.6vw, 6rem);
  --fs-h1: clamp(2.25rem, 1.2rem + 3.6vw, 4.25rem);
  --fs-h2: clamp(1.625rem, 1.1rem + 1.6vw, 2.5rem);
}
.display, .h1, .h2 {
  font-family: var(--font-display-stack), var(--font-deva-display); /* per-glyph fallback: Latin → Trade Gothic, Devanagari → Noto */
  font-weight: 700; text-transform: uppercase; text-wrap: balance;
  color: var(--text); font-variant-numeric: lining-nums;
}
.display { font-size: var(--fs-display); line-height: .94; letter-spacing: -.005em; max-width: 16ch; }
.h1      { font-size: var(--fs-h1);      line-height: .98; letter-spacing: -.003em; }
.h2      { font-size: var(--fs-h2);      line-height: 1.02; }
.eyebrow { font: 500 .75rem/1 var(--font-mono); letter-spacing: .12em; text-transform: uppercase; color: var(--text-faint); }

/* Hindi: no caps, no tracking, roomier leading, Devanagari font first, optically matched size */
:lang(hi) :is(.display, .h1, .h2) {
  font-family: var(--font-deva-display), var(--font-display-stack);
  text-transform: none; letter-spacing: 0; line-height: 1.28; max-width: none; font-weight: 800;
  font-stretch: 87.5%;
}
:lang(hi) .display { font-size: calc(var(--fs-display) * .9); }
:lang(hi) .eyebrow { text-transform: none; letter-spacing: 0; font-family: var(--font-deva-display); }
```
Optically match Hindi and English headline weight/size by eye at 375 and 1440px and tune the multipliers.

**Heading component:** `<Display>`, `<H1>`, `<H2>` (+ optional `eyebrow` and `index` props) are the only way to render display type — no ad-hoc `font-[...]` classes. One `<h1>` per page. Heading text ≤ 6 words; ≤ 2 lines at 1440px.

## 4.5 The "unique but efficient" devices (CSS/SVG only — zero extra font weight, zero JS)
1. **Signal Rule + index eyebrow.** Every section heading is preceded by a mono eyebrow with a section index (`01 / FORECAST`, Hindi: `०१`-style not required — use `01 / पूर्वानुमान`) and a 1px rule whose first 28px is `--brand`. The rule draws left→right as the heading enters the viewport using `animation-timeline: view()` (progressive enhancement; static fallback; disabled under `prefers-reduced-motion`).
```css
.signal-rule { height: 1px; background: linear-gradient(90deg, var(--brand) 0 28px, var(--border-strong) 28px); transform-origin: left; }
@supports (animation-timeline: view()) {
  .signal-rule { animation: rule-draw linear both; animation-timeline: view(); animation-range: entry 0% entry 60%; }
  @keyframes rule-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
}
@media (prefers-reduced-motion: reduce) { .signal-rule { animation: none; } }
```
2. **Data glyph inline with the headline.** One keyword in the hero H1 is followed by an inline SVG (sparkline that rises into a dashed forecast, ~0.72em tall, `currentColor`/`--forecast`, baseline-aligned). The headline literally contains a chart — memorable, ~300 bytes.
3. **Typography as visualisation.** Hero numerals (`808`, `97`, `711`) are set large in the display font with tabular alignment, captions in Inter. The number *is* the visual.
4. **Highlight word.** One word per headline may be coloured `--brand` (never a gradient or glow).
Use devices 1–4 only on the hero and page H1s; section H2s get device 1 only. Restraint is the point.

---

# 5. MVP HERO PAGE — `/`

Use route groups: `(marketing)` layout for `/` (slim topbar, footer, no sidebar) and `(app)` layout for the dashboard routes. `/overview` stays the operational dashboard; "Open dashboard" goes there. Add a "Back to home" wordmark link in the app topbar.

## 5.1 Page structure (top → bottom, 12-column grid, max-width 1200–1280px, generous vertical rhythm)
1. **Marketing topbar** (glass-strong, sticky): KY lockup · links *Dashboard · Scenario Studio · API* · language switch · theme toggle · primary button **Open dashboard / डैशबोर्ड खोलें**.
2. **Hero** (`min-height: min(88svh, 820px)`): two columns ≥ 1024px (7 / 5), stacked on mobile with the CTAs above the fold at 375px.
   - Eyebrow: `SIH 2026 · PS 26246 · MSDE`
   - **`<Display>` H1 EN:** "FORECAST THE SKILL GAP. FUND THE FIX." (data glyph after "GAP"; "FIX" in `--brand`) — **HI draft:** "कौशल अंतराल का पूर्वानुमान। समाधान में निवेश।"
   - Subhead EN: "KaushalYuva turns labour-market data into district-level forecasts, early warnings and seat-reallocation decisions for India's youth skilling system." — **HI draft:** "कौशलयुवा श्रम-बाज़ार के आँकड़ों को ज़िला-स्तरीय पूर्वानुमान, पूर्व चेतावनी और सीट-पुनर्आवंटन के निर्णयों में बदलता है — देश के युवाओं के कौशल विकास के लिए।"
   - CTAs: primary **Open dashboard / डैशबोर्ड खोलें**, secondary **Try Scenario Studio / परिदृश्य स्टूडियो आज़माएँ** (`/scenarios?preset=rec01`).
   - **Proof panel** (glass-strong, right column): `Gorakhpur · Solar PV Installer · 6M` · typographic ledger **DEMAND 808 → EFFECTIVE SUPPLY 97 → SHORTFALL 711** · mini forecast sparkline (historical solid, forecast dashed, confidence band) · "88% 6M shortage probability" · provenance chip · link "Simulate the fix →". **All values fetched from the API** (server component, cached); skeleton while loading; if the API is unreachable show a calm "Live figures unavailable" state, never stale hardcoded numbers.
3. **Proof strip** (flat, 4 items, tabular numerals): occupations tracked · districts covered · forecast horizons (3 / 6 / 12 M) · out-of-sample WAPE range — **all dynamic**; omit any item the API cannot supply.
4. **The story** — six steps as a horizontal rail (vertical on mobile): *Intelligence → Forecast → Gap → Explain → Act → Simulate*; each step = icon + one line + link to its route.
5. **Product tour** — three alternating rows (Forecasts, Intelligence Signals, Scenario Studio): H2 + two lines + theme-aware visual (Playwright-generated screenshots with light/dark variants, or live mini components). One decisive claim per row.
6. **Method & trust** — three short columns: *Official SIH dataset* (with provenance), *Walk-forward evaluation vs seasonal-naive baseline*, *Donor-safety rules protect the source trade*. Plus an honest note: "Pipeline snapshot — not a live feed" (Hindi: "पाइपलाइन स्नैपशॉट — लाइव फ़ीड नहीं").
7. **Closing CTA band** + **footer**: wordmark, tagline, links, `RUN-SIH-001 · SIH Dataset · Model vX.X`, team/event line from a single `site.config.ts` (so names are edited in one place), language + theme.

## 5.2 Quality bar for the hero
- Looks like a government-grade product, not a SaaS template: graphite/ivory foundation, existing tokens, restrained brand colour, **no neon, no gradient blobs**. Atmosphere layer unchanged.
- Hierarchy through type scale, spacing and one glass panel; do **not** wrap every section in a card.
- Performance: LCP < 2.0s, CLS < 0.02, JS for the hero ≤ what is strictly needed (server components; hydrate only the language/theme controls and sparkline).
- Entire page works in HI and EN, light and dark; Hindi copy must not break the two-column composition (test 375 / 768 / 1280 / 1920).
- Motion 150–300ms, reveal-on-scroll only for the Signal Rule and proof numbers; respects reduced motion.
- SEO/a11y: one `<h1>`, landmarks, skip link, per-locale metadata, OG image generated from the hero.

---

# 6. UI POLISH LIST (from the audit — verify, then fix)

1. Replace the duplicated root dashboard with the hero (§5); make `/overview` canonical for the dashboard.
2. **Provenance once per section/panel header**, not on every KPI, unless values in the same panel come from different sources (then show per-item).
3. Reduction wording: show "**6.2% of shortfall closed**" (HI: "कमी की 6.2% भरपाई") with a ▼ shortfall indicator instead of "Deficit Reduction -6.2%". One sign convention everywhere (shortfall always positive).
4. Map legend: **four** severity bands incl. Oversupply (< 40), identical to badges and chart palette.
5. Scenario Studio: server-rendered **skeleton that matches the final layout** instead of "Loading Scenario Studio…"; no layout shift when the client island hydrates.
6. `viewport.themeColor` as a light/dark pair (e.g. `[{ media: '(prefers-color-scheme: light)', color: '#F7F6F2' }, { media: '(prefers-color-scheme: dark)', color: '#090A0C' }]`).
7. Topbar: the unlabeled "4" next to Copilot — replace with a labelled bell/notification control, or remove if no data backs it.
8. Overview density: keep the ACTION REQUIRED ribbon and one dominant visual (map); collapse "Why This Matters" into a one-line expandable; keep KPI row to five items with scope subtitles.
9. Filters: one sticky glass pill row (State · District · Sector · Occupation · Horizon) with Reset; Occupation as a searchable combobox grouped by sector (Hindi + English search).
10. Every route gets a unique per-locale `<title>` and exactly one `<h1>` using the §4 heading component.
11. Sweep for any remaining hardcoded colour or light-only shadow; verify no white chart backgrounds in dark mode on any route.
12. Command palette: add "Go to Home", "Switch language", "Toggle theme", and make all labels localized.

---

# 7. DATA-AVAILABILITY & HONESTY (unchanged rules)
If a field has no data, render "Not available in this dataset" (HI: "इस डेटासेट में उपलब्ध नहीं") and list it in the report. "Refresh" never implies a live feed — use "Last run / अंतिम रन". Never display unverified accuracy claims. Alert actions (Investigate / Simulate / Act) must navigate to real screens with context pre-filled.

---

# 8. ACCESSIBILITY & PERFORMANCE (apply to all new work)
WCAG AA contrast in light and dark (including text on glass and the hero proof panel), visible 2px focus ring, keyboard-complete navigation, `aria-live` for scenario results and language change announcement ("भाषा हिन्दी में बदली गई"), reduced-motion respected, touch targets ≥ 40px, no horizontal page scroll at 375px. Lazy-load below-the-fold hero sections and screenshots, `next/image` with explicit sizes, no new heavy libraries (cmdk, next-intl and the font are the only justified additions).

---

# 9. DEMO PATH (must be smooth in BOTH languages)
`/` hero → Open dashboard → Overview (Gorakhpur) → Solar PV Installer → Forecast → "Why?" → Recommendation #01 → Scenario Studio (preset lands on 97 seats / donor 52 / ₹18.31L / 6.2% alone / 15.6% combo) → Impact → Export (Hindi PDF renders correctly). Each handoff pre-fills context; every step is one click.

---

# 10. QUALITY GATES (run and paste real output)
1. `pytest tests/ -v` → 27 passed.
2. `npm run build` → every route builds in EN and HI; zero TS/ESLint/hydration errors.
3. `scripts/i18n-check.ts` → 0 missing / 0 empty / 0 identical-to-English / 0 param mismatches.
4. ESLint `no-literal-string` → 0 violations.
5. Playwright Hindi crawl (§3.10) → **0 untranslated strings** across all routes and overlays; screenshots saved.
6. Playwright UI-vs-API tests (existing + hero proof panel values equal API) green; preset assertion still exact.
7. axe: Accessibility ≥ 95 on `/`, `/overview`, `/forecasts`, `/alerts`, `/recommendations`, `/scenarios` in EN + HI, light + dark.
8. Lighthouse desktop: Performance ≥ 90 on `/`; LCP < 2.0s, CLS < 0.02; display-font transfer ≤ ~40 KB.
9. `grep` for old brand → only documented internals.
10. Screenshots of every route in light/dark × EN/HI saved to `docs/ui-audit/<route>-<theme>-<locale>.png`; review and fix alignment, clipping, Devanagari rendering, dark-mode issues; `docs/UI_CHANGELOG.md` updated.

---

# 11. FINAL REPORT (measured, pasted — no estimates)
1. Rebrand status + list of deliberate internal leftovers
2. Hindi coverage: crawl result (untranslated count), key-parity result, routes/overlays/states covered, exports verified (CSV + PDF), items needing native-speaker review
3. Hero page: structure delivered, LCP/CLS, data bindings
4. Typography: which display font is active (Barlow Condensed vs licensed Trade Gothic), bytes transferred, devices used
5. UI polish items fixed (numbered per §6)
6. Test results (pytest, build, Playwright, axe, Lighthouse)
7. Remaining weaknesses (include any data field that was unavailable)
8. **GO / NO-GO** — GO only if Phases 1–4 and all §10 gates pass with evidence; otherwise NO-GO with exact blockers.

DO NOT CLAIM "100% HINDI" UNLESS THE CRAWL SHOWS ZERO UNTRANSLATED STRINGS.
DO THE WORK.
