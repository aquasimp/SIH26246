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
  const [collapsed, setCollapsed] = useState(true);
  const { t, alerts, recommendations, focusMode, language, l } = useApp();

  // Above 1366px viewport width, expand sidebar; below 1366px collapse to icon rail
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1366) {
          setCollapsed(false);
        } else {
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
      title: l('Intelligence', 'इंटेलिजेंस'),
      items: [
        { href: '/overview', label: t.nav.overview, icon: LayoutDashboard },
        { href: '/intelligence', label: t.nav.intelligence, icon: TrendingUp },
        { href: '/forecasts', label: t.nav.forecasts, icon: LineChart },
        { href: '/gaps', label: t.nav.gaps, icon: GitFork }
      ]
    },
    {
      title: l('Planning & Action', 'कार्रवाई एवं सिमुलेशन'),
      items: [
        { 
          href: '/alerts', 
          label: t.nav.alerts, 
          icon: AlertTriangle, 
          badge: '35', 
          badgeColor: 'bg-red-50 text-red-600 border-red-200' 
        },
        { 
          href: '/recommendations', 
          label: t.nav.recommendations, 
          icon: Lightbulb, 
          badge: `${pendingRecommendations || 4}`, 
          badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' 
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
      title: l('Taxonomy & Directory', 'अन्वेषण एवं वर्गीकरण'),
      items: [
        { href: '/districts', label: t.nav.districts, icon: MapPin },
        { href: '/occupations', label: t.nav.occupations, icon: Briefcase },
        { href: '/qualifications', label: t.nav.qualifications, icon: Award }
      ]
    },
    {
      title: l('System & Governance', 'प्रणाली एवं मॉडल'),
      items: [
        { href: '/data-health', label: t.nav.dataHealth, icon: ShieldCheck },
        { href: '/methodology', label: t.nav.methodology || l('Methodology', 'मॉडल कार्यप्रणाली'), icon: FileText },
        { href: '/api', label: t.nav.apiExports, icon: DownloadCloud },
        { href: '/settings', label: t.nav.settings, icon: Settings }
      ]
    }
  ];

  return (
    <aside 
      aria-label="Primary Platform Navigation"
      className={`hidden md:flex flex-col shrink-0 transition-all duration-300 z-30 sticky top-0 h-screen select-none ${
        collapsed ? 'w-20' : 'w-[260px] xl:w-[280px]'
      }`}
    >
      <div className="liquid-glass-sidebar h-full flex flex-col p-3 relative overflow-hidden">
        {/* Top Brand & Header */}
        <div className="flex flex-col flex-1 min-h-0 h-full">
          <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <Link href="/" className="flex items-center gap-2.5 group" title={l('KaushalYuva Home', 'कौशलयुवा होम')}>
              <BrandLogo size="lg" alt="KaushalYuva Logo" />
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight flex items-center gap-1.5 font-display">
                    {t.appTitle}
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-slate-400 uppercase tracking-wider truncate">
                    {t.appSubtitle}
                  </span>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-all shadow-2xs hover:scale-105"
              title={collapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="mt-3 overflow-y-auto space-y-3.5 pr-1 flex-1 pb-16 scrollbar-thin">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-0.5">
                {!collapsed && (
                  <span className="px-3 pt-3 pb-1 text-[10.5px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 block font-mono">
                    {group.title}
                  </span>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/overview' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all relative group cursor-pointer border ${
                          isActive
                            ? 'bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 font-semibold border-slate-200/90 dark:border-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_2px_8px_rgba(15,23,42,0.04)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.3)]'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:border-slate-200/60 dark:hover:border-slate-700/60'
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`} />
                        
                        {!collapsed && (
                          <span className="truncate flex-1 tracking-tight">
                            {item.label}
                          </span>
                        )}

                        {!collapsed && item.badge !== undefined && (
                          <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full border shadow-2xs ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}

                        {!collapsed && item.special && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/25">
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
      </div>
    </aside>
  );
};
