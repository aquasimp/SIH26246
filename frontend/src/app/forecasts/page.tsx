'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { ForecastChart } from '@/components/charts/ForecastChart';
import { ContributionChart } from '@/components/charts/ContributionChart';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { OCCUPATIONS, DATA_HEALTH_METRIC } from '@/lib/demoData';
import { 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Activity, 
  Layers, 
  TrendingUp, 
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function ForecastPage() {
  const { 
    selectedOccupationNco, 
    forecastHorizon, 
    setForecastHorizon,
    selectedDistrict,
    selectedState 
  } = useApp();

  const [activeModel, setActiveModel] = useState<'lightgbm' | 'naive'>('lightgbm');

  const occ = OCCUPATIONS.find(o => o.ncoCode === selectedOccupationNco) || OCCUPATIONS[0];

  return (
    <div className="space-y-6">
      {/* Title & Top Metadata */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
              Machine Learning Predictive Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Run: {DATA_HEALTH_METRIC.lastRunId}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Demand & Supply Forecast
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Multi-horizon econometric and machine learning forecasting of trade demand versus staged employable labour supply.
          </p>
        </div>

        {/* Horizon Quick Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-bold text-slate-500">Projection Horizon:</span>
          <div className="flex rounded-xl p-0.5 liquid-control border border-slate-200 shadow-xs">
            {(['3M', '6M', '12M'] as const).map((hz) => (
              <button
                key={hz}
                onClick={() => setForecastHorizon(hz)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  forecastHorizon === hz
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {hz}
              </button>
            ))}
          </div>
        </div>
      </div>

      <FilterBar />

      {/* Main Forecast Visualization Panel (Section 18) */}
      <GlassPanel
        title={`Forecast Trajectory: ${occ.title} (${occ.ncoCode})`}
        subtitle={`Historical trend (2024-2026) vs. ${forecastHorizon} forward projection across ${selectedDistrict.toUpperCase()}, ${selectedState}.`}
        action={
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confidence: {occ.confidence}%
            </span>
          </div>
        }
      >
        <ForecastChart
          data={occ.timeSeries}
          occupationTitle={occ.title}
          horizon={forecastHorizon}
          model={activeModel}
          onModelChange={setActiveModel}
        />
      </GlassPanel>

      {/* Model Performance & Architecture Comparison Cards (Section 18) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model 1: Production LightGBM */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-blue-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Primary Model
              </span>
              <span className="text-xs font-mono text-slate-400">
                v3.2
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Global LightGBM Ensemble
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Multi-source gradient boosted decision trees incorporating vacancy lags, industrial capex, and seasonal features.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">WAPE Error</span>
              <span className="text-xl font-extrabold text-blue-600 font-mono">12.7%</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
              <span className="text-xs font-bold text-emerald-600">Optimal (Retrained 2h ago)</span>
            </div>
          </div>
        </div>

        {/* Model 2: Seasonal Naive Baseline */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Baseline Benchmark
              </span>
              <span className="text-xs font-mono text-slate-400">
                12M Lag
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Seasonal Naive Benchmark
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Standard government baseline repeating prior-year cyclical demand without dynamic macroeconomic covariate adjustment.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">WAPE Error</span>
              <span className="text-xl font-extrabold text-slate-600 font-mono">18.4%</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Variance</span>
              <span className="text-xs font-bold text-amber-600">+5.7% Greater Error</span>
            </div>
          </div>
        </div>

        {/* Model 3: Forecast Provenance Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-200/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Forecast Governance & Provenance</span>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed mt-1">
              All forecasts generated deterministically on standardized NCO-2015 codes and mapped to Local Government Directory (LGD) district boundaries.
            </p>
          </div>

          <div className="mt-4 space-y-1.5 text-[11px] text-indigo-950 font-mono">
            <div className="flex justify-between">
              <span>Pipeline Run:</span>
              <strong>{DATA_HEALTH_METRIC.lastRunId}</strong>
            </div>
            <div className="flex justify-between">
              <span>Data Freshness:</span>
              <strong className="text-emerald-700">98% (Synced)</strong>
            </div>
            <div className="flex justify-between">
              <span>Model Confidence:</span>
              <strong>{occ.confidence}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Explainability Section (Section 19) */}
      <GlassPanel
        title="Predictive Factor Decomposition"
        subtitle="Empirical attribution explaining the specific drivers behind the forecasted trajectory."
      >
        <ContributionChart
          factors={occ.explainability}
          occupationTitle={occ.title}
        />
      </GlassPanel>
    </div>
  );
}
