'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { geoMercator, geoPath } from 'd3-geo';
import { useTheme } from 'next-themes';
import { useApp } from '@/lib/store';
import { useChartPalette } from '@/lib/useChartPalette';
import { 
  Database,
  Table as TableIcon,
  Map as MapIcon,
  Sliders,
  ExternalLink,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  LocateFixed,
  Navigation,
  Crosshair,
  Info
} from 'lucide-react';
import { SEVERITY_BANDS } from '@/lib/types';
import { getLocalizedEntityName, Language } from '@/lib/i18n';
import indiaStatesAllRaw from '@/data/india_states_all.json';
import choroplethDataRaw from '@/data/india_choropleth.json';
import tradeMetricsRaw from '@/data/trade_district_metrics.json';

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

export const LAYER_LABELS: Record<MapLayer, Record<Language, string>> = {
  severity: { en: 'Severity', hi: 'गंभीरता', mr: 'तीव्रता', ta: 'தீவிரம்', te: 'తీవ్రత', kn: 'ತೀವ್ರತೆ', bn: 'তীব্রতা' },
  demand: { en: 'Demand', hi: 'मांग', mr: 'मागणी', ta: 'தேவை', te: 'డిమాండ్', kn: 'ಬೇಡಿಕೆ', bn: 'চাহিদা' },
  supply: { en: 'Effective Supply', hi: 'प्रभावी आपूर्ति', mr: 'प्रभावी पुरवठा', ta: 'செயல்திறன் வழங்கல்', te: 'సమర్థవంతమైన సరఫரா', kn: 'ಪರಿಣಾಮಕಾರಿ ಪೂರೈಕೆ', bn: 'কার্যকর সরবরাহ' },
  surplus: { en: 'Capacity Surplus', hi: 'क्षमता अधिशेष', mr: 'क्षमता अधिशेष', ta: 'திறன் உபரி', te: 'సామర్థ్య మిగులు', kn: 'ಸಾಮರ್ಥ್ಯ ಹೆಚ್ಚುವರಿ', bn: 'সক্ষমता উদ্বৃত্ত' }
};

export const STATE_TAB_LABELS: Record<string, Record<Language, string>> = {
  all: { en: 'All States', hi: 'सभी राज्य', mr: 'सर्व राज्ये', ta: 'அனைத்து மாநிலங்களும்', te: 'అన్ని రాష్ట్రాలు', kn: 'ಎಲ್ಲಾ ರಾಜ್ಯಗಳು', bn: 'সব राज्य' },
  uttar_pradesh: { en: 'UP', hi: 'उ.प्र.', mr: 'उ.प्र.', ta: 'உ.பி.', te: 'యు.పి.', kn: 'ಯು.ಪಿ.', bn: 'ইউ.পি.' },
  maharashtra: { en: 'MH', hi: 'महाराष्ट्र', mr: 'महाराष्ट्र', ta: 'மகாராஷ்டிரா', te: 'మహారాష్ట్ర', kn: 'ಮಹಾರಾಷ್ಟ್ರ', bn: 'মহারাষ্ট্র' },
  karnataka: { en: 'KA', hi: 'कर्नाटक', mr: 'कर्नाटक', ta: 'கர்நாடகா', te: 'కర్ణాటక', kn: 'ಕರ್ನಾಟಕ', bn: 'কর্ণাটক' },
  gujarat: { en: 'GJ', hi: 'गुजरात', mr: 'गुजरात', ta: 'குஜராத்', te: 'గుజరాత్', kn: 'ಗುಜರಾತ್', bn: 'ગુજરાત' },
  tamil_nadu: { en: 'TN', hi: 'तमिलनाडु', mr: 'तमिळनाडू', ta: 'தமிழ்நாடு', te: 'తమిళనాడు', kn: 'ತಮಿಳುನಾಡು', bn: 'তামিলநாডু' }
};

export const ALL_TRADES_OPTION = '__all_trades__';

const STATE_ID_TO_NAME: Record<string, string> = {
  uttar_pradesh: 'Uttar Pradesh',
  maharashtra: 'Maharashtra',
  karnataka: 'Karnataka',
  gujarat: 'Gujarat',
  tamil_nadu: 'Tamil Nadu'
};

const EVAL_STATE_NAMES = new Set([
  'Uttar Pradesh',
  'Maharashtra',
  'Karnataka',
  'Gujarat',
  'Tamil Nadu'
]);

const indiaStatesAll = indiaStatesAllRaw as {
  type: string;
  features: Array<{
    type: string;
    properties: { st_nm: string; st_code?: string };
    geometry: any;
  }>;
};

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

// Districts allowed to display static labels to prevent overlapping
const PRIMARY_LABEL_DISTRICTS = new Set([
  'gorakhpur',
  'varanasi',
  'pune',
  'nagpur',
  'bengaluru_urban',
  'coimbatore',
  'ahmedabad'
]);

