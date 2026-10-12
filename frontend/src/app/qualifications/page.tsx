'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Provenance } from '@/components/common/Provenance';
import { OCCUPATIONS } from '@/lib/demoData';
import { localizeSkill, localizeQualification, resolveDisplayName } from '@/lib/i18n';
import { 
  CheckCircle2, 
  Search 
} from 'lucide-react';

export default function QualificationsPage() {
  const { language, l } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = OCCUPATIONS.filter(o => {
    const titleMatch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.titleHi && o.titleHi.toLowerCase().includes(searchTerm.toLowerCase()));
    const qualMatch = o.qualifications.some(q => q.toLowerCase().includes(searchTerm.toLowerCase()));
    return titleMatch || qualMatch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Provenance type="official" note={l('NQR Curriculum Standards', 'NQR पाठ्यक्रम मानक')} />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
            NSQF {l('Levels 1-8', 'स्तर 1-8')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
          {l('Qualification & NSQF Intelligence', 'योग्यता और NSQF इंटेलिजेंस')}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
          {l('Full traceability chain mapping Occupations → NCO Codes → Qualification Packs (QP) → NSQF Levels → Verified Training Providers.', 'व्यवसाय → NCO कोड → योग्यता पैक (QP) → NSQF स्तर → सत्यापित प्रशिक्षण प्रदाताओं की पूर्ण ट्रेसिबिलिटी श्रृंखला।')}
        </p>
      </div>

      <FilterBar />

      {/* Conceptual Flow Diagram Card (Section 26) */}
      <div className="p-5 rounded-3xl glass border border-[var(--border)] shadow-xs">
        <span className="text-[10px] font-extrabold text-[var(--brand)] uppercase tracking-widest block mb-3 font-mono">
          {l('End-to-End Competency Standardisation Architecture', 'एंड-टू-एंड योग्यता मानकीकरण वास्तुकला')}
        </span>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3 text-center text-xs">
          <div className="p-3 rounded-xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">
              {l('1. Trade', '1. व्यापार')}
            </span>
            <strong className="text-[var(--text)] block mt-1">
              {l('Occupation', 'व्यवसाय')}
            </strong>
            <span className="text-[9px] text-[var(--text-muted)]">
              {l('Market Need', 'बाजार की मांग')}
            </span>
          </div>

          <div className="p-3 rounded-xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">
              {l('2. Classification', '2. वर्गीकरण')}
            </span>
            <strong className="text-[var(--brand)] block mt-1 font-mono">NCO-2015</strong>
            <span className="text-[9px] text-[var(--text-muted)]">
              {l('National Standard', 'राष्ट्रीय मानक')}
            </span>
          </div>

          <div className="p-3 rounded-xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">
              {l('3. Qualification', '3. योग्यता')}
            </span>
            <strong className="text-purple-400 block mt-1 font-mono">{l('QP-Pack', 'क्यूपी-पैक')}</strong>
            <span className="text-[9px] text-[var(--text-muted)]">
              {l('Sector Skill Council', 'क्षेत्र कौशल परिषद')}
            </span>
          </div>

          <div className="p-3 rounded-xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">
              {l('4. Rigor', '4. कठोरता')}
            </span>
            <strong className="text-[var(--brand-secondary)] block mt-1 font-mono">NSQF {l('Level', 'स्तर')}</strong>
            <span className="text-[9px] text-[var(--text-muted)]">
              {l('Levels 1 to 8', 'स्तर 1 से 8')}
            </span>
          </div>

          <div className="p-3 rounded-xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">
              {l('5. Competencies', '5. दक्षताएं')}
            </span>
            <strong className="text-[var(--balanced)] block mt-1">
              {l('Key Skills', 'प्रमुख कौशल')}
            </strong>
            <span className="text-[9px] text-[var(--text-muted)]">
              {l('NOS Modules', 'NOS मॉड्यूल')}
            </span>
          </div>

          <div className="p-3 rounded-xl glass-strong border border-[var(--border)] col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">
              {l('6. Delivery', '6. वितरण')}
            </span>
            <strong className="text-[var(--text)] block mt-1">
              {l('Training Hubs', 'प्रशिक्षण केंद्र')}
            </strong>
            <span className="text-[9px] text-[var(--text-muted)]">ITIs & PMKKs</span>
          </div>
        </div>
      </div>

      {/* Qualification Registry Table (Section 26) */}
      <GlassPanel
        title={l('Active Qualification Packs & Alignment Coverage', 'सक्रिय योग्यता पैक और संरेखण कवरेज')}
        subtitle={l('Tracking curriculum relevance, candidate supply pipeline, and emerging skill adjustments.', 'पाठ्यक्रम प्रासंगिकता, उम्मीदवार आपूर्ति पाइपलाइन और उभरते कौशल समायोजन की ट्रैकिंग।')}
        action={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={l('Search qualification pack...', 'योग्यता पैक खोजें...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-[var(--text)] focus:outline-none"
            />
          </div>
        }
      >
        <div className="space-y-4">
          {filtered.map((occ) => (
            <div
              key={occ.ncoCode}
              className="p-5 rounded-2xl glass border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[var(--text)]">
                    {resolveDisplayName(occ, language)}
                  </span>
                  <span className="text-xs font-mono text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-md border border-[var(--brand)]/20">
                    NCO {occ.ncoCode}
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                    NSQF {l('Level', 'स्तर')} {occ.nsqfLevel}
                  </span>
                </div>

                <div className="text-xs text-[var(--text-muted)] font-medium">
                  <strong className="text-[var(--text)]">
                    {l('Approved Packs:', 'स्वीकृत पैक:')}{' '}
                  </strong>
                  {occ.qualifications.map(q => localizeQualification(q, language)).join(' • ')}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {occ.keySkills.map((s, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md glass text-[var(--text-muted)] font-medium border border-[var(--border)]">
                      {localizeSkill(s, language)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
                <div className="text-right text-xs">
                  <span className="text-[var(--text-faint)] text-[10px] uppercase font-bold block">
                    {l('Status', 'स्थिति')}
                  </span>
                  <span className="font-bold text-[var(--balanced)] flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {l('Curriculum Aligned', 'पाठ्यक्रम संरेखित')}
                  </span>
                </div>

                <Link
                  href={`/occupations/${occ.ncoCode}`}
                  className="px-3.5 py-2 rounded-xl liquid-control text-[var(--text)] text-xs font-bold transition-all"
                >
                  {l('View Traceability →', 'ट्रेसिबिलिटी देखें →')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
