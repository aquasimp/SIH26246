'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  TrendingUp, 
  LineChart, 
  GitFork, 
  AlertTriangle, 
  Lightbulb, 
  Sliders, 
  MapPin, 
  Briefcase, 
  Award, 
  ShieldCheck, 
  DownloadCloud, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Bot
} from 'lucide-react';
import { useApp } from '@/lib/store';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { t, alerts, recommendations, setCopilotOpen } = useApp();

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;
  const pendingRecommendations = recommendations.filter(r => r.status === 'pending').length;

  const navItems = [
    { href: '/overview', label: t.nav.overview, icon: LayoutDashboard },
    { href: '/intelligence', label: t.nav.intelligence, icon: TrendingUp },
    { href: '/forecasts', label: t.nav.forecasts, icon: LineChart },
    { href: '/gaps', label: t.nav.gaps, icon: GitFork },
    { href: '/alerts', label: t.nav.alerts, icon: AlertTriangle, badge: unacknowledgedAlerts, badgeColor: 'bg-red-500 text-white' },
    { href: '/recommendations', label: t.nav.recommendations, icon: Lightbulb, badge: pendingRecommendations, badgeColor: 'bg-amber-500 text-white' },
    { href: '/scenarios', label: t.nav.scenarios, icon: Sliders, special: true },
    { href: '/districts', label: t.nav.districts, icon: MapPin },
    { href: '/occupations', label: t.nav.occupations, icon: Briefcase },
    { href: '/qualifications', label: t.nav.qualifications, icon: Award },
    { href: '/data-health', label: t.nav.dataHealth, icon: ShieldCheck },
    { href: '/api', label: t.nav.apiExports, icon: DownloadCloud },
    { href: '/settings', label: t.nav.settings, icon: Settings }
  ];

  return (
    <aside 
      className={clsx(
        'hidden md:flex flex-col shrink-0 transition-all duration-300 z-30 sticky top-0 h-screen py-4 pl-4 select-none',
        collapsed ? 'w-20' : 'w-68'
      )}
    >
      <div className="glass-panel rounded-3xl h-full flex flex-col justify-between p-3.5 relative overflow-hidden border border-white/80 shadow-xl shadow-slate-200/50">
        {/* Top Brand Logo */}
        <div>
          <div className="flex items-center justify-between px-2 pt-2 pb-4 border-b border-slate-200/60">
            <Link href="/overview" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-600/30 shrink-0 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-lg tracking-wider">KP</span>
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-slate-900 leading-none flex items-center gap-1.5">
                    {t.appTitle}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">
                    {t.appSubtitle}
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 rounded-xl liquid-control flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/overview' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all relative group',
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/25 backdrop-blur-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={clsx('w-4 h-4 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-slate-500')} />
                  
                  {!collapsed && (
                    <span className="truncate flex-1 tracking-tight">
                      {item.label}
                    </span>
                  )}

                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className={clsx('px-1.5 py-0.5 text-[10px] font-bold rounded-full', item.badgeColor)}>
                      {item.badge}
                    </span>
                  )}

                  {!collapsed && item.special && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                      STUDIO
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Copilot Card */}
        <div className="pt-2">
          {!collapsed ? (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-blue-50/60 to-white border border-blue-200/50 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight">
                  {t.copilot.title}
                </span>
                <span className="text-[9px] px-1 py-0.2 bg-blue-100 text-blue-700 font-bold rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight mb-2.5">
                Bilingual policy & forecast decision assistant.
              </p>
              <button
                onClick={() => setCopilotOpen(true)}
                className="w-full py-1.5 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {t.actions.askCopilot}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCopilotOpen(true)}
              className="w-full py-3 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-all cursor-pointer"
              title={t.copilot.title}
            >
              <Bot className="w-5 h-5" />
            </button>
          )}

          <div className="mt-2 text-center text-[10px] text-slate-400 font-medium">
            {!collapsed ? 'MSDE Government of India' : 'MSDE'}
          </div>
        </div>
      </div>
    </aside>
  );
};
