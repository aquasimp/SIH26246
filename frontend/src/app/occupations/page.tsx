'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { OCCUPATIONS, SECTORS } from '@/lib/demoData';
import { clsx } from 'clsx';
import { 
  Briefcase, 
  Search, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

export default function OccupationsOverviewPage() {
  const { selectedSector, setSelectedSector } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOccupations = OCCUPATIONS.filter(o => {
    const matchesSector = selectedSector === 'All Sectors' || o.sector === selectedSector;
    const matchesSearch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.ncoCode.includes(searchTerm) ||
                          o.sector.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            NCO-2015 Occupational Standardisation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Occupational Standard & Trade Directory
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Standardized National Classification of Occupations (NCO) mapped directly to National Skills Qualification Framework (NSQF) levels and staged pipeline cohorts.
        </p>
      </div>

      <FilterBar />

      {/* Directory Grid */}
      <GlassPanel
        title="Standardized Occupations & Trades"
        subtitle="Explore detailed demand, staged supply pipelines, and predictive factor attributions."
        action={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or NCO code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-slate-800 focus:outline-none"
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOccupations.map((occ) => (
            <Link
              key={occ.ncoCode}
              href={`/occupations/${occ.ncoCode}`}
              className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    NCO {occ.ncoCode}
                  </span>
                  <span className={clsx(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold',
                    occ.severity === 'Severe Shortage' ? 'bg-red-100 text-red-800' :
                    occ.severity === 'Moderate Shortage' ? 'bg-orange-100 text-orange-800' :
                    occ.severity === 'Severe Oversupply' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-emerald-100 text-emerald-800'
                  )}>
                    {occ.severity}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {occ.title}
                </h3>
                <span className="text-xs text-slate-500 font-medium block mb-3">
                  {occ.sector} (NSQF Level {occ.nsqfLevel})
                </span>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase">Demand</span>
                    <strong className="text-slate-800 font-mono">{occ.currentDemand.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase">Supply</span>
                    <strong className="text-slate-800 font-mono">{occ.effectiveSupply.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-[9px] text-slate-400 block font-semibold uppercase">Gap Score</span>
                    <strong className="text-red-600 font-mono">{occ.gapScore}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 mb-2">
                  <span className="font-semibold text-slate-700">Top Skills: </span>
                  {occ.keySkills.slice(0, 2).join(', ')}...
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                <span>View Staged Pipeline & Forecast</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
