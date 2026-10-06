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
  ArrowLeft
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';
import { DataSourceControl } from '../common/DataSourceControl';
import { getLocalizedEntityName } from '@/lib/i18n';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { 
    language, 
    setLanguage, 
    t, 
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
    isOfflineFixture
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
    if (pathname.includes('/api')) return t.nav.apiExports;
    if (pathname.includes('/settings')) return t.nav.settings;
    return t.nav.overview;
  };

  // Format district name with title case (e.g. "gorakhpur" -> "Gorakhpur") per §4.3
  const rawDistrict = selectedDistrict 
    ? selectedDistrict.charAt(0).toUpperCase() + selectedDistrict.slice(1).replace('_', ' ')
    : 'Gorakhpur';

  const localizedState = getLocalizedEntityName('states', selectedState, language, selectedState);
  const localizedDistrict = getLocalizedEntityName('districts', rawDistrict, language, rawDistrict);

  return (
    <header className="sticky top-0 z-20 px-3 sm:px-6 py-2.5 glass-strong border-b border-[var(--border)] select-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        {/* Breadcrumb Trail with Home Link (§4.3) */}
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-[var(--text-muted)] py-1">
          <Link 
            href="/" 
            className="flex items-center gap-1 text-[var(--brand)] hover:underline font-bold text-xs pr-2 border-r border-[var(--border)] mr-0.5 group"
            title={language === 'hi' ? 'कौशलयुवा मुख्य पृष्ठ' : 'KaushalYuva Home'}
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            <span>{language === 'hi' ? 'मुख्य पृष्ठ' : 'KaushalYuva Home'}</span>
          </Link>
          <span className="font-bold text-[var(--text)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] shrink-0" />
            {language === 'hi' ? 'एमएसडीई इंटेलिजेंस' : 'MSDE Intelligence'}
          </span>
          <span className="text-[var(--text-faint)]">/</span>
          <span>{language === 'hi' ? 'भारत' : 'India'}</span>
          <span className="text-[var(--text-faint)]">/</span>
          <span className="text-[var(--text)] font-semibold">{localizedState}</span>
          <span className="text-[var(--text-faint)]">/</span>
          <span className="font-bold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-md border border-[var(--brand)]/20">
            {localizedDistrict}
          </span>
          <span className="text-[var(--text-faint)]">/</span>
          <span className="text-[var(--text)] font-semibold">{currentPathLabel()}</span>
        </nav>

        {/* Center / Right Control Cluster */}
        <div className="flex items-center flex-wrap gap-2 self-end lg:self-auto">
          {/* Global Search trigger (Ctrl K / Cmd K) (§5.2, §5.3) */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label={language === 'hi' ? 'कमांड पैलेट खोलें' : 'Open command palette'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl liquid-control text-xs text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            title={language === 'hi' ? 'कमांड पैलेट खोलें (Ctrl+K)' : 'Open Command Palette (Ctrl+K or ⌘+K)'}
          >
            <Search className="w-3.5 h-3.5 text-[var(--text-faint)]" />
            <span className="hidden sm:inline">{language === 'hi' ? 'खोजें...' : 'Search...'}</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono text-[var(--text-faint)] bg-[var(--glass)] border border-[var(--border)] rounded">
              ⌘K
            </kbd>
          </button>

          {/* Data Source Segmented Control (§4.3, §5.2) */}
          <DataSourceControl />

          {/* Focus Mode Toggle (§5.9) */}
          <button
            type="button"
            onClick={toggleFocusMode}
            className={`p-1.5 rounded-xl liquid-control cursor-pointer transition-all ${
              focusMode ? 'bg-[var(--brand)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            title={focusMode ? (language === 'hi' ? 'फोकस मोड से बाहर निकलें (Esc)' : 'Exit Focus Mode (Esc)') : (language === 'hi' ? 'फोकस मोड सक्षम करें' : 'Enter Focus Mode (Maximize Workspace)')}
            aria-label={language === 'hi' ? 'फोकस मोड टॉगल करें' : 'Toggle Focus Mode'}
          >
            {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Last Run & Status Dot (§5.2) */}
          <div 
            className="hidden xl:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl glass border border-[var(--border)] text-[var(--text-muted)] font-mono text-[11px]"
            title={language === 'hi' ? 'स्नैपशॉट: RUN-SIH-001 • मॉडल v2.4 • बेसलाइन: सीज़नल नेईव' : 'Snapshot: RUN-SIH-001 • Model v2.4 (Tri-Model Blend) • Baseline: Seasonal Naive'}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            <span>{language === 'hi' ? 'अंतिम रन ' : 'Last run '}<strong>RUN-SIH-001</strong> · {language === 'hi' ? '2 घंटे पूर्व' : '2h ago'}</span>
          </div>

          {/* Offline Fixture Indicator */}
          {isOfflineFixture && (
            <div className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold font-mono" title={language === 'hi' ? 'स्थानीय नियतात्मक डेटा' : 'Serving local deterministic fixture data'}>
              <span>{language === 'hi' ? 'फिक्सचर डेटा' : 'Fixture Data'}</span>
            </div>
          )}

          {/* Theme Selector (Light / Dark / System) (§4.7, §5.2) */}
          <ThemeToggle />

          {/* Bilingual Switcher (EN | हिन्दी) */}
          <div className="glass inline-flex items-center rounded-xl p-0.5 border border-[var(--border)] text-xs font-bold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                language === 'en' 
                  ? 'bg-[var(--surface-solid)] text-[var(--brand)] shadow-xs border border-[var(--border-strong)]' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                language === 'hi' 
                  ? 'bg-[var(--surface-solid)] text-[var(--brand)] shadow-xs border border-[var(--border-strong)]' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="p-1.5 rounded-xl liquid-control relative text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            title={language === 'hi' ? 'प्रारंभिक चेतावनियां और संकेत' : 'Early Warnings & Intelligence Signals'}
            aria-label={language === 'hi' ? 'सूचनाएं' : 'Intelligence Notifications'}
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--severe)] text-white text-[9px] font-mono font-bold flex items-center justify-center border border-[var(--surface-solid)]">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Kaushal Copilot Button */}
          <button
            type="button"
            onClick={() => setCopilotOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--brand)] text-white hover:opacity-90 transition-all font-bold text-xs shadow-xs cursor-pointer"
            title={language === 'hi' ? 'कौशल कोपायलट एआई खोलें' : 'Open Kaushal Copilot AI'}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'कोपायलट' : 'Copilot'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
