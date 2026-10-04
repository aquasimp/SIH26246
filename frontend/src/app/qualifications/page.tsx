'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FilterBar } from '@/components/layout/FilterBar';
import { GlassPanel } from '@/components/glass/GlassPanel';
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
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
            NQR Standards & Curriculum Alignment
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Qualification & NSQF Intelligence
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Full traceability chain mapping Occupations → NCO Codes → Qualification Packs (QP) → NSQF Levels → Verified Training Providers.
        </p>
      </div>

      <FilterBar />

      {/* Conceptual Flow Diagram Card (Section 26) */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 border border-blue-200/60 shadow-xs">
        <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-widest block mb-3">
          End-to-End Competency Standardisation Architecture
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Trade</span>
            <strong className="text-slate-900 block mt-1">Occupation</strong>
            <span className="text-[9px] text-slate-500">Market Need</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Classification</span>
            <strong className="text-blue-600 block mt-1 font-mono">NCO-2015</strong>
            <span className="text-[9px] text-slate-500">National Standard</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">3. Qualification</span>
            <strong className="text-purple-600 block mt-1">QP-Pack</strong>
            <span className="text-[9px] text-slate-500">Sector Skill Council</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">4. Rigor</span>
            <strong className="text-indigo-600 block mt-1">NSQF Level</strong>
            <span className="text-[9px] text-slate-500">Levels 1 to 8</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">5. Competencies</span>
            <strong className="text-emerald-600 block mt-1">Key Skills</strong>
            <span className="text-[9px] text-slate-500">NOS Modules</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">6. Delivery</span>
            <strong className="text-slate-800 block mt-1">Training Hubs</strong>
            <span className="text-[9px] text-slate-500">ITIs & PMKKs</span>
          </div>
        </div>
      </div>

      {/* Qualification Registry Table (Section 26) */}
      <GlassPanel
        title="Active Qualification Packs & Alignment Coverage"
        subtitle="Tracking curriculum relevance, candidate supply pipeline, and emerging skill adjustments."
        action={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search qualification pack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-slate-800 focus:outline-none"
            />
          </div>
        }
      >
        <div className="space-y-4">
          {filtered.map((occ) => (
            <div
              key={occ.ncoCode}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    {occ.title}
                  </span>
                  <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    NCO {occ.ncoCode}
                  </span>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    NSQF Level {occ.nsqfLevel}
                  </span>
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  <strong>Approved Packs: </strong>
                  {occ.qualifications.join(' • ')}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {occ.keySkills.map((s, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right text-xs">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Status</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Curriculum Aligned
                  </span>
                </div>

                <Link
                  href={`/occupations/${occ.ncoCode}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
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
