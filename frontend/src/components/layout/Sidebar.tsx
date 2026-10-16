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
        collapsed ? 'w-20' : 'w-20 xl:w-[280px]'
      }`}
    >
      <div className="bg-white dark:bg-slate-900 h-full flex flex-col justify-between p-3 relative overflow-hidden border-r border-slate-200 dark:border-slate-700">
        {/* Top Brand & Header */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-slate-200 dark:border-slate-700">
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
              className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors"
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
                  <span className="px-3 pt-4 pb-1 text-[11px] font-semibold tracking-wider uppercase text-slate-400 block">
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
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all relative group cursor-pointer ${
                          isActive
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold border-l-[3px] border-l-slate-900 dark:border-l-slate-100'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'
                        }`} />
                        
                        {!collapsed && (
                          <span className="truncate flex-1 tracking-tight">
                            {item.label}
                          </span>
                        )}

                        {!collapsed && item.badge !== undefined && (
                          <span className={`px-1.5 py-0.5 text-[11px] font-medium rounded border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}

                        {!collapsed && item.special && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
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
