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
    bg: 'bg-slate-500/10 text-[var(--text-muted)] border-slate-500/25',
    DefaultIcon: HelpCircle
  };

  if (v === 'severe') {
    config = {
      bg: 'bg-[#ff6600]/12 text-[#ff6600] dark:text-[#ff7700] border-[#ff6600]/30 shadow-[0_0_8px_rgba(255,102,0,0.15)]',
      DefaultIcon: AlertOctagon
    };
  } else if (v === 'moderate') {
    config = {
      bg: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/30',
      DefaultIcon: AlertTriangle
    };
  } else if (v === 'balanced') {
    config = {
      bg: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      DefaultIcon: CheckCircle2
    };
  } else if (v === 'oversupply') {
    config = {
      bg: 'bg-sky-500/12 text-sky-600 dark:text-sky-400 border-sky-500/30',
      DefaultIcon: TrendingDown
    };
  } else if (v === 'official') {
    config = {
      bg: 'bg-[#00c2cb]/12 text-cyan-600 dark:text-[#00c2cb] border-[#00c2cb]/30 shadow-[0_0_8px_rgba(0,194,203,0.15)]',
      DefaultIcon: Database
    };
  } else if (v === 'synthetic') {
    config = {
      bg: 'bg-purple-500/12 text-purple-600 dark:text-purple-400 border-purple-500/30',
      DefaultIcon: Sparkles
    };
  }

  const IconComp = config.DefaultIcon;
  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 gap-1' 
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-bold font-mono tracking-tight rounded-full border backdrop-blur-xs transition-colors ${sizeClasses} ${config.bg} ${className}`}
    >
      {icon ? icon : <IconComp className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{children}</span>
    </span>
  );
}
