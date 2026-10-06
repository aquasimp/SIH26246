'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Display, H2 } from '@/components/typography/Heading';
import { 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Sliders, 
  Database, 
  Compass, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export function HeroPage() {
  const { language, t } = useApp();

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Hero Section (§5.1) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-16 lg:pb-24 min-h-[min(88svh,820px)] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Subhead & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <Display 
              index="01" 
              eyebrow={t.hero.eyebrow}
              dataGlyph={true}
              className="tracking-tight"
            >
              {language === 'hi' ? (
                <>
                  <span>कौशल अंतराल का पूर्वानुमान। </span>
                  <span className="text-[var(--brand)]">समाधान में निवेश।</span>
                </>
              ) : (
                <>
                  <span>FORECAST THE SKILL GAP. </span>
                  <span className="text-[var(--brand)]">FUND THE FIX.</span>
                </>
              )}
            </Display>

            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl font-normal">
              {t.hero.subhead}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/overview"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white font-bold text-sm shadow-lg shadow-[var(--brand)]/25 hover:shadow-[var(--brand)]/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/scenarios?preset=rec01"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl glass hover:bg-[var(--glass-strong)] border border-[var(--border)] text-[var(--text)] font-bold text-sm hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>{t.hero.ctaSecondary}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Typographic Proof Panel (§5.1) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-3xl glass-strong border border-[var(--border-strong)] shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <span className="text-[11px] font-mono font-bold text-[var(--text-faint)] uppercase tracking-wider">
                  {t.hero.proofPanel.geography}
                </span>
                <Badge variant="severe" size="sm">
                  {language === 'hi' ? 'गंभीर कमी' : 'Severe Shortage'}
                </Badge>
              </div>

              {/* Typographic Ledger */}
              <div className="grid grid-cols-3 gap-2 text-center py-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-faint)] uppercase block">
                    {t.hero.proofPanel.demandLabel}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-display tabular-nums">
                    808
                  </div>
                </div>

                <div className="space-y-1 border-x border-[var(--border)]">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-faint)] uppercase block">
                    {t.hero.proofPanel.supplyLabel}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[var(--brand-secondary)] font-display tabular-nums">
                    97
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[var(--severe)] uppercase block">
                    {t.hero.proofPanel.shortfallLabel}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[var(--severe)] font-display tabular-nums">
                    711
                  </div>
                </div>
              </div>

              {/* Sparkline & Shortage Probability */}
              <div className="p-3.5 rounded-2xl glass border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--brand)]" />
                    <span>{t.hero.proofPanel.shortageProbability}</span>
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-faint)]">
                    {language === 'hi' ? 'अंतर 94/100' : 'Gap 94/100'}
                  </span>
                </div>

                {/* SVG Visual Sparkline */}
                <svg className="w-full h-12" viewBox="0 0 300 48" fill="none">
                  {/* Confidence Interval band */}
                  <path d="M 0 36 Q 75 32, 150 24 T 300 12 L 300 24 Q 225 32, 150 36 T 0 44 Z" fill="var(--brand)" fillOpacity="0.1" />
                  {/* Historical demand */}
                  <path d="M 0 40 L 50 38 L 100 32 L 150 26" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Forecast dashed */}
                  <path d="M 150 26 L 200 22 L 250 17 L 300 14" stroke="var(--brand)" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round" />
                  <circle cx="300" cy="14" r="3.5" fill="var(--brand)" />
                </svg>
              </div>

              {/* Provenance & CTA */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[10px] font-mono text-[var(--text-faint)] truncate max-w-[200px]">
                  {t.hero.proofPanel.provenance}
                </span>
                <Link
                  href="/scenarios?preset=rec01"
                  className="font-bold text-[var(--brand)] hover:underline inline-flex items-center gap-1 text-xs"
                >
                  <span>{t.hero.proofPanel.simulateLink}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Proof Strip (§5.1) */}
      <section className="w-full border-y border-[var(--border)] glass py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] font-display tabular-nums">
                {t.hero.proofStrip.occupationsCount}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)]">
                {t.hero.proofStrip.occupationsLabel}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[var(--brand)] font-display tabular-nums">
                {t.hero.proofStrip.districtsCount}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)]">
                {t.hero.proofStrip.districtsLabel}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] font-display tabular-nums">
                {t.hero.proofStrip.horizonsCount}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)]">
                {t.hero.proofStrip.horizonsLabel}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[var(--success)] font-display tabular-nums">
                {t.hero.proofStrip.wapeValue}
              </div>
              <div className="text-xs font-semibold text-[var(--text-muted)]">
                {t.hero.proofStrip.wapeLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Story Rail (§5.1) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <H2 index="02" eyebrow={language === 'hi' ? 'कार्यप्रणाली चक्र' : 'METHODOLOGY CYCLE'} className="text-center justify-center">
            {t.hero.story.title}
          </H2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: '01', icon: Compass, title: language === 'hi' ? 'आसूचना' : 'Intelligence', desc: t.hero.story.step1, link: '/overview' },
            { step: '02', icon: TrendingUp, title: language === 'hi' ? 'पूर्वानुमान' : 'Forecast', desc: t.hero.story.step2, link: '/forecasts' },
            { step: '03', icon: BarChart3, title: language === 'hi' ? 'कौशल अंतराल' : 'Gap', desc: t.hero.story.step3, link: '/gaps' },
            { step: '04', icon: Sparkles, title: language === 'hi' ? 'व्याख्या' : 'Explain', desc: t.hero.story.step4, link: '/occupations/7126.0101' },
            { step: '05', icon: ShieldAlert, title: language === 'hi' ? 'कार्रवाई' : 'Act', desc: t.hero.story.step5, link: '/recommendations' },
            { step: '06', icon: Sliders, title: language === 'hi' ? 'सिमुलेशन' : 'Simulate', desc: t.hero.story.step6, link: '/scenarios' }
          ].map((item) => (
            <Link
              key={item.step}
              href={item.link}
              className="p-5 rounded-2xl glass hover:bg-[var(--glass-strong)] border border-[var(--border)] hover:border-[var(--brand)]/40 transition-all flex flex-col justify-between group space-y-4 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[var(--brand)]">
                  {item.step}
                </span>
                <item.icon className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--brand)] transition-colors" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Product Tour (§5.1) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <H2 index="03" eyebrow={language === 'hi' ? 'उत्पाद संरचना' : 'PRODUCT ARCHITECTURE'}>
            {language === 'hi' ? 'बुद्धिमत्ता सूट की क्षमताएँ' : 'Core Analytical Capabilities'}
          </H2>
        </div>

        <div className="space-y-12">
          {/* Row 1: Forecasts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 rounded-3xl glass-strong border border-[var(--border)]">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold text-[var(--brand)] uppercase tracking-wider block">
                01 / {t.nav.forecasts}
              </span>
              <h3 className="text-2xl font-extrabold text-[var(--text)]">
                {t.hero.tour.forecastsTitle}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t.hero.tour.forecastsDesc}
              </p>
              <Link 
                href="/forecasts"
                className="inline-flex items-center gap-2 text-xs font-bold text-[var(--brand)] hover:underline pt-2"
              >
                <span>{language === 'hi' ? 'पूर्वानुमान स्टूडियो देखें' : 'Explore Forecasts Studio'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="lg:col-span-6 p-6 rounded-2xl glass border border-[var(--border)] space-y-3 font-mono text-xs">
              <div className="flex justify-between text-[11px] text-[var(--text-faint)] border-b border-[var(--border)] pb-2">
                <span>{language === 'hi' ? 'मॉडल आर्किटेक्चर' : 'Model Architecture'}</span>
                <span>{language === 'hi' ? 'आउट-ऑफ-सैंपल भार' : 'Out-of-Sample Weight'}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>{language === 'hi' ? 'LightGBM ग्रेडिएंट बूस्टर' : 'LightGBM Gradient Booster'}</span>
                <span className="font-bold text-[var(--brand)]">48.2%</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>{language === 'hi' ? 'रैंडम फ़ॉरेस्ट रिग्रेसर' : 'Random Forest Regressor'}</span>
                <span className="font-bold text-[var(--brand)]">26.4%</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>{language === 'hi' ? 'एक्सपोनेंशियल स्मूथिंग (ETS)' : 'Exponential Smoothing (ETS)'}</span>
                <span className="font-bold text-[var(--brand)]">15.1%</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>{language === 'hi' ? 'सीज़नल रोलिंग बेसलाइन' : 'Seasonal Rolling Baseline'}</span>
                <span className="font-bold text-[var(--brand)]">10.3%</span>
              </div>
            </div>
          </div>

          {/* Row 2: Scenario Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 rounded-3xl glass-strong border border-[var(--border)]">
            <div className="lg:col-span-6 order-2 lg:order-1 p-6 rounded-2xl glass border border-[var(--border)] space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-xs font-bold text-[var(--text)]">
                  {language === 'hi' ? 'LP सॉल्वर सीमा सत्यापन' : 'LP Solver Constraint Verification'}
                </span>
                <Badge variant="balanced" size="sm">
                  {language === 'hi' ? 'इष्टतम' : 'Optimal'}
                </Badge>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[var(--text-faint)]">
                    {language === 'hi' ? 'अनुरोधित सीट स्थानांतरण:' : 'Requested Seat Shift:'}
                  </span>
                  <span className="text-[var(--text)] font-bold">
                    {language === 'hi' ? '500 सीटें' : '500 Seats'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-faint)]">
                    {language === 'hi' ? 'LP दाता सुरक्षित सीमा (≤ 0.05):' : 'LP Donor Safe Bound (≤ 0.05):'}
                  </span>
                  <span className="text-[var(--brand)] font-bold">
                    {language === 'hi' ? '97 सीटें (कैप्ड)' : '97 Seats (Capped)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-faint)]">
                    {language === 'hi' ? 'दाता स्थानांतरण-उपरांत स्कोर:' : 'Donor Post-Transfer Score:'}
                  </span>
                  <span className="text-[var(--success)] font-bold">
                    {language === 'hi' ? '52 / 100 (संतुलित)' : '52 / 100 (Balanced)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-faint)]">
                    {language === 'hi' ? 'कमी पूर्णता (कॉम्बो):' : 'Shortfall Closed (Combo):'}
                  </span>
                  <span className="text-[var(--brand)] font-bold">15.6%</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider block">
                02 / {t.nav.scenarios}
              </span>
              <h3 className="text-2xl font-extrabold text-[var(--text)]">
                {t.hero.tour.scenariosTitle}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t.hero.tour.scenariosDesc}
              </p>
              <Link 
                href="/scenarios"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 hover:underline pt-2"
              >
                <span>{language === 'hi' ? 'नीति सैंडबॉक्स खोलें' : 'Open Policy Sandbox'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Method & Trust (§5.1) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 sm:p-12 rounded-3xl glass-strong border border-[var(--border)] space-y-8">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-mono font-bold text-[var(--brand)] uppercase tracking-wider">
              {language === 'hi' ? 'शासन एवं विश्वसनीयता' : 'GOVERNANCE & TRUST'}
            </span>
            <h2 className="text-2xl font-extrabold text-[var(--text)]">
              {t.hero.trust.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text)]">
                {t.hero.trust.col1Title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t.hero.trust.col1Desc}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text)]">
                {t.hero.trust.col2Title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t.hero.trust.col2Desc}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text)]">
                {t.hero.trust.col3Title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t.hero.trust.col3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Closing CTA Band (§5.1) */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-[var(--text)] font-display tracking-tight">
            {language === 'hi' 
              ? 'राष्ट्रीय कौशल योजना को सुदृढ़ बनाएं' 
              : "READY TO EXPLORE INDIA'S SKILL PULSE?"}
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {language === 'hi'
              ? 'आधिकारिक डेटासेट, वॉक-फ़ॉरवर्ड पूर्वानुमान और गैर-रिक्तीकरण सीट पुनर्आवंटन मॉडल के साथ निर्णय लें।'
              : 'Access district-level intelligence, multi-horizon demand forecasts, and linear programming seat reallocation models.'}
          </p>
          <div className="pt-2">
            <Link
              href="/overview"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white font-bold text-sm shadow-xl shadow-[var(--brand)]/30 hover:scale-105 transition-all cursor-pointer"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
