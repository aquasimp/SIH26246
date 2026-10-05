'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { EARLY_WARNING_ALERTS } from '@/lib/demoData';
import { AlertSeverity, AlertType } from '@/lib/types';
import { clsx } from 'clsx';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Check, 
  Sliders, 
  Download, 
  ArrowRight, 
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

export default function AlertsPage() {
  const { alerts, acknowledgeAlert } = useApp();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter(a => {
    const matchesSev = selectedSeverity === 'all' || a.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || a.type === selectedType;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.geography.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.occupation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesType && matchesSearch;
  });

  const handleExport = () => {
    const rows = [
      ['Alert ID', 'Severity', 'Type', 'Title', 'Geography', 'Occupation', 'Trigger', 'Horizon', 'Confidence', 'Recommended Action', 'Status'],
      ...filteredAlerts.map(a => [
        a.id,
        a.severity,
        a.type,
        a.title,
        a.geography,
        a.occupation,
        a.trigger,
        a.forecastHorizon,
        `${a.confidence}%`,
        a.recommendedAction,
        a.acknowledged ? 'Acknowledged' : 'Active'
      ])
    ];
    downloadCSV('KaushalPulse_Early_Warnings.csv', rows);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
              National Risk Monitoring Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Early Warning Command Center
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Proactive predictive detection of emerging trade imbalances, saturation hazards, and technological skill obsolescence before structural distress occurs.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl liquid-control text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Alert Dossier</span>
        </button>
      </div>

      <FilterBar />

      {/* Official Dataset Early Warning Intelligence Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-blue-50 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-600 text-white tracking-wider font-mono">
              Official SIH Intelligence Scan
            </span>
            <span className="font-bold text-slate-800">
              35 Active Anomalies Detected across 16 Districts
            </span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Of the 6 algorithmic alert categories, <strong>4 categories fire on the official dataset</strong>: <strong>1 Persistent Severe Shortage</strong> (Gorakhpur Solar PV Installer with 3/3 periods at Gap Score 94), <strong>1 Critical Emerging Shortage</strong> (Drone Maintenance in Rajkot), <strong>30 Capacity Inefficiencies</strong> (physical training seats &gt; 2.0× demand, ranked by wasted seats), and <strong>3 Skill Obsolescence Risks</strong> (legacy garments &amp; HVAC). The top 5 prioritized alerts are surfaced below.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs">
            Top 5 Surfaced by Default
          </span>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Severity:
          </span>
          {['all', 'critical', 'warning', 'info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={clsx(
                'px-3 py-1 font-bold rounded-lg transition-all cursor-pointer capitalize',
                selectedSeverity === sev
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search alerts by geography / trade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={clsx(
              'p-5 sm:p-6 rounded-2xl border transition-all shadow-xs flex flex-col justify-between',
              alert.acknowledged
                ? 'bg-slate-50/90 border-slate-200/70 opacity-75'
                : alert.severity === 'critical'
                ? 'bg-gradient-to-r from-red-50/70 via-white to-white border-red-200'
                : alert.severity === 'warning'
                ? 'bg-gradient-to-r from-amber-50/70 via-white to-white border-amber-200'
                : 'bg-gradient-to-r from-blue-50/70 via-white to-white border-blue-200'
            )}
          >
            <div>
              {/* Alert Top Line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/50">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={clsx(
                    'px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase font-mono tracking-wider',
                    alert.severity === 'critical' ? 'bg-red-600 text-white' :
                    alert.severity === 'warning' ? 'bg-amber-600 text-white' :
                    'bg-blue-600 text-white'
                  )}>
                    {alert.severity}
                  </span>

                  <span className="text-xs font-bold text-slate-700">
                    {alert.geography}
                  </span>

                  <span className="text-xs text-slate-400">|</span>

                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {alert.occupation} (NCO {alert.ncoCode})
                  </span>

                  {alert.wastedSeats && (
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300">
                      Wasted Seats: {alert.wastedSeats}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>Horizon: <strong>{alert.forecastHorizon}</strong></span>
                  <span>Confidence: <strong className="text-emerald-700">{alert.confidence}%</strong></span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              {/* Title & Trigger */}
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {alert.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 mb-3 leading-relaxed">
                <strong>Trigger:</strong> {alert.trigger}
              </p>

              {/* Context Label Callout (Section 4: Context, not model output) */}
              {alert.context && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-3 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      Context, not model output
                    </span>
                    <p className="text-amber-950 font-normal mt-0.5">
                      {alert.context.replace(/^Context,\s*not model output:\s*/i, '')}
                    </p>
                  </div>
                </div>
              )}

              {/* Recommended Action Box */}
              <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 mb-4 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                  Algorithmic Policy Recommendation
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {alert.recommendedAction}
                </p>
              </div>
            </div>

            {/* Alert Action Buttons (Section 22: Acknowledge, Investigate, Simulate, Export) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                {!alert.acknowledged ? (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Acknowledge Alert</span>
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Acknowledged</span>
                  </span>
                )}

                <Link
                  href={`/occupations/${alert.ncoCode}`}
                  className="px-3 py-1.5 rounded-xl liquid-control text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5"
                >
                  <span>Investigate Evidence</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/scenarios"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulate in Studio</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
