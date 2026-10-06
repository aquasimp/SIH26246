'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { IndiaIntelligenceMap } from '@/components/maps/IndiaIntelligenceMap';
import { DISTRICTS, RECOMMENDATIONS, EXPORT_METADATA, STATES } from '@/lib/demoData';
import { 
  ArrowRight, 
  Sliders, 
  FileText, 
  TrendingUp, 
  Layers, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
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
      {/* 1. Hero Section (§D.2) — First 4 items above the fold at 1440x900 */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        {/* Eyebrow with small square bullet */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="eyebrow">
            <span className="eyebrow-bullet" />
            {isHi ? 'शीर्ष कार्यकारी अलर्ट · गोरखपुर' : 'TOP EXECUTIVE ALERT · GORAKHPUR'}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
            {isHi ? 'गंभीर कमी' : 'Severe Shortage'}
          </span>
        </div>

        {/* H1 built from live top alert via i18n with signature number-forward device */}
        <h1 className="hero-heading hero-h1-animate text-[var(--text)] tracking-tight">
          {isHi ? (
            <>
              गोरखपुर में <span className="number-forward">711</span> सोलर इंस्टॉलर की कमी है।
            </>
          ) : (
            <>
              GORAKHPUR IS SHORT BY <span className="number-forward">711</span> SOLAR INSTALLERS.
            </>
          )}
        </h1>

        {/* Subline */}
        <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium mt-1.5 mb-3 max-w-3xl leading-snug">
          {isHi
            ? '97 सीटें स्थानांतरित करने से 6.2% अंतर पूरा होता है। शेष के लिए नई क्षमता चाहिए।'
            : 'Moving 97 seats closes 6.2%. The rest needs new capacity.'}
        </p>

        {/* CTAs and 3 Stat Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
          <div className="flex items-center gap-2.5">
            <Link
              href="/scenarios?preset=rec01"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white font-bold text-xs shadow-md shadow-[var(--brand)]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isHi ? 'समाधान का सिमुलेशन करें' : 'Simulate fix'}</span>
            </Link>

            <Link
              href="/overview?district=gorakhpur"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass hover:bg-[var(--glass-strong)] border border-[var(--border)] text-[var(--text)] font-bold text-xs hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--brand)]" />
              <span>{isHi ? 'साक्ष्य देखें' : 'View evidence'}</span>
            </Link>
          </div>

          {/* 3 Stat Chips directly from API / Engine */}
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-xl glass border border-[var(--border)] text-xs flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase">
                {isHi ? 'मांग' : 'Demand'}:
              </span>
              <span className="font-mono font-extrabold text-[var(--text)] tabular-nums">
                808
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-xl glass border border-[var(--border)] text-xs flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase">
                {isHi ? 'आपूर्ति' : 'Supply'}:
              </span>
              <span className="font-mono font-extrabold text-[var(--brand-secondary)] tabular-nums">
                97
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-xl glass border border-[var(--shortage)]/30 bg-[var(--shortage-bg)] text-xs flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-[var(--shortage)] uppercase font-bold">
                {isHi ? 'कमी' : 'Deficit'}:
              </span>
              <span className="font-mono font-extrabold text-[var(--shortage)] tabular-nums">
                711
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KPI Strip (§D.3) — Exactly 4 cards max */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl glass border border-[var(--border)] space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {isHi ? 'भौगोलिक कवरेज' : 'GEOGRAPHY COVERED'}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--text)] kpi-numeral">
              16 <span className="text-xs font-normal text-[var(--text-muted)] font-sans">{isHi ? 'ज़िले' : 'Districts'} · 5 {isHi ? 'राज्य' : 'States'}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl glass border border-[var(--border)] space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {isHi ? 'व्यवसाय ट्रैक किए गए' : 'OCCUPATIONS TRACKED'}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--text)] kpi-numeral">
              16 <span className="text-xs font-normal text-[var(--text-muted)] font-sans">{isHi ? 'सक्रिय NCO ट्रेड्स' : 'Active NCO Trades'}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl glass border border-[var(--border)] space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {isHi ? 'पूर्वानुमान क्षितिज' : 'FORECAST HORIZONS'}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--text)] kpi-numeral">
              3M · 6M · 12M <span className="text-xs font-normal text-[var(--text-muted)] font-sans">{isHi ? 'मल्टी-मॉडल' : 'Multi-Model'}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl glass border border-[var(--border)] space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-[var(--brand)] uppercase tracking-wider block">
              {isHi ? 'आउट-ऑफ-सैंपल WAPE' : 'OUT-OF-SAMPLE WAPE'}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--brand)] kpi-numeral">
              11.8% <span className="text-xs font-normal text-[var(--text-muted)] font-sans">{isHi ? 'सत्यापित त्रुटि दर' : 'Validated Error'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Sticky State Filter Pill Bar */}
      <section className="sticky top-14 z-30 w-full glass-strong border-y border-[var(--border)] py-1.5 px-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono font-bold text-[var(--text-faint)] uppercase mr-1">
              {isHi ? 'राज्य फ़िल्टर:' : 'STATE:'}
            </span>
            <button
              type="button"
              onClick={() => setSelectedState('All')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedState === 'All'
                  ? 'bg-[var(--brand)] text-white shadow-xs'
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
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedState === s
                    ? 'bg-[var(--brand)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
                }`}
              >
                {isHi ? getLocalizedEntityName('states', s, 'hi') : s}
              </button>
            ))}
          </div>

          {/* Quick jump shortcuts */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] shrink-0">
            <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase">
              {isHi ? 'त्वरित चयन:' : 'QUICK JUMP:'}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict('gorakhpur');
                setSelectedState('Uttar Pradesh');
              }}
              className="px-2 py-0.5 rounded-md glass hover:border-[var(--brand)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              {isHi ? 'गोरखपुर' : 'Gorakhpur'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict('pune');
                setSelectedState('Maharashtra');
              }}
              className="px-2 py-0.5 rounded-md glass hover:border-[var(--brand)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              {isHi ? 'पुणे' : 'Pune'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict('coimbatore');
                setSelectedState('Tamil Nadu');
              }}
              className="px-2 py-0.5 rounded-md glass hover:border-[var(--brand)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              {isHi ? 'कोयंबटूर' : 'Coimbatore'}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Map (8 cols) + Selected District Panel (4 cols) (§D.4) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <IndiaIntelligenceMap />
      </section>

      {/* 4. Top 3 Ranked Interventions (§D.5) — Uniform cards with derivation chips */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
          <div>
            <span className="eyebrow">
              <span className="eyebrow-bullet" />
              {isHi ? 'शीर्ष 3 अनुशंसित हस्तक्षेप' : 'TOP 3 RANKED INTERVENTIONS'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text)] tracking-tight mt-0.5">
              {isHi ? 'डेटा-संचालित नीति समाधान' : 'Evidence-Backed Policy Interventions'}
            </h2>
          </div>
          <Link
            href="/recommendations"
            className="text-xs font-bold text-[var(--brand)] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{isHi ? 'सभी हस्तक्षेप देखें' : 'View all interventions'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Recommendation 1: Gorakhpur Solar PV Installer */}
          <div className="p-5 rounded-3xl glass-strong border border-[var(--border)] shadow-md flex flex-col justify-between space-y-4 group hover:border-[var(--brand)]/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-extrabold text-[var(--brand)]">
                  REC-01
                </span>
                {/* Dataset & derivation chip */}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25">
                  {isHi ? 'LP अनुकूलन · SIH डमी डेटासेट' : 'LP Optimization · SIH dummy dataset'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                  {isHi ? 'गोरखपुर सोलर पीवी सीट स्थानांतरण' : 'Gorakhpur Solar PV Seat Transfer'}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {isHi ? 'गोरखपुर, उत्तर प्रदेश' : 'Gorakhpur, Uttar Pradesh'}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
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
                  <span className="font-extrabold text-[var(--brand)]">{isHi ? '97 सीटें' : '97 seats'}</span>
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
              className="inline-flex items-center justify-between w-full py-2 px-3 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>{isHi ? 'LP सिमुलेशन खोलें' : 'Simulate in Scenario Studio'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommendation 2: Pune EV Service Technician */}
          <div className="p-5 rounded-3xl glass-strong border border-[var(--border)] shadow-md flex flex-col justify-between space-y-4 group hover:border-[var(--brand)]/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-extrabold text-[var(--brand)]">
                  REC-02
                </span>
                {/* Dataset & derivation chip: Illustrative, not model output */}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  {isHi ? 'उदाहरणात्मक, मॉडल आउटपुट नहीं · SIH डमी डेटासेट' : 'Illustrative, not model output · SIH dummy dataset'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                  {isHi ? 'पुणे ईवी सर्विस तकनीशियन क्लस्टर' : 'Pune EV Service Technician Cluster'}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {isHi ? 'पुणे, महाराष्ट्र (चाकण एवं भोसरी)' : 'Pune, Maharashtra (Chakan & Bhosari)'}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
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
                  <span className="font-extrabold text-[var(--brand)]">+400</span>
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
              className="inline-flex items-center justify-between w-full py-2 px-3 rounded-xl glass hover:bg-[var(--glass-strong)] border border-[var(--border)] text-[var(--text)] text-xs font-bold transition-all cursor-pointer"
            >
              <span>{isHi ? 'सिफारिश विवरण देखें' : 'View Recommendation Details'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommendation 3: Coimbatore CNC Machine Operator */}
          <div className="p-5 rounded-3xl glass-strong border border-[var(--border)] shadow-md flex flex-col justify-between space-y-4 group hover:border-[var(--brand)]/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-extrabold text-[var(--brand)]">
                  REC-03
                </span>
                {/* Dataset & derivation chip: Illustrative, not model output */}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  {isHi ? 'उदाहरणात्मक, मॉडल आउटपुट नहीं · SIH डमी डेटासेट' : 'Illustrative, not model output · SIH dummy dataset'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                  {isHi ? 'कोयंबटूर सीएनसी ऑपरेटर क्लस्टर' : 'Coimbatore CNC Machine Operator Cluster'}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {isHi ? 'कोयंबटूर, तमिलनाडु' : 'Coimbatore, Tamil Nadu'}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
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
                  <span className="font-extrabold text-[var(--brand)]">+350</span>
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
              className="inline-flex items-center justify-between w-full py-2 px-3 rounded-xl glass hover:bg-[var(--glass-strong)] border border-[var(--border)] text-[var(--text)] text-xs font-bold transition-all cursor-pointer"
            >
              <span>{isHi ? 'सिफारिश विवरण देखें' : 'View Recommendation Details'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
