'use client';

import React, { useState } from 'react';
import { TimePoint, ForecastHorizon } from '@/lib/types';
import { clsx } from 'clsx';
import { Info, Sparkles, TrendingUp, ShieldAlert } from 'lucide-react';

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
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Slice data based on horizon
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

  // Build SVG Paths
  let histDemandPath = '';
  let forecastDemandPath = '';
  let supplyPath = '';
  let naivePath = '';
  let ciAreaPath = '';

  const historicalPoints = activeData.filter(d => d.historicalDemand !== undefined);
  const forecastPoints = activeData.filter((d, i) => i >= 23); // connects last historical to forecasts

  // Historical path
  histDemandPath = historicalPoints.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.historicalDemand!)}`).join(' ');

  // Forecast path (using LightGBM or Naive)
  if (model === 'lightgbm') {
    forecastDemandPath = forecastPoints.map((d, i) => {
      const globalIdx = 23 + i;
      const val = d.forecastDemand || d.historicalDemand || 0;
      return `${i === 0 ? 'M' : 'L'} ${getX(globalIdx)} ${getY(val)}`;
    }).join(' ');

    // Confidence Interval Area
    const ciUpperPoints = forecastPoints.map((d, i) => `${getX(23 + i)},${getY(d.ciUpper || d.forecastDemand || 0)}`);
    const ciLowerPoints = [...forecastPoints].reverse().map((d, i) => `${getX(23 + (forecastPoints.length - 1 - i))},${getY(d.ciLower || d.forecastDemand || 0)}`);
    ciAreaPath = `M ${ciUpperPoints.join(' L ')} L ${ciLowerPoints.join(' L ')} Z`;
  } else {
    // Naive baseline
    naivePath = activeData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.baselineNaive || d.historicalDemand || 0)}`).join(' ');
  }

  // Supply path
  supplyPath = activeData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.effectiveSupply)}`).join(' ');

  const activePoint = hoverIndex !== null ? activeData[hoverIndex] : activeData[activeData.length - 1];
  const activeX = hoverIndex !== null ? getX(hoverIndex) : getX(activeData.length - 1);

  return (
    <div className="w-full">
      {/* Top Chart Header & Legend Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">
            {occupationTitle}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
            {horizon} Projection
          </span>
        </div>

        {/* Model Switcher Pills */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500">Forecasting Engine:</span>
          <div className="flex rounded-xl p-0.5 liquid-control border border-slate-200">
            <button
              onClick={() => onModelChange && onModelChange('lightgbm')}
              className={clsx(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1',
                model === 'lightgbm' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              LightGBM Ensemble (WAPE 12.7%)
            </button>
            <button
              onClick={() => onModelChange && onModelChange('naive')}
              className={clsx(
                'px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer',
                model === 'naive' 
                  ? 'bg-slate-700 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Seasonal Naive (WAPE 18.4%)
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-white/90 to-slate-50/90 border border-slate-200/70 p-2 shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="forecastGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#818cf8" />
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
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontWeight="600"
                >
                  {val.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Forecast split vertical divider */}
          {activeData.length > 24 && (
            <g>
              <line
                x1={getX(23)}
                y1={padding.top}
                x2={getX(23)}
                y2={height - padding.bottom}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={getX(23) - 6}
                y={padding.top + 14}
                textAnchor="end"
                fontSize="10"
                fontWeight="700"
                fill="#64748b"
              >
                Historical Actuals
              </text>
              <text
                x={getX(23) + 6}
                y={padding.top + 14}
                textAnchor="start"
                fontSize="10"
                fontWeight="700"
                fill="#2563eb"
              >
                Forward Projections →
              </text>
            </g>
          )}

          {/* CI Area */}
          {model === 'lightgbm' && ciAreaPath && (
            <path d={ciAreaPath} fill="url(#ciGradient)" />
          )}

          {/* Baseline Naive Path */}
          {model === 'naive' && naivePath && (
            <path
              d={naivePath}
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )}

          {/* Effective Supply Line (Emerald) */}
          <path
            d={supplyPath}
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
          />

          {/* Historical Demand Line (Solid Coral/Orange) */}
          <path
            d={histDemandPath}
            fill="none"
            stroke="#ea580c"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Forecast Demand Line (Sapphire with dash/glow) */}
          {model === 'lightgbm' && forecastDemandPath && (
            <path
              d={forecastDemandPath}
              fill="none"
              stroke="url(#forecastGlow)"
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
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={activeX}
                cy={getY(activePoint.forecastDemand || activePoint.historicalDemand || 0)}
                r="5"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle
                cx={activeX}
                cy={getY(activePoint.effectiveSupply)}
                r="5"
                fill="#059669"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Invisible interactive hover bars */}
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
          {activeData.filter((_, i) => i % 3 === 0 || i === activeData.length - 1).map((d) => {
            const idx = activeData.findIndex(p => p.month === d.month);
            return (
              <text
                key={d.month}
                x={getX(idx)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
                fontWeight="600"
              >
                {d.month}
              </text>
            );
          })}
        </svg>

        {/* Floating Tooltip Box */}
        {activePoint && (
          <div className="mt-2 p-3 rounded-xl bg-white/95 border border-slate-200/80 shadow-md flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                Month: {activePoint.month}
              </span>
              {activePoint.forecastDemand !== undefined && (
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  Forecasted
                </span>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
                <span className="text-slate-500">Demand:</span>
                <strong className="text-slate-900 font-mono">
                  {(activePoint.forecastDemand || activePoint.historicalDemand || 0).toLocaleString()}
                </strong>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="text-slate-500">Effective Supply:</span>
                <strong className="text-slate-900 font-mono">
                  {activePoint.effectiveSupply.toLocaleString()}
                </strong>
              </div>

              {activePoint.ciLower !== undefined && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span>95% CI:</span>
                  <span className="font-mono text-slate-700">
                    [{activePoint.ciLower} - {activePoint.ciUpper}]
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <span className="text-slate-500">Net Gap:</span>
                <strong className={clsx(
                  'font-mono font-bold',
                  (activePoint.forecastDemand || activePoint.historicalDemand || 0) > activePoint.effectiveSupply
                    ? 'text-red-600'
                    : 'text-indigo-600'
                )}>
                  {((activePoint.forecastDemand || activePoint.historicalDemand || 0) - activePoint.effectiveSupply > 0 ? '+' : '')}
                  {((activePoint.forecastDemand || activePoint.historicalDemand || 0) - activePoint.effectiveSupply).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-3 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 rounded bg-orange-600"></span>
          <span>Historical Demand (NCS Aggregates)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 rounded bg-blue-600 border border-blue-400 border-dashed"></span>
          <span>Forecast Demand (LightGBM)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 rounded bg-emerald-600"></span>
          <span>Effective Employable Supply</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3 rounded bg-blue-400/20 border border-blue-400/40"></span>
          <span>95% Confidence Interval</span>
        </div>
      </div>
    </div>
  );
};
