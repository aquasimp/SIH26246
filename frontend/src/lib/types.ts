export type ForecastHorizon = '3M' | '6M' | '12M';
export type GapSeverity = 'Severe Shortage' | 'Moderate Shortage' | 'Balanced' | 'Moderate Oversupply' | 'Severe Oversupply';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertType = 
  | 'emerging_shortage' 
  | 'emerging_oversupply' 
  | 'saturation_risk' 
  | 'capacity_inefficiency'
  | 'persistent_shortage'
  | 'emerging_occupation' 
  | 'geographic_imbalance' 
  | 'skill_obsolescence';

export interface StagedSupply {
  trainingSeats: number;
  enrolled: number;
  certified: number;
  availableLabour: number;
  effectiveEmployableSupply: number;
  seatUtilizationRate: number; // e.g. 0.92
  certificationRate: number;    // e.g. 0.88
  laborParticipationRate: number; // e.g. 0.82
  employabilityFactor: number;  // e.g. 0.78
}

export interface TimePoint {
  month: string;         // '2025-01', '2026-04'
  historicalDemand?: number;
  forecastDemand?: number;
  effectiveSupply: number;
  ciLower?: number;      // 95% Confidence Interval
  ciUpper?: number;
  baselineNaive?: number;
}

export type TimeSeriesPoint = TimePoint;

export interface ExplainabilityFactor {
  name: string;
  impactPercent: number; // e.g. +31
  description: string;
  signalType: 'vacancy' | 'employer' | 'capex' | 'skill' | 'seasonality';
}

export interface Occupation {
  id: string;
  ncoCode: string;       // e.g. '7126.0101'
  title: string;         // e.g. 'Solar PV Installer'
  titleHi?: string;
  sector: string;        // e.g. 'Green Jobs & Renewable Energy'
  sectorHi?: string;
  nsqfLevel: number;     // e.g. 4
  currentDemand: number; // e.g. 820
  growthRate6M: number;  // e.g. 21.4 (percent)
  effectiveSupply: number; // e.g. 430
  gapScore: number;      // 0-100 (e.g. 84)
  severity: GapSeverity;
  shortageProbability6M: number; // 0-100 (e.g. 71)
  forecastDemand3M: number;
  forecastDemand6M: number;      // e.g. 1020
  forecastDemand12M: number;
  demandPressureIndex: number;  // 0-100 (e.g. 91)
  confidence: number;            // 0-100 (e.g. 78)
  employerCount: number;         // e.g. 46
  averageWageINR: number;        // e.g. 22500
  stagedSupply: StagedSupply;
  districtConcentrations: { district: string; state: string; demand: number }[];
  keySkills: string[];
  qualifications: string[];      // Qualification Pack IDs
  timeSeries: TimePoint[];
  historicalData: TimePoint[];
  explainability: ExplainabilityFactor[];
  whyThisScore?: {
    demandGrowth6M: number;
    supplyGrowth6M: number;
    netVelocityMismatch: number;
    localShapDrivers: { feature: string; shap_value: number; abs_impact: number; direction: string; desc: string }[];
    globalModelDrivers: { rank: number; feature: string; importance: number; desc: string }[];
  };
}

export interface District {
  id: string;            // 'gorakhpur'
  name: string;          // 'Gorakhpur'
  nameHi?: string;
  state: string;         // 'Uttar Pradesh'
  lgdCode: number;       // Local Government Directory code
  demandIndex: number;   // 0-100
  effectiveSupplyIndex: number;
  gapScore: number;      // 0-100
  shortageProbability6M: number;
  trainingCentresCount: number;
  totalTrainingSeats: number;
  topShortageTrades: string[];
  topOversuppliedTrades: string[];
  capacitySurplusTrades?: string[];
  activeEmployers: number;
  coordinates: [number, number]; // [lat, lng]
}

export interface EarlyWarningAlert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  titleHi?: string;
  geography: string;     // e.g. 'Gorakhpur, Uttar Pradesh'
  geographyHi?: string;
  occupation: string;    // 'Solar PV Installer'
  occupationHi?: string;
  ncoCode: string;
  trigger: string;
  triggerHi?: string;
  forecastHorizon: ForecastHorizon;
  confidence: number;
  recommendedAction: string;
  recommendedActionHi?: string;
  context?: string;       // e.g. 'Context, not model output: ...'
  contextHi?: string;
  wastedSeats?: number;   // e.g. 536 seats
  timestamp: string;
  acknowledged: boolean;
  datasetChip?: string;
  derivation?: string;
  metrics?: {
    demandGrowth: string;
    vacancyVolume: number;
    leadTimeDays: number;
  };
}

