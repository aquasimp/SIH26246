'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { IndiaIntelligenceMap } from '@/components/maps/IndiaIntelligenceMap';
import { KpiCard } from '@/components/common/KpiCard';
import { Badge } from '@/components/common/Badge';
import { Provenance } from '@/components/common/Provenance';
import { OCCUPATIONS, RECOMMENDATIONS } from '@/lib/demoData';
import { 
  AlertTriangle, 
  Lightbulb, 
  ArrowDownRight,
  Sparkles, 
  Download, 
  Sliders, 
  ChevronRight, 
  Eye,
  AlertOctagon
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';
import { toast } from 'sonner';
import { getLocalizedEntityName } from '@/lib/i18n';

export default function OverviewPage() {
  const { t, setActiveEvidence, setSelectedDistrict, setSelectedOccupationNco, language, l} = useApp();
  const isHi = language === 'hi';

  const metrics = useMemo(() => {
    const totalDemand = OCCUPATIONS.reduce((acc, o) => acc + o.currentDemand, 0);
    const totalEffectiveSupply = OCCUPATIONS.reduce((acc, o) => acc + o.effectiveSupply, 0);
    const netShortfall = Math.max(0, totalDemand - totalEffectiveSupply);
    const atRiskTrades = OCCUPATIONS.filter(o => o.gapScore >= 75 || o.gapScore <= 25).length;
    return {
      demandFormatted: isHi ? totalDemand.toLocaleString('hi-IN') : (totalDemand / 1000).toFixed(1) + 'K',
      supplyFormatted: isHi ? totalEffectiveSupply.toLocaleString('hi-IN') : (totalEffectiveSupply / 1000).toFixed(1) + 'K',
      shortfallFormatted: isHi ? netShortfall.toLocaleString('hi-IN') : (netShortfall / 1000).toFixed(1) + 'K',
      atRiskCount: atRiskTrades,
      activeAlertsCount: 35, // 35 verified anomalies from alert engine (§4.1)
      recommendationsCount: RECOMMENDATIONS.length
    };
  }, [isHi]);

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
    toast.success(l(`Exported action brief for ${rec.id} (${rec.recommendedSeats} seats)`, `कार्यवाही संक्षिप्त निर्यात: ${rec.id} (${rec.recommendedSeats} सीटें)`));
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full overflow-hidden">
      {/* Hero Header (§6.1) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
              {l('National Intelligence Dashboard', 'राष्ट्रीय श्रम खुफिया डैशबोर्ड')}
            </span>
            {/* ONE page-level dataset chip */}
            <Provenance source="SIH dummy dataset" />
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
            <span>{l('Open Scenario Studio', 'परिदृश्य स्टूडियो खोलें')}</span>
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
          delta={{ value: '+18.6%', isPositive: true, label: l('6M Growth', '6M वृद्धि') }}
          scope={l('National Vacancies', 'राष्ट्रीय रिक्तियां')}
          trend={[12, 14, 15, 16, 17, 18.6]}
        />

        <KpiCard
          label={t.metrics.effectiveSupply}
          value={metrics.supplyFormatted}
          delta={{ value: l('Staged Pool', 'चरणबद्ध पूल'), isNeutral: true, label: l('0.70 Readiness', '0.70 तत्परता') }}
          scope={l('Certified & Active', 'प्रमाणित एवं सक्रिय')}
          trend={[6.8, 7.1, 7.4, 7.8, 8.1, 8.3]}
        />

        {/* Structural Shortfall: positive number, never negative (§4.3) */}
        <KpiCard
          label={l('Structural Shortfall', 'ढांचागत कमी')}
          value={metrics.shortfallFormatted}
          delta={{ value: l('National Deficit', 'राष्ट्रीय घाटा'), isPositive: false, label: l('Unmet Need', 'अधूरी आवश्यकता') }}
          scope={l('Purvanchal & Corridors', 'पूर्वांचल और गलियारे')}
          severity="severe"
          trend={[8.2, 8.9, 9.4, 9.8, 10.1, 10.3]}
        />

        <KpiCard
          label={t.metrics.atRiskTrades}
          value={metrics.atRiskCount}
          delta={{ value: l('Imbalance', 'असंतुलन'), isPositive: false, label: l('Score >75 / <25', 'स्कोर >75 / <25') }}
          scope={l('NCO Specializations', 'NCO विशेषज्ञताएं')}
          severity="moderate"
          trend={[2, 3, 3, 4, 4, 4]}
        />

        {/* Early Warnings: synced to 35 alert engine anomalies (§4.1) */}
        <Link href="/alerts" className="block focus-visible:outline-hidden">
          <KpiCard
            label={l('Intelligence Signals', 'खुफिया संकेत')}
            value={metrics.activeAlertsCount}
            delta={{ value: l('Alert Engine', 'अलर्ट इंजन'), isPositive: false, label: l('35 Anomalies', '35 विसंगतियां') }}
            scope={l('Critical Shortage #1', 'गंभीर कमी #1')}
            severity="severe"
            trend={[28, 30, 32, 34, 35, 35]}
            className="hover:border-[var(--severe)] cursor-pointer"
          />
        </Link>

        <Link href="/recommendations" className="block focus-visible:outline-hidden">
          <KpiCard
            label={t.metrics.recommendations}
            value={metrics.recommendationsCount}
            delta={{ value: l('Ranked Actions', 'रैंक की गई कार्रवाइयां'), isPositive: true, label: l('Interventions', 'हस्तक्षेप') }}
            scope={l('Pending Approval', 'स्वीकृति लंबित')}
            severity="balanced"
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
                {l('ACTION REQUIRED', 'कार्रवाई आवश्यक')}
              </span>
              <span>•</span>
              <span className="font-semibold text-sm">
                {l('Gorakhpur · Solar PV Installer (NCO 7126.0101)', 'गोरखपुर · सोलर पीवी इंस्टॉलर (NCO 7126.0101)')}
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
              {isHi ? (
                <>
                  अनुमानित 6M कमी की संभावना <strong className="text-[var(--severe)] font-mono">88%</strong> है (कमी: 711 उम्मीदवार)। अनुशंसित हस्तक्षेप: रिटेल सेल्स एसोसिएट से <strong className="text-[var(--brand)] font-mono">97 सीटें</strong> पुनर्आवंटित करें (नई क्षमता के मुकाबले ₹6.3 लाख की बचत)।
                </>
              ) : (
                <>
                  Projected 6M shortage probability is <strong className="text-[var(--severe)] font-mono">88%</strong> (Shortfall: 711 candidates). Recommended intervention: Reallocate <strong className="text-[var(--brand)] font-mono">97 seats</strong> from Retail Sales Associate (saving ₹6.3L vs new capacity).
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <Link
            href="/districts/gorakhpur"
            className="px-3 py-1.5 rounded-xl liquid-control text-xs font-bold text-[var(--text)] hover:bg-[var(--glass-strong)] transition-all cursor-pointer"
          >
            {l('Investigate', 'जांच करें')}
          </Link>
          <Link
            href="/scenarios?preset=rec01"
            className="px-3.5 py-1.5 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
            <span>{l('Simulate Fix', 'समाधान का अनुकरण')}</span>
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
              {l('What Changed in Current Pipeline Run?', 'वर्तमान पाइपलाइन रन में क्या बदला?')}
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
              title={l('Solar PV Installer demand velocity: -0.1% 6M (t-6 to t)', 'सोलर पीवी इंस्टॉलर मांग वेग: -0.1% 6M')}
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-[var(--severe)]" />
              <span>
                {isHi ? (
                  <><strong>सोलर पीवी इंस्टॉलर</strong> मांग वृद्धि <strong>-0.1%</strong> गोरखपुर में (तीव्र कमी बरकरार)</>
                ) : (
                  <><strong>Solar PV Installer</strong> demand growth <strong>-0.1%</strong> in Gorakhpur (acute shortfall persists)</>
                )}
              </span>
            </button>

            {/* Canonical Retail velocity: -10.0% (§4.1) */}
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict('gorakhpur');
                setSelectedOccupationNco('5223.0101');
              }}
              className="px-3 py-1.5 rounded-xl glass hover:border-[var(--border-strong)] text-[var(--text)] font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-[var(--border)]"
              title={l('Retail Sales Associate demand velocity: -10.0% 6M (t-6 to t)', 'रिटेल सेल्स एसोसिएट मांग वेग: -10.0% 6M')}
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
              <span>
                {isHi ? (
                  <><strong>रिटेल सेल्स एसोसिएट</strong> मांग <strong>-10.0%</strong> नरम हुई (भौतिक क्षमता अधिशेष)</>
                ) : (
                  <><strong>Retail Sales Associate</strong> softened <strong>-10.0%</strong> (physical capacity surplus)</>
                )}
              </span>
            </button>

            {/* Canonical Gorakhpur Shortage Probability: 88% (§4.1) */}
            <Link
              href="/alerts"
              className="px-3 py-1.5 rounded-xl glass border border-[var(--severe)]/30 text-[var(--text)] hover:border-[var(--severe)] font-medium flex items-center gap-1.5 transition-all"
              title={l('Gorakhpur shortage probability reached 88%', 'गोरखपुर कमी संभावना 88% पहुंची')}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--severe)]" />
              <span>
                {isHi ? (
                  <><strong>गोरखपुर</strong> में कमी का जोखिम <strong>88%</strong> संभावना पर पहुंचा</>
                ) : (
                  <><strong>Gorakhpur</strong> shortage risk reached <strong>88%</strong> probability</>
                )}
              </span>
            </Link>
          </div>
        </div>
      </div>



      {/* Main Hero Visual: India Intelligence Map (§5.8, §6.1) */}
      <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text)] tracking-tight">
              {l('National Labour Market Geospatial Intelligence', 'राष्ट्रीय श्रम बाजार भू-स्थानिक खुफिया')}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {l('Interactive geographic overlay of structural shortages, vacancy pressures, and training infrastructure across state corridors.', 'राज्य गलियारों में ढांचागत कमी, रिक्ति दबाव और प्रशिक्षण बुनियादी ढांचे का इंटरैक्टिव भौगोलिक ओवरले।')}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-faint)]">
            <Provenance source="SIH dummy dataset" />
          </div>
        </div>
        <IndiaIntelligenceMap />
      </div>

      {/* Top Priority Government Interventions Panel (§6.3) */}
      <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text)] tracking-tight">
              {l('Top Priority Policy Interventions (Ranked)', 'शीर्ष प्राथमिकता नीतिगत हस्तक्षेप (रैंक किए गए)')}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {l('Targeted government capacity reallocations recommended by the Labour Market Intelligence engine.', 'श्रम बाजार खुफिया इंजन द्वारा अनुशंसित लक्षित सरकारी क्षमता पुनर्आवंटन।')}
            </p>
          </div>
          <Link
            href="/recommendations"
            className="text-xs font-bold text-[var(--brand)] hover:underline flex items-center gap-1"
          >
            <span>{l('View All 4 Recommended Interventions', 'सभी 4 अनुशंसित हस्तक्षेप देखें')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                      {isHi ? `${getLocalizedEntityName('districts', rec.district, 'hi')}, ${getLocalizedEntityName('states', rec.state, 'hi')}` : `${rec.district}, ${rec.state}`}
                    </span>
                  </div>
                  <Badge variant="balanced" size="sm">
                    {l(`Confidence: ${rec.confidence}%`, `विश्वास: ${rec.confidence}%`)}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-[var(--text)] mb-1">
                  {isHi && rec.titleHi ? rec.titleHi : rec.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] mb-3 leading-relaxed">
                  {isHi && rec.reasonHi ? rec.reasonHi : rec.reason}
                </p>

                {/* Score & Impact Stats */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl glass border border-[var(--border)] mb-3 text-center">
                  <div>
                    <span className="text-[10px] text-[var(--text-faint)] font-bold uppercase tracking-wider block">
                      {l('Seats', 'सीटें')}
                    </span>
                    <strong className="text-xs sm:text-sm font-bold text-[var(--text)] font-mono tabular-nums">
                      {rec.recommendedSeats}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-faint)] font-bold uppercase tracking-wider block">
                      {l('Shortfall Closed', 'कमी भरपाई')}
                    </span>
                    <strong className="text-xs sm:text-sm font-bold text-[var(--success)] font-mono tabular-nums">
                      ▼ {l(`${rec.expectedImpact.gapReductionPercent}% closed`, `कमी की ${rec.expectedImpact.gapReductionPercent}% भरपाई`)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-faint)] font-bold uppercase tracking-wider block">
                      {l('Target Trade', 'लक्षित व्यवसाय')}
                    </span>
                    <strong className="text-xs sm:text-sm font-bold text-[var(--brand)] truncate block">
                      {isHi && rec.toTradeHi ? rec.toTradeHi : rec.toTrade}
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
                  <span>{l('View Evidence', 'साक्ष्य देखें')}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExportAction(rec)}
                    className="p-1.5 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                    title={l('Export Action Brief CSV', 'कार्यवाही संक्षिप्त CSV निर्यात')}
                    aria-label={l('Export Action Brief CSV', 'कार्यवाही संक्षिप्त CSV निर्यात')}
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/scenarios?preset=rec0${rec.rank}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-300" />
                    <span>{l('Simulate', 'सिम्युलेट')}</span>
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
