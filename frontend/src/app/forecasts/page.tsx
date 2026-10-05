'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { ForecastChart } from '@/components/charts/ForecastChart';
import { Badge } from '@/components/common/Badge';
import { Provenance } from '@/components/common/Provenance';
import { OCCUPATIONS, DATA_HEALTH_METRIC } from '@/lib/demoData';
import { OUT_OF_SAMPLE_BENCHMARKS } from '@/lib/benchmarkMetrics';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function ForecastPage() {
  const { 
    selectedOccupationNco, 
    forecastHorizon, 
    setForecastHorizon,
    selectedDistrict,
    selectedState,
    datasetMode 
  } = useApp();

  const [activeModel, setActiveModel] = useState<'lightgbm' | 'naive'>('lightgbm');

  const occ = OCCUPATIONS.find(o => o.ncoCode === selectedOccupationNco) || OCCUPATIONS[0];
  const benchmark = OUT_OF_SAMPLE_BENCHMARKS[forecastHorizon];

  return (
    <div className="space-y-6">
      {/* Title & Horizon Selector (§6.2) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
              Econometric Predictive Engine
            </span>
            <Provenance source="Official SIH" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
            Demand & Supply Forecast
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            Multi-horizon machine learning forecasting of trade demand versus staged employable labour supply. Sourced dynamically from verified out-of-sample backtests.
          </p>
        </div>

        {/* Horizon Quick Selector (§6.2) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-bold text-[var(--text-faint)]">Horizon:</span>
          <div className="glass inline-flex items-center rounded-xl p-0.5 border border-[var(--border)] text-xs">
            {(['3M', '6M', '12M'] as const).map((hz) => (
              <button
                key={hz}
                type="button"
                onClick={() => setForecastHorizon(hz)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer font-mono ${
                  forecastHorizon === hz
                    ? 'bg-[var(--brand)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
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
      <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text)]">
              Forecast Trajectory: {occ.title} ({occ.ncoCode})
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Historical actuals (2024–2026) vs. {forecastHorizon} forward projection in {selectedDistrict}, {selectedState}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="balanced" size="sm">
              Confidence: {occ.confidence}%
            </Badge>
            <span className="text-[10px] font-mono text-[var(--text-faint)]">
              Run: {DATA_HEALTH_METRIC.lastRunId}
            </span>
          </div>
        </div>

        <ForecastChart
          data={occ.timeSeries}
          occupationTitle={occ.title}
          horizon={forecastHorizon}
          model={activeModel}
          onModelChange={setActiveModel}
        />
      </div>

      {/* Dynamic Model Performance & Architecture Cards (§4.1, §6.2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Production Ensemble */}
        <div className="p-5 rounded-2xl glass-strong border border-[var(--brand)]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
                Primary Architecture
              </span>
              <span className="text-xs font-mono text-[var(--text-faint)]">
                {benchmark.sampleCount} Test Origins
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[var(--text)]">
              {benchmark.primaryModel}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              Fitted strictly on Origins 1–3 and backtested out-of-sample on Origins 4–6 without temporal feature leakage.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">WAPE Error</span>
              <span className="text-2xl font-extrabold text-[var(--brand)] tabular-nums">
                {benchmark.wape}%
              </span>
            </div>
            <div className="text-right text-[11px] text-[var(--text-muted)]">
              <div>MAE: <strong className="text-[var(--text)]">{benchmark.mae}</strong></div>
              <div>RMSE: <strong className="text-[var(--text)]">{benchmark.rmse}</strong></div>
            </div>
          </div>
        </div>

        {/* Card 2: Seasonal Naive Benchmark (§4.1 Seasonal Naive worse at every horizon) */}
        <div className="p-5 rounded-2xl glass border border-[var(--border)] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-500/15 text-[var(--text-muted)] border border-slate-500/30">
                Baseline Benchmark
              </span>
              <span className="text-xs font-mono text-[var(--text-faint)]">
                12M Lag
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[var(--text)]">
              Seasonal Naive Benchmark
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              Standard government baseline repeating prior-year cyclical demand. Fails to adjust for accelerated industrial demand.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">WAPE Error</span>
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
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30">
                Coverage Calibration
              </span>
              <span className="text-xs font-mono text-[var(--text-faint)]">
                Pinball Loss Validated
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[var(--text)]">
              Prediction Intervals (80% & 95%)
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              Empirical coverage matches theoretical nominal intervals closely, ensuring actionable uncertainty bounds for planners.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">95% Coverage</span>
              <span className="text-2xl font-extrabold text-[var(--success)] tabular-nums">
                {benchmark.coverage95}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">80% Coverage</span>
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
