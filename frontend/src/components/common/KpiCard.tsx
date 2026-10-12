'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Provenance, ProvenanceSource } from './Provenance';

export interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: string | number;
    isPositive?: boolean;
    isNeutral?: boolean;
    label: string;
  };
  scope?: string;
  provenance?: ProvenanceSource;
  trend?: number[]; // e.g. [45, 52, 60, 58, 68, 75]
  severity?: 'severe' | 'moderate' | 'balanced' | 'oversupply' | 'neutral';
  className?: string;
}

export function KpiCard({
  label,
  value,
  delta,
  scope,
  provenance,
  trend = [40, 50, 48, 65, 70, 85],
  severity = 'neutral',
  className = ''
}: KpiCardProps) {
  // Sparkline coordinates
  const minVal = Math.min(...trend, 0);
  const maxVal = Math.max(...trend, 100);
  const range = Math.max(1, maxVal - minVal);
  const width = 64;
  const height = 24;

  const points = trend.map((v, i) => {
    const x = (i / (trend.length - 1)) * width;
    const y = height - ((v - minVal) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const isSevere = severity === 'severe';
  const borderEdge = isSevere 
    ? 'border-l-4 border-l-[var(--severe)] border-[var(--border)]' 
    : severity === 'moderate'
    ? 'border-l-4 border-l-[var(--moderate)] border-[var(--border)]'
    : 'border-[var(--border)]';

  return (
    <div
      className={`glass-strong p-4 sm:p-5 rounded-2xl flex flex-col justify-between transition-all hover:translate-y-[-2px] hover:border-[var(--border-strong)] ${borderEdge} ${className}`}
    >
      {/* Top row: Full Label + Optional per-card Provenance */}
      <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] leading-snug block">
          {label}
        </span>
        {provenance && <Provenance source={provenance} compact />}
      </div>

      {/* Main value + Sparkline */}
      <div className="my-1.5 flex items-baseline justify-between gap-3 min-w-0">
        <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight tabular-nums font-mono whitespace-nowrap shrink-0">
          {value}
        </div>
        {trend && trend.length >= 2 && (
          <div className="shrink-0 opacity-80 hover:opacity-100 transition-opacity ml-auto" title="6-period velocity trend">
            <svg width={width} height={height} className="overflow-visible">
              <polyline
                fill="none"
                stroke={isSevere ? 'var(--severe)' : 'var(--brand)'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        )}
      </div>

      {/* Delta chip + Scope subtitle */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border)] mt-1 min-w-0">
        {delta ? (
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-bold tabular-nums shrink-0 whitespace-nowrap ${
              delta.isNeutral
                ? 'text-[var(--text-muted)]'
                : delta.isPositive
                ? 'text-[var(--success)]'
                : 'text-[var(--severe)]'
            }`}
          >
            {delta.isNeutral ? (
              <Minus className="w-3 h-3 shrink-0" />
            ) : delta.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{delta.value}</span>
            <span className="text-[10px] text-[var(--text-faint)] font-normal ml-0.5 whitespace-nowrap">
              {delta.label}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-[var(--text-faint)] whitespace-nowrap">Baseline active</span>
        )}

        {scope && (
          <span className="text-[10px] font-mono text-[var(--text-faint)] truncate max-w-[120px] text-right" title={scope}>
            {scope}
          </span>
        )}
      </div>
    </div>
  );
}
