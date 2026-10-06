/**
 * KaushalYuva Internationalization (i18n) Engine (§3)
 * Full bilingual support (English + 100% Hindi) backed by JSON dictionaries and reference taxonomy.
 */

import enDict from '../../messages/en.json';
import hiDict from '../../messages/hi.json';
import hiRef from '../../messages/hi.reference.json';

export type Language = 'en' | 'hi';

export interface ReferenceData {
  states: Record<string, string>;
  districts: Record<string, string>;
  sectors: Record<string, string>;
  occupations: Record<string, string>;
  severityBands: Record<string, string>;
  alertTypes: Record<string, string>;
}

export const referenceData: ReferenceData = hiRef;

export const translations = {
  en: {
    ...enDict,
    // Backward compatibility mappings for existing components
    appTitle: enDict.brand.name,
    appSubtitle: enDict.brand.descriptor,
    nationalIntelligence: enDict.overview.title,
    heroSubtitle: enDict.hero.subhead,
    metrics: {
      demand: enDict.glossary.demand,
      effectiveSupply: enDict.glossary.effectiveSupply,
      netGap: enDict.overview.kpis.netDeficit,
      atRiskTrades: 'At-Risk Trades',
      earlyWarnings: enDict.overview.kpis.activeAlerts,
      recommendations: 'Priority Actions',
      gapScore: enDict.glossary.gapScore,
      confidence: enDict.glossary.confidence,
      shortageProb: '6M Shortage Probability'
    },
    status: {
      severeShortage: enDict.glossary.severeShortage,
      moderateShortage: enDict.glossary.moderateShortage,
      balanced: enDict.glossary.balanced,
      moderateOversupply: enDict.glossary.moderateOversupply,
      severeOversupply: enDict.glossary.severeOversupply,
      demoDataset: enDict.glossary.demoDataset,
      publicAggregate: 'Public Aggregate',
      plannedFeed: 'Planned Government Feed'
    },
    actions: {
      simulate: enDict.glossary.simulate,
      viewEvidence: enDict.common.viewEvidence,
      exportAction: 'Export Action',
      approveDraft: 'Approve Draft',
      acknowledge: enDict.common.acknowledge,
      investigate: enDict.common.investigate,
      downloadCsv: enDict.common.downloadCsv,
      downloadXlsx: enDict.common.downloadXlsx,
      copyEndpoint: enDict.common.copyEndpoint,
      askCopilot: 'Ask Kaushal Copilot'
    }
  },
  hi: {
    ...hiDict,
    // Backward compatibility mappings for existing components
    appTitle: hiDict.brand.name,
    appSubtitle: hiDict.brand.descriptor,
    nationalIntelligence: hiDict.overview.title,
    heroSubtitle: hiDict.hero.subhead,
    metrics: {
      demand: hiDict.glossary.demand,
      effectiveSupply: hiDict.glossary.effectiveSupply,
      netGap: hiDict.overview.kpis.netDeficit,
      atRiskTrades: 'जोखिम में ट्रेड्स',
      earlyWarnings: hiDict.overview.kpis.activeAlerts,
      recommendations: 'प्राथमिक कार्य',
      gapScore: hiDict.glossary.gapScore,
      confidence: hiDict.glossary.confidence,
      shortageProb: '6-माह कमी संभावना'
    },
    status: {
      severeShortage: hiDict.glossary.severeShortage,
      moderateShortage: hiDict.glossary.moderateShortage,
      balanced: hiDict.glossary.balanced,
      moderateOversupply: hiDict.glossary.moderateOversupply,
      severeOversupply: hiDict.glossary.severeOversupply,
      demoDataset: hiDict.glossary.demoDataset,
      publicAggregate: 'सार्वजनिक संकलन',
      plannedFeed: 'प्रस्तावित सरकारी फीड'
    },
    actions: {
      simulate: hiDict.glossary.simulate,
      viewEvidence: hiDict.common.viewEvidence,
      exportAction: 'कार्रवाई निर्यात करें',
      approveDraft: 'प्रारूप स्वीकृत करें',
      acknowledge: hiDict.common.acknowledge,
      investigate: hiDict.common.investigate,
      downloadCsv: hiDict.common.downloadCsv,
      downloadXlsx: hiDict.common.downloadXlsx,
      copyEndpoint: hiDict.common.copyEndpoint,
      askCopilot: 'कौशल कोपायलट से पूछें'
    }
  }
};

