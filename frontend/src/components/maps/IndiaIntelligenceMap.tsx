'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { geoMercator, geoPath } from 'd3-geo';
import { useApp } from '@/lib/store';
import { useChartPalette } from '@/lib/useChartPalette';
import { 
  Layers, 
  MapPin, 
  AlertCircle, 
  TrendingUp, 
  ChevronRight,
  Database,
  Table as TableIcon,
  Map as MapIcon,
  Sliders,
  ExternalLink,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { District, SEVERITY_BANDS } from '@/lib/types';
import { getLocalizedEntityName } from '@/lib/i18n';
import choroplethDataRaw from '@/data/india_choropleth.json';
import tradeMetricsRaw from '@/data/trade_district_metrics.json';

// Layer definitions with units (§3)
export type MapLayer = 'severity' | 'demand' | 'supply' | 'surplus';

export interface MapLayerConfig {
  id: MapLayer;
  labelEn: string;
  labelHi: string;
  unitEn: string;
  unitHi: string;
}

export const MAP_LAYERS: MapLayerConfig[] = [
  { id: 'severity', labelEn: 'Severity', labelHi: 'गंभीरता', unitEn: 'Gap Score (0–100)', unitHi: 'अंतर स्कोर (0–100)' },
  { id: 'demand', labelEn: 'Demand', labelHi: 'मांग', unitEn: 'Candidates', unitHi: 'उम्मीदवार' },
  { id: 'supply', labelEn: 'Effective Supply', labelHi: 'प्रभावी आपूर्ति', unitEn: 'Candidates', unitHi: 'उम्मीदवार' },
  { id: 'surplus', labelEn: 'Capacity Surplus', labelHi: 'क्षमता अधिशेष', unitEn: 'Seats', unitHi: 'सीटें' },
];

export const ALL_TRADES_OPTION = '__all_trades__';

const choroplethData = choroplethDataRaw as {
  type: string;
  districts: any[];
  states: any[];
};

const tradeMetrics = tradeMetricsRaw as Record<string, {
  districtId: string;
  districtName: string;
  districtNameHi: string;
  state: string;
  lgdCode: number;
  maxGapScore: number;
  overallDemand: number;
  overallSupply: number;
  overallSurplus: number;
  trades: Record<string, {
    demand: number;
    effectiveSupply: number;
    gapScore: number;
    capacitySurplusSeats: number;
    confidence: number;
    titleHi: string;
  }>;
}>;

export const IndiaIntelligenceMap: React.FC = () => {
  const { selectedDistrict, setSelectedDistrict, setSelectedState, language, t, l } = useApp();
  const [activeLayer, setActiveLayer] = useState<MapLayer>('severity');
  const [selectedTrade, setSelectedTrade] = useState<string>('Solar PV Installer');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const palette = useChartPalette();
  const isHi = language === 'hi';

  // Available trades extracted from metrics
  const availableTrades = useMemo(() => {
    const firstDist = Object.values(tradeMetrics)[0];
    if (!firstDist) return ['Solar PV Installer'];
    return Object.keys(firstDist.trades);
  }, []);

  // Filter features based on state zoom selection (§6)
  const activeFeatures = useMemo(() => {
    if (selectedStateFilter === 'all') {
      return {
        states: choroplethData.states,
        districts: choroplethData.districts
      };
    }
    return {
      states: choroplethData.states.filter(s => s.properties.id === selectedStateFilter),
      districts: choroplethData.districts.filter(d => d.properties.state_id === selectedStateFilter)
    };
  }, [selectedStateFilter]);

  // Setup d3 projection fit to bounding box of active features (§1)
  const mapWidth = 720;
  const mapHeight = 560;

  const { pathGenerator, projection } = useMemo(() => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [...activeFeatures.states, ...activeFeatures.districts]
    };

    const proj = geoMercator();
    // Fit size with generous 24px padding inside viewbox
    proj.fitExtent([[24, 24], [mapWidth - 24, mapHeight - 24]], featureCollection as any);
    const gen = geoPath(proj);
    return { pathGenerator: gen, projection: proj };
  }, [activeFeatures, mapWidth, mapHeight]);

  // Helper to extract metric value & band for a given district
  const getDistrictMetric = (districtId: string) => {
    const dMetrics = tradeMetrics[districtId];
    if (!dMetrics) {
      return {
        value: 50,
        gapScore: 50,
        demand: 500,
        supply: 400,
        surplus: 0,
        confidence: 80,
        tradeTitle: selectedTrade === ALL_TRADES_OPTION ? (isHi ? 'सभी व्यवसाय: अधिकतम' : 'All trades: max') : selectedTrade,
        band: SEVERITY_BANDS[2]
      };
    }

    if (selectedTrade === ALL_TRADES_OPTION) {
      const gapScore = dMetrics.maxGapScore;
      let val = gapScore;
      if (activeLayer === 'demand') val = dMetrics.overallDemand;
      if (activeLayer === 'supply') val = dMetrics.overallSupply;
      if (activeLayer === 'surplus') val = dMetrics.overallSurplus;

      const band = SEVERITY_BANDS.find(b => gapScore >= b.min && gapScore <= b.max) || SEVERITY_BANDS[2];
      return {
        value: val,
        gapScore,
        demand: dMetrics.overallDemand,
        supply: dMetrics.overallSupply,
        surplus: dMetrics.overallSurplus,
        confidence: 86,
        tradeTitle: isHi ? 'सभी व्यवसाय (अधिकतम गंभीरता)' : 'All trades (Max Severity)',
        band
      };
    }

    const tData = dMetrics.trades[selectedTrade] || {
      demand: 500,
      effectiveSupply: 400,
      gapScore: 50,
      capacitySurplusSeats: 0,
      confidence: 80,
      titleHi: selectedTrade
    };

    let val = tData.gapScore;
    if (activeLayer === 'demand') val = tData.demand;
    if (activeLayer === 'supply') val = tData.effectiveSupply;
    if (activeLayer === 'surplus') val = tData.capacitySurplusSeats;

    const band = SEVERITY_BANDS.find(b => tData.gapScore >= b.min && tData.gapScore <= b.max) || SEVERITY_BANDS[2];
    return {
      value: val,
      gapScore: tData.gapScore,
      demand: tData.demand,
      supply: tData.effectiveSupply,
      surplus: tData.capacitySurplusSeats,
      confidence: tData.confidence,
      tradeTitle: isHi && tData.titleHi ? tData.titleHi : selectedTrade,
      band
    };
  };

  // Colour-blind-safe scale generator (§4): orange-blue scale, no red/green
  const getDistrictFill = (districtId: string, isHovered: boolean, isSelected: boolean) => {
    const metric = getDistrictMetric(districtId);

    if (activeLayer === 'severity') {
      // Direct engine band colors
      return metric.band.color;
    }

    if (activeLayer === 'demand') {
      // High demand = warm orange, Moderate = amber, Balanced = sky
      if (metric.demand >= 700) return '#EA580C';
      if (metric.demand >= 500) return '#D97706';
      if (metric.demand >= 300) return '#0284C7';
      return '#38BDF8';
    }

    if (activeLayer === 'supply') {
      // High supply = sky/blue, Low supply = amber/orange
      if (metric.supply >= 500) return '#0284C7';
      if (metric.supply >= 300) return '#38BDF8';
      if (metric.supply >= 150) return '#D97706';
      return '#EA580C';
    }

    if (activeLayer === 'surplus') {
      // Surplus seats = indigo/blue, Deficit seats = amber/orange
      if (metric.surplus >= 200) return '#4338CA';
      if (metric.surplus >= 0) return '#0284C7';
      if (metric.surplus >= -300) return '#D97706';
      return '#EA580C';
    }

    return metric.band.color;
  };

  const selectedDistrictData = useMemo(() => {
    return tradeMetrics[selectedDistrict] || Object.values(tradeMetrics)[0];
  }, [selectedDistrict]);

  const selectedDistrictMetric = useMemo(() => {
    return getDistrictMetric(selectedDistrict);
  }, [selectedDistrict, selectedTrade, activeLayer]);

  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrict(districtId);
    const dMetrics = tradeMetrics[districtId];
    if (dMetrics) {
      setSelectedState(dMetrics.state);
    }
    setMobileDrawerOpen(true);
  };

  return (
    <div className="w-full space-y-4">
      {/* 1. Header Toolbar: Trade Selector, Layer Selector, State Tabs, Table Toggle */}
      <div className="p-4 rounded-3xl glass border border-[var(--border)] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Trade Dropdown & Layer Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Trade Selector (§2) */}
          <div className="flex items-center gap-2">
            <label htmlFor="map-trade-select" className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider font-mono shrink-0">
              {l('Trade:', 'व्यवसाय:')}
            </label>
            <select
              id="map-trade-select"
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="liquid-control px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--text)] border border-[var(--border)] focus:outline-hidden focus:ring-2 focus:ring-[var(--brand)] cursor-pointer"
            >
              <option value="Solar PV Installer">
                {isHi ? 'सोलर पीवी इंस्टॉलर (डिफ़ॉल्ट)' : 'Solar PV Installer (Default)'}
              </option>
              <option value={ALL_TRADES_OPTION}>
                {isHi ? 'सभी व्यवसाय: अधिकतम गंभीरता' : 'All trades: max severity'}
              </option>
              {availableTrades
                .filter(t => t !== 'Solar PV Installer')
                .map(trade => (
                  <option key={trade} value={trade}>
                    {isHi ? getLocalizedEntityName('occupations', trade, 'hi') : trade}
                  </option>
                ))}
            </select>
          </div>

          {/* Layer Selector (§3 with units) */}
          <div className="flex items-center gap-1 p-1 rounded-xl glass-strong border border-[var(--border)] max-w-full overflow-x-auto scrollbar-none">
            {MAP_LAYERS.map(layer => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap min-h-[30px] ${
                  activeLayer === layer.id
                    ? 'bg-[var(--brand)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-strong)]'
                }`}
                aria-pressed={activeLayer === layer.id}
              >
                {isHi ? layer.labelHi : layer.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Right: State Tabs & Table Toggle (§5, §6) */}
        <div className="flex items-center gap-2.5 flex-wrap justify-between lg:justify-end">
          {/* State Tabs Zoom to Fit (§6) */}
          <div className="flex items-center gap-1 p-1 rounded-xl glass-strong border border-[var(--border)] text-xs font-semibold">
            {[
              { id: 'all', labelEn: 'All States', labelHi: 'सभी राज्य' },
              { id: 'uttar_pradesh', labelEn: 'UP', labelHi: 'उ.प्र.' },
              { id: 'maharashtra', labelEn: 'MH', labelHi: 'महाराष्ट्र' },
              { id: 'karnataka', labelEn: 'KA', labelHi: 'कर्नाटक' },
              { id: 'gujarat', labelEn: 'GJ', labelHi: 'गुजरात' },
              { id: 'tamil_nadu', labelEn: 'TN', labelHi: 'तमिलनाडु' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStateFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedStateFilter === tab.id
                    ? 'bg-[var(--brand)] text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
                title={isHi ? tab.labelHi : tab.labelEn}
              >
                {isHi ? tab.labelHi : tab.labelEn}
              </button>
            ))}
          </div>

          {/* View as Table Toggle (§5) */}
          <button
            type="button"
            onClick={() => setViewMode(prev => prev === 'map' ? 'table' : 'map')}
            className="px-3 py-1.5 rounded-xl liquid-control text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[var(--border)] hover:bg-[var(--glass-strong)] transition-all"
            aria-label={viewMode === 'map' ? l('View as table', 'तालिका के रूप में देखें') : l('View as map', 'मानचित्र के रूप में देखें')}
          >
            {viewMode === 'map' ? (
              <>
                <TableIcon className="w-3.5 h-3.5 text-[var(--brand)]" />
                <span>{l('View as Table', 'तालिका देखें')}</span>
              </>
            ) : (
              <>
                <MapIcon className="w-3.5 h-3.5 text-[var(--brand)]" />
                <span>{l('View as Map', 'मानचित्र देखें')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Visual Area: SVG Choropleth vs Accessible Table */}
      {viewMode === 'map' ? (
        <div className="w-full flex flex-col xl:flex-row gap-6">
          {/* Main SVG Map Container */}
          <div 
            ref={mapContainerRef}
            className="flex-1 rounded-3xl glass p-3 sm:p-5 border border-[var(--border)] shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[460px] sm:min-h-[560px] h-[60vh] xl:h-auto"
            role="region"
            aria-label={l('Interactive India Skill Intelligence Map', 'इंटरैक्टिव भारत कौशल बुद्धिमत्ता मानचित्र')}
          >
            {/* Top Provenance Chip (§6) */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 p-1.5 px-3 rounded-xl glass-strong border border-[var(--border)] text-[11px] font-mono text-[var(--text-faint)] shadow-xs">
              <Database className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
              <span>{l('MSDE / SIH Dataset · RUN-2026-10-04-EVAL · Data through Oct 2024', 'MSDE / SIH डेटासेट · RUN-2026-10-04-EVAL · अक्टूबर 2024 तक डेटा')}</span>
            </div>

            {/* SVG Choropleth Graphic */}
            <div className="relative w-full h-full flex items-center justify-center pt-8 pb-4">
              <svg 
                viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
                className="w-full h-full max-h-[540px] select-none overflow-visible"
                aria-label="SVG Choropleth Map"
              >
                {/* Background 5 State Outlines (§1) */}
                <g className="states-outline" opacity="0.65">
                  {activeFeatures.states.map(stateFeat => {
                    const d = pathGenerator(stateFeat as any);
                    if (!d) return null;
                    return (
                      <path
                        key={stateFeat.id}
                        d={d}
                        fill={palette.surface}
                        fillOpacity="0.4"
                        stroke={palette.grid}
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                        className="transition-colors duration-200"
                      />
                    );
                  })}
                </g>

                {/* 16 District Choropleth Polygons (§1, §2) */}
                <g className="districts-choropleth">
                  {activeFeatures.districts.map(distFeat => {
                    const dId = distFeat.properties.id;
                    const pathD = pathGenerator(distFeat as any);
                    if (!pathD) return null;

                    const isHovered = hoveredDistrictId === dId;
                    const isSelected = selectedDistrict === dId;
                    const fillColor = getDistrictFill(dId, isHovered, isSelected);
                    const metric = getDistrictMetric(dId);
                    const dName = isHi ? distFeat.properties.name_hi : distFeat.properties.name;

                    // Centroid coordinates for label placement
                    const centroid = pathGenerator.centroid(distFeat as any);
                    const [cx, cy] = centroid;

                    return (
                      <g 
                        key={dId}
                        className="cursor-pointer transition-all duration-150 outline-hidden"
                        onClick={() => handleDistrictSelect(dId)}
                        onMouseEnter={() => setHoveredDistrictId(dId)}
                        onMouseLeave={() => setHoveredDistrictId(null)}
                        onFocus={() => setHoveredDistrictId(dId)}
                        onBlur={() => setHoveredDistrictId(null)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${dName}: ${metric.band.labelEn}, ${activeLayer} ${metric.value}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleDistrictSelect(dId);
                          }
                        }}
                      >
                        {/* District Polygon */}
                        <path
                          d={pathD}
                          fill={fillColor}
                          fillOpacity={isSelected ? 0.95 : isHovered ? 0.88 : 0.75}
                          stroke={isSelected ? '#FFFFFF' : isHovered ? palette.brand : palette.surface}
                          strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                          className="transition-all duration-200 hover:filter hover:drop-shadow-md"
                        />

                        {/* District Label (Hindi / English without tofu) */}
                        {Number.isFinite(cx) && Number.isFinite(cy) && (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={isSelected ? '#FFFFFF' : '#0F172A'}
                            fontSize={isSelected ? '11' : '10'}
                            fontWeight={isSelected ? '800' : '700'}
                            className="pointer-events-none drop-shadow-xs font-sans tracking-tight dark:fill-white"
                          >
                            {dName}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Floating Tooltip (§5) */}
              {hoveredDistrictId && (
                <div 
                  className="absolute bottom-4 right-4 z-20 p-3.5 rounded-2xl glass-strong border border-[var(--border)] shadow-xl max-w-xs text-xs backdrop-blur-xl animate-in fade-in duration-150 pointer-events-none"
                  role="tooltip"
                >
                  {(() => {
                    const m = getDistrictMetric(hoveredDistrictId);
                    const dInfo = tradeMetrics[hoveredDistrictId];
                    if (!dInfo) return null;
                    const displayName = isHi ? dInfo.districtNameHi : dInfo.districtName;

                    return (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-1.5">
                          <strong className="text-sm font-extrabold text-[var(--text)] font-sans">
                            {displayName}
                          </strong>
                          <span className="text-[10px] font-mono font-bold text-[var(--brand)]">
                            LGD: {dInfo.lgdCode}
                          </span>
                        </div>

                        <div className="text-[11px] text-[var(--text-muted)] font-medium">
                          {isHi ? 'चयनित व्यवसाय: ' : 'Trade: '}
                          <span className="text-[var(--text)] font-bold">{m.tradeTitle}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-1">
                          <span className="font-semibold text-[var(--text-faint)]">
                            {isHi 
                              ? MAP_LAYERS.find(l => l.id === activeLayer)?.labelHi 
                              : MAP_LAYERS.find(l => l.id === activeLayer)?.labelEn}
                          </span>
                          <span className="font-mono font-extrabold text-sm text-[var(--text)]">
                            {m.value} {activeLayer === 'severity' ? '/ 100' : ''}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border)]">
                          <span 
                            className="px-2 py-0.5 rounded-full font-bold text-[10px] text-white"
                            style={{ backgroundColor: m.band.color }}
                          >
                            {isHi ? m.band.labelHi : m.band.labelEn}
                          </span>
                          <span className="font-mono text-[var(--text-faint)]">
                            {l('Confidence: ', 'विश्वसनीयता: ')}{m.confidence}%
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Bottom Engine Band Legend Overlay (§4) */}
            <div className="absolute bottom-3 left-3 p-3 rounded-2xl glass-strong border border-[var(--border)] text-xs shadow-lg max-w-[260px] backdrop-blur-md z-10">
              <span className="font-bold text-[var(--text)] uppercase tracking-wider block text-[11px] mb-2 font-mono">
                {l('Severity Bands (Gap Score)', 'गंभीरता बैंड (अंतर स्कोर)')}
              </span>

              <div className="space-y-1.5">
                {SEVERITY_BANDS.map(band => (
                  <div key={band.code} className="flex items-center justify-between gap-2 text-[var(--text-muted)] text-[11px]">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0 shadow-2xs" 
                        style={{ backgroundColor: band.color }}
                      />
                      <span>{isHi ? band.labelHi : band.labelEn}</span>
                    </div>
                    <span className="font-mono font-bold text-[var(--text)] text-[10px]">
                      {band.min === 75 ? '≥ 75' : band.min === 0 ? '< 25' : `${band.min}–${band.max}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Selected District Side Panel (§5) */}
          <div className="w-full xl:w-96 rounded-3xl glass p-5 border border-[var(--border)] shadow-xs flex flex-col justify-between gap-4">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3 mb-3">
                <span className="text-xs font-mono font-bold text-[var(--brand)] uppercase tracking-wider">
                  {isHi ? getLocalizedEntityName('states', selectedDistrictData.state, 'hi') : selectedDistrictData.state} · LGD {selectedDistrictData.lgdCode}
                </span>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white font-mono"
                  style={{ backgroundColor: selectedDistrictMetric.band.color }}
                >
                  {isHi ? selectedDistrictMetric.band.labelHi : selectedDistrictMetric.band.labelEn}
                </span>
              </div>

              {/* District Title */}
              <h2 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">
                {isHi ? selectedDistrictData.districtNameHi : selectedDistrictData.districtName}
              </h2>
              <span className="text-xs text-[var(--text-muted)] font-medium block mt-0.5">
                {l('Selected Trade Diagnostic: ', 'चयनित व्यवसाय विश्लेषण: ')}
                <strong>{selectedDistrictMetric.tradeTitle}</strong>
              </span>

              {/* 4 Metric KPI Cards for Selected District */}
              <div className="grid grid-cols-2 gap-2.5 my-4">
                <div className="p-3 rounded-2xl glass-strong border border-[var(--border)]">
                  <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">
                    {l('Gap Score', 'अंतर स्कोर')}
                  </span>
                  <div className="text-2xl font-extrabold text-[var(--text)] font-mono">
                    {selectedDistrictMetric.gapScore}
                  </div>
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
                    {isHi ? selectedDistrictMetric.band.labelHi : selectedDistrictMetric.band.labelEn}
                  </span>
                </div>

                <div className="p-3 rounded-2xl glass-strong border border-[var(--border)]">
                  <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">
                    {l('Demand', 'मांग')}
                  </span>
                  <div className="text-2xl font-extrabold text-[var(--text)] font-mono">
                    {selectedDistrictMetric.demand}
                  </div>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono">
                    {l('Candidates', 'उम्मीदवार')}
                  </span>
                </div>

                <div className="p-3 rounded-2xl glass-strong border border-[var(--border)]">
                  <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">
                    {l('Effective Supply', 'प्रभावी आपूर्ति')}
                  </span>
                  <div className="text-2xl font-extrabold text-[var(--text)] font-mono">
                    {selectedDistrictMetric.supply}
                  </div>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono">
                    {l('Employable', 'रोजगार योग्य')}
                  </span>
                </div>

                <div className="p-3 rounded-2xl glass-strong border border-[var(--border)]">
                  <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">
                    {l('Net Balance', 'शुद्ध संतुलन')}
                  </span>
                  <div className={`text-2xl font-extrabold font-mono ${selectedDistrictMetric.surplus < 0 ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}>
                    {selectedDistrictMetric.surplus > 0 ? `+${selectedDistrictMetric.surplus}` : selectedDistrictMetric.surplus}
                  </div>
                  <span className="text-[10px] text-[var(--text-faint)] font-mono">
                    {selectedDistrictMetric.surplus < 0 ? l('Deficit Seats', 'कमी सीटें') : l('Surplus Seats', 'अधिशेष सीटें')}
                  </span>
                </div>
              </div>

              {/* Demand vs Supply Visual Bar */}
              <div className="p-3.5 rounded-2xl glass-strong border border-[var(--border)] space-y-2 mb-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--text)]">{l('Supply vs Demand Coverage', 'आपूर्ति बनाम मांग कवरेज')}</span>
                  <span className="font-mono text-[var(--brand)] font-bold">
                    {Math.round((selectedDistrictMetric.supply / Math.max(1, selectedDistrictMetric.demand)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden flex">
                  <div 
                    className="h-full bg-cyan-500 rounded-full" 
                    style={{ width: `${Math.min(100, (selectedDistrictMetric.supply / Math.max(1, selectedDistrictMetric.demand)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[var(--text-faint)] font-mono">
                  <span>{l('Supply: ', 'आपूर्ति: ')}{selectedDistrictMetric.supply}</span>
                  <span>{l('Demand: ', 'मांग: ')}{selectedDistrictMetric.demand}</span>
                </div>
              </div>
            </div>

            {/* Direct Action Links */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <Link
                href={`/scenarios?district=${selectedDistrictData.districtId}`}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--brand)] hover:opacity-95 text-white font-bold text-xs flex items-center justify-between transition-all shadow-xs"
              >
                <span>{l('Simulate District Scenarios', 'जिला परिदृश्य अनुकरण करें')}</span>
                <Sliders className="w-4 h-4" />
              </Link>

              <Link
                href={`/districts/${selectedDistrictData.districtId}`}
                className="w-full py-2.5 px-4 rounded-xl liquid-control text-[var(--text)] font-bold text-xs flex items-center justify-between border border-[var(--border)] hover:bg-[var(--glass-strong)] transition-all"
              >
                <span>{l('View District Full Profile', 'पूर्ण जिला प्रोफ़ाइल देखें')}</span>
                <ChevronRight className="w-4 h-4 text-[var(--brand)]" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Accessible Table View (§5) */
        <div className="w-full rounded-3xl glass border border-[var(--border)] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[var(--text)] font-sans">
                {l('District Intelligence Table View', 'जिला बुद्धिमत्ता तालिका दृश्य')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {l('Tabular representation of 16 districts across 5 evaluation states.', '5 मूल्यांकन राज्यों में 16 जिलों का सारणीबद्ध प्रतिनिधित्व।')}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[var(--text-faint)]">
              16 {l('Districts', 'ज़िले')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-muted)]/70 text-[var(--text-faint)] uppercase font-mono text-[10px] border-b border-[var(--border)]">
                <tr>
                  <th className="py-3 px-4">{l('District', 'ज़िला')}</th>
                  <th className="py-3 px-4">{l('State', 'राज्य')}</th>
                  <th className="py-3 px-4">{l('District LGD Code', 'जिला LGD कोड')}</th>
                  <th className="py-3 px-4">{l('Selected Trade', 'व्यवसाय')}</th>
                  <th className="py-3 px-4">{l('Gap Score', 'अंतर स्कोर')}</th>
                  <th className="py-3 px-4">{l('Demand', 'मांग')}</th>
                  <th className="py-3 px-4">{l('Supply', 'आपूर्ति')}</th>
                  <th className="py-3 px-4">{l('Net Balance', 'संतुलन')}</th>
                  <th className="py-3 px-4">{l('Severity Band', 'गंभीरता बैंड')}</th>
                  <th className="py-3 px-4 text-right">{l('Action', 'कार्रवाई')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {Object.values(tradeMetrics).map(d => {
                  const m = getDistrictMetric(d.districtId);
                  const isSelected = selectedDistrict === d.districtId;

                  return (
                    <tr 
                      key={d.districtId} 
                      className={`hover:bg-[var(--glass-strong)] transition-colors cursor-pointer ${isSelected ? 'bg-[var(--brand)]/10' : ''}`}
                      onClick={() => handleDistrictSelect(d.districtId)}
                    >
                      <td className="py-3 px-4 font-bold text-[var(--text)]">
                        {isHi ? d.districtNameHi : d.districtName}
                      </td>
                      <td className="py-3 px-4 text-[var(--text-muted)]">
                        {isHi ? getLocalizedEntityName('states', d.state, 'hi') : d.state}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[var(--text-faint)]">
                        {d.lgdCode}
                      </td>
                      <td className="py-3 px-4 text-[var(--text)] font-medium">
                        {m.tradeTitle}
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-[var(--text)]">
                        {m.gapScore} / 100
                      </td>
                      <td className="py-3 px-4 font-mono text-[var(--text-muted)]">
                        {m.demand}
                      </td>
                      <td className="py-3 px-4 font-mono text-[var(--text-muted)]">
                        {m.supply}
                      </td>
                      <td className={`py-3 px-4 font-mono font-bold ${m.surplus < 0 ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {m.surplus > 0 ? `+${m.surplus}` : m.surplus}
                      </td>
                      <td className="py-3 px-4">
                        <span 
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white font-mono"
                          style={{ backgroundColor: m.band.color }}
                        >
                          {isHi ? m.band.labelHi : m.band.labelEn}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/districts/${d.districtId}`}
                          className="px-2.5 py-1 rounded-lg liquid-control text-xs font-bold text-[var(--brand)] inline-flex items-center gap-1 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>{l('Profile', 'प्रोफ़ाइल')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Mobile Bottom Sheet for District Details (§6) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs xl:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[var(--surface-solid)] text-[var(--text)] rounded-t-3xl border-t border-[var(--border)] p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[var(--brand)] uppercase">
                  {isHi ? getLocalizedEntityName('states', selectedDistrictData.state, 'hi') : selectedDistrictData.state} · LGD {selectedDistrictData.lgdCode}
                </span>
                <h3 className="text-xl font-extrabold text-[var(--text)]">
                  {isHi ? selectedDistrictData.districtNameHi : selectedDistrictData.districtName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-[var(--surface-muted)] cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5 text-[var(--text-faint)]" />
              </button>
            </div>

            {/* Mobile Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">
                  {l('Gap Score', 'अंतर स्कोर')}
                </span>
                <span className="text-xl font-extrabold text-[var(--text)] font-mono">
                  {selectedDistrictMetric.gapScore}
                </span>
              </div>
              <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase block">
                  {l('Net Balance', 'शुद्ध संतुलन')}
                </span>
                <span className={`text-xl font-extrabold font-mono ${selectedDistrictMetric.surplus < 0 ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {selectedDistrictMetric.surplus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Link
                href={`/districts/${selectedDistrictData.districtId}`}
                className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] text-white text-center font-bold text-xs shadow-xs"
              >
                {l('Open District Profile', 'जिला प्रोफ़ाइल खोलें')}
              </Link>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="py-2.5 px-4 rounded-xl liquid-control border border-[var(--border)] font-bold text-xs"
              >
                {l('Close', 'बंद करें')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