export interface Recommendation {
  id: string;
  rank: number;
  title: string;
  titleHi?: string;
  type: 'capacity_reallocation' | 'new_curriculum' | 'employer_partnership' | 'seat_expansion';
  fromTrade?: string;
  fromTradeHi?: string;
  fromNco?: string;
  toTrade: string;
  toTradeHi?: string;
  toNco: string;
  district: string;
  state: string;
  recommendedSeats: number;
  reason: string;
  reasonHi?: string;
  datasetChip?: string;
  derivation?: string;
  evidence: {
    demandSignal: string;
    vacancyGrowth: string;
    supplyStagnation: string;
    employerHiringTrend: string;
  };
  constraints: string;
  expectedImpact: {
    gapReductionPercent: number; // e.g. 62
    supplyCoveragePercent: number; // e.g. 14
    estimatedCostINR: number;    // e.g. 3250000 (32.5 L)
  };
  confidence: number;
  status: 'pending' | 'approved' | 'simulated';
}

export interface TradeBeforeAfter {
  title: string;
  nco: string;
  district?: string;
  seats_before: number;
  seats_after: number;
  demand_before: number;
  demand_after: number;
  supply_before: number;
  supply_after: number;
  deficit_before: number;
  deficit_after: number;
  gap_score_before: number;
  gap_score_after: number;
  severity_before: string;
  severity_after: string;
  deficit_reduction_percent?: number;
  was_shrunk?: boolean;
  requested_seats?: number;
  actual_seats_shifted?: number;
  shrink_reason?: string;
}

export interface ScenarioParams {
  occupationNco: string;
  districtId: string;
  seatShiftAmount: number;    // e.g. 500 seats shifted from oversupplied trade
  donorNco: string;           // e.g. Retail Sales Associate
  donorDistrict?: string;     // e.g. Gorakhpur
  seatPercentAdjustment: number; // -50% to +50%
  demandShockPercent: number;    // -30% to +30%
  newCentreActive: boolean;      // +150 capacity
  mobilityFactorPercent: number; // 0% to 30% inter-district supply mobility
  enforceDonorConstraint?: boolean; // LP donor safety constraint
  donorSafetyRule?: number;     // 0.05 (default, strict), 0.10 (moderate), 0.18 (permissive)
}

export interface SensitivityRow {
  rule: number;
  label: string;
  seats_moved: number;
  donor_score: number;
  donor_deficit?: number;
  donor_gap_ratio?: number;
  target_score_realloc: number;
  deficit_closed_realloc_pct: number;
  target_score_combo_no_mobility?: number;
  deficit_closed_combo_no_mobility_pct?: number;
  target_score_combo: number;
  deficit_closed_combo_pct: number;
  total_cost_lakhs: number;
}

export interface ScenarioResult {
  baselineGapScore: number;
  baselineSeverity: string;
  simulatedGapScore: number;
  simulatedSeverity: string;
  baselineShortageProbability: number;
  simulatedShortageProbability: number;
  gapReductionPercent: number;
  baselineSupply: number;
  simulatedSupply: number;
  supplyCoverageIncreasePercent: number;
  estimatedInterventionCostINR: number;
  projectedTimeSeries: { month: string; baselineDemand: number; baselineSupply: number; simulatedSupply: number }[];
  targetTrade?: TradeBeforeAfter;
  donorTrade?: TradeBeforeAfter;
  wasShrunk?: boolean;
  requestedSeats?: number;
  actualSeatsShifted?: number;
  shrinkReason?: string;
  sensitivityTable?: SensitivityRow[];
}

export interface BacktestHorizonRow {
  horizon: '3M' | '6M' | '12M';
  model: string;
  wape: number;
  mase: number;
  coverage_80: number;
  coverage_95: number;
  sample_count: number;
}

export interface DataHealthMetric {
  sourcesConnected?: number;
  sourcesTotal?: number;
  freshnessPercent?: number;
  mappingConfidencePercent?: number;
  forecastConfidencePercent?: number;
  dataQualityPercent?: number;
  lastRunTimestamp?: string;
  lastRunId?: string;
  totalRecords?: number;
  totalDistricts?: number;
  totalStates?: number;
  totalTrades?: number;
  dataThrough?: string;
  lastIngestDate?: string;
  pipelineRunId?: string;
  datasetMode?: string;
  dataSource?: string;
  wapeBaseline?: number;
  wapeLightgbm?: number;
  errorReductionPercent?: number;
  dataHash?: string;
  models?: {
    name: string;
    wape: number;
    mae: number;
    lastTrained: string;
    status: 'optimal' | 'healthy' | 'retraining';
  }[];
  backtestHorizons?: BacktestHorizonRow[];
  sources?: {
    name: string;
    type: 'Public Aggregate' | 'Demo Dataset' | 'Planned Government Feed';
    status: 'Active' | 'Synced' | 'Pending';
    records: string;
    latency: string;
  }[];
}
