'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Provenance } from '@/components/common/Provenance';
import { OCCUPATIONS } from '@/lib/demoData';
import { getLocalizedEntityName, localizeSkill } from '@/lib/i18n';
import { clsx } from 'clsx';
import { 
  Search, 
  ChevronRight
} from 'lucide-react';

export default function OccupationsOverviewPage() {
  const { selectedSector, language, l} = useApp();
  const isHi = language === 'hi';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOccupations = OCCUPATIONS.filter(o => {
    const matchesSector = selectedSector === 'All Sectors' || o.sector === selectedSector;
    const matchesSearch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (o.titleHi && o.titleHi.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          o.ncoCode.includes(searchTerm) ||
                          o.sector.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const getLocalizedSeverity = (severity: string) => {
    if (!isHi) return severity;
    const lower = severity.toLowerCase();
    if (lower.includes('severe') && lower.includes('shortage')) return 'गंभीर कमी';
    if (lower.includes('moderate') && lower.includes('shortage')) return 'मध्यम कमी';
    if (lower.includes('severe') && lower.includes('oversupply')) return 'गंभीर अधिशेष';
    if (lower.includes('balanced')) return 'संतुलित';
    return severity;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Provenance type="official" note={l('NCO-2015 Classification', 'NCO-2015 वर्गीकरण')} />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20">
            {l('Standardized Roles', 'मानकीकृत भूमिकाएं')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
          {l('Occupational Standard & Trade Directory', 'व्यावसायिक मानक और व्यापार निर्देशिका')}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
          {l('Standardized National Classification of Occupations (NCO) mapped directly to National Skills Qualification Framework (NSQF) levels and staged pipeline cohorts.', 'राष्ट्रीय कौशल योग्यता ढांचा (NSQF) स्तरों और चरणबद्ध पाइपलाइन समूहों से सीधे जुड़े मानकीकृत राष्ट्रीय व्यवसाय वर्गीकरण (NCO)।')}
        </p>
      </div>

      <FilterBar />

      {/* Directory Grid */}
      <GlassPanel
        title={l('Standardized Occupations & Trades', 'मानकीकृत व्यवसाय और ट्रेड')}
        subtitle={l('Explore detailed demand, staged supply pipelines, and predictive factor attributions.', 'विस्तृत मांग, चरणबद्ध आपूर्ति पाइपलाइनों और भविष्य कहनेवाला कारक विशेषताओं का अन्वेषण करें।')}
        action={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={l('Search by title or NCO code...', 'शीर्षक या NCO कोड द्वारा खोजें...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-[var(--text)] focus:outline-none"
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOccupations.map((occ) => (
            <Link
              key={occ.ncoCode}
              href={`/occupations/${occ.ncoCode}`}
              className="p-5 rounded-2xl glass border border-[var(--border)] hover:border-[var(--brand)] shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--border)]">
                  <span className="text-[10px] font-mono text-[var(--text-faint)] font-semibold">
                    NCO {occ.ncoCode}
                  </span>
                  <span className={clsx(
                    'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border',
                    occ.severity === 'Severe Shortage' ? 'bg-[var(--severe)]/10 text-[var(--severe)] border-[var(--severe)]/20' :
                    occ.severity === 'Moderate Shortage' ? 'bg-[var(--moderate)]/10 text-[var(--moderate)] border-[var(--moderate)]/20' :
                    occ.severity === 'Severe Oversupply' ? 'bg-[var(--oversupply)]/10 text-[var(--oversupply)] border-[var(--oversupply)]/20' :
                    'bg-[var(--balanced)]/10 text-[var(--balanced)] border-[var(--balanced)]/20'
                  )}>
                    {getLocalizedSeverity(occ.severity)}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                  {isHi && occ.titleHi ? occ.titleHi : occ.title}
                </h3>
                <span className="text-xs text-[var(--text-muted)] font-medium block mb-3">
                  {getLocalizedEntityName('sectors', occ.sector, language, occ.sector)} (NSQF {l('Level', 'स्तर')} {occ.nsqfLevel})
                </span>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3 text-center">
                  <div className="p-2 rounded-lg glass-strong border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--text-faint)] block font-semibold uppercase">
                      {l('Demand', 'मांग')}
                    </span>
                    <strong className="text-[var(--text)] font-mono">{occ.currentDemand.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded-lg glass-strong border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--text-faint)] block font-semibold uppercase">
                      {l('Supply', 'आपूर्ति')}
                    </span>
                    <strong className="text-[var(--text)] font-mono">{occ.effectiveSupply.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded-lg glass-strong border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--text-faint)] block font-semibold uppercase">
                      {l('Gap Score', 'अंतर स्कोर')}
                    </span>
                    <strong className="text-[var(--severe)] font-mono">{occ.gapScore}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-[var(--text-muted)] mb-2">
                  <span className="font-semibold text-[var(--text)]">
                    {l('Top Skills:', 'शीर्ष कौशल:')}{' '}
                  </span>
                  {occ.keySkills.slice(0, 2).map(s => isHi ? localizeSkill(s, 'hi') : s).join(', ')}...
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs font-bold text-[var(--brand)] group-hover:translate-x-0.5 transition-transform">
                <span>{l('View Staged Pipeline & Forecast', 'चरणबद्ध पाइपलाइन और पूर्वानुमान देखें')}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
