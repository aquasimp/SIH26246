import { 
  District, 
  Occupation, 
  EarlyWarningAlert, 
  Recommendation, 
  DataHealthMetric, 
  TimePoint 
} from './types';

// Helper to generate realistic monthly trend
function generateSeries(baseDemand: number, baseSupply: number, trend: number, count = 24): TimePoint[] {
  const months = [
    '2024-11', '2024-12',
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
    '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
    '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
    '2026-07', '2026-08', '2026-09', '2026-10',
    '2026-11', '2026-12', '2027-01', '2027-02', '2027-03', '2027-04',
    '2027-05', '2027-06', '2027-07', '2027-08', '2027-09', '2027-10'
  ];

  return months.slice(0, count).map((m, idx) => {
    const isHistorical = idx < 24;
    const progress = idx / 24;
    const season = Math.sin(idx * 0.5) * 25;
    const dVal = Math.round(baseDemand * (1 + (trend * progress)) + season);
    const sVal = Math.round(baseSupply * (1 + (trend * 0.25 * progress)) + (season * 0.3));

    if (isHistorical) {
      return {
        month: m,
        historicalDemand: dVal,
        effectiveSupply: sVal,
        baselineNaive: Math.round(dVal * 0.96)
      };
    } else {
      const spread = Math.round(dVal * 0.08 * (idx - 23));
      return {
        month: m,
        forecastDemand: dVal,
        effectiveSupply: sVal,
        ciLower: Math.max(0, dVal - spread),
        ciUpper: dVal + spread,
        baselineNaive: Math.round(baseDemand * (1 + (trend * 0.6)))
      };
    }
  });
}

export const STATES = [
  'Uttar Pradesh',
  'Maharashtra',
  'Karnataka',
  'Gujarat'
];

export const DISTRICTS: District[] = [
  // Uttar Pradesh
  {
    id: 'gorakhpur',
    name: 'Gorakhpur',
    nameHi: 'गोरखपुर',
    state: 'Uttar Pradesh',
    lgdCode: 178,
    demandIndex: 94,
    effectiveSupplyIndex: 51,
    gapScore: 94,
    shortageProbability6M: 88,
    trainingCentresCount: 2,
    totalTrainingSeats: 1133,
    topShortageTrades: ['Solar PV Installer (NCO 7126.0101)', 'EV Service Technician', 'Smart Meter Technician'],
    topOversuppliedTrades: ['Retail Sales Associate (NCO 5223.0101)', 'General Data Entry Operator'],
    activeEmployers: 46,
    coordinates: [26.7606, 83.3732]
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    nameHi: 'लखनऊ',
    state: 'Uttar Pradesh',
    lgdCode: 180,
    demandIndex: 82,
    effectiveSupplyIndex: 68,
    gapScore: 62,
    shortageProbability6M: 52,
    trainingCentresCount: 14,
    totalTrainingSeats: 1450,
    topShortageTrades: ['AI Data Annotation Specialist', 'Solar PV Installer'],
    topOversuppliedTrades: ['Retail Sales Associate', 'Tele-Sales Executive'],
    activeEmployers: 128,
    coordinates: [26.8467, 80.9462]
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    nameHi: 'वाराणसी',
    state: 'Uttar Pradesh',
    lgdCode: 201,
    demandIndex: 74,
    effectiveSupplyIndex: 58,
    gapScore: 66,
    shortageProbability6M: 58,
    trainingCentresCount: 7,
    totalTrainingSeats: 620,
    topShortageTrades: ['Drone Technician (Agri)', 'Solar PV Installer'],
    topOversuppliedTrades: ['Handloom Assistant', 'Retail Sales Associate'],
    activeEmployers: 54,
    coordinates: [25.3176, 82.9739]
  },
  {
    id: 'gautam_buddha_nagar',
    name: 'Gautam Buddha Nagar',
    nameHi: 'गौतम बुद्ध नगर (नोएडा)',
    state: 'Uttar Pradesh',
    lgdCode: 168,
    demandIndex: 94,
    effectiveSupplyIndex: 72,
    gapScore: 78,
    shortageProbability6M: 69,
    trainingCentresCount: 22,
    totalTrainingSeats: 2600,
    topShortageTrades: ['Cybersecurity Associate', 'Industrial Automation Specialist', 'EV Powertrain Tech'],
    topOversuppliedTrades: ['Customer Care Rep', 'Warehouse Helper'],
    activeEmployers: 310,
    coordinates: [28.5355, 77.3910]
  },

  // Maharashtra
  {
    id: 'pune',
    name: 'Pune',
    nameHi: 'पुणे',
    state: 'Maharashtra',
    lgdCode: 521,
    demandIndex: 96,
    effectiveSupplyIndex: 69,
    gapScore: 82,
    shortageProbability6M: 74,
    trainingCentresCount: 38,
    totalTrainingSeats: 4200,
    topShortageTrades: ['EV Service Technician', 'CNC Machine Operator', 'Robotics Integrator'],
    topOversuppliedTrades: ['Basic Office Assistant', 'Manual Assembly Tech'],
    activeEmployers: 480,
    coordinates: [18.5204, 73.8567]
  },
  {
    id: 'mumbai_suburban',
    name: 'Mumbai Suburban',
    nameHi: 'मुंबई उपनगर',
    state: 'Maharashtra',
    lgdCode: 518,
    demandIndex: 92,
    effectiveSupplyIndex: 80,
    gapScore: 56,
    shortageProbability6M: 44,
    trainingCentresCount: 45,
    totalTrainingSeats: 5800,
    topShortageTrades: ['Fintech Operations Associate', 'Cybersecurity Analyst'],
    topOversuppliedTrades: ['Retail Cashier', 'Tele-Caller'],
    activeEmployers: 620,
    coordinates: [19.0760, 72.8777]
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    nameHi: 'नागपुर',
    state: 'Maharashtra',
    lgdCode: 505,
    demandIndex: 72,
    effectiveSupplyIndex: 59,
    gapScore: 61,
    shortageProbability6M: 53,
    trainingCentresCount: 16,
    totalTrainingSeats: 1600,
    topShortageTrades: ['Cold Chain Logistics Tech', 'Solar Maintenance Tech'],
    topOversuppliedTrades: ['General Clerk', 'Retail Sales Associate'],
    activeEmployers: 92,
    coordinates: [21.1458, 79.0882]
  },
  {
    id: 'nashik',
    name: 'Nashik',
    nameHi: 'नासिक',
    state: 'Maharashtra',
    lgdCode: 516,
    demandIndex: 76,
    effectiveSupplyIndex: 62,
    gapScore: 65,
    shortageProbability6M: 57,
    trainingCentresCount: 12,
    totalTrainingSeats: 1100,
    topShortageTrades: ['Agri-Cold Storage Tech', 'Auto Component Welder'],
    topOversuppliedTrades: ['Data Entry Operator', 'Retail Helper'],
    activeEmployers: 84,
    coordinates: [19.9975, 73.7898]
  },

  // Karnataka
  {
    id: 'bengaluru_urban',
    name: 'Bengaluru Urban',
    nameHi: 'बेंगलुरु अर्बन',
    state: 'Karnataka',
    lgdCode: 554,
    demandIndex: 98,
    effectiveSupplyIndex: 71,
    gapScore: 86,
    shortageProbability6M: 78,
    trainingCentresCount: 52,
    totalTrainingSeats: 6400,
    topShortageTrades: ['AI Data Annotation Specialist', 'EV Battery Tech', 'Precision CNC Programmer'],
    topOversuppliedTrades: ['Front Desk Associate', 'Retail Sales Associate'],
    activeEmployers: 740,
    coordinates: [12.9716, 77.5946]
  },
  {
    id: 'mysuru',
    name: 'Mysuru',
    nameHi: 'मैसूरु',
    state: 'Karnataka',
    lgdCode: 570,
    demandIndex: 71,
    effectiveSupplyIndex: 64,
    gapScore: 54,
    shortageProbability6M: 42,
    trainingCentresCount: 14,
    totalTrainingSeats: 1250,
    topShortageTrades: ['Semiconductor Test Operator', 'Solar PV Installer'],
    topOversuppliedTrades: ['Retail Associate', 'Textile Tailor'],
    activeEmployers: 78,
    coordinates: [12.2958, 76.6394]
  },
  {
    id: 'dharwad',
    name: 'Dharwad',
    nameHi: 'धारवाड़',
    state: 'Karnataka',
    lgdCode: 561,
    demandIndex: 67,
    effectiveSupplyIndex: 58,
    gapScore: 58,
    shortageProbability6M: 49,
    trainingCentresCount: 9,
    totalTrainingSeats: 820,
    topShortageTrades: ['Industrial Electrician', 'FMCG Packaging Tech'],
    topOversuppliedTrades: ['General Typist', 'Retail Helper'],
    activeEmployers: 62,
    coordinates: [15.4589, 75.0078]
  },
  {
    id: 'dakshina_kannada',
    name: 'Dakshina Kannada',
    nameHi: 'दक्षिण कन्नड़ (मंगलुरु)',
    state: 'Karnataka',
    lgdCode: 560,
    demandIndex: 75,
    effectiveSupplyIndex: 66,
    gapScore: 57,
    shortageProbability6M: 47,
    trainingCentresCount: 11,
    totalTrainingSeats: 980,
    topShortageTrades: ['Marine Equipment Tech', 'Healthcare Assistant'],
    topOversuppliedTrades: ['Office Assistant', 'Retail Cashier'],
    activeEmployers: 88,
    coordinates: [12.8700, 74.8800]
  },

  // Gujarat
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    nameHi: 'अहमदाबाद',
    state: 'Gujarat',
    lgdCode: 438,
    demandIndex: 91,
    effectiveSupplyIndex: 73,
    gapScore: 75,
    shortageProbability6M: 66,
    trainingCentresCount: 34,
    totalTrainingSeats: 3900,
    topShortageTrades: ['Chemical Process Operator', 'Solar Plant Maintenance Tech', 'Drone Tech'],
    topOversuppliedTrades: ['Account Assistant', 'Retail Sales Associate'],
    activeEmployers: 410,
    coordinates: [23.0225, 72.5714]
  },
  {
    id: 'surat',
    name: 'Surat',
    nameHi: 'सूरत',
    state: 'Gujarat',
    lgdCode: 462,
    demandIndex: 88,
    effectiveSupplyIndex: 70,
    gapScore: 71,
    shortageProbability6M: 62,
    trainingCentresCount: 28,
    totalTrainingSeats: 3100,
    topShortageTrades: ['Textile Mechatronics Tech', 'Industrial Welder TIG/MIG'],
    topOversuppliedTrades: ['Diamond Polishing Assistant', 'Retail Associate'],
    activeEmployers: 330,
    coordinates: [21.1702, 72.8311]
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    nameHi: 'वडोदरा',
    state: 'Gujarat',
    lgdCode: 464,
    demandIndex: 83,
    effectiveSupplyIndex: 67,
    gapScore: 68,
    shortageProbability6M: 59,
    trainingCentresCount: 18,
    totalTrainingSeats: 1850,
    topShortageTrades: ['High-Voltage Switchgear Tech', 'Automation Maintenance Tech'],
    topOversuppliedTrades: ['Computer Operator', 'Retail Helper'],
    activeEmployers: 195,
    coordinates: [22.3072, 73.1812]
  },
  {
    id: 'rajkot',
    name: 'Rajkot',
    nameHi: 'राजकोट',
    state: 'Gujarat',
    lgdCode: 458,
    demandIndex: 79,
    effectiveSupplyIndex: 65,
    gapScore: 64,
    shortageProbability6M: 55,
    trainingCentresCount: 15,
    totalTrainingSeats: 1400,
    topShortageTrades: ['CNC Lathe Specialist', 'Submersible Pump Assembler'],
    topOversuppliedTrades: ['Manual Lathe Operator', 'Retail Sales Associate'],
    activeEmployers: 160,
    coordinates: [22.3039, 70.8022]
  }
];

