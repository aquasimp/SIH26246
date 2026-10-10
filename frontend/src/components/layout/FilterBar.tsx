'use client';

import React from 'react';
import { 
  MapPin, 
  Briefcase, 
  Layers, 
  Clock, 
  TrendingUp, 
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { STATES, DISTRICTS, SECTORS, OCCUPATIONS } from '@/lib/demoData';
import { ForecastHorizon } from '@/lib/types';
import { getLocalizedEntityName, resolveDisplayName } from '@/lib/i18n';
import { clsx } from 'clsx';

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
    setForecastHorizon,
    language
  } = useApp();

  const isHi = language === 'hi';

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

  const handleReset = () => {
    setSelectedState('Uttar Pradesh');
    setSelectedDistrict('gorakhpur');
    setSelectedSector('All Sectors');
    setSelectedOccupationNco('7126.0101');
    setForecastHorizon('6M');
  };

  return (
    <div className="glass rounded-2xl p-3 sm:p-4 mb-6 border border-[var(--border)] shadow-xs">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text)] uppercase tracking-wider font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--brand)]" />
            <span>{isHi ? 'संदर्भ फ़िल्टर' : 'Context Filters'}</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-2 py-1 rounded-lg liquid-control text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer"
            title={isHi ? 'फ़िल्टर रीसेट करें' : 'Reset filters to default'}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isHi ? 'रीसेट' : 'Reset'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 flex-1 max-w-5xl">
          {/* State Filter */}
          <div className="relative">
            <label htmlFor="state-filter" className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-1 font-mono">
              {isHi ? 'राज्य' : 'State'}
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="state-filter"
                aria-label={isHi ? 'राज्य अनुसार फ़िल्टर करें' : 'Filter by state'}
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full text-xs font-semibold pl-7 pr-3 py-2 min-h-[40px] rounded-xl liquid-control text-[var(--text)] cursor-pointer"
              >
                {STATES.map(s => (
                  <option key={s} value={s} className="bg-[var(--surface-solid)] text-[var(--text)]">
                    {getLocalizedEntityName('states', s, language, s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* District Filter */}
          <div className="relative">
            <label htmlFor="district-filter" className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-1 font-mono">
              {isHi ? 'ज़िला (LGD)' : 'District (LGD)'}
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-[var(--brand)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="district-filter"
                aria-label={isHi ? 'ज़िला अनुसार फ़िल्टर करें' : 'Filter by district'}
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs font-semibold pl-7 pr-3 py-2 min-h-[40px] rounded-xl liquid-control text-[var(--brand)] border-[var(--brand)]/30 cursor-pointer"
              >
                {availableDistricts.map(d => (
                  <option key={d.id} value={d.id} className="bg-[var(--surface-solid)] text-[var(--text)]">
                    {getLocalizedEntityName('districts', d.name, language, d.name)} (LGD {d.lgdCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sector Filter */}
          <div className="relative">
            <label htmlFor="sector-filter" className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-1 font-mono">
              {isHi ? 'क्षेत्र' : 'Sector'}
            </label>
            <div className="relative">
              <Layers className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="sector-filter"
                aria-label={isHi ? 'औद्योगिक क्षेत्र अनुसार फ़िल्टर करें' : 'Filter by industrial sector'}
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full text-xs font-semibold pl-7 pr-3 py-2 min-h-[40px] rounded-xl liquid-control text-[var(--text)] cursor-pointer"
              >
                <option value="All Sectors" className="bg-[var(--surface-solid)] text-[var(--text)]">
                  {isHi ? 'सभी क्षेत्र (6)' : 'All Sectors (6)'}
                </option>
                {SECTORS.map(sec => (
                  <option key={sec} value={sec} className="bg-[var(--surface-solid)] text-[var(--text)]">
                    {getLocalizedEntityName('sectors', sec, language, sec)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Occupation Filter */}
          <div className="relative">
            <label htmlFor="occupation-filter" className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-1 font-mono">
              {isHi ? 'व्यवसाय (NCO)' : 'Occupation (NCO)'}
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="occupation-filter"
                aria-label={isHi ? 'व्यवसाय अनुसार फ़िल्टर करें' : 'Filter by occupation NCO code'}
                value={selectedOccupationNco}
                onChange={(e) => setSelectedOccupationNco(e.target.value)}
                className="w-full text-xs font-semibold pl-7 pr-3 py-2 min-h-[40px] rounded-xl liquid-control text-[var(--text)] cursor-pointer truncate"
              >
                {OCCUPATIONS.map(occ => (
                  <option key={occ.ncoCode} value={occ.ncoCode} className="bg-[var(--surface-solid)] text-[var(--text)]">
                    {resolveDisplayName(occ, language)} ({occ.ncoCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Forecast Horizon Switcher */}
          <div className="relative col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-1 font-mono">
              {isHi ? 'पूर्वानुमान अवधि' : 'Forecast Horizon'}
            </span>
            <div className="flex rounded-xl p-0.5 liquid-control border border-[var(--border)] min-h-[40px] items-center" role="group" aria-label="Forecast Horizon Options">
              {(['3M', '6M', '12M'] as ForecastHorizon[]).map((hz) => (
                <button
                  key={hz}
                  type="button"
                  aria-pressed={forecastHorizon === hz}
                  onClick={() => setForecastHorizon(hz)}
                  className={clsx(
                    'flex-1 py-1.5 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer min-h-[34px] flex items-center justify-center',
                    forecastHorizon === hz
                      ? 'bg-[var(--brand)] text-white shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  )}
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
