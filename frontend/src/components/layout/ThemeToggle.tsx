'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

const CYCLE_ORDER = ['light', 'dark', 'system'] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8 rounded-md border border-slate-200 dark:border-slate-600 opacity-0" aria-hidden />;
  }

  const currentIndex = CYCLE_ORDER.indexOf((theme as any) || 'system');
  const nextTheme = CYCLE_ORDER[(currentIndex + 1) % CYCLE_ORDER.length];

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const label = theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System';

  return (
    <button
      type="button"
      aria-label={`Theme: ${label}. Click to switch.`}
      title={`Theme: ${label}`}
      onClick={() => setTheme(nextTheme)}
      className="h-[36px] w-[36px] rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors shrink-0"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
