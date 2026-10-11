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
  Bot,
  Radio,
  ExternalLink,
  ChevronRight,
  Sparkles
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
    setLanguage, 
    t, 
    alerts, 
    recommendations,
    setCopilotOpen,
    selectedDistrict,
    selectedState, l} = useApp();

  const isHi = language === 'hi';

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
      title: l('// INTELLIGENCE', '// इंटेलिजेंस'),
      items: [
        { href: '/overview', label: t.nav.overview, icon: LayoutDashboard },
        { href: '/intelligence', label: t.nav.intelligence, icon: TrendingUp },
        { href: '/forecasts', label: t.nav.forecasts, icon: LineChart },
        { href: '/gaps', label: t.nav.gaps, icon: GitFork }
      ]
    },
    {
      title: l('// DECISION SUPPORT', '// निर्णय एवं सिमुलेशन'),
      items: [
        { 
          href: '/alerts', 
          label: t.nav.alerts, 
          icon: AlertTriangle, 
          badge: `${unreadAlerts}`, 
          badgeColor: 'bg-[var(--severe)]/20 text-[var(--severe)] border-[var(--severe)]/40' 
        },
        { 
          href: '/recommendations', 
          label: t.nav.recommendations, 
          icon: Lightbulb, 
          badge: `${pendingRecommendations}`, 
          badgeColor: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/40' 
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
      title: l('// EXPLORE & TAXONOMY', '// अन्वेषण एवं वर्गीकरण'),
      items: [
        { href: '/districts', label: t.nav.districts, icon: MapPin },
        { href: '/occupations', label: t.nav.occupations, icon: Briefcase },
        { href: '/qualifications', label: t.nav.qualifications, icon: Award }
      ]
    },
    {
      title: l('// SYSTEM & GOVERNANCE', '// प्रणाली एवं मॉडल'),
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
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container */}
      <div className="relative w-[85%] max-w-sm h-full bg-[var(--surface-solid)] text-[var(--text)] border-r border-[var(--border)] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250 ease-out">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-muted)]/50">
          <Link 
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <BrandLogo size="md" alt="KaushalYuva Logo" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-extrabold tracking-tight text-[var(--text)] font-display flex items-center gap-1.5 leading-tight">
                {isHi ? siteConfig.nameHi : siteConfig.name}
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c2cb] animate-pulse" />
              </span>
              <span className="text-[9px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider truncate">
                MSDE · SIH 26246
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="w-8 h-8 rounded-xl liquid-control flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            aria-label={l('Close navigation menu', 'मेनू बंद करें')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tactical Location Pill */}
        <div className="px-4 py-2.5 bg-[var(--surface-solid)] border-b border-[var(--border)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <MapPin className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
            <span className="font-semibold truncate max-w-[170px]">
              {localizedDistrict}, {localizedState}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00c2cb]/10 text-cyan-600 dark:text-cyan-400 font-bold border border-[#00c2cb]/30">
            LGD Active
          </span>
        </div>

        {/* Scrollable Nav Item List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 overscroll-contain">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-2 text-[10px] font-mono font-bold tracking-wider text-[var(--text-faint)] uppercase">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                        isActive
                          ? 'bg-[var(--brand)] text-white shadow-sm font-bold'
                          : 'text-[var(--text)] hover:bg-[var(--surface-muted)]'
                      } ${item.special && !isActive ? 'border border-amber-500/30 bg-amber-500/5' : ''}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${
                          isActive 
                            ? 'text-white' 
                            : item.special 
                              ? 'text-amber-500' 
                              : 'text-[var(--text-muted)]'
                        }`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          isActive 
                            ? 'bg-white/20 text-white border-white/30' 
                            : item.badgeColor || 'bg-[var(--surface-muted)] text-[var(--text-muted)] border-[var(--border)]'
                        }`}>
                          {item.badge}
                        </span>
                      ) : item.special && !isActive ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500 text-white">
                          SIM
                        </span>
                      ) : (
                        <ChevronRight className={`w-3.5 h-3.5 opacity-40 ${isActive ? 'text-white opacity-80' : ''}`} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions: Copilot, Language, Theme */}
        <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-muted)]/50 space-y-2.5">
          {/* Kaushal Copilot Button */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setCopilotOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0055a5] to-[#00c2cb] text-white font-bold text-xs shadow-md shadow-[#00c2cb]/20 cursor-pointer min-h-[44px]"
          >
            <Bot className="w-4 h-4" />
            <span>{l('Open Kaushal Copilot AI', 'कौशल कोपायलट AI खोलें')}</span>
          </button>

          {/* Language Selection Grid (7 Languages) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-[var(--text-faint)] uppercase px-1">
              <span>// LANGUAGE · भाषा</span>
              <ThemeToggle />
            </div>
            <LanguageSelector variant="pills" />
          </div>
        </div>
      </div>
    </div>
  );
};
