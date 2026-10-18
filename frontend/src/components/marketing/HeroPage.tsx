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
  MapPin,
  FileText,
  Database,
  Code2
} from 'lucide-react';
import { Provenance } from '@/components/common/Provenance';
import GlassFolder from '@/components/ui/glass-folder-cards';
import { OUT_OF_SAMPLE_BENCHMARKS } from '@/lib/benchmarkMetrics';

export function HeroPage() {
  const { language, l, t } = useApp();

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
          </svg>
        </div>

        <div className="hero-inner-content">
          {/* Top Floating Badge Pill */}
          <div className="hero-pill-badge">
            <span className="eyebrow-bullet" />
            <span className="badge-text">
              {l('MSDE / SIDH · NATIONAL LABOUR INTELLIGENCE & FORECASTING ENGINE', 'MSDE / SIDH · राष्ट्रीय श्रम बाजार बुद्धिमत्ता एवं पूर्वानुमान इंजन')}
            </span>
          </div>

          {/* High-Impact Bold Hero Headline (Institutional Civic Voice) */}
          <h1 className="hero-bold-title">
            {language !== 'en' ? (
              <>
                कौशल अंतराल का पूर्वानुमान <span className="hero-title-highlight">एवं प्रशिक्षण क्षमता का रूपांतरण</span>
              </>
            ) : (
              <>
                Forecast the skill gap <span className="hero-title-highlight">and transform training capacity</span> <br className="hero-title-br" /> for the nation&apos;s skills ecosystem
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
              <span>WAPE 3.41%</span>
            </div>
          </div>

          {/* Judge-First Product Explanation (30-second clarity on what, for whom, and how) */}
          <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl text-center leading-relaxed mb-6 font-normal px-4" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            {l(
              'A district-level skill intelligence engine for MSDE that forecasts labour demand, computes effective training supply through a staged attrition funnel, and uses a constrained LP solver to propose ITI seat reallocations — demonstrated across 16 districts in 5 states.',
              'MSDE के लिए एक जिला-स्तरीय कौशल बुद्धिमत्ता इंजन जो श्रम मांग का पूर्वानुमान लगाता है, एक चरणबद्ध फ़नल के माध्यम से प्रभावी प्रशिक्षण आपूर्ति की गणना करता है, और ITI सीट पुनर्आवंटन का प्रस्ताव करने के लिए एक बाधित LP सॉल्वर का उपयोग करता है — 5 राज्यों के 16 जिलों पर प्रदर्शित।'
            )}
          </p>

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
              <Link href="#gorakhpur-case" className="dock-pill-chip active">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{l('Gorakhpur Case Study', 'गोरखपुर केस अध्ययन')}</span>
              </Link>
              <Link href="#forecast-evidence" className="dock-pill-chip">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>{l('Forecast Accuracy (3.41%)', 'पूर्वानुमान सटीकता (3.41%)')}</span>
              </Link>
              <Link href="#technical-pipeline" className="dock-pill-chip">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>{l('4-Stage Pipeline', '4-चरणीय पाइपलाइन')}</span>
              </Link>
              <Link href="#tactical-map" className="dock-pill-chip">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>{l('National Imbalance Map', 'राष्ट्रीय असंतुलन मानचित्र')}</span>
              </Link>
              <Link href="/methodology" className="dock-pill-chip">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>{l('Math Proof & WAPE', 'गणितीय प्रमाण एवं WAPE')}</span>
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

      {/* 3. Exemplar Case Study: Gorakhpur, UP — The Complete "Detect → Forecast → Decide" Story */}
      <section id="gorakhpur-case" className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 py-3 scroll-mt-20">
        <div className="liquid-glass-card hud-corner-card p-6 sm:p-7 border border-amber-500/30 rounded-2xl shadow-sm">
          {/* Header Bar: Status + Provenance + Scope */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-4 mb-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]" />
                </span>
                <span>{l('Exemplar Policy Case Study · Gorakhpur, UP', 'उदाहरणात्मक नीति केस अध्ययन · गोरखपुर, उ.प्र.')}</span>
              </span>
              <Provenance source="SIH dummy dataset" note="RUN-SIH-001" compact={false} />
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                {l('Deficit Score: 94 / 100', 'घाटा स्कोर: 94 / 100')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">
                {l('Shortage Probability: 88%', 'कमी की संभावना: 88%')}
              </span>
            </div>
          </div>

          {/* Two-Column Core Narrative: Detect & Forecast vs Solver Decision */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column (Cols 1-7): Problem Detection & Staged Supply Reality */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    {l('STAGE 1 & 2: DEFICIT DETECTION & LABOUR DEMAND FORECAST', 'चरण 1 और 2: घाटा पहचान एवं श्रम मांग पूर्वानुमान')}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {l('711-Seat Severe Deficit in Solar PV Installers', 'सोलर पीवी इंस्टॉलर में 711 सीटों की गंभीर कमी')}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {l(
                    'The ensemble forecaster identifies an impending demand of 808 workers against a certified effective supply of only 97. Reallocating 97 surplus seats from Retail Sales Associate at ₹6.31L retrofit CapEx closes 6.2% of the deficit while saving ₹6.3L in public funds vs. greenfield construction.',
                    'पहनावा पूर्वानुमानकर्ता केवल 97 प्रमाणित प्रभावी आपूर्ति के मुकाबले 808 श्रमिकों की आगामी मांग की पहचान करता है। ₹6.31 लाख रेट्रोफ़िट पूंजीगत व्यय पर रिटेल सेल्स एसोसिएट से 97 अधिशेष सीटों को पुनर्आवंटित करने से घाटे का 6.2% पूरा होता है और नई निर्माण लागत की तुलना में ₹6.3 लाख की बचत होती है।'
                  )}
                </p>
              </div>

              {/* Demand-vs-Supply Visual Bar with Funnel Clarification */}
              <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 space-y-2.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                    <span className="w-2.5 h-2.5 rounded-xs bg-slate-700 dark:bg-slate-300 inline-block" />
                    {l('Effective Supply: 97', 'प्रभावी आपूर्ति: 97')}
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold font-mono">
                    {l('Deficit Gap: 711 (88%)', 'कमी का अंतर: 711 (88%)')}
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold font-mono">
                    {l('12M Demand: 808', '12 माह मांग: 808')}
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex relative">
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

                <div className="flex flex-col sm:flex-row justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-1 pt-0.5">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {l('12.0% Current Staged Coverage', '12.0% वर्तमान चरणबद्ध कवरेज')}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {l('Effective supply ≠ nominal seats (accounts for dropout & migration)', 'प्रभावी आपूर्ति ≠ नाममात्र सीटें (ड्रॉपआउट और प्रवासन घटाकर)')}
                  </span>
                </div>
              </div>

              {/* Realism Note on Greenfield Need */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0 font-mono">
                  {l('NOTE:', 'टिप्पणी:')}
                </span>
                <span>
                  {l(
                    'Reallocation provides an immediate low-cost bridge, but remaining ~667 candidate shortfall requires capital expansion. The system recommends both targeted reallocation and greenfield capacity.',
                    'पुनर्आवंटन एक तत्काल कम लागत वाला समाधान प्रदान करता है, किंतु शेष ~667 उम्मीदवारों की कमी के लिए पूंजीगत विस्तार आवश्यक है। प्रणाली दोनों का संतुलित प्रस्ताव करती है।'
                  )}
                </span>
              </div>
            </div>

            {/* Right Column (Cols 8-12): PuLP Solver Recommended Intervention */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {l('STAGE 4: PU-LP SOLVER DECISION', 'चरण 4: PU-LP सॉल्वर निर्णय')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                    REC-01 · {l('Optimized', 'अनुकूलित')}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {l('Transfer 97 Seats: Retail Sales → Solar PV', '97 सीटों का स्थानांतरण: रिटेल सेल्स → सोलर पीवी')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {l('Gorakhpur ITI Complex · Retrofit Feasibility Verified', 'गोरखपुर आईटीआई परिसर · रेट्रोफ़िट व्यवहार्यता सत्यापित')}
                  </p>
                </div>

                {/* Key Decision Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block font-mono">
                      {l('Reallocation Volume', 'पुनर्आवंटन मात्रा')}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                      97 {l('Seats', 'सीटें')}
                    </span>
                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 block font-medium">
                      +6.2% {l('Deficit Closed', 'घाटा कम')}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block font-mono">
                      {l('Retrofit CapEx', 'रेट्रोफ़िट पूंजीगत व्यय')}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                      ₹6.31L
                    </span>
                    <span className="text-[10.5px] text-sky-600 dark:text-sky-400 block font-medium">
                      ₹6.3L {l('Saved vs New', 'बचत')}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 col-span-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block font-mono">
                          {l('Donor Trade Protection', 'दाता व्यवसाय सुरक्षा')}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {l('Retail Sales remains Balanced (Score 52)', 'रिटेल सेल्स संतुलित रहता है (स्कोर 52)')}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        δ ≤ 0.05
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button & Link to Studio */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/scenarios?preset=rec01"
                  className="btn-liquid-primary inline-flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer group shadow-xs"
                >
                  <span>{l('Simulate Gorakhpur Transfer in Studio', 'स्टूडियो में गोरखपुर स्थानांतरण अनुकरण करें')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-sky-600 dark:text-sky-400" />
                </Link>

                <div className="text-center">
                  <Link
                    href="/recommendations"
                    className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>{l('Showing 1 of 16 district interventions · View all recommendations', '16 जिला हस्तक्षेपों में से 1 प्रदर्शित · सभी सिफारिशें देखें')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Forecast Evidence: Out-Of-Sample Multi-Horizon Benchmark Table */}
      <section id="forecast-evidence" className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 py-5 scroll-mt-20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block font-mono">
              {l('OUT-OF-SAMPLE FORECAST ACCURACY (§4.1)', 'आउट-ऑफ-सैंपल पूर्वानुमान सटीकता (§4.1)')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {language !== 'en' ? (
                'बहु-क्षितिज पहनावा बेंचमार्क बनाम मौसमी नाइव आधार'
              ) : (
                <>
                  Multi-Horizon Ensemble Benchmark vs. <span className="title-serif-italic">Seasonal Naive Baseline</span>
                </>
              )}
            </h2>
          </div>
          <Link
            href="/forecasts"
            className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:underline inline-flex items-center gap-1 self-start sm:self-auto font-mono"
          >
            <span>{l('Interactive Forecast Inspector', 'इंटरैक्टिव पूर्वानुमान अन्वेषक')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Liquid Glass Table Card */}
        <div className="liquid-glass-card hud-corner-card p-5 sm:p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[10.5px] uppercase text-slate-400 dark:text-slate-500">
                  <th className="py-2.5 px-3">{l('Forecast Horizon', 'क्षितिज')}</th>
                  <th className="py-2.5 px-3">{l('Ensemble Model (Production)', 'पहनावा मॉडल')}</th>
                  <th className="py-2.5 px-3 text-right">{l('Ensemble WAPE', 'पहनावा WAPE')}</th>
                  <th className="py-2.5 px-3 text-right">{l('Seasonal Naive', 'नाइव WAPE')}</th>
                  <th className="py-2.5 px-3 text-right">{l('Gain vs Naive', 'सुधार')}</th>
                  <th className="py-2.5 px-3 text-right">{l('95% Coverage', '95% कवरेज')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {/* 3M Horizon */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                    3 {l('Months', 'माह')} (T+1 .. T+3)
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    LightGBM + Theta + ETS blend
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {OUT_OF_SAMPLE_BENCHMARKS['3M'].ensembleWape.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500">
                    {OUT_OF_SAMPLE_BENCHMARKS['3M'].naiveWape.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    -35.7%
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300">
                    {OUT_OF_SAMPLE_BENCHMARKS['3M'].coverage95.toFixed(1)}%
                  </td>
                </tr>

                {/* 6M Horizon */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                    6 {l('Months', 'माह')} (T+1 .. T+6)
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    LightGBM + Theta + ETS blend
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {OUT_OF_SAMPLE_BENCHMARKS['6M'].ensembleWape.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500">
                    {OUT_OF_SAMPLE_BENCHMARKS['6M'].naiveWape.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    -30.9%
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700 dark:text-slate-300">
                    {OUT_OF_SAMPLE_BENCHMARKS['6M'].coverage95.toFixed(1)}%
                  </td>
                </tr>

                {/* 12M Horizon (Anchor Benchmark) */}
                <tr className="bg-emerald-500/5 dark:bg-emerald-500/10 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 transition-colors font-bold">
                  <td className="py-3 px-3 text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>12 {l('Months', 'माह')} (T+1 .. T+12)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      {l('ANNUAL ANCHOR', 'वार्षिक मुख्य')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    Tri-Model Ensemble Blend
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 text-sm">
                    {OUT_OF_SAMPLE_BENCHMARKS['12M'].ensembleWape.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500">
                    {OUT_OF_SAMPLE_BENCHMARKS['12M'].naiveWape.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 text-sm">
                    -50.8%
                  </td>
                  <td className="py-3 px-3 text-right text-slate-900 dark:text-slate-100">
                    {OUT_OF_SAMPLE_BENCHMARKS['12M'].coverage95.toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Caveat & Evaluation Provenance */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
            <p>
              {l(
                'Evaluation Rigor: Tested on Origins 4–6 without temporal leakage (768 out-of-sample samples per horizon). Sourced from SIH Problem Statement 26246 dummy dataset; algorithmic verification only, not validated against live labour-market observations.',
                'मूल्यांकन कठोरता: बिना किसी समय संबंधी रिसाव के ओरिजिन 4-6 पर परीक्षण (प्रति क्षितिज 768 आउट-ऑफ-सैंपल नमूने)। SIH समस्या विवरण 26246 डमी डेटासेट से स्रोत; केवल एल्गोरिदमिक सत्यापन, लाइव बाजार अवलोकनों के विरुद्ध मान्य नहीं।'
              )}
            </p>
            <span className="shrink-0 font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              N=768/horizon
            </span>
          </div>
        </div>
      </section>

      {/* 5. Technical Pipeline: The Four-Stage End-to-End Architecture (Moved UP to anchor narrative) */}
      <section id="technical-pipeline" className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 py-5 scroll-mt-20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-mono">
              {l('TECHNICAL PIPELINE · PS 26246 ARCHITECTURE', 'तकनीकी पाइपलाइन · PS 26246 वास्तुकला')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
              {language !== 'en' ? (
                'कार्यान्वयन ढांचा: चार-चरणीय संपूर्ण पाइपलाइन'
              ) : (
                <>
                  How It Works: <span className="title-serif-italic">The Four-Stage End-to-End Pipeline</span>
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
                <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">
                  {l('Stage 1', 'चरण 1')}
                </span>
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
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  {l('Stage 2', 'चरण 2')}
                </span>
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
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                  {l('Stage 3', 'चरण 3')}
                </span>
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
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  {l('Stage 4', 'चरण 4')}
                </span>
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

      {/* 6. Tactical Map & Selected District Panel (Moved below pipeline for logical flow) */}
      <section id="tactical-map" className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 py-5 scroll-mt-16 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {l('GEOSPATIAL INTELLIGENCE', 'भू-स्थानिक बुद्धिमत्ता')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {language !== 'en' ? (
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

      {/* 7. Evaluator Fast Deep-Links Strip */}
      <section className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 py-4">
        <div className="liquid-glass-card p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center md:text-left">
            <span className="text-[10.5px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              {l('DIRECT EVALUATION ACCESS', 'सीधा मूल्यांकनकर्ता प्रवेश')}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {l('Jump Directly to System Views', 'सिस्टम के प्रमुख पृष्ठों पर सीधे जाएं')}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            <Link href="/overview" className="dock-pill-chip">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>{l('Overview Dashboard', 'डैशबोर्ड')}</span>
            </Link>
            <Link href="/districts/gorakhpur" className="dock-pill-chip">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{l('Gorakhpur Detail', 'गोरखपुर विवरण')}</span>
            </Link>
            <Link href="/forecasts" className="dock-pill-chip">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{l('Forecast Models', 'पूर्वानुमान मॉडल')}</span>
            </Link>
            <Link href="/gaps" className="dock-pill-chip">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>{l('16 Trade Gaps', '16 व्यवसाय अंतराल')}</span>
            </Link>
            <Link href="/scenarios?preset=rec01" className="dock-pill-chip">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>{l('Scenario Studio', 'परिदृश्य स्टूडियो')}</span>
            </Link>
            <Link href="/recommendations" className="dock-pill-chip">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>{l('Recommendations', 'सिफारिशें')}</span>
            </Link>
            <Link href="/methodology" className="dock-pill-chip">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>{l('Methodology', 'पद्धति')}</span>
            </Link>
            <Link href="/data-health" className="dock-pill-chip">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>{l('Data Health', 'डेटा स्वास्थ्य')}</span>
            </Link>
            <Link href="/api" className="dock-pill-chip">
              <Code2 className="w-3.5 h-3.5 text-rose-400" />
              <span>{l('OpenAPI Spec', 'एपीआई')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Documentation & Specifications Pack Folder */}
      <section className="w-full max-w-[1536px] px-4 sm:px-8 lg:px-10 pb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-xs">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-semibold text-[var(--brand)] uppercase tracking-wider block font-mono">
              {l('GOVERNANCE & SPECIFICATIONS PACK', 'शासन एवं विनिर्देश पैक')}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {t.docPack?.title || l('Documentation & Specifications', 'दस्तावेज़ीकरण एवं विनिर्देश')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {l(
                'Direct access to official mathematical formulations, OpenAPI endpoint specifications, and multi-source pipeline health provenance.',
                'आधिकारिक गणितीय सूत्रों, OpenAPI एंडपॉइंट विनिर्देशों और बहु-स्रोत पाइपलाइन स्वास्थ्य उद्गम तक सीधी पहुंच।'
              )}
            </p>
          </div>

          <div className="shrink-0 flex justify-center">
            <GlassFolder
              label={t.docPack?.title || "Documentation Pack"}
              meta={l('3 verified assets', '3 सत्यापित संपत्तियां')}
              art="aurora"
              labels={t.glassFolder}
              files={[
                {
                  name: t.docPack?.methodology || "Mathematical Methodology",
                  meta: t.docPack?.methodologyMeta || "WAPE formulation & LP constraints",
                  href: "/methodology",
                },
                {
                  name: t.docPack?.apiDocs || "API & Exports Registry",
                  meta: t.docPack?.apiDocsMeta || "OpenAPI interactive endpoints",
                  href: "/api",
                },
                {
                  name: t.docPack?.dataHealth || "Data Pipeline & Provenance",
                  meta: t.docPack?.dataHealthMeta || "Multi-source SLA & drift metrics",
                  href: "/data-health",
                },
              ]}
              action="none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
