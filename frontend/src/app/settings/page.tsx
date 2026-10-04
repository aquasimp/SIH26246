'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { clsx } from 'clsx';
import { 
  Settings, 
  Shield, 
  Globe, 
  Sparkles, 
  Database, 
  CheckCircle2, 
  Sliders, 
  Cpu
} from 'lucide-react';

export default function SettingsPage() {
  const { demoMode, setDemoMode, language, setLanguage, t } = useApp();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-800">
            System Administration & Environment
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings & Engine Configuration
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Configure deterministic evaluation runtime modes, offline demo constraints, language preferences, and algorithmic weighting thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Demo Mode (Section 50) */}
        <div className="p-6 rounded-3xl bg-white/90 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Offline Hackathon Demo Mode
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Deterministic Seeded Sandbox
                  </span>
                </div>
              </div>

              <button
                onClick={() => setDemoMode(!demoMode)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xl font-mono text-xs font-extrabold transition-all cursor-pointer',
                  demoMode ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                )}
              >
                {demoMode ? 'ENABLED [ON]' : 'DISABLED'}
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              When enabled, KaushalPulse uses guaranteed offline deterministic datasets across Gorakhpur, Lucknow, Pune, and Bengaluru, ensuring 100% reproducible scenarios without external network API variance.
            </p>

            <div className="space-y-1.5 text-xs text-slate-700 bg-amber-50/70 p-3 rounded-xl border border-amber-200/70">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Deterministic reproducible results for SIH jury</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Visible 'Demo Dataset' watermark active</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Zero external network latency dependency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Language & Localization */}
        <div className="p-6 rounded-3xl bg-white/90 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Bilingual Language Localization
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    English & हिन्दी Interface
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Toggle complete system dictionary between English and Hindi for ministerial planner presentations and district ground officer access.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={clsx(
                  'p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer',
                  language === 'en'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                )}
              >
                <div className="text-base font-extrabold">English</div>
                <span className="text-[10px] opacity-80">Default Interface</span>
              </button>

              <button
                onClick={() => setLanguage('hi')}
                className={clsx(
                  'p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer',
                  language === 'hi'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                )}
              >
                <div className="text-base font-extrabold">हिन्दी (Hindi)</div>
                <span className="text-[10px] opacity-80">भारतीय भाषा इंटरफ़ेस</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Model Engine Weights */}
        <div className="p-6 rounded-3xl bg-white/90 border border-slate-200/90 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Model Hyperparameters & Staged Pipeline Factors
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Pipeline Weights: Staged Supply Conversion Formula
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Seat Utilization</span>
              <strong className="text-base font-bold text-slate-900 font-mono">92%</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Enrolled / Total Seats</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Certification Rate</span>
              <strong className="text-base font-bold text-slate-900 font-mono">88%</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Assessed & Passed</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Labor Participation</span>
              <strong className="text-base font-bold text-slate-900 font-mono">82%</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Active Job Seekers</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Employability Factor</span>
              <strong className="text-base font-bold text-emerald-600 font-mono">78%</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Effective Employable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