export const districtNameToHi: Record<string, string> = {
  'Gorakhpur': 'गोरखपुर',
  'Lucknow': 'लखनऊ',
  'Varanasi': 'वाराणसी',
  'Gautam Buddha Nagar': 'गौतम बुद्ध नगर (नोएडा)',
  'Pune': 'पुणे',
  'Nagpur': 'नागपुर',
  'Chhatrapati Sambhajinagar': 'छत्रपति संभाजीनगर',
  'Nashik': 'नाशिक',
  'Bengaluru Urban': 'बेंगलुरु शहरी',
  'Mysuru': 'मैसूरु',
  'Dakshina Kannada': 'दक्षिण कन्नड़ (मंगलुरु)',
  'Ahmedabad': 'अहमदाबाद',
  'Surat': 'सूरत',
  'Vadodara': 'वडोदरा'
};

/**
 * Resolves localized name for state, district, sector, occupation, or severity band
 */
export function getLocalizedEntityName(
  type: keyof ReferenceData, 
  key: string | number, 
  lang: Language = 'en', 
  fallback?: string
): string {
  const strKey = String(key);
  if (lang === 'hi') {
    if (type === 'districts' && districtNameToHi[strKey]) {
      return districtNameToHi[strKey];
    }
    const hiMap = referenceData[type];
    if (hiMap && hiMap[strKey]) {
      return hiMap[strKey];
    }
  }
  return fallback || strKey;
}

export function localizeSector(sector: string, lang: Language = 'en'): string {
  if (lang === 'hi' && referenceData.sectors[sector]) {
    return referenceData.sectors[sector];
  }
  return sector;
}

/**
 * Normalizes entity display string based on current language
 */
export function resolveDisplayName(
  item: { title?: string; name?: string; titleHi?: string; nameHi?: string; ncoCode?: string; lgdCode?: number },
  lang: Language = 'en'
): string {
  if (lang === 'hi') {
    if (item.titleHi) return item.titleHi;
    if (item.nameHi) return item.nameHi;
    if (item.ncoCode && referenceData.occupations[item.ncoCode]) {
      return referenceData.occupations[item.ncoCode];
    }
    if (item.lgdCode && referenceData.districts[String(item.lgdCode)]) {
      return referenceData.districts[String(item.lgdCode)];
    }
  }
  return item.title || item.name || '';
}

export const localizedSkills: Record<string, string> = {
  'Rooftop Inverter Wiring': 'रूफटॉप इन्वर्टर वायरिंग',
  'Solar Panel Array Mounting': 'सोलर पैनल ऐरे माउंटिंग',
  'Grid Synchronization': 'ग्रिड तुल्यकालन',
  'Safety Compliance IEC 61215': 'सुरक्षा अनुपालन IEC 61215',
  'Point-of-Sale (POS) Operations': 'पीओएस संचालन',
  'Customer Relationship Management': 'ग्राहक संबंध प्रबंधन',
  'Inventory Stacking': 'इन्वेंट्री स्टैकिंग',
  'Cash Reconciliation': 'रोकड़ मिलान',
  'High-Voltage Battery Diagnostics': 'उच्च वोल्टेज बैटरी निदान',
  'BMS Calibration': 'बीएमएस अंशांकन',
  'Regenerative Braking Troubleshooting': 'पुनर्योजी ब्रेकिंग निवारण',
  'Electric Drivetrain Repair': 'इलेक्ट्रिक ड्राइवट्रेन मरम्मत',
  'Multimodal Bounding Boxes': 'मल्टीमॉडल बाउंडिंग बॉक्स',
  'Indic Language Tokenization': 'भारतीय भाषा टोकनाइज़ेशन',
  'LiDAR 3D Point Cloud Annotation': 'लिडार 3D पॉइंट क्लाउड एनोटेशन',
  'RLHF Ranking': 'आरएलएचएफ रैंकिंग',
  'G-Code & M-Code Editing': 'जी-कोड एवं एम-कोड संपादन',
  'Coordinate Measurement Machine (CMM)': 'निर्देशांक मापन मशीन (CMM)',
  'Tolerance Metrology': 'सहनशीलता मेट्रोलॉजी',
  'Tool Wear Monitoring': 'टूल वियर निगरानी',
  'Brushless Motor Diagnostics': 'ब्रशलेस मोटर निदान',
  'Flight Controller Firmware Flashing': 'फ़्लाइट कंट्रोलर फ़र्मवेयर फ़्लैशिंग',
  'Propeller Balancing': 'प्रोपेलर संतुलन',
  'DGCA Regulatory Compliance': 'डीजीसीए नियामक अनुपालन',
  'Primary Triage & Vitals Monitoring': 'प्राथमिक ट्राइएज एवं वाइटल्स निगरानी',
  'Point-of-Care Diagnostic Testing': 'पॉइंट-ऑफ-केयर डायग्नोस्टिक परीक्षण',
  'Immunization Logistics': 'टीकाकरण रसद',
  'EHR Entry': 'ईएचआर प्रविष्टि',
  'Single-Phase & Three-Phase Smart Meter Retrofit': 'एकल एवं त्रि-चरण स्मार्ट मीटर रेट्रोफ़िट',
  'Cellular RF Mesh Pairing': 'सेल्युलर आरएफ मेश पेयरिंग',
  'Tamper Detection': 'छेड़छाड़ पहचान',
  'DISCOM Portal Handshake': 'डिस्कॉम पोर्टल हैंडशेक',
  'PLC Programming (Siemens/Allen-Bradley)': 'पीएलसी प्रोग्रामिंग (सीमेंस/एलन-ब्रैडली)',
  'SCADA Configuration': 'स्काडा कॉन्फ़िगरेशन',
  'Industrial Ethernet / Modbus': 'औद्योगिक ईथरनेट / मोडबस',
  'Pneumatic Actuators': 'वायवीय एक्चुएटर्स',
  'Cold Calling & Script Adherence': 'कोल्ड कॉलिंग एवं स्क्रिप्ट पालन',
  'Lead Management CRM': 'लीड प्रबंधन सीआरएम',
  'Objection Handling': 'आपत्ति समाधान',
  'Keyboard Typing 35 WPM': 'कीबोर्ड टाइपिंग 35 डब्ल्यूपीएम',
  'MS Excel Formatting': 'एमएस एक्सेल फॉर्मेटिंग',
  'Scanning Documents': 'दस्तावेज़ स्कैनिंग',
  'SOC Alert Triage': 'एसओसी अलर्ट ट्राइएज',
  'Network Packet Analysis (Wireshark)': 'नेटवर्क पैकेट विश्लेषण (वायरशार्क)',
  'Endpoint Detection & Response (EDR)': 'एंडपॉइंट डिटेक्शन एवं रिस्पॉन्स (ईडीआर)',
  'Vulnerability Remediation': 'भेद्यता निवारण'
};

