'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { IndiaIntelligenceMap } from '@/components/maps/IndiaIntelligenceMap';
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
import { Provenance } from '@/components/common/Provenance';

export function HeroPage() {
  const { language, l } = useApp();

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. DepthWizard Centered Luminous Hero Cockpit with Circuit Overlay & Floating Dock */}
      <section className="luminous-hero-container w-full flex flex-col items-center">
        {/* Background Architectural Circuit & Telemetry SVGs from DepthWizard */}
        <div className="hero-circuit-bg" aria-hidden="true">
          <svg className="circuit-lines-svg" width="100%" height="100%" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
            {/* Left Circuit Lines */}
            <path d="M 0 180 L 180 180 L 220 220 L 220 380 L 260 420 L 340 420" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M 0 320 L 120 320 L 160 360 L 160 480" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
            <circle cx="220" cy="220" r="3" fill="rgba(255, 255, 255, 0.7)" />
            <circle cx="260" cy="420" r="3" fill="rgba(255, 255, 255, 0.7)" />

            {/* Right Circuit Lines */}
            <path d="M 1440 180 L 1260 180 L 1220 220 L 1220 380 L 1180 420 L 1100 420" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M 1440 320 L 1320 320 L 1280 360 L 1280 480" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
            <circle cx="1220" cy="220" r="3" fill="rgba(255, 255, 255, 0.7)" />
            <circle cx="1180" cy="420" r="3" fill="rgba(255, 255, 255, 0.7)" />

            {/* Technical HUD Coordinates Text */}
            <text x="32" y="32" fill="rgba(255, 255, 255, 0.4)" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">LAT 26.7606° N · LON 83.3732° E</text>
            <text x="1220" y="32" fill="rgba(255, 255, 255, 0.4)" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">SYS: MSDE-NCO-2015 · ELEV 79M</text>
          </svg>
        </div>

        <div className="hero-inner-content">
          {/* Top Floating Badge Pill */}
          <div className="hero-pill-badge">
            <span className="badge-sparkle">✦</span>
            <span className="badge-text">
              {l('MSDE / SIDH · NATIONAL LABOUR INTELLIGENCE & FORECASTING ENGINE', 'MSDE / SIDH · राष्ट्रीय श्रम बाजार बुद्धिमत्ता एवं पूर्वानुमान इंजन')}
            </span>
          </div>

          {/* High-Impact Bold Hero Headline (Exact DepthWizard Typography — Not thin AI serif) */}
          <h1 className="hero-bold-title">
            {language === 'hi' ? (
              <>
                कौशल अंतराल का पूर्वानुमान <span className="hero-title-highlight">एवं प्रशिक्षण क्षमता का रूपांतरण</span>
              </>
            ) : (
              <>
                FORECAST THE SKILL GAP <span className="hero-title-highlight">&amp; TRANSFORM TRAINING CAPACITY</span> <br className="hero-title-br" /> for the Nation&apos;s Skills Ecosystem
              </>
            )}
          </h1>

          {/* Subheading Card with Illuminated Card Background */}
          <div className="hero-subheading-card">
            <div className="subheading-icon-badge">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <p className="hero-subheading-text">
              {l(
                'Deterministic labour-market intelligence and cost-optimized ITI seat reallocation powered by ',
                'नियतात्मक श्रम-बाजार खुफिया एवं लागत-अनुकूलित ITI सीट पुनर्आवंटन संचालित '
              )}
              <strong>{l('Tri-Model Ensemble Blend', 'त्रि-मॉडल पहनावा मिश्रण')}</strong>
            </p>
            <div className="subheading-badge-tag">
              <span>⚡ WAPE 3.41%</span>
            </div>
          </div>

          {/* Triple Action CTA Buttons Row (DepthWizard Master Layout) */}
          <div className="hero-cta-buttons-row">
            {/* Primary Dark Button with Intense Soft Ambient Glow */}
            <Link
              href="/overview"
              className="hero-btn-dark-glow"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>{l('Open Dashboard', 'डैशबोर्ड खोलें')}</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </Link>

            {/* Tactical Cockpit Dedicated CTA Button */}
            <Link
              href="/scenarios?preset=rec01"
              className="hero-btn-cockpit-pill"
              title={l('Launch Seat Reallocation Studio', 'सीट पुनर्आवंटन स्टूडियो खोलें')}
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>{l('Seat Reallocation Studio', 'सीट पुनर्आवंटन स्टूडियो')}</span>
              <span className="cockpit-badge-live">{l('LIVE', 'लाइव')}</span>
            </Link>

            {/* Secondary Crisp White Pill Button */}
            <Link
              href="/intelligence"
              className="hero-btn-white-pill"
            >
              <Layers className="w-4 h-4 text-sky-600" />
              <span>{l('Browse National Intelligence', 'राष्ट्रीय बुद्धिमत्ता ब्राउज़ करें')}</span>
            </Link>
          </div>

          {/* Floating Bottom Pill Dock with Connector Line */}
          <div className="hero-bottom-dock-wrapper">
            <div className="dock-connector-line" aria-hidden="true" />
            <div className="hero-bottom-dock">
              <Link href="#tactical-map" className="dock-pill-chip active">
                <span className="dock-chip-icon">✦</span>
                <span>{l('National Imbalance Map', 'राष्ट्रीय असंतुलन मानचित्र')}</span>
              </Link>
              <Link href="/forecasts" className="dock-pill-chip">
                <TrendingUp className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>{l('3M · 6M · 12M Horizon Blend', 'क्षितिज मिश्रण')}</span>
              </Link>
              <Link href="/gaps" className="dock-pill-chip">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span>{l('16 Trade Gap Scores', '16 व्यवसाय अंतराल')}</span>
              </Link>
              <Link href="/scenarios" className="dock-pill-chip">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>{l('Seat Reallocation Studio', 'सीट पुनर्आवंटन स्टूडियो')}</span>
              </Link>
              <Link href="/methodology" className="dock-pill-chip">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{l('WAPE 3.41% (-50.8%)', 'सटीकता WAPE 3.41%')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Compact Proof Strip with Liquid Glass */}
      <section className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 py-5">
        <div className="liquid-glass-card py-3.5 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-slate-800 gap-y-3 sm:gap-y-2 lg:gap-y-0 shadow-xs">
          {/* Geography */}
          <div className="flex items-center gap-2 px-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              {l('COVERAGE:', 'कवरेज:')}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
              16 {l('Districts', 'ज़िले')} · 5 {l('States', 'राज्य')}
            </span>
          </div>

          {/* Occupations */}
          <div className="flex items-center gap-2 px-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              {l('TRADES:', 'व्यवसाय:')}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
              16 {l('NCO-2015 Trades', 'NCO-2015 ट्रेड्स')}
            </span>
          </div>

          {/* Forecast Horizons */}
          <div className="flex items-center gap-2 px-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              {l('HORIZONS:', 'क्षितिज:')}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              3M · 6M · 12M
            </span>
          </div>

          {/* Out-Of-Sample WAPE Mini Bar */}
          <div className="flex items-center gap-3 px-2 flex-1 min-w-0 sm:min-w-[200px]">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider shrink-0 font-mono">
              {l('WAPE:', 'WAPE:')}
            </span>
            <div className="flex-1 flex flex-col justify-center space-y-1">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500">Naive: 6.93%</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Blend: 3.41% (-50.8%)</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${(3.41 / 6.93) * 100}%` }} 
                  title="Blend WAPE: 3.41% vs Naive 6.93%" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Executive Priority Policy Intervention Spotlight (Cleanly placed below hero) */}
      <section className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 py-2">
        <div className="liquid-glass-card hud-corner-card p-6 sm:p-7 border border-amber-500/30 rounded-2xl shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]" />
                  </span>
                  <span>{l('Priority Intervention · Gorakhpur, UP', 'प्राथमिकता हस्तक्षेप · गोरखपुर, उ.प्र.')}</span>
                </span>
                <Provenance source="SIH dummy dataset" note="RUN-SIH-001" compact={false} />
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  {l('Score 94 · Critical Deficit', 'स्कोर 94 · गंभीर कमी')}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {l('711-Seat Deficit in Solar PV Installers', 'सोलर पीवी इंस्टॉलर में 711 सीटों की कमी')}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {l(
                  'Reallocating 97 surplus seats from Retail Sales closes 6.2% deficit at ₹6.31L retrofit CapEx, saving ₹6.3L in public funds vs. greenfield seats. Retail donor stays Balanced (52). Remaining ~667 persons need new capacity.',
                  'रिटेल सेल्स से 97 अतिरिक्त सीटें पुनर्आवंटित करने से ₹6.31 लाख रेट्रोफ़िट पूंजी व्यय में 6.2% घाटा कम होता है, ₹6.3 लाख की बचत होती है। दाता संतुलित रहता है (52)। शेष ~667 व्यक्तियों को नई क्षमता की आवश्यकता है।'
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[320px] lg:max-w-md w-full justify-between">
              {/* Demand-vs-Supply Visual Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 space-y-2 w-full">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-xs bg-slate-700 dark:bg-slate-300 inline-block" />
                    {l('Supply: 97', 'आपूर्ति: 97')}
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold font-mono">
                    {l('Deficit: 711 (88%)', 'कमी: 711 (88%)')}
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold font-mono">
                    {l('Demand: 808', 'मांग: 808')}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex relative">
                  <div 
                    className="h-full bg-slate-700 dark:bg-slate-300" 
                    style={{ width: `${(97 / 808) * 100}%` }} 
                    title="Effective Supply: 97" 
                  />
                  <div 
                    className="h-full bg-amber-500" 
                    style={{ width: `${(711 / 808) * 100}%` }} 
                    title="Deficit: 711" 
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>{l('12% Staged Coverage', '12% चरणबद्ध पूर्ति')}</span>
                  <span>{l('88% Unmet Deficit', '88% अधूरी मांग')}</span>
                </div>
              </div>

              <Link
                href="/scenarios?preset=rec01"
                className="btn-liquid-primary inline-flex items-center justify-center gap-2 w-full py-2.5 px-5 rounded-full font-bold text-xs shadow-xs"
              >
                <span>{l('Simulate Gorakhpur Seat Transfer (97 Seats)', 'गोरखपुर सीट स्थानांतरण अनुकरण (97 सीटें)')}</span>
                <ArrowRight className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* 4. Tactical Map & Selected District Panel */}
      <section id="tactical-map" className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 py-5 scroll-mt-16 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {l('GEOSPATIAL INTELLIGENCE', 'भू-स्थानिक बुद्धिमत्ता')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {language === 'hi' ? (
                'राष्ट्रीय कौशल असंतुलन एवं क्षमता मानचित्र'
              ) : (
                <>
                  National Skill Imbalance &amp; Capacity <span className="title-serif-italic">Choropleth</span>
                </>
              )}
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono shrink-0 hidden sm:block">
            {l('16 Evaluation Districts · 5 Anchor States', '16 मूल्यांकन जिले · 5 प्रमुख राज्य')}
          </span>
        </div>
        <IndiaIntelligenceMap />
      </section>

      {/* 5. Top 3 Ranked Interventions */}
      <section className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {l('TOP 3 RANKED INTERVENTIONS', 'शीर्ष 3 अनुशंसित हस्तक्षेप')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
              {language === 'hi' ? (
                'डेटा-संचालित नीति समाधान'
              ) : (
                <>
                  Evidence-Backed Policy <span className="title-serif-italic">Interventions</span>
                </>
              )}
            </h2>
          </div>
          <Link
            href="/recommendations"
            className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{l('View all interventions', 'सभी हस्तक्षेप देखें')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {/* Recommendation 1: Gorakhpur Solar PV Installer */}
          <div className="p-5 rounded-2xl glass-interactive border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 h-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_4px_24px_-4px_rgba(15,23,42,0.05)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  REC-01
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                  {l('MSDE Verified · LP Solver', 'MSDE सत्यापित · LP सॉल्वर')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {l('Gorakhpur Solar PV Seat Transfer', 'गोरखपुर सोलर पीवी सीट स्थानांतरण')}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {l('Gorakhpur, Uttar Pradesh', 'गोरखपुर, उत्तर प्रदेश')}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {l(
                  'Reallocate 97 seats from Retail Sales Associate to Solar PV Installer. Closes 6.2% deficit at ₹6.31L retrofit CapEx, saving ₹6.3L in public funds vs. greenfield seats. Retail donor remains balanced (Score 52).',
                  'रिटेल सेल्स (97 सीटें) से सोलर पीवी इंस्टॉलर में स्थानांतरण। ₹6.31 लाख रेट्रोफ़िट पूंजी व्यय में 6.2% घाटा कम, ₹6.3 लाख की बचत। दाता स्कोर 52 (संतुलित) बना रहता है।'
                )}
              </p>

              {/* Before/After Mini Bar */}
              <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    {l('Before: Score 94', 'पहले: स्कोर 94')}
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">
                    {l('After: Score 80 (-15%)', 'बाद: स्कोर 80 (-15%)')}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                  <div className="h-full bg-amber-500" style={{ width: '80%' }} />
                  <div className="h-full bg-slate-400" style={{ width: '14%' }} />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {l('Shift', 'स्थानांतरण')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{l('97 seats', '97 सीटें')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {l('Deficit Closed', 'कमी पूर्ण')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">6.2%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {l('Package Budget', 'पैकेज बजट')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">₹18.31L</span>
                </div>
              </div>
            </div>

            {/* ONE Primary Action */}
            <Link
              href="/scenarios?preset=rec01"
              className="btn-liquid-primary inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group mt-2 shadow-xs"
            >
              <span>{l('Simulate in Scenario Studio', 'LP सिमुलेशन खोलें')}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-sky-600 dark:text-sky-400" />
            </Link>
          </div>

          {/* Recommendation 2: Pune EV Service Technician */}
          <div className="p-5 rounded-2xl liquid-glass-card hud-corner-card flex flex-col justify-between space-y-4 h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                  REC-02
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {l('MSDE Policy Brief · Ensemble Model', 'MSDE नीति संक्षिप्त · मॉडल आउटपुट')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? (
                    'पुणे ईवी सर्विस तकनीशियन क्लस्टर'
                  ) : (
                    <>
                      Pune EV Service Technician <span className="title-serif-italic">Cluster</span>
                    </>
                  )}
                </h3>
                <span className="text-xs text-slate-500 font-medium font-mono">
                  {l('Pune, Maharashtra (Chakan & Bhosari)', 'पुणे, महाराष्ट्र (चाकण एवं भोसरी)')}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {l(
                  'Chakan–Bhosari industrial corridor faces a 741-candidate deficit. Converting 54% training funnel capacity adds 400 seats at ₹26.0L estimated CapEx.',
                  'चाकण-भोसरी औद्योगिक गलियारे में 741 उम्मीदवारों की कमी। 54% प्रशिक्षण फ़नल क्षमता परिवर्तित कर ₹26.0 लाख अनुमानित पूंजी व्यय पर 400 सीटें जोड़ी जाती हैं।'
                )}
              </p>

              {/* Before/After Mini Bar */}
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    {l('Before: Score 88', 'पहले: स्कोर 88')}
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">
                    {l('After: Score 40 (-54%)', 'बाद: स्कोर 40 (-54%)')}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                  <div className="h-full bg-amber-500" style={{ width: '40%' }} />
                  <div className="h-full bg-slate-400" style={{ width: '48%' }} />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-center text-xs shadow-2xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {l('New Seats', 'नई क्षमता')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">+400</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {l('Deficit Closed', 'कमी पूर्ण')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">54.0%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {l('Capex', 'अनुमानित व्यय')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">₹26.0L</span>
                </div>
              </div>
            </div>

            {/* ONE Primary Action */}
            <Link
              href="/recommendations"
              className="btn-liquid-primary inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group mt-2 shadow-xs"
            >
              <span>{l('View Recommendation Details', 'सिफारिश विवरण देखें')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-sky-600 dark:text-sky-400" />
            </Link>
          </div>

          {/* Recommendation 3: Coimbatore CNC Machine Operator */}
          <div className="p-5 rounded-2xl liquid-glass-card hud-corner-card flex flex-col justify-between space-y-4 h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                  REC-03
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {l('MSDE Policy Brief · Ensemble Model', 'MSDE नीति संक्षिप्त · मॉडल आउटपुट')}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {language === 'hi' ? (
                    'कोयंबटूर सीएनसी ऑपरेटर क्लस्टर'
                  ) : (
                    <>
                      Coimbatore CNC Machine Operator <span className="title-serif-italic">Cluster</span>
                    </>
                  )}
                </h3>
                <span className="text-xs text-slate-500 font-medium font-mono">
                  {l('Coimbatore, Tamil Nadu', 'कोयंबटूर, तमिलनाडु')}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {l(
                  'Precision engineering and pump manufacturing corridor shows a 729-candidate deficit. Adding 350 seats at 48% funnel conversion closes the gap with ₹22.75L CapEx.',
                  'सटीक इंजीनियरिंग और पंप विनिर्माण गलियारे में 729 उम्मीदवारों की कमी। 48% फ़नल रूपांतरण पर 350 सीटें जोड़कर ₹22.75 लाख पूंजी व्यय से यह अंतर समाप्त होता है।'
                )}
              </p>

              {/* Before/After Mini Bar */}
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    {l('Before: Score 76', 'पहले: स्कोर 76')}
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">
                    {l('After: Score 38 (-48%)', 'बाद: स्कोर 38 (-48%)')}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                  <div className="h-full bg-amber-500" style={{ width: '38%' }} />
                  <div className="h-full bg-slate-400" style={{ width: '38%' }} />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-center text-xs shadow-2xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {l('New Seats', 'नई क्षमता')}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">+350</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {l('Deficit Closed', 'कमी पूर्ण')}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">48.0%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    {l('Capex', 'अनुमानित व्यय')}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">₹22.75L</span>
                </div>
              </div>
            </div>

            {/* ONE Primary Action */}
            <Link
              href="/recommendations"
              className="btn-liquid-primary inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group mt-2 shadow-xs"
            >
              <span>{l('View Recommendation Details', 'सिफारिश विवरण देखें')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-sky-600 dark:text-sky-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PS 26246 Compliance: Collapsed 2x2 Icon Tiles */}
      <section className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-mono">
              {l('SMART INDIA HACKATHON · PS 26246 COMPLIANCE', 'स्मार्ट इंडिया हैकथॉन · PS 26246 अनुपालन')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
              {language === 'hi' ? (
                'एमएसडीई समस्या विवरण २६२४६: कार्यान्वयन ढांचा'
              ) : (
                <>
                  MSDE Problem Statement 26246: <span className="title-serif-italic">Implementation Matrix</span>
                </>
              )}
            </h2>
          </div>
          <Link
            href="/methodology"
            className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{l('View Methodology & Math Proof', 'संपूर्ण पद्धति एवं गणितीय प्रमाण')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2x2 Icon Tiles in Liquid Glass */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Tile 1: Demand Normalization */}
          <Link
            href="/occupations"
            className="p-4 rounded-2xl liquid-glass-card group flex items-start gap-3 hover:-translate-y-0.5 transition-all shadow-xs"
          >
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  {l('NCO/NSQF Demand Normalization', 'NCO/NSQF मांग सामान्यीकरण')}
                </h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate sm:whitespace-normal">
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
            className="p-4 rounded-2xl liquid-glass-card group flex items-start gap-3 hover:-translate-y-0.5 transition-all shadow-xs"
          >
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  {l('Zero-Leakage ML Forecaster', 'शून्य-रिसाव एमएल पूर्वानुमान')}
                </h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate sm:whitespace-normal">
                {l(
                  'LightGBM + Theta + ETS blend delivering 3.41%–4.18% out-of-sample WAPE vs naive 6.05%–6.93% (31%–51% gain).',
                  'LightGBM + Theta + ETS मिश्रण जो 3.41%–4.18% आउट-ऑफ-सैंपल WAPE प्रदान करता है (नाइव 6.05%–6.93% की तुलना में 31%–51% सुधार)।'
                )}
              </p>
            </div>
          </Link>

          {/* Tile 3: Staged Supply Funnel */}
          <Link
            href="/methodology"
            className="p-4 rounded-2xl liquid-glass-card group flex items-start gap-3 hover:-translate-y-0.5 transition-all shadow-xs"
          >
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  {l('4-Stage Staged Supply Funnel', '4-चरणीय आपूर्ति फ़नल')}
                </h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate sm:whitespace-normal">
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
            className="p-4 rounded-2xl liquid-glass-card group flex items-start gap-3 hover:-translate-y-0.5 transition-all shadow-xs"
          >
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  {l('PuLP Simplex LP Solver', 'PuLP सिम्पलेक्स एलपी सॉल्वर')}
                </h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate sm:whitespace-normal">
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
