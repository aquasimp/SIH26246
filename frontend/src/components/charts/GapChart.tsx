'use client';

import React from 'react';
import { clsx } from 'clsx';
import { GapSeverity } from '@/lib/types';
import { useChartPalette } from '@/lib/useChartPalette';
import { useApp } from '@/lib/store';

import { getLocalizedEntityName } from '@/lib/i18n';

interface GapChartProps {
  score: number;             // e.g. 84
  severity: GapSeverity;     // 'Severe Shortage'
  demandPressure: number;    // e.g. 91
  effectiveSupplyIndex: number; // e.g. 54
  forecastPressure: number;  // e.g. 87
  persistence: number;       // e.g. 82
  confidence: number;        // e.g. 78%
}

export const GapChart: React.FC<GapChartProps> = ({
  score,
  severity,
  demandPressure,
  effectiveSupplyIndex,
  forecastPressure,
  persistence,
  confidence
}) => {
  const palette = useChartPalette();
  const { language, l } = useApp();

  const getLocalizedSeverity = (sev: string) => {
    return getLocalizedEntityName('severityBands', sev, language, sev);
  };

  // Score color
  const getScoreTheme = (s: number) => {
    if (s >= 75) return { stroke: palette.severe, bg: 'bg-[var(--severe)]/10', text: 'text-[var(--severe)]', border: 'border-[var(--severe)]/20' };
    if (s >= 60) return { stroke: palette.moderate, bg: 'bg-[var(--moderate)]/10', text: 'text-[var(--moderate)]', border: 'border-[var(--moderate)]/20' };
    if (s >= 40) return { stroke: palette.balanced, bg: 'bg-[var(--balanced)]/10', text: 'text-[var(--balanced)]', border: 'border-[var(--balanced)]/20' };
    return { stroke: palette.oversupply, bg: 'bg-[var(--oversupply)]/10', text: 'text-[var(--oversupply)]', border: 'border-[var(--oversupply)]/20' };
  };

  const theme = getScoreTheme(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 rounded-2xl glass border border-[var(--border)] shadow-xs">
      {/* Left Radial Ring */}
      <div className="flex flex-col items-center justify-center shrink-0">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 select-none">
            {/* Background ring */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={palette.grid}
              strokeWidth="10"
              fill="transparent"
            />
            {/* Foreground progress */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={theme.stroke}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
              {l('Gap Score', 'अंतर स्कोर')}
            </span>
            <span className={clsx('text-3xl font-extrabold tracking-tight font-mono', theme.text)}>
              {score}
            </span>
            <span className="text-[11px] font-semibold text-[var(--text-faint)]">
              / 100
            </span>
          </div>
        </div>

        <div className={clsx('mt-2 px-3 py-1 rounded-full text-xs font-bold border font-mono', theme.bg, theme.text, theme.border)}>
          {getLocalizedSeverity(severity)}
        </div>
      </div>

      {/* Right Metric Sub-breakdowns */}
      <div className="flex-1 w-full space-y-3">
        <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[var(--border)]">
          <span className="font-bold text-[var(--text)]">
            {l('Sub-Index Decomposition', 'उप-सूचकांक अपघटन')}
          </span>
          <span className="text-[11px] font-semibold text-[var(--brand)] bg-[var(--brand)]/10 px-2.5 py-0.5 rounded-md border border-[var(--brand)]/20 font-mono">
            {l(`Model Confidence: ${confidence}%`, `मॉडल विश्वसनीयता: ${confidence}%`)}
          </span>
        </div>

        {/* Demand Pressure */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-[var(--text-muted)]">
              {l('Demand Pressure Index', 'मांग दबाव सूचकांक')}
            </span>
            <span className="font-mono text-[var(--text)]">{demandPressure} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
            <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${demandPressure}%` }} />
          </div>
        </div>

        {/* Effective Supply Capacity */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-[var(--text-muted)]">
              {l('Effective Supply Capacity', 'प्रभावी आपूर्ति क्षमता')}
            </span>
            <span className="font-mono text-[var(--text)]">{effectiveSupplyIndex} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
            <div className="h-full bg-[var(--balanced)] rounded-full" style={{ width: `${effectiveSupplyIndex}%` }} />
          </div>
        </div>

        {/* Forecast Pressure */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-[var(--text-muted)]">
              {l('6-Month Forecast Pressure', '6-माह पूर्वानुमान दबाव')}
            </span>
            <span className="font-mono text-[var(--text)]">{forecastPressure} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
            <div className="h-full bg-[var(--brand)] rounded-full" style={{ width: `${forecastPressure}%` }} />
          </div>
        </div>

        {/* Shortage Persistence */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-[var(--text-muted)]">
              {l('Shortage Structural Persistence', 'कमी संरचनात्मक निरंतरता')}
            </span>
            <span className="font-mono text-[var(--text)]">{persistence} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
            <div className="h-full bg-[var(--severe)] rounded-full" style={{ width: `${persistence}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
