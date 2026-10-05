'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  special?: boolean;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { t, alerts, recommendations, setCopilotOpen, focusMode } = useApp();

  // Below 1366px viewport width, default to collapsed icon rail (§5.1)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 1366) {
          setCollapsed(true);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When Focus Mode is active, hide sidebar for maximum analytical canvas (§5.9)
  if (focusMode) {
    return null;
  }

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length || 35;
  const pendingRecommendations = recommendations.filter(r => r.status === 'pending').length;

  const navGroups: { title: string; items: NavItem[] }[] = [
    {
      title: 'INTELLIGENCE',
      items: [
        { href: '/overview', label: t.nav.overview, icon: LayoutDashboard },
        { href: '/intelligence', label: t.nav.intelligence, icon: TrendingUp },
        { href: '/forecasts', label: t.nav.forecasts, icon: LineChart },
        { href: '/gaps', label: t.nav.gaps, icon: GitFork }
      ]
    },
    {
      title: 'ACTION',
      items: [
        { 
          href: '/alerts', 
          label: t.nav.alerts, 
          icon: AlertTriangle, 
          badge: '35', 
          badgeColor: 'bg-[var(--severe)]/15 text-[var(--severe)] border-[var(--severe)]/30' 
        },
        { 
          href: '/recommendations', 
          label: t.nav.recommendations, 
          icon: Lightbulb, 
          badge: `${pendingRecommendations || 4}`, 
          badgeColor: 'bg-[var(--brand)]/15 text-[var(--brand)] border-[var(--brand)]/30' 
        },
        { 
          href: '/scenarios', 
          label: t.nav.scenarios, 
          icon: Sliders, 
          special: true 
        }
      ]
    },
    {
      title: 'EXPLORE',
      items: [
        { href: '/districts', label: t.nav.districts, icon: MapPin },
        { href: '/occupations', label: t.nav.occupations, icon: Briefcase },
        { href: '/qualifications', label: t.nav.qualifications, icon: Award }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { href: '/data-health', label: t.nav.dataHealth, icon: ShieldCheck },
        { href: '/api', label: t.nav.apiExports, icon: DownloadCloud },
        { href: '/settings', label: t.nav.settings, icon: Settings }
      ]
    }
  ];

  return (
    <aside 
      aria-label="Primary Platform Navigation"
      className={`hidden md:flex flex-col shrink-0 transition-all duration-300 z-30 sticky top-0 h-screen py-3 pl-3 select-none ${
        collapsed ? 'w-20' : 'w-[275px]'
      }`}
    >
      <div className="glass-strong rounded-3xl h-full flex flex-col justify-between p-3 relative overflow-hidden border border-[var(--border)] shadow-xl">
        {/* Top Brand & Header */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-[var(--border)]">
            <Link href="/overview" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--brand)] to-blue-600 flex items-center justify-center text-white shadow-md shadow-[var(--brand)]/20 shrink-0 group-hover:scale-105 transition-transform font-mono font-extrabold text-sm tracking-wider">
                KP
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold tracking-tight text-[var(--text)] leading-tight flex items-center gap-1.5">
                    {t.appTitle}
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse shrink-0" />
                  </span>
                  <span className="text-[9px] font-semibold text-[var(--text-faint)] uppercase tracking-wider truncate">
                    {t.appSubtitle}
                  </span>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 rounded-xl liquid-control flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              title={collapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="mt-3 overflow-y-auto space-y-3.5 pr-1 flex-1">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                {!collapsed && (
                  <span className="px-2.5 text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--text-faint)] block">
                    {group.title}
                  </span>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/overview' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all relative group cursor-pointer ${
                          isActive
                            ? 'bg-[var(--glass-strong)] text-[var(--text)] shadow-xs border-l-2 border-l-[var(--brand)] font-bold'
                            : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-[var(--brand)]' : 'text-[var(--text-faint)]'
                        }`} />
                        
                        {!collapsed && (
                          <span className="truncate flex-1 tracking-tight">
                            {item.label}
                          </span>
                        )}

                        {!collapsed && item.badge !== undefined && (
                          <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}

                        {!collapsed && item.special && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono font-extrabold uppercase rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                            STUDIO
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Copilot Mini Card */}
        <div className="pt-2 border-t border-[var(--border)]">
          {!collapsed ? (
            <div className="p-2.5 rounded-2xl glass border border-[var(--border)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-[var(--brand)] text-white flex items-center justify-center">
                    <Bot className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--text)]">
                    {t.copilot.title}
                  </span>
                </div>
                <span className="text-[9px] font-mono px-1 py-0.2 bg-[var(--brand)]/15 text-[var(--brand)] font-bold rounded border border-[var(--brand)]/20">
                  Grounded
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] leading-tight mb-2">
                Bilingual policy & forecast assistant over current API.
              </p>
              <button
                type="button"
                onClick={() => setCopilotOpen(true)}
                className="w-full py-1.5 px-2 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{t.actions.askCopilot}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCopilotOpen(true)}
              className="w-full py-2.5 rounded-xl liquid-control flex items-center justify-center text-[var(--brand)] hover:text-white hover:bg-[var(--brand)] transition-all cursor-pointer"
              title="Open Kaushal Copilot"
              aria-label="Open Kaushal Copilot"
            >
              <Bot className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
