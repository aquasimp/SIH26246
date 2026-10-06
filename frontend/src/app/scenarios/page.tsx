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

function ScenarioStudioContent() {
  const searchParams = useSearchParams();
  const { selectedOccupationNco, selectedDistrict, setSelectedOccupationNco, setSelectedDistrict, language, t } = useApp();

  // Scenario Levers State (§6.4)
  // Default values matching Gorakhpur Recommendation #01
  const [seatShiftAmount, setSeatShiftAmount] = useState<number>(500); // Requested 500, safely capped at 97
  const [seatPercentAdjustment, setSeatPercentAdjustment] = useState<number>(0); // 0%
  const [demandShockPercent, setDemandShockPercent] = useState<number>(0); // 0%
  const [newCentreActive, setNewCentreActive] = useState<boolean>(true); // ON (+150 seats, ₹12L)
  const [mobilityFactorPercent, setMobilityFactorPercent] = useState<number>(10); // +10%
  const [donorSafetyRule, setDonorSafetyRule] = useState<number>(0.05); // 0.05 (Strict, default), 0.10, 0.1895
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
    toast.info('Scenario levers reset to unadjusted baseline');
  };

  // "Load Recommendation #01 Preset" lands EXACTLY on 97 seats / donor 52 / ₹18.31L / 6.2% alone / 15.6% combo (§4.1)
  const handleApplyPreset = () => {
    setSelectedDistrict('gorakhpur');
    setSelectedOccupationNco('7126.0101');
    setSeatShiftAmount(500); // Will be safely capped to 97 seats by LP Strict rule
    setSeatPercentAdjustment(0);
    setDemandShockPercent(0);
    setNewCentreActive(true); // +150 greenfield lab seats (+₹12L)
    setMobilityFactorPercent(10); // +10% mobility on added supply
    setDonorSafetyRule(0.05); // Strict default
    toast.success('Recommendation #01 preset loaded: 97 seats • ₹18.31L • 15.6% closure');
  };

  const handleExportSimulation = () => {
    const rows = [
      ['KaushalPulse Scenario Studio Policy Simulation Brief'],
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
    downloadCSV(`KaushalPulse_Simulation_${targetOcc.ncoCode}_${selectedDistrict}.csv`, rows);
    toast.success('Simulation report downloaded successfully');
  };

  // Safe cap threshold for slider track (§6.4)
  const safeCapSeats = donorSafetyRule === 0.05 ? 97 : donorSafetyRule === 0.10 ? 140 : 218;

  return (
    <div className="space-y-6">
      {/* Title & Preset Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
              Interactive Policy Sandbox
            </span>
            <Provenance source="Official SIH" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            Scenario Studio
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            Test policy decisions before real-world capital deployment. Simulate seat shifts, demand shocks, greenfield labs, and candidate mobility under LP non-depletion constraints.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleApplyPreset}
            className="px-3.5 py-2 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Load canonical Recommendation #01: 97 seats • ₹18.31L • donor score 52"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Load Recommendation #01 Preset</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            title="Reset controls to baseline"
            aria-label="Reset controls"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportSimulation}
            className="px-3.5 py-2 rounded-xl liquid-control text-[var(--text)] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <FilterBar />

      {/* Hero Impact Summary Bar (§6.4: Gap Score 94→86, Shortfall 711→588, Reduction, Package Cost ₹18.31L) */}
      <div 
        aria-live="polite"
        className="p-4 sm:p-5 rounded-2xl glass-strong border border-[var(--border)] shadow-md flex flex-wrap items-center justify-between gap-4 sticky top-14 z-10"
      >
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]">
            <Sliders className="w-4 h-4" />
          </span>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-faint)] block">
              Simulated Policy Impact Summary
            </span>
            <span className="text-xs font-bold text-[var(--text)]">
              {targetOcc.title} in {selectedDistrict}
            </span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-4 sm:gap-8">
          {/* Gap Score 94 -> 86 */}
          <div>
            <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">Gap Score</span>
            <div className="text-xl font-extrabold text-[var(--text)] font-mono tabular-nums flex items-center gap-1.5">
              <span className="text-[var(--severe)]">{simulation.baselineGapScore}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
              <span className="text-amber-500">{simulation.simulatedGapScore}</span>
            </div>
          </div>

          {/* Shortfall: 711 -> 588 (or 600) */}
          <div>
            <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">Candidate Shortfall</span>
            <div className="text-xl font-extrabold text-[var(--text)] font-mono tabular-nums flex items-center gap-1.5">
              <span className="text-[var(--severe)]">{simulation.targetTrade?.deficit_before ?? 711}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-faint)]" />
              <span className="text-[var(--success)]">{simulation.targetTrade?.deficit_after ?? 588}</span>
            </div>
          </div>

          {/* Shortfall Closed */}
          <div>
            <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">
              {language === 'hi' ? 'कमी भरपाई' : 'Shortfall Closed'}
            </span>
            <div className="text-xl font-extrabold text-[var(--success)] font-mono tabular-nums flex items-center gap-1">
              <span>▼</span>
              <span>{language === 'hi' ? `कमी की ${simulation.gapReductionPercent}% भरपाई` : `${simulation.gapReductionPercent}% of shortfall closed`}</span>
            </div>
          </div>

          {/* Package Cost: ₹18.31 L */}
          <div>
            <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">Package Cost</span>
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
              <span className="text-[10px] font-bold font-mono text-[var(--text-faint)] uppercase tracking-wider block">
                Policy Levers & Constraints
              </span>
              <h2 className="text-base font-extrabold text-[var(--text)]">
                Intervention Controls
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setWhyModalOpen(true)}
              className="px-2.5 py-1 rounded-xl glass hover:border-[var(--brand)] text-[11px] font-bold text-[var(--brand)] border border-[var(--border)] flex items-center gap-1 cursor-pointer transition-all"
              title="View LP donor safety mathematics and non-depletion proof"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>WHY?</span>
            </button>
          </div>

          {/* Lever 1: Seat Shift Slider with Donor-Safe Cap on Track (§6.4) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-[var(--text)] block">
                  Reallocate Training Seats
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  From: {donorOcc.title} → {targetOcc.title} (₹6,500/seat retrofit)
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-md border border-[var(--brand)]/20 tabular-nums">
                {seatShiftAmount} Requested
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
                className="w-full accent-[var(--brand)] cursor-pointer h-2 rounded-lg bg-[var(--border)]"
                aria-label="Reallocate Training Seats"
              />

              {/* Donor-Safe Cap Marker on the Track (§6.4) */}
              <div 
                className="absolute top-0 transform -translate-x-1/2 pointer-events-none flex flex-col items-center"
                style={{ left: `${(safeCapSeats / 1000) * 100}%` }}
              >
                <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-amber-500 text-white shadow-xs">
                  SAFE CAP {safeCapSeats}
                </span>
                <div className="w-0.5 h-3 bg-amber-500" />
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[var(--text-faint)]">
              <span>0 Seats</span>
              <span>250</span>
              <span>500</span>
              <span>1,000 Seats</span>
            </div>

            {/* Constraint notification if requested > safe cap (§6.4) */}
            {seatShiftAmount > safeCapSeats && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500 text-[11px] leading-tight flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div>
                  <strong>Requested: {seatShiftAmount} · Safe Cap: {safeCapSeats}</strong>
                  <p className="text-[var(--text-muted)] text-[10px] mt-0.5">
                    Constraint active: Donor ({donorOcc.title}) would enter shortage territory. Shift is capped at {safeCapSeats} seats.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Safety Rule Selector (§4.3, §6.4) */}
          <div className="space-y-2 p-3.5 rounded-2xl glass border border-[var(--border)]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[var(--text)]">
                Donor Safety Rule (Policy Constraint)
              </span>
              <span className="font-mono text-[10px] font-extrabold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-md border border-[var(--brand)]/20">
                {donorSafetyRule === 0.05 ? 'Strict ≤ 5% deficit' : donorSafetyRule === 0.10 ? 'Moderate ≤ 10%' : 'Permissive ≤ 18.9% (Score ≤ 59)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <button
                type="button"
                onClick={() => setDonorSafetyRule(0.05)}
                className={`px-2 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer border ${
                  donorSafetyRule === 0.05
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                    : 'glass text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                Strict (≤ 5%)
              </button>
              <button
                type="button"
                onClick={() => setDonorSafetyRule(0.10)}
                className={`px-2 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer border ${
                  donorSafetyRule === 0.10
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                    : 'glass text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                Moderate (≤ 10%)
              </button>
              <button
                type="button"
                onClick={() => setDonorSafetyRule(0.1895)}
                className={`px-2 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer border ${
                  donorSafetyRule > 0.15
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                    : 'glass text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                Permissive (≤ 59)
              </button>
            </div>

            <p className="text-[10px] text-[var(--text-muted)] leading-tight pt-1">
              {donorSafetyRule === 0.05
                ? 'Strict limit (default): caps shift at 97 seats (donor score stays ≤ 52 Balanced).'
                : donorSafetyRule === 0.10
                ? 'Moderate limit: caps shift at 140 seats (donor score stays ≤ 55 Balanced).'
                : 'Permissive setting: allows up to 218 seats (donor score capped at ≤ 59, maximum allowable before shortage band).'}
            </p>
          </div>

          {/* Lever 2: Batch Capacity Scaling */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[var(--text)]">Batch Capacity Scaling</span>
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
              className="w-full accent-[var(--brand)] cursor-pointer h-2 rounded-lg bg-[var(--border)]"
              aria-label="Batch Capacity Scaling"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-faint)]">
              <span>-30% Reduction</span>
              <span>Baseline (0%)</span>
              <span>+50% Expansion</span>
            </div>
          </div>

          {/* Lever 3: Demand Shock */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-[var(--text)] block">Simulate Demand Shock</span>
                <span className="text-[10px] text-[var(--text-muted)]">e.g. Major industrial solar tender / capex</span>
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
              className="w-full accent-orange-500 cursor-pointer h-2 rounded-lg bg-[var(--border)]"
              aria-label="Simulate Demand Shock"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-faint)]">
              <span>-20% Downturn</span>
              <span>Normal</span>
              <span>+40% Spike</span>
            </div>
          </div>

          {/* Lever 4: Greenfield ITI Center Switch (role="switch") */}
          <div className="p-3.5 rounded-2xl glass border border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--text)] block">
                  New Skill Center (Greenfield ITI)
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Adds 150 dedicated lab seats (+₹12L capex)
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={newCentreActive}
              onClick={() => setNewCentreActive(!newCentreActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer border ${
                newCentreActive
                  ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                  : 'glass text-[var(--text-muted)] border-[var(--border)]'
              }`}
            >
              {newCentreActive ? 'ACTIVE [ON]' : 'OFF'}
            </button>
          </div>

          {/* Lever 5: Candidate Mobility Factor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-[var(--text)] block">
                  Candidate Mobility Factor
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Regional draw on added candidate pool
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded-md border border-[var(--success)]/20 tabular-nums">
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
              className="w-full accent-[var(--success)] cursor-pointer h-2 rounded-lg bg-[var(--border)]"
              aria-label="Candidate Mobility Factor"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-faint)]">
              <span>0% Localized</span>
              <span>+15% Regional</span>
              <span>+30% High Mobility</span>
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
                  <span>LP Donor Non-Depletion Boundary Enforced</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    Auto-Shrunk
                  </span>
                </div>
                <p className="leading-relaxed text-[var(--text-muted)]">
                  Requested reallocation shrunk from <strong className="text-[var(--text)] font-mono">{simulation.requestedSeats}</strong> to <strong className="text-[var(--brand)] font-mono">{simulation.actualSeatsShifted} seats</strong>. 
                  Shifting {simulation.requestedSeats} seats would drop {donorOcc.title}&apos;s supply to 184 and push its Gap Score to 76 (Severe Shortage). 
                  The LP non-depletion constraint capped the shift to guarantee {donorOcc.title} preserves a safe Balanced equilibrium (<strong className="text-[var(--success)] font-mono">Score {simulation.donorTrade?.gap_score_after}</strong>, {simulation.donorTrade?.severity_after}).
                </p>
              </div>
            </div>
          )}

          {/* Before/After Hero (§6.4) */}
          <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[var(--brand)] uppercase tracking-wider block">
                  Target Shortage Occupation (Recipient)
                </span>
                <h2 className="text-lg font-extrabold text-[var(--text)]">
                  {targetOcc.title} ({targetOcc.ncoCode})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30">
                  DEFICIT REDUCTION -{simulation.gapReductionPercent}%
                </span>
              </div>
            </div>

            {/* Before vs After Hero Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* BEFORE CARD */}
              <div className="p-4 rounded-2xl glass border border-[var(--severe)]/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md bg-[var(--severe)]/15 text-[var(--severe)] border border-[var(--severe)]/30">
                    BEFORE INTERVENTION
                  </span>
                  <span className="text-2xl font-extrabold text-[var(--severe)] font-mono tabular-nums">
                    {simulation.targetTrade?.gap_score_before ?? simulation.baselineGapScore}
                  </span>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] font-mono">
                  <div className="flex justify-between"><span>Severity Band:</span> <strong className="text-[var(--severe)]">{simulation.targetTrade?.severity_before}</strong></div>
                  <div className="flex justify-between"><span>Training Seats:</span> <strong className="text-[var(--text)]">{simulation.targetTrade?.seats_before}</strong></div>
                  <div className="flex justify-between"><span>Effective Supply:</span> <strong className="text-[var(--text)]">{simulation.targetTrade?.supply_before}</strong></div>
                  <div className="flex justify-between"><span>Candidate Shortfall:</span> <strong className="text-[var(--severe)]">{simulation.targetTrade?.deficit_before}</strong></div>
                </div>
              </div>

              {/* AFTER CARD */}
              <div className="p-4 rounded-2xl glass border border-[var(--success)]/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30">
                    AFTER INTERVENTION
                  </span>
                  <span className="text-2xl font-extrabold text-[var(--success)] font-mono tabular-nums">
                    {simulation.targetTrade?.gap_score_after ?? simulation.simulatedGapScore}
                  </span>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] font-mono">
                  <div className="flex justify-between"><span>Severity Band:</span> <strong className="text-amber-500">{simulation.targetTrade?.severity_after}</strong></div>
                  <div className="flex justify-between"><span>Training Seats:</span> <strong className="text-[var(--text)]">{simulation.targetTrade?.seats_after} (+{simulation.targetTrade ? simulation.targetTrade.seats_after - simulation.targetTrade.seats_before : 0})</strong></div>
                  <div className="flex justify-between"><span>Effective Supply:</span> <strong className="text-[var(--success)]">{simulation.targetTrade?.supply_after} (+{simulation.targetTrade ? simulation.targetTrade.supply_after - simulation.targetTrade.supply_before : 0})</strong></div>
                  <div className="flex justify-between"><span>Candidate Shortfall:</span> <strong className="text-[var(--success)]">{simulation.targetTrade?.deficit_after}</strong></div>
                </div>
              </div>
            </div>

            {/* Supply-vs-Demand Bullet Bar (§6.4) */}
            <div className="p-4 rounded-2xl glass border border-[var(--border)] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--text)]">
                <span>Supply-to-Demand Coverage Progression</span>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  Demand: {targetOcc.currentDemand} | S0: {simulation.targetTrade?.supply_before} → S1: {simulation.targetTrade?.supply_after}
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
                    <span>Baseline (S0 = {simulation.targetTrade?.supply_before})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[var(--brand)]" />
                    <span>Policy Addition (+{(simulation.targetTrade?.supply_after ?? 0) - (simulation.targetTrade?.supply_before ?? 0)})</span>
                  </span>
                </div>
                <span className="text-[var(--text-muted)] font-semibold">
                  Unmet Shortfall: {simulation.targetTrade?.deficit_after}
                </span>
              </div>
            </div>
          </div>

          {/* Donor Trade Impact Card (§4.1, §6.4) */}
          <div className="p-5 sm:p-6 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[var(--oversupply)] uppercase tracking-wider block">
                  Capacity Donor Trade (Source)
                </span>
                <h2 className="text-lg font-extrabold text-[var(--text)]">
                  {donorOcc.title} ({donorOcc.ncoCode})
                </h2>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
                Donor Retained in Safe Equilibrium
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl glass border border-[var(--border)] space-y-1.5 font-mono text-[11px]">
                <div className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-[var(--border)] text-[var(--text)] w-fit mb-2">
                  DONOR BASELINE
                </div>
                <div className="flex justify-between"><span>Gap Score:</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.gap_score_before}</strong></div>
                <div className="flex justify-between"><span>Severity Band:</span> <strong className="text-[var(--balanced)]">{simulation.donorTrade?.severity_before}</strong></div>
                <div className="flex justify-between"><span>Training Seats:</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.seats_before}</strong></div>
                <div className="flex justify-between"><span>Effective Supply:</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.supply_before}</strong></div>
                <div className="flex justify-between"><span>Local Demand:</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.demand_before}</strong></div>
              </div>

              <div className="p-3.5 rounded-2xl glass border border-[var(--border)] space-y-1.5 font-mono text-[11px]">
                <div className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-[var(--brand)]/15 text-[var(--brand)] w-fit mb-2">
                  DONOR POST-TRANSFER
                </div>
                <div className="flex justify-between"><span>Gap Score:</span> <strong className="text-[var(--brand)]">{simulation.donorTrade?.gap_score_after}</strong></div>
                <div className="flex justify-between"><span>Severity Band:</span> <strong className="text-[var(--balanced)]">{simulation.donorTrade?.severity_after}</strong></div>
                <div className="flex justify-between"><span>Training Seats:</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.seats_after} (-{simulation.actualSeatsShifted})</strong></div>
                <div className="flex justify-between"><span>Effective Supply:</span> <strong className="text-[var(--text)]">{simulation.donorTrade?.supply_after}</strong></div>
                {/* Dynamic Donor Safety Check (§4.1) */}
                <div className="flex justify-between pt-1 border-t border-[var(--border)]">
                  <span>Safety Check:</span>
                  <strong className="text-[var(--success)] font-sans">
                    {donorSafetyRule <= 0.05 
                      ? 'Protected (Score ≤ 52, Balanced)' 
                      : donorSafetyRule <= 0.10 
                      ? 'Protected (Score ≤ 55, Balanced)' 
                      : 'Protected (Score ≤ 59, Balanced)'}
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
                    Policy Sensitivity Matrix
                  </span>
                  <h3 className="text-sm font-extrabold text-[var(--text)]">
                    Donor Safety vs. Target Deficit Closure Trade-off
                  </h3>
                </div>
                <Badge variant="official" size="sm">
                  Gorakhpur Retail → Solar
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[10px] font-mono uppercase text-[var(--text-faint)] font-bold">
                      <th className="py-2.5 px-2.5">Safety Rule</th>
                      <th className="py-2.5 px-2">Seats Moved</th>
                      <th className="py-2.5 px-2">Donor Score</th>
                      <th className="py-2.5 px-2">Realloc Alone</th>
                      <th className="py-2.5 px-2">Combo (0% Mob)</th>
                      <th className="py-2.5 px-2">Combo (+10% Mob)</th>
                      <th className="py-2.5 px-2.5 text-right">Package Cost</th>
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
                            <span>{row.label}</span>
                            {isDefaultStrict && (
                              <span className="px-1.5 py-0.2 text-[9px] font-mono bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                                Default
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-[var(--brand)] font-bold">{row.seats_moved} seats</td>
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
                <strong>Accounting Basis:</strong> Inter-district mobility is calculated on added supply. Headline reallocation ranges strictly between <strong className="text-[var(--text)]">6.2%–13.8%</strong>; combo with greenfield lab reaches <strong className="text-[var(--text)]">15.6%–23.2%</strong>.
              </p>
            </div>
          )}

          {/* Real Donor Analysis Callout (§4.1, §6.4) */}
          <div className="p-4 rounded-2xl glass border border-[var(--border)] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--text)] uppercase text-[10px] tracking-wider font-mono">
                Real Donor Analysis (District & State Scan — Official SIH Dataset)
              </span>
              <Provenance source="Official SIH" />
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">
              A complete scan of all trades in Gorakhpur and across Uttar Pradesh confirms that <strong>zero trades feature effective supply exceeding 1.2× demand</strong>. Kanpur Nagar Retail is highest at 1.19×, followed by Gorakhpur Retail at 1.06× (demand 380, effective supply 404, surplus +24 candidates).
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed text-[11px]">
              <strong>Policy Fact:</strong> Reallocation alone closes strictly <strong className="text-[var(--text)]">6.2%–13.8%</strong> of Gorakhpur Solar&apos;s 711-person deficit. Closing the remainder requires net-new capital sanctions (+150 greenfield solar lab seats).
            </p>
          </div>
        </div>
      </div>

      {/* "WHY?" Overlay Explanation Panel (§6.4) */}
      {whyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="LP Donor Safety Policy Explanation"
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
                    LP Donor Non-Depletion Mathematics
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-faint)]">
                    Mathematical Proof & Policy Safety Bounds
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhyModalOpen(false)}
                className="p-1.5 rounded-xl liquid-control text-[var(--text-faint)] hover:text-[var(--text)] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[var(--text-muted)] leading-relaxed">
              <p>
                To avoid robbing Peter to pay Paul, the platform implements a <strong>Linear Programming non-depletion boundary</strong> that restricts training seat reallocation so the donor trade never crosses into shortage territory.
              </p>

              <div className="p-3 rounded-2xl glass border border-[var(--border)] space-y-2">
                <strong className="text-[var(--text)] block text-[11px]">The Three Canonical Safety Tiers:</strong>
                <ul className="space-y-1.5 text-[11px] font-mono">
                  <li><strong className="text-[var(--brand)]">1. Strict (Default):</strong> Post-transfer gap ratio ≤ 0.05 (leaves donor at Score ≤ 52 Balanced). Safe shift: <strong>97 seats</strong>.</li>
                  <li><strong className="text-amber-500">2. Moderate:</strong> Post-transfer gap ratio ≤ 0.10 (leaves donor at Score ≤ 55 Balanced). Safe shift: <strong>140 seats</strong>.</li>
                  <li><strong className="text-purple-400">3. Permissive:</strong> Maximum allowable transfer keeping donor within Balanced band (Score ≤ 59). Safe shift: <strong>218 seats</strong>.</li>
                </ul>
              </div>

              <p>
                In Gorakhpur, Retail Sales Associate baseline has <strong className="text-[var(--text)]">916 training seats</strong>, <strong className="text-[var(--text)]">380 demand</strong>, and <strong className="text-[var(--text)]">404 effective supply</strong>. Shifting 500 seats unconstrained would drop supply to 184 and spike gap score to 76 (Severe Shortage). The LP optimizer caps the shift strictly at 97 seats under the default Strict rule.
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={() => setWhyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[var(--brand)] text-white font-bold text-xs hover:opacity-90 transition cursor-pointer"
              >
                Understood
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
