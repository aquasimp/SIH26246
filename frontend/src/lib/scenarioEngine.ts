import { OCCUPATIONS } from './demoData';
import { ScenarioParams, ScenarioResult } from './types';

export function runScenarioSimulation(params: ScenarioParams): ScenarioResult {
  const targetOcc = OCCUPATIONS.find(o => o.ncoCode === params.occupationNco) || OCCUPATIONS[0];
  
  const baselineDemand = targetOcc.forecastDemand6M;
  const baselineSupply = targetOcc.effectiveSupply;
  const baselineGapScore = targetOcc.gapScore;
  const baselineShortageProb = targetOcc.shortageProbability6M;

  // 1. Calculate New Seats
  let incrementalSeats = params.seatShiftAmount;
  if (params.newCentreActive) {
    incrementalSeats += 150; // New centre adds 150 dedicated capacity
  }
  const pctMultiplier = 1 + (params.seatPercentAdjustment / 100);
  const totalAdjustedSeats = Math.max(0, Math.round((targetOcc.stagedSupply.trainingSeats + incrementalSeats) * pctMultiplier));

  // 2. Staged Supply Pipeline Calculation
  const staged = targetOcc.stagedSupply;
  const newEnrolled = Math.round(totalAdjustedSeats * staged.seatUtilizationRate);
  const newCertified = Math.round(newEnrolled * staged.certificationRate);
  const newAvailable = Math.round(newCertified * staged.laborParticipationRate);
  const baseEffectiveNew = Math.round(newAvailable * staged.employabilityFactor);

  // Mobility factor adds external regional supply draw
  const mobilityMultiplier = 1 + (params.mobilityFactorPercent / 100);
  const simulatedSupply = Math.round((baselineSupply + baseEffectiveNew) * mobilityMultiplier);

  // 3. Demand Shock
  const simulatedDemand = Math.round(baselineDemand * (1 + (params.demandShockPercent / 100)));

  // 4. Net Gap Calculation & Score
  const rawGap = simulatedDemand - simulatedSupply;
  const gapRatio = simulatedDemand > 0 ? rawGap / simulatedDemand : 0;

  // Score normalized between 0-100 (where 50 is balanced, >70 is severe shortage, <30 is oversupply)
  let simulatedGapScore = Math.round(50 + (gapRatio * 50));
  simulatedGapScore = Math.max(10, Math.min(98, simulatedGapScore));

  // Simulated Shortage Probability
  let simulatedShortageProbability = Math.round(Math.max(5, Math.min(95, simulatedGapScore * 0.85)));

  // Gap Reduction %
  const initialDeficit = Math.max(0, baselineDemand - baselineSupply);
  const simulatedDeficit = Math.max(0, simulatedDemand - simulatedSupply);
  const gapReductionPercent = initialDeficit > 0 
    ? Math.max(0, Math.min(100, Math.round(((initialDeficit - simulatedDeficit) / initialDeficit) * 100)))
    : 0;

  // Supply coverage increase
  const initialCoverage = (baselineSupply / baselineDemand) * 100;
  const simulatedCoverage = (simulatedSupply / simulatedDemand) * 100;
  const supplyCoverageIncreasePercent = Math.max(0, Math.round(simulatedCoverage - initialCoverage));

  // Estimated intervention cost
  // Cost model: ₹6,500 per seat converted/trained + ₹12,00,000 if new centre active
  const seatTrainingCost = incrementalSeats * 6500;
  const centreCapexCost = params.newCentreActive ? 1200000 : 0;
  const estimatedInterventionCostINR = seatTrainingCost + centreCapexCost;

  // Generate 6 forward projection months
  const projectedTimeSeries = [
    { month: '2026-11', baselineDemand: Math.round(baselineDemand * 0.90), baselineSupply, simulatedSupply: Math.round(baselineSupply + (simulatedSupply - baselineSupply) * 0.2) },
    { month: '2026-12', baselineDemand: Math.round(baselineDemand * 0.94), baselineSupply, simulatedSupply: Math.round(baselineSupply + (simulatedSupply - baselineSupply) * 0.4) },
    { month: '2027-01', baselineDemand: Math.round(baselineDemand * 0.97), baselineSupply, simulatedSupply: Math.round(baselineSupply + (simulatedSupply - baselineSupply) * 0.6) },
    { month: '2027-02', baselineDemand: Math.round(baselineDemand * 1.00), baselineSupply, simulatedSupply: Math.round(baselineSupply + (simulatedSupply - baselineSupply) * 0.8) },
    { month: '2027-03', baselineDemand: Math.round(baselineDemand * 1.03), baselineSupply, simulatedSupply: Math.round(baselineSupply + (simulatedSupply - baselineSupply) * 0.95) },
    { month: '2027-04', baselineDemand: simulatedDemand, baselineSupply, simulatedSupply }
  ];

  return {
    baselineGapScore,
    simulatedGapScore,
    baselineShortageProbability: baselineShortageProb,
    simulatedShortageProbability,
    gapReductionPercent,
    baselineSupply,
    simulatedSupply,
    supplyCoverageIncreasePercent,
    estimatedInterventionCostINR,
    projectedTimeSeries
  };
}
