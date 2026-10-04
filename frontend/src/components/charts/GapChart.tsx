'use client';

import React from 'react';
import { clsx } from 'clsx';
import { GapSeverity } from '@/lib/types';

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
  // Score color
  const getScoreTheme = (s: number) => {
    if (s >= 75) return { text: 'text-red-600', stroke: '#dc2626', bg: 'bg-red-50', border: 'border-red-200' };
    if (s >= 60) return { text: 'text-orange-600', stroke: '#ea580c', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (s >= 40) return { text: 'text-emerald-600', stroke: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    return { text: 'text-indigo-600', stroke: '#4f46e5', bg: 'bg-indigo-50', border: 'border-indigo-200' };
  };

  const theme = getScoreTheme(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
      {/* Left Radial Ring */}
      <div className="flex flex-col items-center justify-center shrink-0">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 select-none">
            {/* Background ring */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#e2e8f0"
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Gap Score
            </span>
            <span className={clsx('text-3xl font-extrabold tracking-tight', theme.text)}>
              {score}
            </span>
            <span className="text-[9px] font-semibold text-slate-500">
              / 100
            </span>
          </div>
        </div>

        <div className={clsx('mt-2 px-3 py-1 rounded-full text-xs font-bold border', theme.bg, theme.text, theme.border)}>
          {severity}
        </div>
      </div>

      {/* Right Metric Sub-breakdowns */}
      <div className="flex-1 w-full space-y-2.5">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
          <span className="font-bold text-slate-700">Sub-Index Decomposition</span>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
            Model Confidence: {confidence}%
          </span>
        </div>

        {/* Demand Pressure */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-600">Demand Pressure Index</span>
            <span className="font-mono text-slate-900">{demandPressure} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${demandPressure}%` }} />
          </div>
        </div>

        {/* Effective Supply Capacity */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-600">Effective Supply Capacity</span>
            <span className="font-mono text-slate-900">{effectiveSupplyIndex} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${effectiveSupplyIndex}%` }} />
          </div>
        </div>

        {/* Forecast Pressure */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-600">6-Month Forecast Pressure</span>
            <span className="font-mono text-slate-900">{forecastPressure} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${forecastPressure}%` }} />
          </div>
        </div>

        {/* Shortage Persistence */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-600">Shortage Structural Persistence</span>
            <span className="font-mono text-slate-900">{persistence} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${persistence}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
