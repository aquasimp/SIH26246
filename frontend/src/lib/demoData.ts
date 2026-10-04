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
    demandIndex: 78,
    effectiveSupplyIndex: 51,
    gapScore: 84,
    shortageProbability6M: 71,
    trainingCentresCount: 2,
    totalTrainingSeats: 180,
    topShortageTrades: ['Solar PV Installer', 'EV Service Technician', 'Smart Meter Technician'],
    topOversuppliedTrades: ['Retail Sales Associate', 'General Data Entry Operator'],
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
    currentDemand: 820,
    growthRate6M: 21.4,
    effectiveSupply: 430,
    gapScore: 84,
    severity: 'Severe Shortage',
    shortageProbability6M: 71,
    forecastDemand6M: 1020,
    demandPressureIndex: 91,
    confidence: 78,
    employerCount: 46,
    averageWageINR: 23500,
    stagedSupply: {
      trainingSeats: 180,
      enrolled: 165,
      certified: 145,
      availableLabour: 480,
      effectiveEmployableSupply: 430,
      seatUtilizationRate: 0.92,
      certificationRate: 0.88,
      laborParticipationRate: 0.82,
      employabilityFactor: 0.78
    },
    districtConcentrations: [
      { district: 'Gorakhpur', state: 'Uttar Pradesh', demand: 820 },
      { district: 'Varanasi', state: 'Uttar Pradesh', demand: 610 },
      { district: 'Ahmedabad', state: 'Gujarat', demand: 940 },
      { district: 'Nagpur', state: 'Maharashtra', demand: 520 }
    ],
    keySkills: ['Rooftop Inverter Wiring', 'Solar Panel Array Mounting', 'Grid Synchronization', 'Safety Compliance IEC 61215'],
    qualifications: ['QP-SGJ/Q0101 (Solar PV Installer Suryamitra)', 'NSQF Level 4 Certification'],
    timeSeries: generateSeries(820, 430, 0.24, 36),
    explainability: [
      { name: 'PM Surya Ghar Muft Bijli Yojana Subsidies', impactPercent: 31, description: 'Surge in residential rooftop installation contracts in Purvanchal region', signalType: 'vacancy' },
      { name: 'Regional EPC Contractor Hiring Expansion', impactPercent: 18, description: '46 local contracting agencies actively posting verified job requirements', signalType: 'employer' },
      { name: 'Industrial CAPEX Capex in Solar Parks', impactPercent: 12, description: 'State grid integration projects scheduled for Q1-Q2 2027 completion', signalType: 'capex' },
      { name: 'Skill Transition Momentum', impactPercent: 9, description: 'High demand for certified technicians with Net-metering experience', signalType: 'skill' },
      { name: 'Monsoon Seasonal Dampening Correction', impactPercent: -4, description: 'Slight slowdown in rooftop outdoor civil mounting during monsoon months', signalType: 'seasonality' }
    ]
  },

  // 2. Retail Sales Associate (HERO OVERSUPPLY OCCUPATION)
  {
    ncoCode: '5223.0101',
    title: 'Retail Sales Associate',
    titleHi: 'रिटेल सेल्स एसोसिएट',
    sector: 'Retail, Logistics & Supply Chain',
    nsqfLevel: 3,
    currentDemand: 420,
    growthRate6M: -8.2,
    effectiveSupply: 760,
    gapScore: 24,
    severity: 'Severe Oversupply',
    shortageProbability6M: 12,
    forecastDemand6M: 385,
    demandPressureIndex: 32,
    confidence: 84,
    employerCount: 38,
    averageWageINR: 14500,
    stagedSupply: {
      trainingSeats: 850,
      enrolled: 810,
      certified: 740,
      availableLabour: 920,
      effectiveEmployableSupply: 760,
      seatUtilizationRate: 0.95,
      certificationRate: 0.91,
      laborParticipationRate: 0.75,
      employabilityFactor: 0.70
    },
    districtConcentrations: [
      { district: 'Gorakhpur', state: 'Uttar Pradesh', demand: 420 },
      { district: 'Lucknow', state: 'Uttar Pradesh', demand: 890 },
      { district: 'Pune', state: 'Maharashtra', demand: 1100 },
      { district: 'Bengaluru Urban', state: 'Karnataka', demand: 1450 }
    ],
    keySkills: ['Point-of-Sale (POS) Operations', 'Customer Relationship Management', 'Inventory Stacking', 'Cash Reconciliation'],
    qualifications: ['QP-RAS/Q0104 (Retail Sales Associate)', 'NSQF Level 3 Certification'],
    timeSeries: generateSeries(420, 760, -0.09, 36),
    explainability: [
      { name: 'E-commerce & Quick-Commerce Shift', impactPercent: -22, description: 'Rapid shift to dark stores and automated fulfillment reducing brick-and-mortar store count', signalType: 'vacancy' },
      { name: 'Training Seat Overcapacity', impactPercent: 35, description: 'Legacy PMKVY batches producing 500+ excess candidates annually without local placement absorption', signalType: 'employer' },
      { name: 'High Attrition & Wage Stagnation', impactPercent: -14, description: 'Flat median salaries leading to workforce disillusionment and high churn', signalType: 'skill' }
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
    type: 'emerging_shortage',
    title: 'Severe Shortage Brewing: Solar PV Installer in Gorakhpur',
    titleHi: 'गंभीर कमी की चेतावनी: गोरखपुर में सोलर पीवी इंस्टॉलर',
    geography: 'Gorakhpur, Uttar Pradesh',
    occupation: 'Solar PV Installer',
    ncoCode: '7126.0101',
    trigger: 'Projected demand (+21.4%) outstripping effective training supply by 590 seats over 6-month horizon.',
    forecastHorizon: '6M',
    confidence: 78,
    recommendedAction: 'Reallocate 500 PMKVY/ITI training seats from oversupplied Retail Sales Associate to Solar PV Installer.',
    timestamp: '2026-10-04 06:30 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-MH-002',
    severity: 'critical',
    type: 'emerging_shortage',
    title: 'High Pressure Alert: EV Service Technicians in Pune Automotive Corridor',
    titleHi: 'उच्च मांग दबाव: पुणे ऑटोमोटिव कॉरिडोर में ईवी तकनीशियन',
    geography: 'Pune, Maharashtra',
    occupation: 'EV Service Technician',
    ncoCode: '7233.0102',
    trigger: 'Demand acceleration at 26.8% driven by commercial fleet mandates with only 38 training facilities.',
    forecastHorizon: '6M',
    confidence: 81,
    recommendedAction: 'Mandate OEM-sponsored high-voltage battery diagnostic laboratories across 8 key ITIs.',
    timestamp: '2026-10-04 05:45 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-UP-003',
    severity: 'warning',
    type: 'saturation_risk',
    title: 'Saturation Warning: Retail Sales Associate in Gorakhpur & Lucknow',
    titleHi: 'संतृप्ति चेतावनी: गोरखपुर एवं लखनऊ में रिटेल सेल्स एसोसिएट',
    geography: 'Gorakhpur, Uttar Pradesh',
    occupation: 'Retail Sales Associate',
    ncoCode: '5223.0101',
    trigger: 'Current certified candidates exceed hiring absorption capacity by 181%. Median wages stagnant.',
    forecastHorizon: '6M',
    confidence: 84,
    recommendedAction: 'Freeze new retail sales training seat approvals and initiate dual-trade conversion pathways.',
    timestamp: '2026-10-03 18:20 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-KA-004',
    severity: 'info',
    type: 'emerging_occupation',
    title: 'Emerging Trade Signal: AI/ML Data Annotation in Bengaluru & Lucknow',
    titleHi: 'उभरता व्यापार: बेंगलुरु और लखनऊ में एआई डाटा एनोटेशन',
    geography: 'Bengaluru Urban, Karnataka',
    occupation: 'AI/ML Data Annotation Specialist',
    ncoCode: '2512.0101',
    trigger: 'Hiring volume expanded 32.1% in 180 days across regional Indic speech & multimodal modeling centers.',
    forecastHorizon: '12M',
    confidence: 86,
    recommendedAction: 'Publish standardized NQR curriculum for Level 5 Indic Data Labeling and Annotation.',
    timestamp: '2026-10-03 14:10 IST',
    acknowledged: true
  },
  {
    id: 'ALR-2026-GJ-005',
    severity: 'warning',
    type: 'skill_obsolescence',
    title: 'Obsolescence Alert: Conventional Manual Lathe Operators in Rajkot',
    titleHi: 'अप्रचलन चेतावनी: राजकोट में पारंपरिक मैनुअल लेथ ऑपरेटर',
    geography: 'Rajkot, Gujarat',
    occupation: 'CNC Machine Operator',
    ncoCode: '8151.0101',
    trigger: 'Over 68% of machine tool MSMEs reported migrating to 4-axis CNC lathes; manual job orders declined 40%.',
    forecastHorizon: '6M',
    confidence: 82,
    recommendedAction: 'Deploy 6-week CNC conversion bridging modules for existing lathe turners.',
    timestamp: '2026-10-02 11:30 IST',
    acknowledged: false
  }
];

