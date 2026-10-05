'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { Badge } from '@/components/common/Badge';
import { Provenance } from '@/components/common/Provenance';
import { RECOMMENDATIONS } from '@/lib/demoData';
import { Recommendation } from '@/lib/types';
import { toast } from 'sonner';
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
    toast.success('Complete policy interventions dossier exported to CSV');
  };

  const handleApprove = (id: string, title: string) => {
    approveRecommendation(id);
    toast.success(`Draft policy intervention approved: ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
              Government Decision Support Pipeline
            </span>
            <Provenance source="Official SIH" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
            Recommended Policy Interventions
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            Algorithmic seat reallocation, new NSQF qualification rollouts, and employer co-investment blueprints ranked by expected labour deficit mitigation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAll}
          className="px-4 py-2 rounded-xl liquid-control text-xs sm:text-sm font-semibold text-[var(--text)] hover:bg-[var(--glass-strong)] border border-[var(--border)] flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export All Interventions</span>
        </button>
      </div>

      <FilterBar />

      {/* Ranked Recommendation Feed (§6.3) */}
      <div className="space-y-5">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md flex flex-col justify-between hover:border-[var(--brand)] transition-all relative overflow-hidden"
          >
            {/* Top Rank Badge in Brand Ring & Geography (§6.3) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)] mb-4">
              <div className="flex items-center gap-3">
                {/* Brand Ring for Rank Number (§6.3) */}
                <div className="w-10 h-10 rounded-full border-2 border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)] font-mono font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
                  #{String(rec.rank).padStart(2, '0')}
                </div>
                <div>
                  <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider font-mono">
                    {rec.id}
                  </span>
                  <div className="text-sm font-bold text-[var(--text)]">
                    {rec.district}, {rec.state}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Badge variant="balanced" size="sm">
                  Confidence: {rec.confidence}%
                </Badge>

                {rec.status === 'approved' && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Draft Approved
                  </span>
                )}
              </div>
            </div>

            {/* Recommendation Title & Rationale */}
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text)] tracking-tight mb-1.5">
                {rec.title}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-4xl">
                {rec.reason}
              </p>
            </div>

            {/* Reallocation Corridor Graphic (From Trade -> To Trade) */}
            {rec.fromTrade && (
              <div className="p-3.5 rounded-2xl glass border border-[var(--border)] mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-[var(--oversupply)] uppercase block font-mono">
                    Capacity Donor Trade (Surplus)
                  </span>
                  <strong className="text-[var(--text)] font-semibold">{rec.fromTrade}</strong>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono block">NCO {rec.fromNco}</span>
                </div>

                <div className="flex flex-col items-center shrink-0">
                  <span className="px-2.5 py-0.5 rounded-md bg-[var(--brand)]/15 text-[var(--brand)] font-extrabold text-[11px] font-mono border border-[var(--brand)]/30">
                    Shift {rec.recommendedSeats} Seats
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-faint)] mt-1 hidden sm:block" />
                </div>

                <div className="flex-1 text-center sm:text-right">
                  <span className="text-[10px] font-bold text-[var(--severe)] uppercase block font-mono">
                    Target Trade (Severe Shortage)
                  </span>
                  <strong className="text-[var(--text)] font-semibold">{rec.toTrade}</strong>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono block">NCO {rec.toNco}</span>
                </div>
              </div>
            )}

            {/* Expected Impact Stats Grid in aligned 3-column mini-grid (§6.3) */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl glass border border-[var(--border)] shadow-2xs mb-4 text-center">
              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  Shortage Reduction
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-[var(--success)] font-mono tabular-nums">
                  -{rec.expectedImpact.gapReductionPercent}%
                </span>
                <span className="text-[10px] text-[var(--success)] font-semibold block">Estimated Closure</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  Supply Coverage
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-[var(--brand)] font-mono tabular-nums">
                  +{rec.expectedImpact.supplyCoveragePercent}%
                </span>
                <span className="text-[10px] text-[var(--brand)] font-semibold block">Employable Pool</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  Package Cost
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[var(--text)] font-mono tabular-nums">
                  {formatINR(rec.expectedImpact.estimatedCostINR)}
                </span>
                <span className="text-[10px] text-[var(--text-faint)] font-semibold block font-mono">₹6,500/seat retrofit</span>
              </div>
            </div>

            {/* Bottom Actions Bar (§6.3: Simulate, View Evidence, Export, Approve) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEvidence(rec)}
                  className="px-3.5 py-2 rounded-xl liquid-control text-xs font-bold text-[var(--text)] hover:bg-[var(--glass-strong)] border border-[var(--border)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[var(--brand)]" />
                  <span>View Empirical Evidence</span>
                </button>

                <button
                  type="button"
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
                    toast.success(`Action brief for ${rec.id} downloaded`);
                  }}
                  className="p-2 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                  title="Export Action Brief"
                  aria-label="Export Action Brief"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/scenarios?preset=rec0${rec.rank}`}
                  className="px-4 py-2 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-amber-300" />
                  <span>Simulate in Studio</span>
                </Link>

                {rec.status !== 'approved' ? (
                  <button
                    type="button"
                    onClick={() => handleApprove(rec.id, rec.title)}
                    className="px-4 py-2 rounded-xl bg-[var(--success)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Draft Action</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl glass text-[var(--text-muted)] text-xs font-bold border border-[var(--border)]">
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
