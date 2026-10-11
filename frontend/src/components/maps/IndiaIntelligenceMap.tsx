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
import { getLocalizedEntityName, stateNameToHi } from '@/lib/i18n';

type MapLayer = 'shortage' | 'demand' | 'supply' | 'oversupply' | 'centres';

export const IndiaIntelligenceMap: React.FC = () => {
  const { selectedDistrict, setSelectedDistrict, setSelectedState, language, t, l} = useApp();
  const [activeLayer, setActiveLayer] = useState<MapLayer>('shortage');
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const palette = useChartPalette();
  const isHi = language === 'hi';

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
        if (d.gapScore >= 40) return palette.balanced;
        return palette.oversupply;
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

  const top5DistrictIds = React.useMemo(() => {
    return [...DISTRICTS]
      .sort((a, b) => b.gapScore - a.gapScore)
      .slice(0, 5)
      .map(d => d.id);
  }, []);

  const getDistrictRadius = (d: District) => {
    const isSelected = d.id === selectedDistrict;
    const isHovered = hoveredDistrict?.id === d.id;
    let base = 6 + (d.gapScore / 100) * 12;
    if (activeLayer === 'demand') base = 6 + (d.demandIndex / 100) * 12;
    if (activeLayer === 'supply') base = 6 + (d.effectiveSupplyIndex / 100) * 12;
    if (activeLayer === 'oversupply') base = 6 + ((100 - d.gapScore) / 100) * 12;
    if (activeLayer === 'centres') base = Math.min(18, 6 + d.trainingCentresCount * 0.3);

    return isSelected ? base + 4 : isHovered ? base + 2 : base;
  };

  const handleDistrictSelect = (d: District) => {
    setSelectedDistrict(d.id);
    setSelectedState(d.state);
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6">
      {/* Left Main Map Container */}
      <div className="flex-1 rounded-3xl glass p-3 sm:p-4 border border-[var(--border)] shadow-xs relative overflow-hidden">
        {/* SVG India Map Graphic with District Nodes */}
        <div className="relative w-full aspect-[6/5] flex items-center justify-center">
          {/* Segmented Layer Switcher Floating on Map (§4, §5) */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 p-1 rounded-xl glass-strong border border-[var(--border)] shadow-md backdrop-blur-md max-w-[calc(100%-24px)] overflow-x-auto scrollbar-none">
            {[
              { id: 'shortage', label: l('Shortage', 'कमी') },
              { id: 'demand', label: l('Demand', 'मांग') },
              { id: 'supply', label: l('Supply', 'आपूर्ति') },
              { id: 'oversupply', label: l('Oversupply', 'अधिशेष') },
              { id: 'centres', label: l('Centres', 'केंद्र') }
            ].map(layer => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id as MapLayer)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 min-h-[30px] ${
                  activeLayer === layer.id
                    ? 'bg-[var(--brand)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-strong)]'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>

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
              {/* Western Corridor: Pune to Chhatrapati Sambhajinagar to Nashik */}
              <line x1="210" y1="290" x2="225" y2="260" />
              <line x1="225" y1="260" x2="205" y2="265" />
              {/* Southern Tech Corridor: Bengaluru to Mysuru to Coimbatore */}
              <line x1="240" y1="380" x2="230" y2="395" />
              <line x1="230" y1="395" x2="238" y2="420" />
            </g>

            {/* Interactive District Nodes */}
            {DISTRICTS.map((d) => {
              const [cx, cy] = project(d.coordinates[0], d.coordinates[1]);
              const color = getDistrictColor(d);
              const r = getDistrictRadius(d);
              const isSelected = d.id === selectedDistrict;
              const isTop5 = top5DistrictIds.includes(d.id);
              const showLabel = isSelected || hoveredDistrict?.id === d.id || isTop5;
              const displayName = isHi && d.nameHi ? d.nameHi : d.name;

              return (
                <g
                  key={d.id}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => handleDistrictSelect(d)}
                  onMouseEnter={() => setHoveredDistrict(d)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                >
                  {/* Generous touch target for mobile fingertips */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={Math.max(r + 14, 24)}
                    fill="transparent"
                  />

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

                  {/* District Label Text: only shown on hover, selected, or top 5 */}
                  {showLabel && (
                    <text
                      x={cx}
                      y={cy - r - 4}
                      textAnchor="middle"
                      fill={isSelected ? palette.text : palette.textMuted}
                      fontSize={isSelected ? '12' : '11'}
                      fontWeight={isSelected || isTop5 ? 'bold' : '600'}
                      className="pointer-events-none drop-shadow-xs font-sans tracking-tight"
                    >
                      {displayName}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Map Legend Overlay on Map (§4, §5) */}
          <div className="absolute bottom-3 left-3 p-3 rounded-2xl glass-strong border border-[var(--border)] text-xs space-y-2 shadow-lg max-w-[220px] backdrop-blur-md z-10">
            <span className="font-bold text-[var(--text)] uppercase tracking-wider block text-xs">
              {activeLayer === 'shortage' && (l('Shortage Severity', 'कमी की गंभीरता'))}
              {activeLayer === 'demand' && (l('Demand Index', 'मांग सूचकांक'))}
              {activeLayer === 'supply' && (l('Effective Supply', 'प्रभावी आपूर्ति'))}
              {activeLayer === 'oversupply' && (l('Oversupply Index', 'अतिआपूर्ति सूचकांक'))}
              {activeLayer === 'centres' && (l('Training Centres', 'प्रशिक्षण केंद्र'))}
            </span>

            {activeLayer === 'shortage' && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <span className="w-3 h-3 rounded-full bg-[var(--severe)] shrink-0" />
                  <span className="font-mono font-bold text-[var(--text)]">≥ 75</span>
                  <span>{l('Severe', 'गंभीर')}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <span className="w-3 h-3 rounded-full bg-[var(--moderate)] shrink-0" />
                  <span className="font-mono font-bold text-[var(--text)]">60–74</span>
                  <span>{l('Moderate', 'मध्यम')}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <span className="w-3 h-3 rounded-full bg-[var(--balanced)] shrink-0" />
                  <span className="font-mono font-bold text-[var(--text)]">40–59</span>
                  <span>{l('Balanced', 'संतुलित')}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <span className="w-3 h-3 rounded-full bg-[var(--oversupply)] shrink-0" />
                  <span className="font-mono font-bold text-[var(--text)]">&lt; 40</span>
                  <span>{l('Oversupply', 'अतिआपूर्ति')}</span>
                </div>
              </div>
            )}

            {activeLayer !== 'shortage' && (
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono pt-1">
                <span>{l('Low', 'निम्न')}</span>
                <span className="h-2 w-20 rounded-full bg-gradient-to-r from-[var(--balanced)] via-[var(--moderate)] to-[var(--severe)]" />
                <span>{l('High', 'उच्च')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Selected District Intelligence Panel (§4.1, §6.1) */}
      {(() => {
        const d = DISTRICTS.find(item => item.id === selectedDistrict) || DISTRICTS[0];
        const displayName = isHi && d.nameHi ? d.nameHi : d.name;

        return (
          <div className="w-full xl:w-96 rounded-3xl glass-strong p-5 border border-[var(--border)] shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <span className="text-xs font-bold text-[var(--brand)] uppercase tracking-widest block font-mono">
                    {l('Selected Geography', 'चयनित भूगोल')}
                  </span>
                  <h3 className="text-xl font-extrabold text-[var(--text)] tracking-tight">
                    {displayName}
                  </h3>
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    {isHi ? (stateNameToHi[d.state] || d.state) : d.state} ({l('LGD Code', 'LGD कोड')}: {d.lgdCode})
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl glass text-[var(--brand)] border border-[var(--border)]">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>

              {/* District KPI Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                    {l('Solar Gap Score', 'सोलर गैप स्कोर')}
                  </span>
                  <div className="text-2xl font-extrabold text-[var(--severe)] mt-0.5 font-mono tabular-nums">
                    {d.gapScore}
                  </div>
                  <span className="text-xs text-[var(--severe)] font-bold">
                    {l('Severe Shortage', 'गंभीर कमी')}
                  </span>
                </div>

                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                    {l('6M Shortage Risk', '6M कमी जोखिम')}
                  </span>
                  <div className="text-2xl font-extrabold text-[var(--text)] mt-0.5 font-mono tabular-nums">
                    {d.shortageProbability6M}%
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-semibold">
                    {l('Probability', 'संभावना')}
                  </span>
                </div>

                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                    {l('Training Capacity', 'प्रशिक्षण क्षमता')}
                  </span>
                  <div className="text-xs font-bold text-[var(--text)] mt-0.5 font-mono tabular-nums">
                    {d.id === 'gorakhpur' ? (l('217 Solar / 916 Retail', '217 सोलर / 916 रिटेल')) : `${d.totalTrainingSeats} ${l('Active Seats', 'सक्रिय सीटें')}`}
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    {d.trainingCentresCount} {l('Centres', 'केंद्र')} • {d.totalTrainingSeats} {l('Seats', 'सीटें')}
                  </span>
                </div>

                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider block">
                    {l('Active Employers', 'सक्रिय नियोक्ता')}
                  </span>
                  <div className="text-lg font-bold text-[var(--text)] mt-0.5 font-mono tabular-nums">
                    {d.activeEmployers}
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-semibold">
                    {l('Reported hiring', 'रिपोर्ट की गई नियुक्ति')}
                  </span>
                </div>
              </div>

              {/* Top Trade Imbalances */}
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-xs font-bold text-[var(--severe)] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-[var(--severe)]" />
                    {l('Top Shortage Trades:', 'शीर्ष कमी वाले ट्रेड्स:')}
                  </span>
                  <div className="space-y-1">
                    {d.topShortageTrades.map((t, idx) => (
                      <div key={idx} className="text-xs font-semibold text-[var(--text)] py-1 px-2.5 rounded-xl glass border border-[var(--severe)]/20 flex items-center justify-between">
                        <span className="truncate">{isHi ? getLocalizedEntityName('occupations', t, 'hi') : t}</span>
                        <span className="text-xs text-[var(--severe)] font-mono font-bold shrink-0 ml-1">{l('Deficit', 'घाटा')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-[var(--oversupply)] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--oversupply)]" />
                    {l('Capacity surplus (seats):', 'क्षमता अधिशेष (सीटें):')}
                  </span>
                  <div className="space-y-1">
                    {(d.capacitySurplusTrades || d.topOversuppliedTrades || []).map((t: string, idx: number) => (
                      <div key={idx} className="text-xs font-semibold text-[var(--text)] py-1 px-2.5 rounded-xl glass border border-[var(--oversupply)]/20 flex items-center justify-between">
                        <span className="truncate">{isHi ? getLocalizedEntityName('occupations', t, 'hi') : t}</span>
                        <span className="text-xs text-[var(--oversupply)] font-mono font-bold shrink-0 ml-1">{l('Surplus', 'अधिशेष')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/districts/${d.id}`}
              className="w-full py-2.5 px-3 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer min-h-[40px]"
            >
              <span>{l(`Explore Complete ${displayName} Dossier`, `पूर्ण ${displayName} डोजियर देखें`)}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        );
      })()}
    </div>
  );
};
