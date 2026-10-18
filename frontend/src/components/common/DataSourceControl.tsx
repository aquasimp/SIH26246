'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Info, Database, FlaskConical } from 'lucide-react';

export function DataSourceControl() {
  const { datasetMode, setDatasetMode, l } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1.5 shrink-0">
      <span className="hidden 2xl:inline text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)] shrink-0">
        {l('DATA SOURCE:', 'डेटा स्रोत:')}
      </span>

      <div
        role="group"
        aria-label={l('Dataset Source selector', 'डेटासेट स्रोत चयनकर्ता')}
        className="inline-flex items-center rounded-lg p-0.5 border border-[var(--border)] glass text-xs shrink-0 h-[36px]"
      >
        <button
          type="button"
          onClick={() => setDatasetMode('sih')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
            datasetMode === 'sih'
              ? 'bg-[var(--surface-solid)] text-[var(--text)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
          title={l('MSDE Verified Dataset (Competition Baseline Snapshot)', 'MSDE सत्यापित डेटासेट (प्रतियोगिता बेसलाइन)')}
        >
          <Database className="w-3 h-3 text-[var(--brand-secondary)] shrink-0" />
          <span>{l('MSDE Data', 'MSDE डेटा')}</span>
        </button>

        <button
          type="button"
          onClick={() => setDatasetMode('synthetic')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
            datasetMode === 'synthetic'
              ? 'bg-[var(--surface-solid)] text-[var(--oversupply)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
          title={l('Extended Multi-district Benchmark', 'विस्तारित बहु-जिला बेंचमार्क')}
        >
          <FlaskConical className="w-3 h-3 text-[var(--oversupply)] shrink-0" />
          <span>{l('Extended Data', 'विस्तारित डेटा')}</span>
        </button>
      </div>

      <button
        type="button"
        aria-label={l('Data Source Information', 'डेटा स्रोत जानकारी')}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="text-[var(--text-faint)] hover:text-[var(--text)] p-1 rounded transition-colors cursor-pointer shrink-0"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl glass-strong border border-[var(--border)] z-50 text-[11px] shadow-xl leading-relaxed animate-in fade-in duration-150">
          <div className="font-bold text-[var(--text)] mb-1 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[var(--brand-secondary)]" />
            <span>{l('Dual Dataset Intelligence Modes', 'दोहरी डेटासेट प्रणाली')}</span>
          </div>
          <p className="text-[var(--text-muted)] mb-1.5">
            <strong className="text-[var(--text)]">{l('MSDE Verified Dataset:', 'MSDE सत्यापित डेटासेट:')}</strong> {l('Official evaluation baseline snapshot (Gorakhpur Solar/Retail).', 'आधिकारिक मूल्यांकन बेसलाइन स्नैपशॉट (गोरखपुर सोलर/रिटेल)।')}
          </p>
          <p className="text-[var(--text-muted)]">
            <strong className="text-[var(--text)]">{l('Extended Dataset:', 'विस्तारित डेटासेट:')}</strong> {l('Multi-district evaluation benchmark for national simulations.', 'सिमुलेशन और संवेदनशीलता परीक्षण के लिए बहु-जिला मूल्यांकन बेंचमार्क।')}
          </p>
        </div>
      )}
    </div>
  );
}
