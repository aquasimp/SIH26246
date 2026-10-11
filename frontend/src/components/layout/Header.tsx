'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Bot,
  Activity,
  ArrowLeft,
  Radio,
  Menu
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { DataSourceControl } from '../common/DataSourceControl';
import { getLocalizedEntityName } from '@/lib/i18n';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { 
    language, 
    setLanguage, 
    t, 
    l,
    selectedState, 
    selectedDistrict, 
    datasetMode,
    notificationOpen, 
    setNotificationOpen,
    alerts,
    setCopilotOpen,
    setCommandPaletteOpen,
    focusMode,
    toggleFocusMode,
    isOfflineFixture,
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
    <header className="sticky top-0 z-20 px-3 sm:px-6 py-2 glass-strong border-b border-[var(--border)] select-none backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        {/* Top Mobile Row & Breadcrumb Trail */}
        <div className="flex items-center justify-between gap-2 w-full lg:w-auto">
          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer flex items-center justify-center shrink-0 min-h-[36px] min-w-[36px]"
            aria-label={l('Open navigation menu', 'नेविगेशन मेनू खोलें')}
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumb Trail with Home Link */}
          <nav aria-label="Breadcrumb" className="flex items-center overflow-x-auto scrollbar-none whitespace-nowrap gap-1.5 text-xs font-medium text-[var(--text-muted)] py-0.5 flex-1 min-w-0">
            <Link 
              href="/" 
              className="flex items-center gap-1 text-[var(--brand)] hover:underline font-bold text-xs pr-2 border-r border-[var(--border)] mr-0.5 group shrink-0"
              title={l('KaushalYuva Home', 'कौशलयुवा मुख्य पृष्ठ')}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>{l('Home', 'होम')}</span>
            </Link>
            <span className="font-bold text-[var(--text)] flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#00c2cb] shrink-0 shadow-[0_0_6px_#00c2cb] animate-pulse" />
              {l('MSDE', 'एमएसडीई')}
            </span>
            <span className="text-[var(--text-faint)] shrink-0">/</span>
            <span className="text-[var(--text)] font-semibold shrink-0">{localizedState}</span>
            <span className="text-[var(--text-faint)] shrink-0">/</span>
            <span className="font-bold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-md border border-[var(--brand)]/20 font-mono shrink-0">
              {localizedDistrict}
            </span>
            <span className="text-[var(--text-faint)] shrink-0">/</span>
            <span className="text-[var(--text)] font-semibold shrink-0">{currentPathLabel()}</span>
          </nav>
        </div>

        {/* Center / Right Control Cluster */}
        <div className="flex items-center flex-wrap gap-2 self-end lg:self-auto">
          {/* DepthWizard Tactical Telemetry Pill — High Contrast Obsidian & Light Styling */}
          <div 
            className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-black/95 border border-slate-300/80 dark:border-cyan-500/40 text-slate-700 dark:text-[#00e5ff] font-mono text-[11px] font-bold shadow-xs dark:shadow-[0_0_15px_rgba(0,229,255,0.25)] backdrop-blur-md"
            title={l('Snapshot: RUN-SIH-001 • Model v2.4 (Tri-Model Blend) • Baseline: Seasonal Naive', 'स्नैपशॉट: RUN-SIH-001 • मॉडल v2.4 • बेसलाइन: सीज़नल नेईव')}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 dark:bg-[#00e5ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600 dark:bg-[#00e5ff]"></span>
            </span>
            <span>RUN-SIH-001 <span className="opacity-40">·</span> <strong className="text-slate-900 dark:text-white font-semibold">{l('Oct 2024 Data', 'अक्टूबर 2024 डेटा')}</strong></span>
          </div>

          {/* Global Search trigger (Ctrl K / Cmd K) */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label={l('Open command palette', 'कमांड पैलेट खोलें')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl liquid-control text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#00c2cb]/50 cursor-pointer transition-colors"
            title={l('Open Command Palette (Ctrl+K or ⌘+K)', 'कमांड पैलेट खोलें (Ctrl+K)')}
          >
            <Search className="w-3.5 h-3.5 text-[var(--text-faint)]" />
            <span className="hidden sm:inline">{l('Search...', 'खोजें...')}</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono text-[var(--text-faint)] bg-[var(--glass)] border border-[var(--border)] rounded">
              ⌘K
            </kbd>
          </button>

          {/* Data Source Segmented Control */}
          <DataSourceControl />

          {/* Focus Mode Toggle */}
          <button
            type="button"
            onClick={toggleFocusMode}
            className={`hidden sm:inline-flex p-1.5 rounded-xl liquid-control cursor-pointer transition-all ${
              focusMode ? 'bg-[var(--brand)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            title={focusMode ? l('Exit Focus Mode (Esc)', 'फोकस मोड से बाहर निकलें (Esc)') : l('Enter Focus Mode (Maximize Workspace)', 'फोकस मोड सक्षम करें')}
            aria-label={l('Toggle Focus Mode', 'फोकस मोड टॉगल करें')}
          >
            {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Theme Selector (Light / Dark / System) */}
          <div className="hidden sm:inline-flex">
            <ThemeToggle />
          </div>

          {/* Multilingual Selector (7 Languages) */}
          <div className="hidden sm:inline-flex">
            <LanguageSelector />
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="p-1.5 rounded-xl liquid-control relative text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            title={l('Early Warnings & Intelligence Signals', 'प्रारंभिक चेतावनियां और संकेत')}
            aria-label={l('Intelligence Notifications', 'सूचनाएं')}
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--severe)] text-white text-[9px] font-mono font-bold flex items-center justify-center border border-[var(--surface-solid)] shadow-[0_0_6px_#ff6600]">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Kaushal Copilot Button */}
          <button
            type="button"
            onClick={() => setCopilotOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] text-white hover:opacity-90 transition-all font-bold text-xs shadow-md shadow-[#00c2cb]/20 cursor-pointer font-sans"
            title={l('Open Kaushal Copilot AI', 'कौशल कोपायलट एआई खोलें')}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{l('Copilot AI', 'कोपायलट')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
