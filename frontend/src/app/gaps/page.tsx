'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { GapChart } from '@/components/charts/GapChart';
import { OCCUPATIONS, DISTRICTS } from '@/lib/demoData';
import { clsx } from 'clsx';
import { 
  GitFork, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Search, 
  Sliders, 
  Layers, 
  Download,
  Eye,
  Filter
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

export default function SkillGapsPage() {
  const { selectedOccupationNco, setSelectedOccupationNco, selectedDistrict } = useApp();
  const [severityFilter, setSeverityFilter] = useState<'all' | 'shortage' | 'oversupply'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const activeOcc = OCCUPATIONS.find(o => o.ncoCode === selectedOccupationNco) || OCCUPATIONS[0];

  const handleExportGaps = () => {
    const rows = [
      ['Occupation', 'NCO Code', 'District', 'Current Demand', 'Effective Supply', 'Net Gap', 'Gap Score', 'Severity', 'Shortage Probability', 'Confidence'],
      ...OCCUPATIONS.map(o => [
        o.title,
        o.ncoCode,
        o.districtConcentrations[0]?.district || 'Gorakhpur',
        o.currentDemand,
        o.effectiveSupply,
        o.currentDemand - o.effectiveSupply,
        o.gapScore,
        o.severity,
        `${o.shortageProbability6M}%`,
        `${o.confidence}%`
      ])
    ];
    downloadCSV('KaushalPulse_Skill_Gap_Severity_Registry.csv', rows);
  };

  const filteredList = OCCUPATIONS.filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) || o.ncoCode.includes(searchTerm);
    if (severityFilter === 'shortage') return matchesSearch && (o.severity === 'Severe Shortage' || o.severity === 'Moderate Shortage');
    if (severityFilter === 'oversupply') return matchesSearch && (o.severity === 'Severe Oversupply' || o.severity === 'Moderate Oversupply');
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
            Labour Equilibrium Analysis
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Skill Gap & Shortage Intelligence
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Algorithmic detection of structural skill shortages, training oversupply, and employable workforce absorption gaps.
        </p>
      </div>

      <FilterBar />

      {/* Hero 3-Pillar Macro Summary (Section 20) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shortage Pillar */}
        <div 
          onClick={() => setSeverityFilter('shortage')}
          className={clsx(
            'p-5 rounded-2xl border transition-all cursor-pointer shadow-xs',
            severityFilter === 'shortage' 
              ? 'bg-red-50/90 border-red-400 ring-2 ring-red-500/20' 
              : 'bg-white/80 border-slate-200/80 hover:border-red-300'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Shortage Occupations
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          </div>
          <div className="my-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-red-600 font-mono">
              124
            </div>
            <div className="text-xs text-red-700 font-semibold mt-0.5">
              Trades Facing Structural Deficit
            </div>
          </div>
          <span className="text-[11px] text-slate-500">Immediate capacity expansion required</span>
        </div>

        {/* Balanced Pillar */}
        <div 
          onClick={() => setSeverityFilter('all')}
          className={clsx(
            'p-5 rounded-2xl border transition-all cursor-pointer shadow-xs',
            severityFilter === 'all' 
              ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20' 
              : 'bg-white/80 border-slate-200/80 hover:border-emerald-300'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Balanced Occupations
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </div>
          <div className="my-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">
              416
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-0.5">
              Stable Demand-Supply Alignment
            </div>
          </div>
          <span className="text-[11px] text-slate-500">Healthy training absorption rate</span>
        </div>

        {/* Oversupply Pillar */}
        <div 
          onClick={() => setSeverityFilter('oversupply')}
          className={clsx(
            'p-5 rounded-2xl border transition-all cursor-pointer shadow-xs',
            severityFilter === 'oversupply' 
              ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/20' 
              : 'bg-white/80 border-slate-200/80 hover:border-indigo-300'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Oversupply Occupations
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          </div>
          <div className="my-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 font-mono">
              87
            </div>
            <div className="text-xs text-indigo-700 font-semibold mt-0.5">
              Trades Exceeding Market Demand
            </div>
          </div>
          <span className="text-[11px] text-slate-500">Candidate reallocation candidates</span>
        </div>
      </div>

      {/* Hero Visual: Gap Score 84 (Section 21) */}
      <GlassPanel
        title={`Selected Trade Gap Diagnostics: ${activeOcc.title}`}
        subtitle={`Normalized Gap Score & sub-index breakdown for NCO ${activeOcc.ncoCode}.`}
        action={
          <Link
            href="/scenarios"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
            <span>Simulate Reallocation in Studio</span>
          </Link>
        }
      >
        <GapChart
          score={activeOcc.gapScore}
          severity={activeOcc.severity}
          demandPressure={activeOcc.demandPressureIndex}
          effectiveSupplyIndex={Math.round((activeOcc.effectiveSupply / (activeOcc.currentDemand || 1)) * 100)}
          forecastPressure={Math.round(activeOcc.shortageProbability6M * 1.15)}
          persistence={82}
          confidence={activeOcc.confidence}
        />
      </GlassPanel>

      {/* Gap Severity Registry Table (Section 20) */}
      <GlassPanel
        title="National Gap Severity Registry"
        subtitle="Granular breakdown of net labour gaps, forecast shortage probabilities, and severity classifications."
        action={
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search trade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-slate-800 focus:outline-none"
              />
            </div>
            <button
              onClick={handleExportGaps}
              className="px-3 py-1.5 rounded-xl liquid-control text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Registry</span>
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Occupation</th>
                <th className="py-3 px-3">District Hub</th>
                <th className="py-3 px-3 text-right">Current Demand</th>
                <th className="py-3 px-3 text-right">Effective Supply</th>
                <th className="py-3 px-3 text-right">Net Gap</th>
                <th className="py-3 px-3 text-center">Gap Score</th>
                <th className="py-3 px-3 text-center">Shortage Prob</th>
                <th className="py-3 px-3 text-center">Severity</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((occ) => {
                const isSelected = occ.ncoCode === activeOcc.ncoCode;
                const netGap = occ.currentDemand - occ.effectiveSupply;

                return (
                  <tr
                    key={occ.ncoCode}
                    onClick={() => setSelectedOccupationNco(occ.ncoCode)}
                    className={clsx(
                      'hover:bg-blue-50/50 transition-colors cursor-pointer',
                      isSelected && 'bg-blue-50/80 font-medium'
                    )}
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{occ.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        NCO: {occ.ncoCode}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {occ.districtConcentrations[0]?.district || 'Gorakhpur'}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-slate-800">
                      {occ.currentDemand.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono text-slate-800">
                      {occ.effectiveSupply.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold">
                      <span className={clsx(
                        netGap > 0 ? 'text-red-600' : 'text-indigo-600'
                      )}>
                        {netGap > 0 ? '+' : ''}{netGap.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={clsx(
                        'px-2 py-0.5 rounded-lg font-mono font-extrabold text-[11px] border',
                        occ.gapScore >= 75 ? 'bg-red-50 text-red-700 border-red-200' :
                        occ.gapScore >= 60 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        occ.gapScore >= 40 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-indigo-50 text-indigo-700 border-indigo-200'
                      )}>
                        {occ.gapScore}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700">
                      {occ.shortageProbability6M}%
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={clsx(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                        occ.severity === 'Severe Shortage' ? 'bg-red-100 text-red-800' :
                        occ.severity === 'Moderate Shortage' ? 'bg-orange-100 text-orange-800' :
                        occ.severity === 'Severe Oversupply' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-emerald-100 text-emerald-800'
                      )}>
                        {occ.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href="/scenarios"
                        className="p-1.5 rounded-lg hover:bg-white text-blue-600 hover:text-blue-800 inline-flex items-center"
                        title="Simulate this trade"
                      >
                        <Sliders className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
