'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DISTRICTS } from '@/lib/demoData';
import { useApp } from '@/lib/store';
import { useChartPalette } from '@/lib/useChartPalette';
import { 
  Layers, 
  MapPin, 
  AlertCircle, 
  TrendingUp, 
  ChevronRight,
  Database
} from 'lucide-react';
import { District } from '@/lib/types';

type MapLayer = 'shortage' | 'demand' | 'supply' | 'oversupply' | 'centres';

export const IndiaIntelligenceMap: React.FC = () => {
  const { selectedDistrict, setSelectedDistrict, setSelectedState } = useApp();
  const [activeLayer, setActiveLayer] = useState<MapLayer>('shortage');
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const palette = useChartPalette();

  // SVG coordinate projection helper for our 16 districts
  // India bounds approximately: Lat 8 to 36, Lng 68 to 96
  const mapW = 600;
  const mapH = 500;
  const project = (lat: number, lng: number): [number, number] => {
    const x = ((lng - 68) / (96 - 68)) * (mapW - 100) + 50;
    const y = ((36 - lat) / (36 - 8)) * (mapH - 80) + 40;
    return [x, y];
  };

  const getDistrictColor = (d: District) => {
    switch (activeLayer) {
      case 'shortage':
        if (d.gapScore >= 75) return palette.severe;
        if (d.gapScore >= 60) return palette.moderate;
        return palette.balanced;
      case 'demand':
        if (d.demandIndex >= 85) return palette.severe;
        if (d.demandIndex >= 70) return palette.moderate;
        return palette.brand;
      case 'supply':
        if (d.effectiveSupplyIndex >= 70) return palette.balanced;
        if (d.effectiveSupplyIndex >= 60) return palette.brandSecondary;
        return palette.textMuted;
      case 'oversupply':
        if (d.gapScore < 40) return palette.oversupply;
        if (d.gapScore < 60) return palette.brand;
        return palette.textMuted;
      case 'centres':
        if (d.trainingCentresCount >= 30) return palette.brand;
        if (d.trainingCentresCount >= 15) return palette.brandSecondary;
        return palette.textMuted;
    }
  };

  const getDistrictRadius = (d: District) => {
    const isSelected = d.id === selectedDistrict;
    const isHovered = hoveredDistrict?.id === d.id;
    let base = 8;
    if (activeLayer === 'demand') base = (d.demandIndex / 100) * 14 + 6;
    if (activeLayer === 'shortage') base = (d.gapScore / 100) * 15 + 6;
    if (activeLayer === 'centres') base = Math.min(22, d.trainingCentresCount * 0.4 + 7);

    return isSelected ? base + 4 : isHovered ? base + 2 : base;
  };

  const handleDistrictSelect = (d: District) => {
    setSelectedDistrict(d.id);
    setSelectedState(d.state);
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6">
      {/* Left Main Map Container */}
      <div className="flex-1 rounded-3xl glass p-4 sm:p-5 border border-[var(--border)] shadow-xs relative overflow-hidden">
        {/* Floating Layer Switcher Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--brand)]" />
              Intelligence Layer:
            </span>
          </div>

          <div className="flex flex-wrap gap-1 rounded-xl p-1 glass border border-[var(--border)]">
            {[
              { id: 'shortage', label: 'Shortage Severity' },
              { id: 'demand', label: 'Demand Volume' },
              { id: 'supply', label: 'Effective Supply' },
              { id: 'oversupply', label: 'Oversupply' },
              { id: 'centres', label: 'Training Centres' }
            ].map(layer => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id as MapLayer)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeLayer === layer.id
                    ? 'bg-[var(--brand)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-strong)]'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG India Map Graphic with District Nodes */}
        <div className="relative w-full aspect-[6/5] flex items-center justify-center">
          <svg viewBox={`0 0 ${mapW} ${mapH}`} className="w-full h-full select-none overflow-visible">
            {/* Soft Ambient Map Silhouette of India Outline */}
            <path
              d="M 230,40 L 260,60 L 280,80 L 320,100 L 340,140 L 380,160 L 450,180 L 480,210 L 460,240 L 410,250 L 360,250 L 330,270 L 320,320 L 300,380 L 270,440 L 250,470 L 240,440 L 220,390 L 190,320 L 150,260 L 120,240 L 110,210 L 140,190 L 190,160 L 200,120 L 220,70 Z"
              fill={palette.surface}
              fillOpacity="0.45"
              stroke={palette.grid}
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="transition-colors duration-300"
            />

            {/* Northern Crown & Geographic Accent Grid Lines */}
            <line x1="120" y1="250" x2="460" y2="250" stroke={palette.grid} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.6" />
            <line x1="280" y1="60" x2="280" y2="440" stroke={palette.grid} strokeDasharray="3 4" strokeWidth="0.8" opacity="0.6" />

            {/* Strategic Corridor Vector Lines */}
            <g stroke={palette.brand} strokeWidth="1.2" strokeDasharray="4 4" opacity="0.45">
              {/* Purvanchal Energy Corridor: Gorakhpur to Varanasi */}
              <line x1="395" y1="185" x2="390" y2="205" />
              {/* Western Industrial Corridor: Pune to Mumbai to Nashik */}
              <line x1="210" y1="290" x2="195" y2="280" />
              <line x1="195" y1="280" x2="205" y2="265" />
              {/* Southern Tech Corridor: Bengaluru to Mysuru */}
              <line x1="240" y1="380" x2="230" y2="395" />
            </g>

            {/* Interactive District Nodes */}
            {DISTRICTS.map((d) => {
              const [cx, cy] = project(d.coordinates[0], d.coordinates[1]);
              const color = getDistrictColor(d);
              const r = getDistrictRadius(d);
              const isSelected = d.id === selectedDistrict;

              return (
                <g
                  key={d.id}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => handleDistrictSelect(d)}
                  onMouseEnter={() => setHoveredDistrict(d)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                >
                  {/* Selected Ripple Pulse Glow */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r + 8}
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r + 4}
                      fill="none"
                      stroke={palette.brand}
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={color}
                    fillOpacity={isSelected ? 0.95 : 0.82}
                    stroke={isSelected ? '#ffffff' : palette.surface}
                    strokeWidth={isSelected ? '2' : '1.5'}
                    className="transition-all hover:scale-110"
                  />

                  {/* District Label Text */}
                  <text
                    x={cx}
                    y={cy - r - 4}
                    textAnchor="middle"
                    fill={isSelected ? palette.text : palette.textMuted}
                    fontSize={isSelected ? '11' : '10'}
                    fontWeight={isSelected ? 'bold' : '600'}
                    className="pointer-events-none drop-shadow-xs font-sans tracking-tight"
                  >
                    {d.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Map Legend Overlay */}
          <div className="absolute bottom-3 left-3 p-3 rounded-2xl overlay border border-[var(--border)] text-[10px] space-y-1.5 shadow-lg max-w-[200px] backdrop-blur-md">
            <span className="font-bold text-[var(--text)] uppercase tracking-wider block">
              {activeLayer === 'shortage' && 'Shortage Severity'}
              {activeLayer === 'demand' && 'Demand Volume Index'}
              {activeLayer === 'supply' && 'Effective Supply Index'}
              {activeLayer === 'oversupply' && 'Oversupply Index'}
              {activeLayer === 'centres' && 'Training Centres'}
            </span>

            {activeLayer === 'shortage' && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--severe)] shrink-0" />
                  <span>Severe Shortage (Gap &gt; 75)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--moderate)] shrink-0" />
                  <span>Moderate Shortage (60–75)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--balanced)] shrink-0" />
                  <span>Balanced Labour Pool (&lt; 60)</span>
                </div>
              </div>
            )}

            {activeLayer !== 'shortage' && (
              <div className="flex items-center justify-between text-[9px] text-[var(--text-faint)] font-mono pt-0.5">
                <span>Low</span>
                <span className="h-1.5 w-16 rounded-full bg-gradient-to-r from-[var(--balanced)] via-[var(--moderate)] to-[var(--severe)]" />
                <span>High</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Selected District Intelligence Panel (§4.1, §6.1) */}
      {(() => {
        const d = DISTRICTS.find(item => item.id === selectedDistrict) || DISTRICTS[0];

        return (
          <div className="w-full xl:w-96 rounded-3xl glass-strong p-5 border border-[var(--border)] shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <span className="text-[10px] font-bold text-[var(--brand)] uppercase tracking-widest block font-mono">
                    Selected Geography
                  </span>
                  <h3 className="text-xl font-extrabold text-[var(--text)] tracking-tight">
                    {d.name}
                  </h3>
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    {d.state} (LGD Code: {d.lgdCode})
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl glass text-[var(--brand)] border border-[var(--border)]">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>

              {/* District KPI Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                    Solar Gap Score
                  </span>
                  <div className="text-2xl font-extrabold text-[var(--severe)] mt-0.5 font-mono tabular-nums">
                    {d.gapScore}
                  </div>
                  <span className="text-[10px] text-[var(--severe)] font-bold">
                    Severe Shortage
                  </span>
                </div>

                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                    6M Shortage Risk
                  </span>
                  <div className="text-2xl font-extrabold text-[var(--text)] mt-0.5 font-mono tabular-nums">
                    {d.shortageProbability6M}%
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-semibold">
                    Probability
                  </span>
                </div>

                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                    Training Capacity
                  </span>
                  <div className="text-sm font-bold text-[var(--text)] mt-0.5 font-mono tabular-nums">
                    {d.id === 'gorakhpur' ? '217 Solar / 916 Retail' : `${d.totalTrainingSeats} Active Seats`}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    {d.trainingCentresCount} Centres • {d.totalTrainingSeats} Seats
                  </span>
                </div>

                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                    Active Employers
                  </span>
                  <div className="text-lg font-bold text-[var(--text)] mt-0.5 font-mono tabular-nums">
                    {d.activeEmployers}
                  </div>
                  <span className="text-[10px] text-[var(--success)] font-semibold">
                    Hiring Verified
                  </span>
                </div>
              </div>

              {/* Top Trade Imbalances */}
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-[11px] font-bold text-[var(--severe)] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-[var(--severe)]" />
                    Top Shortage Trades:
                  </span>
                  <div className="space-y-1">
                    {d.topShortageTrades.map((t, idx) => (
                      <div key={idx} className="text-xs font-semibold text-[var(--text)] py-1 px-2.5 rounded-xl glass border border-[var(--severe)]/20 flex items-center justify-between">
                        <span className="truncate">{t}</span>
                        <span className="text-[10px] text-[var(--severe)] font-mono font-bold shrink-0 ml-1">Deficit</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-[var(--oversupply)] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--oversupply)]" />
                    Oversupplied Trades:
                  </span>
                  <div className="space-y-1">
                    {d.topOversuppliedTrades.map((t, idx) => (
                      <div key={idx} className="text-xs font-semibold text-[var(--text)] py-1 px-2.5 rounded-xl glass border border-[var(--oversupply)]/20 flex items-center justify-between">
                        <span className="truncate">{t}</span>
                        <span className="text-[10px] text-[var(--oversupply)] font-mono font-bold shrink-0 ml-1">Excess</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/districts/${d.id}`}
              className="w-full py-2 px-3 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Explore Complete {d.name} Dossier</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        );
      })()}
    </div>
  );
};
