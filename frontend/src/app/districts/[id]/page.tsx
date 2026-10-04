'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { DISTRICTS, OCCUPATIONS, RECOMMENDATIONS } from '@/lib/demoData';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { clsx } from 'clsx';
import { 
  MapPin, 
  Building2, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  Lightbulb, 
  Sliders, 
  Download, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

export default function DistrictDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const districtId = resolvedParams.id;
  const d = DISTRICTS.find(item => item.id.toLowerCase() === districtId.toLowerCase()) || DISTRICTS[0];

  const districtRecommendations = RECOMMENDATIONS.filter(r => r.district.toLowerCase() === d.name.toLowerCase());
  const districtOccupations = OCCUPATIONS.filter(o => o.districtConcentrations.some(c => c.district.toLowerCase() === d.name.toLowerCase()));

  const handleExportDistrict = () => {
    const rows = [
      ['District Profile', d.name],
      ['State', d.state],
      ['LGD Code', d.lgdCode],
      ['Demand Index', d.demandIndex],
      ['Effective Supply Index', d.effectiveSupplyIndex],
      ['Gap Score', d.gapScore],
      ['6M Shortage Probability', `${d.shortageProbability6M}%`],
      ['Training Centres', d.trainingCentresCount],
      ['Total Training Seats', d.totalTrainingSeats],
      ['Active Employers', d.activeEmployers],
      ['Top Shortage Trades', d.topShortageTrades.join('; ')],
      ['Top Oversupplied Trades', d.topOversuppliedTrades.join('; ')]
    ];
    downloadCSV(`KaushalPulse_District_${d.name}.csv`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/districts"
          className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Districts</span>
        </Link>

        <button
          onClick={handleExportDistrict}
          className="px-3.5 py-1.5 rounded-xl liquid-control text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export District Brief</span>
        </button>
      </div>

      {/* Hero District Header (Section 24) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/90 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              India → {d.state} → {d.name}
            </span>
            <span className="text-xs font-mono text-slate-400">
              [LGD: {d.lgdCode}]
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            {d.name}
            {d.nameHi && <span className="text-xl sm:text-2xl text-slate-400 font-normal">({d.nameHi})</span>}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Localised district intelligence assessing training centre capacity, candidate absorption, and employer vacancy signals under MSDE jurisdiction.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/scenarios"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>Simulate District Scenarios</span>
          </Link>
        </div>
      </div>

      {/* 5 Hero Diagnostic Cards (Section 23) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Demand Index */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Demand Index
          </span>
          <div className="text-3xl font-extrabold text-slate-900 font-mono my-1">
            {d.demandIndex}
          </div>
          <span className="text-[11px] text-orange-600 font-semibold">
            High Labour Demand
          </span>
        </div>

        {/* Card 2: Effective Supply */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Effective Supply
          </span>
          <div className="text-3xl font-extrabold text-slate-900 font-mono my-1">
            {d.effectiveSupplyIndex}
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            Staged Employable Pool
          </span>
        </div>

        {/* Card 3: Gap Score */}
        <div className="p-4 rounded-2xl bg-white/80 border border-red-200 shadow-xs">
          <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">
            Gap Score
          </span>
          <div className="text-3xl font-extrabold text-red-600 font-mono my-1">
            {d.gapScore}
          </div>
          <span className="text-[11px] text-red-600 font-semibold">
            Severe Shortage
          </span>
        </div>

        {/* Card 4: 6M Shortage Probability */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            6M Shortage Prob
          </span>
          <div className="text-3xl font-extrabold text-slate-900 font-mono my-1">
            {d.shortageProbability6M}%
          </div>
          <span className="text-[11px] text-red-600 font-semibold">
            Critical Threshold
          </span>
        </div>

        {/* Card 5: Training Capacity */}
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Training Capacity
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-700 font-mono my-1">
            {d.trainingCentresCount} Centres
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            {d.totalTrainingSeats} Active Seats
          </span>
        </div>
      </div>

      {/* Top Shortage vs Oversupplied Trades (Section 23) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Shortage Trades */}
        <GlassPanel
          title="Top Shortage Trades in District"
          subtitle="Occupations with acute vacancy backlogs and insufficient training seat pipelines."
        >
          <div className="space-y-3">
            {d.topShortageTrades.map((trade, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-red-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                      {trade}
                    </strong>
                    <span className="text-[10px] text-red-700 font-semibold">
                      Deficit requiring urgent seat reallocation
                    </span>
                  </div>
                </div>

                <Link
                  href="/scenarios"
                  className="px-2.5 py-1 text-[11px] font-bold bg-white text-red-700 hover:bg-red-100 rounded-lg border border-red-200 transition-all shadow-2xs"
                >
                  Simulate →
                </Link>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Top Oversupplied Trades */}
        <GlassPanel
          title="Top Oversupplied Trades in District"
          subtitle="Legacy training programmes exceeding local industrial absorption."
        >
          <div className="space-y-3">
            {d.topOversuppliedTrades.map((trade, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                      {trade}
                    </strong>
                    <span className="text-[10px] text-indigo-700 font-semibold">
                      Candidate placement rate falling below 45%
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                  Donor Trade
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Recommended Government Interventions for this District (Section 24) */}
      <GlassPanel
        title={`Recommended Government Interventions for ${d.name}`}
        subtitle="Ranked policy actions ready for ministerial consideration."
      >
        <div className="space-y-3">
          {districtRecommendations.length > 0 ? (
            districtRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold font-mono">
                      #{rec.rank}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {rec.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {rec.reason}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/scenarios"
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Simulate</span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-xs text-slate-500 italic bg-slate-50 rounded-xl">
              Recommendation #01 targets Gorakhpur, Uttar Pradesh. View recommendations page for all states.
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}
