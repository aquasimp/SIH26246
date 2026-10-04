'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { IndiaIntelligenceMap } from '@/components/maps/IndiaIntelligenceMap';
import { GlassCard } from '@/components/glass/GlassCard';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { OCCUPATIONS, RECOMMENDATIONS, DISTRICTS, ALERTS } from '@/lib/demoData';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldAlert,
  Sparkles,
  Download,
  Sliders,
  ChevronRight,
  Eye
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

export default function OverviewPage() {
  const { t, setActiveEvidence, setSelectedDistrict, setSelectedOccupationNco } = useApp();

  const metrics = useMemo(() => {
    const totalDemand = OCCUPATIONS.reduce((acc, o) => acc + o.currentDemand, 0);
    const totalEffectiveSupply = OCCUPATIONS.reduce((acc, o) => acc + o.effectiveSupply, 0);
    const netDeficit = totalDemand - totalEffectiveSupply;
    const atRiskTrades = OCCUPATIONS.filter(o => o.gapScore >= 75 || o.gapScore <= 25).length;
    return {
      demandFormatted: (totalDemand / 1000).toFixed(1) + 'K',
      supplyFormatted: (totalEffectiveSupply / 1000).toFixed(1) + 'K',
      gapFormatted: (netDeficit > 0 ? '-' : '+') + (Math.abs(netDeficit) / 1000).toFixed(1) + 'K',
      atRiskCount: atRiskTrades,
      activeAlertsCount: ALERTS.length,
      recommendationsCount: RECOMMENDATIONS.length
    };
  }, []);

  const handleExportAction = (rec: typeof RECOMMENDATIONS[0]) => {
    const rows = [
      ['Action Summary', rec.title],
      ['District', `${rec.district}, ${rec.state}`],
      ['From Trade', rec.fromTrade || 'N/A'],
      ['To Trade', rec.toTrade],
      ['Recommended Seats', rec.recommendedSeats],
      ['Expected Shortage Reduction', `${rec.expectedImpact.gapReductionPercent}%`],
      ['Confidence', `${rec.confidence}%`],
      ['Status', rec.status]
    ];
    downloadCSV(`MSDE_Action_${rec.id}_${rec.district}.csv`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header (Section 13) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
              National Intelligence Dashboard
            </span>
            <span className="text-xs text-slate-500 font-medium">
              MSDE Decision Support Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.nationalIntelligence}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <Link
            href="/scenarios"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>Open Scenario Studio</span>
          </Link>
        </div>
      </div>

      {/* Global Filter Bar */}
      <FilterBar />

      {/* Asymmetric Hero KPI Cards (Section 13) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Demand */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t.metrics.demand}
          </span>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.demandFormatted}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.6% (6M Growth)</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400">Aggregated Vacancies</span>
        </div>

        {/* Metric 2: Effective Supply */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t.metrics.effectiveSupply}
          </span>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.supplyFormatted}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-0.5">
              <span>Staged Pipeline Pool</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400">Certified & Available</span>
        </div>

        {/* Metric 3: Net Gap */}
        <div className="p-4 rounded-2xl bg-white/80 border border-red-200/70 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
            {t.metrics.netGap}
          </span>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-red-600 tracking-tight">
              {metrics.gapFormatted}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-red-600 mt-0.5">
              <span>National Deficit</span>
            </div>
          </div>
          <span className="text-[10px] text-red-500">Unmet Industry Need</span>
        </div>

        {/* Metric 4: At-Risk Trades */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t.metrics.atRiskTrades}
          </span>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.atRiskCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 mt-0.5">
              <span>Shortage / Saturation</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400">Critical NCO Trades</span>
        </div>

        {/* Metric 5: Early Warnings */}
        <Link 
          href="/alerts" 
          className="p-4 rounded-2xl bg-white/80 border border-amber-200/70 hover:border-amber-400 shadow-xs flex flex-col justify-between transition-all group"
        >
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            {t.metrics.earlyWarnings}
          </span>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight group-hover:scale-105 transition-transform">
              {metrics.activeAlertsCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 mt-0.5">
              <span>Active Alerts</span>
            </div>
          </div>
          <span className="text-[10px] text-blue-600 font-semibold group-hover:underline">View Alert Center →</span>
        </Link>

        {/* Metric 6: Recommendations */}
        <Link 
          href="/recommendations" 
          className="p-4 rounded-2xl bg-white/80 border border-blue-200/70 hover:border-blue-400 shadow-xs flex flex-col justify-between transition-all group"
        >
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            {t.metrics.recommendations}
          </span>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight group-hover:scale-105 transition-transform">
              {metrics.recommendationsCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 mt-0.5">
              <span>Pending Decisions</span>
            </div>
          </div>
          <span className="text-[10px] text-blue-600 font-semibold group-hover:underline">Review Actions →</span>
        </Link>
      </div>

      {/* "What Changed?" Intelligence Strip (Section 15) */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white border border-blue-200/60 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              What Changed in Current Pipeline Run?
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            <button
              onClick={() => {
                setSelectedDistrict('gorakhpur');
                setSelectedOccupationNco('7126.0101');
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-slate-800 hover:text-orange-900 font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-orange-600" />
              <span><strong>Solar PV Installer</strong> demand accelerated <strong>+21.4%</strong> in Gorakhpur</span>
            </button>

            <button
              onClick={() => {
                setSelectedDistrict('gorakhpur');
                setSelectedOccupationNco('5223.0101');
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-slate-500" />
              <span><strong>Retail Sales Associate</strong> softened <strong>-8.2%</strong></span>
            </button>

            <Link
              href="/alerts"
              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-900 font-medium flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span><strong>Gorakhpur</strong> shortage risk crossed <strong>70%</strong> threshold</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Hero Visual: India Intelligence Map (Section 14) */}
      <GlassPanel
        title="National Labour Market Geospatial Intelligence"
        subtitle="Live overlay of trade shortages, aggregated demand volumes, and training infrastructure across state corridors."
        action={
          <div className="text-xs font-semibold text-slate-500">
            Source: Skill India Digital + NCS Aggregates
          </div>
        }
      >
        <IndiaIntelligenceMap />
      </GlassPanel>

      {/* Top Priority Government Interventions Panel (Section 16) */}
      <GlassPanel
        title="Top Priority Policy Interventions (Ranked)"
        subtitle="Targeted government decisions recommended by the Labour Market Intelligence engine to balance regional skill gaps."
        action={
          <Link
            href="/recommendations"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All 4 Recommended Interventions</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECOMMENDATIONS.slice(0, 2).map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-xs font-bold">
                      #{String(rec.rank).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {rec.district}, {rec.state}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Confidence: {rec.confidence}%
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {rec.title}
                </h3>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {rec.reason}
                </p>

                {/* Score & Impact Stats */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 mb-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Seats</span>
                    <strong className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
                      {rec.recommendedSeats}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Gap Reduction</span>
                    <strong className="text-xs sm:text-sm font-bold text-emerald-600 font-mono">
                      -{rec.expectedImpact.gapReductionPercent}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Target Trade</span>
                    <strong className="text-xs sm:text-sm font-bold text-blue-600 truncate block">
                      {rec.toTrade}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Section 16: View evidence, Simulate, Export action) */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveEvidence(rec)}
                  className="px-3 py-1.5 rounded-xl liquid-control text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Evidence</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportAction(rec)}
                    className="p-1.5 rounded-xl liquid-control text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
                    title="Export Action CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <Link
                    href="/scenarios"
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simulate</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
