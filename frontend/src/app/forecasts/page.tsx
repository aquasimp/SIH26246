'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { ForecastChart } from '@/components/charts/ForecastChart';
import { Badge } from '@/components/common/Badge';
import { Provenance } from '@/components/common/Provenance';
import { OCCUPATIONS, DATA_HEALTH_METRIC } from '@/lib/demoData';
import { OUT_OF_SAMPLE_BENCHMARKS } from '@/lib/benchmarkMetrics';
import { getLocalizedEntityName, resolveDisplayName } from '@/lib/i18n';

export default function ForecastPage() {
  const { 
    selectedOccupationNco, 
    forecastHorizon, 
    setForecastHorizon,
    selectedDistrict,
    selectedState,
    language, l} = useApp();

  const [activeModel, setActiveModel] = useState<'lightgbm' | 'naive'>('lightgbm');

  const occ = OCCUPATIONS.find(o => o.ncoCode === selectedOccupationNco) || OCCUPATIONS[0];
  const benchmark = OUT_OF_SAMPLE_BENCHMARKS[forecastHorizon];

  return (
    <div className="space-y-6">
      {/* Title & Horizon Selector (§6.2) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="eyebrow"><span className="eyebrow-bullet" />{l('Intelligence', 'इंटेलिजेंस')}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
              {l('Econometric Predictive Engine', 'अर्थमितीय पूर्वानुमान इंजन')}
            </span>
            <Provenance source="MSDE Verified Registry" />
          </div>
          <h1 className="page-title-editorial">
            {language !== 'en' ? (
              l('Demand & Supply Forecasts', 'मांग और आपूर्ति पूर्वानुमान')
            ) : (
              <>
                Demand &amp; Supply <span className="title-serif-italic">Forecasts</span>
              </>
            )}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            {l('Multi-horizon machine learning forecasting of trade demand versus staged employable labour supply. Sourced dynamically from verified out-of-sample backtests.', 'व्यवसाय मांग बनाम चरणबद्ध रोजगार योग्य श्रम आपूर्ति का बहु-क्षितिज मशीन लर्निंग पूर्वानुमान। सत्यापित आउट-ऑफ-सैंपल बैकटेस्ट से गतिशील रूप से प्राप्त।')}
          </p>
        </div>

        {/* Horizon Quick Selector (§6.2) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-mono font-bold text-slate-400">
            {l('Horizon:', 'क्षितिज:')}
          </span>
          <div className="liquid-glass-card inline-flex items-center rounded-xl p-1 text-xs">
            {(['3M', '6M', '12M'] as const).map((hz) => (
              <button
                key={hz}
                type="button"
                onClick={() => setForecastHorizon(hz)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer font-mono ${
                  forecastHorizon === hz
                    ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {hz}
              </button>
            ))}
          </div>
        </div>
      </div>

      <FilterBar />

      {/* Main Forecast Visualization Panel (§6.2) */}
      <div className="p-5 sm:p-6 rounded-3xl liquid-glass-card hud-corner-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text)]">
              {l(`Forecast Trajectory: ${occ.title} (${occ.ncoCode})`, `पूर्वानुमान प्रक्षेपवक्र: ${resolveDisplayName(occ, language)} (${occ.ncoCode})`)}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {`${l('Historical actuals (2024–2026) vs.', 'ऐतिहासिक वास्तविक डेटा (2024–2026) बनाम')} ${forecastHorizon} ${l('forward projection in', 'अग्रिम प्रक्षेपण')} ${getLocalizedEntityName('districts', selectedDistrict, language)}, ${getLocalizedEntityName('states', selectedState, language)}.`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="balanced" size="sm">
              {l(`Confidence: ${occ.confidence}%`, `विश्वसनीयता: ${occ.confidence}%`)}
            </Badge>
            <span className="text-[10px] font-mono text-[var(--text-faint)]">
              {l('Run:', 'रन:')} {DATA_HEALTH_METRIC.lastRunId}
            </span>
          </div>
        </div>

        <ForecastChart
          data={occ.timeSeries}
          occupationTitle={resolveDisplayName(occ, language)}
          horizon={forecastHorizon}
          model={activeModel}
          onModelChange={setActiveModel}
        />
      </div>

      {/* Dynamic Model Performance & Architecture Cards (§4.1, §6.2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Production Ensemble */}
        <div className="p-5 rounded-2xl glass-strong border border-[var(--brand)]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
                {l('Production Engine (Deployed)', 'उत्पादन इंजन (तैनात)')}
              </span>
              <span className="text-xs font-mono text-[var(--text-faint)] truncate">
                {l(`${benchmark.sampleCount} Test Origins`, `${benchmark.sampleCount} टेस्ट ओरिजिन`)}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[var(--text)]">
              {l('Tri-Model Ensemble Blend', 'त्रि-मॉडल मिश्रण (LightGBM + Theta + ETS)')}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              {l('Production inverse-WAPE blend (LightGBM + Theta + ETS) fitted on Origins 1–3 and backtested out-of-sample on Origins 4–6 without temporal feature leakage.', 'उत्पत्ति 1-3 पर प्रशिक्षित और बिना टेम्पोरल लीकेज के उत्पत्ति 4-6 पर आउट-ऑफ-सैंपल परीक्षण किया गया उत्पादन मिश्रण (LightGBM + Theta + ETS)।')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">
                {l('Ensemble WAPE', 'मिश्रण WAPE')}
              </span>
              <span className="text-2xl font-extrabold text-[var(--brand)] tabular-nums">
                {benchmark.ensembleWape}%
              </span>
            </div>
            <div className="text-right text-[11px] text-[var(--text-muted)] font-mono">
              <div>{l('Standalone LGB WAPE:', 'अकेला LGB WAPE:')} <strong className="text-[var(--text)]">{benchmark.lgbWape}%</strong></div>
              <div>MAE: <strong className="text-[var(--text)]">{benchmark.ensembleMae}</strong> | RMSE: <strong className="text-[var(--text)]">{benchmark.ensembleRmse}</strong></div>
            </div>
          </div>
        </div>

        {/* Card 2: Seasonal Naive Benchmark (§4.1 Seasonal Naive worse at every horizon) */}
        <div className="p-5 rounded-2xl glass border border-[var(--border)] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-500/15 text-[var(--text-muted)] border border-slate-500/30">
                {l('Baseline Benchmark', 'आधारभूत बेंचमार्क')}
              </span>
              <span className="text-xs font-mono text-[var(--text-faint)] truncate">
                {l('12M Lag', '12M अंतराल')}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[var(--text)]">
              {l('Seasonal Naive Benchmark', 'मौसमी सरल (नेईव) बेंचमार्क')}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              {l('Standard government baseline repeating prior-year cyclical demand. Fails to adjust for accelerated industrial demand.', 'पूर्व-वर्ष की चक्रीय मांग दोहराने वाला मानक सरकारी आधारभूत मॉडल। तीव्र औद्योगिक मांग के समायोजन में असमर्थ।')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">
                {l('WAPE Error', 'WAPE त्रुटि')}
              </span>
              <span className="text-2xl font-extrabold text-[var(--text-muted)] tabular-nums">
                {benchmark.naiveWape}%
              </span>
            </div>
            <div className="text-right text-[11px] text-[var(--text-muted)]">
              <div>MAE: <strong className="text-[var(--text)]">{benchmark.naiveMae}</strong></div>
              <div>RMSE: <strong className="text-[var(--text)]">{benchmark.naiveRmse}</strong></div>
            </div>
          </div>
        </div>

        {/* Card 3: Calibration & Coverage */}
        <div className="p-5 rounded-2xl glass border border-[var(--border)] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30">
                {l('Coverage Calibration', 'कवरेज अंशांकन')}
              </span>
              <span className="text-xs font-mono text-[var(--text-faint)] truncate">
                {l('Pinball Loss Validated', 'पिनबॉल हानि मान्य')}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[var(--text)]">
              {l('Prediction Intervals (80% & 95%)', 'भविष्यवाणी अंतराल (80% और 95%)')}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              {l('Empirical coverage matches theoretical nominal intervals closely, ensuring actionable uncertainty bounds for planners.', 'अनुभवजन्य कवरेज सैद्धांतिक नाममात्र अंतरालों से निकटता से मेल खाती है, जो योजनाकारों के लिए अनिश्चितता सीमाएं सुनिश्चित करती है।')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">
                {l('95% Coverage', '95% कवरेज')}
              </span>
              <span className="text-2xl font-extrabold text-[var(--success)] tabular-nums">
                {benchmark.coverage95}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">
                {l('80% Coverage', '80% कवरेज')}
              </span>
              <span className="text-base font-bold text-[var(--text)] tabular-nums">
                {benchmark.coverage80}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
