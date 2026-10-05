'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

const OPTIONS = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' },
  { id: 'system', icon: Monitor, label: 'System' }
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-[98px] rounded-full border border-[var(--border)] opacity-0" aria-hidden />;
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className="glass inline-flex items-center rounded-full p-0.5 border border-[var(--border)]"
    >
      {OPTIONS.map(({ id, icon: Icon, label }) => {
        const isActive = theme === id;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setTheme(id)}
            className={`grid h-7 w-7 place-items-center rounded-full transition-all cursor-pointer ${
              isActive
                ? 'bg-[var(--glass-strong)] text-[var(--brand)] shadow-xs font-bold border border-[var(--border-strong)]'
                : 'text-[var(--text-faint)] hover:text-[var(--text)]'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
