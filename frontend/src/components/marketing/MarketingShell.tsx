'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { siteConfig } from '@/lib/site.config';
import { ArrowRight, Compass, Sliders, Database } from 'lucide-react';

export function MarketingTopbar() {
  const { language, setLanguage, t } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full glass-strong border-b border-[var(--border)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Lockup (§2) */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--brand)] to-blue-600 flex items-center justify-center text-white shadow-md shadow-[var(--brand)]/20 shrink-0 font-mono font-extrabold text-sm tracking-wider group-hover:scale-105 transition-transform">
            {siteConfig.mark}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-[var(--text)] leading-tight flex items-center gap-1.5 font-display">
              {language === 'hi' ? siteConfig.nameHi : siteConfig.name}
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse shrink-0" />
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-faint)] tracking-wider uppercase">
              {language === 'hi' ? siteConfig.taglineHi.slice(0, 24) : 'Labour Market Intelligence'}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav aria-label="Marketing Navigation" className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--text-muted)]">
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

        {/* Right Controls: Language, Theme, Open Dashboard CTA */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div 
            role="radiogroup" 
            aria-label="Language selector"
            className="glass inline-flex items-center rounded-full p-0.5 border border-[var(--border)] text-xs font-bold"
          >
            <button
              type="button"
              role="radio"
              aria-checked={language === 'en'}
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
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
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white text-xs font-bold shadow-md shadow-[var(--brand)]/20 transition-all cursor-pointer"
          >
            <span>{language === 'hi' ? 'डैशबोर्ड खोलें' : 'Open Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  const { language } = useApp();

  return (
    <footer className="w-full border-t border-[var(--border)] glass-strong mt-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--brand)] flex items-center justify-center text-white font-mono font-bold text-xs">
                {siteConfig.mark}
              </div>
              <span className="font-extrabold text-base tracking-tight text-[var(--text)] font-display">
                {language === 'hi' ? siteConfig.nameHi : siteConfig.name}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-md leading-relaxed">
              {language === 'hi' ? siteConfig.taglineHi : siteConfig.tagline}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-faint)] pt-2">
              <span className="px-2 py-0.5 rounded-md bg-[var(--glass)] border border-[var(--border)]">
                {siteConfig.event.runId}
              </span>
              <span>•</span>
              <span>{siteConfig.event.datasetVersion}</span>
              <span>•</span>
              <span>{siteConfig.event.modelVersion}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] font-mono mb-3">
              {language === 'hi' ? 'बुद्धिमत्ता मॉड्यूल' : 'Intelligence Modules'}
            </h4>
            <ul className="space-y-2 text-xs">
              {siteConfig.footerLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                    {language === 'hi' ? link.labelHi : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] font-mono mb-3">
              {language === 'hi' ? 'प्रशासन एवं तकनीकी' : 'Governance & Platform'}
            </h4>
            <ul className="space-y-2 text-xs">
              {siteConfig.footerLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                    {language === 'hi' ? link.labelHi : link.label}
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
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-faint)]">
          <p>
            {language === 'hi' 
              ? 'कौशल विकास एवं उद्यमशीलता मंत्रालय (MSDE) — स्मार्ट इंडिया हैकथॉन 2026' 
              : 'Ministry of Skill Development & Entrepreneurship (MSDE) — Smart India Hackathon 2026'}
          </p>
          <p className="font-mono text-[10px]">
            {language === 'hi' ? 'पाइपलाइन स्नैपशॉट — लाइव फ़ीड नहीं' : 'Pipeline snapshot — not a live feed'}
          </p>
        </div>
      </div>
    </footer>
  );
}
