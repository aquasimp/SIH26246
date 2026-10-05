import { OCCUPATIONS } from './demoData';
import { ScenarioParams, ScenarioResult, TradeBeforeAfter } from './types';

export function getSeverityBand(score: number): string {
  if (score >= 75) return 'Severe Shortage';
  if (score >= 60) return 'Moderate Shortage';
  if (score >= 40) return 'Balanced';
  if (score >= 25) return 'Moderate Oversupply';
  return 'Severe Oversupply';
}

export function runScenarioSimulation(params: ScenarioParams): ScenarioResult {
  // 1. Identify Target and Donor Trades
  const targetOcc = OCCUPATIONS.find(o => o.ncoCode === params.occupationNco) || OCCUPATIONS[0];
  const donorNco = params.donorNco || '5223.0101';
  const donorOcc = OCCUPATIONS.find(o => o.ncoCode === donorNco) || 
                   OCCUPATIONS.find(o => o.ncoCode === '5223.0101') || 
                   OCCUPATIONS[1];
  
  // Target Baseline
  const tDemand0 = targetOcc.currentDemand || targetOcc.forecastDemand6M;
  const tSupply0 = targetOcc.effectiveSupply;
  const tSeats0 = targetOcc.stagedSupply.trainingSeats;
  const tScore0 = targetOcc.gapScore;
  const tSev0 = getSeverityBand(tScore0);
  const tDeficit0 = Math.max(0, tDemand0 - tSupply0);

  // Donor Baseline
  const dDemand0 = donorOcc.currentDemand || donorOcc.forecastDemand6M;
  const dSupply0 = donorOcc.effectiveSupply;
  const dSeats0 = donorOcc.stagedSupply.trainingSeats;
  const dScore0 = donorOcc.gapScore;
  const dSev0 = getSeverityBand(dScore0);
  const dDeficit0 = Math.max(0, dDemand0 - dSupply0);

  // Staged conversion throughputs (Documented job-readiness rate = 0.70)
  const tStaged = targetOcc.stagedSupply;
  const tEtaCum = tStaged.seatUtilizationRate * tStaged.certificationRate * tStaged.laborParticipationRate * 0.70;

  const dStaged = donorOcc.stagedSupply;
  const dEtaCum = dStaged.seatUtilizationRate * dStaged.certificationRate * dStaged.laborParticipationRate * 0.70;

  // 2. LP Donor Non-Depletion Constraint:
  // No donor may cross into Moderate Shortage or worse (Gap Score >= 60).
  // If the transfer would cause score >= 60, shrink the transfer.
  let actualShift = params.seatShiftAmount;
  let wasShrunk = false;
  let shrinkReason = "Transfer fully within safe non-depletion boundary";

  if (params.enforceDonorConstraint !== false) {
    const donorRule = params.donorSafetyRule ?? 0.05;
    let maxSafeShift = 0;
    for (let s = params.seatShiftAmount; s >= 0; s--) {
      const dSupplyCand = dSupply0 - Math.round(s * dEtaCum);
      const dDeficitCand = Math.max(0, dDemand0 - dSupplyCand);
      const dGapRatio = dDemand0 > 0 ? dDeficitCand / dDemand0 : 0;
      const dScoreCand = Math.max(10, Math.min(98, Math.round(50 + dGapRatio * 50)));
      const dSevCand = getSeverityBand(dScoreCand);
      if (donorRule >= 0.189) {
        if (!dSevCand.includes('Shortage') && dScoreCand <= 59) {
          maxSafeShift = s;
          break;
        }
      } else {
        if (dGapRatio <= donorRule + 1e-4 && dScoreCand <= 59 && !dSevCand.includes('Shortage')) {
          maxSafeShift = s;
          break;
        }
      }
    }
    actualShift = Math.min(params.seatShiftAmount, maxSafeShift);
    wasShrunk = params.seatShiftAmount > actualShift;
    if (wasShrunk) {
      shrinkReason = `LP donor safety active (gap ratio <= ${donorRule.toFixed(2)}): transfer shrunk from ${params.seatShiftAmount} to ${actualShift} to protect donor trade (${donorOcc.title}) from excessive deficit`;
    }
  }

  // 3. Target Post-Intervention Pipeline
  let incrementalSeats = actualShift;
  if (params.newCentreActive) {
    incrementalSeats += 150; // New centre adds 150 dedicated capacity
  }
  const pctMultiplier = 1 + (params.seatPercentAdjustment / 100);
  const adjustedIncrementalSeats = Math.max(0, Math.round(incrementalSeats * pctMultiplier));

  // Mobility factor adds external regional supply draw
  const mobilityMultiplier = 1 + (params.mobilityFactorPercent / 100);
  const addedEffectiveSupply = Math.round(adjustedIncrementalSeats * tEtaCum * mobilityMultiplier);
  const simulatedSupply = tSupply0 + addedEffectiveSupply;

  // Demand Shock
  const simulatedDemand = Math.round(tDemand0 * (1 + (params.demandShockPercent / 100)));

  // Target Net Gap Calculation & Score
  const rawGap = simulatedDemand - simulatedSupply;
  const gapRatio = simulatedDemand > 0 ? rawGap / simulatedDemand : 0;
  let simulatedGapScore = Math.max(10, Math.min(98, Math.round(50 + (gapRatio * 50))));
  const simulatedSeverity = getSeverityBand(simulatedGapScore);
  const simulatedShortageProbability = Math.round(Math.max(5, Math.min(95, simulatedGapScore * 0.85)));

  // Gap Reduction %: MUST strictly equal (initialDeficit - simulatedDeficit) / initialDeficit
  const simulatedDeficit = Math.max(0, simulatedDemand - simulatedSupply);
  const gapReductionPercent = tDeficit0 > 0 
    ? Math.max(0, Math.min(100, Math.round(((tDeficit0 - simulatedDeficit) / tDeficit0) * 100)))
    : 0;

  // Supply coverage increase
  const initialCoverage = (tSupply0 / Math.max(1, tDemand0)) * 100;
  const simulatedCoverage = (simulatedSupply / Math.max(1, simulatedDemand)) * 100;
  const supplyCoverageIncreasePercent = Math.max(0, Math.round(simulatedCoverage - initialCoverage));

  // Estimated intervention cost (₹6,500/seat + ₹12 Lakhs capex if new centre)
  const seatTrainingCost = actualShift * 6500;
  const centreCapexCost = params.newCentreActive ? 1200000 : 0;
  const estimatedInterventionCostINR = seatTrainingCost + centreCapexCost;

  // 4. Donor Post-Intervention Pipeline
  const dSeats1 = Math.max(0, dSeats0 - actualShift);
  const dSupply1 = Math.max(0, dSupply0 - Math.round(actualShift * dEtaCum));
  const dDeficit1 = Math.max(0, dDemand0 - dSupply1);
  const dGapRatio1 = dDemand0 > 0 ? (dDemand0 - dSupply1) / dDemand0 : 0;
  const dScore1 = Math.max(10, Math.min(98, Math.round(50 + (dGapRatio1 * 50))));
  const dSev1 = getSeverityBand(dScore1);

  // Time-series projections (6 forward projection months)
  const projectedTimeSeries = [
    { month: '2026-11', baselineDemand: Math.round(tDemand0 * 0.90), baselineSupply: tSupply0, simulatedSupply: Math.round(tSupply0 + (simulatedSupply - tSupply0) * 0.2) },
    { month: '2026-12', baselineDemand: Math.round(tDemand0 * 0.94), baselineSupply: tSupply0, simulatedSupply: Math.round(tSupply0 + (simulatedSupply - tSupply0) * 0.4) },
    { month: '2027-01', baselineDemand: Math.round(tDemand0 * 0.97), baselineSupply: tSupply0, simulatedSupply: Math.round(tSupply0 + (simulatedSupply - tSupply0) * 0.6) },
    { month: '2027-02', baselineDemand: Math.round(tDemand0 * 1.00), baselineSupply: tSupply0, simulatedSupply: Math.round(tSupply0 + (simulatedSupply - tSupply0) * 0.8) },
    { month: '2027-03', baselineDemand: Math.round(tDemand0 * 1.03), baselineSupply: tSupply0, simulatedSupply: Math.round(tSupply0 + (simulatedSupply - tSupply0) * 0.95) },
    { month: '2027-04', baselineDemand: simulatedDemand, baselineSupply: tSupply0, simulatedSupply }
  ];

  const targetTrade: TradeBeforeAfter = {
    title: targetOcc.title,
    nco: targetOcc.ncoCode,
    district: params.districtId,
    seats_before: tSeats0,
    seats_after: tSeats0 + adjustedIncrementalSeats,
    demand_before: tDemand0,
    demand_after: simulatedDemand,
    supply_before: tSupply0,
    supply_after: simulatedSupply,
    deficit_before: tDeficit0,
    deficit_after: simulatedDeficit,
    gap_score_before: tScore0,
    gap_score_after: simulatedGapScore,
    severity_before: tSev0,
    severity_after: simulatedSeverity,
    deficit_reduction_percent: gapReductionPercent
  };

  const donorTrade: TradeBeforeAfter = {
    title: donorOcc.title,
    nco: donorOcc.ncoCode,
    district: params.donorDistrict || params.districtId,
    seats_before: dSeats0,
    seats_after: dSeats1,
    demand_before: dDemand0,
    demand_after: dDemand0,
    supply_before: dSupply0,
    supply_after: dSupply1,
    deficit_before: dDeficit0,
    deficit_after: dDeficit1,
    gap_score_before: dScore0,
    gap_score_after: dScore1,
    severity_before: dSev0,
    severity_after: dSev1,
    was_shrunk: wasShrunk,
    requested_seats: params.seatShiftAmount,
    actual_seats_shifted: actualShift,
    shrink_reason: shrinkReason
  };

  const sensitivityTable = [
    { rule: 0.05, label: "Strict (<= 0.05 ratio)" },
    { rule: 0.10, label: "Moderate (<= 0.10 ratio)" },
    { rule: 0.1895, label: "Permissive (Score <= 59)" }
  ].map(item => {
    let sSafe = 0;
    for (let s = params.seatShiftAmount; s >= 0; s--) {
      const dSupplyCand = dSupply0 - Math.round(s * dEtaCum);
      const dDeficitCand = Math.max(0, dDemand0 - dSupplyCand);
      const dGapRatio = dDemand0 > 0 ? dDeficitCand / dDemand0 : 0;
      const dScoreCand = Math.max(10, Math.min(98, Math.round(50 + dGapRatio * 50)));
      const dSevCand = getSeverityBand(dScoreCand);
      if (item.rule >= 0.189) {
        if (!dSevCand.includes('Shortage') && dScoreCand <= 59) {
          sSafe = s;
          break;
        }
      } else {
        if (dGapRatio <= item.rule + 1e-4 && dScoreCand <= 59 && !dSevCand.includes('Shortage')) {
          sSafe = s;
          break;
        }
      }
    }
    const dPost = dSupply0 - Math.round(sSafe * dEtaCum);
    const dDeficit = Math.max(0, dDemand0 - dPost);
    const dGapRatio = dDemand0 > 0 ? Number((dDeficit / dDemand0).toFixed(4)) : 0;
    const dScore = Math.max(10, Math.min(98, Math.round(50 + dGapRatio * 50)));

    const tPostRealloc = tSupply0 + Math.round(sSafe * tEtaCum);
    const tScoreRealloc = Math.max(10, Math.min(98, Math.round(50 + (Math.max(0, tDemand0 - tPostRealloc) / Math.max(1, tDemand0)) * 50)));
    const pctRealloc = Number((Math.max(0, Math.min(100, ((tPostRealloc - tSupply0) / Math.max(1, tDeficit0)) * 100))).toFixed(1));

    // Combo without mobility (0% mobility)
    const tPostComboNoMob = tSupply0 + Math.round((sSafe + 150) * tEtaCum);
    const tScoreComboNoMob = Math.max(10, Math.min(98, Math.round(50 + (Math.max(0, tDemand0 - tPostComboNoMob) / Math.max(1, tDemand0)) * 50)));
    const pctComboNoMob = Number((Math.max(0, Math.min(100, ((tPostComboNoMob - tSupply0) / Math.max(1, tDeficit0)) * 100))).toFixed(1));

    // Combo with +10% mobility
    const tPostComboMob = tSupply0 + Math.round((sSafe + 150) * tEtaCum * 1.10);
    const tScoreComboMob = Math.max(10, Math.min(98, Math.round(50 + (Math.max(0, tDemand0 - tPostComboMob) / Math.max(1, tDemand0)) * 50)));
    const pctComboMob = Number((Math.max(0, Math.min(100, ((tPostComboMob - tSupply0) / Math.max(1, tDeficit0)) * 100))).toFixed(1));
    const totalCostLakhs = Number(((sSafe * 6500 + 1200000) / 100000).toFixed(2));

    return {
      rule: item.rule,
      label: item.label,
      seats_moved: sSafe,
      donor_score: dScore,
      donor_deficit: dDeficit,
      donor_gap_ratio: dGapRatio,
      target_score_realloc: tScoreRealloc,
      deficit_closed_realloc_pct: pctRealloc,
      target_score_combo_no_mobility: tScoreComboNoMob,
      deficit_closed_combo_no_mobility_pct: pctComboNoMob,
      target_score_combo: tScoreComboMob,
      deficit_closed_combo_pct: pctComboMob,
      total_cost_lakhs: totalCostLakhs
    };
  });

  return {
    baselineGapScore: tScore0,
    baselineSeverity: tSev0,
    simulatedGapScore,
    simulatedSeverity,
    baselineShortageProbability: targetOcc.shortageProbability6M,
    simulatedShortageProbability,
    gapReductionPercent,
    baselineSupply: tSupply0,
    simulatedSupply,
    supplyCoverageIncreasePercent,
    estimatedInterventionCostINR,
    projectedTimeSeries,
    targetTrade,
    donorTrade,
    wasShrunk,
    requestedSeats: params.seatShiftAmount,
    actualSeatsShifted: actualShift,
    shrinkReason,
    sensitivityTable
  };
}
