'use client';

import React from 'react';
import { 
  MapPin, 
  Briefcase, 
  Layers, 
  Clock, 
  TrendingUp, 
  SlidersHorizontal 
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { STATES, DISTRICTS, SECTORS, OCCUPATIONS } from '@/lib/demoData';
import { ForecastHorizon } from '@/lib/types';

export const FilterBar: React.FC = () => {
  const {
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedSector,
    setSelectedSector,
    selectedOccupationNco,
    setSelectedOccupationNco,
    forecastHorizon,
    setForecastHorizon
  } = useApp();

  // Filter districts belonging to selected state
  const availableDistricts = DISTRICTS.filter(d => d.state === selectedState);

  // When state changes, auto-pick first district in that state if current district isn't in state
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const inState = DISTRICTS.filter(d => d.state === newState);
    if (inState.length > 0 && !inState.some(d => d.id === selectedDistrict)) {
      setSelectedDistrict(inState[0].id);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-3 sm:p-4 mb-6 shadow-sm border border-white/80">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Intelligence Context Filters</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 flex-1 max-w-5xl">
          {/* State Filter */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
              State
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full text-xs font-semibold pl-7 pr-3 py-1.5 rounded-xl liquid-control text-slate-800 border border-slate-200/80 cursor-pointer"
              >
                {STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* District Filter */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
              District (LGD)
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-blue-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs font-semibold pl-7 pr-3 py-1.5 rounded-xl liquid-control text-blue-900 bg-blue-50/50 border border-blue-200 cursor-pointer"
              >
                {availableDistricts.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} (LGD {d.lgdCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sector Filter */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
              Sector
            </label>
            <div className="relative">
              <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full text-xs font-semibold pl-7 pr-3 py-1.5 rounded-xl liquid-control text-slate-800 border border-slate-200/80 cursor-pointer"
              >
                <option value="All Sectors">All Sectors (6)</option>
                {SECTORS.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Occupation Filter */}
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
              Occupation (NCO)
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedOccupationNco}
                onChange={(e) => setSelectedOccupationNco(e.target.value)}
                className="w-full text-xs font-semibold pl-7 pr-3 py-1.5 rounded-xl liquid-control text-slate-800 border border-slate-200/80 cursor-pointer truncate"
              >
                {OCCUPATIONS.map(occ => (
                  <option key={occ.ncoCode} value={occ.ncoCode}>
                    {occ.title} ({occ.ncoCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Forecast Horizon Switcher */}
          <div className="relative col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
              Forecast Horizon
            </label>
            <div className="flex rounded-xl p-0.5 liquid-control border border-slate-200/80">
              {(['3M', '6M', '12M'] as ForecastHorizon[]).map((hz) => (
                <button
                  key={hz}
                  onClick={() => setForecastHorizon(hz)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    forecastHorizon === hz
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {hz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
