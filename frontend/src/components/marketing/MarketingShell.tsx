'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { siteConfig } from '@/lib/site.config';
import { EXPORT_METADATA } from '@/lib/demoData';
import { ArrowRight, Compass, Sliders, Database, FileText, Sparkles, Activity, Menu } from 'lucide-react';

export function MarketingTopbar() {
  const { language, setLanguage, t, l, setMobileMenuOpen } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full glass-strong border-b border-[var(--border)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden min-w-0 shrink">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-[#00c2cb]/25 shrink-0 group-hover:scale-105 transition-transform border border-[#00c2cb]/40 flex items-center justify-center bg-[#071321]">
            <img src="/logo.png" alt="KaushalYuva Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-extrabold tracking-tight text-[var(--text)] leading-tight flex items-center gap-1.5 font-display truncate">
              {t.appTitle || siteConfig.name}
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c2cb] animate-pulse shrink-0 shadow-[0_0_6px_#00c2cb]" />
            </span>
            <span className="hidden sm:block text-[10px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase truncate">
              {t.appSubtitle || l('AI LABOUR MARKET INTELLIGENCE', 'श्रम बाजार बुद्धिमत्ता इंजन')}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Marketing Navigation" className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[var(--text-muted)] font-sans">
          <Link 
            href="/overview" 
            className="flex items-center gap-1.5 hover:text-[var(--text)] hover:text-[#00c2cb] transition-colors py-1"
          >
            <Compass className="w-3.5 h-3.5 text-[#00c2cb]" />
            <span>{t.nav.overview}</span>
          </Link>
          <Link 
            href="/scenarios" 
            className="flex items-center gap-1.5 hover:text-[var(--text)] hover:text-amber-500 transition-colors py-1"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.nav.scenarios}</span>
          </Link>
          <Link 
            href="/methodology" 
            className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors py-1"
          >
            <FileText className="w-3.5 h-3.5 text-[#0055a5] dark:text-cyan-400" />
            <span>{t.nav.methodology || l('Methodology', 'मॉडल कार्यप्रणाली')}</span>
          </Link>
          <Link 
            href="/api" 
            className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors py-1"
          >
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.nav.apiExports}</span>
          </Link>
        </nav>

        {/* Right Controls: Dataset Chip, Language, Theme, Open Dashboard CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* DepthWizard Tactical Chip — Obsidian Pitch Dark Crisp Styling */}
          <span 
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-900/90 dark:bg-black/90 text-cyan-700 dark:text-[#00e5ff] border border-[#0055a5]/30 dark:border-cyan-500/40 shadow-xs dark:shadow-[0_0_15px_rgba(0,229,255,0.2)] tracking-tight backdrop-blur-md"
            title={`${EXPORT_METADATA.runId} · ${EXPORT_METADATA.dataThrough}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c2cb] dark:bg-[#00e5ff] animate-ping" />
            <span>{EXPORT_METADATA.runId}</span>
          </span>

          {/* Multilingual Selector (7 Languages) */}
          <div className="hidden sm:inline-flex">
            <LanguageSelector />
          </div>

          {/* Theme Toggle (hidden on mobile, present in drawer) */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Primary Open Dashboard CTA */}
          <Link
            href="/overview"
            className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] hover:opacity-90 text-white font-bold text-xs shadow-md shadow-[#00c2cb]/20 hover:-translate-y-0.5 transition-all cursor-pointer font-sans min-h-[36px]"
          >
            <span className="hidden xs:inline">{t.nav.openDashboard || l('Open Dashboard', 'डैशबोर्ड खोलें')}</span>
            <span className="xs:hidden">{t.nav.overview || l('Dashboard', 'डैशबोर्ड')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Navigation Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer flex items-center justify-center min-h-[36px] min-w-[36px]"
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
  const { language, t, l } = useApp();

  return (
    <footer className="w-full border-t border-[var(--border)] py-8 px-4 sm:px-6 lg:px-8 mt-12 glass bg-[var(--surface-muted)]/50 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#00c2cb]/40 flex items-center justify-center bg-[#071321] shadow-xs">
            <img src="/logo.png" alt="KY" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[var(--text)] font-display tracking-tight text-sm">
              {t.appTitle || siteConfig.name}
            </span>
            <span className="text-[10px] text-[var(--text-faint)] font-mono">
              SIH 2026 · Problem Statement 26246 · MSDE
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-4 text-xs font-medium font-sans">
          <Link href="/overview" className="hover:text-[var(--brand)] transition-colors">
            {t.nav.overview}
          </Link>
          <Link href="/scenarios" className="hover:text-[var(--brand)] transition-colors">
            {t.nav.scenarios}
          </Link>
          <Link href="/methodology" className="hover:text-[var(--brand)] transition-colors">
            {t.nav.methodology || l('Methodology', 'मॉडल कार्यप्रणाली')}
          </Link>
          <Link href="/api" className="hover:text-[var(--brand)] transition-colors">
            {t.nav.apiExports}
          </Link>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-faint)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c2cb] animate-pulse" />
          <span>{EXPORT_METADATA.runId} · {l('7 Scheduled Languages', '7 अनुसूचित भाषाएं')}</span>
        </div>
      </div>
    </footer>
  );
}