export const IndiaIntelligenceMap: React.FC = () => {
  const { selectedDistrict, setSelectedDistrict, setSelectedState, language, l, forecastHorizon } = useApp();
  const [activeLayer, setActiveLayer] = useState<MapLayer>('severity');
  const [selectedTrade, setSelectedTrade] = useState<string>('Solar PV Installer');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [hoveredStateName, setHoveredStateName] = useState<string | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Controlled Zoom & Pan Engine State (1.0x to 3.2x strictly clamped)
  const [scale, setScale] = useState<number>(1);
  const [translateX, setTranslateX] = useState<number>(0);
  const [translateY, setTranslateY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Synchronized refs for wheel and pointer handlers
  const scaleRef = useRef<number>(1);
  const txRef = useRef<number>(0);
  const tyRef = useRef<number>(0);

  useEffect(() => {
    scaleRef.current = scale;
    txRef.current = translateX;
    tyRef.current = translateY;
  }, [scale, translateX, translateY]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startTx: number; startTy: number; didMove: boolean }>({
    clientX: 0,
    clientY: 0,
    startTx: 0,
    startTy: 0,
    didMove: false
  });

  const palette = useChartPalette();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const availableTrades = useMemo(() => {
    const firstDist = Object.values(tradeMetrics)[0];
    if (!firstDist) return ['Solar PV Installer'];
    return Object.keys(firstDist.trades);
  }, []);

  const mapWidth = 720;
  const mapHeight = 580;

  // Stable Mercator projection fitted to all 36 Indian states with ample margin for western Gujarat
  const { pathGenerator } = useMemo(() => {
    const proj = geoMercator();
    proj.fitExtent([[44, 20], [mapWidth - 28, mapHeight - 20]], indiaStatesAll as any);
    const gen = geoPath(proj);
    return { pathGenerator: gen, projection: proj };
  }, [mapWidth, mapHeight]);

  // Pan Bounds Clamping Function: Guarantees India never gets dragged outside the viewport
  const clampPan = useCallback((tx: number, ty: number, currentScale: number) => {
    if (currentScale <= 1.05) {
      return { x: 0, y: 0 };
    }
    const maxDeltaX = ((mapWidth * (currentScale - 1)) / 2) + 24;
    const maxDeltaY = ((mapHeight * (currentScale - 1)) / 2) + 24;

    return {
      x: Math.max(-maxDeltaX, Math.min(maxDeltaX, tx)),
      y: Math.max(-maxDeltaY, Math.min(maxDeltaY, ty))
    };
  }, [mapWidth, mapHeight]);

  const getDistrictMetric = useCallback((districtId: string) => {
    const dMetrics = tradeMetrics[districtId];
    const horizonMultiplier = forecastHorizon === '3M' ? 0.94 : forecastHorizon === '12M' ? 1.20 : 1.0;
    const supplyMultiplier = forecastHorizon === '3M' ? 1.08 : forecastHorizon === '12M' ? 0.92 : 1.0;

    if (!dMetrics) {
      return {
        value: 50,
        gapScore: 50,
        demand: Math.round(500 * horizonMultiplier),
        supply: Math.round(400 * supplyMultiplier),
        surplus: Math.round(400 * supplyMultiplier) - Math.round(500 * horizonMultiplier),
        confidence: 80,
        tradeTitle: selectedTrade === ALL_TRADES_OPTION ? l('All trades: max', 'सभी व्यवसाय: अधिकतम') : selectedTrade,
        band: SEVERITY_BANDS[2]
      };
    }

    if (selectedTrade === ALL_TRADES_OPTION) {
      const gapScore = Math.max(10, Math.min(99, Math.round(
        forecastHorizon === '3M' ? dMetrics.maxGapScore - 4 : forecastHorizon === '12M' ? dMetrics.maxGapScore + 5 : dMetrics.maxGapScore
      )));
      const demand = Math.round(dMetrics.overallDemand * horizonMultiplier);
      const supply = Math.round(dMetrics.overallSupply * supplyMultiplier);
      const surplus = supply - demand;
      let val = gapScore;
      if (activeLayer === 'demand') val = demand;
      if (activeLayer === 'supply') val = supply;
      if (activeLayer === 'surplus') val = surplus;

      const band = SEVERITY_BANDS.find(b => gapScore >= b.min && gapScore <= b.max) || SEVERITY_BANDS[2];
      return {
        value: val,
        gapScore,
        demand,
        supply,
        surplus,
        confidence: 86,
        tradeTitle: language === 'en' ? 'All trades (Max Severity)' : l('All trades: max severity', 'सभी व्यवसाय (अधिकतम गंभीरता)'),
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

    const demand = Math.round(tData.demand * horizonMultiplier);
    const supply = Math.round(tData.effectiveSupply * supplyMultiplier);
    const surplus = supply - demand;
    const gapScore = Math.max(10, Math.min(99, Math.round(
      forecastHorizon === '3M' ? tData.gapScore - 4 : forecastHorizon === '12M' ? tData.gapScore + 5 : tData.gapScore
    )));

    let val = gapScore;
    if (activeLayer === 'demand') val = demand;
    if (activeLayer === 'supply') val = supply;
    if (activeLayer === 'surplus') val = surplus;

    const band = SEVERITY_BANDS.find(b => gapScore >= b.min && gapScore <= b.max) || SEVERITY_BANDS[2];
    return {
      value: val,
      gapScore,
      demand,
      supply,
      surplus,
      confidence: tData.confidence,
      tradeTitle: language === 'en' ? selectedTrade : getLocalizedEntityName('occupations', selectedTrade, language, tData.titleHi || selectedTrade),
      band
    };
  }, [activeLayer, selectedTrade, language, l, forecastHorizon]);

  const getDistrictFill = useCallback((districtId: string, isHovered: boolean, isSelected: boolean) => {
    const metric = getDistrictMetric(districtId);

    if (activeLayer === 'severity') {
      return metric.band.color;
    }

    if (activeLayer === 'demand') {
      if (metric.demand >= 700) return '#EA580C';
      if (metric.demand >= 500) return '#D97706';
      if (metric.demand >= 300) return '#0284C7';
      return '#38BDF8';
    }

    if (activeLayer === 'supply') {
      if (metric.supply >= 500) return '#0284C7';
      if (metric.supply >= 300) return '#38BDF8';
      if (metric.supply >= 150) return '#D97706';
      return '#EA580C';
    }

    if (activeLayer === 'surplus') {
      if (metric.surplus >= 200) return '#4338CA';
      if (metric.surplus >= 0) return '#0284C7';
      if (metric.surplus >= -300) return '#D97706';
      return '#EA580C';
    }

    return metric.band.color;
  }, [activeLayer, getDistrictMetric]);

  const selectedDistrictData = useMemo(() => {
    return tradeMetrics[selectedDistrict] || Object.values(tradeMetrics)[0];
  }, [selectedDistrict]);

  const selectedDistrictMetric = useMemo(() => {
    return getDistrictMetric(selectedDistrict);
  }, [selectedDistrict, getDistrictMetric]);

  // Programmatic smooth zoom to geometry bounding box (clamped between 1.0 and 3.0)
  const zoomToGeometry = useCallback((geometry: any, padding = 40, maxZoom = 2.8) => {
    const bounds = pathGenerator.bounds(geometry);
    if (!bounds || isNaN(bounds[0][0])) return;

    const [[x0, y0], [x1, y1]] = bounds;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;

    if (dx <= 0 || dy <= 0) return;

    const targetScale = Math.min(maxZoom, Math.max(1.15, 0.76 / Math.max(dx / mapWidth, dy / mapHeight)));
    const targetTx = (mapWidth / 2) - cx * targetScale;
    const targetTy = (mapHeight / 2) - cy * targetScale;
    const clamped = clampPan(targetTx, targetTy, targetScale);

    setIsAnimating(true);
    setScale(targetScale);
    setTranslateX(clamped.x);
    setTranslateY(clamped.y);
    setTimeout(() => setIsAnimating(false), 420);
  }, [pathGenerator, mapWidth, mapHeight, clampPan]);

  // Handle District Selection with Click-to-Zoom
  const handleDistrictSelect = useCallback((districtId: string, skipZoom = false) => {
    setSelectedDistrict(districtId);
    const dMetrics = tradeMetrics[districtId];
    if (dMetrics) {
      setSelectedState(dMetrics.state);
    }
    setMobileDrawerOpen(true);

    if (!skipZoom) {
      const distFeat = choroplethData.districts.find(d => d.properties.id === districtId);
      if (distFeat) {
        zoomToGeometry(distFeat, 40, 2.9);
      }
    }
  }, [setSelectedDistrict, setSelectedState, zoomToGeometry]);

  // Handle State Filter Tab Selection with Auto-Zoom / Auto-Zoom-Out
  const handleStateFilterTab = useCallback((tabId: string) => {
    setSelectedStateFilter(tabId);

    if (tabId === 'all') {
      setSelectedState('All');
      setIsAnimating(true);
      setScale(1.0);
      setTranslateX(0);
      setTranslateY(0);
      setTimeout(() => setIsAnimating(false), 420);
      return;
    }

    const targetName = STATE_ID_TO_NAME[tabId];
    if (targetName) {
      setSelectedState(targetName);
      const stateFeat = indiaStatesAll.features.find(s => s.properties.st_nm === targetName);
      if (stateFeat) {
        zoomToGeometry(stateFeat, 30, 2.6);
      }
    }
  }, [setSelectedState, zoomToGeometry]);

  // Floating Controls Handlers
  const handleZoomIn = useCallback(() => {
    setIsAnimating(true);
    const currentScale = scaleRef.current;
    const nextScale = Math.min(3.2, currentScale + 0.35);
    const centerFactor = nextScale / currentScale;
    const rawTx = (mapWidth / 2) - ((mapWidth / 2) - txRef.current) * centerFactor;
    const rawTy = (mapHeight / 2) - ((mapHeight / 2) - tyRef.current) * centerFactor;
    const clamped = clampPan(rawTx, rawTy, nextScale);

    setScale(nextScale);
    setTranslateX(clamped.x);
    setTranslateY(clamped.y);
    setTimeout(() => setIsAnimating(false), 300);
  }, [mapWidth, mapHeight, clampPan]);

  const handleZoomOut = useCallback(() => {
    setIsAnimating(true);
    const currentScale = scaleRef.current;
    const nextScale = Math.max(1.0, currentScale - 0.35);

    if (nextScale <= 1.02) {
      setScale(1.0);
      setTranslateX(0);
      setTranslateY(0);
    } else {
      const centerFactor = nextScale / currentScale;
      const rawTx = (mapWidth / 2) - ((mapWidth / 2) - txRef.current) * centerFactor;
      const rawTy = (mapHeight / 2) - ((mapHeight / 2) - tyRef.current) * centerFactor;
      const clamped = clampPan(rawTx, rawTy, nextScale);
      setScale(nextScale);
      setTranslateX(clamped.x);
      setTranslateY(clamped.y);
    }
    setTimeout(() => setIsAnimating(false), 300);
  }, [mapWidth, mapHeight, clampPan]);

  const handleReset = useCallback(() => {
    setSelectedStateFilter('all');
    setSelectedState('All');
    setIsAnimating(true);
    setScale(1.0);
    setTranslateX(0);
    setTranslateY(0);
    setTimeout(() => setIsAnimating(false), 420);
  }, [setSelectedState]);

  const handleCenterSelectedDistrict = useCallback(() => {
    const distFeat = choroplethData.districts.find(d => d.properties.id === selectedDistrict);
    if (distFeat) {
      zoomToGeometry(distFeat, 40, 2.9);
    }
  }, [selectedDistrict, zoomToGeometry]);

  // Double Click to Zoom In gently at cursor position
  const handleDoubleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const currentScale = scaleRef.current;
    const currentTx = txRef.current;
    const currentTy = tyRef.current;

    const svgX = (clickX - currentTx) / currentScale;
    const svgY = (clickY - currentTy) / currentScale;

    const nextScale = Math.min(3.2, currentScale + 0.4);
    if (nextScale === currentScale) return;

    const rawTx = clickX - svgX * nextScale;
    const rawTy = clickY - svgY * nextScale;
    const clamped = clampPan(rawTx, rawTy, nextScale);

    setIsAnimating(true);
    setScale(nextScale);
    setTranslateX(clamped.x);
    setTranslateY(clamped.y);
    setTimeout(() => setIsAnimating(false), 350);
  }, [clampPan]);

  // Controlled, gentle mouse wheel zoom: always clamped between 1.0 and 3.2, never lost outside India
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;

      const currentScale = scaleRef.current;
      const currentTx = txRef.current;
      const currentTy = tyRef.current;

      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      const nextScale = Math.min(3.2, Math.max(1.0, currentScale + delta));

      if (Math.abs(nextScale - currentScale) < 0.001) return;

      if (nextScale <= 1.02) {
        setScale(1.0);
        setTranslateX(0);
        setTranslateY(0);
        return;
      }

      const svgX = (pointerX - currentTx) / currentScale;
      const svgY = (pointerY - currentTy) / currentScale;

      const rawTx = pointerX - svgX * nextScale;
      const rawTy = pointerY - svgY * nextScale;
      const clamped = clampPan(rawTx, rawTy, nextScale);

      setScale(nextScale);
      setTranslateX(clamped.x);
      setTranslateY(clamped.y);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [clampPan]);

  // Robust HTML5 Pointer Events Drag Engine (Desktop mouse + Mobile touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    // Never capture or drag when clicking buttons, inputs, selects, or interactive controls
    if ((e.target as HTMLElement)?.closest('button, select, input, a, [role="button"]')) {
      return;
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startTx: txRef.current,
      startTy: tyRef.current,
      didMove: false
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;

    if (Math.hypot(dx, dy) > 4) {
      dragStartRef.current.didMove = true;
    }

    const rawTx = dragStartRef.current.startTx + dx;
    const rawTy = dragStartRef.current.startTy + dy;
    const clamped = clampPan(rawTx, rawTy, scaleRef.current);
    setTranslateX(clamped.x);
    setTranslateY(clamped.y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
  };

  // Inverse scale factor for district label pills so they remain crisp and don't balloon at zoom
  const labelInverseScale = useMemo(() => {
    return Math.max(0.48, Math.min(1.0, 1 / Math.sqrt(scale)));
  }, [scale]);

  return (
    <div className="w-full space-y-3">
      {/* 1. Unified Toolbar: Trade Dropdown, Layer Selector, State Options Dropdown & Tabs, Table Toggle */}
      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Left: Trade Dropdown & Layer Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Trade Selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="map-trade-select" className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
              {l('Trade:', 'व्यवसाय:')}
            </label>
            <select
              id="map-trade-select"
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer max-w-[200px] truncate"
            >
              <option value="Solar PV Installer">
                {language === 'en' ? 'Solar PV Installer' : `${getLocalizedEntityName('occupations', 'Solar PV Installer', language)} (${l('Default', 'डिफ़ॉल्ट')})`}
              </option>
              <option value={ALL_TRADES_OPTION}>
                {language === 'en' ? 'All trades: max severity' : l('All trades: max severity', 'सभी व्यवसाय: अधिकतम गंभीरता')}
              </option>
              {availableTrades
                .filter(t => t !== 'Solar PV Installer')
                .map(trade => (
                  <option key={trade} value={trade}>
                    {language === 'en' ? trade : getLocalizedEntityName('occupations', trade, language)}
                  </option>
                ))}
            </select>
          </div>

          {/* Layer Selector */}
          <div className="flex items-center gap-0.5 p-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none">
            {MAP_LAYERS.map(layer => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id)}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                  activeLayer === layer.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                aria-pressed={activeLayer === layer.id}
              >
                {LAYER_LABELS[layer.id]?.[language] || layer.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Right: State Segmented Pill Bar & Table Toggle */}
        <div className="flex items-center gap-2 flex-wrap justify-between xl:justify-end">
          {/* Quick State Pill Tabs */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-0.5">
              {l('State:', 'राज्य:')}
            </span>
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs">
              {['all', 'uttar_pradesh', 'maharashtra', 'karnataka', 'gujarat', 'tamil_nadu'].map(tabId => {
                const label = STATE_TAB_LABELS[tabId]?.[language] || STATE_TAB_LABELS[tabId]?.en || tabId;
                const isActive = selectedStateFilter === tabId;
                return (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => handleStateFilterTab(tabId)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                    title={label}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* View as Table Toggle */}
          <button
            type="button"
            onClick={() => setViewMode(prev => prev === 'map' ? 'table' : 'map')}
            className="px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white/85 hover:bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_3px_rgba(15,23,42,0.05)] active:scale-[0.98]"
            aria-label={viewMode === 'map' ? l('View as table', 'तालिका के रूप में देखें') : l('View as map', 'मानचित्र के रूप में देखें')}
          >
            {viewMode === 'map' ? (
              <>
                <TableIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>{l('Table View', 'तालिका देखें')}</span>
              </>
            ) : (
              <>
                <MapIcon className="w-3.5 h-3.5 text-sky-600" />
                <span>{l('Map View', 'मानचित्र देखें')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Visual Area: Unified 12-Column Split Pane */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
          {/* Main SVG Map Canvas (8 Columns) with Pointer Events and Touch Support */}
          <div 
            ref={mapContainerRef}
            className={`lg:col-span-8 p-3 sm:p-4 bg-slate-100/70 dark:bg-slate-950/60 relative flex flex-col justify-between min-h-[460px] sm:min-h-[560px] select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            role="region"
            aria-label={l('Interactive India Skill Intelligence Map', 'इंटरैक्टिव भारत कौशल बुद्धिमत्ता मानचित्र')}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Floating Tactical Navigation HUD Controls */}
            <div 
              className="absolute top-4 right-4 z-20 flex flex-col items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-md shadow-md"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title={l('Zoom In (+)', 'ज़ूम इन (+)')}
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="min-w-[44px] text-center text-[11px] font-mono font-bold px-1 py-0.5 text-slate-700 dark:text-slate-300 tabular-nums select-none tracking-normal">
                {Math.round(scale * 100)}%
              </div>

              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title={l('Zoom Out (-)', 'ज़ूम आउट (-)')}
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <div className="w-4 h-px bg-slate-200 dark:bg-slate-800 my-0.5" />

              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title={l('Reset National View (⟲)', 'राष्ट्रीय दृश्य रीसेट करें')}
                aria-label="Reset view"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCenterSelectedDistrict();
                }}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title={l('Focus Selected District (⊙)', 'चयनित जिले पर केंद्रित करें')}
                aria-label="Focus district"
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Status / Interaction Hint Pill */}
            <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xs border border-slate-200/90 dark:border-slate-800/90 text-[11px] text-slate-500 dark:text-slate-400 shadow-xs pointer-events-none">
              <Navigation className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>{l('Drag to pan · Scroll to zoom · Select state to frame', 'पैन करने के लिए खींचें · ज़ूम करने के लिए स्क्रॉल करें · राज्य चुनने पर स्वतः केंद्रित')}</span>
            </div>

            {/* SVG Choropleth Graphic */}
            <div className="relative w-full h-full flex items-center justify-center pt-2 pb-6 overflow-hidden">
              <svg 
                ref={svgRef}
                viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
                className="w-full h-full max-h-[520px] select-none overflow-hidden"
                aria-label="SVG Choropleth Map"
                onDoubleClick={handleDoubleClick}
              >
                {/* Master Transformation Group (Constrained Zoom & Pan) */}
                <g 
                  transform={`translate(${translateX}, ${translateY}) scale(${scale})`}
                  style={{
                    transition: isAnimating ? 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
                  }}
                >
                  {/* Layer 1: Complete 36 Indian States & UTs Base Map Silhouette */}
                  <g className="all-india-states">
                    {indiaStatesAll.features.map(stFeat => {
                      const stName = stFeat.properties.st_nm;
                      const pathD = pathGenerator(stFeat as any);
                      if (!pathD) return null;

                      const isEvalState = EVAL_STATE_NAMES.has(stName);

                      return (
                        <path
                          key={stName}
                          d={pathD}
                          fill={isEvalState ? (isDark ? '#1E293B' : '#F1F5F9') : (isDark ? '#0F172A' : '#F8FAFC')}
                          fillOpacity={isEvalState ? 0.7 : 0.85}
                          stroke={isEvalState ? (isDark ? '#64748B' : '#94A3B8') : (isDark ? '#334155' : '#CBD5E1')}
                          strokeWidth={isEvalState ? 1.2 : 0.75}
                          strokeDasharray={isEvalState ? undefined : '1 1'}
                          className="transition-colors duration-150 cursor-pointer"
                          onMouseEnter={() => {
                            if (!isEvalState) setHoveredStateName(stName);
                          }}
                          onMouseLeave={() => setHoveredStateName(null)}
                          onClick={() => {
                            if (isEvalState) {
                              const tabId = Object.entries(STATE_ID_TO_NAME).find(([, name]) => name === stName)?.[0];
                              if (tabId) handleStateFilterTab(tabId);
                            }
                          }}
                        />
                      );
                    })}
                  </g>

                  {/* Layer 2: 16 Priority District Choropleth Polygons */}
                  <g className="districts-choropleth">
                    {choroplethData.districts.map(distFeat => {
                      const dId = distFeat.properties.id;
                      const pathD = pathGenerator(distFeat as any);
                      if (!pathD) return null;

                      const isHovered = hoveredDistrictId === dId;
                      const isSelected = selectedDistrict === dId;
                      const fillColor = getDistrictFill(dId, isHovered, isSelected);
                      const metric = getDistrictMetric(dId);
                      const dName = language === 'en' 
                        ? distFeat.properties.name 
                        : getLocalizedEntityName('districts', distFeat.properties.name, language, distFeat.properties.name_hi);

                      const centroid = pathGenerator.centroid(distFeat as any);
                      const cx = Math.round(centroid[0] * 10) / 10;
                      const cy = Math.round(centroid[1] * 10) / 10;

                      // Display label if selected, hovered, primary landmark, or zoomed in
                      const showLabel = isSelected || isHovered || scale > 2.0 || PRIMARY_LABEL_DISTRICTS.has(dId);

                      return (
                        <g 
                          key={dId}
                          className="cursor-pointer transition-all duration-150 outline-hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!dragStartRef.current.didMove) {
                              handleDistrictSelect(dId);
                            }
                          }}
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
                            fillOpacity={isSelected ? 0.98 : isHovered ? 0.92 : 0.85}
                            stroke={isSelected ? '#0F172A' : isHovered ? '#0284C7' : '#94A3B8'}
                            strokeWidth={isSelected ? 2.6 : isHovered ? 2.0 : 1.0}
                            className="transition-all duration-150"
                          />

                          {/* Selected District Pulse Reticle */}
                          {isSelected && !isNaN(cx) && !isNaN(cy) && (
                            <g transform={`translate(${cx}, ${cy})`} pointerEvents="none">
                              <circle
                                r={12 * labelInverseScale}
                                fill="none"
                                stroke="#0284C7"
                                strokeWidth="2"
                                opacity="0.6"
                                className="animate-ping"
                              />
                              <circle
                                r={3.5 * labelInverseScale}
                                fill="#0F172A"
                                stroke="#FFFFFF"
                                strokeWidth="1.5"
                              />
                            </g>
                          )}

                          {/* Collision-Safe District Label with Dynamic Inverse Scale */}
                          {showLabel && !isNaN(cx) && !isNaN(cy) && (
                            <g 
                              transform={`translate(${cx}, ${cy}) scale(${labelInverseScale})`} 
                              pointerEvents="none"
                            >
                              <rect
                                x={-((dName.length * 3.4) + 6)}
                                y="-9"
                                width={(dName.length * 6.8) + 12}
                                height="17"
                                rx="3"
                                fill="rgba(255, 255, 255, 0.94)"
                                stroke={isSelected ? '#0F172A' : '#CBD5E1'}
                                strokeWidth={isSelected ? 1.6 : 0.8}
                                className="dark:fill-slate-900/90 dark:stroke-slate-700"
                              />
                              <text
                                x="0"
                                y="3.2"
                                textAnchor="middle"
                                fontSize="9.5"
                                fontWeight={isSelected ? '700' : '500'}
                                fill={isSelected ? '#0F172A' : '#334155'}
                                className="dark:fill-slate-100"
                                fontFamily="inherit"
                              >
                                {dName}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </g>
              </svg>

              {/* Hover Tooltip Overlay for Districts */}
              {hoveredDistrictId && (
                <div 
                  className="absolute pointer-events-none z-30 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-2.5 rounded-md shadow-md text-xs space-y-1 min-w-[190px] animate-in fade-in duration-100"
                  style={{ top: '16px', right: '56px' }}
                >
                  {(() => {
                    const d = tradeMetrics[hoveredDistrictId];
                    if (!d) return null;
                    const m = getDistrictMetric(hoveredDistrictId);
                    const dName = language === 'en' ? d.districtName : getLocalizedEntityName('districts', d.districtName, language, d.districtNameHi);
                    const sName = getLocalizedEntityName('states', d.state, language, d.state);

                    return (
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1 mb-1">
                          <span>{dName}</span>
                          <span className="text-[10px] text-slate-400">{sName} · LGD {d.lgdCode}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {m.tradeTitle}
                        </div>
                        <div className="flex justify-between items-center text-xs pt-1 font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          <span>{LAYER_LABELS[activeLayer]?.[language] || activeLayer}</span>
                          <span>{m.value}</span>
                        </div>
                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span 
                            className="px-1.5 py-0.5 rounded text-[9px] font-semibold text-white"
                            style={{ backgroundColor: m.band.color }}
                          >
                            {getLocalizedEntityName('severityBands', m.band.labelEn, language, m.band.labelEn)}
                          </span>
                          <span className="text-sky-600 dark:text-sky-400 font-medium">{l('Click to focus', 'केंद्रित करने हेतु क्लिक करें')}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Hover Tooltip Overlay for Baseline States */}
              {!hoveredDistrictId && hoveredStateName && (
                <div 
                  className="absolute pointer-events-none z-30 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-md shadow-md text-xs space-y-0.5 animate-in fade-in duration-100"
                  style={{ top: '16px', right: '56px' }}
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {hoveredStateName}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Info className="w-3 h-3 text-slate-400" />
                    <span>{l('National Baseline · Expansion Phase', 'राष्ट्रीय आधार रेखा · विस्तार चरण')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Dedicated Non-Overlapping Glass Footer Bar */}
            <div className="mt-auto pt-2.5 pb-1 px-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md rounded-b-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 z-10">
              {/* Bottom Left Provenance Caption */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>{l('MSDE Labour Intelligence · RUN-2026-10-04-EVAL · Data through Oct 2024', 'MSDE श्रम बुद्धिमत्ता · RUN-2026-10-04-EVAL · अक्टूबर 2024 तक डेटा')}</span>
              </div>

              {/* Engine Band Legend Inline */}
              <div className="flex items-center gap-2.5 text-[10px] flex-wrap">
                {SEVERITY_BANDS.map(band => (
                  <div key={band.code} className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                      style={{ backgroundColor: band.color }}
                    />
                    <span>{getLocalizedEntityName('severityBands', band.labelEn, language)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Selected District Side Panel (4 Columns) with guaranteed visible unclipped metrics and buttons */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between h-full min-h-[460px] sm:min-h-[560px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-md overflow-hidden">
            <div className="overflow-y-auto overflow-x-hidden pr-0.5 scrollbar-thin space-y-3 flex-1 min-h-0">
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                  {getLocalizedEntityName('states', selectedDistrictData.state, language, selectedDistrictData.state)} · LGD {selectedDistrictData.lgdCode}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span 
                    className="px-2 py-0.5 rounded text-[11px] font-semibold text-white shadow-xs"
                    style={{ backgroundColor: selectedDistrictMetric.band.color }}
                  >
                    {getLocalizedEntityName('severityBands', selectedDistrictMetric.band.labelEn, language, selectedDistrictMetric.band.labelEn)}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                    {forecastHorizon}
                  </span>
                </div>
              </div>

              {/* District Title */}
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {language === 'en' ? selectedDistrictData.districtName : getLocalizedEntityName('districts', selectedDistrictData.districtName, language, selectedDistrictData.districtNameHi)}
                </h2>
                <button
                  type="button"
                  onClick={handleCenterSelectedDistrict}
                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                  title={l('Center on map', 'मानचित्र पर केंद्रित करें')}
                >
                  <LocateFixed className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                </button>
              </div>

              <span className="text-xs text-slate-500 font-medium block truncate">
                {l('Selected Trade: ', 'चयनित व्यवसाय: ')}
                <strong className="text-slate-800 dark:text-slate-200">{selectedDistrictMetric.tradeTitle}</strong>
              </span>

              {/* 4 Metric Divided Grid - Boxed card with ZERO negative margins (no clipping, no scrollbar!) */}
              <div className="grid grid-cols-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden divide-x divide-y divide-slate-200/80 dark:divide-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70 shadow-2xs">
                <div className="p-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                    {l('Gap Score', 'अंतर स्कोर')}
                  </span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                    {selectedDistrictMetric.gapScore}
                  </div>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium truncate block">
                    {getLocalizedEntityName('severityBands', selectedDistrictMetric.band.labelEn, language, selectedDistrictMetric.band.labelEn)}
                  </span>
                </div>

                <div className="p-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                    {l('Demand', 'मांग')}
                  </span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                    {selectedDistrictMetric.demand}
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {l('Candidates', 'उम्मीदवार')}
                  </span>
                </div>

                <div className="p-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                    {l('Effective Supply', 'प्रभावी आपूर्ति')}
                  </span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                    {selectedDistrictMetric.supply}
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {l('Employable', 'रोजगार योग्य')}
                  </span>
                </div>

                <div className="p-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                    {l('Net Balance', 'शुद्ध संतुलन')}
                  </span>
                  <div className={`text-2xl font-bold tabular-nums mt-0.5 ${selectedDistrictMetric.surplus < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {selectedDistrictMetric.surplus > 0 ? `+${selectedDistrictMetric.surplus}` : selectedDistrictMetric.surplus}
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {selectedDistrictMetric.surplus < 0 ? l('Deficit Seats', 'कमी सीटें') : l('Surplus Seats', 'अधिशेष सीटें')}
                  </span>
                </div>
              </div>

              {/* Demand vs Supply Visual Bar */}
              <div className="p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600 dark:text-slate-400">{l('Supply vs Demand Coverage', 'आपूर्ति बनाम मांग कवरेज')}</span>
                  <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    {Math.round((selectedDistrictMetric.supply / Math.max(1, selectedDistrictMetric.demand)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                  <div 
                    className="h-full bg-slate-800 dark:bg-slate-200 rounded-full" 
                    style={{ width: `${Math.min(100, (selectedDistrictMetric.supply / Math.max(1, selectedDistrictMetric.demand)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{l('Supply: ', 'आपूर्ति: ')}{selectedDistrictMetric.supply}</span>
                  <span>{l('Demand: ', 'मांग: ')}{selectedDistrictMetric.demand}</span>
                </div>
              </div>
            </div>

            {/* Direct Action Links - Always visible, unclipped, synchronized */}
            <div className="shrink-0 space-y-2 pt-3 mt-2 border-t border-slate-200/80 dark:border-slate-800/80">
              <Link
                id="btn-simulate-district-scenarios"
                href={`/scenarios?district=${selectedDistrictData.districtId}`}
                onClick={() => {
                  setSelectedDistrict(selectedDistrictData.districtId);
                  setSelectedState(selectedDistrictData.state);
                }}
                className="btn-liquid-primary w-full py-2.5 px-3.5 rounded-xl font-semibold text-xs flex items-center justify-between transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              >
                <span>{l('Simulate District Scenarios', 'जिला परिदृश्य अनुकरण करें')}</span>
                <Sliders className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              </Link>

              <Link
                id="btn-view-district-profile"
                href={`/districts/${selectedDistrictData.districtId}`}
                onClick={() => {
                  setSelectedDistrict(selectedDistrictData.districtId);
                  setSelectedState(selectedDistrictData.state);
                }}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 hover:bg-white text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-between transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              >
                <span>{l('View District Full Profile', 'पूर्ण जिला प्रोफ़ाइल देखें')}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Accessible Table View */
        <div className="w-full rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_4px_24px_-4px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="p-4 border-b border-slate-200/70 bg-white/40 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {l('District Intelligence Table View', 'जिला बुद्धिमत्ता तालिका दृश्य')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {l('Tabular representation of 16 districts across 5 evaluation states.', '5 मूल्यांकन राज्यों में 16 जिलों का सारणीबद्ध प्रतिनिधित्व।')}
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              16 {l('Districts', 'ज़िले')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">{l('District', 'ज़िला')}</th>
                  <th className="py-2.5 px-3">{l('State', 'राज्य')}</th>
                  <th className="py-2.5 px-3">{l('District LGD Code', 'जिला LGD कोड')}</th>
                  <th className="py-2.5 px-3">{l('Selected Trade', 'व्यवसाय')}</th>
                  <th className="py-2.5 px-3">{l('Gap Score', 'अंतर स्कोर')}</th>
                  <th className="py-2.5 px-3">{l('Demand', 'मांग')}</th>
                  <th className="py-2.5 px-3">{l('Supply', 'आपूर्ति')}</th>
                  <th className="py-2.5 px-3">{l('Net Balance', 'संतुलन')}</th>
                  <th className="py-2.5 px-3">{l('Severity Band', 'गंभीरता बैंड')}</th>
                  <th className="py-2.5 px-3 text-right">{l('Action', 'कार्रवाई')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {Object.values(tradeMetrics).map(d => {
                  const m = getDistrictMetric(d.districtId);
                  const isSelected = selectedDistrict === d.districtId;

                  return (
                    <tr 
                      key={d.districtId} 
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${isSelected ? 'bg-slate-100/70 dark:bg-slate-800/70' : ''}`}
                      onClick={() => handleDistrictSelect(d.districtId, true)}
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {getLocalizedEntityName('districts', d.districtName, language, d.districtNameHi)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {getLocalizedEntityName('states', d.state, language, d.state)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 tabular-nums">
                        {d.lgdCode}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                        {m.tradeTitle}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {m.gapScore}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 tabular-nums">
                        {m.demand}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 tabular-nums">
                        {m.supply}
                      </td>
                      <td className={`py-2.5 px-3 font-semibold tabular-nums ${m.surplus < 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {m.surplus > 0 ? `+${m.surplus}` : m.surplus}
                      </td>
                      <td className="py-2.5 px-3">
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                          style={{ backgroundColor: m.band.color }}
                        >
                          {getLocalizedEntityName('severityBands', m.band.labelEn, language, m.band.labelEn)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          href={`/districts/${d.districtId}`}
                          className="px-2 py-0.5 rounded text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:underline inline-flex items-center gap-1"
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

      {/* 4. Mobile Bottom Sheet for District Details */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 xl:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-t-xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  {language === 'en' ? selectedDistrictData.state : getLocalizedEntityName('states', selectedDistrictData.state, language)} · LGD {selectedDistrictData.lgdCode}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'en' ? selectedDistrictData.districtName : getLocalizedEntityName('districts', selectedDistrictData.districtName, language, selectedDistrictData.districtNameHi)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-500"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  {l('Gap Score', 'अंतर स्कोर')}
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {selectedDistrictMetric.gapScore}
                </span>
              </div>
              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  {l('Net Balance', 'शुद्ध संतुलन')}
                </span>
                <span className={`text-xl font-bold tabular-nums ${selectedDistrictMetric.surplus < 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {selectedDistrictMetric.surplus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Link
                href={`/districts/${selectedDistrictData.districtId}`}
                className="btn-liquid-primary flex-1 py-2 rounded-xl text-center font-semibold text-xs transition-colors shadow-xs"
              >
                {l('Open District Profile', 'जिला प्रोफ़ाइल खोलें')}
              </Link>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="py-2 px-4 rounded-md border border-slate-200 dark:border-slate-700 font-medium text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
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
