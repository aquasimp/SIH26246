'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { Badge } from '@/components/common/Badge';
import { Provenance } from '@/components/common/Provenance';
import { RECOMMENDATIONS } from '@/lib/demoData';
import { Recommendation } from '@/lib/types';
import { getLocalizedEntityName } from '@/lib/i18n';
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
  const { recommendations, approveRecommendation, setActiveEvidence, language, t, l } = useApp();

  const handleExportAll = () => {
    const rows = [
      ['Rank', 'Recommendation ID', 'Title', 'Type', 'Target Trade', 'Source Trade', 'District', 'State', 'Recommended Seats', 'Expected Shortage Reduction', 'Estimated Cost INR', 'Youth Placed', 'Annual Wages INR', 'Public Funds Saved INR', 'Confidence', 'Status'],
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
        r.expectedImpact.youthEmployed || 'N/A',
        r.expectedImpact.annualWageIncomeINR || 'N/A',
        r.expectedImpact.publicFundsSavedINR || 'N/A',
        `${r.confidence}%`,
        r.status
      ])
    ];
    downloadCSV('KaushalYuva_Recommended_Interventions_Dossier.csv', rows);
    toast.success(l(`Exported ${recommendations.length} policy interventions to CSV`, `${recommendations.length} नीतिगत हस्तक्षेप CSV में निर्यात किए गए`));
  };


  const handleApprove = (id: string, title: string) => {
    approveRecommendation(id);
    toast.success(l(`Draft policy intervention approved: ${id}`, `प्रारूप नीति हस्तक्षेप स्वीकृत: ${id}`));
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full overflow-hidden">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
              {l('Government Decision Support Pipeline', 'सरकारी निर्णय सहायता पाइपलाइन')}
            </span>
            <Provenance source="MSDE Verified Registry" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
            {l('Recommended Policy Interventions', 'अनुशंसित नीतिगत हस्तक्षेप')}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            {l('Algorithmic seat reallocation, new NSQF qualification rollouts, and employer co-investment blueprints ranked by expected labour deficit mitigation.', 'अपेक्षित श्रम घाटे में कमी के आधार पर रैंक किए गए एल्गोरिदमिक सीट पुनर्आवंटन, नए NSQF योग्यता रोलआउट और नियोक्ता सह-निवेश ब्लूप्रिंट।')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAll}
          className="px-4 py-2 rounded-xl liquid-control text-xs sm:text-sm font-semibold text-[var(--text)] hover:bg-[var(--glass-strong)] border border-[var(--border)] flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{l('Export All Interventions', 'सभी हस्तक्षेप निर्यात करें')}</span>
        </button>
      </div>

      <FilterBar />

      {/* Portfolio Impact Dossier (§Executive Metrics) */}
      <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--brand)]/30 shadow-xl relative overflow-hidden bg-gradient-to-r from-[var(--brand)]/5 via-transparent to-blue-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)] mb-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--brand)]/15 text-[var(--brand)] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-[var(--brand)]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--brand)] block">
                {l('EXECUTIVE IMPACT DOSSIER · PORTFOLIO LEVEL', 'कार्यकारी प्रभाव विश्लेषण · पोर्टफोलियो स्तर')}
              </span>
              <h2 className="text-base font-extrabold text-[var(--text)]">
                {l('Dossier Impact Overview (Portfolio Consolidation Pending Validation)', 'हस्तक्षेप प्रभाव अवलोकन (पोर्टफोलियो एकत्रीकरण सत्यापन लंबित)')}
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 self-start sm:self-auto">
            {l('Dossier-Level Modeling · 4 Priority Blueprints', 'दस्तावेज़-स्तरीय मॉडलिंग · 4 प्राथमिकता ब्लूप्रिंट')}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-3.5 rounded-2xl glass border border-[var(--border)] space-y-1">
            <span className="text-[10px] font-mono font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {l('TOTAL YOUTH PLACED', 'कुल प्रमाणित युवा रोजगार')}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-faint)] font-mono tabular-nums">
              —
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">
              {l('Validation Pending (Per-Dossier Below)', 'सत्यापन लंबित (नीचे प्रति-दस्तावेज़)')}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl glass border border-[var(--border)] space-y-1">
            <span className="text-[10px] font-mono font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {l('ANNUAL YOUTH WAGES', 'वार्षिक युवा वेतन आय')}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-faint)] font-mono tabular-nums">
              —
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">
              {l('Consolidated Wages Unvalidated', 'समेकित वेतन असत्यापित')}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl glass border border-[var(--border)] space-y-1">
            <span className="text-[10px] font-mono font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {l('PUBLIC CAPEX SAVED', 'सार्वजनिक पूंजी व्यय बचत')}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-faint)] font-mono tabular-nums">
              —
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">
              {l('Rollup Pending Field Audit', 'फील्ड ऑडिट लंबित')}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl glass border border-[var(--border)] space-y-1">
            <span className="text-[10px] font-mono font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {l('PORTFOLIO STATUS', 'पोर्टफोलियो स्थिति')}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--brand)] font-mono tabular-nums">
              {l('UNAGGREGATED', 'असमेकित')}
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-semibold block">
              {l('4 Standalone Dossiers Below', '4 स्वतंत्र हस्तक्षेप नीचे देखें')}
            </span>
          </div>
        </div>
      </div>

      {/* Ranked Recommendation Feed (§6.3) */}
      <div className="space-y-5">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md flex flex-col justify-between hover:border-[var(--brand)] transition-all relative overflow-hidden"
          >
            {/* Top Rank Badge in Brand Ring & Geography (§6.3) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[var(--border)] mb-4">
              <div className="flex items-center gap-3">
                {/* Brand Ring for Rank Number (§6.3) */}
                <div className="w-10 h-10 rounded-full border-2 border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)] font-mono font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
                  #{String(rec.rank).padStart(2, '0')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider font-mono">
                      {rec.id}
                    </span>
                    {/* Dataset derivation chip */}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      rec.id === 'REC-01'
                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25'
                    }`}>
                      {rec.id === 'REC-01'
                        ? (l('MSDE Verified · LP Solver Output', 'MSDE सत्यापित · LP सॉल्वर आउटपुट'))
                        : (l('MSDE Policy Brief · Ensemble Model', 'MSDE नीति संक्षिप्त · पहनावा मॉडल'))}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[var(--text)] mt-0.5">
                    {getLocalizedEntityName('districts', rec.district, language)}, {getLocalizedEntityName('states', rec.state, language)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Badge variant="balanced" size="sm">
                  {l(`Confidence: ${rec.confidence}%`, `विश्वास: ${rec.confidence}%`)}
                </Badge>

                {rec.status === 'approved' && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {l('Draft Approved', 'प्रारूप स्वीकृत')}
                  </span>
                )}
              </div>
            </div>

            {/* Recommendation Title & Rationale */}
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text)] tracking-tight mb-1.5">
                {l(rec.title, rec.titleHi)}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-4xl">
                {l(rec.reason, rec.reasonHi)}
              </p>
            </div>

            {/* Reallocation Corridor Graphic (From Trade -> To Trade) */}
            {rec.fromTrade && (
              <div className="p-3.5 rounded-2xl glass border border-[var(--border)] mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <span className="text-[10px] font-bold text-[var(--oversupply)] uppercase block font-mono">
                    {l('Capacity Donor Trade (Surplus)', 'क्षमता दाता व्यवसाय (अधिशेष)')}
                  </span>
                  <strong className="text-[var(--text)] font-semibold truncate block">
                    {getLocalizedEntityName('occupations', rec.fromTrade, language, rec.fromTradeHi || rec.fromTrade)}
                  </strong>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono block">NCO {rec.fromNco}</span>
                </div>

                <div className="flex flex-col items-center shrink-0">
                  <span className="px-2.5 py-0.5 rounded-md bg-[var(--brand)]/15 text-[var(--brand)] font-extrabold text-[11px] font-mono border border-[var(--brand)]/30">
                    {l(`Shift ${rec.recommendedSeats} Seats`, `${rec.recommendedSeats} सीटें स्थानांतरित`)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-faint)] mt-1 hidden sm:block" />
                </div>

                <div className="flex-1 text-center sm:text-right min-w-0">
                  <span className="text-[10px] font-bold text-[var(--severe)] uppercase block font-mono">
                    {l('Target Trade (Severe Shortage)', 'लक्षित व्यवसाय (गंभीर कमी)')}
                  </span>
                  <strong className="text-[var(--text)] font-semibold truncate block">
                    {getLocalizedEntityName('occupations', rec.toTrade, language, rec.toTradeHi || rec.toTrade)}
                  </strong>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono block">NCO {rec.toNco}</span>
                </div>
              </div>
            )}

            {/* REC-01 Two Explicit Rows (§8) */}
            {rec.options && rec.options.length > 0 && (
              <div className="mb-4 p-3.5 rounded-2xl glass border border-[var(--brand)]/30 space-y-2.5 bg-[var(--surface-solid)]/40">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--brand)] uppercase tracking-wider">
                  <span>{l('Implementation Pathways (2 Options)', 'कार्यान्वयन विकल्प (2 विकल्प)')}</span>
                  <span className="text-[10px] text-[var(--text-faint)]">{l('LP Solver Validated', 'एलपी सॉल्वर सत्यापित')}</span>
                </div>
                <div className="space-y-2">
                  {rec.options.map((opt, idx) => (
                    <div 
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-card)] gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] flex items-center justify-center font-mono font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-extrabold text-[var(--text)] block">
                            {l(opt.label, opt.labelHi)}
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">
                            {l(opt.detailsEn, opt.detailsHi)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 font-mono self-end sm:self-auto">
                        <span className="px-2.5 py-0.5 rounded-md bg-[var(--success)]/15 text-[var(--success)] font-extrabold">
                          {opt.gapReductionPercent}% {l('Reduction', 'कमी')}
                        </span>
                        <span className="font-extrabold text-[var(--text)]">
                          {formatINR(opt.costINR)}
                        </span>
                        <span className="text-[var(--text-muted)]">
                          ({opt.seats} {l('seats', 'सीटें')})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REC-02/03 Derivation and Assumptions (§9) */}
            {rec.assumptions && (
              <div className="mb-4 p-3.5 rounded-2xl glass border border-amber-500/25 space-y-2 bg-[var(--surface-solid)]/40 text-xs">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider">
                  <span className="text-amber-600 dark:text-amber-400">
                    {l('Model Derivation & Assumptions', 'मॉडल व्युत्पत्ति एवं परिकल्पनाएं')}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                    {l('Assumption', 'परिकल्पना')}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-[var(--surface-card)] border border-[var(--border)]">
                    <span className="text-[var(--text-faint)] block text-[10px] uppercase">{l('Deficit', 'घाटा')}</span>
                    <strong className="text-[var(--severe)] font-extrabold">{rec.assumptions.deficit}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--surface-card)] border border-[var(--border)]">
                    <span className="text-[var(--text-faint)] block text-[10px] uppercase">{l('Recommended Seats', 'अनुशंसित सीटें')}</span>
                    <strong className="text-[var(--brand)] font-extrabold">{rec.assumptions.seats}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--surface-card)] border border-[var(--border)] sm:col-span-2">
                    <span className="text-[var(--text-faint)] block text-[10px] uppercase">{l('Capex Rate', 'पूंजी व्यय दर')}</span>
                    <strong className="text-[var(--text)] font-semibold">{l(rec.assumptions.capexRate, rec.assumptions.capexRateHi)}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--surface-card)] border border-[var(--border)] col-span-1 sm:col-span-2 lg:col-span-4">
                    <span className="text-[var(--text-faint)] block text-[10px] uppercase">{l('Staged Funnel Conversion', 'चरणबद्ध फ़नल रूपांतरण')}</span>
                    <span className="text-[var(--text-muted)] text-[10px]">{l(rec.assumptions.funnelConversion, rec.assumptions.funnelConversionHi)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Expected Impact Stats Grid in aligned responsive grid (§6.3, §D) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-6 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl glass-strong border border-[var(--border)] shadow-2xs mb-4 text-center">
              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  {l('Shortfall Closed', 'कमी भरपाई')}
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[var(--success)] font-mono tabular-nums whitespace-nowrap block">
                  -{rec.expectedImpact.gapReductionPercent}%
                </span>
                <span className="text-[9px] text-[var(--success)] font-semibold block whitespace-nowrap">{l('Deficit Mitigated', 'अनुमानित भरपाई')}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  {l('Supply Coverage', 'आपूर्ति कवरेज')}
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[var(--brand)] font-mono tabular-nums whitespace-nowrap block">
                  +{rec.expectedImpact.supplyCoveragePercent}%
                </span>
                <span className="text-[9px] text-[var(--brand)] font-semibold block whitespace-nowrap">{l('Employable Pool', 'रोजगार योग्य पूल')}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  {l('Youth Placed', 'प्रमाणित युवा रोजगार')}
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[var(--brand)] font-mono tabular-nums whitespace-nowrap block">
                  +{rec.expectedImpact.youthEmployed || Math.round(rec.recommendedSeats * 0.5)}
                </span>
                <span className="text-[9px] text-[var(--text-muted)] font-semibold block whitespace-nowrap">{l('Direct Jobs', 'सीधे रोजगार')}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  {l('Annual Wages', 'वार्षिक युवा आय')}
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[var(--success)] font-mono tabular-nums whitespace-nowrap block">
                  {rec.expectedImpact.annualWageIncomeINR ? formatINR(rec.expectedImpact.annualWageIncomeINR) : 'N/A'}
                </span>
                <span className="text-[9px] text-[var(--success)] font-semibold block whitespace-nowrap">{l('District Wages', 'वार्षिक वेतन')}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  {l('Capex Saved', 'पूंजी व्यय बचत')}
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[var(--text)] font-mono tabular-nums whitespace-nowrap block">
                  {rec.expectedImpact.publicFundsSavedINR ? formatINR(rec.expectedImpact.publicFundsSavedINR) : 'N/A'}
                </span>
                <span className="text-[9px] text-[var(--text-muted)] font-semibold block font-mono whitespace-nowrap">{l('vs Greenfield', 'पुनरुपयोग बचत')}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  {l('Package Cost', 'पैकेज लागत')}
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[var(--text)] font-mono tabular-nums whitespace-nowrap block">
                  {formatINR(rec.expectedImpact.estimatedCostINR)}
                </span>
                <span className="text-[9px] text-[var(--brand)] font-semibold block font-mono whitespace-nowrap">
                  {rec.expectedImpact.roiMultiple ? `${rec.expectedImpact.roiMultiple}x ${l('ROI', 'प्रतिफल')}` : (l('₹6,500/seat', '₹6,500/सीट'))}
                </span>
              </div>
            </div>

            {/* Bottom Actions Bar (§6.3: Simulate, View Evidence, Export, Approve) */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 pt-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveEvidence(rec)}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl liquid-control text-xs font-bold text-[var(--text)] hover:bg-[var(--glass-strong)] border border-[var(--border)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[var(--brand)]" />
                  <span>{l('View Empirical Evidence', 'अनुभवजन्य साक्ष्य देखें')}</span>
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
                    toast.success(l(`Action brief for ${rec.id} (${rec.recommendedSeats} seats) downloaded`, `कार्यवाही संक्षिप्त डाउनलोड हुई: ${rec.id} (${rec.recommendedSeats} सीटें)`));
                  }}
                  className="p-2 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                  title={l('Export Action Brief', 'कार्यवाही संक्षिप्त निर्यात')}
                  aria-label={l('Export Action Brief', 'कार्यवाही संक्षिप्त निर्यात')}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/scenarios?preset=rec0${rec.rank}`}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-amber-300" />
                  <span>{l('Simulate in Studio', 'स्टूडियो में अनुकरण')}</span>
                </Link>

                {rec.status !== 'approved' ? (
                  <button
                    type="button"
                    onClick={() => handleApprove(rec.id, rec.title)}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[var(--success)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{l('Approve Draft Action', 'प्रारूप कार्रवाई स्वीकृत करें')}</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl glass text-[var(--text-muted)] text-xs font-bold border border-[var(--border)]">
                    {l('Draft Approved', 'प्रारूप स्वीकृत')}
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
