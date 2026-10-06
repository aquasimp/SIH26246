'use client';

import React from 'react';
import { Database, Sparkles, Layers, Radio } from 'lucide-react';

import { useApp } from '@/lib/store';

export type ProvenanceSource = 
  | 'SIH dummy dataset'
  | 'Official SIH' 
  | 'Synthetic Demo' 
  | 'Public Aggregate' 
  | 'Future Feed'
  | 'sih'
  | 'official'
  | 'synthetic'
  | 'aggregate'
  | 'public'
  | 'future';

export interface ProvenanceProps {
  source?: ProvenanceSource | string;
  type?: ProvenanceSource | string;
  note?: string;
  compact?: boolean;
  className?: string;
}

export function Provenance({ 
  source, 
  type, 
  note, 
  compact = false, 
  className = '' 
}: ProvenanceProps) {
  const { language } = useApp();
  const isHi = language === 'hi';
  const raw = String(type || source || 'SIH dummy dataset').toLowerCase();

  let label = isHi ? 'SIH डमी डेटासेट' : 'SIH dummy dataset';
  let Icon = Database;
  let colorClass = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25';

  if (raw.includes('synth') || raw.includes('demo')) {
    label = isHi ? 'SIH डमी डेटासेट' : 'SIH dummy dataset';
    Icon = Database;
    colorClass = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25';
  } else if (raw.includes('aggregate') || raw.includes('public')) {
    label = isHi ? 'सार्वजनिक संकलन' : 'Public Aggregate';
    Icon = Layers;
    colorClass = 'bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] border-[var(--brand-secondary)]/20';
  } else if (raw.includes('future') || raw.includes('feed')) {
    label = isHi ? 'भावी सरकारी फ़ीड' : 'Future Feed';
    Icon = Radio;
    colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }

  const displayText = note ? (compact ? note : `${label} • ${note}`) : label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-xs transition-colors ${colorClass} ${className}`}
      title={`${isHi ? 'डेटा उत्पत्ति:' : 'Data Provenance:'} ${label}${note ? ` (${note})` : ''}`}
    >
      <Icon className="w-2.5 h-2.5 shrink-0" />
      <span className="tracking-wide font-mono text-[9px]">{displayText}</span>
    </span>
  );
}
