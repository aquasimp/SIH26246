'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { RECOMMENDATIONS } from '@/lib/demoData';
import { Recommendation } from '@/lib/types';
import { clsx } from 'clsx';
import { 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Download, 
  Eye, 
  ShieldCheck, 
  Sparkles,
  TrendingDown,
  Building2
} from 'lucide-react';
import { downloadCSV, formatINR } from '@/lib/exportUtils';

export default function RecommendationsPage() {
  const { recommendations, approveRecommendation, setActiveEvidence } = useApp();

  const handleExportAll = () => {
    const rows = [
      ['Rank', 'Recommendation ID', 'Title', 'Type', 'Target Trade', 'Source Trade', 'District', 'State', 'Recommended Seats', 'Expected Shortage Reduction', 'Estimated Cost INR', 'Confidence', 'Status'],
      ...recommendations.map(r => [
        r.rank,
        r.id,
        r.title,
        r.type,
        `${r.toTrade} (${r.toNco})`,
        r.fromTrade ? `${r.fromTrade} (${r.fromNco})` : 'N/A',
        r.district,
        r.state,
        r.recommendedSeats,
        `${r.expectedImpact.gapReductionPercent}%`,
        r.expectedImpact.estimatedCostINR,
        `${r.confidence}%`,
        r.status
      ])
    ];
    downloadCSV('KaushalPulse_Recommended_Interventions_Dossier.csv', rows);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Government Decision Support Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recommended Policy Interventions
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Algorithmic seat reallocation, new NSQF qualification rollouts, and employer co-investment blueprints ranked by expected labour deficit mitigation.
          </p>
        </div>

        <button
          onClick={handleExportAll}
          className="px-4 py-2 rounded-xl liquid-control text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export All Interventions</span>
        </button>
      </div>

      <FilterBar />

      {/* Ranked Recommendation Feed (Sections 28 & 29) */}
      <div className="space-y-5">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-6 rounded-3xl bg-white/90 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all relative overflow-hidden"
          >
            {/* Top Rank Badge & Geography */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center font-mono text-sm shadow-sm shadow-blue-500/30">
                  #{String(rec.rank).padStart(2, '0')}
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {rec.id}
                  </span>
                  <div className="text-sm font-bold text-slate-800">
                    {rec.district}, {rec.state}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Confidence: {rec.confidence}%
                </span>

                {rec.status === 'approved' && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Draft Approved
                  </span>
                )}
              </div>
            </div>

            {/* Recommendation Title & Rationale */}
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                {rec.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                {rec.reason}
              </p>
            </div>

            {/* Reallocation Corridor Graphic (From Trade -> To Trade) */}
            {rec.fromTrade && (
              <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase block">
                    Donor Trade (Oversupplied)
                  </span>
                  <strong className="text-slate-900 font-semibold">{rec.fromTrade}</strong>
                  <span className="text-[10px] text-slate-500 font-mono block">NCO {rec.fromNco}</span>
                </div>

                <div className="flex flex-col items-center shrink-0">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[11px] font-mono">
                    Shift {rec.recommendedSeats} Seats
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-400 mt-1 hidden sm:block" />
                </div>

                <div className="flex-1 text-center sm:text-right">
                  <span className="text-[10px] font-bold text-orange-700 uppercase block">
                    Target Trade (Severe Shortage)
                  </span>
                  <strong className="text-slate-900 font-semibold">{rec.toTrade}</strong>
                  <span className="text-[10px] text-slate-500 font-mono block">NCO {rec.toNco}</span>
                </div>
              </div>
            )}

            {/* Expected Impact Stats Grid */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs mb-4 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Shortage Reduction
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono">
                  -{rec.expectedImpact.gapReductionPercent}%
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Estimated Effect</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Supply Coverage
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-blue-600 font-mono">
                  +{rec.expectedImpact.supplyCoveragePercent}%
                </span>
                <span className="text-[10px] text-blue-600 font-semibold block">Employable Pool</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Intervention Budget
                </span>
                <span className="text-base sm:text-xl font-extrabold text-purple-700 font-mono">
                  {formatINR(rec.expectedImpact.estimatedCostINR)}
                </span>
                <span className="text-[10px] text-purple-600 font-semibold block">Training Capex/Opex</span>
              </div>
            </div>

            {/* Bottom Actions Bar (Section 28: Simulate, Approve draft, Export, View evidence) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveEvidence(rec)}
                  className="px-3.5 py-2 rounded-xl liquid-control text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Empirical Evidence</span>
                </button>

                <button
                  onClick={() => {
                    const rows = [
                      ['Policy Action ID', rec.id],
                      ['Title', rec.title],
                      ['Geography', `${rec.district}, ${rec.state}`],
                      ['Seats', rec.recommendedSeats],
                      ['Expected Gap Reduction', `${rec.expectedImpact.gapReductionPercent}%`],
                      ['Confidence', `${rec.confidence}%`]
                    ];
                    downloadCSV(`MSDE_Action_${rec.id}.csv`, rows);
                  }}
                  className="p-2 rounded-xl liquid-control text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
                  title="Export Action Brief"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/scenarios"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Simulate in Studio</span>
                </Link>

                {rec.status !== 'approved' ? (
                  <button
                    onClick={() => approveRecommendation(rec.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Draft Action</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                    Draft Approved
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