export const ALERTS = EARLY_WARNING_ALERTS;

export const RECOMMENDATIONS: Recommendation[] = [
  // 1. HERO RECOMMENDATION (Section 16, 28, 57)
  {
    id: 'REC-2026-01',
    rank: 1,
    title: 'Redirect 500 Training Seats from Retail to Solar PV',
    titleHi: 'रिटेल से सोलर पीवी में 500 प्रशिक्षण सीटें स्थानांतरित करें',
    type: 'capacity_reallocation',
    fromTrade: 'Retail Sales Associate',
    fromNco: '5223.0101',
    toTrade: 'Solar PV Installer',
    toNco: '7126.0101',
    district: 'Gorakhpur',
    state: 'Uttar Pradesh',
    recommendedSeats: 500,
    reason: 'Persistent forecasted shortage in green trades coinciding with oversupply and seat saturation in legacy retail trades in Purvanchal.',
    evidence: {
      demandSignal: 'NCS, state tenders and regional contractor job postings indicate +21.4% 6-month growth in solar rooftop projects.',
      vacancyGrowth: 'Verified vacancies expanded from 610 to 820 with only 180 local training seats available in Gorakhpur district.',
      supplyStagnation: 'Retail training centres report 42% placement rate, while certified Solar Suryamitras achieve 89% placement within 60 days.',
      employerHiringTrend: '46 local EPC contractors signed letters of intent with NSDC for 750+ hiring requirements over next 2 quarters.'
    },
    constraints: 'Requires minor lab equipment retrofit (solar panel mounting jigs and digital multi-meters) estimated at ₹3.2L per center.',
    expectedImpact: {
      gapReductionPercent: 62,
      supplyCoveragePercent: 14,
      estimatedCostINR: 3250000 // ₹32.5 Lakhs
    },
    confidence: 78,
    status: 'pending'
  },
  {
    id: 'REC-2026-02',
    rank: 2,
    title: 'Establish EV Powertrain Diagnostics Hub in Pune ITIs',
    titleHi: 'पुणे आईटीआई में ईवी पावरट्रेन डायग्नोस्टिक्स हब स्थापित करें',
    type: 'seat_expansion',
    toTrade: 'EV Service Technician',
    toNco: '7233.0102',
    district: 'Pune',
    state: 'Maharashtra',
    recommendedSeats: 400,
    reason: 'Severe shortage of high-voltage certified mechanics across automotive OEM clusters in Chakan & Bhosari.',
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
    toNco: '2512.0101',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    recommendedSeats: 350,
    reason: 'National Bhashini Indic language evaluation mandates opening high-volume remote and hybrid data jobs for Hindi/Bhojpuri linguists.',
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
    toNco: '7212.0101',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    recommendedSeats: 200,
    reason: 'Surge in drone spraying pilots under PM Krishi Sinchayee Yojana requires localized field repair hubs.',
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
      name: 'Global LightGBM Ensemble v3.2',
      wape: 5.0,
      mae: 36.17,
      lastTrained: '2026-10-04 22:43 IST',
      status: 'optimal'
    },
    {
      name: 'Seasonal Naive Baseline (12M Lag)',
      wape: 16.59,
      mae: 120.01,
      lastTrained: '2026-10-04 22:43 IST',
      status: 'healthy'
    }
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
    answerEn: 'Solar PV Installer (NCO 7126.0101) in Gorakhpur has an acute Gap Score of 84/100 (Severe Shortage). Current demand is 820 positions projected to reach 1,020 in 6 months (+21.4%), while effective employable supply is only 430. Gorakhpur currently has just 2 training centres with 180 seats. The primary driver is the surge in PM Surya Ghar rooftop contracts (+31% contribution). Recommended action: Redirect 500 training seats from oversupplied Retail Sales Associate to Solar PV Installer, which reduces the projected shortage by 62%.',
    answerHi: 'गोरखपुर में सोलर पीवी इंस्टॉलर (NCO 7126.0101) का गैप स्कोर 84/100 (गंभीर कमी) है। वर्तमान मांग 820 है जो 6 महीनों में 1,020 (+21.4%) तक पहुंचने का अनुमान है, जबकि प्रभावी रोजगार योग्य आपूर्ति केवल 430 है। वर्तमान में गोरखपुर में केवल 2 प्रशिक्षण केंद्र और 180 सीटें हैं। इसका मुख्य कारण पीएम सूर्य घर योजना के तहत रूफटॉप अनुबंधों में 31% की वृद्धि है। अनुशंसित कार्य: रिटेल सेल्स एसोसिएट से 500 प्रशिक्षण सीटें सोलर पीवी में पुनर्वितरित करें, जिससे कमी में 62% की गिरावट आएगी।',
    runId: 'RUN-2026-10-04-001',
    confidence: 78
  },
  {
    query: 'gorakhpur',
    queryHi: 'गोरखपुर',
    answerEn: 'Gorakhpur District (LGD 178) shows a composite Gap Score of 84 with a 71% probability of severe shortage over the next 6 months. High shortage trades include: 1) Solar PV Installer (Gap 84), 2) Smart Meter Installation Technician (Gap 81), and 3) Community Health Assistant (Gap 68). Concurrently, severe oversupply exists in Retail Sales Associate (Gap 24, +181% excess) and General Data Entry Operator (Gap 19). Reallocating 500 seats from Retail to Solar is estimated to cost ₹32.5L and cuts regional shortage by 62%.',
    answerHi: 'गोरखपुर जिले (LGD 178) का समग्र गैप स्कोर 84 है और अगले 6 महीनों में 71% गंभीर कमी की संभावना है। प्रमुख कमी वाले व्यवसाय: 1) सोलर पीवी इंस्टॉलर (गैप 84), 2) स्मार्ट मीटर तकनीशियन (गैप 81), और 3) सामुदायिक स्वास्थ्य सहायक (गैप 68)। इसके विपरीत, रिटेल सेल्स एसोसिएट (गैप 24, +181% अतिरिक्त) और डाटा एंट्री ऑपरेटर (गैप 19) में भारी अतिआपूर्ति है। रिटेल से सोलर में 500 सीटें स्थानांतरित करने से ₹32.5 लाख की लागत आएगी और क्षेत्रीय कमी 62% कम होगी।',
    runId: 'RUN-2026-10-04-001',
    confidence: 82
  },
  {
    query: 'retail',
    queryHi: 'रिटेल',
    answerEn: 'Retail Sales Associate (NCO 5223.0101) is experiencing severe saturation and oversupply (Gap Score 24) across Gorakhpur and Lucknow. Demand has softened by -8.2% due to quick-commerce and automated dark-store adoption, whereas legacy training centres continue producing over 800 certified candidates annually. Placement rates have fallen to 42%. MSDE should cap new retail training approvals and shift physical seat capacity to green and mechatronic trades.',
    answerHi: 'रिटेल सेल्स एसोसिएट (NCO 5223.0101) गोरखपुर और लखनऊ में अत्यधिक संतृप्ति और अतिआपूर्ति (गैप स्कोर 24) का सामना कर रहा है। त्वरित वाणिज्य (क्विक कॉमर्स) और डार्क-स्टोर ऑटोमेशन के कारण मांग में -8.2% की गिरावट आई है, जबकि पारंपरिक प्रशिक्षण केंद्र अभी भी प्रति वर्ष 800+ उम्मीदवार तैयार कर रहे हैं। प्लेसमेंट दर घटकर 42% रह गई है। एमएसडीई को नए रिटेल प्रशिक्षण को सीमित कर हरित एवं मेक्ट्रोनिक ट्रेड्स में सीटें बदलनी चाहिए।',
    runId: 'RUN-2026-10-04-001',
    confidence: 84
  },
  {
    query: 'uttar pradesh',
    queryHi: 'उत्तर प्रदेश',
    answerEn: 'In Uttar Pradesh, MSDE should immediately prioritize training capacity expansions in Eastern UP (Purvanchal corridor): 1) Expand Solar PV Installer by 500 seats in Gorakhpur and 300 seats in Varanasi; 2) Launch Indic AI Data Annotation satellite centers (350 seats) in Lucknow; 3) Deploy Agricultural Drone Maintenance cohorts (200 seats) in Varanasi to support Kisan Drone initiatives.',
    answerHi: 'उत्तर प्रदेश में, एमएसडीई को तुरंत पूर्वांचल कॉरिडोर में प्रशिक्षण क्षमता विस्तार को प्राथमिकता देनी चाहिए: 1) गोरखपुर में 500 और वाराणसी में 300 सोलर पीवी इंस्टॉलर सीटें बढ़ाएं; 2) लखनऊ में इंडिक एआई डाटा एनोटेशन सैटेलाइट सेंटर (350 सीटें) शुरू करें; 3) किसान ड्रोन पहलों का समर्थन करने के लिए वाराणसी में 200 कृषि ड्रोन मेंटेनेंस सीटें तैनात करें।',
    runId: 'RUN-2026-10-04-001',
    confidence: 80
  },
  {
    query: '500 seats',
    queryHi: '500 सीटें',
    answerEn: 'Policy Simulation Outcome: Reallocating 500 PMKVY training seats from oversupplied Retail Sales Associate to Solar PV Installer in Gorakhpur expands effective supply from 430 to 780 employable technicians. This reduces the acute shortage deficit by 62%, dropping the projected Gap Score from 84/100 (Severe Shortage) to 49/100 (Balanced Equilibrium). Estimated intervention cost is ₹32.5 Lakhs (retrofit + training).',
    answerHi: 'नीति सिमुलेशन परिणाम: गोरखपुर में रिटेल सेल्स एसोसिएट से सोलर पीवी इंस्टॉलर में 500 पीएमकेवीवाई सीटें पुनर्वितरित करने से प्रभावी आपूर्ति 430 से बढ़कर 780 तकनीशियन हो जाती है। यह कमी के घाटे को 62% कम करता है और अनुमानित गैप स्कोर 84/100 (गंभीर कमी) से घटकर 49/100 (संतुलित स्थिति) हो जाता है। अनुमानित लागत ₹32.5 लाख है।',
    runId: 'RUN-2026-10-04-001',
    confidence: 85
  }
];
