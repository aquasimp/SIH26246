'use client';

import React, { SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface GlassSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const GlassSelect: React.FC<GlassSelectProps> = ({
  label,
  icon,
  className,
  children,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-[0.06em]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <select
          className={clsx(
            'w-full h-[36px] appearance-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-md',
            'border border-slate-200/80 dark:border-slate-800/80 rounded-[var(--radius)] pr-8 text-xs font-semibold',
            'text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--accent)]',
            'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]',
            'transition-all duration-200 cursor-pointer',
            icon ? 'pl-8' : 'pl-2.5',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
