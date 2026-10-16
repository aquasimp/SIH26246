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
  const { setMobileMenuOpen, alerts, l } = useApp();

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length || 35;

  const navItems = [
    {
      href: '/overview',
      label: l('Overview', 'सिंहावलोकन'),
      icon: LayoutDashboard,
      isActive: pathname === '/overview' || pathname === '/',
    },
    {
      href: '/gaps',
      label: l('Gaps', 'अंतराल'),
      icon: GitFork,
      isActive: pathname === '/gaps',
    },
    {
      href: '/scenarios',
      label: l('Simulate', 'सिमुलेशन'),
      icon: Sliders,
      isActive: pathname.startsWith('/scenarios'),
      isCenter: true,
    },
    {
      href: '/alerts',
      label: l('Alerts', 'अलर्ट्स'),
      icon: AlertTriangle,
      badge: unreadAlerts,
      isActive: pathname === '/alerts',
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 shadow-sm"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-3.5 group focus:outline-none"
                aria-label={item.label}
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shadow-xs transition-transform active:scale-95 ${
                  item.isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 ring-2 ring-slate-400'
                    : 'bg-slate-800 text-white hover:bg-slate-900'
                }`}>
                  <Icon className="w-5 h-5 text-amber-300" />
                </div>
                <span className={`text-[10px] font-medium mt-1 ${
                  item.isActive ? 'text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500'
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
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-md transition-colors active:scale-95 min-h-[44px] min-w-[56px] relative group ${
                item.isActive 
                  ? 'text-slate-900 dark:text-slate-100 font-semibold' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${
                  item.isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'
                }`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-[14px] rounded bg-amber-600 text-white text-[9px] font-mono font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-0.5 truncate ${
                item.isActive ? 'text-slate-900 dark:text-slate-100 font-semibold' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
              {item.isActive && (
                <span className="w-1 h-1 rounded-full bg-slate-900 dark:bg-slate-100 mt-0.5" />
              )}
            </Link>
          );
        })}

        {/* 5th Button: Menu Drawer Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-md transition-colors active:scale-95 min-h-[44px] min-w-[56px] cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          aria-label={l('Open all navigation menus', 'सभी मेनू खोलें')}
        >
          <Menu className="w-5 h-5 text-slate-400" />
          <span className="text-[10px] font-medium mt-0.5 truncate text-slate-500">
            {l('Menu', 'मेनू')}
          </span>
        </button>
      </div>
    </nav>
  );
};
