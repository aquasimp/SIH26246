'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { siteConfig } from '@/lib/site.config';
import { EXPORT_METADATA } from '@/lib/demoData';
import { ArrowRight, Compass, Sliders, Database, FileText } from 'lucide-react';

export function MarketingTopbar() {
  const { language, setLanguage, t } = useApp();
  const isHi = language === 'hi';

  return (
    <header className="sticky top-0 z-40 w-full glass-strong border-b border-[var(--border)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand Lockup (§2) */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group focus:outline-hidden min-w-0 shrink">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--brand)] to-blue-600 flex items-center justify-center text-white shadow-md shadow-[var(--brand)]/20 shrink-0 font-mono font-extrabold text-xs tracking-wider group-hover:scale-105 transition-transform">
            {siteConfig.mark}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-extrabold tracking-tight text-[var(--text)] leading-tight flex items-center gap-1.5 font-display truncate">
              {isHi ? siteConfig.nameHi : siteConfig.name}
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse shrink-0" />
            </span>
            <span className="hidden sm:block text-[10px] font-semibold text-[var(--text-faint)] tracking-wider uppercase truncate">
              {isHi ? 'श्रम बाजार बुद्धिमत्ता' : 'Labour Market Intelligence'}
            </span>
          </div>
        </Link>

        {/* Navigation Links (3 links) */}
        <nav aria-label="Marketing Navigation" className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[var(--text-muted)]">
          <Link 
            href="/overview" 
            className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors py-1"
          >
            <Compass className="w-3.5 h-3.5 text-[var(--brand)]" />
            <span>{t.nav.overview}</span>
          </Link>
          <Link 
            href="/scenarios" 
            className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors py-1"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.nav.scenarios}</span>
          </Link>
          <Link 
            href="/api" 
            className="flex items-center gap-1.5 hover:text-[var(--text)] transition-colors py-1"
          >
            <Database className="w-3.5 h-3.5 text-[var(--brand-secondary)]" />
            <span>{t.nav.apiExports}</span>
          </Link>
        </nav>

        {/* Right Controls: Dataset Chip, Language, Theme, Open Dashboard CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Page-level Dataset Chip */}
          <span 
            className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 tracking-tight"
            title={`${EXPORT_METADATA.runId} · ${EXPORT_METADATA.dataThrough}`}
          >
            {isHi ? 'SIH डमी डेटासेट' : 'SIH dummy dataset'}
          </span>

          {/* Language Switcher */}
          <div 
            role="radiogroup" 
            aria-label="Language selector"
            className="glass inline-flex items-center rounded-full p-0.5 border border-[var(--border)] text-[11px] sm:text-xs font-bold"
          >
            <button
              type="button"
              role="radio"
              aria-checked={language === 'en'}
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                language === 'en' 
                  ? 'bg-[var(--glass-strong)] text-[var(--brand)] shadow-xs font-extrabold border border-[var(--border-strong)]' 
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
                  ? 'bg-[var(--glass-strong)] text-[var(--brand)] shadow-xs font-extrabold border border-[var(--border-strong)]' 
                  : 'text-[var(--text-faint)] hover:text-[var(--text)]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Open Dashboard CTA */}
          <Link
            href="/overview"
            className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white text-xs font-bold shadow-md shadow-[var(--brand)]/20 transition-all cursor-pointer shrink-0"
          >
            <span className="hidden sm:inline">{isHi ? 'डैशबोर्ड खोलें' : 'Open Dashboard'}</span>
            <span className="sm:hidden">{isHi ? 'डैशबोर्ड' : 'Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  const { language } = useApp();
  const isHi = language === 'hi';

  return (
    <footer className="w-full border-t border-[var(--border)] glass-strong mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--brand)] flex items-center justify-center text-white font-mono font-bold text-xs">
                {siteConfig.mark}
              </div>
              <span className="font-extrabold text-base tracking-tight text-[var(--text)] font-display">
                {isHi ? siteConfig.nameHi : siteConfig.name}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-md leading-relaxed">
              {isHi ? siteConfig.taglineHi : siteConfig.tagline}
            </p>
            {/* Provenance Footer Meta */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[var(--text-faint)] pt-2">
              <span className="px-2 py-0.5 rounded-md bg-[var(--glass)] border border-[var(--border)]">
                {isHi ? 'SIH डमी डेटासेट' : EXPORT_METADATA.dataSource}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--glass)] border border-[var(--border)]">
                {EXPORT_METADATA.runId}
              </span>
              <span>•</span>
              <span>{isHi ? '04 अक्टूबर 2026 · डेटा अक्टूबर 2024 तक' : '04 Oct 2026 · data through Oct 2024'}</span>
              <span>•</span>
              <span>v2.1.0</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] font-mono mb-3">
              {isHi ? 'बुद्धिमत्ता मॉड्यूल' : 'Intelligence Modules'}
            </h4>
            <ul className="space-y-2 text-xs">
              {siteConfig.footerLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                    {isHi ? link.labelHi : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] font-mono mb-3">
              {isHi ? 'प्रशासन एवं धारणाएँ' : 'Governance & Assumptions'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/methodology" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[var(--brand)]" />
                  <span>{isHi ? 'मॉडल धारणाएँ एवं पद्धति' : 'Model Assumptions & Methodology'}</span>
                </Link>
              </li>
              {siteConfig.footerLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                    {isHi ? link.labelHi : link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a 
                  href={siteConfig.urls.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {isHi ? 'गिटहब रिपॉजिटरी' : 'GitHub Repository'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-faint)]">
          <p>
            {isHi 
              ? 'कौशल विकास एवं उद्यमशीलता मंत्रालय (MSDE) — स्मार्ट इंडिया हैकथॉन 2026' 
              : 'Ministry of Skill Development & Entrepreneurship (MSDE) — Smart India Hackathon 2026'}
          </p>
          <p className="font-mono text-[10px]">
            {isHi ? EXPORT_METADATA.statusLabelHi : EXPORT_METADATA.statusLabel} · {EXPORT_METADATA.dataHash}
          </p>
        </div>
      </div>
    </footer>
  );
}
