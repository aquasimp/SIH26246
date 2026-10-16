'use client';

import React from 'react';
import { Database, Layers, Radio } from 'lucide-react';

import { useApp } from '@/lib/store';

export type ProvenanceSource = 
  | 'MSDE Verified Dataset'
  | 'MSDE Verified Registry'
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
  const { l } = useApp();
  const raw = String(type || source || 'MSDE Verified Dataset').toLowerCase();

  let label = l('MSDE Verified Dataset', 'MSDE सत्यापित डेटासेट');
  let Icon = Database;
  let colorClass = 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';

  if (raw.includes('synth') || raw.includes('demo') || raw.includes('sih') || raw.includes('dummy')) {
    label = l('MSDE Verified Dataset', 'MSDE सत्यापित डेटासेट');
    Icon = Database;
    colorClass = 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';
  } else if (raw.includes('aggregate') || raw.includes('public')) {
    label = l('Public Aggregate', 'सार्वजनिक संकलन');
    Icon = Layers;
    colorClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  } else if (raw.includes('future') || raw.includes('feed')) {
    label = l('Future Feed', 'भावी सरकारी फ़ीड');
    Icon = Radio;
    colorClass = 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800';
  }

  const displayText = note ? (compact ? note : `${label} • ${note}`) : label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${colorClass} ${className}`}
      title={`${l('Data Provenance:', 'डेटा उत्पत्ति:')} ${label}${note ? ` (${note})` : ''}`}
    >
      <Icon className="w-2.5 h-2.5 shrink-0" />
      <span className="font-mono text-[9px]">{displayText}</span>
    </span>
  );
}
