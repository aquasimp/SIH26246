'use client';

import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  HelpCircle,
  Database,
  Sparkles
} from 'lucide-react';

export type BadgeVariant = 
  | 'severe' 
  | 'moderate' 
  | 'balanced' 
  | 'oversupply' 
  | 'neutral' 
  | 'official' 
  | 'synthetic'
  | 'warning'
  | 'success';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ 
  variant = 'neutral', 
  children, 
  icon, 
  size = 'md',
  className = '' 
}: BadgeProps) {
  let v = variant;
  if (v === 'warning') v = 'moderate';
  if (v === 'success') v = 'balanced';

  let config = {
    bg: 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    DefaultIcon: HelpCircle
  };

  if (v === 'severe') {
    config = {
      bg: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      DefaultIcon: AlertOctagon
    };
  } else if (v === 'moderate') {
    config = {
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      DefaultIcon: AlertTriangle
    };
  } else if (v === 'balanced') {
    config = {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      DefaultIcon: CheckCircle2
    };
  } else if (v === 'oversupply') {
    config = {
      bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
      DefaultIcon: TrendingDown
    };
  } else if (v === 'official') {
    config = {
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      DefaultIcon: Database
    };
  } else if (v === 'synthetic') {
    config = {
      bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      DefaultIcon: Sparkles
    };
  }

  const IconComp = config.DefaultIcon;
  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-1.5 py-0.5 gap-1' 
    : 'text-[11px] px-2 py-0.5 gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center font-medium rounded border transition-colors ${sizeClasses} ${config.bg} ${className}`}
    >
      {icon ? icon : <IconComp className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{children}</span>
    </span>
  );
}
