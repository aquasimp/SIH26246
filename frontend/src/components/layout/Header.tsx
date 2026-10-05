'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Globe, 
  RefreshCw, 
  Shield, 
  UserCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { DATA_HEALTH_METRIC } from '@/lib/demoData';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { 
    language, 
    setLanguage, 
    t, 
    selectedState, 
    selectedDistrict, 
    datasetMode,
    setDatasetMode,
    notificationOpen, 
    setNotificationOpen,
    alerts,
    setCopilotOpen,
    searchQuery,
    setSearchQuery,
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

  return (
    <header className="sticky top-0 z-20 px-4 sm:px-8 py-3.5 backdrop-blur-md bg-slate-50/70 border-b border-slate-200/60">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 overflow-x-auto whitespace-nowrap py-1">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            MSDE Intelligence
          </span>
          <span>/</span>
          <span>India</span>
          <span>/</span>
          <span className="text-slate-700 font-semibold">{selectedState}</span>
          <span>/</span>
          <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/60">
            {selectedDistrict ? selectedDistrict.toUpperCase() : 'ALL DISTRICTS'}
          </span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{currentPathLabel()}</span>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 self-end lg:self-auto">
          {/* Quick Search */}
          <div className="relative hidden xl:block w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search occupation / district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Offline Fixture Badge (Honesty Label) */}
          {isOfflineFixture && (
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl bg-amber-100/90 text-amber-900 border border-amber-300 font-bold shadow-xs animate-in fade-in" title="Analytical backend offline; serving local deterministic fixture data">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Offline fixture data</span>
            </div>
          )}

          {/* Data Freshness Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl liquid-control text-slate-600 border border-white/80">
            <RefreshCw className="w-3 h-3 text-emerald-600" />
            <span>Refreshed <strong>2h ago</strong></span>
            <span className="text-slate-300">|</span>
            <span className="font-mono text-[10px] text-slate-500">
              {datasetMode === 'sih' ? 'RUN-SIH-001' : DATA_HEALTH_METRIC.lastRunId}
            </span>
          </div>

          {/* Dataset Mode Switcher: [ SIH Dataset ] / [ Demo Dataset ] */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-200/60 border border-slate-300/60 text-xs font-semibold">
            <button
              onClick={() => setDatasetMode('sih')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                datasetMode === 'sih'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Official SIH Evaluation Dataset (Primary)"
            >
              <Shield className="w-3 h-3 text-amber-300" />
              <span>SIH Mode</span>
            </button>
            <button
              onClick={() => setDatasetMode('synthetic')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                datasetMode === 'synthetic'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Synthetic Benchmark Dataset (Demo Fallback)"
            >
              <span>Demo Mode</span>
            </button>
          </div>

          {/* Bilingual Switcher (EN | हिन्दी) */}
          <div className="flex items-center p-0.5 rounded-xl liquid-control border border-slate-200/60">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                language === 'en' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                language === 'hi' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Copilot Quick Launch Button */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          {/* Notification Alert Bell */}
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-xl liquid-control text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="System alerts & notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Planner Identity */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
              MS
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-none flex items-center gap-1">
                MSDE Planner
                <CheckCircle2 className="w-3 h-3 text-blue-600 inline" />
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Govt. of India</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
