'use client';

import React from 'react';
import { Database, Sparkles, Layers, Radio } from 'lucide-react';

export type ProvenanceSource = 
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
  source?: ProvenanceSource;
  type?: ProvenanceSource;
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
  const raw = String(type || source || 'Official SIH').toLowerCase();

  let label = 'Official SIH';
  let Icon = Database;
  let colorClass = 'bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/20';

  if (raw.includes('synth') || raw.includes('demo')) {
    label = 'Synthetic Demo';
    Icon = Sparkles;
    colorClass = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  } else if (raw.includes('aggregate') || raw.includes('public')) {
    label = 'Public Aggregate';
    Icon = Layers;
    colorClass = 'bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] border-[var(--brand-secondary)]/20';
  } else if (raw.includes('future') || raw.includes('feed')) {
    label = 'Future Feed';
    Icon = Radio;
    colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  const displayText = note ? (compact ? note : `${label} • ${note}`) : label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-xs transition-colors ${colorClass} ${className}`}
      title={`Data Provenance: ${label}${note ? ` (${note})` : ''}`}
    >
      <Icon className="w-2.5 h-2.5 shrink-0" />
      <span className="tracking-wide uppercase font-mono text-[9px]">{displayText}</span>
    </span>
  );
}
