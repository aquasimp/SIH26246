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
  Bot,
  FileText
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
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
  const { t, alerts, recommendations, setCopilotOpen, focusMode, language } = useApp();

  // Below 1366px viewport width, default to collapsed icon rail
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

  // When Focus Mode is active, hide sidebar for maximum analytical canvas
  if (focusMode) {
    return null;
  }

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length || 35;
  const pendingRecommendations = recommendations.filter(r => r.status === 'pending').length;

  const navGroups: { title: string; items: NavItem[] }[] = [
    {
      title: language === 'hi' ? '// इंटेलिजेंस' : '// INTELLIGENCE',
      items: [
        { href: '/overview', label: t.nav.overview, icon: LayoutDashboard },
        { href: '/intelligence', label: t.nav.intelligence, icon: TrendingUp },
        { href: '/forecasts', label: t.nav.forecasts, icon: LineChart },
        { href: '/gaps', label: t.nav.gaps, icon: GitFork }
      ]
    },
    {
      title: language === 'hi' ? '// कार्रवाई एवं सिमुलेशन' : '// DECISION SUPPORT',
      items: [
        { 
          href: '/alerts', 
          label: t.nav.alerts, 
          icon: AlertTriangle, 
          badge: '35', 
          badgeColor: 'bg-[var(--severe)]/15 text-[var(--severe)] border-[var(--severe)]/35' 
        },
        { 
          href: '/recommendations', 
          label: t.nav.recommendations, 
          icon: Lightbulb, 
          badge: `${pendingRecommendations || 4}`, 
          badgeColor: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' 
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
      title: language === 'hi' ? '// अन्वेषण एवं वर्गीकरण' : '// EXPLORE & TAXONOMY',
      items: [
        { href: '/districts', label: t.nav.districts, icon: MapPin },
        { href: '/occupations', label: t.nav.occupations, icon: Briefcase },
        { href: '/qualifications', label: t.nav.qualifications, icon: Award }
      ]
    },
    {
      title: language === 'hi' ? '// प्रणाली एवं मॉडल' : '// SYSTEM & GOVERNANCE',
      items: [
        { href: '/data-health', label: t.nav.dataHealth, icon: ShieldCheck },
        { href: '/methodology', label: t.nav.methodology || (language === 'hi' ? 'मॉडल कार्यप्रणाली' : 'Methodology'), icon: FileText },
        { href: '/api', label: t.nav.apiExports, icon: DownloadCloud },
        { href: '/settings', label: t.nav.settings, icon: Settings }
      ]
    }
  ];

  return (
    <aside 
      aria-label="Primary Platform Navigation"
      className={`hidden md:flex flex-col shrink-0 transition-all duration-300 z-30 sticky top-0 h-screen py-3 pl-3 select-none ${
        collapsed ? 'w-20' : 'w-[280px]'
      }`}
    >
      <div className="glass-strong rounded-3xl h-full flex flex-col justify-between p-3 relative overflow-hidden border border-[var(--border)] shadow-xl">
        {/* Top Brand & Header */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-[var(--border)]">
            <Link href="/" className="flex items-center gap-2.5 group" title={language === 'hi' ? 'कौशलयुवा होम' : 'KaushalYuva Home'}>
              <BrandLogo size="lg" alt="KaushalYuva Logo" />
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-extrabold tracking-tight text-[var(--text)] leading-tight flex items-center gap-1.5 font-display">
                    {t.appTitle}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c2cb] animate-pulse shrink-0 shadow-[0_0_6px_#00c2cb]" />
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-[var(--text-faint)] uppercase tracking-wider truncate">
                    {t.appSubtitle}
                  </span>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 rounded-xl liquid-control flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#00c2cb]/50 cursor-pointer transition-colors"
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
                  <span className="px-2.5 text-[9px] font-mono font-bold tracking-widest uppercase text-cyan-600/80 dark:text-cyan-400/80 block">
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
                            ? 'bg-cyan-500/10 text-[var(--brand)] shadow-xs border-l-2 border-l-[#00c2cb] font-bold dark:bg-cyan-500/15 dark:text-[#00c2cb]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)] hover:border-l hover:border-l-[var(--border-strong)]'
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-[#00c2cb]' : 'text-[var(--text-faint)]'
                        }`} />
                        
                        {!collapsed && (
                          <span className="truncate flex-1 tracking-tight font-medium">
                            {item.label}
                          </span>
                        )}

                        {!collapsed && item.badge !== undefined && (
                          <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}

                        {!collapsed && item.special && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono font-extrabold uppercase rounded-md bg-gradient-to-r from-cyan-500 to-[#0055a5] text-white shadow-xs">
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

        {/* Bottom Copilot Cockpit Mini Card */}
        <div className="pt-2 border-t border-[var(--border)]">
          {!collapsed ? (
            <div className="p-2.5 rounded-2xl glass border border-[var(--border)] relative overflow-hidden group hover:border-[#00c2cb]/40 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-[#0055a5] to-[#00c2cb] text-white flex items-center justify-center">
                    <Bot className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--text)] font-display">
                    {t.copilot.title}
                  </span>
                </div>
                <span className="text-[9px] font-mono px-1 py-0.2 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold rounded border border-cyan-500/25">
                  {language === 'hi' ? 'सत्यापित AI' : 'Grounded AI'}
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] leading-tight mb-2">
                {language === 'hi' ? 'वर्तमान विश्लेषणात्मक एपीआई पर आधारित द्विभाषी नीति व पूर्वानुमान सहायक।' : 'Bilingual policy & forecast assistant over current API.'}
              </p>
              <button
                type="button"
                onClick={() => setCopilotOpen(true)}
                className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] hover:opacity-90 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer font-sans"
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
