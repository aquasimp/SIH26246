import { runScenarioSimulation } from '../frontend/src/lib/scenarioEngine';

const res = runScenarioSimulation({
  occupationNco: '7126.0101',
  districtId: 'gorakhpur',
  seatShiftAmount: 500,
  donorNco: '5223.0101',
  seatPercentAdjustment: 0,
  demandShockPercent: 0,
  newCentreActive: false,
  mobilityFactorPercent: 0,
  donorSafetyRule: 0.05
});

console.log('Realloc only:', {
  shift: res.actualSeatsShifted,
  gapRed: res.gapReductionPercent,
  donorScore: res.donorTrade?.gap_score_after,
  cost: res.estimatedInterventionCostINR
});

const resCombo = runScenarioSimulation({
  occupationNco: '7126.0101',
  districtId: 'gorakhpur',
  seatShiftAmount: 500,
  donorNco: '5223.0101',
  seatPercentAdjustment: 0,
  demandShockPercent: 0,
  newCentreActive: true,
  mobilityFactorPercent: 0,
  donorSafetyRule: 0.05
});

console.log('Combo:', {
  shift: resCombo.actualSeatsShifted,
  gapRed: resCombo.gapReductionPercent,
  donorScore: resCombo.donorTrade?.gap_score_after,
  cost: resCombo.estimatedInterventionCostINR
});
