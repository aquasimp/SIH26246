'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Info, Database, Sparkles } from 'lucide-react';

export function DataSourceControl() {
  const { datasetMode, setDatasetMode, l } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1.5 shrink-0">
      <span className="hidden 2xl:inline text-[10px] font-semibold uppercase tracking-wider text-slate-400 shrink-0">
        {l('DATA SOURCE:', 'डेटा स्रोत:')}
      </span>

      <div
        role="group"
        aria-label={l('Dataset Source selector', 'डेटासेट स्रोत चयनकर्ता')}
        className="inline-flex items-center rounded-lg p-0.5 border border-slate-200/80 bg-slate-100/80 backdrop-blur-md text-xs shrink-0"
      >
        <button
          type="button"
          onClick={() => setDatasetMode('sih')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
            datasetMode === 'sih'
              ? 'bg-white text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title={l('MSDE Verified Dataset (Competition Baseline Snapshot)', 'MSDE सत्यापित डेटासेट (प्रतियोगिता बेसलाइन)')}
        >
          <Database className="w-3 h-3 text-sky-600 shrink-0" />
          <span>{l('MSDE Data', 'MSDE डेटा')}</span>
        </button>

        <button
          type="button"
          onClick={() => setDatasetMode('synthetic')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
            datasetMode === 'synthetic'
              ? 'bg-white text-purple-700 shadow-[0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title={l('Extended Multi-district Benchmark', 'विस्तारित बहु-जिला बेंचमार्क')}
        >
          <Sparkles className="w-3 h-3 text-purple-500 shrink-0" />
          <span>{l('Extended Data', 'विस्तारित डेटा')}</span>
        </button>
      </div>

      <button
        type="button"
        aria-label={l('Data Source Information', 'डेटा स्रोत जानकारी')}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors cursor-pointer shrink-0"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl bg-white/95 backdrop-blur-xl z-50 text-[11px] shadow-[0_10px_30px_-5px_rgba(15,23,42,0.15)] border border-slate-200/90 leading-relaxed animate-in fade-in duration-150">
          <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-600" />
            <span>{l('Dual Dataset Intelligence Modes', 'दोहरी डेटासेट प्रणाली')}</span>
          </div>
          <p className="text-slate-600 mb-1.5">
            <strong className="text-slate-900">{l('MSDE Verified Dataset:', 'MSDE सत्यापित डेटासेट:')}</strong> {l('Official evaluation baseline snapshot (Gorakhpur Solar/Retail).', 'आधिकारिक मूल्यांकन बेसलाइन स्नैपशॉट (गोरखपुर सोलर/रिटेल)।')}
          </p>
          <p className="text-slate-600">
            <strong className="text-slate-900">{l('Extended Dataset:', 'विस्तारित डेटासेट:')}</strong> {l('Multi-district evaluation benchmark for national simulations.', 'सिमुलेशन और संवेदनशीलता परीक्षण के लिए बहु-जिला मूल्यांकन बेंचमार्क।')}
          </p>
        </div>
      )}
    </div>
  );
}
