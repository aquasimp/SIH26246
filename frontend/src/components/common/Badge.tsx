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
    bg: 'bg-slate-500/10 text-[var(--text-muted)] border-slate-500/20',
    DefaultIcon: HelpCircle
  };

  if (v === 'severe') {
    config = {
      bg: 'bg-[var(--severe)]/12 text-[var(--severe)] border-[var(--severe)]/30',
      DefaultIcon: AlertOctagon
    };
  } else if (v === 'moderate') {
    config = {
      bg: 'bg-[var(--moderate)]/12 text-[var(--moderate)] border-[var(--moderate)]/30',
      DefaultIcon: AlertTriangle
    };
  } else if (v === 'balanced') {
    config = {
      bg: 'bg-[var(--balanced)]/12 text-[var(--balanced)] border-[var(--balanced)]/30',
      DefaultIcon: CheckCircle2
    };
  } else if (v === 'oversupply') {
    config = {
      bg: 'bg-[var(--oversupply)]/12 text-[var(--oversupply)] border-[var(--oversupply)]/30',
      DefaultIcon: TrendingDown
    };
  } else if (v === 'official') {
    config = {
      bg: 'bg-[var(--brand)]/12 text-[var(--brand)] border-[var(--brand)]/30',
      DefaultIcon: Database
    };
  } else if (v === 'synthetic') {
    config = {
      bg: 'bg-purple-500/12 text-purple-400 border-purple-500/30',
      DefaultIcon: Sparkles
    };
  }

  const IconComp = config.DefaultIcon;
  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 gap-1' 
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-bold tracking-tight rounded-full border backdrop-blur-xs transition-colors ${sizeClasses} ${config.bg} ${className}`}
    >
      {icon ? icon : <IconComp className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{children}</span>
    </span>
  );
}
