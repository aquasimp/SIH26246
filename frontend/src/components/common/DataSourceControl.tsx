'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Info, Database, Sparkles } from 'lucide-react';

export function DataSourceControl() {
  const { datasetMode, setDatasetMode } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
        DATA SOURCE:
      </span>

      <div
        role="group"
        aria-label="Dataset Source selector"
        className="glass inline-flex items-center rounded-xl p-0.5 border border-[var(--border)] text-xs"
      >
        <button
          type="button"
          onClick={() => setDatasetMode('sih')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            datasetMode === 'sih'
              ? 'bg-[var(--surface-solid)] text-[var(--brand)] shadow-xs border border-[var(--border-strong)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
          title="Official SIH competition snapshot"
        >
          <Database className="w-3 h-3 text-[var(--brand)]" />
          <span>SIH DATASET</span>
        </button>

        <button
          type="button"
          onClick={() => setDatasetMode('synthetic')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            datasetMode === 'synthetic'
              ? 'bg-[var(--surface-solid)] text-purple-400 shadow-xs border border-[var(--border-strong)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
          title="Synthetic demo dataset for scenario stress-testing"
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>DEMO DATASET</span>
        </button>
      </div>

      <button
        type="button"
        aria-label="Data Source Information"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="text-[var(--text-faint)] hover:text-[var(--text)] p-1 rounded-full hover:bg-[var(--glass)] transition cursor-pointer"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3 rounded-2xl overlay z-50 text-[11px] shadow-xl border border-[var(--border-strong)] leading-relaxed animate-in fade-in zoom-in-95 duration-150">
          <div className="font-bold text-[var(--text)] mb-1 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[var(--brand)]" />
            <span>Dual Dataset Intelligence Modes</span>
          </div>
          <p className="text-[var(--text-muted)] mb-1.5">
            <strong className="text-[var(--text)]">SIH Dataset:</strong> Official competition baseline snapshot (NCS vacancies, PMKVY 2.0/3.0 staged training capacity, Gorakhpur Solar/Retail).
          </p>
          <p className="text-[var(--text-muted)]">
            <strong className="text-[var(--text)]">Demo Dataset:</strong> Multi-district synthetic benchmark for national simulations and sensitivity stress-testing.
          </p>
        </div>
      )}
    </div>
  );
}
