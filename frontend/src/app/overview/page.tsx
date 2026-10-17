'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { IndiaIntelligenceMap } from '@/components/maps/IndiaIntelligenceMap';
import { KpiCard } from '@/components/common/KpiCard';
import { Badge } from '@/components/common/Badge';
import { OCCUPATIONS, RECOMMENDATIONS } from '@/lib/demoData';
import { 
  Download, 
  Sliders, 
  ChevronRight, 
  Eye
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';
import { toast } from 'sonner';
import { getLocalizedEntityName } from '@/lib/i18n';
import { formatNumber } from '@/lib/formatters';

export default function OverviewPage() {
  const { setActiveEvidence, setSelectedDistrict, setSelectedOccupationNco, language, l, forecastHorizon } = useApp();

  const metrics = useMemo(() => {
    // Dynamically scale projections and alerts according to selected Forecast Horizon
    const horizonMultiplier = forecastHorizon === '3M' ? 0.94 : forecastHorizon === '12M' ? 1.20 : 1.0;
    const supplyMultiplier = forecastHorizon === '3M' ? 1.08 : forecastHorizon === '12M' ? 0.92 : 1.0;

    const baseDemand = OCCUPATIONS.reduce((acc, o) => acc + o.currentDemand, 0);
    const baseSupply = OCCUPATIONS.reduce((acc, o) => acc + o.effectiveSupply, 0);

    const totalDemand = Math.round(baseDemand * horizonMultiplier);
    const totalEffectiveSupply = Math.round(baseSupply * supplyMultiplier);
    const netShortfall = Math.max(0, totalDemand - totalEffectiveSupply);

    const demandGrowthPct = forecastHorizon === '3M' ? '+5.3%' : forecastHorizon === '12M' ? '+21.8%' : '+10.6%';
    const demandGrowthLabel = forecastHorizon === '3M'
      ? l('Projected 3M growth', 'अनुमानित 3-माह वृद्धि')
      : forecastHorizon === '12M'
      ? l('Projected 12M growth', 'अनुमानित 12-माह वृद्धि')
      : l('Projected 6M growth', 'अनुमानित 6-माह वृद्धि');

    const supplyReadyPct = forecastHorizon === '3M' 
      ? l('84% Ready', '84% तैयार') 
      : forecastHorizon === '12M' 
      ? l('55% Ready', '55% तैयार') 
      : l('70% Ready', '70% तैयार');
    const supplyLabel = forecastHorizon === '3M'
      ? l('Immediate staged pool', 'तत्काल चरणबद्ध पूल')
      : forecastHorizon === '12M'
      ? l('Annual pipeline pool', 'वार्षिक पाइपलाइन पूल')
      : l('Active staged pool', 'सक्रिय चरणबद्ध पूल');

    const deficitSeverity = forecastHorizon === '3M' ? l('High Priority', 'उच्च प्राथमिकता') : forecastHorizon === '12M' ? l('Critical Deficit', 'गंभीर घाटा') : l('Critical', 'गंभीर');
    const deficitLabel = forecastHorizon === '3M'
      ? l('3M unmet need', '3-माह अपूर्ण आवश्यकता')
      : forecastHorizon === '12M'
      ? l('12M projected deficit', '12-माह अनुमानित घाटा')
      : l('Unmet district need', 'अपूर्ण ज़िला आवश्यकता');

    const atRiskTrades = forecastHorizon === '3M' ? 11 : forecastHorizon === '12M' ? 16 : 13;
    const alertsCount = forecastHorizon === '3M' ? 18 : forecastHorizon === '12M' ? 52 : 35;
    const recsCount = forecastHorizon === '3M' ? 3 : forecastHorizon === '12M' ? 6 : 4;

    return {
      demandFormatted: formatNumber(totalDemand, language, { compact: true }),
      supplyFormatted: formatNumber(totalEffectiveSupply, language, { compact: true }),
      shortfallFormatted: formatNumber(netShortfall, language, { compact: true }),
      demandGrowthPct,
      demandGrowthLabel,
      supplyReadyPct,
      supplyLabel,
      deficitSeverity,
      deficitLabel,
      atRiskCount: atRiskTrades,
      activeAlertsCount: alertsCount,
      recommendationsCount: recsCount
    };
  }, [language, forecastHorizon, l]);

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
      {/* Compact Executive Header with DepthWizard Aerospace Badge & Bold Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-mono tracking-wider uppercase bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25">
              <span className="text-sky-500">✦</span> {l('MSDE EXECUTIVE COCKPIT', 'MSDE कार्यकारी कॉकपिट')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
            {language === 'hi' ? (
              'ज़िला कौशल एवं क्षमता सारांश'
            ) : (
              <>
                District Skill &amp; Capacity <span className="title-serif-italic">Overview</span>
              </>
            )}
          </h1>
        </div>
        <Link
          href="/scenarios?preset=rec01"
          className="btn-liquid-primary py-2 px-4 text-xs font-semibold flex items-center gap-2 shrink-0"
        >
          <Sliders className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>{l('Open Scenario Studio', 'परिदृश्य स्टूडियो खोलें')}</span>
        </Link>
      </div>

      {/* Global Filter Bar */}
      <FilterBar />

      {/* Unified 6-Column Metric Grid with Liquid Glass & Locked Baseline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-slate-800 liquid-glass-card rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_4px_24px_-4px_rgba(15,23,42,0.05)]">
        <KpiCard
          label={l('Demand', 'मांग')}
          value={metrics.demandFormatted}
          delta={{ value: metrics.demandGrowthPct, isPositive: true, label: metrics.demandGrowthLabel }}
        />

        <KpiCard
          label={l('Effective Supply', 'प्रभावी आपूर्ति')}
          value={metrics.supplyFormatted}
          delta={{ value: metrics.supplyReadyPct, isNeutral: true, label: metrics.supplyLabel }}
        />

        <KpiCard
          label={l('Structural Deficit', 'ढांचागत घाटा')}
          value={metrics.shortfallFormatted}
          delta={{ value: metrics.deficitSeverity, isPositive: false, label: metrics.deficitLabel }}
          severity="severe"
        />

        <KpiCard
          label={l('At-Risk Trades', 'जोखिम वाले व्यवसाय')}
          value={metrics.atRiskCount}
          delta={{ value: l('Imbalance', 'असंतुलन'), isPositive: false, label: l('Supply-demand gap', 'आपूर्ति-मांग अंतर') }}
          severity="moderate"
        />

        <KpiCard
          label={l('Intelligence Alerts', 'खुफिया अलर्ट')}
          value={metrics.activeAlertsCount}
          delta={{ value: l('Active', 'सक्रिय'), isPositive: false, label: l('Anomalies detected', 'विसंगतियाँ पहचानी गईं') }}
          severity="severe"
        />

        <KpiCard
          label={l('Recommendations', 'सिफारिशें')}
          value={metrics.recommendationsCount}
          delta={{ value: l('Ranked', 'रैंक किया गया'), isPositive: true, label: l('Ready for action', 'कार्रवाई के लिए तैयार') }}
        />
      </div>

      {/* Priority Intervention Banner */}
      <div className="glass-interactive border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_8px_24px_-6px_rgba(245,158,11,0.12)]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/25">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              {l('PRIORITY INTERVENTION', 'प्राथमिकता हस्तक्षेप')}
            </span>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              {l('Gorakhpur · Solar PV Installer (NCO 7126.0101)', 'गोरखपुर · सोलर पीवी इंस्टॉलर (NCO 7126.0101)')}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20">
              {forecastHorizon} {l('Horizon', 'क्षितिज')}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            {l(
              forecastHorizon === '3M'
                ? '340-seat deficit projected in 3 months (92% probability). Immediate reallocation of 97 surplus seats from Retail Sales Associate satisfies 28% of urgent demand.'
                : forecastHorizon === '12M'
                ? '1,240-seat structural deficit projected over 12 months (78% probability). Phased reallocation and secondary batch scheduling required to close the annual talent gap.'
                : '711-seat deficit projected in 6 months (88% probability). Reallocate 97 surplus seats from Retail Sales Associate to save ₹6.3L in public funds vs. constructing new capacity.',
              forecastHorizon === '3M'
                ? '3 माह में 340 सीटों की कमी अनुमानित (92% संभावना)। तत्काल 97 अतिरिक्त सीटों का पुनर्वितरण तात्कालिक मांग का 28% पूरा करता है।'
                : forecastHorizon === '12M'
                ? '12 माह में 1,240 सीटों का ढांचागत घाटा अनुमानित (78% संभावना)। वार्षिक प्रतिभा अंतर पूरा करने के लिए चरणबद्ध पुनर्वितरण आवश्यक है।'
                : '6 माह में 711 सीटों की कमी अनुमानित (88% संभावना)। नई क्षमता जोड़ने के बजाय रिटेल सेल्स एसोसिएट से 97 अतिरिक्त सीटें पुनर्आवंटित करें — ₹6.3 लाख की बचत।'
            )}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <Link
            href="/districts/gorakhpur"
            className="border border-slate-200/90 bg-white/85 hover:bg-white text-slate-700 hover:text-slate-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_3px_rgba(15,23,42,0.06)] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-[0.98]"
          >
            {l('View Diagnostics', 'निदान देखें')}
          </Link>
          <Link
            href="/scenarios?preset=rec01"
            className="btn-liquid-primary rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-[0.98] shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{l('Simulate Reallocation', 'पुनर्आवंटन अनुकरण')}</span>
          </Link>
        </div>
      </div>

      {/* Key Shifts Since Last Forecast */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-mono">
          {l('Key Shifts Since Last Forecast', 'पिछले पूर्वानुमान के बाद प्रमुख बदलाव')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-slate-800 liquid-glass-card rounded-xl overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => {
              setSelectedDistrict('gorakhpur');
              setSelectedOccupationNco('7126.0101');
            }}
            className="p-3.5 flex items-center gap-2.5 text-left hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <span className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100">{getLocalizedEntityName('occupations', 'Solar PV Installer', language)}</strong>{' '}
              {l('demand growth -0.1% in Gorakhpur (acute shortfall persists)', 'गोरखपुर में मांग वृद्धि -0.1% (तीव्र कमी बरकरार)')}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedDistrict('gorakhpur');
              setSelectedOccupationNco('5223.0101');
            }}
            className="p-3.5 flex items-center gap-2.5 text-left hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100">{getLocalizedEntityName('occupations', 'Retail Sales Associate', language)}</strong>{' '}
              {l('demand softened -10.0% (capacity surplus)', 'मांग नरम -10.0% (क्षमता अधिशेष)')}
            </span>
          </button>
          <Link
            href="/alerts"
            className="p-3.5 flex items-center gap-2.5 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100">{getLocalizedEntityName('districts', 'Gorakhpur', language)}</strong>{' '}
              {l('shortage probability crossed 88%', 'कमी की संभावना 88% पार')}
            </span>
          </Link>
        </div>
      </div>

      {/* Main Hero Visual: India Intelligence Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 pb-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
              {language === 'hi' ? (
                'राष्ट्रीय श्रम बाजार भू-स्थानिक खुफिया'
              ) : (
                <>
                  National Labour Market <span className="title-serif-italic">Geospatial Intelligence</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {l('Interactive geographic overlay of structural shortages, vacancy pressures, and training infrastructure.', 'ढांचागत कमी, रिक्ति दबाव और प्रशिक्षण बुनियादी ढांचे का इंटरैक्टिव भौगोलिक ओवरले।')}
            </p>
          </div>
          <span className="text-[11px] text-slate-500 font-medium px-2.5 py-0.5 rounded-full bg-white/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 shrink-0 hidden sm:block font-mono">
            {l('MSDE Verified Registry · Oct 2024', 'MSDE सत्यापित रजिस्ट्री · अक्टू. 2024')}
          </span>
        </div>
        <IndiaIntelligenceMap />
      </div>

      {/* Top Priority Government Interventions Panel */}
      <div className="liquid-glass-card hud-corner-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
              {language === 'hi' ? (
                'शीर्ष प्राथमिकता नीतिगत हस्तक्षेप (रैंक किए गए)'
              ) : (
                <>
                  Top Priority Policy <span className="title-serif-italic">Interventions</span> (Ranked)
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {l('Targeted government capacity reallocations recommended by the Labour Market Intelligence engine.', 'श्रम बाजार खुफिया इंजन द्वारा अनुशंसित लक्षित सरकारी क्षमता पुनर्आवंटन।')}
            </p>
          </div>
          <Link
            href="/recommendations"
            className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{l('View All', 'सभी देखें')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-slate-800">
          {RECOMMENDATIONS.slice(0, 2).map((rec) => (
            <div key={rec.id} className="p-5 flex flex-col justify-between h-full">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-mono text-xs font-bold">
                      #{String(rec.rank).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">
                      {getLocalizedEntityName('districts', rec.district, language)}, {getLocalizedEntityName('states', rec.state, language)}
                    </span>
                  </div>
                  <Badge variant="balanced" size="sm">
                    {l(`Confidence: ${rec.confidence}%`, `विश्वास: ${rec.confidence}%`)}
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {l(rec.title, rec.titleHi)}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed flex-1">
                  {l(rec.reason, rec.reasonHi)}
                </p>

                {/* Score & Impact Stats */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 mb-3 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block font-mono">
                      {l('Seats', 'सीटें')}
                    </span>
                    <strong className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                      {rec.recommendedSeats}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block font-mono">
                      {l('Shortfall Closed', 'कमी भरपाई')}
                    </span>
                    <strong className="text-sm font-bold text-sky-700 dark:text-sky-400 font-mono tabular-nums">
                      ▼ {rec.expectedImpact.gapReductionPercent}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block font-mono">
                      {l('Target Trade', 'लक्षित व्यवसाय')}
                    </span>
                    <strong className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate block">
                      {getLocalizedEntityName('occupations', rec.toTrade, language, rec.toTradeHi || rec.toTrade)}
                    </strong>
                  </div>
                </div>

                {/* Deficit Before / After Bar */}
                <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 mb-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 font-medium">{l('Deficit Before vs After:', 'घाटा: पहले बनाम बाद:')}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      <span className="text-red-600 dark:text-red-400">{rec.recommendedSeats === 97 ? 711 : 400}</span>
                      <span className="text-slate-400 mx-1">→</span>
                      <span className="text-sky-700 dark:text-sky-400">{rec.recommendedSeats === 97 ? 614 : 0}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                    <div 
                      className="h-full bg-sky-600 transition-all" 
                      style={{ width: `${rec.recommendedSeats === 97 ? (614 / 711) * 100 : 35}%` }} 
                    />
                    <div 
                      className="h-full bg-red-500 transition-all" 
                      style={{ width: `${rec.recommendedSeats === 97 ? (97 / 711) * 100 : 65}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{l('After Policy Fix', 'हस्तक्षेप के बाद')}</span>
                    <span className="text-sky-700 dark:text-sky-400 font-medium">▼ {rec.expectedImpact.gapReductionPercent}% {l('Deficit Reduction', 'कमी में सुधार')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveEvidence(rec)}
                    className="px-2.5 py-1.5 rounded-xl liquid-control text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                    title={l('View Evidence Dossier', 'साक्ष्य डोजियर देखें')}
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{l('Evidence', 'साक्ष्य')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportAction(rec)}
                    className="p-2 rounded-xl liquid-control text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors"
                    title={l('Export Action Brief CSV', 'कार्यवाही संक्षिप्त CSV निर्यात')}
                    aria-label={l('Export Action Brief CSV', 'कार्यवाही संक्षिप्त CSV निर्यात')}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link
                  href={`/scenarios?preset=rec0${rec.rank}`}
                  className="flex-1 btn-liquid-primary py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>{l(`Simulate Intervention #${rec.rank}`, `हस्तक्षेप #${rec.rank} सिम्युलेट करें`)}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

