'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Activity } from 'lucide-react';

export function SystemStatusLine({ className = '' }: { className?: string }) {
  const { datasetMode } = useApp();

  return (
    <div
      className={`flex items-center flex-wrap gap-2 text-[10px] font-mono text-[var(--text-faint)] py-1.5 px-3 rounded-xl glass border border-[var(--border)] w-fit ${className}`}
    >
      <span className="font-bold text-[var(--brand)]">RUN-SIH-001</span>
      <span>•</span>
      <span className="uppercase">{datasetMode === 'sih' ? 'SIH Dataset Snapshot' : 'Demo Dataset'}</span>
      <span>•</span>
      <span>Model v2.4 (Tri-Blend)</span>
      <span>•</span>
      <span>Last run: 2h ago</span>
      <span>•</span>
      <span className="inline-flex items-center gap-1 font-semibold text-[var(--success)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
        Systems Operational
      </span>
    </div>
  );
}
