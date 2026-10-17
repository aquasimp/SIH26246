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
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4 group focus:outline-none"
                aria-label={item.label}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-md shadow-sky-500/25 border ${
                  item.isActive
                    ? 'bg-linear-to-tr from-sky-600 to-indigo-600 text-white border-sky-400/50 scale-105'
                    : 'bg-linear-to-tr from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white border-slate-700 hover:scale-105'
                }`}>
                  <Icon className="w-5 h-5 text-sky-300" />
                </div>
                <span className={`text-[10px] font-semibold mt-1 tracking-tight ${
                  item.isActive ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500'
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
                  ? 'text-sky-600 dark:text-sky-400 font-semibold' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${
                  item.isActive ? 'text-sky-600 dark:text-sky-400 scale-105' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-amber-500 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-0.5 truncate tracking-tight ${
                item.isActive ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
              {item.isActive && (
                <span className="w-1 h-1 rounded-full bg-sky-600 dark:bg-sky-400 mt-0.5" />
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
