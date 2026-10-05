'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Provenance } from '@/components/common/Provenance';
import { Badge } from '@/components/common/Badge';
import { OCCUPATIONS, DISTRICTS } from '@/lib/demoData';
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
  const { t, selectedSector, setSelectedOccupationNco, selectedOccupationNco, datasetMode } = useApp();
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
        <div className="flex items-center gap-2 mb-2">
          <Provenance type="official" note="National Demand Aggregation Matrix" />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20">
            Employer Pulse
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
          Labour Market Demand Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
          Aggregated employer hiring demand, skill momentum, and occupational pressure indices across India's industrial hubs.
        </p>
      </div>

      <FilterBar />

      {/* Top 4 Intelligence Indicator Cards (Section 17) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Demand Pressure Index */}
        <div className="p-5 rounded-2xl glass border border-[var(--border)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Demand Pressure Index
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-orange-500 tracking-tight font-mono">
              {activeOcc.demandPressureIndex} / 100
            </div>
            <div className="text-xs text-orange-600 font-semibold mt-0.5">
              High Hiring Urgency Signal
            </div>
          </div>
          <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${activeOcc.demandPressureIndex}%` }} />
          </div>
        </div>

        {/* Card 2: Current Demand Volume */}
        <div className="p-5 rounded-2xl glass border border-[var(--border)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Demand Volume (Active)
            </span>
            <div className="p-2 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-[var(--text)] tracking-tight font-mono">
              {activeOcc.currentDemand.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[var(--balanced)] mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{activeOcc.growthRate6M}% (6M Projected)</span>
            </div>
          </div>
          <span className="text-[10px] text-[var(--text-faint)]">Target trade: {activeOcc.title}</span>
        </div>

        {/* Card 3: Employer Activity */}
        <div className="p-5 rounded-2xl glass border border-[var(--border)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Employer Activity
            </span>
            <div className="p-2 rounded-xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-[var(--brand-secondary)] tracking-tight font-mono">
              {activeOcc.employerCount}
            </div>
            <div className="text-xs text-[var(--brand-secondary)] font-semibold mt-0.5">
              Verified Hiring Organisations
            </div>
          </div>
          <span className="text-[10px] text-[var(--text-faint)]">Avg Wage: ₹{activeOcc.averageWageINR.toLocaleString()}/mo</span>
        </div>

        {/* Card 4: Skill Momentum */}
        <div className="p-5 rounded-2xl glass border border-[var(--border)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Skill Momentum
            </span>
            <div className="p-2 rounded-xl bg-[var(--balanced)]/10 text-[var(--balanced)]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-[var(--balanced)] tracking-tight">
              Top 5%
            </div>
            <div className="text-xs text-[var(--balanced)] font-semibold mt-0.5">
              Fastest-Growing NCO Category
            </div>
          </div>
          <span className="text-[10px] text-[var(--text-faint)]">NSQF Level {activeOcc.nsqfLevel} Standard</span>
        </div>
      </div>

      {/* Selected Occupation Demand Concentration Banner */}
      <div className="p-5 rounded-2xl glass border border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-md border border-[var(--brand)]/20">
                NCO Code: {activeOcc.ncoCode}
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)]">{activeOcc.sector}</span>
            </div>
            <h2 className="text-lg font-extrabold text-[var(--text)]">
              {activeOcc.title} — Geographic Demand Distribution
            </h2>
          </div>

          <Link
            href={`/occupations/${activeOcc.ncoCode}`}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs self-start md:self-auto"
          >
            <span>View Full Occupation Deep-Dive</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {activeOcc.districtConcentrations.map((dist, idx) => (
            <div key={idx} className="p-3 rounded-xl glass-strong border border-[var(--border)]">
              <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">{dist.state}</span>
              <div className="text-sm font-bold text-[var(--text)] mt-0.5">{dist.district}</div>
              <div className="text-xs font-extrabold text-orange-500 mt-1 font-mono">
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
              <Search className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by title / NCO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-[var(--text)] focus:outline-none"
              />
            </div>
            <div className="flex rounded-xl p-0.5 liquid-control border border-[var(--border)] text-xs">
              <button
                onClick={() => setSortField('demand')}
                className={clsx('px-2.5 py-1 font-bold rounded-lg cursor-pointer text-xs', sortField === 'demand' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-muted)]')}
              >
                Demand
              </button>
              <button
                onClick={() => setSortField('growth')}
                className={clsx('px-2.5 py-1 font-bold rounded-lg cursor-pointer text-xs', sortField === 'growth' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-muted)]')}
              >
                Growth
              </button>
              <button
                onClick={() => setSortField('pressure')}
                className={clsx('px-2.5 py-1 font-bold rounded-lg cursor-pointer text-xs', sortField === 'pressure' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-muted)]')}
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
              <tr className="border-b border-[var(--border)] text-[var(--text-faint)] font-bold uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-[var(--border)]">
              {filteredOccupations.map((occ) => {
                const isSelected = occ.ncoCode === selectedOccupationNco;

                return (
                  <tr
                    key={occ.ncoCode}
                    onClick={() => setSelectedOccupationNco(occ.ncoCode)}
                    className={clsx(
                      'hover:bg-[var(--brand)]/5 transition-colors cursor-pointer',
                      isSelected && 'bg-[var(--brand)]/10 font-medium'
                    )}
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-[var(--text)]">{occ.title}</div>
                      <div className="text-[10px] text-[var(--text-faint)] font-mono mt-0.5">
                        NCO: {occ.ncoCode} | NSQF L{occ.nsqfLevel}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[var(--text-muted)]">
                      <span className="px-2 py-0.5 rounded-md glass text-[var(--text-muted)] text-[11px] font-semibold border border-[var(--border)]">
                        {occ.sector}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-[var(--text)] font-mono">
                      {occ.currentDemand.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono">
                      <span className={clsx(
                        'inline-flex items-center gap-0.5 font-bold text-xs',
                        occ.growthRate6M >= 0 ? 'text-[var(--balanced)]' : 'text-[var(--text-faint)]'
                      )}>
                        {occ.growthRate6M >= 0 ? '+' : ''}{occ.growthRate6M}%
                        {occ.growthRate6M >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center text-[var(--text-muted)] font-medium">
                      {occ.districtConcentrations[0]?.district || 'N/A'}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-500 font-mono font-bold text-[11px] border border-orange-500/20">
                        {occ.demandPressureIndex} / 100
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold font-mono',
                        occ.severity === 'Severe Shortage' ? 'bg-[var(--severe)]/10 text-[var(--severe)] border border-[var(--severe)]/20' :
                        occ.severity === 'Moderate Shortage' ? 'bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20' :
                        occ.severity === 'Severe Oversupply' ? 'bg-[var(--oversupply)]/10 text-[var(--oversupply)] border border-[var(--oversupply)]/20' :
                        'bg-[var(--balanced)]/10 text-[var(--balanced)] border border-[var(--balanced)]/20'
                      )}>
                        {occ.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center text-[var(--text-faint)] font-mono">
                      {occ.confidence}%
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/occupations/${occ.ncoCode}`}
                        className="p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--brand)] inline-flex items-center"
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
