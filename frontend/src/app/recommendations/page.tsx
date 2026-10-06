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
  const { recommendations, approveRecommendation, setActiveEvidence, language, t } = useApp();
  const isHi = language === 'hi';

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
    downloadCSV('KaushalYuva_Recommended_Interventions_Dossier.csv', rows);
    toast.success(isHi ? `${recommendations.length} नीतिगत हस्तक्षेप CSV में निर्यात किए गए` : `Exported ${recommendations.length} policy interventions to CSV`);
  };

  const handleApprove = (id: string, title: string) => {
    approveRecommendation(id);
    toast.success(isHi ? `प्रारूप नीति हस्तक्षेप स्वीकृत: ${id}` : `Draft policy intervention approved: ${id}`);
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full overflow-hidden">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
              {isHi ? 'सरकारी निर्णय सहायता पाइपलाइन' : 'Government Decision Support Pipeline'}
            </span>
            <Provenance source="SIH dummy dataset" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
            {isHi ? 'अनुशंसित नीतिगत हस्तक्षेप' : 'Recommended Policy Interventions'}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            {isHi 
              ? 'अपेक्षित श्रम घाटे में कमी के आधार पर रैंक किए गए एल्गोरिदमिक सीट पुनर्आवंटन, नए NSQF योग्यता रोलआउट और नियोक्ता सह-निवेश ब्लूप्रिंट।'
              : 'Algorithmic seat reallocation, new NSQF qualification rollouts, and employer co-investment blueprints ranked by expected labour deficit mitigation.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAll}
          className="px-4 py-2 rounded-xl liquid-control text-xs sm:text-sm font-semibold text-[var(--text)] hover:bg-[var(--glass-strong)] border border-[var(--border)] flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isHi ? 'सभी हस्तक्षेप निर्यात करें' : 'Export All Interventions'}</span>
        </button>
      </div>

      <FilterBar />

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
                        ? (isHi ? 'LP अनुकूलन · SIH डमी डेटासेट' : 'LP Optimization · SIH dummy dataset')
                        : (isHi ? 'उदाहरणात्मक, मॉडल आउटपुट नहीं · SIH डमी डेटासेट' : 'Illustrative, not model output · SIH dummy dataset')}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[var(--text)] mt-0.5">
                    {isHi ? `${getLocalizedEntityName('districts', rec.district, 'hi')}, ${getLocalizedEntityName('states', rec.state, 'hi')}` : `${rec.district}, ${rec.state}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Badge variant="balanced" size="sm">
                  {isHi ? `विश्वास: ${rec.confidence}%` : `Confidence: ${rec.confidence}%`}
                </Badge>

                {rec.status === 'approved' && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isHi ? 'प्रारूप स्वीकृत' : 'Draft Approved'}
                  </span>
                )}
              </div>
            </div>

            {/* Recommendation Title & Rationale */}
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-[var(--text)] tracking-tight mb-1.5">
                {isHi && rec.titleHi ? rec.titleHi : rec.title}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-4xl">
                {isHi && rec.reasonHi ? rec.reasonHi : rec.reason}
              </p>
            </div>

            {/* Reallocation Corridor Graphic (From Trade -> To Trade) */}
            {rec.fromTrade && (
              <div className="p-3.5 rounded-2xl glass border border-[var(--border)] mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <span className="text-[10px] font-bold text-[var(--oversupply)] uppercase block font-mono">
                    {isHi ? 'क्षमता दाता व्यवसाय (अधिशेष)' : 'Capacity Donor Trade (Surplus)'}
                  </span>
                  <strong className="text-[var(--text)] font-semibold truncate block">
                    {isHi && rec.fromTradeHi ? rec.fromTradeHi : rec.fromTrade}
                  </strong>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono block">NCO {rec.fromNco}</span>
                </div>

                <div className="flex flex-col items-center shrink-0">
                  <span className="px-2.5 py-0.5 rounded-md bg-[var(--brand)]/15 text-[var(--brand)] font-extrabold text-[11px] font-mono border border-[var(--brand)]/30">
                    {isHi ? `${rec.recommendedSeats} सीटें स्थानांतरित` : `Shift ${rec.recommendedSeats} Seats`}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-faint)] mt-1 hidden sm:block" />
                </div>

                <div className="flex-1 text-center sm:text-right min-w-0">
                  <span className="text-[10px] font-bold text-[var(--severe)] uppercase block font-mono">
                    {isHi ? 'लक्षित व्यवसाय (गंभीर कमी)' : 'Target Trade (Severe Shortage)'}
                  </span>
                  <strong className="text-[var(--text)] font-semibold truncate block">
                    {isHi && rec.toTradeHi ? rec.toTradeHi : rec.toTrade}
                  </strong>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono block">NCO {rec.toNco}</span>
                </div>
              </div>
            )}

            {/* Expected Impact Stats Grid in aligned 3-column mini-grid (§6.3) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-3.5 rounded-2xl glass border border-[var(--border)] shadow-2xs mb-4 text-center">
              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  {isHi ? 'कमी में कमी' : 'Shortage Reduction'}
                </span>
                <span className="text-lg sm:text-2xl font-extrabold text-[var(--success)] font-mono tabular-nums">
                  -{rec.expectedImpact.gapReductionPercent}%
                </span>
                <span className="text-[10px] text-[var(--success)] font-semibold block">{isHi ? 'अनुमानित भरपाई' : 'Estimated Closure'}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  {isHi ? 'आपूर्ति कवरेज' : 'Supply Coverage'}
                </span>
                <span className="text-lg sm:text-2xl font-extrabold text-[var(--brand)] font-mono tabular-nums">
                  +{rec.expectedImpact.supplyCoveragePercent}%
                </span>
                <span className="text-[10px] text-[var(--brand)] font-semibold block">{isHi ? 'रोजगार योग्य पूल' : 'Employable Pool'}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                  {isHi ? 'पैकेज लागत' : 'Package Cost'}
                </span>
                <span className="text-base sm:text-xl font-extrabold text-[var(--text)] font-mono tabular-nums">
                  {formatINR(rec.expectedImpact.estimatedCostINR)}
                </span>
                <span className="text-[10px] text-[var(--text-faint)] font-semibold block font-mono">{isHi ? '₹6,500/सीट' : '₹6,500/seat retrofit'}</span>
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
                  <span>{isHi ? 'अनुभवजन्य साक्ष्य देखें' : 'View Empirical Evidence'}</span>
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
                    toast.success(isHi ? `कार्यवाही संक्षिप्त डाउनलोड हुई: ${rec.id} (${rec.recommendedSeats} सीटें)` : `Action brief for ${rec.id} (${rec.recommendedSeats} seats) downloaded`);
                  }}
                  className="p-2 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                  title={isHi ? 'कार्यवाही संक्षिप्त निर्यात' : 'Export Action Brief'}
                  aria-label={isHi ? 'कार्यवाही संक्षिप्त निर्यात' : 'Export Action Brief'}
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
                  <span>{isHi ? 'स्टूडियो में अनुकरण' : 'Simulate in Studio'}</span>
                </Link>

                {rec.status !== 'approved' ? (
                  <button
                    type="button"
                    onClick={() => handleApprove(rec.id, rec.title)}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[var(--success)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isHi ? 'प्रारूप कार्रवाई स्वीकृत करें' : 'Approve Draft Action'}</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl glass text-[var(--text-muted)] text-xs font-bold border border-[var(--border)]">
                    {isHi ? 'प्रारूप स्वीकृत' : 'Draft Approved'}
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
