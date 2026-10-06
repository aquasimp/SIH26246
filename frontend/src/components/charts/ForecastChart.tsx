'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TimePoint, ForecastHorizon } from '@/lib/types';
import { OUT_OF_SAMPLE_BENCHMARKS } from '@/lib/benchmarkMetrics';
import { useChartPalette } from '@/lib/useChartPalette';
import { Sparkles, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

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
  const { language } = useApp();
  const isHi = language === 'hi';
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const palette = useChartPalette();
  const benchmark = OUT_OF_SAMPLE_BENCHMARKS[horizon];

  // Slice data based on horizon: 24 historical + horizon months
  const displayCount = horizon === '3M' ? 27 : horizon === '6M' ? 30 : 36;
  const activeData = data.slice(0, displayCount);

  // Find bounds for SVG scaling
  const allValues = activeData.flatMap(d => [
    d.historicalDemand || 0,
    d.forecastDemand || 0,
    d.effectiveSupply || 0,
    d.ciUpper || 0,
    d.ciLower || 0,
    d.baselineNaive || 0
  ]).filter(v => v > 0);

  const minVal = Math.floor(Math.min(...allValues) * 0.85);
  const maxVal = Math.ceil(Math.max(...allValues) * 1.15);
  const range = maxVal - minVal || 1;

  const width = 800;
  const height = 320;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const getX = (idx: number) => padding.left + (idx / (activeData.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minVal) / range) * chartH;

  const historicalPoints = activeData.filter(d => d.historicalDemand !== undefined);
  const forecastPoints = activeData.filter((d, i) => i >= 23); // connects last historical to forecasts

  // Historical path (solid line)
  const histDemandPath = historicalPoints.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.historicalDemand!)}`).join(' ');

  // Forecast path (dashed line)
  let forecastDemandPath = '';
  let ci95AreaPath = '';
  let ci80AreaPath = '';
  let gapShadedPath = '';

  if (model === 'lightgbm') {
    forecastDemandPath = forecastPoints.map((d, i) => {
      const globalIdx = 23 + i;
      const val = d.forecastDemand || d.historicalDemand || 0;
      return `${i === 0 ? 'M' : 'L'} ${getX(globalIdx)} ${getY(val)}`;
    }).join(' ');

    // 95% Confidence Interval Area
    const ci95Upper = forecastPoints.map((d, i) => `${getX(23 + i)},${getY(d.ciUpper || d.forecastDemand || 0)}`);
    const ci95Lower = [...forecastPoints].reverse().map((d, i) => `${getX(23 + (forecastPoints.length - 1 - i))},${getY(d.ciLower || d.forecastDemand || 0)}`);
    ci95AreaPath = `M ${ci95Upper.join(' L ')} L ${ci95Lower.join(' L ')} Z`;

    // 80% Confidence Interval Area (narrower)
    const ci80Upper = forecastPoints.map((d, i) => {
      const f = d.forecastDemand || 0;
      const u = d.ciUpper || f;
      const val80 = f + (u - f) * 0.65;
      return `${getX(23 + i)},${getY(val80)}`;
    });
    const ci80Lower = [...forecastPoints].reverse().map((d, i) => {
      const f = d.forecastDemand || 0;
      const l = d.ciLower || f;
      const val80 = f - (f - l) * 0.65;
      return `${getX(23 + (forecastPoints.length - 1 - i))},${getY(val80)}`;
    });
    ci80AreaPath = `M ${ci80Upper.join(' L ')} L ${ci80Lower.join(' L ')} Z`;

    // Shaded Gap Area between forecast and supply
    const gapUpper = forecastPoints.map((d, i) => `${getX(23 + i)},${getY(d.forecastDemand || 0)}`);
    const gapLower = [...forecastPoints].reverse().map((d, i) => `${getX(23 + (forecastPoints.length - 1 - i))},${getY(d.effectiveSupply || 0)}`);
    gapShadedPath = `M ${gapUpper.join(' L ')} L ${gapLower.join(' L ')} Z`;
  }

  // Naive baseline path
  const naivePath = activeData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.baselineNaive || d.historicalDemand || 0)}`).join(' ');

  // Supply path (second line)
  const supplyPath = activeData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.effectiveSupply)}`).join(' ');

  const activePoint = hoverIndex !== null ? activeData[hoverIndex] : activeData[activeData.length - 1];
  const activeX = hoverIndex !== null ? getX(hoverIndex) : getX(activeData.length - 1);

  return (
    <div className="w-full space-y-3">
      {/* Top Header & Dynamic Benchmark Badges (§4.1, §6.2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--text)]">
            {occupationTitle}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] font-bold border border-[var(--brand)]/30">
            {horizon} {isHi ? 'क्षितिज' : 'Horizon'}
          </span>
        </div>

        {/* Model Switcher with Verified Out-Of-Sample WAPE (§4.1) */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[var(--text-faint)]">
            {isHi ? 'मॉडल वास्तुकला:' : 'Model Architecture:'}
          </span>
          <div className="glass inline-flex items-center rounded-xl p-0.5 border border-[var(--border)] text-xs">
            <button
              type="button"
              onClick={() => onModelChange && onModelChange('lightgbm')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                model === 'lightgbm' 
                  ? 'bg-[var(--brand)] text-white shadow-xs' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{horizon === '12M' ? (isHi ? 'त्रि-मॉडल मिश्रण' : 'Tri-Model Blend') : 'LightGBM'} (WAPE {benchmark.wape}%)</span>
            </button>
            <button
              type="button"
              onClick={() => onModelChange && onModelChange('naive')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                model === 'naive' 
                  ? 'bg-[var(--surface-solid)] text-[var(--text)] border border-[var(--border-strong)] shadow-xs' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <span>{isHi ? 'सीज़नल नेईव' : 'Seasonal Naive'} ({benchmark.naiveWape}%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full overflow-hidden rounded-2xl glass border border-[var(--border)] p-2 shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* 95% Confidence Interval Gradient */}
            <linearGradient id="ci95Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.brand} stopOpacity="0.20" />
              <stop offset="100%" stopColor={palette.brand} stopOpacity="0.04" />
            </linearGradient>

            {/* 80% Confidence Interval Gradient */}
            <linearGradient id="ci80Gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.brand} stopOpacity="0.32" />
              <stop offset="100%" stopColor={palette.brand} stopOpacity="0.10" />
            </linearGradient>

            {/* Gap Gradient */}
            <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.severe} stopOpacity="0.18" />
              <stop offset="100%" stopColor={palette.severe} stopOpacity="0.03" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + chartH * ratio;
            const val = Math.round(maxVal - ratio * range);
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
                  x={padding.left - 8}
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

          {/* Forecast split vertical divider (§6.2) */}
          {activeData.length > 24 && (
            <g>
              <line
                x1={getX(23)}
                y1={padding.top}
                x2={getX(23)}
                y2={height - padding.bottom}
                stroke={palette.brand}
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.8"
              />
              <text
                x={getX(23) - 8}
                y={padding.top + 14}
                textAnchor="end"
                fontSize="10"
                fontWeight="700"
                fill={palette.textMuted}
              >
                Historical Actuals
              </text>
              <text
                x={getX(23) + 8}
                y={padding.top + 14}
                textAnchor="start"
                fontSize="10"
                fontWeight="700"
                fill={palette.brand}
              >
                {horizon} Projection →
              </text>
            </g>
          )}

          {/* Shaded Gap Area (§6.2) */}
          {model === 'lightgbm' && gapShadedPath && (
            <path d={gapShadedPath} fill="url(#gapGradient)" />
          )}

          {/* 95% Confidence Interval Area (§6.2) */}
          {model === 'lightgbm' && ci95AreaPath && (
            <path d={ci95AreaPath} fill="url(#ci95Gradient)" />
          )}

          {/* 80% Confidence Interval Area (§6.2) */}
          {model === 'lightgbm' && ci80AreaPath && (
            <path d={ci80AreaPath} fill="url(#ci80Gradient)" />
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

          {/* Effective Supply Line (Solid balanced green) (§6.2) */}
          <path
            d={supplyPath}
            fill="none"
            stroke={palette.balanced}
            strokeWidth="2.5"
          />

          {/* Historical Demand Line (Solid Coral/Severe line) (§6.2) */}
          <path
            d={histDemandPath}
            fill="none"
            stroke={palette.severe}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Forecast Demand Line (Dashed brand line) (§6.2) */}
          {model === 'lightgbm' && forecastDemandPath && (
            <path
              d={forecastDemandPath}
              fill="none"
              stroke={palette.brand}
              strokeWidth="3.5"
              strokeDasharray="8 4"
              strokeLinecap="round"
            />
          )}

          {/* Hover Crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={activeX}
                y1={padding.top}
                x2={activeX}
                y2={height - padding.bottom}
                stroke={palette.brand}
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={activeX}
                cy={getY(activePoint.forecastDemand || activePoint.historicalDemand || 0)}
                r="5"
                fill={palette.brand}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle
                cx={activeX}
                cy={getY(activePoint.effectiveSupply)}
                r="5"
                fill={palette.balanced}
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
            // Show every 3rd or 4th label to prevent clutter
            const step = horizon === '12M' ? 4 : 3;
            if (i % step !== 0 && i !== 23 && i !== activeData.length - 1) return null;
            return (
              <text
                key={d.month}
                x={getX(i)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                fontSize="9"
                fill={i >= 24 ? palette.brand : palette.textMuted}
                fontWeight={i >= 24 ? '700' : '500'}
                className="font-mono"
              >
                {d.month.slice(2)}
              </text>
            );
          })}
        </svg>

        {/* Liquid Glass Interactive Tooltip Overlay */}
        {hoverIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none p-3 rounded-2xl overlay border border-[var(--border-strong)] shadow-xl text-xs space-y-1.5 backdrop-blur-md font-mono"
            style={{
              left: Math.min(width - 200, Math.max(20, activeX - 90)),
              top: 20
            }}
          >
            <div className="font-bold text-[var(--text)] flex items-center justify-between gap-4 border-b border-[var(--border)] pb-1">
              <span>{activePoint.month}</span>
              <span className="text-[10px] text-[var(--text-faint)]">
                {hoverIndex < 24 ? (isHi ? 'ऐतिहासिक वास्तविक' : 'Historical Actual') : `${horizon} ${isHi ? 'पूर्वानुमान' : 'Forecast'}`}
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between gap-4 text-[var(--severe)] font-semibold">
                <span>{isHi ? 'मांग:' : 'Demand:'}</span>
                <span className="tabular-nums font-bold">
                  {(activePoint.forecastDemand || activePoint.historicalDemand)?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[var(--balanced)] font-semibold">
                <span>{isHi ? 'आपूर्ति:' : 'Supply:'}</span>
                <span className="tabular-nums font-bold">
                  {activePoint.effectiveSupply?.toLocaleString()}
                </span>
              </div>

              {activePoint.forecastDemand && (
                <div className="flex justify-between gap-4 text-[var(--brand)] text-[10px] pt-0.5 border-t border-[var(--border)]">
                  <span>{isHi ? '95% विश्वास अंतराल सीमा:' : '95% CI Range:'}</span>
                  <span className="tabular-nums">
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
            <span className="w-3.5 h-1 bg-[var(--severe)] rounded" />
            <span>{isHi ? 'ऐतिहासिक वास्तविक' : 'Historical Actuals'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[var(--brand)] rounded border-b border-dashed" />
            <span>{isHi ? 'अनुमानित मांग' : 'Forecast Demand'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[var(--balanced)] rounded" />
            <span>{isHi ? 'चरणबद्ध आपूर्ति (0.70 तत्परता)' : 'Staged Supply (0.70 Readiness)'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3 rounded bg-[var(--brand)]/20 border border-[var(--brand)]/30" />
            <span>{isHi ? '80% एवं 95% विश्वास अंतराल बैंड' : '80% & 95% Confidence Band'}</span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-[var(--text-faint)]">
          {isHi ? 'वॉक-फॉरवर्ड सत्यापन: WAPE' : 'Walk-Forward Validation: WAPE'} <strong className="text-[var(--text)]">{benchmark.wape}%</strong> ({isHi ? 'नेईव तुलना:' : 'vs. Naive'} {benchmark.naiveWape}%)
        </div>
      </div>
    </div>
  );
};