export function localizeSkill(skill: string, lang: Language = 'en'): string {
  if (lang === 'hi' && localizedSkills[skill]) {
    return localizedSkills[skill];
  }
  return skill;
}

export const localizedQualifications: Record<string, string> = {
  'QP-SGJ/Q0101 (Solar PV Installer Suryamitra)': 'QP-SGJ/Q0101 (सोलर पीवी इंस्टॉलर सूर्यमित्र)',
  'NSQF Level 4 Certification': 'NSQF स्तर 4 प्रमाणन',
  'QP-RAS/Q0104 (Retail Sales Associate)': 'QP-RAS/Q0104 (रिटेल सेल्स एसोसिएट)',
  'NSQF Level 3 Certification': 'NSQF स्तर 3 प्रमाणन',
  'QP-ASC/Q1424 (Electric Vehicle Service Lead Technician)': 'QP-ASC/Q1424 (इलेक्ट्रिक वाहन सर्विस लीड तकनीशियन)',
  'NSQF Level 4': 'NSQF स्तर 4',
  'QP-SSC/Q8101 (Data Annotation Associate)': 'QP-SSC/Q8101 (डेटा एनोटेशन सहयोगी)',
  'NSQF Level 5': 'NSQF स्तर 5',
  'QP-CSC/Q0115 (CNC Operator Vertical Machining)': 'QP-CSC/Q0115 (सीएनसी ऑपरेटर वर्टिकल मशीनिंग)',
  'QP-AER/Q0801 (Drone Technician & Overhaul)': 'QP-AER/Q0801 (ड्रोन तकनीशियन एवं ओवरहाल)',
  'QP-HSS/Q5101 (General Duty Assistant)': 'QP-HSS/Q5101 (जनरल ड्यूटी असिस्टेंट)',
  'QP-PSS/Q0110 (Smart Meter Technician)': 'QP-PSS/Q0110 (स्मार्ट मीटर तकनीशियन)',
  'NSQF Level 3': 'NSQF स्तर 3',
  'QP-IAS/Q8001 (Automation Engineer Associate)': 'QP-IAS/Q8001 (ऑटोमेशन इंजीनियर सहयोगी)',
  'QP-BPO/Q0201 (Domestic Tele-Sales Associate)': 'QP-BPO/Q0201 (घरेलू टेली-सेल्स सहयोगी)',
  'QP-SSC/Q2212 (Domestic Data Entry Operator)': 'QP-SSC/Q2212 (घरेलू डेटा एंट्री ऑपरेटर)',
  'QP-SSC/Q0909 (Cyber Security Analyst Tier-1)': 'QP-SSC/Q0909 (साइबर सुरक्षा विश्लेषक टियर-1)'
};

export function localizeQualification(qual: string, lang: Language = 'en'): string {
  if (lang === 'hi' && localizedQualifications[qual]) {
    return localizedQualifications[qual];
  }
  return qual;
}
