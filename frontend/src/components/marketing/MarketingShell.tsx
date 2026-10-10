'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { siteConfig } from '@/lib/site.config';
import { EXPORT_METADATA } from '@/lib/demoData';
import { ArrowRight, Compass, Sliders, Database, FileText, Sparkles, Activity, Menu } from 'lucide-react';

export function MarketingTopbar() {
  const { language, setLanguage, t, setMobileMenuOpen } = useApp();
  const isHi = language === 'hi';

  return (
    <header className="sticky top-0 z-40 w-full glass-strong border-b border-[var(--border)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden min-w-0 shrink">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0055a5] to-[#00c2cb] flex items-center justify-center text-white shadow-md shadow-[#00c2cb]/25 shrink-0 font-mono font-extrabold text-xs tracking-wider group-hover:scale-105 transition-transform border border-[#00c2cb]/40">
            {siteConfig.mark}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-extrabold tracking-tight text-[var(--text)] leading-tight flex items-center gap-1.5 font-display truncate">
              {isHi ? siteConfig.nameHi : siteConfig.name}
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c2cb] animate-pulse shrink-0 shadow-[0_0_6px_#00c2cb]" />
            </span>
            <span className="hidden sm:block text-[10px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase truncate">
              {isHi ? 'श्रम बाजार बुद्धिमत्ता इंजन' : 'AI LABOUR MARKET INTELLIGENCE'}
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
            <span>{isHi ? 'मॉडल कार्यप्रणाली' : 'Methodology'}</span>
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
          {/* DepthWizard Tactical Chip */}
          <span 
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#0055a5]/10 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-[#00c2cb]/30 tracking-tight"
            title={`${EXPORT_METADATA.runId} · ${EXPORT_METADATA.dataThrough}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c2cb] animate-ping" />
            <span>{EXPORT_METADATA.runId}</span>
          </span>

          {/* Language Switcher (hidden on mobile, present in drawer) */}
          <div 
            role="radiogroup" 
            aria-label="Language selector"
            className="hidden sm:inline-flex glass items-center rounded-full p-0.5 border border-[var(--border)] text-[11px] sm:text-xs font-bold font-mono"
          >
            <button
              type="button"
              role="radio"
              aria-checked={language === 'en'}
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                language === 'en' 
                  ? 'bg-[var(--surface-solid)] text-[#0055a5] dark:text-[#00c2cb] shadow-xs font-extrabold border border-[var(--border-strong)]' 
                  : 'text-[var(--text-faint)] hover:text-[var(--text)]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={language === 'hi'}
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                language === 'hi' 
                  ? 'bg-[var(--surface-solid)] text-[#0055a5] dark:text-[#00c2cb] shadow-xs font-extrabold border border-[var(--border-strong)]' 
                  : 'text-[var(--text-faint)] hover:text-[var(--text)]'
              }`}
            >
              हिन्दी
            </button>
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
            <span className="hidden xs:inline">{isHi ? 'डैशबोर्ड खोलें' : 'Open Dashboard'}</span>
            <span className="xs:hidden">{isHi ? 'डैशबोर्ड' : 'Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Navigation Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer flex items-center justify-center min-h-[36px] min-w-[36px]"
            aria-label={isHi ? 'मेनू खोलें' : 'Open menu'}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  const { language } = useApp();
  const isHi = language === 'hi';

  return (
    <footer className="w-full border-t border-[var(--border)] py-8 px-4 sm:px-6 lg:px-8 mt-12 glass bg-[var(--surface-muted)]/50 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0055a5] to-[#00c2cb] flex items-center justify-center text-white font-mono font-extrabold text-[11px] shadow-sm">
            KY
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[var(--text)] font-display tracking-tight text-sm">
              {isHi ? siteConfig.nameHi : siteConfig.name}
            </span>
            <span className="text-[10px] text-[var(--text-faint)] font-mono">
              SIH 2026 · Problem Statement 26246 · MSDE
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-4 text-xs font-medium font-sans">
          <Link href="/overview" className="hover:text-[var(--brand)] transition-colors">
            {isHi ? 'अवलोकन' : 'Overview'}
          </Link>
          <Link href="/scenarios" className="hover:text-[var(--brand)] transition-colors">
            {isHi ? 'परिदृश्य स्टूडियो' : 'Scenario Studio'}
          </Link>
          <Link href="/methodology" className="hover:text-[var(--brand)] transition-colors">
            {isHi ? 'मॉडल कार्यप्रणाली' : 'Methodology'}
          </Link>
          <Link href="/api" className="hover:text-[var(--brand)] transition-colors">
            {isHi ? 'एपीआई एवं निर्यात' : 'API & Exports'}
          </Link>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-faint)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c2cb] animate-pulse" />
          <span>{EXPORT_METADATA.runId} · 100% Bilingual</span>
        </div>
      </div>
    </footer>
  );
}
