'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { IndiaIntelligenceMap } from '@/components/maps/IndiaIntelligenceMap';
import { KpiCard } from '@/components/common/KpiCard';
import { Badge } from '@/components/common/Badge';
import { Provenance } from '@/components/common/Provenance';
import { OCCUPATIONS, RECOMMENDATIONS, DISTRICTS } from '@/lib/demoData';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles, 
  Download, 
  Sliders, 
  ChevronRight, 
  Eye,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

export default function OverviewPage() {
  const { t, setActiveEvidence, setSelectedDistrict, setSelectedOccupationNco, language } = useApp();

  const metrics = useMemo(() => {
    const totalDemand = OCCUPATIONS.reduce((acc, o) => acc + o.currentDemand, 0);
    const totalEffectiveSupply = OCCUPATIONS.reduce((acc, o) => acc + o.effectiveSupply, 0);
    const netShortfall = Math.max(0, totalDemand - totalEffectiveSupply);
    const atRiskTrades = OCCUPATIONS.filter(o => o.gapScore >= 75 || o.gapScore <= 25).length;
    return {
      demandFormatted: (totalDemand / 1000).toFixed(1) + 'K',
      supplyFormatted: (totalEffectiveSupply / 1000).toFixed(1) + 'K',
      shortfallFormatted: (netShortfall / 1000).toFixed(1) + 'K',
      atRiskCount: atRiskTrades,
      activeAlertsCount: 35, // 35 verified anomalies from alert engine (§4.1)
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
      {/* Hero Header (§6.1) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
              National Intelligence Dashboard
            </span>
            <Provenance source="Official SIH" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            {t.nationalIntelligence}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-1 max-w-3xl leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <Link
            href="/scenarios?preset=rec01"
            className="px-4 py-2 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs sm:text-sm font-bold shadow-md shadow-[var(--brand)]/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>Open Scenario Studio</span>
          </Link>
        </div>
      </div>

      {/* Global Filter Bar */}
      <FilterBar />

      {/* Asymmetric Hero KPI Cards (§4.3 sign convention & scope visibility, §5.4, §6.1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard
          label={t.metrics.demand}
          value={metrics.demandFormatted}
          delta={{ value: '+18.6%', isPositive: true, label: '6M Growth' }}
          scope="National Vacancies"
          provenance="Official SIH"
          trend={[12, 14, 15, 16, 17, 18.6]}
        />

        <KpiCard
          label={t.metrics.effectiveSupply}
          value={metrics.supplyFormatted}
          delta={{ value: 'Staged Pool', isNeutral: true, label: '0.70 Readiness' }}
          scope="Certified & Active"
          provenance="Official SIH"
          trend={[6.8, 7.1, 7.4, 7.8, 8.1, 8.3]}
        />

        {/* Structural Shortfall: positive number, never negative (§4.3) */}
        <KpiCard
          label="Structural Shortfall"
          value={metrics.shortfallFormatted}
          delta={{ value: 'National Deficit', isPositive: false, label: 'Unmet Need' }}
          scope="Purvanchal & Corridors"
          severity="severe"
          provenance="Official SIH"
          trend={[8.2, 8.9, 9.4, 9.8, 10.1, 10.3]}
        />

        <KpiCard
          label={t.metrics.atRiskTrades}
          value={metrics.atRiskCount}
          delta={{ value: 'Imbalance', isPositive: false, label: 'Score >75 / <25' }}
          scope="NCO Specializations"
          severity="moderate"
          provenance="Official SIH"
          trend={[2, 3, 3, 4, 4, 4]}
        />

        {/* Early Warnings: synced to 35 alert engine anomalies (§4.1) */}
        <Link href="/alerts" className="block focus-visible:outline-hidden">
          <KpiCard
            label="Intelligence Signals"
            value={metrics.activeAlertsCount}
            delta={{ value: 'Alert Engine', isPositive: false, label: '35 Anomalies' }}
            scope="Critical Shortage #1"
            severity="severe"
            provenance="Official SIH"
            trend={[28, 30, 32, 34, 35, 35]}
            className="hover:border-[var(--severe)] cursor-pointer"
          />
        </Link>

        <Link href="/recommendations" className="block focus-visible:outline-hidden">
          <KpiCard
            label={t.metrics.recommendations}
            value={metrics.recommendationsCount}
            delta={{ value: 'Ranked Actions', isPositive: true, label: 'Interventions' }}
            scope="Pending Approval"
            severity="balanced"
            provenance="Official SIH"
            trend={[2, 3, 4, 4, 4, 4]}
            className="hover:border-[var(--brand)] cursor-pointer"
          />
        </Link>
      </div>

      {/* Decision Ribbon (§6.1) */}
      <div className="p-3.5 sm:p-4 rounded-2xl glass-strong border-l-4 border-l-[var(--severe)] border-[var(--border)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--severe)]/15 text-[var(--severe)] shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-0.5">
            <div className="font-bold text-[var(--text)] flex items-center gap-2">
              <span className="uppercase text-[10px] font-mono font-extrabold text-[var(--severe)] bg-[var(--severe)]/10 px-2 py-0.5 rounded border border-[var(--severe)]/20">
                ACTION REQUIRED
              </span>
              <span>•</span>
              <span className="font-semibold text-sm">Gorakhpur · Solar PV Installer (NCO 7126.0101)</span>
            </div>
            <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
              Projected 6M shortage probability is <strong className="text-[var(--severe)] font-mono">88%</strong> (Shortfall: 711 candidates). Recommended intervention: Reallocate <strong className="text-[var(--brand)] font-mono">97 seats</strong> from Retail Sales Associate (saving ₹6.3L vs new capacity).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <Link
            href="/districts/gorakhpur"
            className="px-3 py-1.5 rounded-xl liquid-control text-xs font-bold text-[var(--text)] hover:bg-[var(--glass-strong)] transition-all cursor-pointer"
          >
            Investigate
          </Link>
          <Link
            href="/scenarios?preset=rec01"
            className="px-3.5 py-1.5 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
            <span>Simulate Fix</span>
          </Link>
        </div>
      </div>

      {/* "What Changed?" Intelligence Stream (§4.1, §6.1 canonical audit tie-out) */}
      <div className="p-3 sm:p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="p-1.5 rounded-lg bg-[var(--brand)] text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)] font-mono">
              What Changed in Current Pipeline Run?
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Canonical Solar velocity: -0.1% (§4.1) */}
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict('gorakhpur');
                setSelectedOccupationNco('7126.0101');
              }}
              className="px-3 py-1.5 rounded-xl glass hover:border-[var(--severe)] text-[var(--text)] font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-[var(--border)]"
              title="Solar PV Installer demand velocity: -0.1% 6M (t-6 to t)"
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-[var(--severe)]" />
              <span><strong>Solar PV Installer</strong> demand growth <strong>-0.1%</strong> in Gorakhpur (acute shortfall persists)</span>
            </button>

            {/* Canonical Retail velocity: -10.0% (§4.1) */}
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict('gorakhpur');
                setSelectedOccupationNco('5223.0101');
              }}
              className="px-3 py-1.5 rounded-xl glass hover:border-[var(--border-strong)] text-[var(--text)] font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-[var(--border)]"
              title="Retail Sales Associate demand velocity: -10.0% 6M (t-6 to t)"
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
              <span><strong>Retail Sales Associate</strong> softened <strong>-10.0%</strong> (physical capacity surplus)</span>
            </button>

            {/* Canonical Gorakhpur Shortage Probability: 88% (§4.1) */}
            <Link
              href="/alerts"
              className="px-3 py-1.5 rounded-xl glass border border-[var(--severe)]/30 text-[var(--text)] hover:border-[var(--severe)] font-medium flex items-center gap-1.5 transition-all"
              title="Gorakhpur shortage probability reached 88%"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--severe)]" />
              <span><strong>Gorakhpur</strong> shortage risk reached <strong>88%</strong> probability</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Strategic Anchor: Why This Matters */}
      <div className="px-4 py-3 rounded-2xl glass border border-amber-500/30 text-amber-500/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm text-[var(--text)] font-medium leading-relaxed">
            <strong className="font-bold uppercase tracking-wide mr-1.5 text-amber-500 font-mono">Why This Matters:</strong>
            If training capacity is planned without forward-looking demand signals, districts continue funding legacy trades with low hiring absorption while high-growth sectors remain critically understaffed.
          </p>
        </div>
        <Link
          href="/scenarios?preset=rec01"
          className="hidden md:flex items-center gap-1 text-xs font-bold text-amber-500 hover:underline shrink-0"
        >
          <span>Simulate Fix →</span>
        </Link>
      </div>

      {/* Main Hero Visual: India Intelligence Map (§5.8, §6.1) */}
      <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text)] tracking-tight">
              National Labour Market Geospatial Intelligence
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Interactive geographic overlay of structural shortages, vacancy pressures, and training infrastructure across state corridors.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-faint)]">
            <Provenance source="Official SIH" />
            <span>NCS + SID Corridors</span>
          </div>
        </div>
        <IndiaIntelligenceMap />
      </div>

      {/* Top Priority Government Interventions Panel (§6.3) */}
      <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text)] tracking-tight">
              Top Priority Policy Interventions (Ranked)
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Targeted government capacity reallocations recommended by the Labour Market Intelligence engine.
            </p>
          </div>
          <Link
            href="/recommendations"
            className="text-xs font-bold text-[var(--brand)] hover:underline flex items-center gap-1"
          >
            <span>View All 4 Recommended Interventions</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECOMMENDATIONS.slice(0, 2).map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-2xl glass border border-[var(--border)] shadow-sm flex flex-col justify-between hover:border-[var(--brand)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--brand)] text-white font-mono text-xs font-bold">
                      #{String(rec.rank).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
                      {rec.district}, {rec.state}
                    </span>
                  </div>
                  <Badge variant="balanced" size="sm">
                    Confidence: {rec.confidence}%
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-[var(--text)] mb-1">
                  {rec.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] mb-3 leading-relaxed">
                  {rec.reason}
                </p>

                {/* Score & Impact Stats */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl glass border border-[var(--border)] mb-3 text-center">
                  <div>
                    <span className="text-[10px] text-[var(--text-faint)] font-bold uppercase tracking-wider block">
                      {language === 'hi' ? 'सीटें' : 'Seats'}
                    </span>
                    <strong className="text-xs sm:text-sm font-bold text-[var(--text)] font-mono tabular-nums">
                      {rec.recommendedSeats}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-faint)] font-bold uppercase tracking-wider block">
                      {language === 'hi' ? 'कमी भरपाई' : 'Shortfall Closed'}
                    </span>
                    <strong className="text-xs sm:text-sm font-bold text-[var(--success)] font-mono tabular-nums">
                      ▼ {language === 'hi' ? `कमी की ${rec.expectedImpact.gapReductionPercent}% भरपाई` : `${rec.expectedImpact.gapReductionPercent}% closed`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-faint)] font-bold uppercase tracking-wider block">
                      {language === 'hi' ? 'लक्षित ट्रेड' : 'Target Trade'}
                    </span>
                    <strong className="text-xs sm:text-sm font-bold text-[var(--brand)] truncate block">
                      {rec.toTrade}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setActiveEvidence(rec)}
                  className="px-3 py-1.5 rounded-xl liquid-control text-xs font-bold text-[var(--text)] hover:bg-[var(--glass-strong)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[var(--brand)]" />
                  <span>View Evidence</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExportAction(rec)}
                    className="p-1.5 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                    title="Export Action Brief CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/scenarios?preset=rec0${rec.rank}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simulate</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
