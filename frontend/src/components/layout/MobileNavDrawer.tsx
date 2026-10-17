'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X,
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
  FileText,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { siteConfig } from '@/lib/site.config';
import { getLocalizedEntityName } from '@/lib/i18n';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  special?: boolean;
}

export const MobileNavDrawer: React.FC = () => {
  const pathname = usePathname();
  const { 
    mobileMenuOpen, 
    setMobileMenuOpen, 
    language, 
    t, 
    alerts, 
    recommendations,
    setCopilotOpen,
    selectedDistrict,
    selectedState, 
    l 
  } = useApp();

  // Close drawer on Escape key and prevent background scroll when open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen, setMobileMenuOpen]);

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  if (!mobileMenuOpen) return null;

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length || 35;
  const pendingRecommendations = recommendations.filter(r => r.status === 'pending').length || 4;

  const rawDistrict = selectedDistrict 
    ? selectedDistrict.charAt(0).toUpperCase() + selectedDistrict.slice(1).replace('_', ' ')
    : 'Gorakhpur';

  const localizedState = getLocalizedEntityName('states', selectedState, language, selectedState);
  const localizedDistrict = getLocalizedEntityName('districts', rawDistrict, language, rawDistrict);

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
          badge: `${unreadAlerts}`, 
          badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' 
        },
        { 
          href: '/recommendations', 
          label: t.nav.recommendations, 
          icon: Lightbulb, 
          badge: `${pendingRecommendations}`, 
          badgeColor: 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800' 
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
        { href: '/methodology', label: l('Methodology', 'मॉडल कार्यप्रणाली'), icon: FileText },
        { href: '/api', label: t.nav.apiExports, icon: DownloadCloud },
        { href: '/settings', label: t.nav.settings, icon: Settings }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity animate-in fade-in duration-200"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container */}
      <div className="relative w-[85%] max-w-sm h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 shadow-xl flex flex-col z-10 animate-in slide-in-from-left duration-200 ease-out">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <Link 
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <BrandLogo size="md" alt="KaushalYuva Logo" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                {t.appTitle || siteConfig.name}
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider truncate">
                MSDE · SIH 26246
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
            aria-label={l('Close navigation menu', 'मेनू बंद करें')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tactical Location Pill */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="font-medium truncate max-w-[170px]">
              {localizedDistrict}, {localizedState}
            </span>
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Active
          </span>
        </div>

        {/* Scrollable Nav Item List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 overscroll-contain">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-2.5 pt-2 text-[10.5px] font-bold font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all min-h-[42px] border ${
                        isActive
                          ? 'bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 font-semibold border-slate-200/90 dark:border-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_2px_8px_rgba(15,23,42,0.04)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.3)]'
                          : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive 
                            ? 'text-sky-600 dark:text-sky-400' 
                            : 'text-slate-400'
                        }`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${
                          item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {item.badge}
                        </span>
                      ) : item.special ? (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/25">
                          STUDIO
                        </span>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions: Copilot, Language, Theme */}
        <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-md space-y-2.5">
          {/* Ask Assistant Button */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setCopilotOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full btn-liquid-primary font-semibold text-xs transition-all cursor-pointer min-h-[40px] shadow-xs active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>{l('Ask Assistant', 'सहायक से पूछें')}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[9px] font-mono font-bold border border-sky-500/20">AI</span>
          </button>

          {/* Language Selection Grid */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              <span>{l('Languages', 'भाषाएं')}</span>
              <ThemeToggle />
            </div>
            <LanguageSelector variant="pills" />
          </div>
        </div>
      </div>
    </div>
  );
};
