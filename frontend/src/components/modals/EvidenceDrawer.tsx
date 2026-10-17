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
import { Provenance } from '@/components/common/Provenance';

export const EvidenceDrawer: React.FC = () => {
  const { activeEvidence, setActiveEvidence, approveRecommendation } = useApp();

  // Close on Escape key
  React.useEffect(() => {
    if (!activeEvidence) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setActiveEvidence(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEvidence, setActiveEvidence]);

  if (!activeEvidence) return null;

  const rec = activeEvidence;

  const handleExportEvidence = () => {
    const rows = [
      ['KaushalYuva Policy Recommendation Dossier', 'CONFIDENTIAL - MSDE USE ONLY'],
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
    downloadCSV(`KaushalYuva_Evidence_${rec.id}_${rec.district}.csv`, rows);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) setActiveEvidence(null); }}
      role="dialog"
      aria-modal="true"
      aria-label="Recommendation Evidence Dossier"
    >
      <div className="w-full max-w-xl h-full overlay border-l border-[var(--border-strong)] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[var(--border)] glass-strong">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[var(--brand)] text-white font-extrabold text-xs font-mono">
                #{String(rec.rank).padStart(2, '0')}
              </span>
              <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider font-mono">
                {rec.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--balanced)]/10 text-[var(--balanced)] border border-[var(--balanced)]/20 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Confidence: {rec.confidence}%
              </span>
            </div>

            <button
              onClick={() => setActiveEvidence(null)}
              className="p-2 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-[var(--text)] tracking-tight">
            {rec.title}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Geography: <strong className="text-[var(--text)]">{rec.district}, {rec.state}</strong>
          </p>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-[var(--text)] text-xs sm:text-sm">
          {/* Section: Algorithmic Rationale */}
          <div className="p-4 rounded-2xl glass border border-[var(--brand)]/30">
            <span className="text-[11px] font-bold text-[var(--brand)] uppercase tracking-wider flex items-center gap-1.5 mb-1.5 font-mono">
              <Sparkles className="w-4 h-4 text-[var(--brand)]" />
              Strategic Planning Rationale
            </span>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {rec.reason}
            </p>
          </div>

          {/* Section: Evidence Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] flex items-center gap-1.5 font-mono">
                <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                Empirical Evidence & Data Provenance
              </h3>
              <Provenance type="synthetic" note="Simulated Funnel" />
            </div>
            
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl glass-strong border border-[var(--border)] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider block font-mono">
                    1. Real-Time Demand Signals
                  </span>
                  <span className="text-[9px] text-[var(--text-faint)] font-medium">NCS / Aggregated Feed</span>
                </div>
                <p className="text-[var(--text-muted)] text-xs">{rec.evidence.demandSignal}</p>
              </div>

              <div className="p-3 rounded-xl glass-strong border border-[var(--border)] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
                    2. Employer Vacancy Expansion
                  </span>
                  <Provenance type="synthetic" note="Projected" />
                </div>
                <p className="text-[var(--text-muted)] text-xs">{rec.evidence.vacancyGrowth}</p>
              </div>

              <div className="p-3 rounded-xl glass-strong border border-[var(--border)] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
                    3. Placement Rates & Pipeline Saturation
                  </span>
                  <Provenance type="synthetic" note="Projected" />
                </div>
                <p className="text-[var(--text-muted)] text-xs">{rec.evidence.supplyStagnation}</p>
              </div>

              <div className="p-3 rounded-xl glass-strong border border-[var(--border)] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-mono">
                    4. Employer Letters of Intent (LOIs)
                  </span>
                  <Provenance type="synthetic" note="Projected" />
                </div>
                <p className="text-[var(--text-muted)] text-xs">{rec.evidence.employerHiringTrend}</p>
              </div>
            </div>
          </div>

          {/* Section: Expected Impact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] mb-3 flex items-center gap-1.5 font-mono">
              <TrendingUp className="w-4 h-4 text-[var(--balanced)]" />
              Projected Intervention Outcome
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl glass border border-[var(--balanced)]/30 text-center">
                <span className="text-[10px] font-bold text-[var(--balanced)] uppercase block font-mono">Gap Reduction</span>
                <div className="text-xl font-extrabold text-[var(--balanced)] mt-1 font-mono">
                  -{rec.expectedImpact.gapReductionPercent}%
                </div>
                <span className="text-[9px] text-[var(--text-faint)]">6M Outlook</span>
              </div>

              <div className="p-3 rounded-xl glass border border-[var(--brand)]/30 text-center">
                <span className="text-[10px] font-bold text-[var(--brand)] uppercase block font-mono">Supply Coverage</span>
                <div className="text-xl font-extrabold text-[var(--brand)] mt-1 font-mono">
                  +{rec.expectedImpact.supplyCoveragePercent}%
                </div>
                <span className="text-[9px] text-[var(--text-faint)]">Employable pool</span>
              </div>

              <div className="p-3 rounded-xl glass border border-purple-500/30 text-center">
                <span className="text-[10px] font-bold text-purple-400 uppercase block font-mono">Est. Cost</span>
                <div className="text-sm font-extrabold text-purple-400 mt-2 font-mono">
                  {formatINR(rec.expectedImpact.estimatedCostINR)}
                </div>
                <span className="text-[9px] text-[var(--text-faint)]">Subsidies & Lab</span>
              </div>
            </div>
          </div>

          {/* Section: Constraints & Risks */}
          <div className="p-3.5 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/20">
            <span className="text-[11px] font-bold text-[var(--warning)] uppercase tracking-wider flex items-center gap-1 mb-1 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--warning)]" />
              Deployment Constraints & Pre-conditions
            </span>
            <p className="text-[var(--text)] text-xs leading-relaxed">
              {rec.constraints}
            </p>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-5 border-t border-[var(--border)] glass-strong flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportEvidence}
              className="px-3 py-2 rounded-xl liquid-control text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[var(--text)]"
            >
              <Download className="w-3.5 h-3.5 text-[var(--brand)]" />
              Export Dossier (CSV)
            </button>
            <a
              href="/scenarios"
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
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
                ? 'bg-slate-500/20 text-[var(--text-faint)] pointer-events-none'
                : 'bg-[var(--balanced)] hover:opacity-90 text-white'
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
