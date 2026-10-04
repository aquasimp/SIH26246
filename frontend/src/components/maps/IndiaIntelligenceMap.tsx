'use client';

import React, { useState } from 'react';
import { DISTRICTS, STATES } from '@/lib/demoData';
import { useApp } from '@/lib/store';
import { clsx } from 'clsx';
import { 
  Layers, 
  MapPin, 
  AlertCircle, 
  TrendingUp, 
  Building2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { District } from '@/lib/types';

type MapLayer = 'shortage' | 'demand' | 'supply' | 'oversupply' | 'centres';

export const IndiaIntelligenceMap: React.FC = () => {
  const { selectedDistrict, setSelectedDistrict, selectedState, setSelectedState } = useApp();
  const [activeLayer, setActiveLayer] = useState<MapLayer>('shortage');
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);

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
        if (d.gapScore >= 75) return '#dc2626'; // Red
        if (d.gapScore >= 60) return '#ea580c'; // Orange
        return '#10b981'; // Green
      case 'demand':
        if (d.demandIndex >= 85) return '#ea580c';
        if (d.demandIndex >= 70) return '#f59e0b';
        return '#3b82f6';
      case 'supply':
        if (d.effectiveSupplyIndex >= 70) return '#059669';
        if (d.effectiveSupplyIndex >= 60) return '#10b981';
        return '#94a3b8';
      case 'oversupply':
        if (d.gapScore < 40) return '#4f46e5';
        if (d.gapScore < 60) return '#818cf8';
        return '#cbd5e1';
      case 'centres':
        if (d.trainingCentresCount >= 30) return '#2563eb';
        if (d.trainingCentresCount >= 15) return '#3b82f6';
        return '#93c5fd';
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
      <div className="flex-1 rounded-3xl bg-gradient-to-b from-white via-slate-50/70 to-slate-100/60 p-4 sm:p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
        {/* Floating Layer Switcher Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 pb-3 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Intelligence Layer:
            </span>
          </div>

          <div className="flex flex-wrap gap-1 rounded-xl p-1 liquid-control border border-slate-200/70">
            {[
              { id: 'shortage', label: 'Shortage Severity', color: 'text-red-600' },
              { id: 'demand', label: 'Demand Volume', color: 'text-orange-600' },
              { id: 'supply', label: 'Effective Supply', color: 'text-emerald-600' },
              { id: 'oversupply', label: 'Oversupply', color: 'text-indigo-600' },
              { id: 'centres', label: 'Training Centres', color: 'text-blue-600' }
            ].map(layer => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id as MapLayer)}
                className={clsx(
                  'px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer',
                  activeLayer === layer.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG India Map Graphic with District Nodes */}
        <div className="relative w-full aspect-[6/5] flex items-center justify-center">
          <svg viewBox={`0 0 ${mapW} ${mapH}`} className="w-full h-full select-none">
            {/* Soft Ambient Map Silhouette of India Outline */}
            <path
              d="M 230,40 L 260,60 L 280,80 L 320,100 L 340,140 L 380,160 L 450,180 L 480,210 L 460,240 L 410,250 L 360,250 L 330,270 L 320,320 L 300,380 L 270,440 L 250,470 L 240,440 L 220,390 L 190,320 L 150,260 L 120,240 L 110,210 L 140,190 L 190,160 L 200,120 L 220,70 Z"
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="transition-colors duration-500"
            />

            {/* Regional State Cluster Boundary Lines */}
            {/* UP Cluster */}
            <path
              d="M 270,140 Q 340,145 370,180 Q 320,210 270,180 Z"
              fill="rgba(59, 130, 246, 0.04)"
              stroke="#93c5fd"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {/* Gujarat Cluster */}
            <path
              d="M 120,210 Q 180,210 180,270 Q 120,270 120,210 Z"
              fill="rgba(16, 185, 129, 0.04)"
              stroke="#6ee7b7"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {/* Maharashtra Cluster */}
            <path
              d="M 180,270 Q 280,260 280,330 Q 180,340 180,270 Z"
              fill="rgba(245, 158, 11, 0.04)"
              stroke="#fcd34d"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {/* Karnataka Cluster */}
            <path
              d="M 200,340 Q 270,340 260,430 Q 190,410 200,340 Z"
              fill="rgba(99, 102, 241, 0.04)"
              stroke="#c7d2fe"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Connecting Corridor Hub Lines */}
            <line x1={project(26.8467, 80.9462)[0]} y1={project(26.8467, 80.9462)[1]} x2={project(26.7606, 83.3732)[0]} y2={project(26.7606, 83.3732)[1]} stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <line x1={project(26.8467, 80.9462)[0]} y1={project(26.8467, 80.9462)[1]} x2={project(25.3176, 82.9739)[0]} y2={project(25.3176, 82.9739)[1]} stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <line x1={project(18.5204, 73.8567)[0]} y1={project(18.5204, 73.8567)[1]} x2={project(12.9716, 77.5946)[0]} y2={project(12.9716, 77.5946)[1]} stroke="#2563eb" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

            {/* Interactive District Nodes */}
            {DISTRICTS.map((d) => {
              const [cx, cy] = project(d.coordinates[0], d.coordinates[1]);
              const isSelected = d.id === selectedDistrict;
              const radius = getDistrictRadius(d);
              const color = getDistrictColor(d);

              return (
                <g
                  key={d.id}
                  className="cursor-pointer transition-all duration-300 group"
                  onClick={() => handleDistrictSelect(d)}
                  onMouseEnter={() => setHoveredDistrict(d)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                >
                  {/* Outer selection beacon ring */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 8}
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-ping"
                    />
                  )}

                  {/* Halo glow */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 4}
                    fill={color}
                    opacity={isSelected ? 0.35 : 0.15}
                  />

                  {/* Main Node */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="shadow-md"
                  />

                  {/* High Shortage Pulse Marker for Gorakhpur */}
                  {d.id === 'gorakhpur' && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={3}
                      fill="#ffffff"
                    />
                  )}

                  {/* District Name Label */}
                  <text
                    x={cx}
                    y={cy - radius - 5}
                    textAnchor="middle"
                    fontSize={isSelected ? "11" : "9"}
                    fontWeight={isSelected ? "800" : "600"}
                    fill={isSelected ? "#0f172a" : "#475569"}
                    className="select-none pointer-events-none drop-shadow-xs"
                  >
                    {d.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Hover Info Card */}
          {hoveredDistrict && (
            <div className="absolute bottom-4 left-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl max-w-xs z-10 text-xs">
              <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 text-sm">
                  {hoveredDistrict.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  LGD {hoveredDistrict.lgdCode}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                <div>
                  <span className="text-slate-400 block">Gap Score:</span>
                  <strong className={clsx(
                    'font-bold',
                    hoveredDistrict.gapScore >= 75 ? 'text-red-600' : 'text-emerald-600'
                  )}>
                    {hoveredDistrict.gapScore} / 100
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">6M Shortage Prob:</span>
                  <strong className="text-slate-800 font-mono">
                    {hoveredDistrict.shortageProbability6M}%
                  </strong>
                </div>
              </div>
              <div className="text-[10px] text-slate-600">
                <span className="font-semibold text-slate-700">Top Shortage: </span>
                {hoveredDistrict.topShortageTrades[0]}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Legend Guide */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-3 border-t border-slate-200/70 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Severity:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Severe Shortage (Gap &gt; 75)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Moderate (60-75)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Balanced (40-60)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Oversupply (&lt; 40)</span>
          </div>
          <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">
            Click any district to view localized intelligence profile →
          </span>
        </div>
      </div>

      {/* Right Selected District Snapshot Panel */}
      {(() => {
        const d = DISTRICTS.find(item => item.id === selectedDistrict) || DISTRICTS[0];

        return (
          <div className="w-full xl:w-80 flex flex-col justify-between p-5 rounded-3xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Selected Geography
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {d.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {d.state} (LGD Code: {d.lgdCode})
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>

              {/* District KPI Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Gap Score</span>
                  <div className="text-2xl font-extrabold text-red-600 mt-0.5">
                    {d.gapScore}
                  </div>
                  <span className="text-[10px] text-red-600 font-semibold">
                    Severe Shortage
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Shortage Risk</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-0.5 font-mono">
                    {d.shortageProbability6M}%
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    6M Forward Horizon
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Capacity</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {d.trainingCentresCount} Centres
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {d.totalTrainingSeats} Active Seats
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Employers</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">
                    {d.activeEmployers} Active
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Hiring Verified
                  </span>
                </div>
              </div>

              {/* Top Trade Imbalances */}
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    Top Shortage Trades:
                  </span>
                  <div className="space-y-1">
                    {d.topShortageTrades.map((t, idx) => (
                      <div key={idx} className="text-xs font-semibold text-slate-800 py-1 px-2.5 rounded-lg bg-red-50/70 border border-red-200/50 flex items-center justify-between">
                        <span>{t}</span>
                        <span className="text-[10px] text-red-700 font-bold">Deficit</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                    Oversupplied Trades:
                  </span>
                  <div className="space-y-1">
                    {d.topOversuppliedTrades.map((t, idx) => (
                      <div key={idx} className="text-xs font-semibold text-slate-700 py-1 px-2.5 rounded-lg bg-indigo-50/70 border border-indigo-200/50 flex items-center justify-between">
                        <span>{t}</span>
                        <span className="text-[10px] text-indigo-700 font-bold">Excess</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <a
              href={`/districts/${d.id}`}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <span>Explore Complete {d.name} Profile</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        );
      })()}
    </div>
  );
};
