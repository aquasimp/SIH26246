'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { clsx } from 'clsx';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles,
  Download,
  Share2
} from 'lucide-react';
import { downloadCSV, formatINR } from '@/lib/exportUtils';

export const EvidenceDrawer: React.FC = () => {
  const { activeEvidence, setActiveEvidence, approveRecommendation } = useApp();

  if (!activeEvidence) return null;

  const rec = activeEvidence;

  const handleExportEvidence = () => {
    const rows = [
      ['KaushalPulse Policy Recommendation Dossier', 'CONFIDENTIAL - MSDE USE ONLY'],
      ['Recommendation ID', rec.id],
      ['Title', rec.title],
      ['Target Trade', `${rec.toTrade} (${rec.toNco})`],
      ['Source Trade (Donor)', rec.fromTrade ? `${rec.fromTrade} (${rec.fromNco})` : 'N/A'],
      ['Geography', `${rec.district}, ${rec.state}`],
      ['Recommended Reallocated Seats', rec.recommendedSeats],
      ['Confidence Score', `${rec.confidence}%`],
      ['Run ID', 'RUN-2026-10-04-001'],
      [''],
      ['EVIDENCE SECTION', 'DATA PROVENANCE'],
      ['Demand Signal', rec.evidence.demandSignal],
      ['Vacancy Growth', rec.evidence.vacancyGrowth],
      ['Supply Stagnation', rec.evidence.supplyStagnation],
      ['Employer Hiring Trend', rec.evidence.employerHiringTrend],
      [''],
      ['PROJECTED OUTCOME', 'METRICS'],
      ['Net Gap Reduction', `${rec.expectedImpact.gapReductionPercent}%`],
      ['Supply Coverage Increase', `${rec.expectedImpact.supplyCoveragePercent}%`],
      ['Estimated Budget Required', formatINR(rec.expectedImpact.estimatedCostINR)],
      ['Constraints', rec.constraints]
    ];
    downloadCSV(`KaushalPulse_Evidence_${rec.id}_${rec.district}.csv`, rows);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-full bg-white/95 backdrop-blur-xl border-l border-slate-200/90 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200/70 bg-slate-50/70">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-extrabold text-xs">
                #{String(rec.rank).padStart(2, '0')}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                {rec.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Confidence: {rec.confidence}%
              </span>
            </div>

            <button
              onClick={() => setActiveEvidence(null)}
              className="p-2 rounded-xl hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {rec.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Geography: <strong className="text-slate-800">{rec.district}, {rec.state}</strong>
          </p>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800 text-xs sm:text-sm">
          {/* Section: Algorithmic Rationale */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Strategic Planning Rationale
            </span>
            <p className="text-slate-700 leading-relaxed">
              {rec.reason}
            </p>
          </div>

          {/* Section: Evidence Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-700" />
                Empirical Evidence & Data Provenance
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Synthetic data
              </span>
            </div>
            
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                    1. Real-Time Demand Signals
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">NCS / Aggregated Feed</span>
                </div>
                <p className="text-slate-700 text-xs">{rec.evidence.demandSignal}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    2. Employer Vacancy Expansion
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Synthetic data
                  </span>
                </div>
                <p className="text-slate-700 text-xs">{rec.evidence.vacancyGrowth}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    3. Placement Rates & Pipeline Saturation
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Synthetic data
                  </span>
                </div>
                <p className="text-slate-700 text-xs">{rec.evidence.supplyStagnation}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    4. Employer Letters of Intent (LOIs)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Synthetic data
                  </span>
                </div>
                <p className="text-slate-700 text-xs">{rec.evidence.employerHiringTrend}</p>
              </div>
            </div>
          </div>

          {/* Section: Expected Impact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Projected Intervention Outcome
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/70 text-center">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Gap Reduction</span>
                <div className="text-xl font-extrabold text-emerald-700 mt-1 font-mono">
                  -{rec.expectedImpact.gapReductionPercent}%
                </div>
                <span className="text-[9px] text-emerald-600">6M Outlook</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/70 text-center">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Supply Coverage</span>
                <div className="text-xl font-extrabold text-blue-700 mt-1 font-mono">
                  +{rec.expectedImpact.supplyCoveragePercent}%
                </div>
                <span className="text-[9px] text-blue-600">Employable pool</span>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200/70 text-center">
                <span className="text-[10px] font-bold text-purple-800 uppercase block">Est. Cost</span>
                <div className="text-sm font-extrabold text-purple-700 mt-2 font-mono">
                  {formatINR(rec.expectedImpact.estimatedCostINR)}
                </div>
                <span className="text-[9px] text-purple-600">Subsidies & Lab</span>
              </div>
            </div>
          </div>

          {/* Section: Constraints & Risks */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/70">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Deployment Constraints & Pre-conditions
            </span>
            <p className="text-slate-700 text-xs leading-relaxed">
              {rec.constraints}
            </p>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-5 border-t border-slate-200/80 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportEvidence}
              className="px-3 py-2 rounded-xl liquid-control text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Dossier (CSV)
            </button>
            <a
              href="/scenarios"
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              Simulate in Studio →
            </a>
          </div>

          <button
            onClick={() => {
              approveRecommendation(rec.id);
              setActiveEvidence(null);
            }}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer',
              rec.status === 'approved'
                ? 'bg-slate-300 text-slate-700 pointer-events-none'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            )}
          >
            <CheckCircle className="w-4 h-4" />
            {rec.status === 'approved' ? 'Draft Approved' : 'Approve Draft Action'}
          </button>
        </div>
      </div>
    </div>
  );
};
