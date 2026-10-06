'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Provenance } from '@/components/common/Provenance';
import { DISTRICTS, STATES } from '@/lib/demoData';
import { getLocalizedEntityName } from '@/lib/i18n';
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
  const { selectedState, setSelectedState, language } = useApp();
  const isHi = language === 'hi';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDistricts = DISTRICTS.filter(d => {
    const matchesState = selectedState === 'All States' || d.state === selectedState;
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.nameHi && d.nameHi.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          d.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(d.lgdCode).includes(searchTerm);
    return matchesState && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Provenance type="official" note={isHi ? 'LGD भौगोलिक पदानुक्रम' : 'LGD Geographic Hierarchy'} />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20">
            {isHi ? '16 पायलट जिले' : '16 Pilot Districts'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
          {isHi ? 'जिला श्रम बाजार इंटेलिजेंस' : 'District Labour Market Intelligence'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
          {isHi 
            ? 'स्थानीय सरकारी निर्देशिका (LGD) जिला-स्तरीय प्रोफ़ाइल जो प्रशिक्षण बुनियादी ढांचे, नियोक्ता मांग संकेतों और संरचनात्मक कौशल असंतुलन का मूल्यांकन करती है।'
            : 'Local Government Directory (LGD) district-level profiles evaluating training infrastructure, employer demand signals, and structural skill mismatches.'}
        </p>
      </div>

      <FilterBar />

      {/* District Cards Grid */}
      <GlassPanel
        title={isHi ? 'जिला खुफिया निर्देशिका' : 'District Intelligence Directory'}
        subtitle={isHi ? 'स्थानीयकृत प्रशिक्षण क्षमता, कमी की संभावना और अनुशंसित सीट समायोजन देखने के लिए एक जिला चुनें।' : 'Select a district to view localized training capacity, shortage probabilities, and recommended seat adjustments.'}
        action={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHi ? 'जिला या LGD कोड खोजें...' : 'Search district or LGD code...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-[var(--text)] focus:outline-none"
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDistricts.map((d) => (
            <Link
              key={d.id}
              href={`/districts/${d.id}`}
              className="p-5 rounded-2xl glass border border-[var(--border)] hover:border-[var(--brand)] shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--border)]">
                  <span className="text-[10px] font-mono text-[var(--text-faint)] font-semibold">
                    LGD: {d.lgdCode}
                  </span>
                  <span className={clsx(
                    'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border',
                    d.gapScore >= 75 ? 'bg-[var(--severe)]/10 text-[var(--severe)] border-[var(--severe)]/20' :
                    d.gapScore >= 60 ? 'bg-[var(--moderate)]/10 text-[var(--moderate)] border-[var(--moderate)]/20' :
                    'bg-[var(--balanced)]/10 text-[var(--balanced)] border-[var(--balanced)]/20'
                  )}>
                    {isHi ? 'अंतर' : 'Gap'} {d.gapScore}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                  {isHi && d.nameHi ? d.nameHi : d.name}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium block mb-3">
                  {getLocalizedEntityName('states', d.state, language, d.state)}
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2 rounded-lg glass-strong border border-[var(--border)]">
                    <span className="text-[10px] text-[var(--text-faint)] block font-semibold">
                      {isHi ? 'मांग सूचकांक' : 'Demand Index'}
                    </span>
                    <strong className="text-[var(--text)] font-mono">{d.demandIndex} / 100</strong>
                  </div>
                  <div className="p-2 rounded-lg glass-strong border border-[var(--border)]">
                    <span className="text-[10px] text-[var(--text-faint)] block font-semibold">
                      {isHi ? 'कमी जोखिम' : 'Shortage Prob'}
                    </span>
                    <strong className="text-[var(--severe)] font-mono">{d.shortageProbability6M}%</strong>
                  </div>
                </div>

                <div className="text-[11px] text-[var(--text-muted)] space-y-1 mb-2">
                  <div>
                    <span className="font-semibold text-[var(--text)]">
                      {isHi ? 'बुनियादी ढांचा: ' : 'Infrastructure: '}
                    </span>
                    {d.trainingCentresCount} {isHi ? 'केंद्र' : 'Centres'} ({d.totalTrainingSeats} {isHi ? 'सीटें' : 'Seats'})
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-[var(--severe)]">
                      {isHi ? 'शीर्ष घाटा: ' : 'Top Deficit: '}
                    </span>
                    {d.topShortageTrades[0]}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs font-bold text-[var(--brand)] group-hover:translate-x-0.5 transition-transform">
                <span>{isHi ? 'पूर्ण प्रोफ़ाइल देखें' : 'View Full Profile'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
