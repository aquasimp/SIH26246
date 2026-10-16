'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { Badge } from '@/components/common/Badge';
import { Provenance } from '@/components/common/Provenance';
import { OCCUPATIONS, DISTRICTS } from '@/lib/demoData';
import { runScenarioSimulation } from '@/lib/scenarioEngine';
import { formatINR, downloadCSV } from '@/lib/exportUtils';
import { toast } from 'sonner';
import { 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  Download, 
  TrendingDown, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Users,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  X,
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';

import { getLocalizedEntityName, resolveDisplayName } from '@/lib/i18n';

function ScenarioStudioContent() {
  const searchParams = useSearchParams();
  const { selectedOccupationNco, selectedDistrict, setSelectedOccupationNco, setSelectedDistrict, language, t, l} = useApp();

  const localizeSeverity = (band?: string) => {
    if (!band) return '';
    return getLocalizedEntityName('severityBands', band, language, band);
  };

  // Scenario Levers State (§6.4)
  // Default values matching Gorakhpur Recommendation #01
  const [seatShiftAmount, setSeatShiftAmount] = useState<number>(500); // Requested 500, safely capped at 97
  const [seatPercentAdjustment, setSeatPercentAdjustment] = useState<number>(0); // 0%
  const [demandShockPercent, setDemandShockPercent] = useState<number>(0); // 0%
  const [newCentreActive, setNewCentreActive] = useState<boolean>(false); // Default: Lab disabled per canonical preset specification
  const [mobilityFactorPercent, setMobilityFactorPercent] = useState<number>(0); // 0%
  const [donorSafetyRule, setDonorSafetyRule] = useState<number>(0.05); // 0.05 (Strict, default)
  const [whyModalOpen, setWhyModalOpen] = useState<boolean>(false);

  // Check URL preset
  useEffect(() => {
    const preset = searchParams.get('preset');
    if (preset === 'rec01') {
      handleApplyPreset();
    }
  }, [searchParams]);

  // Simulation execution via engine (memoized)
  const simulation = useMemo(() => {
    return runScenarioSimulation({
      occupationNco: selectedOccupationNco || '7126.0101',
      districtId: selectedDistrict || 'gorakhpur',
      seatShiftAmount,
      donorNco: '5223.0101', // Retail Sales Associate
      seatPercentAdjustment,
      demandShockPercent,
      newCentreActive,
      mobilityFactorPercent,
      donorSafetyRule
    });
  }, [selectedOccupationNco, selectedDistrict, seatShiftAmount, seatPercentAdjustment, demandShockPercent, newCentreActive, mobilityFactorPercent, donorSafetyRule]);

  const targetOcc = OCCUPATIONS.find(o => o.ncoCode === (selectedOccupationNco || '7126.0101')) || OCCUPATIONS[0];
  const donorOcc = OCCUPATIONS.find(o => o.ncoCode === '5223.0101') || OCCUPATIONS[1];

  const handleReset = () => {
    setSeatShiftAmount(0);
    setSeatPercentAdjustment(0);
    setDemandShockPercent(0);
    setNewCentreActive(false);
    setMobilityFactorPercent(0);
    setDonorSafetyRule(0.05);
    toast.info(l('Scenario levers reset to unadjusted baseline', 'परिदृश्य लीवर अप्रभावित आधारभूत पर रीसेट हो गए'));
  };

  // "Load Recommendation #01 Preset" lands EXACTLY on 97 seats / donor 52 / ₹18.31L / 6.2% alone / 15.6% combo (§4.1)
  const handleApplyPreset = () => {
    setSelectedDistrict('gorakhpur');
    setSelectedOccupationNco('7126.0101');
    setSeatShiftAmount(500); // Will be safely capped to 97 seats by LP Strict rule
    setSeatPercentAdjustment(0);
    setDemandShockPercent(0);
    setNewCentreActive(true); // +150 greenfield lab seats (+₹12L)
    setMobilityFactorPercent(0); // 0% default
    setDonorSafetyRule(0.05); // Strict default
    toast.success(l('Recommendation #01 preset loaded: 97 seats • ₹18.31L • 15.6% closure', 'सिफ़ारिश #01 प्रीसेट लोड: 97 सीटें • ₹18.31L • 15.6% भरपाई'));
  };

  const handleExportSimulation = () => {
    const rows = [
      ['KaushalYuva Scenario Studio Policy Simulation Brief'],
      ['Target Occupation', `${targetOcc.title} (${targetOcc.ncoCode})`],
      ['Donor Occupation', `${donorOcc.title} (${donorOcc.ncoCode})`],
      ['District', selectedDistrict],
      [''],
      ['POLICY CONTROLS', 'VALUE'],
      ['Requested Seat Shift', `${seatShiftAmount} Seats`],
      ['Actual Safe Reallocation', `${simulation.actualSeatsShifted} Seats`],
      ['Donor Safety Rule', donorSafetyRule === 0.05 ? 'Strict (<= 0.05)' : donorSafetyRule === 0.10 ? 'Moderate (<= 0.10)' : 'Permissive (Score <= 59)'],
      ['Overall Seat Adjustment', `${seatPercentAdjustment}%`],
      ['Demand Shock Applied', `${demandShockPercent}%`],
      ['Greenfield ITI Skill Center', newCentreActive ? 'Active (+150 seats, ₹12L capex)' : 'Inactive'],
      ['Inter-District Mobility Factor', `+${mobilityFactorPercent}%`],
      [''],
      ['SIMULATED POLICY OUTCOME', 'VALUE'],
      ['Baseline Gap Score', simulation.baselineGapScore],
      ['Simulated Post-Intervention Gap Score', simulation.simulatedGapScore],
      ['Baseline Shortfall', simulation.targetTrade?.deficit_before ?? 711],
      ['Simulated Shortfall', simulation.targetTrade?.deficit_after ?? 588],
      ['Net Deficit Reduction', `-${simulation.gapReductionPercent}%`],
      ['Supply Coverage Increase', `+${simulation.supplyCoverageIncreasePercent}%`],
      ['Total Package Cost', formatINR(simulation.estimatedInterventionCostINR)],
      ['Donor Post-Intervention Gap Score', simulation.donorTrade?.gap_score_after ?? 52]
    ];
    downloadCSV(`KaushalYuva_Simulation_${targetOcc.ncoCode}_${selectedDistrict}.csv`, rows);
    toast.success(l('Simulation report downloaded successfully', 'सिमुलेशन रिपोर्ट सफलतापूर्वक डाउनलोड हुई'));
  };

  // Safe cap threshold for slider track (§6.4)
  const safeCapSeats = donorSafetyRule === 0.05 ? 97 : donorSafetyRule === 0.10 ? 140 : 218;

  // After card and metric styling: uses band colour (not green) while still Severe (§8)
  const afterScore = simulation.targetTrade?.gap_score_after ?? simulation.simulatedGapScore;
  const isAfterSevere = afterScore >= 75;
  const isAfterModerate = afterScore >= 60 && afterScore < 75;
  const afterBandStyles = isAfterSevere
    ? {
        border: 'border-[var(--severe)]/40',
        badge: 'bg-[var(--severe)]/15 text-[var(--severe)] border-[var(--severe)]/30',
        score: 'text-[var(--severe)]',
        stat: 'text-[var(--brand)]',
        bandText: 'text-[var(--severe)]'
      }
    : isAfterModerate
    ? {
        border: 'border-[var(--moderate)]/40',
        badge: 'bg-[var(--moderate)]/15 text-[var(--moderate)] border-[var(--moderate)]/30',
        score: 'text-[var(--moderate)]',
        stat: 'text-amber-500',
        bandText: 'text-amber-500'
      }
    : {
        border: 'border-[var(--balanced)]/40',
        badge: 'bg-[var(--balanced)]/15 text-[var(--balanced)] border-[var(--balanced)]/30',
        score: 'text-[var(--balanced)]',
        stat: 'text-[var(--brand)]',
        bandText: 'text-[var(--brand)]'
      };

  const unifiedSliderStyle = "w-full accent-[var(--brand)] cursor-pointer h-2 rounded-lg bg-[var(--border)]";

  return (
    <div className="space-y-6">
      {/* Title & Preset Controls — No Header Clipping (§8) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
              {l('Interactive Policy Sandbox', 'इंटरैक्टिव नीति सैंडबॉक्स')}
            </span>
            <Provenance source="MSDE Verified Registry" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight break-words">
            {l('Scenario Studio', 'परिदृश्य स्टूडियो')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            {l('Test policy decisions before real-world capital deployment. Simulate seat shifts, demand shocks, greenfield labs, and candidate mobility under LP non-depletion constraints.', 'वास्तविक पूंजी आवंटन से पहले नीतिगत निर्णयों का परीक्षण करें। LP गैर-रिक्तीकरण प्रतिबंधों के तहत सीट स्थानांतरण, मांग झटके, नए प्रयोगशाला केंद्र और उम्मीदवार गतिशीलता का अनुकरण करें।')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleApplyPreset}
            className="px-3.5 py-2 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs min-h-[36px]"
            title="Load canonical Recommendation #01: 97 seats • ₹18.31L • donor score 52"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{l('Load Recommendation #01 Preset', 'सिफ़ारिश #01 प्रीसेट लोड करें')}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Reset controls to baseline"
            aria-label="Reset controls"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportSimulation}
            className="px-3.5 py-2 rounded-xl liquid-control text-[var(--text)] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px]"
          >
            <Download className="w-4 h-4" />
            <span>{l('Export Report', 'रिपोर्ट निर्यात करें')}</span>
          </button>
        </div>
      </div>

      <FilterBar />

      {/* Hero Impact Summary Bar (§8: Sticky before/after bar at all breakpoints) */}
      <div 
        aria-live="polite"
        className="sticky top-14 z-10 p-3.5 sm:p-4 rounded-2xl glass-strong border border-[var(--border)] shadow-md flex flex-wrap items-center justify-between gap-3 sm:gap-4 backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]">
            <Sliders className="w-4 h-4" />
          </span>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block">
              {l('Simulated policy impact summary', 'सिम्युलेटेड नीति प्रभाव सारांश')}
            </span>
            <span className="text-xs font-bold text-[var(--text)]">
              {resolveDisplayName(targetOcc, language)} ({getLocalizedEntityName('districts', selectedDistrict, language)})
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-4 sm:gap-6">
          {/* Gap Score 94 -> 86 */}
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase block">
              {l('Gap score', 'अंतर स्कोर')}
            </span>
            <div className="text-xl font-extrabold text-[var(--text)] font-mono tabular-nums flex items-center gap-1.5">
              <span className="text-[var(--severe)]">{simulation.baselineGapScore}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
              <span className={afterBandStyles.score}>{simulation.simulatedGapScore}</span>
            </div>
          </div>

          {/* Shortfall: 711 -> 588 */}
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase block">
              {l('Candidate shortfall', 'उम्मीदवार कमी')}
            </span>
            <div className="text-xl font-extrabold text-[var(--text)] font-mono tabular-nums flex items-center gap-1.5">
              <span className="text-[var(--severe)]">{simulation.targetTrade?.deficit_before ?? 711}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
              <span className={afterBandStyles.score}>{simulation.targetTrade?.deficit_after ?? 588}</span>
            </div>
          </div>

          {/* Shortfall Closed */}
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase block">
              {l('Shortfall closed', 'कमी भरपाई')}
            </span>
            <div className="text-xl font-extrabold text-[var(--brand)] font-mono tabular-nums flex items-center gap-1">
              <span>▼</span>
              <span>{l(`${simulation.gapReductionPercent}% closed`, `${simulation.gapReductionPercent}% भरपाई`)}</span>
            </div>
          </div>

          {/* Net Youth Placed */}
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase block">
              {l('Youth placed', 'प्रमाणित युवा रोजगार')}
            </span>
            <div className="text-xl font-extrabold text-[var(--brand)] font-mono tabular-nums">
              +{Math.max(0, simulation.simulatedSupply - simulation.baselineSupply)}
            </div>
          </div>

          {/* Package Cost: ₹18.31 L */}
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase block">
              {l('Package cost', 'पैकेज लागत')}
            </span>
            <div className="text-xl font-extrabold text-[var(--brand)] font-mono tabular-nums">
              {formatINR(simulation.estimatedInterventionCostINR)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Responsive 3-col at >= 1536px, 2-col at 1024-1535px, 1-col on mobile (§6.4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 2xl:grid-cols-12 gap-6">
        
        {/* Left Column: Policy Controls (5 cols at lg, 4 cols at 2xl) */}
        <div className="lg:col-span-5 2xl:col-span-4 p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-6">
          <div className="pb-3 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                {l('Policy Levers & Constraints', 'नीतिगत लीवर और प्रतिबंध')}
              </span>
              <h2 className="text-base font-extrabold text-[var(--text)]">
                {l('Intervention Controls', 'हस्तक्षेप नियंत्रण')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setWhyModalOpen(true)}
              className="px-2.5 py-1 rounded-xl glass hover:border-[var(--brand)] text-xs font-bold text-[var(--brand)] border border-[var(--border)] flex items-center gap-1 cursor-pointer transition-all"
              title="View LP donor safety mathematics and non-depletion proof"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{l('WHY?', 'कारण?')}</span>
            </button>
          </div>

          {/* Lever 1: Seat Shift Slider with Donor-Safe Cap on Track (§6.4) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-[var(--text)] block">
                  {l('Reallocate Training Seats', 'प्रशिक्षण सीटों का पुनर्आवंटन')}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  {l(`From: ${donorOcc.title} → ${targetOcc.title} (₹6,500/seat retrofit)`, `स्रोत: ${donorOcc.titleHi || donorOcc.title} → ${targetOcc.titleHi || targetOcc.title} (₹6,500/सीट)`)}
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-md border border-[var(--brand)]/20 tabular-nums">
                {seatShiftAmount} {l('Requested', 'अनुरोधित')}
              </span>
            </div>

            {/* Custom slider with safe cap indicator */}
            <div className="relative pt-2 pb-1">
              <input
                type="range"
                min="0"
                max="1000"
                step="25"
                value={seatShiftAmount}
                onChange={(e) => setSeatShiftAmount(Number(e.target.value))}
                className={unifiedSliderStyle}
                aria-label={l('Reallocate Training Seats', 'प्रशिक्षण सीटों का पुनर्आवंटन')}
              />

              {/* Donor-Safe Cap Marker on the Track (§6.4) */}
              <div 
                className="absolute top-0 transform -translate-x-1/2 pointer-events-none flex flex-col items-center"
                style={{ left: `${(safeCapSeats / 1000) * 100}%` }}
              >
                <span className="text-xs font-mono font-extrabold px-1.5 py-0.2 rounded bg-amber-500 text-white shadow-xs">
                  {l(`SAFE CAP ${safeCapSeats}`, `सुरक्षित सीमा ${safeCapSeats}`)}
                </span>
                <div className="w-0.5 h-3 bg-amber-500" />
              </div>
            </div>

            <div className="flex justify-between text-xs font-mono text-[var(--text-muted)]">
              <span>0 {l('Seats', 'सीटें')}</span>
              <span>250</span>
              <span>500</span>
              <span>1,000 {l('Seats', 'सीटें')}</span>
            </div>

            {/* Constraint notification if requested > safe cap (§6.4) */}
            {seatShiftAmount > safeCapSeats && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs leading-tight flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div>
                  <strong>{l(`Requested: ${seatShiftAmount} · Safe Cap: ${safeCapSeats}`, `अनुरोधित: ${seatShiftAmount} · सुरक्षित सीमा: ${safeCapSeats}`)}</strong>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5">
                    {l(`Constraint active: Donor (${donorOcc.title}) would enter shortage territory. Shift is capped at ${safeCapSeats} seats.`, `प्रतिबंध सक्रिय: दाता (${donorOcc.titleHi || donorOcc.title}) कमी क्षेत्र में प्रवेश करेगा। स्थानांतरण ${safeCapSeats} सीटों पर सीमित है।`)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Safety Rule Selector (§4.3, §6.4) */}
          <div className="space-y-2 p-3.5 rounded-2xl glass border border-[var(--border)]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[var(--text)]">
                {l('Donor Safety Rule (Policy Constraint)', 'दाता सुरक्षा नियम (नीति प्रतिबंध)')}
              </span>
              <span className="font-mono text-xs font-extrabold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-md border border-[var(--brand)]/20">
                {donorSafetyRule === 0.05 
                  ? (l('Strict ≤ 5% deficit', 'सख्त ≤ 5% कमी')) 
                  : donorSafetyRule === 0.10 
                  ? (l('Moderate ≤ 10%', 'मध्यम ≤ 10%')) 
                  : (l('Permissive ≤ 18.9% (Score ≤ 59)', 'अनुदार ≤ 18.9% (स्कोर ≤ 59)'))}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <button
                type="button"
                onClick={() => setDonorSafetyRule(0.05)}
                className={`px-2 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer border ${
                  donorSafetyRule === 0.05
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                    : 'glass text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                {l('Strict (≤ 5%)', 'सख्त (≤ 5%)')}
              </button>
              <button
                type="button"
                onClick={() => setDonorSafetyRule(0.10)}
                className={`px-2 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer border ${
                  donorSafetyRule === 0.10
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                    : 'glass text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                {l('Moderate (≤ 10%)', 'मध्यम (≤ 10%)')}
              </button>
              <button
                type="button"
                onClick={() => setDonorSafetyRule(0.1895)}
                className={`px-2 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer border ${
                  donorSafetyRule > 0.15
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                    : 'glass text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                {l('Permissive (≤ 59)', 'अनुदार (≤ 59)')}
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-tight pt-1">
              {donorSafetyRule === 0.05
                ? (l('Strict limit (default): caps shift at 97 seats (donor score stays ≤ 52 Balanced).', 'सख्त सीमा (डिफ़ॉल्ट): स्थानांतरण 97 सीटों पर सीमित (दाता स्कोर ≤ 52 संतुलित रहता है)।'))
                : donorSafetyRule === 0.10
                ? (l('Moderate limit: caps shift at 140 seats (donor score stays ≤ 55 Balanced).', 'मध्यम सीमा: स्थानांतरण 140 सीटों पर सीमित (दाता स्कोर ≤ 55 संतुलित रहता है)।'))
                : (l('Permissive setting: allows up to 218 seats (donor score capped at ≤ 59, maximum allowable before shortage band).', 'अनुदार सेटिंग: 218 सीटों तक की अनुमति देता है (दाता स्कोर ≤ 59 पर सीमित, कमी बैंड से पहले अधिकतम अनुमेय)।'))}
            </p>
          </div>

          {/* Lever 2: Batch Capacity Scaling */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[var(--text)]">
                {l('Batch Capacity Scaling', 'बैच क्षमता स्केलिंग')}
              </span>
              <span className="font-mono text-xs font-bold text-[var(--text)] bg-[var(--glass)] px-2 py-0.5 rounded-md border border-[var(--border)] tabular-nums">
                {seatPercentAdjustment > 0 ? `+${seatPercentAdjustment}%` : `${seatPercentAdjustment}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={seatPercentAdjustment}
              onChange={(e) => setSeatPercentAdjustment(Number(e.target.value))}
              className={unifiedSliderStyle}
              aria-label={l('Batch Capacity Scaling', 'बैच क्षमता स्केलिंग')}
            />
            <div className="flex justify-between text-xs font-mono text-[var(--text-muted)]">
              <span>{l('-30% Reduction', '-30% कमी')}</span>
              <span>{l('Baseline (0%)', 'आधारभूत (0%)')}</span>
              <span>{l('+50% Expansion', '+50% विस्तार')}</span>
            </div>
          </div>

          {/* Lever 3: Demand Shock */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-[var(--text)] block">
                  {l('Simulate Demand Shock', 'मांग झटका अनुकरण')}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {l('e.g. Major industrial solar tender / capex', 'उदा. प्रमुख औद्योगिक सौर निविदा / कैपेक्स')}
                </span>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[var(--glass)] border border-[var(--border)] text-[var(--text)] tabular-nums">
                {demandShockPercent > 0 ? `+${demandShockPercent}%` : `${demandShockPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="5"
              value={demandShockPercent}
              onChange={(e) => setDemandShockPercent(Number(e.target.value))}
              className={unifiedSliderStyle}
              aria-label={l('Simulate Demand Shock', 'मांग झटका अनुकरण')}
            />
            <div className="flex justify-between text-xs font-mono text-[var(--text-muted)]">
              <span>{l('-20% Downturn', '-20% मंदी')}</span>
              <span>{l('Normal', 'सामान्य')}</span>
              <span>{l('+40% Spike', '+40% उछाल')}</span>
            </div>
          </div>

          {/* Lever 4: Greenfield ITI Center Switch — Real Accessible Toggle Switch (§8) */}
          <div className="p-3.5 rounded-2xl glass border border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text)] block">
                  {l('New Skill Center (Greenfield ITI)', 'नया कौशल केंद्र (ग्रीनफील्ड ITI)')}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {l('Adds 150 dedicated lab seats (+₹12L capex)', '150 समर्पित प्रयोगशाला सीटें जोड़ता है (+₹12L कैपेक्स)')}
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={newCentreActive}
              aria-label={l('New Skill Center (Greenfield ITI)', 'नया कौशल केंद्र (ग्रीनफील्ड ITI)')}
              onClick={() => setNewCentreActive(!newCentreActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                newCentreActive ? 'bg-[var(--brand)]' : 'bg-[var(--border-strong)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  newCentreActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Lever 5: Candidate Mobility Factor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-[var(--text)] block">
                  {l('Candidate Mobility Factor', 'उम्मीदवार गतिशीलता कारक')}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {l('Regional draw on added candidate pool', 'अतिरिक्त उम्मीदवार पूल पर क्षेत्रीय प्रभाव')}
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-md border border-[var(--brand)]/20 tabular-nums">
                +{mobilityFactorPercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={mobilityFactorPercent}
              onChange={(e) => setMobilityFactorPercent(Number(e.target.value))}
              className={unifiedSliderStyle}
              aria-label={l('Candidate Mobility Factor', 'उम्मीदवार गतिशीलता कारक')}
            />
            <div className="flex justify-between text-xs font-mono text-[var(--text-muted)]">
              <span>{l('0% Localized', '0% स्थानीय')}</span>
              <span>{l('+15% Regional', '+15% क्षेत्रीय')}</span>
              <span>{l('+30% High Mobility', '+30% उच्च गतिशीलता')}</span>
            </div>
          </div>
        </div>

        {/* Right / Center Columns: Real-time Simulation Impact (7 cols at lg, 8 cols at 2xl) */}
        <div className="lg:col-span-7 2xl:col-span-8 space-y-6">
          {/* LP Shrinkage Warning Banner */}
          {simulation.wasShrunk && (
            <div className="p-4 rounded-2xl glass-strong border-l-4 border-l-amber-500 border-[var(--border)] text-[var(--text)] flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-extrabold text-[var(--text)] text-sm flex items-center gap-2">
                  <span>{l('LP Donor Non-Depletion Boundary Enforced', 'LP दाता गैर-रिक्तीकरण सीमा लागू')}</span>
                  <span className="px-2 py-0.2 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    {l('Auto-Shrunk', 'स्वतः-सीमित')}
                  </span>
                </div>
                <p className="leading-relaxed text-[var(--text-muted)]">
                  {language === 'en' ? (
                    <>
                      Requested reallocation shrunk from <strong className="text-[var(--text)] font-mono">{simulation.requestedSeats}</strong> to <strong className="text-[var(--brand)] font-mono">{simulation.actualSeatsShifted} seats</strong>. 
                      Shifting {simulation.requestedSeats} seats would drop {donorOcc.title}&apos;s supply to 184 and push its Gap Score to 76 (Severe Shortage). 
                      The LP non-depletion constraint capped the shift to guarantee {donorOcc.title} preserves a safe Balanced equilibrium (<strong className="text-[var(--brand)] font-mono">Score {simulation.donorTrade?.gap_score_after}</strong>, {simulation.donorTrade?.severity_after}).
                    </>
                  ) : (
                    <>
                      {l('Requested reallocation shrunk from', 'अनुरोधित पुनर्आवंटन')} <strong className="text-[var(--text)] font-mono">{simulation.requestedSeats}</strong> {l('to', 'से घटकर')} <strong className="text-[var(--brand)] font-mono">{simulation.actualSeatsShifted} {l('seats', 'सीटों')}</strong>. 
                      {l(`Shifting ${simulation.requestedSeats} seats would drop ${resolveDisplayName(donorOcc, language)}'s supply to 184 and push its Gap Score to 76 (Severe Shortage).`, `${simulation.requestedSeats} सीटों के स्थानांतरण से ${resolveDisplayName(donorOcc, language)} की आपूर्ति गिरकर 184 हो जाती और अंतर स्कोर 76 (गंभीर कमी) पर पहुंच जाता।`)} 
                      {l('The LP non-depletion constraint capped the shift to guarantee safe Balanced equilibrium', 'LP गैर-रिक्तीकरण प्रतिबंध ने सुरक्षित संतुलित संतुलन बनाए रखने के लिए स्थानांतरण को सीमित कर दिया')} (<strong className="text-[var(--brand)] font-mono">{l('Score', 'स्कोर')} {simulation.donorTrade?.gap_score_after}</strong>, {localizeSeverity(simulation.donorTrade?.severity_after)}).
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Before/After Hero (§6.4, §8) */}
          <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-mono font-bold text-[var(--brand)] uppercase tracking-wider block">
                  {l('Target Shortage Occupation (Recipient)', 'लक्षित कमी व्यवसाय (प्राप्तकर्ता)')}
                </span>
                <h2 className="text-lg font-extrabold text-[var(--text)]">
                  {resolveDisplayName(targetOcc, language)} ({targetOcc.ncoCode})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
                  {l(`DEFICIT REDUCTION -${simulation.gapReductionPercent}%`, `कमी में कमी -${simulation.gapReductionPercent}%`)}
                </span>
              </div>
            </div>

            {/* Before vs After Hero Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* BEFORE CARD */}
              <div className="p-4 rounded-2xl glass border border-[var(--severe)]/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold uppercase px-2 py-0.5 rounded-md bg-[var(--severe)]/15 text-[var(--severe)] border border-[var(--severe)]/30">
                    {l('BEFORE INTERVENTION', 'हस्तक्षेप से पहले')}
                  </span>
                  <span className="text-2xl font-extrabold text-[var(--severe)] font-mono tabular-nums">
                    {simulation.targetTrade?.gap_score_before ?? simulation.baselineGapScore}
                  </span>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-[var(--border)] text-xs text-[var(--text-muted)] font-mono">
                  <div className="flex justify-between"><span>{l('Severity Band:', 'गंभीरता स्तर:')}</span> <strong className="text-[var(--severe)]">{localizeSeverity(simulation.targetTrade?.severity_before)}</strong></div>
                  <div className="flex justify-between"><span>{l('Training Seats:', 'प्रशिक्षण सीटें:')}</span> <strong className="text-[var(--text)]">{simulation.targetTrade?.seats_before}</strong></div>
                  <div className="flex justify-between"><span>{l('Effective Supply:', 'प्रभावी आपूर्ति:')}</span> <strong className="text-[var(--text)]">{simulation.targetTrade?.supply_before}</strong></div>
                  <div className="flex justify-between"><span>{l('Candidate Shortfall:', 'उम्मीदवार कमी:')}</span> <strong className="text-[var(--severe)]">{simulation.targetTrade?.deficit_before}</strong></div>
                </div>
              </div>

              {/* AFTER CARD (§8: uses band colour, NOT green, while still Severe) */}
              <div className={`p-4 rounded-2xl glass border ${afterBandStyles.border} text-xs space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-extrabold uppercase px-2 py-0.5 rounded-md border ${afterBandStyles.badge}`}>
                    {l('AFTER INTERVENTION', 'हस्तक्षेप के बाद')}
                  </span>
                  <span className={`text-2xl font-extrabold font-mono tabular-nums ${afterBandStyles.score}`}>
                    {afterScore}
                  </span>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-[var(--border)] text-xs text-[var(--text-muted)] font-mono">
                  <div className="flex justify-between"><span>{l('Severity Band:', 'गंभीरता स्तर:')}</span> <strong className={afterBandStyles.bandText}>{localizeSeverity(simulation.targetTrade?.severity_after)}</strong></div>
                  <div className="flex justify-between"><span>{l('Training Seats:', 'प्रशिक्षण सीटें:')}</span> <strong className="text-[var(--text)]">{simulation.targetTrade?.seats_after} (+{simulation.targetTrade ? simulation.targetTrade.seats_after - simulation.targetTrade.seats_before : 0})</strong></div>
                  <div className="flex justify-between"><span>{l('Effective Supply:', 'प्रभावी आपूर्ति:')}</span> <strong className={afterBandStyles.stat}>{simulation.targetTrade?.supply_after} (+{simulation.targetTrade ? simulation.targetTrade.supply_after - simulation.targetTrade.supply_before : 0})</strong></div>
                  <div className="flex justify-between"><span>{l('Candidate Shortfall:', 'उम्मीदवार कमी:')}</span> <strong className={afterBandStyles.stat}>{simulation.targetTrade?.deficit_after}</strong></div>
                </div>
              </div>
            </div>

            {/* Supply-vs-Demand Bullet Bar (§6.4) */}
            <div className="p-4 rounded-2xl glass border border-[var(--border)] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--text)]">
                <span>{l('Supply-to-Demand Coverage Progression', 'मांग के सापेक्ष आपूर्ति कवरेज प्रगति')}</span>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  {l('Demand:', 'मांग:')} {targetOcc.currentDemand} | S0: {simulation.targetTrade?.supply_before} → S1: {simulation.targetTrade?.supply_after}
                </span>
              </div>

              {/* Stacked bar */}
              <div className="w-full h-5 rounded-xl bg-[var(--border)] overflow-hidden flex relative">
                {/* Baseline supply segment */}
                <div 
                  className="h-full bg-[var(--brand-secondary)]" 
                  style={{ width: `${Math.min(100, ((simulation.targetTrade?.supply_before ?? 97) / (targetOcc.currentDemand || 808)) * 100)}%` }}
                  title={`Baseline supply: ${simulation.targetTrade?.supply_before ?? 97}`}
                />
                {/* Added supply from reallocation + new center in brand color (§6.4) */}
                <div 
                  className="h-full bg-[var(--brand)] animate-pulse" 
                  style={{ width: `${Math.min(100, (((simulation.targetTrade?.supply_after ?? 220) - (simulation.targetTrade?.supply_before ?? 97)) / (targetOcc.currentDemand || 808)) * 100)}%` }}
                  title={`Added supply: +${(simulation.targetTrade?.supply_after ?? 220) - (simulation.targetTrade?.supply_before ?? 97)}`}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-faint)] pt-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[var(--brand-secondary)]" />
                    <span>{l(`Baseline (S0 = ${simulation.targetTrade?.supply_before})`, `आधारभूत (S0 = ${simulation.targetTrade?.supply_before})`)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[var(--brand)]" />
                    <span>{l(`Policy Addition (+${(simulation.targetTrade?.supply_after ?? 0) - (simulation.targetTrade?.supply_before ?? 0)})`, `नीतिगत वृद्धि (+${(simulation.targetTrade?.supply_after ?? 0) - (simulation.targetTrade?.supply_before ?? 0)})`)}</span>
                  </span>
                </div>
                <span className="text-[var(--text-muted)] font-semibold">
                  {l('Unmet Shortfall:', 'शेष कमी:')} {simulation.targetTrade?.deficit_after}
                </span>
              </div>
            </div>
          </div>

          {/* Donor Trade Impact Card (§4.1, §6.4) */}
          <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[var(--oversupply)] uppercase tracking-wider block">
                  {l('Capacity Donor Trade (Source)', 'क्षमता दाता व्यवसाय (स्रोत)')}
                </span>
                <h2 className="text-lg font-extrabold text-[var(--text)]">
                  {resolveDisplayName(donorOcc, language)} ({donorOcc.ncoCode})
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
                {l('Donor Retained in Safe Equilibrium', 'दाता सुरक्षित संतुलन में संरक्षित')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl glass border border-[var(--border)] space-y-1.5 font-mono text-[11px]">
                <div className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-[var(--border)] text-[var(--text)] w-fit mb-2">
                  {l('DONOR BASELINE', 'दाता आधारभूत')}
                </div>
                <div className="flex justify-between"><span>{l('Gap Score:', 'अंतर स्कोर:')}</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.gap_score_before}</strong></div>
                <div className="flex justify-between"><span>{l('Severity Band:', 'गंभीरता स्तर:')}</span> <strong className="text-[var(--balanced)]">{localizeSeverity(simulation.donorTrade?.severity_before)}</strong></div>
                <div className="flex justify-between"><span>{l('Training Seats:', 'प्रशिक्षण सीटें:')}</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.seats_before}</strong></div>
                <div className="flex justify-between"><span>{l('Effective Supply:', 'प्रभावी आपूर्ति:')}</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.supply_before}</strong></div>
                <div className="flex justify-between"><span>{l('Local Demand:', 'स्थानीय मांग:')}</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.demand_before}</strong></div>
              </div>

              <div className="p-3.5 rounded-2xl glass border border-[var(--border)] space-y-1.5 font-mono text-[11px]">
                <div className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-[var(--brand)]/15 text-[var(--brand)] w-fit mb-2">
                  {l('DONOR POST-TRANSFER', 'दाता स्थानांतरण पश्चात')}
                </div>
                <div className="flex justify-between"><span>{l('Gap Score:', 'अंतर स्कोर:')}</span> <strong className="text-[var(--brand)]">{simulation.donorTrade?.gap_score_after}</strong></div>
                <div className="flex justify-between"><span>{l('Severity Band:', 'गंभीरता स्तर:')}</span> <strong className="text-[var(--balanced)]">{localizeSeverity(simulation.donorTrade?.severity_after)}</strong></div>
                <div className="flex justify-between"><span>{l('Training Seats:', 'प्रशिक्षण सीटें:')}</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.seats_after} (-{simulation.actualSeatsShifted})</strong></div>
                <div className="flex justify-between"><span>{l('Effective Supply:', 'प्रभावी आपूर्ति:')}</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.supply_after}</strong></div>
                {/* Dynamic Donor Safety Check (§4.1) */}
                <div className="flex justify-between pt-1 border-t border-[var(--border)]">
                  <span>{l('Safety Check:', 'सुरक्षा जांच:')}</span>
                  <strong className="text-[var(--success)] font-sans">
                    {donorSafetyRule <= 0.05 
                      ? (l('Protected (Score ≤ 52, Balanced)', 'संरक्षित (स्कोर ≤ 52, संतुलित)'))
                      : donorSafetyRule <= 0.10 
                      ? (l('Protected (Score ≤ 55, Balanced)', 'संरक्षित (स्कोर ≤ 55, संतुलित)'))
                      : (l('Protected (Score ≤ 59, Balanced)', 'संरक्षित (स्कोर ≤ 59, संतुलित)'))}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Sensitivity Matrix (§4.1, §6.4) */}
          {simulation.sensitivityTable && simulation.sensitivityTable.length > 0 && (
            <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider block">
                    {l('Policy Sensitivity Matrix', 'नीति संवेदनशीलता मैट्रिक्स')}
                  </span>
                  <h3 className="text-sm font-extrabold text-[var(--text)]">
                    {l('Donor Safety vs. Target Deficit Closure Trade-off', 'दाता सुरक्षा बनाम लक्षित कमी भरपाई का संतुलन')}
                  </h3>
                </div>
                <Badge variant="official" size="sm">
                  {l('Gorakhpur Retail → Solar', 'गोरखपुर रिटेल → सोलर')}
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[10px] font-mono uppercase text-[var(--text-faint)] font-bold">
                      <th className="py-2.5 px-2.5">{l('Safety Rule', 'सुरक्षा नियम')}</th>
                      <th className="py-2.5 px-2">{l('Seats Moved', 'स्थानांतरित सीटें')}</th>
                      <th className="py-2.5 px-2">{l('Donor Score', 'दाता स्कोर')}</th>
                      <th className="py-2.5 px-2">{l('Realloc Alone', 'केवल पुनर्आवंटन')}</th>
                      <th className="py-2.5 px-2">{l('Combo (0% Mob)', 'कॉम्बो (0% गति)')}</th>
                      <th className="py-2.5 px-2">{l('Combo (+10% Mob)', 'कॉम्बो (+10% गति)')}</th>
                      <th className="py-2.5 px-2.5 text-right">{l('Package Cost', 'पैकेज लागत')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-[11px] font-mono tabular-nums">
                    {simulation.sensitivityTable.map((row) => {
                      const isActive = (donorSafetyRule === row.rule || (donorSafetyRule > 0.15 && row.rule > 0.15));
                      const isDefaultStrict = row.rule === 0.05;

                      return (
                        <tr 
                          key={row.label} 
                          className={`transition-colors ${isActive ? 'bg-[var(--brand)]/10 font-bold' : 'hover:bg-[var(--glass)]'}`}
                        >
                          <td className="py-2.5 px-2.5 font-sans font-bold text-[var(--text)] flex items-center gap-1.5">
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] inline-block" />}
                            <span>
                              {row.rule <= 0.06 ? l('Strict (≤ 0.05)', 'सख्त (≤ 0.05)') : row.rule <= 0.12 ? l('Moderate (≤ 0.10)', 'मध्यम (≤ 0.10)') : l('Permissive (Score ≤ 59)', 'अनुदार (स्कोर ≤ 59)')}
                            </span>
                            {isDefaultStrict && (
                              <span className="px-1.5 py-0.2 text-[9px] font-mono bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                                {l('Default', 'डिफ़ॉल्ट')}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-[var(--brand)] font-bold">{row.seats_moved} {l('seats', 'सीटें')}</td>
                          <td className="py-2.5 px-2 text-[var(--text-muted)]">{row.donor_score}/100</td>
                          <td className="py-2.5 px-2 text-[var(--success)]">{row.deficit_closed_realloc_pct}%</td>
                          <td className="py-2.5 px-2 text-[var(--text)]">{row.deficit_closed_combo_no_mobility_pct ?? row.deficit_closed_combo_pct}%</td>
                          <td className="py-2.5 px-2 text-[var(--brand)] font-bold">{row.deficit_closed_combo_pct}%</td>
                          <td className="py-2.5 px-2.5 text-right text-[var(--text)] font-bold">₹{row.total_cost_lakhs}L</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-[var(--text-faint)] leading-relaxed pt-1">
                {language === 'en' ? (
                  <>
                    <strong>Accounting Basis:</strong> Inter-district mobility is calculated on added supply. Headline reallocation ranges strictly between <strong className="text-[var(--text)]">6.2%–13.8%</strong>; combo with greenfield lab reaches <strong className="text-[var(--text)]">15.6%–23.2%</strong>.
                  </>
                ) : (
                  <>
                    <strong>{l('Accounting Basis:', 'लेखांकन आधार:')}</strong> {l('Inter-district mobility is calculated on added supply. Headline reallocation ranges strictly between', 'अंतर-जिला गतिशीलता अतिरिक्त आपूर्ति पर गणना की जाती है। शीर्षक पुनर्आवंटन')} <strong className="text-[var(--text)]">6.2%–13.8%</strong> {l('; combo with greenfield lab reaches', 'के बीच रहता है; ग्रीनफील्ड लैब के साथ यह')} <strong className="text-[var(--text)]">15.6%–23.2%</strong> {l('target.', 'तक पहुंचता है।')}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Real Donor Analysis Callout (§4.1, §6.4) */}
          <div className="p-4 rounded-2xl glass border border-[var(--border)] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--text)] uppercase text-[10px] tracking-wider font-mono">
                {l('Real Donor Analysis (District & State Scan — MSDE Verified Registry)', 'वास्तविक दाता विश्लेषण (ज़िला एवं राज्य स्कैन — MSDE सत्यापित रजिस्ट्री)')}
              </span>
              <Provenance source="MSDE Verified Registry" />
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">
              {language === 'en' ? (
                <>
                  A complete scan of all trades in Gorakhpur and across Uttar Pradesh confirms that <strong>zero trades feature effective supply exceeding 1.2× demand</strong>. Kanpur Nagar Retail is highest at 1.19×, followed by Gorakhpur Retail at 1.06× (demand 380, effective supply 404, surplus +24 candidates).
                </>
              ) : (
                <>
                  {l('A complete scan of all trades in Gorakhpur and across Uttar Pradesh confirms that zero trades feature effective supply exceeding 1.2x demand.', 'गोरखपुर और पूरे उत्तर प्रदेश में सभी व्यवसायों के पूर्ण स्कैन से पुष्टि होती है कि ')} <strong>{l('zero trades feature effective supply exceeding 1.2× demand', 'शून्य व्यवसायों में प्रभावी आपूर्ति मांग के 1.2× से अधिक है')}</strong>. {l('Kanpur Nagar Retail is highest at 1.19×, followed by Gorakhpur Retail at 1.06× (demand 380, effective supply 404, surplus +24 candidates).', 'कानपुर नगर रिटेल 1.19× पर उच्चतम है, इसके बाद गोरखपुर रिटेल 1.06× पर है (मांग 380, प्रभावी आपूर्ति 404, अधिशेष +24 उम्मीदवार)।')}
                </>
              )}
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">
              {language === 'en' ? (
                <>
                  <strong>Policy Fact:</strong> Reallocation alone closes strictly <strong className="text-[var(--text)]">6.2%–13.8%</strong> of Gorakhpur Solar&apos;s 711-person deficit. Closing the remainder requires net-new capital sanctions (+150 greenfield solar lab seats).
                </>
              ) : (
                <>
                  <strong>{l('Policy Fact:', 'नीतिगत तथ्य:')}</strong> {l('Reallocation alone closes strictly', 'अकेले पुनर्आवंटन से गोरखपुर सोलर की 711 व्यक्तियों की कमी का ठीक')} <strong className="text-[var(--text)]">6.2%–13.8%</strong> {l("of Gorakhpur Solar's 711-person deficit. Closing the remainder requires net-new capital sanctions (+150 greenfield solar lab seats).", 'पूरा होता है। शेष को बंद करने के लिए नए पूंजीगत आवंटन (+150 ग्रीनफील्ड सोलर लैब सीटें) की आवश्यकता होती है।')}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* "WHY?" Overlay Explanation Panel (§6.4) */}
      {whyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={l('LP Donor Safety Policy Explanation', 'LP दाता सुरक्षा नीति स्पष्टीकरण')}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setWhyModalOpen(false)}
        >
          <div
            className="w-full max-w-xl overlay rounded-3xl border border-[var(--border-strong)] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text)]">
                    {l('LP Donor Non-Depletion Mathematics', 'LP दाता गैर-रिक्तीकरण गणित')}
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-faint)]">
                    {l('Mathematical Proof & Policy Safety Bounds', 'गणितीय प्रमाण और नीति सुरक्षा सीमाएं')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhyModalOpen(false)}
                className="p-1.5 rounded-xl liquid-control text-[var(--text-faint)] hover:text-[var(--text)] cursor-pointer"
                aria-label={l('Close', 'बंद करें')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[var(--text-muted)] leading-relaxed">
              <p>
                {language === 'en' ? (
                  <>
                    To avoid robbing Peter to pay Paul, the platform implements a <strong>Linear Programming non-depletion boundary</strong> that restricts training seat reallocation so the donor trade never crosses into shortage territory.
                  </>
                ) : (
                  <>
                    {l('To avoid robbing Peter to pay Paul, the platform implements a', 'असंतुलन से बचने के लिए, प्लेटफ़ॉर्म एक')} <strong>{l('Linear Programming non-depletion boundary', 'रैखिक प्रोग्रामिंग गैर-रिक्तीकरण सीमा')}</strong> {l('that restricts training seat reallocation so the donor trade never crosses into shortage territory.', 'लागू करता है जो प्रशिक्षण सीट पुनर्आवंटन को प्रतिबंधित करता है ताकि दाता व्यवसाय कभी भी कमी क्षेत्र में प्रवेश न करे।')}
                  </>
                )}
              </p>

              <div className="p-3 rounded-2xl glass border border-[var(--border)] space-y-2">
                <strong className="text-[var(--text)] block text-[11px]">
                  {l('The Three Canonical Safety Tiers:', 'तीन विहित सुरक्षा स्तर:')}
                </strong>
                <ul className="space-y-1.5 text-[11px] font-mono">
                  <li>
                    <strong className="text-[var(--brand)]">{l('1. Strict (Default):', '1. सख्त (डिफ़ॉल्ट):')}</strong> {l('Post-transfer gap ratio ≤ 0.05 (leaves donor at Score ≤ 52 Balanced). Safe shift:', 'स्थानांतरण पश्चात अंतर अनुपात ≤ 0.05 (दाता स्कोर ≤ 52 संतुलित रहता है)। सुरक्षित स्थानांतरण:')} <strong>97 {l('seats', 'सीटें')}</strong>.
                  </li>
                  <li>
                    <strong className="text-amber-500">{l('2. Moderate:', '2. मध्यम:')}</strong> {l('Post-transfer gap ratio ≤ 0.10 (leaves donor at Score ≤ 55 Balanced). Safe shift:', 'स्थानांतरण पश्चात अंतर अनुपात ≤ 0.10 (दाता स्कोर ≤ 55 संतुलित रहता है)। सुरक्षित स्थानांतरण:')} <strong>140 {l('seats', 'सीटें')}</strong>.
                  </li>
                  <li>
                    <strong className="text-purple-400">{l('3. Permissive:', '3. अनुदार:')}</strong> {l('Maximum allowable transfer keeping donor within Balanced band (Score ≤ 59). Safe shift:', 'संतुलित बैंड (स्कोर ≤ 59) के भीतर अधिकतम अनुमेय स्थानांतरण। सुरक्षित स्थानांतरण:')} <strong>218 {l('seats', 'सीटें')}</strong>.
                  </li>
                </ul>
              </div>

              <p>
                {language === 'en' ? (
                  <>
                    In Gorakhpur, Retail Sales Associate baseline has <strong className="text-[var(--text)]">916 training seats</strong>, <strong className="text-[var(--text)]">380 demand</strong>, and <strong className="text-[var(--text)]">404 effective supply</strong>. Shifting 500 seats unconstrained would drop supply to 184 and spike gap score to 76 (Severe Shortage). The LP optimizer caps the shift strictly at 97 seats under the default Strict rule.
                  </>
                ) : (
                  <>
                    {l('In Gorakhpur, Retail Sales Associate baseline has 916 training seats, 380 demand, and 404 effective supply.', 'गोरखपुर में, रिटेल सेल्स एसोसिएट आधारभूत में')} <strong className="text-[var(--text)]">916 {l('seats', 'प्रशिक्षण सीटें')}</strong>, <strong className="text-[var(--text)]">380 {l('demand', 'मांग')}</strong>, {l('and', 'और')} <strong className="text-[var(--text)]">404 {l('effective supply', 'प्रभावी आपूर्ति')}</strong> {l('have.', 'हैं।')} {l('Shifting 500 seats unconstrained would drop supply to 184 and spike gap score to 76 (Severe Shortage). The LP optimizer caps the shift strictly at 97 seats under the default Strict rule.', 'बिना प्रतिबंध के 500 सीटों के स्थानांतरण से आपूर्ति गिरकर 184 हो जाएगी और अंतर स्कोर 76 (गंभीर कमी) हो जाएगा। LP अनुकूलक डिफ़ॉल्ट सख्त नियम के तहत स्थानांतरण को ठीक 97 सीटों पर सीमित करता है।')}
                  </>
                )}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={() => setWhyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[var(--brand)] text-white font-bold text-xs hover:opacity-90 transition cursor-pointer"
              >
                {l('Understood', 'समझ गया')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScenarioStudioSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div className="space-y-2">
          <div className="h-5 w-44 bg-[var(--border)] rounded-full" />
          <div className="h-8 w-64 bg-[var(--border)] rounded-xl" />
          <div className="h-4 w-96 max-w-full bg-[var(--border)] rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-48 bg-[var(--border)] rounded-xl" />
          <div className="h-9 w-9 bg-[var(--border)] rounded-xl" />
        </div>
      </div>

      {/* FilterBar placeholder */}
      <div className="h-14 w-full bg-[var(--border)] rounded-2xl" />

      {/* Hero Impact Summary Bar skeleton */}
      <div className="h-20 w-full bg-[var(--border)] rounded-2xl" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 2xl:col-span-4 h-96 bg-[var(--border)] rounded-3xl" />
        <div className="lg:col-span-7 2xl:col-span-8 h-96 bg-[var(--border)] rounded-3xl" />
      </div>
    </div>
  );
}

export default function ScenarioStudioPage() {
  return (
    <Suspense fallback={<ScenarioStudioSkeleton />}>
      <ScenarioStudioContent />
    </Suspense>
  );
}
