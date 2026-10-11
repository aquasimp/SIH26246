'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { EXPORT_METADATA } from '@/lib/demoData';

export function SystemStatusLine({ className = '' }: { className?: string }) {
  const { language, l } = useApp();

  return (
    <div
      className={`flex items-center flex-wrap gap-2 text-[10px] font-mono text-[var(--text-faint)] py-1.5 px-3 rounded-xl glass border border-[var(--border)] w-fit ${className}`}
    >
      <span className="font-bold text-[var(--brand)]">{EXPORT_METADATA.runId}</span>
      <span>•</span>
      <span>{l(EXPORT_METADATA.dataSource, 'SIH डमी डेटासेट')}</span>
      <span>•</span>
      <span>v2.1.0</span>
      <span>•</span>
      <span>{l('04 Oct 2026 · data through Oct 2024', '04 अक्टूबर 2026 · डेटा अक्टूबर 2024 तक')}</span>
      <span>•</span>
      <span className="inline-flex items-center gap-1 font-semibold text-[var(--brand)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
        {l('Systems Operational', 'प्रणाली सक्रिय')}
      </span>
    </div>
  );
}
