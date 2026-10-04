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
  const [seatPercentAdjustment, setSeatPercentAdjustment] = useState<number>(20); // +20%
  const [demandShockPercent, setDemandShockPercent] = useState<number>(0); // 0%
  const [newCentreActive, setNewCentreActive] = useState<boolean>(true); // ON
  const [mobilityFactorPercent, setMobilityFactorPercent] = useState<number>(10); // +10%

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
      mobilityFactorPercent
    });
  }, [selectedOccupationNco, selectedDistrict, seatShiftAmount, seatPercentAdjustment, demandShockPercent, newCentreActive, mobilityFactorPercent]);

  const targetOcc = OCCUPATIONS.find(o => o.ncoCode === selectedOccupationNco) || OCCUPATIONS[0];
  const donorOcc = OCCUPATIONS.find(o => o.ncoCode === '5223.0101') || OCCUPATIONS[1];

  const handleReset = () => {
    setSeatShiftAmount(0);
    setSeatPercentAdjustment(0);
    setDemandShockPercent(0);
    setNewCentreActive(false);
    setMobilityFactorPercent(0);
  };

  const handleApplyPreset = () => {
    setSeatShiftAmount(500);
    setSeatPercentAdjustment(20);
    setDemandShockPercent(0);
    setNewCentreActive(true);
    setMobilityFactorPercent(10);
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
                  From: {donorOcc.title} → {targetOcc.title}
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
              <span>500 Seats (Recommended)</span>
              <span>1,000 Seats</span>
            </div>
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
                  Adds 150 dedicated lab seats (+₹12L capex)
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
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Before & After Card (Section 27) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-50/70 to-blue-50/40 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-5">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  Dynamic Impact Projection
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {targetOcc.title} — Intervention Comparison
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Real-Time Recalculated
              </span>
            </div>

            {/* Before vs After Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* BEFORE */}
              <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-red-100 text-red-800 block w-fit mb-2">
                  BEFORE INTERVENTION
                </span>
                <div className="text-xs text-slate-500">Baseline Gap Score:</div>
                <div className="text-4xl font-extrabold text-red-600 font-mono my-1">
                  {simulation.baselineGapScore}
                </div>
                <div className="text-xs font-bold text-red-700">
                  Severe Shortage Status
                </div>
                <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 flex justify-between">
                  <span>6M Shortage Probability:</span>
                  <strong className="font-mono text-red-600">{simulation.baselineShortageProbability}%</strong>
                </div>
              </div>

              {/* AFTER */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/40 border border-emerald-300 shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white block w-fit mb-2">
                  AFTER INTERVENTION
                </span>
                <div className="text-xs text-slate-600">Simulated Gap Score:</div>
                <div className="text-4xl font-extrabold text-emerald-600 font-mono my-1">
                  {simulation.simulatedGapScore}
                </div>
                <div className="text-xs font-bold text-emerald-700">
                  Moderate / Balanced Threshold
                </div>
                <div className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-emerald-200/50 flex justify-between">
                  <span>Simulated Shortage Risk:</span>
                  <strong className="font-mono text-emerald-700">{simulation.simulatedShortageProbability}%</strong>
                </div>
              </div>
            </div>

            {/* 3 Projected Impact Metrics (Section 27: -62% shortage, +14% supply coverage, ₹X cost) */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs mb-6 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Shortage Reduction
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
                  -{simulation.gapReductionPercent}%
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block">Net Deficit Closed</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Supply Coverage
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono">
                  +{simulation.supplyCoverageIncreasePercent}%
                </span>
                <span className="text-[10px] text-blue-700 font-semibold block">Effective Pool</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Intervention Cost
                </span>
                <span className="text-lg sm:text-2xl font-extrabold text-purple-700 font-mono">
                  {formatINR(simulation.estimatedInterventionCostINR)}
                </span>
                <span className="text-[10px] text-purple-700 font-semibold block">CapEx & Training</span>
              </div>
            </div>

            {/* Simulated 6-Month Trajectory Area */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Simulated Forward Supply Trajectory (6 Months)</span>
                <span className="text-slate-400 font-mono text-[11px]">Units: Certified Workers</span>
              </div>

              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                {simulation.projectedTimeSeries.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="text-[10px] text-slate-400 font-mono block">{p.month}</span>
                    <div className="text-xs font-bold text-emerald-600 font-mono mt-1">
                      {p.simulatedSupply}
                    </div>
                    <span className="text-[9px] text-slate-400 block line-through">
                      {p.baselineSupply}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
