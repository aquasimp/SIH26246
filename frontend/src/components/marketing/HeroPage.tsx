'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { IndiaIntelligenceMap } from '@/components/maps/IndiaIntelligenceMap';
import { DISTRICTS, RECOMMENDATIONS, EXPORT_METADATA, STATES } from '@/lib/demoData';
import { OUT_OF_SAMPLE_BENCHMARKS } from '@/lib/benchmarkMetrics';
import { 
  ArrowRight, 
  Sliders, 
  FileText, 
  TrendingUp, 
  Layers, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Compass,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { getLocalizedEntityName } from '@/lib/i18n';

export function HeroPage() {
  const { language, selectedState, setSelectedState, setSelectedDistrict } = useApp();
  const isHi = language === 'hi';

  // Live top alert data
  const topAlert = {
    district: 'Gorakhpur',
    districtHi: 'गोरखपुर',
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    trade: 'Solar PV Installer',
    tradeHi: 'सोलर पीवी इंस्टॉलर',
    demand: 808,
    supply: 97,
    shortfall: 711,
    reallocSeats: 97,
    reallocReduction: '6.2%',
    donorScore: 52,
    donorTrade: 'Retail Sales Associate',
    comboCapex: '₹18.31L',
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. DepthWizard High-Tech Hero Cockpit Header */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        {/* Tactical Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0055a5]/10 dark:bg-cyan-950/40 border border-[#00c2cb]/35 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold tracking-wider mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c2cb] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00c2cb]"></span>
          </span>
          <span>{isHi ? 'स्मार्ट इंडिया हैकथॉन 2026 · PS 26246' : 'SMART INDIA HACKATHON 2026 · PS 26246 · MSDE'}</span>
        </div>

        {/* Space Grotesk / Plus Jakarta Sans Hero Headline */}
        <h1 className="hero-heading text-[var(--text)] tracking-tight font-display mb-2">
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

        {/* Subline */}
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium max-w-3xl leading-relaxed mb-5">
          {isHi
            ? 'कौशलयुवा श्रम-बाज़ार के आँकड़ों (e-Shram, NCS, PLFS) को ज़िला-स्तरीय 3M/6M/12M पूर्वानुमानों, पूर्व चेतावनियों और गणितीय रूप से सुरक्षित सीट-पुनर्आवंटन में बदलता है।'
            : 'KaushalYuva turns multi-source labour market data (e-Shram, NCS, PLFS) into granular district-level forecasts, early warnings, and mathematically guarded seat reallocations.'}
        </p>

        {/* Primary Action Buttons & Quick Jumps */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Link
            href="/overview"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] hover:from-[#004488] hover:to-[#00a2ab] text-white font-bold text-xs shadow-lg shadow-[#00c2cb]/20 hover:-translate-y-0.5 transition-all cursor-pointer font-sans"
          >
            <Compass className="w-4 h-4" />
            <span>{isHi ? 'पूर्ण डैशबोर्ड खोलें' : 'Open Intelligence Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/scenarios?preset=rec01"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass hover:bg-[var(--glass-strong)] border border-[var(--border)] hover:border-[#00c2cb]/50 text-[var(--text)] font-bold text-xs hover:-translate-y-0.5 transition-all cursor-pointer font-sans"
          >
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>{isHi ? 'गोरखपुर 97-सीट LP सिमुलेशन' : 'Simulate Gorakhpur Fix'}</span>
          </Link>

          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl glass hover:bg-[var(--glass-strong)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] font-bold text-xs transition-all cursor-pointer font-sans"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-500" />
            <span>{isHi ? 'पद्धति एवं परीक्षण' : 'Methodology & Backtest'}</span>
          </Link>
        </div>

        {/* Top Executive Alert HUD Card (Gorakhpur Solar PV) */}
        <div className="hud-card p-4 sm:p-5 rounded-2xl relative overflow-hidden border border-amber-500/30 bg-amber-500/5 dark:bg-[#0b1730]/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="eyebrow text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
                  {isHi ? 'शीर्ष कार्यकारी अलर्ट · गोरखपुर' : 'TOP EXECUTIVE ALERT · GORAKHPUR'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {isHi ? 'गंभीर कमी (स्कोर 94)' : 'Severe Shortage (Score 94)'}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-extrabold text-[var(--text)] font-display">
                {isHi ? (
                  <>
                    गोरखपुर में <span className="text-amber-600 dark:text-amber-400 font-mono font-extrabold">711</span> सोलर पीवी इंस्टॉलर की कमी है।
                  </>
                ) : (
                  <>
                    GORAKHPUR IS SHORT BY <span className="text-amber-600 dark:text-amber-400 font-mono font-extrabold">711</span> SOLAR INSTALLERS.
                  </>
                )}
              </h2>

              <p className="text-xs text-[var(--text-muted)] max-w-2xl font-medium">
                {isHi
                  ? '97 सीटें रिटेल सेल्स से स्थानांतरित करने से 6.2% कमी पूरी होती है (दाता स्कोर 52 सुरक्षित)। शेष 614 के लिए नई क्षमता आवश्यक है।'
                  : 'Transferring 97 seats from Retail Sales closes 6.2% deficit with zero donor risk (score 52). Remaining 614 requires capital expansion.'}
              </p>
            </div>

            {/* Tactical Numbers Ledger */}
            <div className="flex items-center flex-wrap gap-2.5 shrink-0">
              <div className="px-3 py-1.5 rounded-xl glass border border-[var(--border)] text-xs flex flex-col items-center min-w-[75px]">
                <span className="text-[9px] font-mono text-[var(--text-faint)] uppercase">
                  {isHi ? 'मांग' : 'DEMAND'}
                </span>
                <span className="font-mono font-extrabold text-[var(--text)] text-sm tabular-nums">
                  808
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-xl glass border border-[var(--border)] text-xs flex flex-col items-center min-w-[75px]">
                <span className="text-[9px] font-mono text-[var(--text-faint)] uppercase">
                  {isHi ? 'आपूर्ति' : 'SUPPLY'}
                </span>
                <span className="font-mono font-extrabold text-cyan-600 dark:text-[#00c2cb] text-sm tabular-nums">
                  97
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-xl glass border border-amber-500/35 bg-amber-500/10 text-xs flex flex-col items-center min-w-[75px]">
                <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 uppercase font-bold">
                  {isHi ? 'कमी' : 'DEFICIT'}
                </span>
                <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm tabular-nums">
                  711
                </span>
              </div>

              <Link
                href="/scenarios?preset=rec01"
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>{isHi ? 'सिमुलेशन' : 'Simulate'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DepthWizard KPI Stat Cards */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl hud-card space-y-1">
            <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-[#00c2cb] uppercase tracking-wider block">
              {isHi ? '// भौगोलिक कवरेज' : '// GEOGRAPHY COVERED'}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--text)] font-mono">
              16 <span className="text-xs font-normal text-[var(--text-muted)] font-sans">{isHi ? 'ज़िले' : 'Districts'} · 5 {isHi ? 'राज्य' : 'States'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl hud-card space-y-1">
            <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-[#00c2cb] uppercase tracking-wider block">
              {isHi ? '// व्यवसाय ट्रैक किए गए' : '// OCCUPATIONS TRACKED'}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--text)] font-mono">
              16 <span className="text-xs font-normal text-[var(--text-muted)] font-sans">{isHi ? 'सक्रिय NCO ट्रेड्स' : 'Active NCO Trades'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl hud-card space-y-1">
            <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-[#00c2cb] uppercase tracking-wider block">
              {isHi ? '// पूर्वानुमान क्षितिज' : '// FORECAST HORIZONS'}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--text)] font-mono">
              3M · 6M · 12M <span className="text-xs font-normal text-[var(--text-muted)] font-sans">{isHi ? 'मल्टी-मॉडल' : 'Multi-Model'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl hud-card space-y-1 border-[#00c2cb]/35">
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              {isHi ? '// आउट-ऑफ-सैंपल WAPE' : '// OUT-OF-SAMPLE WAPE'}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              3.41% - 3.71% <span className="text-xs font-normal text-[var(--text-muted)] font-sans">{isHi ? 'त्रुटि में 42.8% कमी' : '42.8% Gain'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Sticky State Filter Pill Bar */}
      <section className="sticky top-14 z-30 w-full glass-strong border-y border-[var(--border)] py-2 px-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase mr-1">
              {isHi ? 'राज्य फ़िल्टर:' : 'STATE:'}
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
              {isHi ? 'सभी 5 राज्य' : 'All 5 States'}
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

          {/* Quick jump shortcuts */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] shrink-0 font-mono">
            <span className="text-[10px] text-[var(--text-faint)] uppercase">
              {isHi ? 'त्वरित चयन:' : 'QUICK JUMP:'}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict('gorakhpur');
                setSelectedState('Uttar Pradesh');
              }}
              className="px-2 py-0.5 rounded-md glass hover:border-[#00c2cb] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              {isHi ? 'गोरखपुर' : 'Gorakhpur'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict('pune');
                setSelectedState('Maharashtra');
              }}
              className="px-2 py-0.5 rounded-md glass hover:border-[#00c2cb] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              {isHi ? 'पुणे' : 'Pune'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict('coimbatore');
                setSelectedState('Tamil Nadu');
              }}
              className="px-2 py-0.5 rounded-md glass hover:border-[#00c2cb] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              {isHi ? 'कोयंबटूर' : 'Coimbatore'}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Tactical Map & Selected District Panel */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <IndiaIntelligenceMap />
      </section>

      {/* 4. Top 3 Ranked Interventions */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
          <div>
            <span className="eyebrow text-cyan-600 dark:text-[#00c2cb]">
              <span className="eyebrow-bullet" />
              {isHi ? 'शीर्ष 3 अनुशंसित हस्तक्षेप' : 'TOP 3 RANKED INTERVENTIONS'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] tracking-tight font-display mt-0.5">
              {isHi ? 'डेटा-संचालित नीति समाधान' : 'Evidence-Backed Policy Interventions'}
            </h2>
          </div>
          <Link
            href="/recommendations"
            className="text-xs font-bold text-[#0055a5] dark:text-[#00c2cb] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{isHi ? 'सभी हस्तक्षेप देखें' : 'View all interventions'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Recommendation 1: Gorakhpur Solar PV Installer */}
          <div className="p-5 rounded-3xl hud-card flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-extrabold text-cyan-600 dark:text-[#00c2cb]">
                  REC-01
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25">
                  {isHi ? 'LP अनुकूलन · आधिकारिक SIH' : 'LP Optimization · SIH Dataset'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[var(--text)] font-display group-hover:text-[#00c2cb] transition-colors">
                  {isHi ? 'गोरखपुर सोलर पीवी सीट स्थानांतरण' : 'Gorakhpur Solar PV Seat Transfer'}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {isHi ? 'गोरखपुर, उत्तर प्रदेश' : 'Gorakhpur, Uttar Pradesh'}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                {isHi
                  ? 'रिटेल सेल्स (97 सीटें) से सोलर पीवी इंस्टॉलर में स्थानांतरण। दाता स्कोर 52 (संतुलित), कमी में 6.2% सुधार।'
                  : 'Reallocate 97 seats from Retail Sales Associate to Solar PV Installer. Donor score post-transfer: 52 (Balanced). 6.2% deficit closed.'}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl glass border border-[var(--border)] text-center text-xs font-mono">
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                    {isHi ? 'स्थानांतरण' : 'Shift'}
                  </span>
                  <span className="font-extrabold text-cyan-600 dark:text-[#00c2cb]">{isHi ? '97 सीटें' : '97 seats'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                    {isHi ? 'कमी पूर्ण' : 'Deficit Closed'}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">6.2%</span>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                    {isHi ? 'कॉम्बो बजट' : 'Combo Budget'}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">₹18.31L</span>
                </div>
              </div>
            </div>

            <Link
              href="/scenarios?preset=rec01"
              className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#00c2cb]/20 font-sans"
            >
              <span>{isHi ? 'LP सिमुलेशन खोलें' : 'Simulate in Scenario Studio'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommendation 2: Pune EV Service Technician */}
          <div className="p-5 rounded-3xl hud-card flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-extrabold text-cyan-600 dark:text-[#00c2cb]">
                  REC-02
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  {isHi ? 'मॉडल आउटपुट · SIH डेटासेट' : 'Model Output · SIH Dataset'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[var(--text)] font-display group-hover:text-[#00c2cb] transition-colors">
                  {isHi ? 'पुणे ईवी सर्विस तकनीशियन क्लस्टर' : 'Pune EV Service Technician Cluster'}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {isHi ? 'पुणे, महाराष्ट्र (चाकण एवं भोसरी)' : 'Pune, Maharashtra (Chakan & Bhosari)'}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                {isHi
                  ? 'चाकण-भोसरी औद्योगिक क्षेत्र में ऑटोमोबाइल फिटर से 400 नई ईवी सर्विस सीटें स्थापित करने का प्रस्ताव।'
                  : 'Proposed new EV training cluster in Chakan-Bhosari corridor adding 400 new seats, closing projected deficit by 54%.'}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl glass border border-[var(--border)] text-center text-xs font-mono">
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                    {isHi ? 'नई क्षमता' : 'New Seats'}
                  </span>
                  <span className="font-extrabold text-cyan-600 dark:text-[#00c2cb]">+400</span>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                    {isHi ? 'कमी पूर्ण' : 'Deficit Closed'}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">54.0%</span>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                    {isHi ? 'अनुमानित व्यय' : 'Capex'}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">₹26.0L</span>
                </div>
              </div>
            </div>

            <Link
              href="/recommendations"
              className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl glass hover:bg-[var(--glass-strong)] border border-[var(--border)] hover:border-[#00c2cb]/50 text-[var(--text)] text-xs font-bold transition-all cursor-pointer font-sans"
            >
              <span>{isHi ? 'सिफारिश विवरण देखें' : 'View Recommendation Details'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommendation 3: Coimbatore CNC Machine Operator */}
          <div className="p-5 rounded-3xl hud-card flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-extrabold text-cyan-600 dark:text-[#00c2cb]">
                  REC-03
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  {isHi ? 'मॉडल आउटपुट · SIH डेटासेट' : 'Model Output · SIH Dataset'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[var(--text)] font-display group-hover:text-[#00c2cb] transition-colors">
                  {isHi ? 'कोयंबटूर सीएनसी ऑपरेटर क्लस्टर' : 'Coimbatore CNC Machine Operator Cluster'}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {isHi ? 'कोयंबटूर, तमिलनाडु' : 'Coimbatore, Tamil Nadu'}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                {isHi
                  ? 'सटीक इंजीनियरिंग और पंप निर्माण क्लस्टर में 350 नई सीएनसी ऑपरेटर सीटें, अनुमानित कमी में 48% की कमी।'
                  : 'Precision engineering and pump manufacturing corridor adding 350 new CNC seats, closing projected deficit by 48%.'}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl glass border border-[var(--border)] text-center text-xs font-mono">
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                    {isHi ? 'नई क्षमता' : 'New Seats'}
                  </span>
                  <span className="font-extrabold text-cyan-600 dark:text-[#00c2cb]">+350</span>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                    {isHi ? 'कमी पूर्ण' : 'Deficit Closed'}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">48.0%</span>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-faint)] block uppercase">
                    {isHi ? 'अनुमानित व्यय' : 'Capex'}
                  </span>
                  <span className="font-extrabold text-[var(--text)]">₹22.75L</span>
                </div>
              </div>
            </div>

            <Link
              href="/recommendations"
              className="inline-flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl glass hover:bg-[var(--glass-strong)] border border-[var(--border)] hover:border-[#00c2cb]/50 text-[var(--text)] text-xs font-bold transition-all cursor-pointer font-sans"
            >
              <span>{isHi ? 'सिफारिश विवरण देखें' : 'View Recommendation Details'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PS 26246 Architecture & Compliance Grid */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
          <div>
            <span className="eyebrow text-cyan-600 dark:text-[#00c2cb]">
              <span className="eyebrow-bullet" />
              {isHi ? 'स्मार्ट इंडिया हैकथॉन · PS 26246 अनुपालन' : 'SMART INDIA HACKATHON · PS 26246 COMPLIANCE'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] tracking-tight font-display mt-0.5">
              {isHi ? 'एमएसडीई समस्या विवरण २६२४६: पूर्ण कार्यान्वयन ढांचा' : 'MSDE Problem Statement 26246: Full Implementation Matrix'}
            </h2>
          </div>
          <Link
            href="/methodology"
            className="text-xs font-bold text-[#0055a5] dark:text-[#00c2cb] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{isHi ? 'संपूर्ण पद्धति एवं गणितीय प्रमाण' : 'View Methodology & Math Proof'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/occupations"
            className="p-4 rounded-2xl hud-card group block space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25">
                {isHi ? 'मांग सामान्यीकरण' : 'Demand Normalization'}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text)] font-display group-hover:text-[#00c2cb] transition-colors">
              {isHi ? 'NCO/NSQF मांग सिग्नल' : 'NCO/NSQF Demand Signals'}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
              {isHi
                ? 'जॉब पोर्टल्स, ई-श्रम, और NCS लिस्टिंग को NCO-2015 8-अंकीय कोड में 3-स्तरीय कैस्केड द्वारा सामान्यीकृत किया गया।'
                : '3-tier fuzzy cascade maps unstructured jobs, e-Shram, and NCS listings to official NCO-2015 8-digit codes.'}
            </p>
          </Link>

          <Link
            href="/forecasts"
            className="p-4 rounded-2xl hud-card group block space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                {isHi ? 'समय-श्रृंखला एमएल' : 'Time-Series ML'}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text)] group-hover:text-[#00c2cb] transition-colors font-display">
              {isHi ? '3M · 6M · 12M पूर्वानुमान' : '3M · 6M · 12M Forecasts'}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
              {isHi
                ? 'शून्य-रिसाव (t-1) LightGBM व त्रि-मॉडल एन्सेम्बल, 3.41% - 3.71% WAPE सटीकता के साथ।'
                : 'Zero-leakage lagged LightGBM ensemble delivering 3.41%–3.71% out-of-sample WAPE across rolling origins.'}
            </p>
          </Link>

          <Link
            href="/scenarios"
            className="p-4 rounded-2xl hud-card group block space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25">
                {isHi ? 'LP अनुकूलन' : 'LP Optimization'}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text)] group-hover:text-[#00c2cb] transition-colors font-display">
              {isHi ? 'सीट पुनर्आवंटन सॉल्वर' : 'PuLP Capacity Solver'}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
              {isHi
                ? 'संतृप्त ट्रेडों से कमी वाले ट्रेडों में सीट स्थानांतरण, दाता गैर-रिक्तीकरण सुरक्षा (δ ≤ 0.05) के साथ।'
                : 'Linear programming solver shifts surplus capacity to deficit trades under strict donor non-depletion rules.'}
            </p>
          </Link>

          <Link
            href="/api"
            className="p-4 rounded-2xl hud-card group block space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                {isHi ? 'प्रशासनिक निर्यात' : 'Scheme API & Export'}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-sm font-extrabold text-[var(--text)] group-hover:text-[#00c2cb] transition-colors font-display">
              {isHi ? '13 REST Endpoints & CSV' : '13 REST Endpoints & CSV'}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
              {isHi
                ? 'MSDE व SSC योजना योजनाकारों के लिए लाइव ओपनएपीआई/स्वैगर एंडपॉइंट और 1-क्लिक नीति संक्षिप्त डाउनलोड।'
                : 'Live OpenAPI/Swagger backend and one-click structured CSV/JSON downloads for target-setting workflows.'}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
