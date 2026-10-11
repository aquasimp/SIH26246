'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Info, Database, Sparkles } from 'lucide-react';

export function DataSourceControl() {
  const { datasetMode, setDatasetMode, language, l } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
        {l('DATA SOURCE:', 'डेटा स्रोत:')}
      </span>

      <div
        role="group"
        aria-label={l('Dataset Source selector', 'डेटासेट स्रोत चयनकर्ता')}
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
          title={l('SIH dummy dataset', 'SIH डमी डेटासेट')}
        >
          <Database className="w-3 h-3 text-[var(--brand)]" />
          <span>{l('SIH dummy dataset', 'SIH डमी डेटासेट')}</span>
        </button>

        <button
          type="button"
          onClick={() => setDatasetMode('synthetic')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            datasetMode === 'synthetic'
              ? 'bg-[var(--surface-solid)] text-purple-400 shadow-xs border border-[var(--border-strong)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
          title={l('Synthetic demo dataset', 'सिंथेटिक डेमो डेटासेट')}
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>{l('Demo dataset', 'डेमो डेटासेट')}</span>
        </button>
      </div>

      <button
        type="button"
        aria-label={l('Data Source Information', 'डेटा स्रोत जानकारी')}
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
            <span>{l('Dual Dataset Intelligence Modes', 'दोहरी डेटासेट प्रणाली')}</span>
          </div>
          <p className="text-[var(--text-muted)] mb-1.5">
            <strong className="text-[var(--text)]">{l('SIH dummy dataset:', 'SIH डमी डेटासेट:')}</strong> {l('Competition baseline snapshot (Gorakhpur Solar/Retail).', 'प्रतियोगिता बेसलाइन स्नैपशॉट (गोरखपुर सोलर/रिटेल)।')}
          </p>
          <p className="text-[var(--text-muted)]">
            <strong className="text-[var(--text)]">{l('Demo Dataset:', 'डेमो डेटासेट:')}</strong> {l('Multi-district synthetic benchmark for national simulations.', 'सिमुलेशन और संवेदनशीलता परीक्षण के लिए बहु-जिला सिंथेटिक बेंचमार्क।')}
          </p>
        </div>
      )}
    </div>
  );
}
