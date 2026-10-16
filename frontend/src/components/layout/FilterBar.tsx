'use client';

import React from 'react';
import { 
  MapPin, 
  Briefcase, 
  Layers, 
  RotateCcw,
  SlidersHorizontal
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
    language, 
    l 
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

  const handleReset = () => {
    setSelectedState('Uttar Pradesh');
    setSelectedDistrict('gorakhpur');
    setSelectedSector('All Sectors');
    setSelectedOccupationNco('7126.0101');
    setForecastHorizon('6M');
  };

  return (
    <div className="sticky top-14 z-20 bg-white dark:bg-slate-900 rounded-lg p-2.5 mb-6 border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Left: Section Header & Reset */}
        <div className="flex items-center justify-between xl:justify-start gap-3 border-b xl:border-b-0 pb-2 xl:pb-0 border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>{l('Context Filters', 'संदर्भ फ़िल्टर')}</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-2 py-1 rounded text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
            title={l('Reset filters to default', 'फ़िल्टर रीसेट करें')}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{l('Reset', 'रीसेट')}</span>
          </button>
        </div>

        {/* Right: High-Density Inline Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 flex-1 max-w-full">
          {/* State Filter */}
          <div className="flex flex-col gap-0.5 p-1.5 px-2 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 min-w-0">
            <label htmlFor="state-filter" className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
              {l('State', 'राज्य')}
            </label>
            <div className="relative flex items-center">
              <select
                id="state-filter"
                aria-label={l('Filter by state', 'राज्य अनुसार फ़िल्टर करें')}
                title={getLocalizedEntityName('states', selectedState, language, selectedState)}
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 dark:text-slate-100 bg-transparent border-0 outline-none p-0 cursor-pointer truncate"
              >
                {STATES.map(s => (
                  <option key={s} value={s} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {getLocalizedEntityName('states', s, language, s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* District Filter */}
          <div className="flex flex-col gap-0.5 p-1.5 px-2 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 min-w-0">
            <label htmlFor="district-filter" className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
              {l('District (LGD)', 'ज़िला (LGD)')}
            </label>
            <div className="relative flex items-center">
              <select
                id="district-filter"
                aria-label={l('Filter by district', 'ज़िला अनुसार फ़िल्टर करें')}
                title={(() => {
                  const curr = DISTRICTS.find(d => d.id === selectedDistrict);
                  return curr ? `${getLocalizedEntityName('districts', curr.name, language, curr.name)} (LGD ${curr.lgdCode})` : selectedDistrict;
                })()}
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 dark:text-slate-100 bg-transparent border-0 outline-none p-0 cursor-pointer truncate"
              >
                {availableDistricts.map(d => (
                  <option key={d.id} value={d.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {getLocalizedEntityName('districts', d.name, language, d.name)} (LGD {d.lgdCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sector Filter */}
          <div className="flex flex-col gap-0.5 p-1.5 px-2 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 min-w-0">
            <label htmlFor="sector-filter" className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
              {l('Sector', 'क्षेत्र')}
            </label>
            <div className="relative flex items-center">
              <select
                id="sector-filter"
                aria-label={l('Filter by industrial sector', 'औद्योगिक क्षेत्र अनुसार फ़िल्टर करें')}
                title={selectedSector === 'All Sectors' ? l('All Sectors (6)', 'सभी क्षेत्र (6)') : getLocalizedEntityName('sectors', selectedSector, language, selectedSector)}
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 dark:text-slate-100 bg-transparent border-0 outline-none p-0 cursor-pointer truncate"
              >
                <option value="All Sectors" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {l('All Sectors (6)', 'सभी क्षेत्र (6)')}
                </option>
                {SECTORS.map(sec => (
                  <option key={sec} value={sec} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {getLocalizedEntityName('sectors', sec, language, sec)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Occupation Filter */}
          <div className="flex flex-col gap-0.5 p-1.5 px-2 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 min-w-0">
            <label htmlFor="occupation-filter" className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
              {l('Occupation (NCO)', 'व्यवसाय (NCO)')}
            </label>
            <div className="relative flex items-center">
              <select
                id="occupation-filter"
                aria-label={l('Filter by occupation NCO code', 'व्यवसाय अनुसार फ़िल्टर करें')}
                title={(() => {
                  const curr = OCCUPATIONS.find(o => o.ncoCode === selectedOccupationNco);
                  return curr ? `${resolveDisplayName(curr, language)} (${curr.ncoCode})` : selectedOccupationNco;
                })()}
                value={selectedOccupationNco}
                onChange={(e) => setSelectedOccupationNco(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 dark:text-slate-100 bg-transparent border-0 outline-none p-0 cursor-pointer truncate"
              >
                {OCCUPATIONS.map(occ => (
                  <option key={occ.ncoCode} value={occ.ncoCode} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {resolveDisplayName(occ, language)} ({occ.ncoCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Forecast Horizon Switcher */}
          <div className="flex flex-col gap-0.5 p-1.5 px-2 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
              {l('Horizon', 'अवधि')}
            </span>
            <div className="flex rounded p-0.5 bg-slate-200/70 dark:bg-slate-700/70 items-center" role="group" aria-label="Forecast Horizon Options">
              {(['3M', '6M', '12M'] as ForecastHorizon[]).map((hz) => (
                <button
                  key={hz}
                  type="button"
                  aria-pressed={forecastHorizon === hz}
                  onClick={() => setForecastHorizon(hz)}
                  className={clsx(
                    'flex-1 py-0.5 text-[11px] font-semibold rounded transition-all cursor-pointer text-center',
                    forecastHorizon === hz
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
