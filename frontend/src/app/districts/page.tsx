'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { DISTRICTS, STATES } from '@/lib/demoData';
import { clsx } from 'clsx';
import { 
  MapPin, 
  Search, 
  ChevronRight, 
  AlertTriangle, 
  Building2, 
  Users, 
  TrendingUp 
} from 'lucide-react';

export default function DistrictsOverviewPage() {
  const { selectedState, setSelectedState } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = DISTRICTS.filter(d => {
    const matchesState = selectedState === 'All States' || d.state === selectedState;
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(d.lgdCode).includes(searchTerm);
    return matchesState && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            Geographic Hierarchy & LGD Mapping
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          District Labour Market Intelligence
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Local Government Directory (LGD) district-level profiles evaluating training infrastructure, employer demand signals, and structural skill mismatches.
        </p>
      </div>

      <FilterBar />

      {/* District Cards Grid */}
      <GlassPanel
        title="District Intelligence Directory"
        subtitle="Select a district to view localized training capacity, shortage probabilities, and recommended seat adjustments."
        action={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search district or LGD code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-slate-800 focus:outline-none"
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDistricts.map((d) => (
            <Link
              key={d.id}
              href={`/districts/${d.id}`}
              className="p-5 rounded-2xl bg-white/80 border border-slate-200/80 hover:border-blue-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    LGD: {d.lgdCode}
                  </span>
                  <span className={clsx(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold',
                    d.gapScore >= 75 ? 'bg-red-100 text-red-800' :
                    d.gapScore >= 60 ? 'bg-orange-100 text-orange-800' :
                    'bg-emerald-100 text-emerald-800'
                  )}>
                    Gap {d.gapScore}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {d.name}
                </h3>
                <span className="text-xs text-slate-500 font-medium block mb-3">
                  {d.state}
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">Demand Index</span>
                    <strong className="text-slate-800 font-mono">{d.demandIndex} / 100</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">Shortage Prob</span>
                    <strong className="text-red-600 font-mono">{d.shortageProbability6M}%</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 mb-2">
                  <div>
                    <span className="font-semibold text-slate-700">Infrastructure: </span>
                    {d.trainingCentresCount} Centres ({d.totalTrainingSeats} Seats)
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-red-700">Top Deficit: </span>
                    {d.topShortageTrades[0]}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                <span>View Full Profile</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
