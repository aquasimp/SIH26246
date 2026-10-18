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

const SEVERITY_COLORS: Record<string, string> = {
  severe: 'var(--severe, #DC2626)',
  moderate: 'var(--moderate, #D97706)',
  balanced: 'var(--balanced, #059669)',
  oversupply: 'var(--oversupply, #4338CA)',
  neutral: 'transparent',
};

export function KpiCard({
  label,
  value,
  delta,
  scope,
  severity = 'neutral',
  className = ''
}: KpiCardProps) {
  const topRuleColor = SEVERITY_COLORS[severity] || 'transparent';

  return (
    <div className={`relative p-4 sm:p-5 flex flex-col justify-between h-full min-h-[110px] rounded-[var(--radius-lg)] transition-all duration-200 hover:-translate-y-0.5 overflow-hidden ${className}`}>
      {/* 2px top severity rule */}
      {severity && severity !== 'neutral' && (
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]" 
          style={{ backgroundColor: topRuleColor }} 
          aria-hidden="true"
        />
      )}

      {/* Row 1: Category Label */}
      <div className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--text-faint)] line-clamp-2">
        {label}
      </div>

      {/* Row 2: Large Tabular Number + Compact Inline Pill Badge strictly on the same row baseline */}
      <div className="flex items-baseline justify-between gap-2 my-1.5 min-w-0">
        <span className="font-display font-semibold text-[clamp(1.75rem,2.4vw,2.125rem)] text-[var(--brand-ink)] tabular-nums tracking-tight truncate leading-none">
          {value}
        </span>
        {delta && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums shrink-0 whitespace-nowrap px-2 py-0.5 rounded-full border shadow-2xs ${
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
      <div className="text-xs text-[var(--text-muted)] truncate">
        {scope || delta?.label || ''}
      </div>
    </div>
  );
}
