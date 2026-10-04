export type ForecastHorizon = '3M' | '6M' | '12M';
export type GapSeverity = 'Severe Shortage' | 'Moderate Shortage' | 'Balanced' | 'Moderate Oversupply' | 'Severe Oversupply';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertType = 
  | 'emerging_shortage' 
  | 'emerging_oversupply' 
  | 'saturation_risk' 
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

export interface ExplainabilityFactor {
  name: string;
  impactPercent: number; // e.g. +31
  description: string;
  signalType: 'vacancy' | 'employer' | 'capex' | 'skill' | 'seasonality';
}

export interface Occupation {
  ncoCode: string;       // e.g. '7126.0101'
  title: string;         // e.g. 'Solar PV Installer'
  titleHi?: string;
  sector: string;        // e.g. 'Green Jobs & Renewable Energy'
  nsqfLevel: number;     // e.g. 4
  currentDemand: number; // e.g. 820
  growthRate6M: number;  // e.g. 21.4 (percent)
  effectiveSupply: number; // e.g. 430
  gapScore: number;      // 0-100 (e.g. 84)
  severity: GapSeverity;
  shortageProbability6M: number; // 0-100 (e.g. 71)
  forecastDemand6M: number;      // e.g. 1020
  demandPressureIndex: number;  // 0-100 (e.g. 91)
  confidence: number;            // 0-100 (e.g. 78)
  employerCount: number;         // e.g. 46
  averageWageINR: number;        // e.g. 22500
  stagedSupply: StagedSupply;
  districtConcentrations: { district: string; state: string; demand: number }[];
  keySkills: string[];
  qualifications: string[];      // Qualification Pack IDs
  timeSeries: TimePoint[];
  explainability: ExplainabilityFactor[];
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
  occupation: string;    // 'Solar PV Installer'
  ncoCode: string;
  trigger: string;
  forecastHorizon: ForecastHorizon;
  confidence: number;
  recommendedAction: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface Recommendation {
  id: string;
  rank: number;
  title: string;
  titleHi?: string;
  type: 'capacity_reallocation' | 'new_curriculum' | 'employer_partnership' | 'seat_expansion';
  fromTrade?: string;
  fromNco?: string;
  toTrade: string;
  toNco: string;
  district: string;
  state: string;
  recommendedSeats: number;
  reason: string;
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

export interface ScenarioParams {
  occupationNco: string;
  districtId: string;
  seatShiftAmount: number;    // e.g. 500 seats shifted from oversupplied trade
  donorNco: string;           // e.g. Retail Sales Associate
  seatPercentAdjustment: number; // -50% to +50%
  demandShockPercent: number;    // -30% to +30%
  newCentreActive: boolean;      // +150 capacity
  mobilityFactorPercent: number; // 0% to 30% inter-district supply mobility
}

export interface ScenarioResult {
  baselineGapScore: number;
  simulatedGapScore: number;
  baselineShortageProbability: number;
  simulatedShortageProbability: number;
  gapReductionPercent: number;
  baselineSupply: number;
  simulatedSupply: number;
  supplyCoverageIncreasePercent: number;
  estimatedInterventionCostINR: number;
  projectedTimeSeries: { month: string; baselineDemand: number; baselineSupply: number; simulatedSupply: number }[];
}

export interface DataHealthMetric {
  sourcesConnected: number;
  sourcesTotal: number;
  freshnessPercent: number;
  mappingConfidencePercent: number;
  forecastConfidencePercent: number;
  dataQualityPercent: number;
  lastRunTimestamp: string;
  lastRunId: string;
  models: {
    name: string;
    wape: number;
    mae: number;
    lastTrained: string;
    status: 'optimal' | 'healthy' | 'retraining';
  }[];
  sources: {
    name: string;
    type: 'Public Aggregate' | 'Demo Dataset' | 'Planned Government Feed';
    status: 'Active' | 'Synced' | 'Pending';
    records: string;
    latency: string;
  }[];
}
