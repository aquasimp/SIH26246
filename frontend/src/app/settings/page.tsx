'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Provenance } from '@/components/common/Provenance';
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
        <div className="flex items-center gap-2 mb-2">
          <Provenance type="official" note="System Administration & Environment" />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20">
            Runtime v1.0
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
          Settings & Engine Configuration
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
          Configure deterministic evaluation runtime modes, offline demo constraints, language preferences, and algorithmic weighting thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Demo Mode (Section 50) */}
        <div className="p-6 rounded-3xl glass border border-[var(--border)] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text)]">
                    Offline Hackathon Demo Mode
                  </h3>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono">
                    Deterministic Seeded Sandbox
                  </span>
                </div>
              </div>

              <button
                onClick={() => setDemoMode(!demoMode)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xl font-mono text-xs font-extrabold transition-all cursor-pointer',
                  demoMode ? 'bg-[var(--warning)] text-white shadow-xs' : 'liquid-control text-[var(--text-muted)]'
                )}
              >
                {demoMode ? 'ENABLED [ON]' : 'DISABLED'}
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              When enabled, KaushalPulse uses guaranteed offline deterministic datasets across Gorakhpur, Lucknow, Pune, and Bengaluru, ensuring 100% reproducible scenarios without external network API variance.
            </p>

            <div className="space-y-1.5 text-xs text-[var(--text)] bg-[var(--warning)]/10 p-3.5 rounded-xl border border-[var(--warning)]/20">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--warning)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deterministic reproducible results for SIH jury</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-[var(--warning)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Visible 'Demo Dataset' watermark active</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-[var(--warning)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero external network latency dependency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Language & Localization */}
        <div className="p-6 rounded-3xl glass border border-[var(--border)] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text)]">
                    Bilingual Language Localization
                  </h3>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono">
                    English & हिन्दी Interface
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              Toggle complete system dictionary between English and Hindi for ministerial planner presentations and district ground officer access.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={clsx(
                  'p-3.5 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer',
                  language === 'en'
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                    : 'liquid-control text-[var(--text-muted)] hover:text-[var(--text)]'
                )}
              >
                <div className="text-base font-extrabold">English</div>
                <span className="text-[10px] opacity-80">Default Interface</span>
              </button>

              <button
                onClick={() => setLanguage('hi')}
                className={clsx(
                  'p-3.5 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer',
                  language === 'hi'
                    ? 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs'
                    : 'liquid-control text-[var(--text-muted)] hover:text-[var(--text)]'
                )}
              >
                <div className="text-base font-extrabold">हिन्दी (Hindi)</div>
                <span className="text-[10px] opacity-80">भारतीय भाषा इंटरफ़ेस</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Model Engine Weights */}
        <div className="p-6 rounded-3xl glass border border-[var(--border)] shadow-xs md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-[var(--border)]">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text)]">
                Model Hyperparameters & Staged Pipeline Factors
              </h3>
              <span className="text-[10px] text-[var(--text-faint)] font-mono">
                Pipeline Weights: Staged Supply Conversion Formula
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl glass-strong border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-faint)] font-bold uppercase block font-mono">Seat Utilization</span>
              <strong className="text-base font-bold text-[var(--text)] font-mono">92%</strong>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Enrolled / Total Seats</span>
            </div>

            <div className="p-3.5 rounded-xl glass-strong border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-faint)] font-bold uppercase block font-mono">Certification Rate</span>
              <strong className="text-base font-bold text-[var(--text)] font-mono">88%</strong>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Assessed & Passed</span>
            </div>

            <div className="p-3.5 rounded-xl glass-strong border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-faint)] font-bold uppercase block font-mono">Labor Participation</span>
              <strong className="text-base font-bold text-[var(--text)] font-mono">82%</strong>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Active Job Seekers</span>
            </div>

            <div className="p-3.5 rounded-xl glass-strong border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-faint)] font-bold uppercase block font-mono">Employability Factor</span>
              <strong className="text-base font-bold text-[var(--balanced)] font-mono">78%</strong>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Effective Employable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
