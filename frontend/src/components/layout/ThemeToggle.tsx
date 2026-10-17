'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

const OPTIONS = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' },
  { id: 'system', icon: Monitor, label: 'System' }
] as const;

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return <div className="h-[36px] w-[98px] rounded-full border border-slate-200 dark:border-slate-700 opacity-0" aria-hidden />;
  }

  const activeTheme = theme || 'system';

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className="inline-flex items-center rounded-full p-0.5 border border-slate-200/80 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-800/80 h-[36px] shrink-0"
    >
      {OPTIONS.map(({ id, icon: Icon, label }) => {
        const isActive = activeTheme === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setTheme(id)}
            className={`grid h-7 w-7 place-items-center rounded-full transition-all cursor-pointer shrink-0 ${
              isActive
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs font-bold border border-slate-200 dark:border-slate-600'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
