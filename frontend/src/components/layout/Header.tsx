'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Maximize2, 
  Minimize2, 
  ArrowLeft,
  Menu,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { getLocalizedEntityName } from '@/lib/i18n';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { 
    language, 
    t, 
    l,
    selectedState, 
    selectedDistrict, 
    notificationOpen, 
    setNotificationOpen,
    alerts,
    setCopilotOpen,
    setCommandPaletteOpen,
    focusMode,
    toggleFocusMode,
    setMobileMenuOpen
  } = useApp();

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

  const currentPathLabel = () => {
    if (pathname.includes('/forecasts')) return t.nav.forecasts;
    if (pathname.includes('/intelligence')) return t.nav.intelligence;
    if (pathname.includes('/gaps')) return t.nav.gaps;
    if (pathname.includes('/alerts')) return t.nav.alerts;
    if (pathname.includes('/recommendations')) return t.nav.recommendations;
    if (pathname.includes('/scenarios')) return t.nav.scenarios;
    if (pathname.includes('/districts')) return t.nav.districts;
    if (pathname.includes('/occupations')) return t.nav.occupations;
    if (pathname.includes('/qualifications')) return t.nav.qualifications;
    if (pathname.includes('/data-health')) return t.nav.dataHealth;
    if (pathname.includes('/methodology')) return t.nav.methodology || l('Methodology', 'मॉडल कार्यप्रणाली');
    if (pathname.includes('/api')) return t.nav.apiExports;
    if (pathname.includes('/settings')) return t.nav.settings;
    return t.nav.overview;
  };

  // Format district name with title case
  const rawDistrict = selectedDistrict 
    ? selectedDistrict.charAt(0).toUpperCase() + selectedDistrict.slice(1).replace('_', ' ')
    : 'Gorakhpur';

  const localizedState = getLocalizedEntityName('states', selectedState, language, selectedState);
  const localizedDistrict = getLocalizedEntityName('districts', rawDistrict, language, rawDistrict);

  return (
    <div className="sticky top-0 z-40 pt-2.5 pb-1 px-3 sm:px-5 lg:px-6 w-full select-none transition-all bg-[var(--bg)]/80 backdrop-blur-md">
      <header className="floating-nav-pill w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 lg:gap-3 min-w-0 w-full">
        {/* Left Side: Mobile Hamburger Menu & Breadcrumb Trail */}
        <div className="flex items-center justify-between gap-2 w-full lg:w-auto min-w-0 flex-1">
          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer flex items-center justify-center shrink-0 h-[36px] w-[36px] shadow-xs active:scale-95 transition-all"
            aria-label={l('Open navigation menu', 'नेविगेशन मेनू खोलें')}
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center overflow-x-auto scrollbar-none whitespace-nowrap gap-1.5 text-xs font-medium text-slate-500 py-0.5 flex-1 min-w-0">
            <Link 
              href="/" 
              className="flex items-center gap-1 text-slate-900 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 font-semibold text-xs pr-2 border-r border-slate-200 dark:border-slate-700 mr-0.5 group shrink-0 transition-colors"
              title={l('KaushalYuva Home', 'कौशलयुवा मुख्य पृष्ठ')}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>{l('Home', 'होम')}</span>
            </Link>
            <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
              {l('MSDE', 'एमएसडीई')}
            </span>
            <span className="text-slate-300 dark:text-slate-600 shrink-0">/</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium shrink-0 max-w-[110px] truncate" title={localizedState}>
              {localizedState}
            </span>
            <span className="text-slate-300 dark:text-slate-600 shrink-0">/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 shrink-0 max-w-[125px] truncate" title={localizedDistrict}>
              {localizedDistrict}
            </span>
            <span className="text-slate-300 dark:text-slate-600 shrink-0">/</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium shrink-0 max-w-[135px] truncate" title={currentPathLabel()}>
              {currentPathLabel()}
            </span>
          </nav>
        </div>

        {/* Right Control Cluster */}
        <div className="flex items-center flex-nowrap gap-1.5 sm:gap-2 self-end lg:self-auto shrink-0">
          {/* Compact Dataset Badge */}
          <button
            type="button"
            className="hidden 2xl:flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all shrink-0 h-[36px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
            title={l('Snapshot: RUN-2026-10-04-EVAL • Tri-Model Ensemble Blend', 'स्नैपशॉट: RUN-2026-10-04-EVAL • त्रि-मॉडल मिश्रण')}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>{l('Dataset: MSDE Oct 2024', 'डेटासेट: MSDE अक्टू. 2024')}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Global Search trigger (Ctrl K / Cmd K) */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label={l('Open command palette', 'कमांड पैलेट खोलें')}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer transition-all shrink-0 h-[36px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 active:translate-y-0"
            title={l('Open Command Palette (Ctrl+K or ⌘+K)', 'कमांड पैलेट खोलें (Ctrl+K)')}
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="hidden xl:inline">{l('Search...', 'खोजें...')}</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Focus Mode Toggle */}
          <button
            type="button"
            onClick={toggleFocusMode}
            className={`hidden lg:inline-flex p-1.5 rounded-full border cursor-pointer transition-all shrink-0 h-[36px] w-[36px] items-center justify-center shadow-xs hover:-translate-y-0.5 active:translate-y-0 ${
              focusMode 
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100' 
                : 'border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95)]'
            }`}
            title={focusMode ? l('Exit Focus Mode (Esc)', 'फोकस मोड से बाहर निकलें (Esc)') : l('Enter Focus Mode (Maximize Workspace)', 'फोकस मोड सक्षम करें')}
            aria-label={l('Toggle Focus Mode', 'फोकस मोड टॉगल करें')}
          >
            {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Theme Selector */}
          <div className="hidden sm:inline-flex shrink-0">
            <ThemeToggle />
          </div>

          {/* Multilingual Selector */}
          <div className="hidden sm:inline-flex shrink-0">
            <LanguageSelector />
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="p-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md relative text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer shrink-0 h-[36px] w-[36px] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
            title={l('Early Warnings & Intelligence Signals', 'प्रारंभिक चेतावनियां और संकेत')}
            aria-label={l('Intelligence Notifications', 'सूचनाएं')}
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Ask Assistant Button — Luminous Liquid Glass Pill (NO harsh black!) */}
          <button
            type="button"
            onClick={() => setCopilotOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-liquid-primary transition-all font-semibold text-xs cursor-pointer shrink-0 h-[36px]"
            title={l('Open AI Assistant', 'AI सहायक खोलें')}
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{l('Ask Assistant', 'AI सहायक')}</span>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[9px] font-mono font-bold border border-sky-500/20">AI</span>
          </button>
        </div>
      </div>
    </header>
  </div>
  );
};
