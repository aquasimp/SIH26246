'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { siteConfig } from '@/lib/site.config';
import { EXPORT_METADATA } from '@/lib/demoData';
import { ArrowRight, Compass, Sliders, Database, FileText, Menu, Sparkles } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function MarketingTopbar() {
  const { t, l, setMobileMenuOpen } = useApp();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`floating-nav-wrapper ${scrolled ? 'nav-scrolled' : ''}`}>
      <header className="floating-nav-pill select-none">
        {/* Brand Lockup with DepthWizard-style geometry */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0 shrink">
          <BrandLogo size="md" alt="KaushalYuva Logo" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                {t.appTitle || siteConfig.name}
              </span>
              <span className="hidden sm:inline-flex text-[9.5px] font-bold text-sky-700 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded-full">
                MSDE
              </span>
            </div>
            <span className="hidden md:block text-[9.5px] font-medium text-slate-500 uppercase tracking-wider truncate">
              {t.appSubtitle || l('AI LABOUR MARKET INTELLIGENCE', 'श्रम बाजार बुद्धिमत्ता इंजन')}
            </span>
          </div>
        </Link>

        {/* Center: DepthWizard-style Navigation Links & Centered Demo Action Button */}
        <div className="hidden lg:flex items-center gap-1.5 flex-1 justify-center max-w-2xl px-2">
          <nav aria-label="Marketing Navigation" className="flex items-center gap-1">
            <Link 
              href="/overview" 
              className="nav-link-btn"
            >
              <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{t.nav.overview}</span>
            </Link>
            <Link 
              href="/scenarios" 
              className="nav-link-btn"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.nav.scenarios}</span>
            </Link>
            <Link 
              href="/methodology" 
              className="nav-link-btn"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.nav.methodology || l('Methodology', 'मॉडल कार्यप्रणाली')}</span>
            </Link>
            <Link 
              href="/api" 
              className="nav-link-btn"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.nav.apiExports}</span>
            </Link>
          </nav>

          {/* Centered Quick Action Demo Pill */}
          <Link
            href="/scenarios?preset=rec01"
            className="nav-demo-pill-btn ml-2"
            title={l('Run Live Reallocation Simulation', 'लाइव सिमुलेशन चलाएं')}
          >
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span>{l('Live Studio', 'लाइव स्टूडियो')}</span>
          </Link>
        </div>

        {/* Right Controls: Frosted Chips & Luminous Liquid Glass Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Dataset Chip */}
          <span 
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shrink-0 shadow-2xs"
            title={`${EXPORT_METADATA.runId} · ${EXPORT_METADATA.dataThrough}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-mono text-[10px]">{EXPORT_METADATA.runId}</span>
          </span>

          {/* Multilingual Selector */}
          <div className="hidden sm:inline-flex shrink-0">
            <LanguageSelector align="left" />
          </div>

          {/* Theme Toggle */}
          <div className="hidden sm:block shrink-0">
            <ThemeToggle />
          </div>

          {/* Primary Open Dashboard CTA — Luminous Liquid Glass (NO harsh black!) */}
          <Link
            href="/overview"
            className="btn-liquid-primary text-xs py-1.5 px-3.5 font-semibold"
          >
            <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden xs:inline">{t.nav.openDashboard || l('Open Dashboard', 'डैशबोर्ड खोलें')}</span>
            <span className="xs:hidden">{t.nav.overview || l('Dashboard', 'डैशबोर्ड')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Navigation Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center min-h-[32px] min-w-[32px] shrink-0"
            aria-label={l('Open menu', 'मेनू खोलें')}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>
    </div>
  );
}

export function MarketingFooter() {
  const { t, l } = useApp();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 mt-12 bg-white dark:bg-slate-900 select-none">
      <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" alt="KaushalYuva Logo" />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
              {t.appTitle || siteConfig.name}
            </span>
            <span className="text-[11px] text-slate-400">
              {l('SIH 2026 · Problem Statement 26246 · MSDE', 'स्मार्ट इंडिया हैकथॉन 2026 · समस्या विवरण 26246 · MSDE')}
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-4 text-xs font-medium">
          <Link href="/overview" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            {t.nav.overview}
          </Link>
          <Link href="/scenarios" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            {t.nav.scenarios}
          </Link>
          <Link href="/methodology" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            {t.nav.methodology || l('Methodology', 'मॉडल कार्यप्रणाली')}
          </Link>
          <Link href="/api" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            {t.nav.apiExports}
          </Link>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{EXPORT_METADATA.runId} · {l('7 Official Indian Languages', '7 आधिकारिक भारतीय भाषाएं')}</span>
        </div>
      </div>
    </footer>
  );
}
