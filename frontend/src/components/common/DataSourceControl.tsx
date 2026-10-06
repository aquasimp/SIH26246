'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Info, Database, Sparkles } from 'lucide-react';

export function DataSourceControl() {
  const { datasetMode, setDatasetMode, language } = useApp();
  const isHi = language === 'hi';
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
        {isHi ? 'डेटा स्रोत:' : 'DATA SOURCE:'}
      </span>

      <div
        role="group"
        aria-label={isHi ? 'डेटासेट स्रोत चयनकर्ता' : 'Dataset Source selector'}
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
          title={isHi ? 'SIH डमी डेटासेट' : 'SIH dummy dataset'}
        >
          <Database className="w-3 h-3 text-[var(--brand)]" />
          <span>{isHi ? 'SIH डमी डेटासेट' : 'SIH dummy dataset'}</span>
        </button>

        <button
          type="button"
          onClick={() => setDatasetMode('synthetic')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            datasetMode === 'synthetic'
              ? 'bg-[var(--surface-solid)] text-purple-400 shadow-xs border border-[var(--border-strong)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
          title={isHi ? 'सिंथेटिक डेमो डेटासेट' : 'Synthetic demo dataset'}
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>{isHi ? 'डेमो डेटासेट' : 'Demo dataset'}</span>
        </button>
      </div>

      <button
        type="button"
        aria-label={isHi ? 'डेटा स्रोत जानकारी' : 'Data Source Information'}
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
            <span>{isHi ? 'दोहरी डेटासेट प्रणाली' : 'Dual Dataset Intelligence Modes'}</span>
          </div>
          <p className="text-[var(--text-muted)] mb-1.5">
            <strong className="text-[var(--text)]">{isHi ? 'SIH डमी डेटासेट:' : 'SIH dummy dataset:'}</strong> {isHi ? 'प्रतियोगिता बेसलाइन स्नैपशॉट (गोरखपुर सोलर/रिटेल)।' : 'Competition baseline snapshot (Gorakhpur Solar/Retail).'}
          </p>
          <p className="text-[var(--text-muted)]">
            <strong className="text-[var(--text)]">{isHi ? 'डेमो डेटासेट:' : 'Demo Dataset:'}</strong> {isHi ? 'सिमुलेशन और संवेदनशीलता परीक्षण के लिए बहु-जिला सिंथेटिक बेंचमार्क।' : 'Multi-district synthetic benchmark for national simulations.'}
          </p>
        </div>
      )}
    </div>
  );
}
