'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Provenance } from '@/components/common/Provenance';
import { OCCUPATIONS } from '@/lib/demoData';
import { clsx } from 'clsx';
import { 
  Award, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Building2, 
  Search, 
  BookOpen
} from 'lucide-react';

export default function QualificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = OCCUPATIONS.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.qualifications.some(q => q.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Provenance type="official" note="NQR Curriculum Standards" />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
            NSQF Levels 1-8
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
          Qualification & NSQF Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
          Full traceability chain mapping Occupations → NCO Codes → Qualification Packs (QP) → NSQF Levels → Verified Training Providers.
        </p>
      </div>

      <FilterBar />

      {/* Conceptual Flow Diagram Card (Section 26) */}
      <div className="p-5 rounded-3xl glass border border-[var(--border)] shadow-xs">
        <span className="text-[10px] font-extrabold text-[var(--brand)] uppercase tracking-widest block mb-3 font-mono">
          End-to-End Competency Standardisation Architecture
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">1. Trade</span>
            <strong className="text-[var(--text)] block mt-1">Occupation</strong>
            <span className="text-[9px] text-[var(--text-muted)]">Market Need</span>
          </div>

          <div className="p-3 rounded-xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">2. Classification</span>
            <strong className="text-[var(--brand)] block mt-1 font-mono">NCO-2015</strong>
            <span className="text-[9px] text-[var(--text-muted)]">National Standard</span>
          </div>

          <div className="p-3 rounded-xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">3. Qualification</span>
            <strong className="text-purple-400 block mt-1 font-mono">QP-Pack</strong>
            <span className="text-[9px] text-[var(--text-muted)]">Sector Skill Council</span>
          </div>

          <div className="p-3 rounded-xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">4. Rigor</span>
            <strong className="text-[var(--brand-secondary)] block mt-1 font-mono">NSQF Level</strong>
            <span className="text-[9px] text-[var(--text-muted)]">Levels 1 to 8</span>
          </div>

          <div className="p-3 rounded-xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">5. Competencies</span>
            <strong className="text-[var(--balanced)] block mt-1">Key Skills</strong>
            <span className="text-[9px] text-[var(--text-muted)]">NOS Modules</span>
          </div>

          <div className="p-3 rounded-xl glass-strong border border-[var(--border)] col-span-2 sm:col-span-1">
            <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold block">6. Delivery</span>
            <strong className="text-[var(--text)] block mt-1">Training Hubs</strong>
            <span className="text-[9px] text-[var(--text-muted)]">ITIs & PMKKs</span>
          </div>
        </div>
      </div>

      {/* Qualification Registry Table (Section 26) */}
      <GlassPanel
        title="Active Qualification Packs & Alignment Coverage"
        subtitle="Tracking curriculum relevance, candidate supply pipeline, and emerging skill adjustments."
        action={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search qualification pack..."
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
                    {occ.title}
                  </span>
                  <span className="text-xs font-mono text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-md border border-[var(--brand)]/20">
                    NCO {occ.ncoCode}
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                    NSQF Level {occ.nsqfLevel}
                  </span>
                </div>

                <div className="text-xs text-[var(--text-muted)] font-medium">
                  <strong className="text-[var(--text)]">Approved Packs: </strong>
                  {occ.qualifications.join(' • ')}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {occ.keySkills.map((s, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md glass text-[var(--text-muted)] font-medium border border-[var(--border)]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
                <div className="text-right text-xs">
                  <span className="text-[var(--text-faint)] text-[10px] uppercase font-bold block">Status</span>
                  <span className="font-bold text-[var(--balanced)] flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Curriculum Aligned
                  </span>
                </div>

                <Link
                  href={`/occupations/${occ.ncoCode}`}
                  className="px-3.5 py-2 rounded-xl liquid-control text-[var(--text)] text-xs font-bold transition-all"
                >
                  View Traceability →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
