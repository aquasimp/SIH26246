'use client';

import React from 'react';
import { DATA_HEALTH_METRIC } from '@/lib/demoData';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { clsx } from 'clsx';
import { 
  ShieldCheck, 
  Database, 
  Activity, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function DataHealthPage() {
  const m = DATA_HEALTH_METRIC;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Platform Trust & Audit Governance
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Data & Model Health Governance
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Comprehensive observability over multi-source ingestion feeds, NCO/LGD ontology mapping confidence, model drift metrics, and pipeline run provenance.
        </p>
      </div>

      {/* 6 Top Governance KPI Cards (Section 31) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Sources */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Sources Connected
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono my-1">
            {m.sourcesConnected} / {m.sourcesTotal}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">Active Ingestion</span>
        </div>

        {/* Metric 2: Freshness */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Data Freshness
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono my-1">
            {m.freshnessPercent}%
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Synced Under SLA</span>
        </div>

        {/* Metric 3: Mapping Confidence */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Mapping Confidence
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-mono my-1">
            {m.mappingConfidencePercent}%
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold">NCO / LGD Alignment</span>
        </div>

        {/* Metric 4: Forecast Confidence */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Forecast Confidence
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-mono my-1">
            {m.forecastConfidencePercent}%
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">LightGBM Production</span>
        </div>

        {/* Metric 5: Data Quality */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Data Quality
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 font-mono my-1">
            {m.dataQualityPercent}%
          </div>
          <span className="text-[10px] text-purple-600 font-semibold">Passes Validation</span>
        </div>

        {/* Metric 6: Last Run */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Last Successful Run
          </span>
          <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-2 font-mono truncate">
            {m.lastRunId}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">{m.lastRunTimestamp}</span>
        </div>
      </div>

      {/* Model Performance Benchmark Comparison */}
      <GlassPanel
        title="Model Benchmark Metrics & Baseline Comparison"
        subtitle="Evaluated across 6 rolling origins with strictly lagged econometric signals (no contemporaneous leakage)."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {m.models.map((mod, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xs font-extrabold text-slate-900 leading-snug">
                    {mod.name}
                  </h3>
                  <span className={clsx(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0',
                    mod.status === 'optimal' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-slate-700 bg-slate-50 border-slate-200'
                  )}>
                    {mod.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">WAPE</span>
                    <div className="text-xl font-extrabold text-blue-600 font-mono mt-0.5">
                      {mod.wape}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">MAE</span>
                    <div className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">
                      {mod.mae}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-100">
                Last Trained: {mod.lastTrained}
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Multi-Horizon Rolling-Origin Backtest Table (Item 1 Hardening Requirement) */}
      <GlassPanel
        title="Rolling-Origin Walk-Forward Backtest (6 Origins × Horizons 3M / 6M / 12M)"
        subtitle="Empirical out-of-sample evaluation: WAPE, MASE, and 80%/95% interval coverage across 1,536 trade-district observations per horizon."
        action={
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Zero-Leakage Verified
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Forecast Horizon</th>
                <th className="py-3 px-3">Model / Baseline</th>
                <th className="py-3 px-3 text-right">WAPE (%)</th>
                <th className="py-3 px-3 text-right">MASE</th>
                <th className="py-3 px-3 text-right">80% Interval Coverage</th>
                <th className="py-3 px-3 text-right">95% Interval Coverage</th>
                <th className="py-3 px-3 text-right">Sample Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {m.backtestHorizons?.map((row, idx) => {
                const isProduction = row.model.includes('Production');
                const isHorizonStart = idx % 5 === 0;

                return (
                  <tr 
                    key={idx} 
                    className={clsx(
                      'hover:bg-slate-50/70 transition-colors',
                      isProduction ? 'bg-blue-50/40 font-semibold' : '',
                      isHorizonStart ? 'border-t-2 border-slate-200/90' : ''
                    )}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {isHorizonStart ? (
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[11px]">
                          {row.horizon} Horizon
                        </span>
                      ) : (
                        <span className="text-slate-400 pl-2">↳</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={clsx(
                        isProduction ? 'text-blue-900 font-bold' : 'text-slate-700'
                      )}>
                        {row.model}
                      </span>
                      {isProduction && (
                        <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          Production Blend
                        </span>
                      )}
                    </td>
                    <td className={clsx('py-2.5 px-3 text-right font-mono font-bold', isProduction ? 'text-blue-700' : 'text-slate-800')}>
                      {row.wape.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                      {row.mase.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                      <span className={clsx(
                        'px-1.5 py-0.5 rounded text-[11px] font-semibold',
                        Math.abs(row.coverage_80 - 80) <= 3.5 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      )}>
                        {row.coverage_80.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                      <span className={clsx(
                        'px-1.5 py-0.5 rounded text-[11px] font-semibold',
                        Math.abs(row.coverage_95 - 95) <= 2.5 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      )}>
                        {row.coverage_95.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                      {row.sample_count.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
          <strong className="text-slate-900 block mb-1">Methodology & Critical Model Limitation Disclosure:</strong>
          Evaluated across 6 walk-forward temporal origins (<span className="font-mono">2023-05-01</span> through <span className="font-mono">2023-10-01</span>) on the official SIH monthly dataset across 1,536 series-horizon observations. Models trained strictly with $t-1$ lagged inputs (zero leakage). 
          <span className="block mt-1 font-semibold text-slate-800">
            Limitation: LightGBM alone is not the best single model across horizons.
          </span>
          Theta outperforms LightGBM at 3M (4.93% vs 5.67% WAPE) and 6M (5.91% vs 7.11% WAPE), while ETS outperforms at 12M (3.92% vs 5.29% WAPE). Production forecasts therefore deploy an out-of-fold inverse-WAPE weighted <strong>Tri-Model Ensemble Blend (LightGBM + Theta + ETS)</strong> without look-ahead bias, achieving the lowest overall error (3.46% WAPE at 12M) while maintaining well-calibrated 80% (~79.2%) and 95% (~95.8%) interval coverage.
        </div>
      </GlassPanel>

      {/* Connected Feeds Table (Section 31 & 51) */}
      <GlassPanel
        title="Ingested Data Sources & Provenance Registry"
        subtitle="Mandatory Section 51 classification: Public Aggregate, Demo Dataset, and Planned Government Feeds."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Data Source Description</th>
                <th className="py-3 px-3">Data Classification</th>
                <th className="py-3 px-3">Sync Status</th>
                <th className="py-3 px-3">Records Ingested</th>
                <th className="py-3 px-3 text-right">Query Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {m.sources.map((src, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-800">
                    {src.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className={clsx(
                      'px-2 py-0.5 rounded-md text-[10px] font-bold border',
                      src.type === 'Public Aggregate' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      src.type === 'Demo Dataset' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    )}>
                      {src.type}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={clsx(
                      'inline-flex items-center gap-1 font-semibold text-[11px]',
                      src.status === 'Active' ? 'text-emerald-700' :
                      src.status === 'Synced' ? 'text-blue-700' :
                      'text-slate-400'
                    )}>
                      {src.status === 'Active' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {src.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {src.records}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500">
                    {src.latency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
