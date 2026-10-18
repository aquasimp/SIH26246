'use client';

import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  accentColor?: 'demand' | 'supply' | 'shortage' | 'oversupply' | 'forecast' | 'warning' | 'neutral';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  onClick,
  accentColor = 'neutral'
}) => {
  const accentBorder = {
    demand: 'border-l-[3px] border-l-[var(--moderate)]',
    supply: 'border-l-[3px] border-l-[var(--surplus)]',
    shortage: 'border-l-[3px] border-l-[var(--severe)]',
    oversupply: 'border-l-[3px] border-l-[var(--oversupply)]',
    forecast: 'border-l-[3px] border-l-[var(--forecast)]',
    warning: 'border-l-[3px] border-l-[var(--warning)]',
    neutral: ''
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl backdrop-saturate-150',
        'border border-slate-200/80 dark:border-slate-800/80 rounded-[var(--radius-xl)] p-5',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_4px_24px_-4px_rgba(15,23,42,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.35)]',
        'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        hoverEffect && [
          'cursor-pointer',
          'hover:-translate-y-0.5 hover:border-sky-500/35 dark:hover:border-sky-400/30',
          'hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_12px_32px_-8px_rgba(2,132,199,0.12)] dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_12px_32px_-8px_rgba(56,189,248,0.15)]'
        ],
        accentBorder,
        className
      )}
    >
      {children}
    </div>
  );
};
