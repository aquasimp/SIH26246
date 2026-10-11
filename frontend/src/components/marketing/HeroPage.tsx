'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { IndiaIntelligenceMap } from '@/components/maps/IndiaIntelligenceMap';
import { STATES } from '@/lib/demoData';
import { 
  ArrowRight, 
  Sliders, 
  Layers, 
  Activity,
  CheckCircle2,
  TrendingUp,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { getLocalizedEntityName } from '@/lib/i18n';

export function HeroPage() {
  const { language, selectedState, setSelectedState, l } = useApp();
  const isHi = language === 'hi';

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Cockpit: 2-Column Grid above the fold at 1440x900, stacks cleanly at 375 */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-5 pb-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* Left Column (lg: 7 cols): Tagline, Subtitle & ONE Primary CTA */}
          <div className="lg:col-span-7 flex flex-col justify-between py-1">
            <div className="space-y-3">
              {/* Tactical Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0055a5]/10 dark:bg-cyan-950/40 border border-[#00c2cb]/35 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c2cb] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00c2cb]" />
                </span>
                <span>{l('SMART INDIA HACKATHON 2026 · PS 26246 · MSDE', 'स्मार्ट इंडिया हैकथॉन 2026 · PS 26246 · MSDE')}</span>
              </div>

              {/* Tagline in condensed display font */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[var(--text)] tracking-tight font-display leading-[1.12]">
                {isHi ? (
                  <>
                    कौशल अंतराल का पूर्वानुमान। <span className="text-[#0055a5] dark:text-[#00c2cb]">समाधान में निवेश।</span>
                  </>
                ) : (
                  <>
                    FORECAST THE SKILL GAP. <span className="text-[#0055a5] dark:text-[#00c2cb]">FUND THE FIX.</span>
                  </>
                )}
              </h1>

              {/* Subtitle with exact text fix */}
              <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium leading-relaxed max-w-xl">
                {l(
                  'KaushalYuva turns official SIH dataset; NCS / SIDH / e-Shram via adapters into granular district-level forecasts, early warnings, and mathematically guarded seat reallocations.',
                  'कौशलयुवा आधिकारिक SIH डेटासेट; NCS / SIDH / e-Shram एडेप्टर के माध्यम से ज़िला-स्तरीय पूर्वानुमान, पूर्व चेतावनियाँ और गणितीय रूप से सुरक्षित सीट-पुनर्आवंटन प्रदान करता है।'
                )}
              </p>
            </div>

            {/* ONE Primary Action CTA */}
            <div className="pt-4 sm:pt-5">
              <Link
                href="/overview"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] hover:from-[#004488] hover:to-[#00a2ab] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#00c2cb]/20 hover:-translate-y-0.5 transition-all cursor-pointer font-sans"
              >
                <Compass className="w-4 h-4" />
                <span>{l('Open Intelligence Dashboard', 'पूर्ण डैशबोर्ड खोलें')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column (lg: 5 cols): Alert Card with big 711 & Demand vs Supply Bar */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="hud-card p-4 sm:p-5 rounded-2xl relative overflow-hidden border border-amber-500/35 bg-amber-500/5 dark:bg-[#0b1730]/85 h-full flex flex-col justify-between space-y-3.5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="eyebrow text-amber-600 dark:text-amber-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
                    {l('TOP EXECUTIVE ALERT · GORAKHPUR', 'शीर्ष कार्यकारी अलर्ट · गोरखपुर')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    {l('Severe Shortage (Score 94)', 'गंभीर कमी (स्कोर 94)')}
                  </span>
                </div>

                {/* Sentence heading in normal case with key figure 711 larger in accent */}
                <h2 className="text-sm sm:text-base font-bold text-[var(--text)] leading-snug">
                  {isHi ? (
                    <>
                      गोरखपुर में <span className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono align-baseline mx-0.5">711</span> सोलर पीवी इंस्टॉलर की कमी है।
                    </>
                  ) : (
                    <>
                      Gorakhpur is short by <span className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono align-baseline mx-0.5">711</span> solar installers.
                    </>
                  )}
                </h2>

                {/* Demand-vs-Supply Visual Bar */}
                <div className="p-3 rounded-xl glass border border-[var(--border)] space-y-2 bg-[var(--surface-solid)]/40">
                  <div className="flex justify-between items-center text-xs font-mono font-semibold">
                    <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-xs bg-[#0055a5] dark:bg-[#00c2cb] inline-block" />
                      {l('Supply: 97', 'आपूर्ति: 97')}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      {l('Deficit: 711 (88%)', 'कमी: 711 (88%)')}
                    </span>
                    <span className="text-[var(--text)] font-bold">
                      {l('Demand: 808', 'मांग: 808')}
                    </span>
                  </div>

                  {/* Stacked comparison bar */}
                  <div className="w-full h-3 rounded-lg bg-[var(--border)] overflow-hidden flex relative">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0055a5] to-[#00c2cb]" 
                      style={{ width: `${(97 / 808) * 100}%` }} 
                      title="Effective Supply: 97" 
                    />
                    <div 
                      className="h-full bg-amber-500/90" 
                      style={{ width: `${(711 / 808) * 100}%` }} 
                      title="Deficit: 711" 
                    />
                  </div>

                  <div className="flex justify-between text-xs font-mono text-[var(--text-faint)]">
                    <span>{l('12% Filled', '12% पूर्ति')}</span>
                    <span>{l('88% Unmet Deficit', '88% अधूरी मांग')}</span>
                  </div>
                </div>

                {/* Subtext with precise text fix */}
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {l(
                    'Transferring 97 seats from Retail Sales closes 6.2% deficit with zero donor risk (score 52). Remaining deficit after 97 seats is about 667 persons (requires capital expansion).',
                    'रिटेल सेल्स से 97 सीटें स्थानांतरित करने से शून्य दाता जोखिम (स्कोर 52) के साथ 6.2% कमी पूरी होती है। 97 सीटों के बाद शेष कमी लगभग 667 व्यक्ति है (पूंजीगत विस्तार आवश्यक)।'
                  )}
                </p>
              </div>

              <Link
                href="/scenarios?preset=rec01"
                className="inline-flex items-center justify-between w-full py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-xs"
              >
                <span>{l('Simulate Gorakhpur Fix (97 seats)', 'गोरखपुर समाधान अनुकरण (97 सीटें)')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Compact Proof Strip (Replacing 4 stat tiles with naive-vs-blend mini bar) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
        <div className="p-3 rounded-2xl glass border border-[var(--border)] shadow-xs flex flex-wrap md:flex-nowrap items-center justify-between gap-3 text-xs">
          {/* Geography */}
          <div className="flex items-center gap-2 px-2 shrink-0">
            <span className="text-xs font-mono font-bold text-cyan-700 dark:text-[#00c2cb] uppercase">
              {l('COVERAGE:', 'कवरेज:')}
            </span>
            <span className="font-extrabold text-[var(--text)]">
              16 {l('Districts', 'ज़िले')} · 5 {l('States', 'राज्य')}
            </span>
          </div>

          <div className="hidden md:block w-px h-6 bg-[var(--border)]" />

          {/* Occupations */}
          <div className="flex items-center gap-2 px-2 shrink-0">
            <span className="text-xs font-mono font-bold text-cyan-700 dark:text-[#00c2cb] uppercase">
              {l('TRADES:', 'व्यवसाय:')}
            </span>
            <span className="font-extrabold text-[var(--text)]">
              16 {l('NCO-2015 Trades', 'NCO-2015 ट्रेड्स')}
            </span>
          </div>

          <div className="hidden md:block w-px h-6 bg-[var(--border)]" />

          {/* Forecast Horizons */}
          <div className="flex items-center gap-2 px-2 shrink-0">
            <span className="text-xs font-mono font-bold text-cyan-700 dark:text-[#00c2cb] uppercase">
              {l('HORIZONS:', 'क्षितिज:')}
            </span>
            <span className="font-mono font-bold text-[var(--text)]">
              3M · 6M · 12M
            </span>
          </div>

          <div className="hidden md:block w-px h-6 bg-[var(--border)]" />

          {/* Out-Of-Sample WAPE Mini Bar (Naive vs Blend using audit numbers) */}
          <div className="flex items-center gap-3 px-2 flex-1 min-w-[240px]">
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-cyan-400 uppercase shrink-0">
              {l('OUT-OF-SAMPLE WAPE:', 'आउट-ऑफ-सैंपल WAPE:')}
            </span>
            <div className="flex-1 flex flex-col justify-center space-y-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[var(--text-muted)]">Naive: 6.93%</span>
                <span className="font-bold text-cyan-700 dark:text-cyan-400">Blend: 3.41% (-50.8%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden flex">
                <div 
                  className="h-full bg-cyan-500 rounded-full" 
                  style={{ width: `${(3.41 / 6.93) * 100}%` }} 
                  title="Blend WAPE: 3.41% vs Naive 6.93%" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Single Sticky Compact State Filter Bar (Removed duplicate quick-jump) */}
      <section className="sticky top-14 z-30 w-full glass-strong border-y border-[var(--border)] py-2 px-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase mr-1">
              {l('STATE FILTER:', 'राज्य फ़िल्टर:')}
            </span>
            <button
              type="button"
              onClick={() => setSelectedState('All')}
              className={`px-3 py-1 rounded-lg font-bold font-sans transition-all cursor-pointer ${
                selectedState === 'All'
                  ? 'bg-gradient-to-r from-[#0055a5] to-[#00c2cb] text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
              }`}
            >
              {l('All 5 States', 'सभी 5 राज्य')}
            </button>
            {STATES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedState(s)}
                className={`px-2.5 py-1 rounded-lg font-bold font-sans transition-all cursor-pointer ${
                  selectedState === s
                    ? 'bg-gradient-to-r from-[#0055a5] to-[#00c2cb] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
                }`}
              >
                {isHi ? getLocalizedEntityName('states', s, 'hi') : s}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-[var(--text-faint)] shrink-0 hidden sm:block">
            {selectedState === 'All' 
              ? l('16 Priority Districts Active', '16 प्राथमिकता ज़िले सक्रिय') 
              : l(`Filtered to ${selectedState}`, `${selectedState} चयनित`)}
          </div>
        </div>
      </section>

      {/* 4. Tactical Map & Selected District Panel */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <IndiaIntelligenceMap />
      </section>

      {/* 5. Top 3 Ranked Interventions: Equal Height, One Primary Action, Before/After Mini Bars */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
          <div>
            <span className="eyebrow text-cyan-700 dark:text-[#00c2cb]">
              <span className="eyebrow-bullet" />
              {l('TOP 3 RANKED INTERVENTIONS', 'शीर्ष 3 अनुशंसित हस्तक्षेप')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] tracking-tight font-display mt-0.5">
              {l('Evidence-Backed Policy Interventions', 'डेटा-संचालित नीति समाधान')}
            </h2>
          </div>
          <Link
            href="/recommendations"
            className="text-xs font-bold text-[#0055a5] dark:text-[#00c2cb] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{l('View all interventions', 'सभी हस्तक्षेप देखें')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {/* Recommendation 1: Gorakhpur Solar PV Installer */}
          <div className="p-5 rounded-3xl hud-card flex flex-col justify-between space-y-4 h-full group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-extrabold text-cyan-700 dark:text-[#00c2cb]">
                  REC-01
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25">
                  {l('LP Optimization · SIH Dataset', 'LP अनुकूलन · आधिकारिक SIH')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[var(--text)] font-display group-hover:text-[#00c2cb] transition-colors">
                  {l('Gorakhpur Solar PV Seat Transfer', 'गोरखपुर सोलर पीवी सीट स्थानांतरण')}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {l('Gorakhpur, Uttar Pradesh', 'गोरखपुर, उत्तर प्रदेश')}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                {l(
                  'Reallocate 97 seats from Retail Sales Associate to Solar PV Installer. Donor score post-transfer: 52 (Balanced). 6.2% deficit closed.',
                  'रिटेल सेल्स (97 सीटें) से सोलर पीवी इंस्टॉलर में स्थानांतरण। दाता स्कोर 52 (संतुलित), कमी में 6.2% सुधार।'
                )}
              </p>

              {/* Before/After Mini Bar */}
              <div className="p-2.5 rounded-xl glass border border-[var(--border)] space-y-1.5 bg-[var(--surface-solid)]/40">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    {l('Before: Score 94', 'पहले: स्कोर 94')}
                  </span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-extrabold">
                    {l('After: Score 80 (-15%)', 'बाद: स्कोर 80 (-15%)')}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden flex">
                  <div className="h-full bg-amber-500" style={{ width: '80%' }} />
                  <div className="h-full bg-cyan-500/40" style={{ width: '14%' }} />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl glass border border-[var(--border)] text-center text-xs font-mono">
                <div>
                  <span className="text-xs text-[var(--text-faint)] block uppercase">
                    {l('Shift', 'स्थानांतरण')}
                  </span>
                  <span className="font-extrabold text-cyan-700 dark:text-[#00c2cb]">{l('97 seats', '97 सीटें')}</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-faint)] block uppercase">
                    {l('Deficit Closed', 'कमी पूर्ण')}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">6.2%</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-faint)] block uppercase">
                    {l('Combo Budget', 'कॉम्बो बजट')}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">₹18.31L</span>
                </div>
              </div>
            </div>

            {/* ONE Primary Action */}
            <Link
              href="/scenarios?preset=rec01"
              className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#00c2cb]/20 font-sans mt-2"
            >
              <span>{l('Simulate in Scenario Studio', 'LP सिमुलेशन खोलें')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommendation 2: Pune EV Service Technician */}
          <div className="p-5 rounded-3xl hud-card flex flex-col justify-between space-y-4 h-full group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-extrabold text-cyan-700 dark:text-[#00c2cb]">
                  REC-02
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  {l('Model Output · SIH Dataset', 'मॉडल आउटपुट · SIH डेटासेट')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[var(--text)] font-display group-hover:text-[#00c2cb] transition-colors">
                  {l('Pune EV Service Technician Cluster', 'पुणे ईवी सर्विस तकनीशियन क्लस्टर')}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {l('Pune, Maharashtra (Chakan & Bhosari)', 'पुणे, महाराष्ट्र (चाकण एवं भोसरी)')}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                {l(
                  'Proposed new EV training cluster in Chakan-Bhosari corridor adding 400 new seats, closing projected deficit by 54%.',
                  'चाकण-भोसरी औद्योगिक क्षेत्र में ऑटोमोबाइल फिटर से 400 नई ईवी सर्विस सीटें स्थापित करने का प्रस्ताव।'
                )}
              </p>

              {/* Before/After Mini Bar */}
              <div className="p-2.5 rounded-xl glass border border-[var(--border)] space-y-1.5 bg-[var(--surface-solid)]/40">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    {l('Before: Score 88', 'पहले: स्कोर 88')}
                  </span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-extrabold">
                    {l('After: Score 40 (-54%)', 'बाद: स्कोर 40 (-54%)')}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden flex">
                  <div className="h-full bg-amber-500" style={{ width: '40%' }} />
                  <div className="h-full bg-cyan-500/40" style={{ width: '48%' }} />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl glass border border-[var(--border)] text-center text-xs font-mono">
                <div>
                  <span className="text-xs text-[var(--text-faint)] block uppercase">
                    {l('New Seats', 'नई क्षमता')}
                  </span>
                  <span className="font-extrabold text-cyan-700 dark:text-[#00c2cb]">+400</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-faint)] block uppercase">
                    {l('Deficit Closed', 'कमी पूर्ण')}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">54.0%</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-faint)] block uppercase">
                    {l('Capex', 'अनुमानित व्यय')}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">₹26.0L</span>
                </div>
              </div>
            </div>

            {/* ONE Primary Action */}
            <Link
              href="/recommendations"
              className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#00c2cb]/20 font-sans mt-2"
            >
              <span>{l('View Recommendation Details', 'सिफारिश विवरण देखें')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommendation 3: Coimbatore CNC Machine Operator */}
          <div className="p-5 rounded-3xl hud-card flex flex-col justify-between space-y-4 h-full group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-extrabold text-cyan-700 dark:text-[#00c2cb]">
                  REC-03
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  {l('Model Output · SIH Dataset', 'मॉडल आउटपुट · SIH डेटासेट')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[var(--text)] font-display group-hover:text-[#00c2cb] transition-colors">
                  {l('Coimbatore CNC Machine Operator Cluster', 'कोयंबटूर सीएनसी ऑपरेटर क्लस्टर')}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {l('Coimbatore, Tamil Nadu', 'कोयंबटूर, तमिलनाडु')}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                {l(
                  'Precision engineering and pump manufacturing corridor adding 350 new CNC seats, closing projected deficit by 48%.',
                  'सटीक इंजीनियरिंग और पंप निर्माण क्लस्टर में 350 नई सीएनसी ऑपरेटर सीटें, अनुमानित कमी में 48% की कमी।'
                )}
              </p>

              {/* Before/After Mini Bar */}
              <div className="p-2.5 rounded-xl glass border border-[var(--border)] space-y-1.5 bg-[var(--surface-solid)]/40">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    {l('Before: Score 76', 'पहले: स्कोर 76')}
                  </span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-extrabold">
                    {l('After: Score 38 (-48%)', 'बाद: स्कोर 38 (-48%)')}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden flex">
                  <div className="h-full bg-amber-500" style={{ width: '38%' }} />
                  <div className="h-full bg-cyan-500/40" style={{ width: '38%' }} />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl glass border border-[var(--border)] text-center text-xs font-mono">
                <div>
                  <span className="text-xs text-[var(--text-faint)] block uppercase">
                    {l('New Seats', 'नई क्षमता')}
                  </span>
                  <span className="font-extrabold text-cyan-700 dark:text-[#00c2cb]">+350</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-faint)] block uppercase">
                    {l('Deficit Closed', 'कमी पूर्ण')}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">48.0%</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-faint)] block uppercase">
                    {l('Capex', 'अनुमानित व्यय')}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">₹22.75L</span>
                </div>
              </div>
            </div>

            {/* ONE Primary Action */}
            <Link
              href="/recommendations"
              className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#00c2cb]/20 font-sans mt-2"
            >
              <span>{l('View Recommendation Details', 'सिफारिश विवरण देखें')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PS 26246 Compliance: Collapsed 2x2 Icon Tiles with One Line Each */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
          <div>
            <span className="eyebrow text-cyan-700 dark:text-[#00c2cb]">
              <span className="eyebrow-bullet" />
              {l('SMART INDIA HACKATHON · PS 26246 COMPLIANCE', 'स्मार्ट इंडिया हैकथॉन · PS 26246 अनुपालन')}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] tracking-tight font-display mt-0.5">
              {l('MSDE Problem Statement 26246: Implementation Matrix', 'एमएसडीई समस्या विवरण २६२४६: कार्यान्वयन ढांचा')}
            </h2>
          </div>
          <Link
            href="/methodology"
            className="text-xs font-bold text-[#0055a5] dark:text-[#00c2cb] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{l('View Methodology & Math Proof', 'संपूर्ण पद्धति एवं गणितीय प्रमाण')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2x2 Collapsed Icon Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Tile 1: Demand Normalization */}
          <Link
            href="/occupations"
            className="p-3.5 rounded-2xl hud-card group flex items-start gap-3 hover:border-[#00c2cb]/50 transition-all"
          >
            <div className="p-2 rounded-xl bg-blue-500/10 text-[#0055a5] dark:text-[#00c2cb] shrink-0 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-[var(--text)] group-hover:text-[#00c2cb] transition-colors">
                  {l('NCO/NSQF Demand Normalization', 'NCO/NSQF मांग सामान्यीकरण')}
                </h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00c2cb] shrink-0" />
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate sm:whitespace-normal font-sans">
                {l(
                  '3-tier cascade maps unstructured postings to official NCO-2015 8-digit codes.',
                  '3-स्तरीय कैस्केड असंरचित नौकरियों को आधिकारिक NCO-2015 8-अंकीय कोड में मैप करता है।'
                )}
              </p>
            </div>
          </Link>

          {/* Tile 2: Time-Series ML Forecaster */}
          <Link
            href="/forecasts"
            className="p-3.5 rounded-2xl hud-card group flex items-start gap-3 hover:border-[#00c2cb]/50 transition-all"
          >
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-[var(--text)] group-hover:text-[#00c2cb] transition-colors">
                  {l('Zero-Leakage ML Forecaster', 'शून्य-रिसाव एमएल पूर्वानुमान')}
                </h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00c2cb] shrink-0" />
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate sm:whitespace-normal font-sans">
                {l(
                  'Lagged LightGBM ensemble delivering 3.41%–3.71% out-of-sample WAPE across 3M/6M/12M.',
                  'लैग्ड LightGBM एन्सेम्बल जो 3M/6M/12M में 3.41% - 3.71% आउट-ऑफ-सैंपल WAPE प्रदान करता है।'
                )}
              </p>
            </div>
          </Link>

          {/* Tile 3: Staged Supply Funnel */}
          <Link
            href="/methodology"
            className="p-3.5 rounded-2xl hud-card group flex items-start gap-3 hover:border-[#00c2cb]/50 transition-all"
          >
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-[var(--text)] group-hover:text-[#00c2cb] transition-colors">
                  {l('4-Stage Staged Supply Funnel', '4-चरणीय आपूर्ति फ़नल')}
                </h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00c2cb] shrink-0" />
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate sm:whitespace-normal font-sans">
                {l(
                  'Replaces raw seat counts with certified attrition and job-readiness factors.',
                  'कच्ची सीटों को प्रमाणित क्षरण और कार्य-तत्परता कारकों से प्रतिस्थापित करता है।'
                )}
              </p>
            </div>
          </Link>

          {/* Tile 4: PuLP Capacity Solver */}
          <Link
            href="/scenarios"
            className="p-3.5 rounded-2xl hud-card group flex items-start gap-3 hover:border-[#00c2cb]/50 transition-all"
          >
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-[var(--text)] group-hover:text-[#00c2cb] transition-colors">
                  {l('PuLP Simplex LP Solver', 'PuLP सिम्पलेक्स एलपी सॉल्वर')}
                </h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00c2cb] shrink-0" />
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate sm:whitespace-normal font-sans">
                {l(
                  'Mathematically reallocates seats under strict donor non-depletion guardrails (δ ≤ 0.05).',
                  'सख्त दाता गैर-रिक्तीकरण सुरक्षा (δ ≤ 0.05) के तहत सीटों का गणितीय पुनर्आवंटन करता है।'
                )}
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
