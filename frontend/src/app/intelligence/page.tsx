'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { OCCUPATIONS, DISTRICTS } from '@/lib/demoData';
import { Occupation } from '@/lib/types';
import { clsx } from 'clsx';
import { 
  TrendingUp, 
  Building2, 
  Activity, 
  MapPin, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

export default function LabourIntelligencePage() {
  const { t, selectedSector, setSelectedOccupationNco, selectedOccupationNco } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'demand' | 'growth' | 'pressure'>('demand');

  // Filter occupations
  const filteredOccupations = OCCUPATIONS.filter(occ => {
    const matchesSector = selectedSector === 'All Sectors' || occ.sector === selectedSector;
    const matchesSearch = occ.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          occ.ncoCode.includes(searchTerm) ||
                          occ.sector.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSector && matchesSearch;
  }).sort((a, b) => {
    if (sortField === 'demand') return b.currentDemand - a.currentDemand;
    if (sortField === 'growth') return b.growthRate6M - a.growthRate6M;
    return b.demandPressureIndex - a.demandPressureIndex;
  });

  const activeOcc = OCCUPATIONS.find(o => o.ncoCode === selectedOccupationNco) || OCCUPATIONS[0];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
            Demand Aggregation & Pressure Analytics
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Labour Market Demand Intelligence
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Real-time aggregation of employer hiring demand, skill momentum, and occupational pressure across India's industrial corridors.
        </p>
      </div>

      <FilterBar />

      {/* Top 4 Intelligence Indicator Cards (Section 17) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Demand Pressure Index */}
        <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Demand Pressure Index
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-orange-600 tracking-tight font-mono">
              {activeOcc.demandPressureIndex} / 100
            </div>
            <div className="text-xs text-orange-700 font-semibold mt-0.5">
              High Hiring Urgency Signal
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${activeOcc.demandPressureIndex}%` }} />
          </div>
        </div>

        {/* Card 2: Current Demand Volume */}
        <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Demand Volume (Active)
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {activeOcc.currentDemand.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{activeOcc.growthRate6M}% (6M Projected)</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400">Target trade: {activeOcc.title}</span>
        </div>

        {/* Card 3: Employer Activity */}
        <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Employer Activity
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-indigo-700 tracking-tight font-mono">
              {activeOcc.employerCount}
            </div>
            <div className="text-xs text-indigo-600 font-semibold mt-0.5">
              Verified Hiring Organisations
            </div>
          </div>
          <span className="text-[10px] text-slate-400">Avg Wage: ₹{activeOcc.averageWageINR.toLocaleString()}/mo</span>
        </div>

        {/* Card 4: Skill Momentum */}
        <div className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Skill Momentum
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">
              Top 5%
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-0.5">
              Fastest-Growing NCO Category
            </div>
          </div>
          <span className="text-[10px] text-slate-400">NSQF Level {activeOcc.nsqfLevel} Standard</span>
        </div>
      </div>

      {/* Selected Occupation Demand Concentration Banner */}
      <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                NCO Code: {activeOcc.ncoCode}
              </span>
              <span className="text-xs font-semibold text-slate-500">{activeOcc.sector}</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {activeOcc.title} — Geographic Demand Distribution
            </h2>
          </div>

          <Link
            href={`/occupations/${activeOcc.ncoCode}`}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs self-start md:self-auto"
          >
            <span>View Full Occupation Deep-Dive</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {activeOcc.districtConcentrations.map((dist, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">{dist.state}</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{dist.district}</div>
              <div className="text-xs font-extrabold text-orange-600 mt-1 font-mono">
                {dist.demand.toLocaleString()} Positions
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Occupation Table (Section 17) */}
      <GlassPanel
        title="Comprehensive Occupational Demand Table"
        subtitle="Ranked list of standardized occupations showing current vacancies, projected growth rates, and pressure indices."
        action={
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by title / NCO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-slate-800 focus:outline-none"
              />
            </div>
            <div className="flex rounded-xl p-0.5 liquid-control border border-slate-200 text-xs">
              <button
                onClick={() => setSortField('demand')}
                className={clsx('px-2.5 py-1 font-bold rounded-lg cursor-pointer', sortField === 'demand' ? 'bg-blue-600 text-white' : 'text-slate-600')}
              >
                Demand
              </button>
              <button
                onClick={() => setSortField('growth')}
                className={clsx('px-2.5 py-1 font-bold rounded-lg cursor-pointer', sortField === 'growth' ? 'bg-blue-600 text-white' : 'text-slate-600')}
              >
                Growth
              </button>
              <button
                onClick={() => setSortField('pressure')}
                className={clsx('px-2.5 py-1 font-bold rounded-lg cursor-pointer', sortField === 'pressure' ? 'bg-blue-600 text-white' : 'text-slate-600')}
              >
                Pressure
              </button>
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Occupation & NCO</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3 text-right">Demand</th>
                <th className="py-3 px-3 text-right">6M Growth</th>
                <th className="py-3 px-3 text-center">Top District</th>
                <th className="py-3 px-3 text-center">Pressure Index</th>
                <th className="py-3 px-3 text-center">Severity</th>
                <th className="py-3 px-3 text-center">Confidence</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOccupations.map((occ) => {
                const isSelected = occ.ncoCode === selectedOccupationNco;

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
                        NCO: {occ.ncoCode} | NSQF L{occ.nsqfLevel}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {occ.sector}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-slate-900 font-mono">
                      {occ.currentDemand.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono">
                      <span className={clsx(
                        'inline-flex items-center gap-0.5 font-bold text-xs',
                        occ.growthRate6M >= 0 ? 'text-emerald-600' : 'text-slate-500'
                      )}>
                        {occ.growthRate6M >= 0 ? '+' : ''}{occ.growthRate6M}%
                        {occ.growthRate6M >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-700 font-medium">
                      {occ.districtConcentrations[0]?.district || 'N/A'}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 font-mono font-bold text-[11px] border border-orange-200">
                        {occ.demandPressureIndex} / 100
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold',
                        occ.severity === 'Severe Shortage' ? 'bg-red-100 text-red-800' :
                        occ.severity === 'Moderate Shortage' ? 'bg-orange-100 text-orange-800' :
                        occ.severity === 'Severe Oversupply' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-emerald-100 text-emerald-800'
                      )}>
                        {occ.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-600 font-mono">
                      {occ.confidence}%
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/occupations/${occ.ncoCode}`}
                        className="p-1.5 rounded-lg hover:bg-white text-blue-600 hover:text-blue-800 inline-flex items-center"
                        title="View detail"
                      >
                        <ChevronRight className="w-4 h-4" />
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
