'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: string | number;
    isPositive?: boolean;
    isNeutral?: boolean;
    label: string;
  };
  scope?: string;
  severity?: 'severe' | 'moderate' | 'balanced' | 'oversupply' | 'neutral';
  className?: string;
}

export function KpiCard({
  label,
  value,
  delta,
  scope,
  severity = 'neutral',
  className = ''
}: KpiCardProps) {
  return (
    <div className={`p-4 flex flex-col justify-between h-full min-h-[105px] transition-all duration-200 hover:-translate-y-0.5 ${className}`}>
      {/* Row 1: Category Label */}
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
        {label}
      </div>

      {/* Row 2: Large Tabular Number + Compact Inline Pill Badge strictly on the same row baseline */}
      <div className="flex items-baseline justify-between gap-1.5 my-1.5 min-w-0">
        <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums tracking-tight truncate">
          {value}
        </span>
        {delta && (
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums shrink-0 whitespace-nowrap px-1.5 py-0.5 rounded-full border shadow-2xs ${
              delta.isNeutral
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700'
                : delta.isPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/60'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/60'
            }`}
          >
            {delta.isNeutral ? (
              <Minus className="w-2.5 h-2.5 shrink-0" />
            ) : delta.isPositive ? (
              <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
            ) : (
              <ArrowDownRight className="w-2.5 h-2.5 shrink-0" />
            )}
            <span>{delta.value}</span>
          </span>
        )}
      </div>

      {/* Row 3: 1-line crisp subtitle at the exact same vertical baseline */}
      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
        {scope || delta?.label || ''}
      </div>
    </div>
  );
}
