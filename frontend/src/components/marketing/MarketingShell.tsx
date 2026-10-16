'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { siteConfig } from '@/lib/site.config';
import { EXPORT_METADATA } from '@/lib/demoData';
import { ArrowRight, Compass, Sliders, Database, FileText, Menu } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function MarketingTopbar() {
  const { t, l, setMobileMenuOpen } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 w-full select-none shadow-xs">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-10 h-14 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0 shrink">
          <BrandLogo size="lg" alt="KaushalYuva Logo" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight truncate">
              {t.appTitle || siteConfig.name}
            </span>
            <span className="hidden sm:block text-[10px] font-medium text-slate-500 uppercase tracking-wider truncate">
              {t.appSubtitle || l('AI LABOUR MARKET INTELLIGENCE', 'श्रम बाजार बुद्धिमत्ता इंजन')}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Marketing Navigation" className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Link 
            href="/overview" 
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors py-1"
          >
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.nav.overview}</span>
          </Link>
          <Link 
            href="/scenarios" 
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors py-1"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.nav.scenarios}</span>
          </Link>
          <Link 
            href="/methodology" 
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors py-1"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.nav.methodology || l('Methodology', 'मॉडल कार्यप्रणाली')}</span>
          </Link>
          <Link 
            href="/api" 
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors py-1"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.nav.apiExports}</span>
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Dataset Chip */}
          <span 
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0"
            title={`${EXPORT_METADATA.runId} · ${EXPORT_METADATA.dataThrough}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>{EXPORT_METADATA.runId}</span>
          </span>

          {/* Multilingual Selector */}
          <div className="hidden sm:inline-flex shrink-0">
            <LanguageSelector align="left" />
          </div>

          {/* Theme Toggle */}
          <div className="hidden sm:block shrink-0">
            <ThemeToggle />
          </div>

          {/* Primary Open Dashboard CTA */}
          <Link
            href="/overview"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs min-h-[34px] shrink-0"
          >
            <span className="hidden xs:inline">{t.nav.openDashboard || l('Open Dashboard', 'डैशबोर्ड खोलें')}</span>
            <span className="xs:hidden">{t.nav.overview || l('Dashboard', 'डैशबोर्ड')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Navigation Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center min-h-[34px] min-w-[34px] shrink-0"
            aria-label={l('Open menu', 'मेनू खोलें')}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
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
