// src/lib/demoData.ts
// Precomputed from run RUN-SIH-001 (data through Oct 2024)
// SHA256 Dataset Hash: 01b23bfc01b7
// Generated deterministically from data/kaushal_pulse.db (sih_monthly_intelligence)

import { 
  District, 
  Occupation, 
  EarlyWarningAlert, 
  Recommendation, 
  TimeSeriesPoint, 
  DataHealthMetric,
  GapSeverity,
  ExplainabilityFactor 
} from './types';

export const EXPORT_METADATA = {
  runId: 'RUN-SIH-001',
  dataHash: '01b23bfc01b7',
  trainedAt: '2026-10-04T17:52:17Z',
  dataThrough: 'Oct 2024',
  dateRange: '2022-01-01 to 2024-10-01',
  districtsCount: 16,
  statesCount: 5,
  tradesCount: 16,
  datasetMode: 'sih_dummy' as const,
  dataSource: 'SIH dummy dataset',
  statusLabel: 'Precomputed from run RUN-SIH-001',
  statusLabelHi: 'रन RUN-SIH-001 से पूर्व-गणना'
};

export const STATES = [
  'Gujarat',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Uttar Pradesh'
];

export const SECTORS = [
  'Aerospace & Drone Tech',
  'Agriculture & Farm Tech',
  'Automotive & Electric Mobility',
  'Capital Goods & Precision Engineering',
  'Construction & Infrastructure',
  'Electronics & Hardware',
  'Food Processing & Cold Chain',
  'Green Jobs & Renewable Energy',
  'Healthcare & Allied Services',
  'IT-ITeS & Digital Services',
  'Logistics & Supply Chain',
  'Retail & E-Commerce',
  'Textiles & Handlooms'
];

export const DISTRICTS: District[] = [
  {
    id: "ahmedabad",
    name: 'Ahmedabad',
    nameHi: "अहमदाबाद",
    state: "Gujarat",
    lgdCode: 442,
    demandIndex: 77,
    effectiveSupplyIndex: 30,
    gapScore: 85,
    shortageProbability6M: 72,
    trainingCentresCount: 41,
    totalTrainingSeats: 6163,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Smart Meter Installation Technician"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 563,
    coordinates: [
      23.0225,
      72.5714
    ]
  },
  {
    id: "bengaluru_urban",
    name: "Bengaluru Urban",
    nameHi: "बेंगलुरु शहरी",
    state: "Karnataka",
    lgdCode: 530,
    demandIndex: 84,
    effectiveSupplyIndex: 30,
    gapScore: 85,
    shortageProbability6M: 72,
    trainingCentresCount: 45,
    totalTrainingSeats: 6844,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "CNC Machine Operator"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 609,
    coordinates: [
      12.9716,
      77.5946
    ]
  },
  {
    id: "chhatrapati_sambhajinagar",
    name: "Chhatrapati Sambhajinagar",
    nameHi: "छत्रपति संभाजीनगर",
    state: "Maharashtra",
    lgdCode: 480,
    demandIndex: 50,
    effectiveSupplyIndex: 31,
    gapScore: 85,
    shortageProbability6M: 72,
    trainingCentresCount: 27,
    totalTrainingSeats: 4066,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Smart Meter Installation Technician"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 353,
    coordinates: [
      19.8762,
      75.3433
    ]
  },
  {
    id: "coimbatore",
    name: 'Coimbatore',
    nameHi: "कोयंबटूर",
    state: "Tamil Nadu",
    lgdCode: 597,
    demandIndex: 67,
    effectiveSupplyIndex: 31,
    gapScore: 84,
    shortageProbability6M: 71,
    trainingCentresCount: 36,
    totalTrainingSeats: 5449,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "EV Service Technician"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 475,
    coordinates: [
      11.0168,
      76.9558
    ]
  },
  {
    id: "dharwad",
    name: 'Dharwad',
    nameHi: "धारवाड़",
    state: "Karnataka",
    lgdCode: 541,
    demandIndex: 48,
    effectiveSupplyIndex: 30,
    gapScore: 85,
    shortageProbability6M: 72,
    trainingCentresCount: 25,
    totalTrainingSeats: 3898,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Smart Meter Installation Technician"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 339,
    coordinates: [
      15.4589,
      75.0078
    ]
  },
  {
    id: "gorakhpur",
    name: 'Gorakhpur',
    nameHi: "गोरखपुर",
    state: "Uttar Pradesh",
    lgdCode: 178,
    demandIndex: 63,
    effectiveSupplyIndex: 30,
    gapScore: 94,
    shortageProbability6M: 88,
    trainingCentresCount: 7,
    totalTrainingSeats: 1133,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Smart Meter Installation Technician"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 46,
    coordinates: [
      26.7606,
      83.3732
    ]
  },
  {
    id: "kanpur_nagar",
    name: "Kanpur Nagar",
    nameHi: "कानपुर नगर",
    state: "Uttar Pradesh",
    lgdCode: 179,
    demandIndex: 66,
    effectiveSupplyIndex: 31,
    gapScore: 85,
    shortageProbability6M: 72,
    trainingCentresCount: 35,
    totalTrainingSeats: 5279,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Smart Meter Installation Technician"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 464,
    coordinates: [
      26.4499,
      80.3319
    ]
  },
  {
    id: "lucknow",
    name: 'Lucknow',
    nameHi: "लखनऊ",
    state: "Uttar Pradesh",
    lgdCode: 180,
    demandIndex: 74,
    effectiveSupplyIndex: 31,
    gapScore: 84,
    shortageProbability6M: 71,
    trainingCentresCount: 39,
    totalTrainingSeats: 5950,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Smart Meter Installation Technician"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 519,
    coordinates: [
      26.8467,
      80.9462
    ]
  },
  {
    id: "mysuru",
    name: 'Mysuru',
    nameHi: "मैसूरु",
    state: "Karnataka",
    lgdCode: 552,
    demandIndex: 50,
    effectiveSupplyIndex: 29,
    gapScore: 86,
    shortageProbability6M: 73,
    trainingCentresCount: 27,
    totalTrainingSeats: 4087,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Domestic Electrician & Wireman"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 337,
    coordinates: [
      12.2958,
      76.6394
    ]
  },
  {
    id: "nagpur",
    name: 'Nagpur',
    nameHi: "नागपुर",
    state: "Maharashtra",
    lgdCode: 505,
    demandIndex: 58,
    effectiveSupplyIndex: 31,
    gapScore: 85,
    shortageProbability6M: 72,
    trainingCentresCount: 32,
    totalTrainingSeats: 4808,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Domestic Electrician & Wireman"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 406,
    coordinates: [
      21.1458,
      79.0882
    ]
  },
  {
    id: "nashik",
    name: 'Nashik',
    nameHi: "नासिक",
    state: "Maharashtra",
    lgdCode: 516,
    demandIndex: 53,
    effectiveSupplyIndex: 31,
    gapScore: 85,
    shortageProbability6M: 72,
    trainingCentresCount: 28,
    totalTrainingSeats: 4300,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Smart Meter Installation Technician"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 383,
    coordinates: [
      19.9975,
      73.7898
    ]
  },
  {
    id: "pune",
    name: 'Pune',
    nameHi: "पुणे",
    state: "Maharashtra",
    lgdCode: 521,
    demandIndex: 79,
    effectiveSupplyIndex: 31,
    gapScore: 85,
    shortageProbability6M: 72,
    trainingCentresCount: 42,
    totalTrainingSeats: 6390,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Smart Meter Installation Technician"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 564,
    coordinates: [
      18.5204,
      73.8567
    ]
  },
  {
    id: "rajkot",
    name: 'Rajkot',
    nameHi: "राजकोट",
    state: "Gujarat",
    lgdCode: 461,
    demandIndex: 53,
    effectiveSupplyIndex: 31,
    gapScore: 84,
    shortageProbability6M: 71,
    trainingCentresCount: 29,
    totalTrainingSeats: 4359,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Smart Meter Installation Technician"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 366,
    coordinates: [
      22.3039,
      70.8022
    ]
  },
  {
    id: "surat",
    name: 'Surat',
    nameHi: "सूरत",
    state: "Gujarat",
    lgdCode: 467,
    demandIndex: 71,
    effectiveSupplyIndex: 29,
    gapScore: 85,
    shortageProbability6M: 72,
    trainingCentresCount: 38,
    totalTrainingSeats: 5728,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Domestic Electrician & Wireman"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 503,
    coordinates: [
      21.1702,
      72.8311
    ]
  },
  {
    id: "vadodara",
    name: 'Vadodara',
    nameHi: "वडोदरा",
    state: "Gujarat",
    lgdCode: 468,
    demandIndex: 56,
    effectiveSupplyIndex: 31,
    gapScore: 85,
    shortageProbability6M: 72,
    trainingCentresCount: 30,
    totalTrainingSeats: 4551,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Domestic Electrician & Wireman"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 392,
    coordinates: [
      22.3072,
      73.1812
    ]
  },
  {
    id: "varanasi",
    name: 'Varanasi',
    nameHi: "वाराणसी",
    state: "Uttar Pradesh",
    lgdCode: 198,
    demandIndex: 55,
    effectiveSupplyIndex: 32,
    gapScore: 84,
    shortageProbability6M: 71,
    trainingCentresCount: 30,
    totalTrainingSeats: 4580,
    topShortageTrades: [
      "Solar PV Installer",
      "Community Health Assistant",
      "Domestic Electrician & Wireman"
    ],
    topOversuppliedTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    capacitySurplusTrades: [
      "Retail Sales Associate",
      "Data Entry Operator"
    ],
    activeEmployers: 380,
    coordinates: [
      25.3176,
      82.9739
    ]
  }
];

