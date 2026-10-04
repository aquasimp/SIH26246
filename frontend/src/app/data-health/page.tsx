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
        title="Model Benchmark Metrics & Drift Evaluation"
        subtitle="Evaluated across rolling 60-month historical cross-validation window."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {m.models.map((mod, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {mod.name}
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {mod.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Weighted Abs % Error (WAPE)</span>
                  <div className="text-2xl font-extrabold text-blue-600 font-mono mt-0.5">
                    {mod.wape}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mean Abs Error (MAE)</span>
                  <div className="text-2xl font-extrabold text-slate-800 font-mono mt-0.5">
                    {mod.mae}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Last Trained: {mod.lastTrained}
              </div>
            </div>
          ))}
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