export const SECTORS = [
  'Green Jobs & Renewable Energy',
  'Automotive & Advanced Manufacturing',
  'IT & ITES',
  'Healthcare & Life Sciences',
  'Retail, Logistics & Supply Chain',
  'Construction & Infrastructure'
];

export const OCCUPATIONS: Occupation[] = [
  // 1. Solar PV Installer (HERO SHORTAGE OCCUPATION)
  {
    ncoCode: '7126.0101',
    title: 'Solar PV Installer',
    titleHi: 'सोलर पीवी इंस्टॉलर',
    sector: 'Green Jobs & Renewable Energy',
    nsqfLevel: 4,
    currentDemand: 808,
    growthRate6M: -0.1,
    effectiveSupply: 97,
    gapScore: 94,
    severity: 'Severe Shortage',
    shortageProbability6M: 88,
    forecastDemand6M: 825,
    demandPressureIndex: 94,
    confidence: 82,
    employerCount: 46,
    averageWageINR: 23500,
    stagedSupply: {
      trainingSeats: 217,
      enrolled: 204,
      certified: 170,
      availableLabour: 139,
      effectiveEmployableSupply: 97,
      seatUtilizationRate: 0.94,
      certificationRate: 0.83,
      laborParticipationRate: 0.82,
      employabilityFactor: 0.70
    },
    districtConcentrations: [
      { district: 'Gorakhpur', state: 'Uttar Pradesh', demand: 808 },
      { district: 'Varanasi', state: 'Uttar Pradesh', demand: 610 },
      { district: 'Ahmedabad', state: 'Gujarat', demand: 940 },
      { district: 'Nagpur', state: 'Maharashtra', demand: 520 }
    ],
    keySkills: ['Rooftop Inverter Wiring', 'Solar Panel Array Mounting', 'Grid Synchronization', 'Safety Compliance IEC 61215'],
    qualifications: ['QP-SGJ/Q0101 (Solar PV Installer Suryamitra)', 'NSQF Level 4 Certification'],
    timeSeries: generateSeries(808, 97, 0.24, 36),
    explainability: [
      { name: 'rolling_mean_3', impactPercent: 35, description: 'Short-term moving average baseline demand (+108.91 SHAP)', signalType: 'vacancy' },
      { name: 'lag_1', impactPercent: 30, description: 'Preceding month recruitment order baseline t-1 (+102.25 SHAP)', signalType: 'employer' },
      { name: 'rolling_mean_12', impactPercent: 25, description: 'Annualized moving average labour demand (+100.45 SHAP)', signalType: 'capex' },
      { name: 'lag_12', impactPercent: 8, description: 'Prior-year same-month seasonal anchor t-12 (+21.95 SHAP)', signalType: 'skill' },
      { name: 'month', impactPercent: -4, description: 'Calendar seasonality and fiscal procurement milestones (-10.79 SHAP)', signalType: 'seasonality' }
    ]
  },

  // 2. Retail Sales Associate (DONOR OCCUPATION)
  {
    ncoCode: '5223.0101',
    title: 'Retail Sales Associate',
    titleHi: 'रिटेल सेल्स एसोसिएट',
    sector: 'Retail, Logistics & Supply Chain',
    nsqfLevel: 3,
    currentDemand: 380,
    growthRate6M: -10.0,
    effectiveSupply: 404,
    gapScore: 47,
    severity: 'Balanced',
    shortageProbability6M: 24,
    forecastDemand6M: 365,
    demandPressureIndex: 47,
    confidence: 84,
    employerCount: 38,
    averageWageINR: 14500,
    stagedSupply: {
      trainingSeats: 916,
      enrolled: 782,
      certified: 704,
      availableLabour: 577,
      effectiveEmployableSupply: 404,
      seatUtilizationRate: 0.85,
      certificationRate: 0.90,
      laborParticipationRate: 0.82,
      employabilityFactor: 0.70
    },
    districtConcentrations: [
      { district: 'Gorakhpur', state: 'Uttar Pradesh', demand: 380 },
      { district: 'Lucknow', state: 'Uttar Pradesh', demand: 477 },
      { district: 'Kanpur Nagar', state: 'Uttar Pradesh', demand: 412 },
      { district: 'Varanasi', state: 'Uttar Pradesh', demand: 365 }
    ],
    keySkills: ['Point-of-Sale (POS) Operations', 'Customer Relationship Management', 'Inventory Stacking', 'Cash Reconciliation'],
    qualifications: ['QP-RAS/Q0104 (Retail Sales Associate)', 'NSQF Level 3 Certification'],
    timeSeries: generateSeries(380, 404, -0.09, 36),
    explainability: [
      { name: 'lag_1', impactPercent: -28, description: 'Preceding month recruitment order baseline t-1 (-34.21 SHAP)', signalType: 'vacancy' },
      { name: 'rolling_mean_12', impactPercent: -18, description: 'Annualized moving average labour demand (-16.61 SHAP)', signalType: 'employer' },
      { name: 'month', impactPercent: -14, description: 'Calendar seasonality and fiscal procurement milestones (-12.79 SHAP)', signalType: 'seasonality' },
      { name: 'rolling_mean_3', impactPercent: -10, description: 'Short-term moving average baseline demand (-9.86 SHAP)', signalType: 'vacancy' },
      { name: 'nco_code', impactPercent: -6, description: 'Occupation-specific skill specialization barrier (-5.06 SHAP)', signalType: 'skill' }
    ]
  },

  // 3. EV Service Technician
  {
    ncoCode: '7233.0102',
    title: 'EV Service Technician',
    titleHi: 'ईवी सर्विस तकनीशियन',
    sector: 'Automotive & Advanced Manufacturing',
    nsqfLevel: 4,
    currentDemand: 1150,
    growthRate6M: 26.8,
    effectiveSupply: 620,
    gapScore: 82,
    severity: 'Severe Shortage',
    shortageProbability6M: 74,
    forecastDemand6M: 1460,
    demandPressureIndex: 89,
    confidence: 81,
    employerCount: 94,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 260,
      enrolled: 245,
      certified: 215,
      availableLabour: 710,
      effectiveEmployableSupply: 620,
      seatUtilizationRate: 0.94,
      certificationRate: 0.88,
      laborParticipationRate: 0.86,
      employabilityFactor: 0.80
    },
    districtConcentrations: [
      { district: 'Pune', state: 'Maharashtra', demand: 1150 },
      { district: 'Bengaluru Urban', state: 'Karnataka', demand: 1380 },
      { district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', demand: 910 },
      { district: 'Ahmedabad', state: 'Gujarat', demand: 760 }
    ],
    keySkills: ['High-Voltage Battery Diagnostics', 'BMS Calibration', 'Regenerative Braking Troubleshooting', 'Electric Drivetrain Repair'],
    qualifications: ['QP-ASC/Q1424 (Electric Vehicle Service Lead Technician)', 'NSQF Level 4'],
    timeSeries: generateSeries(1150, 620, 0.27, 36),
    explainability: [
      { name: '2W/3W EV Fleet Adoption in Tier-1 & Tier-2', impactPercent: 34, description: 'Rapid delivery fleet electrification mandates by gig operators', signalType: 'vacancy' },
      { name: 'OEM Service Center Mandates', impactPercent: 24, description: 'Authorized EV dealerships requiring certified high-voltage safety technicians', signalType: 'employer' }
    ]
  },

  // 4. AI/ML Data Annotation Specialist
  {
    ncoCode: '2512.0101',
    title: 'AI/ML Data Annotation Specialist',
    titleHi: 'एआई डेटा एनोटेशन विशेषज्ञ',
    sector: 'IT & ITES',
    nsqfLevel: 5,
    currentDemand: 1680,
    growthRate6M: 32.1,
    effectiveSupply: 920,
    gapScore: 79,
    severity: 'Severe Shortage',
    shortageProbability6M: 70,
    forecastDemand6M: 2220,
    demandPressureIndex: 94,
    confidence: 86,
    employerCount: 142,
    averageWageINR: 26000,
    stagedSupply: {
      trainingSeats: 450,
      enrolled: 420,
      certified: 390,
      availableLabour: 1050,
      effectiveEmployableSupply: 920,
      seatUtilizationRate: 0.93,
      certificationRate: 0.92,
      laborParticipationRate: 0.88,
      employabilityFactor: 0.82
    },
    districtConcentrations: [
      { district: 'Bengaluru Urban', state: 'Karnataka', demand: 1680 },
      { district: 'Lucknow', state: 'Uttar Pradesh', demand: 540 },
      { district: 'Pune', state: 'Maharashtra', demand: 880 },
      { district: 'Ahmedabad', state: 'Gujarat', demand: 410 }
    ],
    keySkills: ['Multimodal Bounding Boxes', 'Indic Language Tokenization', 'LiDAR 3D Point Cloud Annotation', 'RLHF Ranking'],
    qualifications: ['QP-SSC/Q8101 (Data Annotation Associate)', 'NSQF Level 5'],
    timeSeries: generateSeries(1680, 920, 0.32, 36),
    explainability: [
      { name: 'Generative AI Indic Language Initiatives (Bhashini)', impactPercent: 38, description: 'National multi-lingual LLM benchmark datasets needing human evaluation', signalType: 'vacancy' },
      { name: 'Autonomous Driving Testbeds', impactPercent: 19, description: 'OEM tech centers contracting localized computer vision labeling', signalType: 'employer' }
    ]
  },

  // 5. CNC Machine Operator
  {
    ncoCode: '8151.0101',
    title: 'CNC Machine Operator',
    titleHi: 'सीएनसी मशीन ऑपरेटर',
    sector: 'Automotive & Advanced Manufacturing',
    nsqfLevel: 4,
    currentDemand: 980,
    growthRate6M: 14.5,
    effectiveSupply: 670,
    gapScore: 72,
    severity: 'Moderate Shortage',
    shortageProbability6M: 64,
    forecastDemand6M: 1120,
    demandPressureIndex: 77,
    confidence: 82,
    employerCount: 86,
    averageWageINR: 24000,
    stagedSupply: {
      trainingSeats: 320,
      enrolled: 300,
      certified: 275,
      availableLabour: 780,
      effectiveEmployableSupply: 670,
      seatUtilizationRate: 0.94,
      certificationRate: 0.91,
      laborParticipationRate: 0.84,
      employabilityFactor: 0.81
    },
    districtConcentrations: [
      { district: 'Pune', state: 'Maharashtra', demand: 980 },
      { district: 'Rajkot', state: 'Gujarat', demand: 720 },
      { district: 'Bengaluru Urban', state: 'Karnataka', demand: 640 },
      { district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', demand: 590 }
    ],
    keySkills: ['G-Code & M-Code Editing', 'Coordinate Measurement Machine (CMM)', 'Tolerance Metrology', 'Tool Wear Monitoring'],
    qualifications: ['QP-CSC/Q0115 (CNC Operator Vertical Machining)', 'NSQF Level 4'],
    timeSeries: generateSeries(980, 670, 0.15, 36),
    explainability: [
      { name: 'Defence & Aerospace Component Exports', impactPercent: 25, description: 'Precision machining contracts under PLI for auto-components', signalType: 'vacancy' }
    ]
  },

  // 6. Drone Maintenance Technician
  {
    ncoCode: '7212.0101',
    title: 'Drone Maintenance Technician',
    titleHi: 'ड्रोन मेंटेनेंस तकनीशियन',
    sector: 'Automotive & Advanced Manufacturing',
    nsqfLevel: 4,
    currentDemand: 560,
    growthRate6M: 38.4,
    effectiveSupply: 240,
    gapScore: 86,
    severity: 'Severe Shortage',
    shortageProbability6M: 77,
    forecastDemand6M: 780,
    demandPressureIndex: 92,
    confidence: 76,
    employerCount: 32,
    averageWageINR: 29000,
    stagedSupply: {
      trainingSeats: 90,
      enrolled: 85,
      certified: 75,
      availableLabour: 290,
      effectiveEmployableSupply: 240,
      seatUtilizationRate: 0.94,
      certificationRate: 0.88,
      laborParticipationRate: 0.85,
      employabilityFactor: 0.82
    },
    districtConcentrations: [
      { district: 'Varanasi', state: 'Uttar Pradesh', demand: 560 },
      { district: 'Nagpur', state: 'Maharashtra', demand: 420 },
      { district: 'Ahmedabad', state: 'Gujarat', demand: 480 },
      { district: 'Bengaluru Urban', state: 'Karnataka', demand: 620 }
    ],
    keySkills: ['Brushless Motor Diagnostics', 'Flight Controller Firmware Flashing', 'Propeller Balancing', 'DGCA Regulatory Compliance'],
    qualifications: ['QP-AER/Q0801 (Drone Technician & Overhaul)', 'NSQF Level 4'],
    timeSeries: generateSeries(560, 240, 0.39, 36),
    explainability: [
      { name: 'Kisan Drone Subsidies & Agri Spraying', impactPercent: 41, description: 'Surge in fertilizer drone deployment across agrarian belts in Eastern UP & Vidarbha', signalType: 'vacancy' }
    ]
  },

  // 7. Community Health Assistant
  {
    ncoCode: '3253.0101',
    title: 'Community Health Assistant',
    titleHi: 'सामुदायिक स्वास्थ्य सहायक',
    sector: 'Healthcare & Life Sciences',
    nsqfLevel: 4,
    currentDemand: 890,
    growthRate6M: 16.2,
    effectiveSupply: 620,
    gapScore: 68,
    severity: 'Moderate Shortage',
    shortageProbability6M: 61,
    forecastDemand6M: 1030,
    demandPressureIndex: 73,
    confidence: 85,
    employerCount: 68,
    averageWageINR: 19500,
    stagedSupply: {
      trainingSeats: 290,
      enrolled: 270,
      certified: 245,
      availableLabour: 720,
      effectiveEmployableSupply: 620,
      seatUtilizationRate: 0.93,
      certificationRate: 0.90,
      laborParticipationRate: 0.82,
      employabilityFactor: 0.79
    },
    districtConcentrations: [
      { district: 'Gorakhpur', state: 'Uttar Pradesh', demand: 890 },
      { district: 'Dharwad', state: 'Karnataka', demand: 480 },
      { district: 'Nashik', state: 'Maharashtra', demand: 530 }
    ],
    keySkills: ['Primary Triage & Vitals Monitoring', 'Point-of-Care Diagnostic Testing', 'Immunization Logistics', 'EHR Entry'],
    qualifications: ['QP-HSS/Q5101 (General Duty Assistant)', 'NSQF Level 4'],
    timeSeries: generateSeries(890, 620, 0.16, 36),
    explainability: [
      { name: 'Ayushman Arogya Mandir Rural Clinics Expansion', impactPercent: 28, description: 'Government rural health post staffing targets driving district hiring', signalType: 'vacancy' }
    ]
  },

  // 8. Smart Meter Installation Technician
  {
    ncoCode: '7131.0101',
    title: 'Smart Meter Installation Technician',
    titleHi: 'स्मार्ट मीटर स्थापना तकनीशियन',
    sector: 'Green Jobs & Renewable Energy',
    nsqfLevel: 3,
    currentDemand: 740,
    growthRate6M: 29.5,
    effectiveSupply: 390,
    gapScore: 81,
    severity: 'Severe Shortage',
    shortageProbability6M: 73,
    forecastDemand6M: 960,
    demandPressureIndex: 88,
    confidence: 80,
    employerCount: 42,
    averageWageINR: 21000,
    stagedSupply: {
      trainingSeats: 160,
      enrolled: 150,
      certified: 135,
      availableLabour: 460,
      effectiveEmployableSupply: 390,
      seatUtilizationRate: 0.94,
      certificationRate: 0.90,
      laborParticipationRate: 0.83,
      employabilityFactor: 0.77
    },
    districtConcentrations: [
      { district: 'Gorakhpur', state: 'Uttar Pradesh', demand: 740 },
      { district: 'Lucknow', state: 'Uttar Pradesh', demand: 820 },
      { district: 'Ahmedabad', state: 'Gujarat', demand: 610 }
    ],
    keySkills: ['Single-Phase & Three-Phase Smart Meter Retrofit', 'Cellular RF Mesh Pairing', 'Tamper Detection', 'DISCOM Portal Handshake'],
    qualifications: ['QP-PSS/Q0110 (Smart Meter Technician)', 'NSQF Level 3'],
    timeSeries: generateSeries(740, 390, 0.30, 36),
    explainability: [
      { name: 'RDSS National Smart Meter Rollout Mandate', impactPercent: 37, description: 'DISCOM contracts requiring 100% smart prepaid meter deployment', signalType: 'vacancy' }
    ]
  },

  // 9. Industrial Automation Specialist
  {
    ncoCode: '7412.0101',
    title: 'Industrial Automation Specialist',
    titleHi: 'औद्योगिक स्वचालन विशेषज्ञ',
    sector: 'Automotive & Advanced Manufacturing',
    nsqfLevel: 5,
    currentDemand: 880,
    growthRate6M: 19.3,
    effectiveSupply: 540,
    gapScore: 76,
    severity: 'Severe Shortage',
    shortageProbability6M: 68,
    forecastDemand6M: 1050,
    demandPressureIndex: 84,
    confidence: 83,
    employerCount: 74,
    averageWageINR: 32000,
    stagedSupply: {
      trainingSeats: 210,
      enrolled: 195,
      certified: 175,
      availableLabour: 630,
      effectiveEmployableSupply: 540,
      seatUtilizationRate: 0.93,
      certificationRate: 0.89,
      laborParticipationRate: 0.86,
      employabilityFactor: 0.81
    },
    districtConcentrations: [
      { district: 'Pune', state: 'Maharashtra', demand: 880 },
      { district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', demand: 710 },
      { district: 'Vadodara', state: 'Gujarat', demand: 640 }
    ],
    keySkills: ['PLC Programming (Siemens/Allen-Bradley)', 'SCADA Configuration', 'Industrial Ethernet / Modbus', 'Pneumatic Actuators'],
    qualifications: ['QP-IAS/Q8001 (Automation Engineer Associate)', 'NSQF Level 5'],
    timeSeries: generateSeries(880, 540, 0.20, 36),
    explainability: [
      { name: 'Smart Factory & Industry 4.0 Retrofits', impactPercent: 29, description: 'Auto-ancillary Tier-1 plants converting manual lines to automated cobot stations', signalType: 'vacancy' }
    ]
  },

  // 10. Tele-Sales Executive (Oversupplied)
  {
    ncoCode: '5244.0101',
    title: 'Tele-Sales Executive',
    titleHi: 'टेली-सेल्स एक्जीक्यूटिव',
    sector: 'Retail, Logistics & Supply Chain',
    nsqfLevel: 3,
    currentDemand: 510,
    growthRate6M: -6.4,
    effectiveSupply: 810,
    gapScore: 28,
    severity: 'Severe Oversupply',
    shortageProbability6M: 16,
    forecastDemand6M: 475,
    demandPressureIndex: 35,
    confidence: 86,
    employerCount: 45,
    averageWageINR: 15000,
    stagedSupply: {
      trainingSeats: 720,
      enrolled: 690,
      certified: 630,
      availableLabour: 960,
      effectiveEmployableSupply: 810,
      seatUtilizationRate: 0.96,
      certificationRate: 0.91,
      laborParticipationRate: 0.77,
      employabilityFactor: 0.72
    },
    districtConcentrations: [
      { district: 'Lucknow', state: 'Uttar Pradesh', demand: 510 },
      { district: 'Mumbai Suburban', state: 'Maharashtra', demand: 1200 },
      { district: 'Bengaluru Urban', state: 'Karnataka', demand: 980 }
    ],
    keySkills: ['Cold Calling & Script Adherence', 'Lead Management CRM', 'Objection Handling'],
    qualifications: ['QP-BPO/Q0201 (Domestic Tele-Sales Associate)', 'NSQF Level 3'],
    timeSeries: generateSeries(510, 810, -0.07, 36),
    explainability: [
      { name: 'AI Voice Agents & Conversational Bots', impactPercent: -27, description: 'Outbound qualification calls automated through LLM voice bots', signalType: 'vacancy' }
    ]
  },

  // 11. General Data Entry Operator (Oversupplied)
  {
    ncoCode: '4132.0101',
    title: 'General Data Entry Operator',
    titleHi: 'डाटा एंट्री ऑपरेटर',
    sector: 'IT & ITES',
    nsqfLevel: 3,
    currentDemand: 380,
    growthRate6M: -11.2,
    effectiveSupply: 890,
    gapScore: 19,
    severity: 'Severe Oversupply',
    shortageProbability6M: 8,
    forecastDemand6M: 335,
    demandPressureIndex: 26,
    confidence: 88,
    employerCount: 34,
    averageWageINR: 13500,
    stagedSupply: {
      trainingSeats: 940,
      enrolled: 900,
      certified: 840,
      availableLabour: 1100,
      effectiveEmployableSupply: 890,
      seatUtilizationRate: 0.96,
      certificationRate: 0.93,
      laborParticipationRate: 0.73,
      employabilityFactor: 0.70
    },
    districtConcentrations: [
      { district: 'Gorakhpur', state: 'Uttar Pradesh', demand: 380 },
      { district: 'Nagpur', state: 'Maharashtra', demand: 420 },
      { district: 'Dharwad', state: 'Karnataka', demand: 290 }
    ],
    keySkills: ['Keyboard Typing 35 WPM', 'MS Excel Formatting', 'Scanning Documents'],
    qualifications: ['QP-SSC/Q2212 (Domestic Data Entry Operator)', 'NSQF Level 3'],
    timeSeries: generateSeries(380, 890, -0.12, 36),
    explainability: [
      { name: 'OCR & Document AI Auto-Extraction', impactPercent: -34, description: 'Direct ingestion of invoices and forms replacing manual transcription batches', signalType: 'vacancy' }
    ]
  },

  // 12. Cybersecurity Operations Associate
  {
    ncoCode: '2529.0101',
    title: 'Cybersecurity Operations Associate',
    titleHi: 'साइबर सुरक्षा सहयोगी',
    sector: 'IT & ITES',
    nsqfLevel: 5,
    currentDemand: 1320,
    growthRate6M: 24.5,
    effectiveSupply: 710,
    gapScore: 80,
    severity: 'Severe Shortage',
    shortageProbability6M: 72,
    forecastDemand6M: 1640,
    demandPressureIndex: 87,
    confidence: 81,
    employerCount: 110,
    averageWageINR: 34000,
    stagedSupply: {
      trainingSeats: 280,
      enrolled: 260,
      certified: 230,
      availableLabour: 820,
      effectiveEmployableSupply: 710,
      seatUtilizationRate: 0.93,
      certificationRate: 0.88,
      laborParticipationRate: 0.86,
      employabilityFactor: 0.82
    },
    districtConcentrations: [
      { district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', demand: 1320 },
      { district: 'Bengaluru Urban', state: 'Karnataka', demand: 1850 },
      { district: 'Pune', state: 'Maharashtra', demand: 1220 }
    ],
    keySkills: ['SIEM Alert Triage', 'Network Packet Analysis', 'Endpoint Detection & Response (EDR)', 'Vulnerability Scanning'],
    qualifications: ['QP-SSC/Q0909 (SOC Analyst Tier 1)', 'NSQF Level 5'],
    timeSeries: generateSeries(1320, 710, 0.25, 36),
    explainability: [
      { name: 'CERT-In Compliance Directives', impactPercent: 31, description: 'Mandatory 6-hour incident reporting requirements expanding 24x7 SOC headcounts', signalType: 'vacancy' }
    ]
  }
];

export const EARLY_WARNING_ALERTS: EarlyWarningAlert[] = [
  {
    id: 'ALR-2026-UP-001',
    severity: 'critical',
    type: 'persistent_shortage',
    title: 'Persistent Severe Shortage: Solar PV Installer in Gorakhpur',
    titleHi: 'लगातार गंभीर कमी: गोरखपुर में सोलर पीवी इंस्टॉलर',
    geography: 'Gorakhpur, Uttar Pradesh',
    geographyHi: 'गोरखपुर, उत्तर प्रदेश',
    occupation: 'Solar PV Installer',
    occupationHi: 'सोलर पीवी इंस्टॉलर',
    ncoCode: '7126.0101',
    trigger: 'Persistent acute shortage across all 3 recent quarters (Gap Score 94/100, 3/3 periods in Severe Shortage >= 75). Demand stands at 808 vacancies against 97 employable candidates (deficit: 711).',
    triggerHi: 'सभी 3 हालिया तिमाहियों में लगातार गंभीर कमी (अंतर स्कोर 94/100, गंभीर कमी >= 75 में 3/3 अवधियां)। 97 रोजगार योग्य उम्मीदवारों के मुकाबले 808 रिक्तियों की मांग (घाटा: 711)।',
    forecastHorizon: '6M',
    confidence: 91,
    recommendedAction: 'Package recommendation (Strict default): Reallocate 97 excess physical seats from Retail Sales Associate (saving ₹6.3L vs new capacity) + sanction 150 greenfield lab seats (+₹12L capex) to close 15.6% of deficit (17.2% with +10% candidate mobility on added supply).',
    recommendedActionHi: 'पैकेज सिफारिश (कठोर डिफ़ॉल्ट): रिटेल सेल्स एसोसिएट से 97 अधिशेष भौतिक सीटें पुनर्आवंटित करें (नई क्षमता के मुकाबले ₹6.3 लाख की बचत) + घाटे के 15.6% को पाटने के लिए 150 ग्रीनफील्ड लैब सीटें (+₹12 लाख पूंजीगत व्यय) स्वीकृत करें (अतिरिक्त आपूर्ति पर +10% उम्मीदवार गतिशीलता के साथ 17.2%)।',
    context: 'Context, not model output: Aligns with PM Surya Ghar Muft Bijli Yojana rooftop solar rollout targets in Purvanchal.',
    contextHi: 'संदर्भ, मॉडल आउटपुट नहीं: पूर्वांचल में पीएम सूर्य घर मुफ्त बिजली योजना रूफटॉप सौर स्थापना लक्ष्यों के अनुरूप।',
    timestamp: '2026-10-05 08:00 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-GJ-002',
    severity: 'critical',
    type: 'emerging_shortage',
    title: 'Emerging Shortage: Drone Maintenance Technician in Rajkot',
    titleHi: 'गंभीर कमी की चेतावनी: राजकोट में ड्रोन मेंटेनेंस तकनीशियन',
    geography: 'Rajkot, Gujarat',
    geographyHi: 'राजकोट, गुजरात',
    occupation: 'Drone Maintenance Technician',
    occupationHi: 'ड्रोन मेंटेनेंस तकनीशियन',
    ncoCode: '7212.0101',
    trigger: '6M demand surged +17.0% reaching 193 vacancies against only 6 employable candidates (deficit: 187 candidates; available supply 8, readiness rate 0.70).',
    triggerHi: '6 माह की मांग में +17.0% का उछाल, केवल 6 रोजगार योग्य उम्मीदवारों के मुकाबले 193 रिक्तियां (घाटा: 187 उम्मीदवार; उपलब्ध आपूर्ति 8, तैयारी दर 0.70)।',
    forecastHorizon: '6M',
    confidence: 78,
    recommendedAction: 'Sizing arithmetic: 187 candidate deficit / 0.3733 seat-to-candidate funnel conversion requires 501 seats for 100% closure (401 seats for 80% target). Phase-1 recommended sanction of 148 seats provides ~55 employable candidates (closing 29.4% of deficit).',
    recommendedActionHi: 'आकार निर्धारण अंकगणित: 187 उम्मीदवार घाटे / 0.3733 सीट-से-उम्मीदवार फ़नल रूपांतरण के लिए 100% समाधान हेतु 501 सीटों की आवश्यकता है (80% लक्ष्य के लिए 401 सीटें)। चरण-1 में 148 सीटों की अनुशंसित स्वीकृति ~55 रोजगार योग्य उम्मीदवार प्रदान करती है (घाटे का 29.4% समाधान)।',
    context: 'Context, not model output: Driven by Saurashtra agricultural spraying drone subsidies and industrial inspection contracts.',
    contextHi: 'संदर्भ, मॉडल आउटपुट नहीं: सौराष्ट्र में कृषि छिड़काव ड्रोन सब्सिडी और औद्योगिक निरीक्षण अनुबंधों से प्रेरित।',
    timestamp: '2026-10-05 06:30 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-UP-003',
    severity: 'warning',
    type: 'capacity_inefficiency',
    title: 'Capacity Inefficiency: Retail Sales Associate in Gorakhpur',
    titleHi: 'क्षमता अक्षमता चेतावनी: गोरखपुर में रिटेल सेल्स एसोसिएट',
    geography: 'Gorakhpur, Uttar Pradesh',
    geographyHi: 'गोरखपुर, उत्तर प्रदेश',
    occupation: 'Retail Sales Associate',
    occupationHi: 'रिटेल सेल्स एसोसिएट',
    ncoCode: '5223.0101',
    wastedSeats: 536,
    trigger: 'Physical training capacity (916 seats) exceeds local hiring demand by 536 seats (141% over 380 demand). Gap Score is 47 (Balanced labor pool), but physical classroom seats are severely underutilized.',
    triggerHi: 'भौतिक प्रशिक्षण क्षमता (916 सीटें) स्थानीय भर्ती मांग से 536 सीटें अधिक है (380 मांग से 141% अधिक)। अंतर स्कोर 47 (संतुलित श्रम पूल) है, लेकिन भौतिक कक्षा सीटें अत्यधिक कम उपयोग में हैं।',
    forecastHorizon: '6M',
    confidence: 84,
    recommendedAction: 'Freeze new batch approvals and reallocate 97 physical training seats (Strict safety limit: donor deficit stays <= 5%, Score <= 52 Balanced) to Solar PV Installer via ₹6,500/seat retrofit kit.',
    recommendedActionHi: 'नए बैच की स्वीकृतियों को रोकें और सोलर पीवी इंस्टॉलर को ₹6,500/सीट रेट्रोफिट किट के माध्यम से 97 भौतिक प्रशिक्षण सीटें पुनर्आवंटित करें (कठोर सुरक्षा सीमा: दाता घाटा <= 5%, स्कोर <= 52 संतुलित)।',
    context: 'Context, not model output: High classroom seats reflect historical PMKVY 2.0 batch allocations prior to demand-driven curriculum rebalancing.',
    contextHi: 'संदर्भ, मॉडल आउटपुट नहीं: उच्च कक्षा सीटें मांग-संचालित पाठ्यक्रम पुनर्संतुलन से पहले ऐतिहासिक पीएमकेवीवाई 2.0 बैच आवंटन को दर्शाती हैं।',
    timestamp: '2026-10-04 18:20 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-MH-004',
    severity: 'warning',
    type: 'skill_obsolescence',
    title: 'Skill Obsolescence Risk: Sewing Machine Operator in Chhatrapati Sambhajinagar',
    titleHi: 'अप्रचलन जोखिम: छत्रपति संभाजीनगर में सिलाई मशीन ऑपरेटर',
    geography: 'Chhatrapati Sambhajinagar, Maharashtra',
    geographyHi: 'छत्रपति संभाजीनगर, महाराष्ट्र',
    occupation: 'Sewing Machine Operator',
    occupationHi: 'सिलाई मशीन ऑपरेटर',
    ncoCode: '8153.0101',
    trigger: 'Structural decline of 9.6% in vacancies over past 12 months (demand contracted from 312 to 282).',
    triggerHi: 'पिछले 12 महीनों में रिक्तियों में 9.6% की ढांचागत गिरावट (मांग 312 से घटकर 282 रह गई)।',
    forecastHorizon: '6M',
    confidence: 82,
    recommendedAction: 'Deploy bridging upskilling modules to transition workers into automated apparel manufacturing and technical textiles.',
    recommendedActionHi: 'श्रमिकों को स्वचालित परिधान निर्माण और तकनीकी वस्त्रों में स्थानांतरित करने के लिए ब्रिजिंग अपस्किलिंग मॉड्यूल तैनात करें।',
    context: 'Context, not model output: Regional garment sector export slowdown reported in industry surveys.',
    contextHi: 'संदर्भ, मॉडल आउटपुट नहीं: उद्योग सर्वेक्षणों में क्षेत्रीय परिधान क्षेत्र के निर्यात में मंदी दर्ज की गई।',
    timestamp: '2026-10-04 11:30 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-UP-005',
    severity: 'warning',
    type: 'capacity_inefficiency',
    title: 'Capacity Inefficiency: Data Entry Operator in Gorakhpur',
    titleHi: 'क्षमता अक्षमता जोखिम: गोरखपुर में डाटा एंट्री ऑपरेटर',
    geography: 'Gorakhpur, Uttar Pradesh',
    geographyHi: 'गोरखपुर, उत्तर प्रदेश',
    occupation: 'Data Entry Operator',
    occupationHi: 'डेटा एंट्री ऑपरेटर',
    ncoCode: '4132.0101',
    wastedSeats: 410,
    trigger: 'Physical training capacity (754 seats) exceeds local hiring demand by 410 seats (119% over 344 demand). Effective candidate supply is 391 against 344 demand (Gap Score 44, Balanced).',
    triggerHi: 'भौतिक प्रशिक्षण क्षमता (754 सीटें) स्थानीय भर्ती मांग से 410 सीटें अधिक है (344 मांग से 119% अधिक)। 344 मांग के मुकाबले प्रभावी उम्मीदवार आपूर्ति 391 है (अंतर स्कोर 44, संतुलित)।',
    forecastHorizon: '6M',
    confidence: 84,
    recommendedAction: 'Transition underutilized IT lab capacity into AI Prompt Engineering, Cloud Data Annotation, and Logistics ERP modules.',
    recommendedActionHi: 'कम उपयोग की जाने वाली आईटी लैब क्षमता को एआई प्रॉम्प्ट इंजीनियरिंग, क्लाउड डेटा एनोटेशन और लॉजिस्टिक्स ईआरपी मॉड्यूल में बदलें।',
    context: 'Context, not model output: Routine clerical data entry roles face consolidation from cloud-based automated document processing.',
    contextHi: 'संदर्भ, मॉडल आउटपुट नहीं: क्लाउड-आधारित स्वचालित दस्तावेज़ प्रसंस्करण से नियमित लिपिकीय डेटा प्रविष्टि भूमिकाओं का समेकन हो रहा है।',
    timestamp: '2026-10-03 14:10 IST',
    acknowledged: true
  }
];

export const ALERTS = EARLY_WARNING_ALERTS;

export const RECOMMENDATIONS: Recommendation[] = [
  // 1. HERO RECOMMENDATION (Section 16, 28, 57)
  {
    id: 'REC-2026-01',
    rank: 1,
    title: 'Redirect 97 Training Seats from Retail to Solar PV (Strict Default)',
    titleHi: 'रिटेल से सोलर पीवी में 97 प्रशिक्षण सीटें स्थानांतरित करें (सख्त डिफ़ॉल्ट)',
    type: 'capacity_reallocation',
    fromTrade: 'Retail Sales Associate',
    fromTradeHi: 'रिटेल सेल्स एसोसिएट',
    fromNco: '5223.0101',
    toTrade: 'Solar PV Installer',
    toTradeHi: 'सोलर पीवी इंस्टॉलर',
    toNco: '7126.0101',
    district: 'Gorakhpur',
    state: 'Uttar Pradesh',
    recommendedSeats: 97,
    reason: 'Persistent acute shortage in Solar PV Installer (deficit 711, score 94) paired with physical capacity inefficiency in Retail Sales (916 seats, 536 wasted seats over demand). Strict safety rule guarantees Retail deficit ratio remains <= 5% (Score <= 52 Balanced).',
    reasonHi: 'सोलर पीवी इंस्टॉलर में लगातार गंभीर कमी (711 घाटा, स्कोर 94) और रिटेल सेल्स में भौतिक क्षमता अक्षमता (916 सीटें, मांग से अधिक 536 बर्बाद सीटें)। सख्त सुरक्षा नियम सुनिश्चित करता है कि रिटेल घाटा अनुपात <= 5% (स्कोर <= 52 संतुलित) बना रहे।',
    evidence: {
      demandSignal: 'NCS, state tenders and regional contractor job postings indicate 808 verified vacancies against 97 employable candidates.',
      vacancyGrowth: 'Verified vacancies expanded to 808 with only 217 local training seats available in Gorakhpur district.',
      supplyStagnation: 'Retail training centres report 44.9% placement rate with 536 underutilized physical classroom seats.',
      employerHiringTrend: '46 local EPC contractors signed letters of intent with NSDC for rooftop solar installations under PM Surya Ghar Muft Bijli Yojana.'
    },
    constraints: 'Requires electrical lab equipment retrofit kit estimated at ₹6,500 per seat (total retrofit capex ₹6.3 Lakhs — planning assumption).',
    expectedImpact: {
      gapReductionPercent: 6.2,
      supplyCoveragePercent: 6,
      estimatedCostINR: 630500 // ₹6.3 Lakhs
    },
    confidence: 82,
    status: 'pending'
  },
  {
    id: 'REC-2026-02',
    rank: 2,
    title: 'Establish EV Powertrain Diagnostics Hub in Pune ITIs',
    titleHi: 'पुणे आईटीआई में ईवी पावरट्रेन डायग्नोस्टिक्स हब स्थापित करें',
    type: 'seat_expansion',
    toTrade: 'EV Service Technician',
    toTradeHi: 'ईवी सर्विस तकनीशियन',
    toNco: '7233.0102',
    district: 'Pune',
    state: 'Maharashtra',
    recommendedSeats: 400,
    reason: 'Severe shortage of high-voltage certified mechanics across automotive OEM clusters in Chakan & Bhosari.',
    reasonHi: 'चाकन और भोसरी में ऑटोमोटिव ओईएम समूहों में उच्च-वोल्टेज प्रमाणित मैकेनिकों की भारी कमी।',
    evidence: {
      demandSignal: 'EV 2W/3W registration in Maharashtra grew 44% YoY, outpacing certified service technicians by 3.2x.',
      vacancyGrowth: 'Dealership service bays reporting 35+ days lead time to hire qualified battery diagnostic personnel.',
      supplyStagnation: 'Only 38 training facilities currently equipped with live BMS simulators in the region.',
      employerHiringTrend: 'Auto ancillary consortium willing to fund 50% CSR co-investment for training rigs.'
    },
    constraints: 'High-voltage safety clearances required under CEA regulations prior to live pack testing.',
    expectedImpact: {
      gapReductionPercent: 54,
      supplyCoveragePercent: 18,
      estimatedCostINR: 5800000 // ₹58 Lakhs
    },
    confidence: 81,
    status: 'pending'
  },
  {
    id: 'REC-2026-03',
    rank: 3,
    title: 'Launch Indic AI Annotation Hub in Lucknow Satellite Centers',
    titleHi: 'लखनऊ में इंडिक एआई एनोटेशन हब शुरू करें',
    type: 'new_curriculum',
    toTrade: 'AI/ML Data Annotation Specialist',
    toTradeHi: 'एआई डेटा एनोटेशन विशेषज्ञ',
    toNco: '2512.0101',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    recommendedSeats: 350,
    reason: 'National Bhashini Indic language evaluation mandates opening high-volume remote and hybrid data jobs for Hindi/Bhojpuri linguists.',
    reasonHi: 'राष्ट्रीय भाषिणी इंडिक भाषा मूल्यांकन हिंदी/भोजपुरी भाषाविदों के लिए उच्च मात्रा में रिमोट और हाइब्रिड डेटा नौकरियों के सृजन को अनिवार्य करता है।',
    evidence: {
      demandSignal: 'Over 540 open positions posted across digital services vendors in Lucknow & Kanpur corridor.',
      vacancyGrowth: '32.1% demand acceleration in regional tech hubs outside metropolitan areas.',
      supplyStagnation: 'Lack of formalized NSQF-aligned training curriculum in tier-2 colleges.',
      employerHiringTrend: '3 major IT BPM firms committed to hiring 600 candidates upon qualification pack certification.'
    },
    constraints: 'Requires high-speed broadband computer labs with dual-monitor setups.',
    expectedImpact: {
      gapReductionPercent: 58,
      supplyCoveragePercent: 21,
      estimatedCostINR: 2400000 // ₹24 Lakhs
    },
    confidence: 86,
    status: 'pending'
  },
  {
    id: 'REC-2026-04',
    rank: 4,
    title: 'Deploy Agricultural Drone Maintenance Cohort in Varanasi',
    titleHi: 'वाराणसी में कृषि ड्रोन रखरखाव बैच तैनात करें',
    type: 'employer_partnership',
    toTrade: 'Drone Maintenance Technician',
    toTradeHi: 'ड्रोन मेंटेनेंस तकनीशियन',
    toNco: '7212.0101',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    recommendedSeats: 200,
    reason: 'Surge in drone spraying pilots under PM Krishi Sinchayee Yojana requires localized field repair hubs.',
    reasonHi: 'पीएम कृषि सिंचाई योजना के तहत ड्रोन छिड़काव पायलटों में वृद्धि के लिए स्थानीयकृत फील्ड मरम्मत हब की आवश्यकता है।',
    evidence: {
      demandSignal: '560 active hiring signals across Eastern UP FPOs (Farmer Producer Organizations).',
      vacancyGrowth: '38.4% growth in field repair requests following seasonal pesticide spraying cycles.',
      supplyStagnation: 'Zero authorized DGCA-aligned drone repair training centers currently in Varanasi division.',
      employerHiringTrend: 'FPO federations willing to absorb 100% of certified technicians on fixed retainer.'
    },
    constraints: 'Requires DGCA drone safety zone certification for outdoor flight test corridors.',
    expectedImpact: {
      gapReductionPercent: 65,
      supplyCoveragePercent: 25,
      estimatedCostINR: 3600000 // ₹36 Lakhs
    },
    confidence: 76,
    status: 'pending'
  }
];

export const DATA_HEALTH_METRIC: DataHealthMetric = {
  sourcesConnected: 8,
  sourcesTotal: 11,
  freshnessPercent: 98,
  mappingConfidencePercent: 91,
  forecastConfidencePercent: 78,
  dataQualityPercent: 94,
  lastRunTimestamp: '2 hours ago (2026-10-04 08:30 IST)',
  lastRunId: 'RUN-2026-10-04-001',
  models: [
    {
      name: 'Tri-Model Ensemble Blend (Production: LGB + Theta + ETS)',
      wape: 3.46,
      mae: 16.85,
      lastTrained: '2026-10-05 19:15 IST',
      status: 'optimal'
    },
    {
      name: 'Theta Decomposition Method',
      wape: 4.93,
      mae: 22.14,
      lastTrained: '2026-10-05 19:15 IST',
      status: 'optimal'
    },
    {
      name: 'LightGBM Lagged Regressor',
      wape: 5.29,
      mae: 25.45,
      lastTrained: '2026-10-05 19:15 IST',
      status: 'healthy'
    },
    {
      name: 'ETS (Holt-Winters Baseline)',
      wape: 3.92,
      mae: 19.06,
      lastTrained: '2026-10-05 19:15 IST',
      status: 'optimal'
    },
    {
      name: 'Seasonal Naive Lag-12 Benchmark',
      wape: 6.26,
      mae: 29.06,
      lastTrained: '2026-10-05 19:15 IST',
      status: 'healthy'
    }
  ],
  backtestHorizons: [
    { horizon: '3M', model: 'Tri-Model Ensemble Blend (Production)', wape: 5.31, mase: 0.786, coverage_80: 79.4, coverage_95: 96.6, sample_count: 1536 },
    { horizon: '3M', model: 'Theta Method', wape: 4.93, mase: 0.730, coverage_80: 79.2, coverage_95: 95.9, sample_count: 1536 },
    { horizon: '3M', model: 'LightGBM (Lagged Gradient Boosting)', wape: 5.67, mase: 0.839, coverage_80: 80.1, coverage_95: 95.0, sample_count: 1536 },
    { horizon: '3M', model: 'ETS (Holt-Winters)', wape: 5.97, mase: 0.884, coverage_80: 78.5, coverage_95: 96.8, sample_count: 1536 },
    { horizon: '3M', model: 'Seasonal Naive Baseline', wape: 6.94, mase: 1.028, coverage_80: 80.6, coverage_95: 95.8, sample_count: 1536 },

    { horizon: '6M', model: 'Tri-Model Ensemble Blend (Production)', wape: 6.25, mase: 0.956, coverage_80: 78.5, coverage_95: 96.4, sample_count: 1536 },
    { horizon: '6M', model: 'Theta Method', wape: 5.91, mase: 0.904, coverage_80: 76.4, coverage_95: 96.8, sample_count: 1536 },
    { horizon: '6M', model: 'Seasonal Naive Baseline', wape: 6.26, mase: 0.958, coverage_80: 78.8, coverage_95: 95.4, sample_count: 1536 },
    { horizon: '6M', model: 'ETS (Holt-Winters)', wape: 6.69, mase: 1.023, coverage_80: 78.3, coverage_95: 97.4, sample_count: 1536 },
    { horizon: '6M', model: 'LightGBM (Lagged Gradient Boosting)', wape: 7.11, mase: 1.088, coverage_80: 78.1, coverage_95: 94.1, sample_count: 1536 },

    { horizon: '12M', model: 'Tri-Model Ensemble Blend (Production)', wape: 3.46, mase: 0.555, coverage_80: 79.2, coverage_95: 94.7, sample_count: 1536 },
    { horizon: '12M', model: 'ETS (Holt-Winters)', wape: 3.92, mase: 0.628, coverage_80: 80.1, coverage_95: 94.9, sample_count: 1536 },
    { horizon: '12M', model: 'Theta Method', wape: 4.40, mase: 0.706, coverage_80: 79.2, coverage_95: 94.8, sample_count: 1536 },
    { horizon: '12M', model: 'LightGBM (Lagged Gradient Boosting)', wape: 5.29, mase: 0.849, coverage_80: 80.5, coverage_95: 93.5, sample_count: 1536 },
    { horizon: '12M', model: 'Seasonal Naive Baseline', wape: 6.70, mase: 1.075, coverage_80: 80.2, coverage_95: 94.9, sample_count: 1536 }
  ],
  sources: [
    { name: 'National Career Service (NCS) Demand Aggregates', type: 'Public Aggregate', status: 'Active', records: '2.4M Vacancy Records', latency: '45 ms' },
    { name: 'Skill India Digital Hub (SIDH) Training Capacity', type: 'Public Aggregate', status: 'Active', records: '14,200 Training Centres', latency: '60 ms' },
    { name: 'e-Shram Informal Labour Registrations', type: 'Public Aggregate', status: 'Active', records: '298M Worker Profiles', latency: '120 ms' },
    { name: 'NCO-2015 / LGD Standardisation Hierarchy', type: 'Public Aggregate', status: 'Synced', records: '4,820 Occupation Codes', latency: '12 ms' },
    { name: 'Periodic Labour Force Survey (PLFS) District Benchmarks', type: 'Public Aggregate', status: 'Synced', records: '128K Survey Samples', latency: '80 ms' },
    { name: 'National Apprenticeship Promotion Scheme (NAPS)', type: 'Public Aggregate', status: 'Active', records: '540K Active Contracts', latency: '95 ms' },
    { name: 'Private Job Portals Multi-Source Aggregator', type: 'Demo Dataset', status: 'Active', records: '1.8M Scraped Listings', latency: '140 ms' },
    { name: 'MSDE Purvanchal Pilot Ground Assessment', type: 'Demo Dataset', status: 'Active', records: '18 Local Employer Audits', latency: '30 ms' },
    { name: 'Direct EPFO Payroll Real-Time Stream', type: 'Planned Government Feed', status: 'Pending', records: 'In MoL&E Integration Sandbox', latency: 'N/A' },
    { name: 'State Directorate of Employment & Training (DET) API', type: 'Planned Government Feed', status: 'Pending', records: 'Awaiting State API Gateway', latency: 'N/A' },
    { name: 'GST E-Way Bill Industrial Transport Signal', type: 'Planned Government Feed', status: 'Pending', records: 'Scheduled Phase-2 Feed', latency: 'N/A' }
  ]
};

export const COPILOT_KNOWLEDGE = [
  {
    query: 'solar',
    queryHi: 'सोलर',
    answerEn: 'Solar PV Installer (NCO 7126.0101) in Gorakhpur has an acute Gap Score of 93/100 (Severe Shortage). Current demand is 808 positions, while effective employable supply is only 118 (initial deficit: 690). Primary driver is rooftop solar installations under PM Surya Ghar. Recommended action: Redirect 500 training seats from oversupplied Retail Sales Associate to Solar PV Installer (+150 new center seats, 10% mobility), expanding supply to 506 and reducing the net deficit by 56% (to 302), bringing the Gap Score down to 69/100 (Moderate Shortage).',
    answerHi: 'गोरखपुर में सोलर पीवी इंस्टॉलर (NCO 7126.0101) का गैप स्कोर 93/100 (गंभीर कमी) है। वर्तमान मांग 808 है, जबकि प्रभावी रोजगार योग्य आपूर्ति केवल 118 है (शुरुआती कमी: 690)। मुख्य कारण पीएम सूर्य घर योजना के तहत रूफटॉप अनुबंध हैं। अनुशंसित कार्य: रिटेल सेल्स एसोसिएट से 500 प्रशिक्षण सीटें सोलर पीवी में पुनर्वितरित करें (+150 नई केंद्र सीटें, 10% गतिशीलता), जिससे आपूर्ति 506 तक बढ़ेगी और कमी 56% घटकर 302 रह जाएगी, तथा गैप स्कोर 69/100 (मध्यम कमी) हो जाएगा।',
    runId: 'RUN-2026-10-04-001',
    confidence: 82
  },
  {
    query: 'gorakhpur',
    queryHi: 'गोरखपुर',
    answerEn: 'Gorakhpur District shows acute shortage in green and technical trades: 1) Solar PV Installer (Gap Score 93, Deficit 690), 2) Smart Meter Technician (Gap Score 95), and 3) EV Service Technician (Gap Score 94). Concurrently, Retail Sales Associate has excess capacity (916 seats vs 380 demand). Reallocating 500 seats from Retail to Solar via PuLP optimizer costs ₹32.5L and delivers a 56% deficit reduction, bringing Solar to 69/100 (Moderate Shortage).',
    answerHi: 'गोरखपुर जिले में हरित और तकनीकी व्यवसायों में भारी कमी है: 1) सोलर पीवी इंस्टॉलर (गैप स्कोर 93, कमी 690), 2) स्मार्ट मीटर तकनीशियन (गैप स्कोर 95), और 3) ईवी सर्विस तकनीशियन (गैप स्कोर 94)। इसके विपरीत, रिटेल सेल्स एसोसिएट में अतिरिक्त क्षमता है (916 सीटें बनाम 380 मांग)। PuLP ऑप्टिमाइज़र के माध्यम से रिटेल से सोलर में 500 सीटें स्थानांतरित करने से ₹32.5 लाख की लागत आती है और 56% घाटा कम होता है, जिससे सोलर गैप स्कोर 69/100 (मध्यम कमी) पर आ जाता है।',
    runId: 'RUN-2026-10-04-001',
    confidence: 85
  },
  {
    query: 'retail',
    queryHi: 'रिटेल',
    answerEn: 'Retail Sales Associate (NCO 5223.0101) has excess capacity across Purvanchal. In Gorakhpur, 916 training seats exist against 380 local employer demand. Placement rates stand at 44.9%. MSDE can safely reallocate 500 excess training seats to high-deficit green trades like Solar PV Installer without causing retail trade deficits.',
    answerHi: 'रिटेल सेल्स एसोसिएट (NCO 5223.0101) में पूर्वांचल में अतिरिक्त क्षमता है। गोरखपुर में, 380 स्थानीय मांग के मुकाबले 916 प्रशिक्षण सीटें हैं। प्लेसमेंट दर 44.9% है। एमएसडीई खुदरा ट्रेड में कमी पैदा किए बिना 500 अतिरिक्त सीटें सोलर पीवी जैसे उच्च कमी वाले व्यवसायों में सुरक्षित रूप से स्थानांतरित कर सकता है।',
    runId: 'RUN-2026-10-04-001',
    confidence: 84
  },
  {
    query: 'uttar pradesh',
    queryHi: 'उत्तर प्रदेश',
    answerEn: 'In Uttar Pradesh, MSDE should immediately prioritize training capacity expansions in Eastern UP (Purvanchal corridor): 1) Expand Solar PV Installer by 500 seats in Gorakhpur; 2) Launch Indic AI Data Annotation satellite centers (350 seats) in Lucknow; 3) Deploy Agricultural Drone Maintenance cohorts (200 seats) in Varanasi to support Kisan Drone initiatives.',
    answerHi: 'उत्तर प्रदेश में, एमएसडीई को तुरंत पूर्वांचल कॉरिडोर में प्रशिक्षण क्षमता विस्तार को प्राथमिकता देनी चाहिए: 1) गोरखपुर में 500 सोलर पीवी इंस्टॉलर सीटें बढ़ाएं; 2) लखनऊ में इंडिक एआई डाटा एनोटेशन सैटेलाइट सेंटर (350 सीटें) शुरू करें; 3) किसान ड्रोन पहलों का समर्थन करने के लिए वाराणसी में 200 कृषि ड्रोन मेंटेनेंस सीटें तैनात करें।',
    runId: 'RUN-2026-10-04-001',
    confidence: 80
  },
  {
    query: '500 seats',
    queryHi: '500 सीटें',
    answerEn: 'Policy Simulation Outcome: Reallocating 500 PMKVY training seats from Retail Sales Associate to Solar PV Installer in Gorakhpur (+150 new center seats, 10% mobility) expands effective employable supply from 118 to 506. This reduces the acute shortage deficit by 56% (from 690 to 302), shifting the Gap Score from 93/100 (Severe Shortage) to 69/100 (Moderate Shortage). Total conversion cost: ₹32.5 Lakhs.',
    answerHi: 'नीति सिमुलेशन परिणाम: गोरखपुर में रिटेल सेल्स एसोसिएट से सोलर पीवी इंस्टॉलर में 500 प्रशिक्षण सीटें पुनर्वितरित करने (+150 नई केंद्र सीटें, 10% गतिशीलता) से प्रभावी आपूर्ति 118 से बढ़कर 506 हो जाती है। यह कमी के घाटे को 56% (690 से 302) कम करता है और गैप स्कोर 93/100 (गंभीर कमी) से घटकर 69/100 (मध्यम कमी) हो जाता है। कुल रूपांतरण लागत: ₹32.5 लाख।',
    runId: 'RUN-2026-10-04-001',
    confidence: 85
  }
];
