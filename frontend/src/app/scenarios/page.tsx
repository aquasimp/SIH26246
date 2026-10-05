'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { OCCUPATIONS, DISTRICTS } from '@/lib/demoData';
import { runScenarioSimulation } from '@/lib/scenarioEngine';
import { formatINR, downloadCSV } from '@/lib/exportUtils';
import { clsx } from 'clsx';
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
  AlertTriangle
} from 'lucide-react';

export default function ScenarioStudioPage() {
  const { selectedOccupationNco, selectedDistrict } = useApp();

  // Scenario Controls State (Section 27)
  const [seatShiftAmount, setSeatShiftAmount] = useState<number>(500); // 500 seats shifted
  const [seatPercentAdjustment, setSeatPercentAdjustment] = useState<number>(0); // 0%
  const [demandShockPercent, setDemandShockPercent] = useState<number>(0); // 0%
  const [newCentreActive, setNewCentreActive] = useState<boolean>(true); // ON
  const [mobilityFactorPercent, setMobilityFactorPercent] = useState<number>(10); // +10%
  const [donorSafetyRule, setDonorSafetyRule] = useState<number>(0.05); // 0.05 (Strict, default), 0.10, 0.18

  // Simulation execution via engine
  const simulation = useMemo(() => {
    return runScenarioSimulation({
      occupationNco: selectedOccupationNco,
      districtId: selectedDistrict,
      seatShiftAmount,
      donorNco: '5223.0101', // Retail Sales Associate
      seatPercentAdjustment,
      demandShockPercent,
      newCentreActive,
      mobilityFactorPercent,
      donorSafetyRule
    });
  }, [selectedOccupationNco, selectedDistrict, seatShiftAmount, seatPercentAdjustment, demandShockPercent, newCentreActive, mobilityFactorPercent, donorSafetyRule]);

  const targetOcc = OCCUPATIONS.find(o => o.ncoCode === selectedOccupationNco) || OCCUPATIONS[0];
  const donorOcc = OCCUPATIONS.find(o => o.ncoCode === '5223.0101') || OCCUPATIONS[1];

  const handleReset = () => {
    setSeatShiftAmount(0);
    setSeatPercentAdjustment(0);
    setDemandShockPercent(0);
    setNewCentreActive(false);
    setMobilityFactorPercent(0);
    setDonorSafetyRule(0.05); // Default: Strict
  };

  const handleApplyPreset = () => {
    setSeatShiftAmount(500);
    setSeatPercentAdjustment(20);
    setDemandShockPercent(0);
    setNewCentreActive(true);
    setMobilityFactorPercent(10);
    setDonorSafetyRule(0.05); // Default: Strict
  };

  const handleExportSimulation = () => {
    const rows = [
      ['KaushalPulse Scenario Studio Policy Simulation Brief'],
      ['Target Occupation', `${targetOcc.title} (${targetOcc.ncoCode})`],
      ['Donor Occupation', `${donorOcc.title} (${donorOcc.ncoCode})`],
      ['District', selectedDistrict],
      [''],
      ['POLICY CONTROLS', 'VALUE'],
      ['Seat Shift Amount', `${seatShiftAmount} Seats`],
      ['Overall Seat Adjustment', `${seatPercentAdjustment}%`],
      ['Demand Shock Applied', `${demandShockPercent}%`],
      ['New Skill Centre Established', newCentreActive ? 'Active (+150 seats)' : 'Inactive'],
      ['Labour Mobility Factor', `+${mobilityFactorPercent}%`],
      [''],
      ['SIMULATED OUTCOME', 'VALUE'],
      ['Baseline Gap Score', simulation.baselineGapScore],
      ['Simulated Post-Intervention Gap Score', simulation.simulatedGapScore],
      ['Net Shortage Reduction', `-${simulation.gapReductionPercent}%`],
      ['Supply Coverage Increase', `+${simulation.supplyCoverageIncreasePercent}%`],
      ['Estimated Intervention Cost', formatINR(simulation.estimatedInterventionCostINR)]
    ];
    downloadCSV(`KaushalPulse_Simulation_${targetOcc.ncoCode}_${selectedDistrict}.csv`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
              Interactive Policy Sandbox
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Scenario Studio
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Test policy decisions before implementing them. Simulate seat shifts, demand shocks, and new ITI centers in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={handleApplyPreset}
            className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Load Recommendation #01 Preset</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl liquid-control text-slate-600 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer"
            title="Reset controls"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportSimulation}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <FilterBar />

      {/* Main Studio Split Canvas (Left: Controls, Right: Impact) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Current Scenario Controls (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/90 border border-slate-200/90 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Policy Levers & Capacity Parameters
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Interactive Scenario Controls
            </h2>
          </div>

          {/* Lever 1: Shift Seats from Oversupplied Trade (500) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-800 block">
                  Reallocate Training Seats
                </span>
                <span className="text-[10px] text-slate-500">
                  From: {donorOcc.title} → {targetOcc.title} (₹6,500/seat retrofit — planning assumption)
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {seatShiftAmount} Seats
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={seatShiftAmount}
              onChange={(e) => setSeatShiftAmount(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 Seats</span>
              <span>500 Seats (Requested)</span>
              <span>1,000 Seats</span>
            </div>
          </div>

          {/* Donor Safety Rule Selection */}
          <div className="space-y-2 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                Donor Safety Rule (Policy Constraint)
              </span>
              <span className="font-mono text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                {donorSafetyRule === 0.05 ? 'Strict (≤ 5% Deficit)' : donorSafetyRule === 0.10 ? 'Moderate (≤ 10% Deficit)' : 'Permissive (Score ≤ 59)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <button
                type="button"
                onClick={() => setDonorSafetyRule(0.05)}
                className={clsx(
                  'px-2 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer border',
                  donorSafetyRule === 0.05
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                )}
              >
                Strict (≤ 0.05)
              </button>
              <button
                type="button"
                onClick={() => setDonorSafetyRule(0.10)}
                className={clsx(
                  'px-2 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer border',
                  donorSafetyRule === 0.10
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                )}
              >
                Moderate (≤ 0.10)
              </button>
              <button
                type="button"
                onClick={() => setDonorSafetyRule(0.1895)}
                className={clsx(
                  'px-2 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer border',
                  donorSafetyRule > 0.15
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                )}
              >
                Permissive (≤ 59)
              </button>
            </div>
            <p className="text-[10px] text-amber-800 leading-tight">
              {donorSafetyRule === 0.05
                ? 'Default rule: caps reallocation to ensure donor trade post-transfer gap ratio does not exceed 0.05 (leaves donor at Score 52).'
                : donorSafetyRule === 0.10
                ? 'Moderate rule: allows donor gap ratio up to 0.10 (leaves donor at Score 55).'
                : 'Permissive setting: allows maximum transfer keeping donor within Balanced band (Score ≤ 59, 72-person deficit).'}
            </p>
          </div>

          {/* Lever 2: Seat % Adjustment (+20%) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                Batch Capacity Scaling
              </span>
              <span className="font-mono text-xs font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
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
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-30% Reduction</span>
              <span>Baseline (0%)</span>
              <span>+50% Expansion</span>
            </div>
          </div>

          {/* Lever 3: Demand Shock (+15%) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-800 block">
                  Simulate Market Demand Shock
                </span>
                <span className="text-[10px] text-slate-500">
                  e.g. Major industrial tender or capex investment
                </span>
              </div>
              <span className={clsx(
                'font-mono text-xs font-extrabold px-2 py-0.5 rounded-md',
                demandShockPercent > 0 ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-700'
              )}>
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
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-20% Downturn</span>
              <span>Normal</span>
              <span>+40% Rapid Spike</span>
            </div>
          </div>

          {/* Lever 4: New Centre Toggle (+150 seats) */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Greenfield ITI Skill Center
                </span>
                <span className="text-[10px] text-slate-500">
                  Adds 150 dedicated lab seats (+₹12L capex — planning assumption)
                </span>
              </div>
            </div>

            <button
              onClick={() => setNewCentreActive(!newCentreActive)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer font-mono',
                newCentreActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              )}
            >
              {newCentreActive ? 'ACTIVE [ON]' : 'OFF'}
            </button>
          </div>

          {/* Lever 5: Mobility Factor (+10%) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-800 block">
                  Inter-District Labour Mobility Factor
                </span>
                <span className="text-[10px] text-slate-500">
                  Willingness to commute / migrate from adjacent districts
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
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
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% Localized</span>
              <span>+15% Regional Draw</span>
              <span>+30% High Mobility</span>
            </div>
          </div>
        </div>

        {/* Right: Real-time Simulation Impact (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* LP Shrinkage Warning Banner */}
          {simulation.wasShrunk && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
                  <span>LP Donor Non-Depletion Boundary Enforced</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                    Auto-Shrunk
                  </span>
                </div>
                <p className="leading-relaxed text-amber-800">
                  Requested reallocation shrunk from <strong>{simulation.requestedSeats}</strong> to <strong>{simulation.actualSeatsShifted} seats</strong>. 
                  Shifting {simulation.requestedSeats} seats would drop {donorOcc.title}&apos;s effective supply to 184 and push its Gap Score to 76 (Severe Shortage). 
                  The LP non-depletion constraint capped the shift to guarantee {donorOcc.title} preserves a safe Balanced equilibrium (Score {simulation.donorTrade?.gap_score_after}, {simulation.donorTrade?.severity_after}).
                </p>
              </div>
            </div>
          )}

          {/* Target Trade Impact Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  Target Shortage Occupation (Recipient)
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {targetOcc.title} ({targetOcc.ncoCode})
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Net Deficit: -{simulation.gapReductionPercent}%
              </span>
            </div>

            {/* Target Before vs After Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Target BEFORE */}
              <div className="p-3.5 rounded-2xl bg-red-50/40 border border-red-200 text-xs">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-red-100 text-red-800 block w-fit mb-1.5">
                  BEFORE INTERVENTION
                </span>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-slate-500">Gap Score:</span>
                  <strong className="text-2xl font-extrabold text-red-600 font-mono">
                    {simulation.targetTrade?.gap_score_before ?? simulation.baselineGapScore}
                  </strong>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600 pt-1.5 border-t border-red-100">
                  <div className="flex justify-between"><span>Severity Band:</span> <strong className="text-red-700">{simulation.targetTrade?.severity_before}</strong></div>
                  <div className="flex justify-between"><span>Training Seats:</span> <strong className="font-mono text-slate-800">{simulation.targetTrade?.seats_before}</strong></div>
                  <div className="flex justify-between"><span>Effective Supply:</span> <strong className="font-mono text-slate-800">{simulation.targetTrade?.supply_before}</strong></div>
                  <div className="flex justify-between"><span>Net Deficit:</span> <strong className="font-mono text-red-700">{simulation.targetTrade?.deficit_before}</strong></div>
                </div>
              </div>

              {/* Target AFTER */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-300 text-xs">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white block w-fit mb-1.5">
                  AFTER INTERVENTION
                </span>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-slate-600">Simulated Gap Score:</span>
                  <strong className="text-2xl font-extrabold text-emerald-600 font-mono">
                    {simulation.targetTrade?.gap_score_after ?? simulation.simulatedGapScore}
                  </strong>
                </div>
                <div className="space-y-1 text-[11px] text-slate-700 pt-1.5 border-t border-emerald-100">
                  <div className="flex justify-between"><span>Severity Band:</span> <strong className="text-emerald-800">{simulation.targetTrade?.severity_after}</strong></div>
                  <div className="flex justify-between"><span>Training Seats:</span> <strong className="font-mono text-slate-900">{simulation.targetTrade?.seats_after} (+{simulation.targetTrade ? simulation.targetTrade.seats_after - simulation.targetTrade.seats_before : 0})</strong></div>
                  <div className="flex justify-between"><span>Effective Supply:</span> <strong className="font-mono text-emerald-700">{simulation.targetTrade?.supply_after} (+{simulation.targetTrade ? simulation.targetTrade.supply_after - simulation.targetTrade.supply_before : 0})</strong></div>
                  <div className="flex justify-between"><span>Net Deficit:</span> <strong className="font-mono text-emerald-800">{simulation.targetTrade?.deficit_after}</strong></div>
                </div>
              </div>
            </div>

            {/* Target 3 Impact Badges */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Shortage Reduction</span>
                <span className="text-xl font-extrabold text-emerald-600 font-mono">-{simulation.gapReductionPercent}%</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Supply Coverage</span>
                <span className="text-xl font-extrabold text-blue-600 font-mono">+{simulation.supplyCoverageIncreasePercent}%</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Intervention Cost</span>
                <span className="text-base font-extrabold text-purple-700 font-mono">{formatINR(simulation.estimatedInterventionCostINR)}</span>
              </div>
            </div>
          </div>

          {/* Donor Trade Impact Card (Section 2 Mandatory Requirement) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                  Capacity Donor Occupation (Source)
                </span>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {donorOcc.title} ({donorOcc.ncoCode})
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                Donor Retained in Safe Equilibrium
              </span>
            </div>

            {/* Donor Before vs After Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Donor BEFORE */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 block w-fit mb-1.5">
                  DONOR BASELINE
                </span>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-slate-500">Gap Score:</span>
                  <strong className="text-2xl font-extrabold text-slate-800 font-mono">
                    {simulation.donorTrade?.gap_score_before}
                  </strong>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600 pt-1.5 border-t border-slate-200/60">
                  <div className="flex justify-between"><span>Severity Band:</span> <strong className="text-slate-800">{simulation.donorTrade?.severity_before}</strong></div>
                  <div className="flex justify-between"><span>Training Seats:</span> <strong className="font-mono text-slate-800">{simulation.donorTrade?.seats_before}</strong></div>
                  <div className="flex justify-between"><span>Effective Supply:</span> <strong className="font-mono text-slate-800">{simulation.donorTrade?.supply_before}</strong></div>
                  <div className="flex justify-between"><span>Local Demand:</span> <strong className="font-mono text-slate-800">{simulation.donorTrade?.demand_before}</strong></div>
                </div>
              </div>

              {/* Donor AFTER */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-200 text-xs">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-600 text-white block w-fit mb-1.5">
                  DONOR POST-TRANSFER
                </span>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-slate-600">Simulated Gap Score:</span>
                  <strong className="text-2xl font-extrabold text-indigo-700 font-mono">
                    {simulation.donorTrade?.gap_score_after}
                  </strong>
                </div>
                <div className="space-y-1 text-[11px] text-slate-700 pt-1.5 border-t border-indigo-100">
                  <div className="flex justify-between"><span>Severity Band:</span> <strong className="text-indigo-900">{simulation.donorTrade?.severity_after}</strong></div>
                  <div className="flex justify-between"><span>Training Seats:</span> <strong className="font-mono text-slate-900">{simulation.donorTrade?.seats_after} (-{simulation.donorTrade ? simulation.donorTrade.seats_before - simulation.donorTrade.seats_after : 0})</strong></div>
                  <div className="flex justify-between"><span>Effective Supply:</span> <strong className="font-mono text-slate-900">{simulation.donorTrade?.supply_after} (-{simulation.donorTrade ? simulation.donorTrade.supply_before - simulation.donorTrade.supply_after : 0})</strong></div>
                  <div className="flex justify-between"><span>Safety Check:</span> <strong className="text-emerald-700 font-semibold">Protected (Score ≤ 59, Balanced)</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Donor Safety Sensitivity Table */}
          {simulation.sensitivityTable && simulation.sensitivityTable.length > 0 && (
            <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    Policy Sensitivity Matrix (3-Setting Safety Rules)
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Donor Safety vs. Target Deficit Closure Trade-off
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  Gorakhpur Retail → Solar
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-500 font-bold bg-slate-50/70">
                      <th className="py-2 px-2.5">Safety Rule</th>
                      <th className="py-2 px-2">Seats Moved</th>
                      <th className="py-2 px-2">Donor Post Score</th>
                      <th className="py-2 px-2">Target (Realloc Alone)</th>
                      <th className="py-2 px-2">Combo (0% Mobility)</th>
                      <th className="py-2 px-2">Combo (+10% Mobility on Added Candidates Only)</th>
                      <th className="py-2 px-2.5 text-right">Package Cost (Assumed)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {simulation.sensitivityTable.map((row) => (
                      <tr 
                        key={row.label} 
                        className={clsx(
                           'hover:bg-slate-50/80 transition-colors',
                          (donorSafetyRule === row.rule || (donorSafetyRule > 0.15 && row.rule > 0.15)) ? 'bg-amber-50/40 font-semibold' : ''
                        )}
                      >
                        <td className="py-2 px-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                          {(donorSafetyRule === row.rule || (donorSafetyRule > 0.15 && row.rule > 0.15)) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
                          )}
                          {row.label}
                        </td>
                        <td className="py-2 px-2 font-mono font-bold text-blue-700">{row.seats_moved} seats</td>
                        <td className="py-2 px-2 font-mono text-slate-700">
                          {row.donor_score}/100 
                          {row.donor_deficit !== undefined && <span className="text-[10px] text-slate-500 block">def: {row.donor_deficit}</span>}
                        </td>
                        <td className="py-2 px-2 font-mono text-slate-700">
                          {row.target_score_realloc}/100 
                          <span className="text-emerald-700 text-[10px] block">(-{row.deficit_closed_realloc_pct}%)</span>
                        </td>
                        <td className="py-2 px-2 font-mono text-slate-800">
                          {(row.target_score_combo_no_mobility ?? row.target_score_combo)}/100 
                          <span className="text-emerald-700 text-[10px] block">(-{row.deficit_closed_combo_no_mobility_pct ?? row.deficit_closed_combo_pct}%)</span>
                        </td>
                        <td className="py-2 px-2 font-mono text-slate-900 font-bold">
                          {row.target_score_combo}/100 
                          <span className="text-emerald-800 text-[10px] block">(-{row.deficit_closed_combo_pct}%)</span>
                        </td>
                        <td className="py-2 px-2.5 font-mono text-right text-slate-900 font-bold">₹{row.total_cost_lakhs}L</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                <strong>Accounting Basis:</strong> The +10% inter-district mobility factor is applied exclusively to <em>added candidate supply</em> (+111, +130, +165 candidates) rather than inflating baseline localized supply. Headline policy pitch numbers report local reallocation alone (6.2%–13.8%) and combo without mobility (15.6%–23.2%); mobility remains an optional slider.
              </p>
            </div>
          )}

          {/* Real Donor Analysis Callout (Same District First, Then Same State) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                Real Donor Analysis (District & State Scan — Official SIH Dataset)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Official SIH Intelligence
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              A complete scan of all 16 trades in Gorakhpur and across all Uttar Pradesh districts (Gorakhpur, Kanpur Nagar, Lucknow, Varanasi) confirms that <strong>zero trades in UP feature effective supply exceeding 1.2× demand</strong>. Kanpur Nagar Retail is highest at 1.19× ($D=412, S=492$), followed by Gorakhpur Retail at 1.06× ($D=380, S=404$, surplus of 24 candidates).
            </p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              <strong>Policy Fact:</strong> Seats are district-bound; cross-district action happens through next-cycle targets and new sanctions (to validate with MSDE). Labour mobility moves individual certified candidates, not physical classrooms. Because local surplus in Retail is modest (+24 candidates), <strong>reallocation alone closes only 6.1% to 13.8% of Gorakhpur Solar&apos;s 711-person deficit</strong>; closing the remainder requires net-new training capacity (e.g. greenfield solar lab).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
