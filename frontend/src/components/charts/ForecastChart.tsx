'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TimePoint, ForecastHorizon } from '@/lib/types';
import { OUT_OF_SAMPLE_BENCHMARKS } from '@/lib/benchmarkMetrics';
import { useChartPalette } from '@/lib/useChartPalette';
import { Sparkles } from 'lucide-react';

interface ForecastChartProps {
  data: TimePoint[];
  occupationTitle: string;
  horizon: ForecastHorizon;
  model: 'lightgbm' | 'naive';
  onModelChange?: (m: 'lightgbm' | 'naive') => void;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  data,
  occupationTitle,
  horizon,
  model,
  onModelChange
}) => {
  const { language, l } = useApp();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const palette = useChartPalette();
  const benchmark = OUT_OF_SAMPLE_BENCHMARKS[horizon];

  // Detect historical cutoff index (default to index 11 for 2024-10)
  const firstForecastIdx = data.findIndex(d => d.forecastDemand !== undefined);
  const cutoffIdx = firstForecastIdx !== -1 ? firstForecastIdx - 1 : 11;

  // Horizon-aware count: 12 historical + horizon months (3, 6, or 12)
  const horizonMonths = horizon === '3M' ? 3 : horizon === '6M' ? 6 : 12;
  const displayCount = Math.min(data.length, (cutoffIdx + 1) + horizonMonths);
  const activeData = data.slice(0, displayCount);

  // Extract all non-zero values for scaling
  const allValues = activeData.flatMap(d => [
    d.historicalDemand || 0,
    d.forecastDemand || 0,
    d.effectiveSupply || 0,
    d.ciUpper || 0,
    d.ciLower || 0,
    d.baselineNaive || 0
  ]).filter(v => v > 0);

  const rawMax = Math.max(...allValues, 100);

  // Clean round ticks starting strictly at 0 (0, 300, 600, 900, 1200, 1500)
  const targetTicks = 5;
  const roughStep = (rawMax * 1.1) / targetTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalized = roughStep / magnitude;
  let niceStep = 1;
  if (normalized > 5) niceStep = 10;
  else if (normalized > 2.5) niceStep = 5;
  else if (normalized > 2) niceStep = 3;
  else if (normalized > 1) niceStep = 2;
  const step = niceStep * magnitude;
  const maxVal = Math.max(step * targetTicks, Math.ceil((rawMax * 1.08) / step) * step);
  const minVal = 0;
  const range = maxVal || 1;

  const yTicks: number[] = [];
  for (let v = 0; v <= maxVal; v += step) {
    yTicks.push(v);
  }

  const width = 800;
  const height = 320;
  const padding = { top: 25, right: 30, bottom: 42, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const getX = (idx: number) => padding.left + (idx / Math.max(1, activeData.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minVal) / range) * chartH;

  // Split series
  const historicalPoints = activeData.slice(0, cutoffIdx + 1);
  const forecastPoints = activeData.slice(cutoffIdx); // includes cutoffIdx as anchor to connect lines seamlessly

  // Historical path (solid line)
  const histDemandPath = historicalPoints.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.historicalDemand!)}`).join(' ');

  // Forecast path (dashed line)
  let forecastDemandPath = '';
  let forecastConfidencePath = '';
  let gapShadedPath = '';

  if (model === 'lightgbm' && forecastPoints.length > 1) {
    forecastDemandPath = forecastPoints.map((d, i) => {
      const globalIdx = cutoffIdx + i;
      const val = d.forecastDemand ?? d.historicalDemand ?? 0;
      return `${i === 0 ? 'M' : 'L'} ${getX(globalIdx)} ${getY(val)}`;
    }).join(' ');

    // Soft translucent confidence band extending to end of chart
    const ciUpperPoints = forecastPoints.map((d, i) => {
      const globalIdx = cutoffIdx + i;
      const val = i === 0 ? (d.historicalDemand || 0) : (d.ciUpper || (d.forecastDemand ? Math.round(d.forecastDemand * 1.12) : 0));
      return `${getX(globalIdx)},${getY(val)}`;
    });

    const ciLowerPoints = [...forecastPoints].reverse().map((d, i) => {
      const origIdx = forecastPoints.length - 1 - i;
      const globalIdx = cutoffIdx + origIdx;
      const val = origIdx === 0 ? (d.historicalDemand || 0) : (d.ciLower || (d.forecastDemand ? Math.round(d.forecastDemand * 0.88) : 0));
      return `${getX(globalIdx)},${getY(val)}`;
    });

    forecastConfidencePath = `M ${ciUpperPoints.join(' L ')} L ${ciLowerPoints.join(' L ')} Z`;

    // Shaded gap area between forecast and supply
    const gapUpper = forecastPoints.map((d, i) => `${getX(cutoffIdx + i)},${getY(d.forecastDemand ?? d.historicalDemand ?? 0)}`);
    const gapLower = [...forecastPoints].reverse().map((d, i) => {
      const origIdx = forecastPoints.length - 1 - i;
      const item = forecastPoints[origIdx];
      return `${getX(cutoffIdx + origIdx)},${getY(item.effectiveSupply || 0)}`;
    });
    gapShadedPath = `M ${gapUpper.join(' L ')} L ${gapLower.join(' L ')} Z`;
  }

  // Naive baseline path
  const naivePath = activeData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.baselineNaive || d.historicalDemand || 0)}`).join(' ');

  // Effective Supply path (solid balanced green)
  const supplyPath = activeData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.effectiveSupply)}`).join(' ');

  const activePoint = hoverIndex !== null ? activeData[hoverIndex] : activeData[activeData.length - 1];
  const activeX = hoverIndex !== null ? getX(hoverIndex) : getX(activeData.length - 1);

  return (
    <div className="w-full space-y-3">
      {/* Top Header & Dynamic Benchmark Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--text)]">
            {occupationTitle}
          </span>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-700 font-bold border border-sky-500/30">
            {horizon} {l('Horizon', 'क्षितिज')}
          </span>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[var(--text-faint)]">
            {l('Model Architecture:', 'मॉडल वास्तुकला:')}
          </span>
          <div className="glass inline-flex items-center rounded-xl p-0.5 border border-slate-200/80 text-xs">
            <button
              type="button"
              onClick={() => onModelChange && onModelChange('lightgbm')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                model === 'lightgbm' 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{horizon === '12M' ? (l('Tri-Model Blend', 'त्रि-मॉडल मिश्रण')) : 'LightGBM'} (WAPE {benchmark.wape}%)</span>
            </button>
            <button
              type="button"
              onClick={() => onModelChange && onModelChange('naive')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                model === 'naive' 
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{l('Seasonal Naive', 'सीज़नल नेईव')} ({benchmark.naiveWape}%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Area with Liquid Glass container */}
      <div className="relative w-full overflow-hidden rounded-2xl glass-strong border border-slate-200/80 p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_4px_24px_-4px_rgba(15,23,42,0.05)]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Forward Forecast Confidence Gradient */}
            <linearGradient id="forecastConfidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.04" />
            </linearGradient>

            {/* Gap Gradient */}
            <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Clean Grid lines starting strictly at 0 with round intervals */}
          {yTicks.map((val, i) => {
            const y = getY(val);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={palette.grid}
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill={palette.textMuted}
                  fontWeight="600"
                  className="font-mono tabular-nums"
                >
                  {val.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Shaded Gap Area */}
          {model === 'lightgbm' && gapShadedPath && (
            <path d={gapShadedPath} fill="url(#gapGradient)" />
          )}

          {/* Soft Translucent Confidence Band */}
          {model === 'lightgbm' && forecastConfidencePath && (
            <path d={forecastConfidencePath} fill="url(#forecastConfidenceGradient)" />
          )}

          {/* Baseline Naive Path */}
          {model === 'naive' && naivePath && (
            <path
              d={naivePath}
              fill="none"
              stroke={palette.textMuted}
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )}

          {/* Effective Supply Line (Solid balanced green) */}
          <path
            d={supplyPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Historical Demand Line (Solid Coral/Severe line up to cutoff) */}
          <path
            d={histDemandPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Forward 6M/12M Projected Trajectory (Dashed brand line) */}
          {model === 'lightgbm' && forecastDemandPath && (
            <path
              d={forecastDemandPath}
              fill="none"
              stroke="#0284c7"
              strokeWidth="3"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
          )}

          {/* Vertical Reference Line: Forecast Start (Oct 2024) */}
          {cutoffIdx < activeData.length - 1 && (
            <g>
              <line
                x1={getX(cutoffIdx)}
                y1={padding.top}
                x2={getX(cutoffIdx)}
                y2={height - padding.bottom}
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              <text
                x={getX(cutoffIdx) - 8}
                y={padding.top + 14}
                textAnchor="end"
                fontSize="10"
                fontWeight="700"
                fill={palette.textMuted}
              >
                {l('Historical Actuals', 'ऐतिहासिक वास्तविक डेटा')}
              </text>
              <text
                x={getX(cutoffIdx) + 8}
                y={padding.top + 14}
                textAnchor="start"
                fontSize="10"
                fontWeight="700"
                fill="#0284c7"
              >
                {l('Forecast Start (Oct 2024)', 'पूर्वानुमान प्रारंभ (अक्टूबर 2024)')}
              </text>
            </g>
          )}

          {/* Hover Crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={activeX}
                y1={padding.top}
                x2={activeX}
                y2={height - padding.bottom}
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={activeX}
                cy={getY(activePoint.forecastDemand || activePoint.historicalDemand || 0)}
                r="5"
                fill={hoverIndex <= cutoffIdx ? '#ef4444' : '#0284c7'}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle
                cx={activeX}
                cy={getY(activePoint.effectiveSupply)}
                r="5"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Interactive hover rect triggers */}
          {activeData.map((d, i) => (
            <rect
              key={d.month}
              x={getX(i) - (chartW / activeData.length) / 2}
              y={padding.top}
              width={chartW / activeData.length}
              height={chartH}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}

          {/* X Axis Month Labels */}
          {activeData.map((d, i) => {
            const step = horizon === '12M' ? 3 : 2;
            const isImportant = i === 0 || i === cutoffIdx || i === activeData.length - 1;
            if (i % step !== 0 && !isImportant) return null;
            return (
              <text
                key={d.month}
                x={getX(i)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                fontSize="9"
                fill={i > cutoffIdx ? '#0284c7' : palette.textMuted}
                fontWeight={i > cutoffIdx || isImportant ? '700' : '500'}
                className="font-mono"
              >
                {d.month.slice(2)}
              </text>
            );
          })}
        </svg>

        {/* Liquid Glass Interactive Tooltip Overlay */}
        {hoverIndex !== null && activePoint && (
          <div
            className="absolute z-30 pointer-events-none p-3.5 rounded-2xl glass-strong border border-slate-200/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_12px_32px_-4px_rgba(15,23,42,0.12)] text-xs space-y-2 backdrop-blur-xl font-mono min-w-[220px]"
            style={{
              left: Math.min(width - 240, Math.max(20, activeX - 110)),
              top: 18
            }}
          >
            <div className="font-bold text-[var(--text)] flex items-center justify-between gap-4 border-b border-slate-200/70 pb-1.5">
              <span className="text-sm font-extrabold">{activePoint.month}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                {hoverIndex <= cutoffIdx ? l('Historical Actual', 'ऐतिहासिक वास्तविक') : `${horizon} ${l('Forecast', 'पूर्वानुमान')}`}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center gap-4 text-rose-600 font-bold">
                <span>{l('Demand:', 'मांग:')}</span>
                <span className="tabular-nums text-xs">
                  {(activePoint.forecastDemand || activePoint.historicalDemand)?.toLocaleString()} {l('seats', 'सीटें')}
                </span>
              </div>

              <div className="flex justify-between items-center gap-4 text-emerald-600 font-bold">
                <span>{l('Effective Supply:', 'प्रभावी आपूर्ति:')}</span>
                <span className="tabular-nums text-xs">
                  {activePoint.effectiveSupply?.toLocaleString()} {l('seats', 'सीटें')}
                </span>
              </div>

              {/* Delta gap indicator */}
              {(() => {
                const dVal = activePoint.forecastDemand || activePoint.historicalDemand || 0;
                const sVal = activePoint.effectiveSupply || 0;
                const delta = dVal - sVal;
                return (
                  <div className="flex justify-between items-center gap-4 pt-1 border-t border-slate-200/60 font-semibold text-[11px]">
                    <span className="text-slate-500">{delta > 0 ? l('Deficit Gap:', 'कमी अंतर:') : l('Supply Surplus:', 'आपूर्ति अधिशेष:')}</span>
                    <span className={`tabular-nums font-bold px-1.5 py-0.5 rounded ${delta > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      {delta > 0 ? `-${delta.toLocaleString()} seats` : `+${Math.abs(delta).toLocaleString()} seats`}
                    </span>
                  </div>
                );
              })()}

              {activePoint.forecastDemand && (
                <div className="flex justify-between gap-4 text-sky-600 text-[10px] pt-1 border-t border-slate-200/60">
                  <span>{l('95% CI Range:', '95% विश्वास अंतराल सीमा:')}</span>
                  <span className="tabular-nums font-bold">
                    {activePoint.ciLower} – {activePoint.ciUpper}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-muted)] pt-1 px-1">
        <div className="flex items-center flex-wrap gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#ef4444] rounded" />
            <span>{l('Historical Actuals', 'ऐतिहासिक वास्तविक')}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#0284c7] rounded border-b border-dashed" />
            <span>{l('Forecast Demand', 'अनुमानित मांग')}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#10b981] rounded" />
            <span>{l('Staged Supply (0.70 Readiness)', 'चरणबद्ध आपूर्ति (0.70 तत्परता)')}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3 rounded bg-sky-500/20 border border-sky-500/40" />
            <span>{l('Confidence Band', 'विश्वास अंतराल बैंड')}</span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-[var(--text-faint)]">
          {l('Walk-Forward Validation: WAPE', 'वॉक-फॉरवर्ड सत्यापन: WAPE')} <strong className="text-[var(--text)]">{benchmark.wape}%</strong> ({l('vs. Naive', 'नेईव तुलना:')} {benchmark.naiveWape}%)
        </div>
      </div>
    </div>
  );
};
