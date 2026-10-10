'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GitFork, 
  Sliders, 
  AlertTriangle, 
  Menu
} from 'lucide-react';
import { useApp } from '@/lib/store';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen, language, t, alerts } = useApp();
  const isHi = language === 'hi';

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length || 35;

  const navItems = [
    {
      href: '/overview',
      label: isHi ? 'सिंहावलोकन' : 'Overview',
      icon: LayoutDashboard,
      isActive: pathname === '/overview' || pathname === '/',
    },
    {
      href: '/gaps',
      label: isHi ? 'अंतराल' : 'Gaps',
      icon: GitFork,
      isActive: pathname === '/gaps',
    },
    {
      href: '/scenarios',
      label: isHi ? 'सिमुलेशन' : 'Simulate',
      icon: Sliders,
      isActive: pathname.startsWith('/scenarios'),
      isCenter: true,
    },
    {
      href: '/alerts',
      label: isHi ? 'अलर्ट्स' : 'Alerts',
      icon: AlertTriangle,
      badge: unreadAlerts,
      isActive: pathname === '/alerts',
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-30 md:hidden glass-strong border-t border-[var(--border)] backdrop-blur-2xl px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4 group focus:outline-hidden"
                aria-label={item.label}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  item.isActive
                    ? 'bg-gradient-to-tr from-[#0055a5] to-[#00c2cb] text-white shadow-[#00c2cb]/35 border border-white/30 ring-2 ring-[#00c2cb]/50'
                    : 'bg-gradient-to-tr from-[#0055a5] to-[#008b94] text-white shadow-[#0055a5]/30 border border-white/20 hover:scale-105'
                }`}>
                  <Icon className="w-5 h-5 text-amber-300" />
                </div>
                <span className={`text-[10px] font-bold mt-1 font-sans ${
                  item.isActive ? 'text-[#0055a5] dark:text-[#00c2cb]' : 'text-[var(--text-muted)]'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 min-h-[44px] min-w-[56px] relative group ${
                item.isActive 
                  ? 'text-[var(--brand)] font-bold' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform group-hover:-translate-y-0.5 ${
                  item.isActive ? 'text-[var(--brand)]' : 'text-[var(--text-muted)]'
                }`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] rounded-full bg-[var(--severe)] text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-[0_0_6px_#ff6600]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 font-sans truncate ${
                item.isActive ? 'text-[var(--brand)]' : 'text-[var(--text-faint)]'
              }`}>
                {item.label}
              </span>
              {item.isActive && (
                <span className="w-1 h-1 rounded-full bg-[var(--brand)] mt-0.5" />
              )}
            </Link>
          );
        })}

        {/* 5th Button: Menu Drawer Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 min-h-[44px] min-w-[56px] cursor-pointer ${
            mobileMenuOpen 
              ? 'text-[var(--brand)] font-bold' 
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
          aria-label={isHi ? 'सभी मेनू खोलें' : 'Open all navigation menus'}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5 font-sans truncate text-[var(--text-faint)]">
            {isHi ? 'मेनू' : 'Menu'}
          </span>
        </button>
      </div>
    </nav>
  );
};