// Helper to generate deterministic historical points
function generateTradeTimeSeries(
  baseDemand: number, 
  baseSupply: number, 
  trend: number = 0.08
): TimeSeriesPoint[] {
  const months = [
    '2023-11', '2023-12', '2024-01', '2024-02', '2024-03', '2024-04',
    '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10',
    '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04'
  ];

  return months.map((m, idx) => {
    const isHist = idx < 12;
    const factor = 1 + (idx - 11) * trend;
    const dVal = Math.round(baseDemand * factor);
    const sVal = Math.round(baseSupply * (1 + (idx - 11) * 0.02));
    const spread = Math.round(dVal * 0.12);

    if (isHist) {
      return {
        month: m,
        historicalDemand: dVal,
        effectiveSupply: sVal,
        baselineNaive: Math.round(baseDemand * 0.95)
      };
    } else {
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

const rawOccupations = [
  {
    id: "ai_ml_data_annotation_specialist",
    ncoCode: "2512.0101",
    title: "AI/ML Data Annotation Specialist",
    titleHi: "एआई/एमएल डेटा एनोटेशन विशेषज्ञ",
    sector: "IT-ITeS & Digital Services",
    sectorHi: "आईटी-आईटीईएस और डिजिटल सेवाएं",
    nsqfLevel: 4,
    currentDemand: 506,
    growthRate6M: 7.9,
    effectiveSupply: 27,
    gapScore: 97,
    severity: "Severe Shortage",
    shortageProbability6M: 82,
    forecastDemand3M: 526,
    forecastDemand6M: 546,
    forecastDemand12M: 582,
    demandPressureIndex: 60,
    confidence: 84,
    employerCount: 28,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 57,
      enrolled: 54,
      certified: 47,
      availableLabour: 38,
      effectiveEmployableSupply: 27,
      seatUtilizationRate: 0.9474,
      certificationRate: 0.8704,
      laborParticipationRate: 0.8085,
      employabilityFactor: 0.83
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 506
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-2512-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 7.9,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.5,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "data_entry_operator",
    ncoCode: "4132.0101",
    title: "Data Entry Operator",
    titleHi: "डेटा एंट्री ऑपरेटर",
    sector: "IT-ITeS & Digital Services",
    sectorHi: "आईटी-आईटीईएस और डिजिटल सेवाएं",
    nsqfLevel: 4,
    currentDemand: 420,
    growthRate6M: 8.1,
    effectiveSupply: 411,
    gapScore: 51,
    severity: "Balanced",
    shortageProbability6M: 43,
    forecastDemand3M: 437,
    forecastDemand6M: 454,
    forecastDemand12M: 483,
    demandPressureIndex: 54,
    confidence: 88,
    employerCount: 23,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 913,
      enrolled: 812,
      certified: 716,
      availableLabour: 587,
      effectiveEmployableSupply: 411,
      seatUtilizationRate: 0.8894,
      certificationRate: 0.8818,
      laborParticipationRate: 0.8198,
      employabilityFactor: 0.45
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 420
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-4132-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.1,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.7,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "retail_sales_associate",
    ncoCode: "5223.0101",
    title: "Retail Sales Associate",
    titleHi: "रिटेल सेल्स एसोसिएट",
    sector: "Retail & E-Commerce",
    sectorHi: "खुदरा और ई-कॉमर्स",
    nsqfLevel: 4,
    currentDemand: 380,
    growthRate6M: -2.6,
    effectiveSupply: 404,
    gapScore: 47,
    severity: "Balanced",
    shortageProbability6M: 15,
    forecastDemand3M: 375,
    forecastDemand6M: 370,
    forecastDemand12M: 365,
    demandPressureIndex: 48,
    confidence: 88,
    employerCount: 52,
    averageWageINR: 18500,
    stagedSupply: {
      trainingSeats: 916,
      enrolled: 782,
      certified: 704,
      availableLabour: 577,
      effectiveEmployableSupply: 404,
      seatUtilizationRate: 0.8537,
      certificationRate: 0.9003,
      laborParticipationRate: 0.8196,
      employabilityFactor: 0.449
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 380
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-5223-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: -2.6,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: -5.0,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "community_health_assistant",
    ncoCode: "5321.0101",
    title: "Community Health Assistant",
    titleHi: "सामुदायिक स्वास्थ्य सहायक",
    sector: "Healthcare & Allied Services",
    sectorHi: "स्वास्थ्य देखभाल और संबद्ध सेवाएं",
    nsqfLevel: 4,
    currentDemand: 836,
    growthRate6M: 8.0,
    effectiveSupply: 167,
    gapScore: 90,
    severity: "Severe Shortage",
    shortageProbability6M: 76,
    forecastDemand3M: 869,
    forecastDemand6M: 903,
    forecastDemand12M: 961,
    demandPressureIndex: 87,
    confidence: 84,
    employerCount: 46,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 342,
      enrolled: 321,
      certified: 292,
      availableLabour: 239,
      effectiveEmployableSupply: 167,
      seatUtilizationRate: 0.9386,
      certificationRate: 0.9097,
      laborParticipationRate: 0.8185,
      employabilityFactor: 0.849
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 836
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-5321-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.0,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.6,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "solar_pv_installer",
    ncoCode: "7126.0101",
    title: "Solar PV Installer",
    titleHi: "सोलर पीवी इंस्टॉलर",
    sector: "Green Jobs & Renewable Energy",
    sectorHi: "हरित नौकरियां और नवीकरणीय ऊर्जा",
    nsqfLevel: 4,
    currentDemand: 808,
    growthRate6M: -0.1,
    effectiveSupply: 97,
    gapScore: 94,
    severity: "Severe Shortage",
    shortageProbability6M: 88,
    forecastDemand3M: 840,
    forecastDemand6M: 825,
    forecastDemand12M: 960,
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
      seatUtilizationRate: 0.9401,
      certificationRate: 0.8333,
      laborParticipationRate: 0.8176,
      employabilityFactor: 0.7
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 808
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-7126-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: -0.1,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: -2.5,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "solar_pump_technician",
    ncoCode: "7126.0201",
    title: "Solar Pump Technician",
    titleHi: "सोलर पंप तकनीशियन",
    sector: "Agriculture & Farm Tech",
    sectorHi: "कृषि और कृषि तकनीक",
    nsqfLevel: 4,
    currentDemand: 456,
    growthRate6M: 7.9,
    effectiveSupply: 50,
    gapScore: 95,
    severity: "Severe Shortage",
    shortageProbability6M: 81,
    forecastDemand3M: 474,
    forecastDemand6M: 492,
    forecastDemand12M: 524,
    demandPressureIndex: 56,
    confidence: 84,
    employerCount: 25,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 113,
      enrolled: 109,
      certified: 89,
      availableLabour: 72,
      effectiveEmployableSupply: 50,
      seatUtilizationRate: 0.9646,
      certificationRate: 0.8165,
      laborParticipationRate: 0.809,
      employabilityFactor: 0.843
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 456
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-7126-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 7.9,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.5,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "cold_storage_and_hvac_mechanic",
    ncoCode: "7127.0101",
    title: "Cold Storage & HVAC Mechanic",
    titleHi: "कोल्ड स्टोरेज एवं एचवीएसी मैकेनिक",
    sector: "Food Processing & Cold Chain",
    sectorHi: "खाद्य प्रसंस्करण और कोल्ड चेन",
    nsqfLevel: 4,
    currentDemand: 351,
    growthRate6M: 8.0,
    effectiveSupply: 52,
    gapScore: 93,
    severity: "Severe Shortage",
    shortageProbability6M: 79,
    forecastDemand3M: 365,
    forecastDemand6M: 379,
    forecastDemand12M: 404,
    demandPressureIndex: 48,
    confidence: 84,
    employerCount: 19,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 119,
      enrolled: 104,
      certified: 92,
      availableLabour: 75,
      effectiveEmployableSupply: 52,
      seatUtilizationRate: 0.8739,
      certificationRate: 0.8846,
      laborParticipationRate: 0.8152,
      employabilityFactor: 0.848
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 351
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-7127-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.0,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.6,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "drone_maintenance_technician",
    ncoCode: "7212.0101",
    title: "Drone Maintenance Technician",
    titleHi: "ड्रोन रखरखाव तकनीशियन",
    sector: "Aerospace & Drone Tech",
    sectorHi: "एयरोस्पेस और ड्रोन तकनीक",
    nsqfLevel: 4,
    currentDemand: 288,
    growthRate6M: 8.0,
    effectiveSupply: 10,
    gapScore: 98,
    severity: "Severe Shortage",
    shortageProbability6M: 83,
    forecastDemand3M: 300,
    forecastDemand6M: 311,
    forecastDemand12M: 331,
    demandPressureIndex: 43,
    confidence: 84,
    employerCount: 16,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 26,
      enrolled: 24,
      certified: 19,
      availableLabour: 15,
      effectiveEmployableSupply: 10,
      seatUtilizationRate: 0.9231,
      certificationRate: 0.7917,
      laborParticipationRate: 0.7895,
      employabilityFactor: 0.842
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 288
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-7212-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.0,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.6,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "automotive_assembly_fitter",
    ncoCode: "7231.0101",
    title: "Automotive Assembly Fitter",
    titleHi: "ऑटोमोटिव असेंबली फिटर",
    sector: "Automotive & Electric Mobility",
    sectorHi: "ऑटोमोटिव और इलेक्ट्रिक मोबिलिटी",
    nsqfLevel: 4,
    currentDemand: 665,
    growthRate6M: 8.0,
    effectiveSupply: 260,
    gapScore: 80,
    severity: "Severe Shortage",
    shortageProbability6M: 68,
    forecastDemand3M: 692,
    forecastDemand6M: 718,
    forecastDemand12M: 765,
    demandPressureIndex: 73,
    confidence: 85,
    employerCount: 36,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 582,
      enrolled: 505,
      certified: 454,
      availableLabour: 372,
      effectiveEmployableSupply: 260,
      seatUtilizationRate: 0.8677,
      certificationRate: 0.899,
      laborParticipationRate: 0.8194,
      employabilityFactor: 0.65
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 665
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-7231-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.0,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.6,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "ev_service_technician",
    ncoCode: "7233.0102",
    title: "EV Service Technician",
    titleHi: "ईवी सर्विस तकनीशियन",
    sector: "Automotive & Electric Mobility",
    sectorHi: "ऑटोमोटिव और इलेक्ट्रिक मोबिलिटी",
    nsqfLevel: 4,
    currentDemand: 586,
    growthRate6M: 8.0,
    effectiveSupply: 58,
    gapScore: 95,
    severity: "Severe Shortage",
    shortageProbability6M: 81,
    forecastDemand3M: 609,
    forecastDemand6M: 633,
    forecastDemand12M: 674,
    demandPressureIndex: 67,
    confidence: 84,
    employerCount: 32,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 141,
      enrolled: 126,
      certified: 102,
      availableLabour: 83,
      effectiveEmployableSupply: 58,
      seatUtilizationRate: 0.8936,
      certificationRate: 0.8095,
      laborParticipationRate: 0.8137,
      employabilityFactor: 0.843
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 586
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-7233-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.0,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.6,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "smart_meter_installation_technician",
    ncoCode: "7233.0201",
    title: "Smart Meter Installation Technician",
    titleHi: "स्मार्ट मीटर इंस्टॉलेशन तकनीशियन",
    sector: "Green Jobs & Renewable Energy",
    sectorHi: "हरित नौकरियां और नवीकरणीय ऊर्जा",
    nsqfLevel: 4,
    currentDemand: 603,
    growthRate6M: 8.0,
    effectiveSupply: 48,
    gapScore: 96,
    severity: "Severe Shortage",
    shortageProbability6M: 82,
    forecastDemand3M: 627,
    forecastDemand6M: 651,
    forecastDemand12M: 693,
    demandPressureIndex: 68,
    confidence: 84,
    employerCount: 33,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 109,
      enrolled: 94,
      certified: 83,
      availableLabour: 68,
      effectiveEmployableSupply: 48,
      seatUtilizationRate: 0.8624,
      certificationRate: 0.883,
      laborParticipationRate: 0.8193,
      employabilityFactor: 0.843
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 603
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-7233-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.0,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.6,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "domestic_electrician_and_wireman",
    ncoCode: "7411.0101",
    title: "Domestic Electrician & Wireman",
    titleHi: "घरेलू इलेक्ट्रीशियन एवं वायरमैन",
    sector: "Construction & Infrastructure",
    sectorHi: "निर्माण और बुनियादी ढांचा",
    nsqfLevel: 4,
    currentDemand: 914,
    growthRate6M: 8.0,
    effectiveSupply: 407,
    gapScore: 78,
    severity: "Severe Shortage",
    shortageProbability6M: 66,
    forecastDemand3M: 951,
    forecastDemand6M: 987,
    forecastDemand12M: 1051,
    demandPressureIndex: 93,
    confidence: 86,
    employerCount: 50,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 793,
      enrolled: 757,
      certified: 710,
      availableLabour: 582,
      effectiveEmployableSupply: 407,
      seatUtilizationRate: 0.9546,
      certificationRate: 0.9379,
      laborParticipationRate: 0.8197,
      employabilityFactor: 0.649
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 914
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-7411-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.0,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.6,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "industrial_automation_technician",
    ncoCode: "7412.0201",
    title: "Industrial Automation Technician",
    titleHi: "औद्योगिक स्वचालन तकनीशियन",
    sector: "Electronics & Hardware",
    sectorHi: "इलेक्ट्रॉनिक्स और हार्डवेयर",
    nsqfLevel: 4,
    currentDemand: 479,
    growthRate6M: 7.9,
    effectiveSupply: 69,
    gapScore: 93,
    severity: "Severe Shortage",
    shortageProbability6M: 79,
    forecastDemand3M: 498,
    forecastDemand6M: 517,
    forecastDemand12M: 551,
    demandPressureIndex: 58,
    confidence: 84,
    employerCount: 26,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 162,
      enrolled: 137,
      certified: 121,
      availableLabour: 99,
      effectiveEmployableSupply: 69,
      seatUtilizationRate: 0.8457,
      certificationRate: 0.8832,
      laborParticipationRate: 0.8182,
      employabilityFactor: 0.843
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 479
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-7412-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 7.9,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.5,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "cnc_machine_operator",
    ncoCode: "8151.0101",
    title: "CNC Machine Operator",
    titleHi: "सीएनसी मशीन ऑपरेटर",
    sector: "Capital Goods & Precision Engineering",
    sectorHi: "पूंजीगत सामान और सटीक इंजीनियरिंग",
    nsqfLevel: 4,
    currentDemand: 707,
    growthRate6M: 8.1,
    effectiveSupply: 186,
    gapScore: 87,
    severity: "Severe Shortage",
    shortageProbability6M: 74,
    forecastDemand3M: 735,
    forecastDemand6M: 764,
    forecastDemand12M: 813,
    demandPressureIndex: 77,
    confidence: 85,
    employerCount: 39,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 416,
      enrolled: 353,
      certified: 324,
      availableLabour: 265,
      effectiveEmployableSupply: 186,
      seatUtilizationRate: 0.8486,
      certificationRate: 0.9178,
      laborParticipationRate: 0.8179,
      employabilityFactor: 0.849
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 707
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-8151-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.1,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.7,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "sewing_machine_operator",
    ncoCode: "8153.0101",
    title: "Sewing Machine Operator",
    titleHi: "सिलाई मशीन ऑपरेटर",
    sector: "Textiles & Handlooms",
    sectorHi: "कपड़ा और हथकरघा",
    nsqfLevel: 4,
    currentDemand: 385,
    growthRate6M: 8.1,
    effectiveSupply: 204,
    gapScore: 74,
    severity: "Moderate Shortage",
    shortageProbability6M: 63,
    forecastDemand3M: 400,
    forecastDemand6M: 416,
    forecastDemand12M: 443,
    demandPressureIndex: 51,
    confidence: 86,
    employerCount: 21,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 480,
      enrolled: 436,
      certified: 356,
      availableLabour: 291,
      effectiveEmployableSupply: 204,
      seatUtilizationRate: 0.9083,
      certificationRate: 0.8165,
      laborParticipationRate: 0.8174,
      employabilityFactor: 0.449
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 385
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-8153-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.1,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.7,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  },
  {
    id: "warehouse_logistics_executive",
    ncoCode: "9333.0101",
    title: "Warehouse Logistics Executive",
    titleHi: "वेयरहाउस लॉजिस्टिक्स एक्जीक्यूटिव",
    sector: "Logistics & Supply Chain",
    sectorHi: "लॉजिस्टिक्स और आपूर्ति श्रृंखला",
    nsqfLevel: 4,
    currentDemand: 603,
    growthRate6M: 8.0,
    effectiveSupply: 250,
    gapScore: 79,
    severity: "Severe Shortage",
    shortageProbability6M: 67,
    forecastDemand3M: 627,
    forecastDemand6M: 651,
    forecastDemand12M: 693,
    demandPressureIndex: 68,
    confidence: 86,
    employerCount: 33,
    averageWageINR: 28000,
    stagedSupply: {
      trainingSeats: 535,
      enrolled: 488,
      certified: 436,
      availableLabour: 357,
      effectiveEmployableSupply: 250,
      seatUtilizationRate: 0.9121,
      certificationRate: 0.8934,
      laborParticipationRate: 0.8188,
      employabilityFactor: 0.649
    },
    districtConcentrations: [
      {
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        demand: 603
      }
    ],
    keySkills: [
      "Technical Diagnostics",
      "Standard Compliance",
      "Preventive Maintenance"
    ],
    qualifications: [
      "QP-9333-V1.0"
    ],
    timeSeries: [],
    explainability: [
      {
        name: 'lag_1',
        impactPercent: 42,
        description: "Prior month hiring momentum baseline",
        signalType: "vacancy"
      },
      {
        name: 'demand_growth_12m',
        impactPercent: 28,
        description: "12-month structural demand trajectory",
        signalType: "capex"
      },
      {
        name: 'lag_1_effective_supply',
        impactPercent: 18,
        description: "Inter-district candidate migration rate",
        signalType: "employer"
      }
    ],
    whyThisScore: {
      demandGrowth6M: 8.0,
      supplyGrowth6M: 2.4,
      netVelocityMismatch: 5.6,
      localShapDrivers: [
        {
          feature: "lag_1_demand",
          shap_value: 42.15,
          abs_impact: 42.15,
          direction: "positive",
          desc: "Prior month hiring baseline"
        },
        {
          feature: "annual_growth",
          shap_value: 28.3,
          abs_impact: 28.3,
          direction: "positive",
          desc: "Long-term sectoral growth"
        }
      ],
      globalModelDrivers: [
        {
          rank: 1,
          feature: "calendar_seasonality",
          importance: 781,
          desc: "Seasonal hiring cycle"
        },
        {
          rank: 2,
          feature: "demand_growth_12m",
          importance: 746,
          desc: "Structural annual expansion"
        }
      ]
    }
  }
];

export const OCCUPATIONS: Occupation[] = rawOccupations.map(occ => {
  const ts = generateTradeTimeSeries(
    occ.currentDemand, 
    occ.effectiveSupply, 
    occ.ncoCode === '7126.0101' ? 0.09 : 0.04
  );
  return {
    ...occ,
    severity: occ.severity as GapSeverity,
    explainability: occ.explainability as ExplainabilityFactor[],
    timeSeries: ts,
    historicalData: ts
  };
});

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
    trigger: 'Persistent acute shortage across all 3 recent quarters (Gap Score 94/100). Demand stands at 808 vacancies against 97 employable candidates (deficit: 711).',
    triggerHi: 'पिछले तीनों तिमाहियों में लगातार गंभीर कमी (गैप स्कोर 94/100)। 97 रोजगार योग्य उम्मीदवारों के मुकाबले 808 रिक्तियां (घाटा: 711)।',
    forecastHorizon: '6M',
    confidence: 91,
    datasetChip: 'SIH dummy dataset',
    derivation: 'Gap Engine Deficit Matrix',
    metrics: {
      demandGrowth: '+38.4%',
      vacancyVolume: 808,
      leadTimeDays: 52
    },
    recommendedAction: 'Execute LP-constrained seat reallocation of 97 seats from Retail Sales (REC-2026-01)',
    recommendedActionHi: 'रिटेल सेल्स से 97 सीटों का एलपी-बाधित सीट पुनर्आवंटन निष्पादित करें (REC-2026-01)',
    context: 'Context, not model output: Purvanchal rooftop installation hiring orders [Dummy dataset].',
    contextHi: 'संदर्भ, मॉडल आउटपुट नहीं: पूर्वांचल रूफटॉप इंस्टॉलेशन भर्ती आदेश [डमी डेटासेट]।',
    timestamp: '2026-10-04 17:52 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-GJ-002',
    severity: 'critical',
    type: 'emerging_shortage',
    title: 'Emerging Shortage: Drone Maintenance Technician in Rajkot',
    titleHi: 'उभरती कमी: राजकोट में ड्रोन रखरखाव तकनीशियन',
    geography: 'Rajkot, Gujarat',
    geographyHi: 'राजकोट, गुजरात',
    occupation: 'Drone Maintenance Technician',
    occupationHi: 'ड्रोन रखरखाव तकनीशियन',
    ncoCode: '7212.0101',
    trigger: '6M demand surged +17.0% reaching 193 vacancies against only 6 employable candidates (deficit: 187 candidates; available supply 8, readiness rate 0.70).',
    triggerHi: '6M मांग में +17.0% की वृद्धि होकर केवल 6 रोजगार योग्य उम्मीदवारों के मुकाबले 193 रिक्तियां (घाटा: 187 उम्मीदवार; उपलब्ध आपूर्ति 8, तत्परता दर 0.70)।',
    forecastHorizon: '6M',
    confidence: 84,
    datasetChip: 'SIH dummy dataset',
    derivation: 'Alert Engine Threshold Detector',
    metrics: {
      demandGrowth: '+17.0%',
      vacancyVolume: 193,
      leadTimeDays: 45
    },
    recommendedAction: 'Deploy drone technician lab expansion pack across state ITIs (conversion throughput 0.3733)',
    recommendedActionHi: 'राज्य आईटीआई में ड्रोन तकनीशियन लैब विस्तार पैक तैनात करें (रूपांतरण थ्रूपुट 0.3733)',
    context: 'Context, not model output: Agricultural surveying and infrastructure corridor monitoring driving recruitment orders [Dummy dataset].',
    contextHi: 'संदर्भ, मॉडल आउटपुट नहीं: कृषि सर्वेक्षण और बुनियादी ढांचा निगरानी से भर्ती के आदेश प्रेरित हो रहे हैं [डमी डेटासेट]।',
    timestamp: '2026-10-04 16:30 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-UP-003',
    severity: 'warning',
    type: 'capacity_inefficiency',
    title: 'Capacity Inefficiency: Retail Sales Associate in Gorakhpur',
    titleHi: 'क्षमता अक्षमता: गोरखपुर में रिटेल सेल्स एसोसिएट',
    geography: 'Gorakhpur, Uttar Pradesh',
    geographyHi: 'गोरखपुर, उत्तर प्रदेश',
    occupation: 'Retail Sales Associate',
    occupationHi: 'रिटेल सेल्स एसोसिएट',
    ncoCode: '5223.0101',
    wastedSeats: 536,
    trigger: 'Physical training capacity (916 seats) exceeds absorption capacity by 141% (536 wasted seats over demand). Capacity surplus (seats).',
    triggerHi: 'भौतिक प्रशिक्षण क्षमता (916 सीटें) अवशोषण क्षमता से 141% अधिक है (मांग से 536 बर्बाद सीटें)। क्षमता अधिशेष (सीटें)।',
    forecastHorizon: '6M',
    confidence: 88,
    datasetChip: 'SIH dummy dataset',
    derivation: 'Capacity Surplus Analysis',
    metrics: {
      demandGrowth: '-4.2%',
      vacancyVolume: 380,
      leadTimeDays: 14
    },
    recommendedAction: 'Reallocate 97 excess physical training seats to high-deficit technical trades under donor-safe boundary',
    recommendedActionHi: 'दाता-सुरक्षित सीमा के तहत 97 अतिरिक्त भौतिक प्रशिक्षण सीटें उच्च-घाटे वाले तकनीकी ट्रेड्स में पुनर्आवंटित करें',
    context: 'Context, not model output: Authorised physical seats far exceed local job postings; placement rate is 44.9% [Dummy dataset].',
    contextHi: 'संदर्भ, मॉडल आउटपुट नहीं: अधिकृत भौतिक सीटें स्थानीय नौकरियों से काफी अधिक हैं; नियुक्ति दर 44.9% है [डमी डेटासेट]।',
    timestamp: '2026-10-04 15:15 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-MH-004',
    severity: 'warning',
    type: 'skill_obsolescence',
    title: 'Skill Obsolescence Risk: Sewing Machine Operator in Chhatrapati Sambhajinagar',
    titleHi: 'कौशल अप्रचलन जोखिम: छत्रपति संभाजीनगर में सिलाई मशीन ऑपरेटर',
    geography: 'Chhatrapati Sambhajinagar, Maharashtra',
    geographyHi: 'छत्रपति संभाजीनगर, महाराष्ट्र',
    occupation: 'Sewing Machine Operator',
    occupationHi: 'सिलाई मशीन ऑपरेटर',
    ncoCode: '8153.0101',
    trigger: 'Automated fabric cutting and computerised stitching reducing entry-level manual headcount requirements across manufacturing clusters.',
    triggerHi: 'स्वचालित कपड़ा कटाई और कम्प्यूटरीकृत सिलाई से विनिर्माण समूहों में प्रवेश स्तर के मानव श्रम की आवश्यकता कम हो रही है।',
    forecastHorizon: '6M',
    confidence: 82,
    datasetChip: 'SIH dummy dataset',
    derivation: 'Industry Signal Acceleration',
    metrics: {
      demandGrowth: '-8.5%',
      vacancyVolume: 210,
      leadTimeDays: 12
    },
    recommendedAction: 'Modernise apparel training with computerised pattern design and automated industrial sewing machinery',
    recommendedActionHi: 'कम्प्यूटरीकृत पैटर्न डिजाइन और स्वचालित औद्योगिक सिलाई मशीनरी के साथ परिधान प्रशिक्षण का आधुनिकीकरण करें',
    context: 'Context, not model output: Industrial apparel and garment manufacturing export slowdown [Dummy dataset].',
    contextHi: 'संदर्भ, मॉडल आउटपुट नहीं: औद्योगिक परिधान और परिधान विनिर्माण निर्यात मंदी [डमी डेटासेट]।',
    timestamp: '2026-10-04 14:00 IST',
    acknowledged: false
  },
  {
    id: 'ALR-2026-UP-005',
    severity: 'warning',
    type: 'capacity_inefficiency',
    title: 'Capacity Inefficiency: Data Entry Operator in Gorakhpur',
    titleHi: 'क्षमता अक्षमता: गोरखपुर में डेटा एंट्री ऑपरेटर',
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
    datasetChip: 'SIH dummy dataset',
    derivation: 'Capacity Surplus Analysis',
    metrics: {
      demandGrowth: '-6.1%',
      vacancyVolume: 344,
      leadTimeDays: 15
    },
    recommendedAction: 'Transition underutilized IT lab capacity into AI Prompt Engineering and Cloud Data Annotation modules',
    recommendedActionHi: 'कम उपयोग की जाने वाली आईटी लैब क्षमता को एआई प्रॉम्प्ट इंजीनियरिंग और क्लाउड डेटा एनोटेशन मॉड्यूल में बदलें',
    context: 'Context, not model output: Routine clerical data entry roles face consolidation from cloud processing [Dummy dataset].',
    contextHi: 'संदर्भ, मॉडल आउटपुट नहीं: नियमित लिपिकीय डेटा प्रविष्टि भूमिकाओं का समेकन [डमी डेटासेट]।',
    timestamp: '2026-10-04 12:30 IST',
    acknowledged: true
  }
];

export const ALERTS = EARLY_WARNING_ALERTS;

export const RECOMMENDATIONS: Recommendation[] = [
  // 1. HERO RECOMMENDATION (Strict Default — LP Solver Verified Engine Output)
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
    reason: 'Persistent acute shortage in Solar PV Installer (deficit 711, score 94) paired with physical capacity surplus in Retail Sales (916 seats, 536 excess seats over demand). Strict safety rule guarantees Retail deficit ratio remains <= 5% (Donor Score <= 52 Balanced).',
    reasonHi: 'सोलर पीवी इंस्टॉलर में लगातार गंभीर कमी (711 घाटा, स्कोर 94) और रिटेल सेल्स में भौतिक क्षमता अधिशेष (916 सीटें, मांग से अधिक 536 अतिरिक्त सीटें)। सख्त सुरक्षा नियम सुनिश्चित करता है कि रिटेल घाटा अनुपात <= 5% (दाता स्कोर <= 52 संतुलित) बना रहे।',
    evidence: {
      demandSignal: 'Reported hiring (dummy dataset): 808 reported vacancies against 97 employable candidates in Gorakhpur.',
      vacancyGrowth: 'Reported demand stands at 808 vs 217 authorized training seats in Gorakhpur [SIH dummy dataset].',
      supplyStagnation: 'Retail training centres report 44.9% placement rate with 536 underutilized physical classroom seats [SIH dummy dataset].',
      employerHiringTrend: 'Regional installation contractor recruitment orders indicate sustained hiring demand [SIH dummy dataset].'
    },
    constraints: 'Requires electrical lab equipment retrofit kit estimated at ₹6,500 per seat (total retrofit capex ₹6.3 Lakhs). Donor safety enforced (gap ratio <= 0.05).',
    expectedImpact: {
      gapReductionPercent: 6.2,
      supplyCoveragePercent: 6,
      estimatedCostINR: 630500
    },
    confidence: 82,
    status: 'pending',
    datasetChip: 'SIH dummy dataset',
    derivation: 'Linear Programming Solver (PuLP)'
  },
  // 2. Pune EV Diagnostics Hub (Illustrative, not model output)
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
    reason: 'High-voltage certified diagnostic technicians needed across automotive clusters in Chakan & Bhosari [Illustrative, not model output].',
    reasonHi: 'चाकन और भोसरी के ऑटोमोटिव समूहों में उच्च-वोल्टेज प्रमाणित तकनीशियन आवश्यक [उदाहरणात्मक, मॉडल आउटपुट नहीं]।',
    evidence: {
      demandSignal: 'Reported hiring (dummy dataset): Dealership service networks report expanding diagnostic bay staffing requirements.',
      vacancyGrowth: 'Dealership service bays reporting 35+ days lead time to hire qualified battery diagnostic personnel [SIH dummy dataset].',
      supplyStagnation: 'Limited training facilities equipped with live battery simulation modules in the district.',
      employerHiringTrend: 'Auto ancillary consortium willing to support co-investment for training rigs [SIH dummy dataset].'
    },
    constraints: 'High-voltage safety clearances required under CEA regulations prior to live pack testing.',
    expectedImpact: {
      gapReductionPercent: 54,
      supplyCoveragePercent: 18,
      estimatedCostINR: 5800000
    },
    confidence: 81,
    status: 'pending',
    datasetChip: 'SIH dummy dataset',
    derivation: 'Illustrative, not model output'
  },
  // 3. Lucknow Indic AI Hub (Illustrative, not model output)
  {
    id: 'REC-2026-03',
    rank: 3,
    title: 'Launch Indic AI Annotation Hub in Lucknow Satellite Centers',
    titleHi: 'लखनऊ में इंडिक एआई एनोटेशन हब शुरू करें',
    type: 'new_curriculum',
    toTrade: 'AI/ML Data Annotation Specialist',
    toTradeHi: 'एआई/एमएल डेटा एनोटेशन विशेषज्ञ',
    toNco: '2512.0101',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    recommendedSeats: 350,
    reason: 'High-volume data annotation demand across regional tech corridor [Illustrative, not model output].',
    reasonHi: 'क्षेत्रीय तकनीकी गलियारे में उच्च मात्रा में डेटा एनोटेशन मांग [उदाहरणात्मक, मॉडल आउटपुट नहीं]।',
    evidence: {
      demandSignal: 'Reported hiring (dummy dataset): Digital services vendors posting annotation and linguistic validation positions.',
      vacancyGrowth: 'Regional tech services demand expanding outside metropolitan centers [SIH dummy dataset].',
      supplyStagnation: 'Formalized curriculum integration needed in satellite training centers.',
      employerHiringTrend: 'IT BPM firms indicate recruitment interest upon qualification pack completion [SIH dummy dataset].'
    },
    constraints: 'Requires broadband computer labs with dual-monitor setups.',
    expectedImpact: {
      gapReductionPercent: 58,
      supplyCoveragePercent: 21,
      estimatedCostINR: 2400000
    },
    confidence: 86,
    status: 'pending',
    datasetChip: 'SIH dummy dataset',
    derivation: 'Illustrative, not model output'
  },
  // 4. Ahmedabad CNC Hub (Illustrative, not model output)
  {
    id: 'REC-2026-04',
    rank: 4,
    title: 'Expand Multi-Axis CNC Machining Capacity in Ahmedabad',
    titleHi: 'अहमदाबाद में बहु-अक्ष सीएनसी मशीनिंग क्षमता का विस्तार करें',
    type: 'seat_expansion',
    toTrade: 'CNC Machine Operator',
    toTradeHi: 'सीएनसी मशीन ऑपरेटर',
    toNco: '8151.0101',
    district: 'Ahmedabad',
    state: 'Gujarat',
    recommendedSeats: 250,
    reason: 'Precision manufacturing growth creating sustained demand for multi-axis operators [Illustrative, not model output].',
    reasonHi: 'सटीक विनिर्माण वृद्धि बहु-अक्ष ऑपरेटरों के लिए निरंतर मांग पैदा कर रही है [उदाहरणात्मक, मॉडल आउटपुट नहीं]।',
    evidence: {
      demandSignal: 'Reported hiring (dummy dataset): Industrial machinery manufacturers posting steady operator requirements.',
      vacancyGrowth: 'Components manufacturing cluster expanding in industrial estates [SIH dummy dataset].',
      supplyStagnation: 'Existing simulator centers operating near full capacity.',
      employerHiringTrend: 'Machine tool manufacturers offering dual-apprenticeship placements [SIH dummy dataset].'
    },
    constraints: 'High capex for 5-axis CNC simulators; offset via industry equipment sharing.',
    expectedImpact: {
      gapReductionPercent: 42,
      supplyCoveragePercent: 15,
      estimatedCostINR: 3200000
    },
    confidence: 79,
    status: 'pending',
    datasetChip: 'SIH dummy dataset',
    derivation: 'Illustrative, not model output'
  }
];

export const DATA_HEALTH_METRIC: DataHealthMetric = {
  sourcesConnected: 3,
  sourcesTotal: 4,
  freshnessPercent: 98.4,
  mappingConfidencePercent: 99.2,
  forecastConfidencePercent: 91.5,
  dataQualityPercent: 99.8,
  lastRunTimestamp: '2026-10-04 (data through Oct 2024)',
  lastRunId: 'RUN-SIH-001',
  totalRecords: 8704,
  totalDistricts: 16,
  totalStates: 5,
  totalTrades: 16,
  dataThrough: 'Oct 2024',
  lastIngestDate: '2026-10-04',
  pipelineRunId: 'RUN-SIH-001',
  datasetMode: 'sih_dummy',
  dataSource: 'SIH dummy dataset',
  wapeBaseline: 6.70,
  wapeLightgbm: 2.86,
  errorReductionPercent: 57.31,
  dataHash: '01b23bfc01b7',
  models: [
    { name: 'LightGBM Regressor (Production)', wape: 2.86, mae: 14.2, lastTrained: '2026-10-04', status: 'optimal' },
    { name: 'ARIMA Baseline', wape: 6.70, mae: 32.5, lastTrained: '2026-10-04', status: 'healthy' },
    { name: 'Holt-Winters Seasonal', wape: 5.42, mae: 26.8, lastTrained: '2026-10-04', status: 'healthy' },
    { name: 'Random Forest Regressor', wape: 3.94, mae: 19.1, lastTrained: '2026-10-04', status: 'healthy' }
  ],
  backtestHorizons: [
    { horizon: '3M', model: 'LightGBM Regressor', wape: 2.12, mase: 0.41, coverage_80: 84.5, coverage_95: 96.2, sample_count: 512 },
    { horizon: '6M', model: 'LightGBM Regressor', wape: 2.86, mase: 0.54, coverage_80: 82.1, coverage_95: 95.1, sample_count: 512 },
    { horizon: '12M', model: 'LightGBM Regressor', wape: 4.15, mase: 0.69, coverage_80: 79.4, coverage_95: 93.8, sample_count: 512 }
  ],
  sources: [
    { name: 'SIH Monthly Intelligence Canonical Dataset', type: 'Demo Dataset', status: 'Active', records: '8,704', latency: '42ms' },
    { name: 'Local Government Directory (LGD) Master', type: 'Public Aggregate', status: 'Synced', records: '16 Districts', latency: '12ms' },
    { name: 'National Classification of Occupations (NCO-2015)', type: 'Public Aggregate', status: 'Synced', records: '16 Trades', latency: '8ms' },
    { name: 'National Career Service (NCS) API Feed', type: 'Planned Government Feed', status: 'Pending', records: 'Scheduled', latency: 'N/A' }
  ]
};

export const COPILOT_KNOWLEDGE = [
  {
    question: 'What is KaushalYuva?',
    questionHi: 'कौशल युवा क्या है?',
    answer: 'KaushalYuva is an AI-enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine designed for the Ministry of Skill Development & Entrepreneurship (MSDE). It ingests labour signals, projects 3M/6M/12M job demand, detects structural skill gaps, and solves seat reallocation under donor safety constraints.',
    answerHi: 'कौशल युवा एक एआई-सक्षम श्रम बाजार आसूचना और कौशल मांग-आपूर्ति पूर्वानुमान इंजन है जिसे कौशल विकास और उद्यमिता मंत्रालय (MSDE) के लिए डिज़ाइन किया गया है। यह श्रम संकेतों को ग्रहण करता है, 3M/6M/12M नौकरी की मांग का पूर्वानुमान लगाता है, कौशल अंतराल का पता लगाता है, और दाता सुरक्षा सीमाओं के तहत सीट पुनर्आवंटन हल करता है।'
  },
  {
    question: 'What dataset is currently loaded?',
    questionHi: 'वर्तमान में कौन सा डेटासेट लोड है?',
    answer: 'The system is currently running on the SIH dummy dataset (run RUN-SIH-001, data through Oct 2024) covering 16 districts across 5 states (Uttar Pradesh, Maharashtra, Karnataka, Gujarat, Tamil Nadu) and 16 occupational trades.',
    answerHi: 'प्रणाली वर्तमान में SIH डमी डेटासेट (रन RUN-SIH-001, डेटा अक्टूबर 2024 तक) पर चल रही है, जिसमें 5 राज्यों (उत्तर प्रदेश, महाराष्ट्र, कर्नाटक, गुजरात, तमिलनाडु) के 16 जिले और 16 व्यावसायिक ट्रेड्स शामिल हैं।'
  },
  {
    question: 'How is the Gorakhpur solar shortfall solved?',
    questionHi: 'गोरखपुर सोलर की कमी को कैसे हल किया जाता है?',
    answer: 'In Gorakhpur, Solar PV Installer faces a deficit of 711 (demand 808 vs effective supply 97). Retail Sales Associate has physical capacity surplus (916 seats vs 380 demand). The LP solver reallocates 97 seats while ensuring the donor Retail deficit ratio stays <= 0.05 (Donor Score <= 52 Balanced).',
    answerHi: 'गोरखपुर में, सोलर पीवी इंस्टॉलर में 711 का घाटा है (मांग 808 बनाम प्रभावी आपूर्ति 97)। रिटेल सेल्स एसोसिएट के पास भौतिक क्षमता अधिशेष है (916 सीटें बनाम 380 मांग)। एलपी सॉल्वर 97 सीटों को पुनर्आवंटित करता है जबकि यह सुनिश्चित करता है कि दाता रिटेल घाटा अनुपात <= 0.05 (दाता स्कोर <= 52 संतुलित) बना रहे।'
  }
];
