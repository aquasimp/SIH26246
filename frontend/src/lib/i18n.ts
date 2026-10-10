/**
 * KaushalYuva Internationalization (i18n) Engine (§3)
 * Full multilingual support for 7 major Indian languages:
 * English (en), Hindi (hi), Marathi (mr), Tamil (ta), Telugu (te), Kannada (kn), Bengali (bn).
 */

import enDict from '../../messages/en.json';
import hiDict from '../../messages/hi.json';
import mrDict from '../../messages/mr.json';
import taDict from '../../messages/ta.json';
import teDict from '../../messages/te.json';
import knDict from '../../messages/kn.json';
import bnDict from '../../messages/bn.json';
import hiRef from '../../messages/hi.reference.json';

export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'bn';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  region: string;
  script: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', region: 'National / Official', script: 'Latin' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', region: 'Uttar Pradesh & Central', script: 'Devanagari' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', region: 'Maharashtra (Pune / Nashik)', script: 'Devanagari' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', region: 'Tamil Nadu (Coimbatore)', script: 'Tamil' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', region: 'Telangana & Andhra Pradesh', script: 'Telugu' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', region: 'Karnataka (Bengaluru / Mysuru)', script: 'Kannada' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', region: 'West Bengal & Eastern Corridors', script: 'Bengali' },
];

export interface ReferenceData {
  states: Record<string, string>;
  districts: Record<string, string>;
  sectors: Record<string, string>;
  occupations: Record<string, string>;
  severityBands: Record<string, string>;
  alertTypes: Record<string, string>;
}

export const referenceData: ReferenceData = hiRef;

function buildTranslationBundle(dict: any) {
  return {
    ...dict,
    appTitle: dict.brand?.name || enDict.brand.name,
    appSubtitle: dict.brand?.descriptor || enDict.brand.descriptor,
    nationalIntelligence: dict.overview?.title || enDict.overview.title,
    heroSubtitle: dict.hero?.subhead || enDict.hero.subhead,
    metrics: {
      demand: dict.glossary?.demand || enDict.glossary.demand,
      effectiveSupply: dict.glossary?.effectiveSupply || enDict.glossary.effectiveSupply,
      netGap: dict.overview?.kpis?.netDeficit || enDict.overview.kpis.netDeficit,
      atRiskTrades: dict.glossary?.atRiskTrades || 'At-Risk Trades',
      earlyWarnings: dict.overview?.kpis?.activeAlerts || enDict.overview.kpis.activeAlerts,
      recommendations: dict.nav?.recommendations || 'Priority Actions',
      gapScore: dict.glossary?.gapScore || enDict.glossary.gapScore,
      confidence: dict.glossary?.confidence || enDict.glossary.confidence,
      shortageProb: dict.hero?.proofPanel?.shortageProbability || '6M Shortage Probability'
    },
    status: {
      severeShortage: dict.glossary?.severeShortage || enDict.glossary.severeShortage,
      moderateShortage: dict.glossary?.moderateShortage || enDict.glossary.moderateShortage,
      balanced: dict.glossary?.balanced || enDict.glossary.balanced,
      moderateOversupply: dict.glossary?.moderateOversupply || enDict.glossary.moderateOversupply,
      severeOversupply: dict.glossary?.severeOversupply || enDict.glossary.severeOversupply,
      demoDataset: dict.glossary?.demoDataset || enDict.glossary.demoDataset,
      publicAggregate: 'Public Aggregate',
      plannedFeed: 'Planned Government Feed'
    },
    actions: {
      simulate: dict.glossary?.simulate || enDict.glossary.simulate,
      viewEvidence: dict.common?.viewEvidence || enDict.common.viewEvidence,
      exportAction: 'Export Action',
      approveDraft: 'Approve Draft',
      acknowledge: dict.common?.acknowledge || enDict.common.acknowledge,
      investigate: dict.common?.investigate || enDict.common.investigate,
      downloadCsv: dict.common?.downloadCsv || enDict.common.downloadCsv,
      downloadXlsx: dict.common?.downloadXlsx || enDict.common.downloadXlsx,
      copyEndpoint: dict.common?.copyEndpoint || enDict.common.copyEndpoint,
      askCopilot: dict.copilot?.title || 'Ask Kaushal Copilot'
    }
  };
}

export const translations: Record<Language, ReturnType<typeof buildTranslationBundle>> = {
  en: buildTranslationBundle(enDict),
  hi: buildTranslationBundle(hiDict),
  mr: buildTranslationBundle(mrDict),
  ta: buildTranslationBundle(taDict),
  te: buildTranslationBundle(teDict),
  kn: buildTranslationBundle(knDict),
  bn: buildTranslationBundle(bnDict),
};

export const stateNamesLocalized: Record<Language, Record<string, string>> = {
  en: {
    'Gujarat': 'Gujarat',
    'Karnataka': 'Karnataka',
    'Maharashtra': 'Maharashtra',
    'Tamil Nadu': 'Tamil Nadu',
    'Uttar Pradesh': 'Uttar Pradesh'
  },
  hi: {
    'Gujarat': 'गुजरात',
    'Karnataka': 'कर्नाटक',
    'Maharashtra': 'महाराष्ट्र',
    'Tamil Nadu': 'तमिलनाडु',
    'Uttar Pradesh': 'उत्तर प्रदेश'
  },
  mr: {
    'Gujarat': 'गुजरात',
    'Karnataka': 'कर्नाटक',
    'Maharashtra': 'महाराष्ट्र',
    'Tamil Nadu': 'तमिळनाडू',
    'Uttar Pradesh': 'उत्तर प्रदेश'
  },
  ta: {
    'Gujarat': 'குஜராத்',
    'Karnataka': 'கர்நாடகா',
    'Maharashtra': 'மகாராஷ்டிரா',
    'Tamil Nadu': 'தமிழ்நாடு',
    'Uttar Pradesh': 'உத்தரப் பிரதேசம்'
  },
  te: {
    'Gujarat': 'గుజరాత్',
    'Karnataka': 'కర్ణాటక',
    'Maharashtra': 'మహారాష్ట్ర',
    'Tamil Nadu': 'తమిళనాడు',
    'Uttar Pradesh': 'ఉత్తరప్రదేశ్'
  },
  kn: {
    'Gujarat': 'ಗುಜರಾತ್',
    'Karnataka': 'ಕರ್ನಾಟಕ',
    'Maharashtra': 'ಮಹಾರಾಷ್ಟ್ರ',
    'Tamil Nadu': 'ತಮಿಳುನಾಡು',
    'Uttar Pradesh': 'ಉತ್ತರ ಪ್ರದೇಶ'
  },
  bn: {
    'Gujarat': 'গুজরাট',
    'Karnataka': 'কর্ণাটক',
    'Maharashtra': 'মহারাষ্ট্র',
    'Tamil Nadu': 'তামিলনাড়ু',
    'Uttar Pradesh': 'উত্তরপ্রদেশ'
  }
};

export const stateNameToHi = stateNamesLocalized.hi;

export const districtNamesLocalized: Record<Language, Record<string, string>> = {
  en: {
    'Gorakhpur': 'Gorakhpur',
    'Lucknow': 'Lucknow',
    'Varanasi': 'Varanasi',
    'Gautam Buddha Nagar': 'Gautam Buddha Nagar',
    'Kanpur Nagar': 'Kanpur Nagar',
    'Pune': 'Pune',
    'Nagpur': 'Nagpur',
    'Chhatrapati Sambhajinagar': 'Chhatrapati Sambhajinagar',
    'Nashik': 'Nashik',
    'Bengaluru Urban': 'Bengaluru Urban',
    'Mysuru': 'Mysuru',
    'Dharwad': 'Dharwad',
    'Dakshina Kannada': 'Dakshina Kannada',
    'Ahmedabad': 'Ahmedabad',
    'Surat': 'Surat',
    'Vadodara': 'Vadodara',
    'Rajkot': 'Rajkot',
    'Coimbatore': 'Coimbatore'
  },
  hi: {
    'Gorakhpur': 'गोरखपुर',
    'Lucknow': 'लखनऊ',
    'Varanasi': 'वाराणसी',
    'Gautam Buddha Nagar': 'गौतम बुद्ध नगर',
    'Kanpur Nagar': 'कानपुर नगर',
    'Pune': 'पुणे',
    'Nagpur': 'नागपुर',
    'Chhatrapati Sambhajinagar': 'छत्रपति संभाजीनगर',
    'Nashik': 'नासिक',
    'Bengaluru Urban': 'बेंगलुरु शहरी',
    'Mysuru': 'मैसूरु',
    'Dharwad': 'धारवाड़',
    'Dakshina Kannada': 'दक्षिण कन्नड़',
    'Ahmedabad': 'अहमदाबाद',
    'Surat': 'सूरत',
    'Vadodara': 'वडोदरा',
    'Rajkot': 'राजकोट',
    'Coimbatore': 'कोयंबटूर'
  },
  mr: {
    'Gorakhpur': 'गोरखपूर',
    'Lucknow': 'लखनौ',
    'Varanasi': 'वाराणसी',
    'Gautam Buddha Nagar': 'गौतम बुद्ध नगर',
    'Kanpur Nagar': 'कानपूर नगर',
    'Pune': 'पुणे',
    'Nagpur': 'नागपूर',
    'Chhatrapati Sambhajinagar': 'छत्रपती संभाजीनगर',
    'Nashik': 'नाशिक',
    'Bengaluru Urban': 'बंगळुरू शहर',
    'Mysuru': 'मैसूरु',
    'Dharwad': 'धारवाड',
    'Dakshina Kannada': 'दक्षिण कन्नड',
    'Ahmedabad': 'अहमदाबाद',
    'Surat': 'सुरत',
    'Vadodara': 'वडोदरा',
    'Rajkot': 'राजकोट',
    'Coimbatore': 'कोइम्बतूर'
  },
  ta: {
    'Gorakhpur': 'கோரக்பூர்',
    'Lucknow': 'லக்னோ',
    'Varanasi': 'வாரணாசி',
    'Gautam Buddha Nagar': 'கௌதம் புத் நகர்',
    'Kanpur Nagar': 'கான்பூர் நகர்',
    'Pune': 'புனே',
    'Nagpur': 'நாக்பூர்',
    'Chhatrapati Sambhajinagar': 'சத்ரபதி சம்பாஜிநகர்',
    'Nashik': 'நாசிக்',
    'Bengaluru Urban': 'பெங்களூரு நகர்ப்புறம்',
    'Mysuru': 'மைசூரு',
    'Dharwad': 'தார்வாட்',
    'Dakshina Kannada': 'தட்சிண கன்னடா',
    'Ahmedabad': 'அகமதாபாத்',
    'Surat': 'சூரத்',
    'Vadodara': 'வதோதரா',
    'Rajkot': 'ராஜ்கோட்',
    'Coimbatore': 'கோயம்புத்தூர்'
  },
  te: {
    'Gorakhpur': 'గోరఖ్‌పూర్',
    'Lucknow': 'లక్నో',
    'Varanasi': 'వారణాసి',
    'Gautam Buddha Nagar': 'గౌతమ్ బుద్ధ నగర్',
    'Kanpur Nagar': 'కాన్పూర్ నగర్',
    'Pune': 'పూణే',
    'Nagpur': 'నాగ్‌పూర్',
    'Chhatrapati Sambhajinagar': 'ఛత్రపతి శంభాజీనగర్',
    'Nashik': 'నాసిక్',
    'Bengaluru Urban': 'బెంగళూరు అర్బన్',
    'Mysuru': 'మైసూర్',
    'Dharwad': 'ధార్వాడ్',
    'Dakshina Kannada': 'దక్షిణ కన్నడ',
    'Ahmedabad': 'అహ్మదాబాద్',
    'Surat': 'సూరత్',
    'Vadodara': 'వడోదర',
    'Rajkot': 'రాజ్‌కోట్',
    'Coimbatore': 'కోయంబత్తూరు'
  },
  kn: {
    'Gorakhpur': 'ಗೋರಖ್‌ಪುರ',
    'Lucknow': 'ಲಖನೌ',
    'Varanasi': 'ವಾರಣಾಸಿ',
    'Gautam Buddha Nagar': 'ಗೌತಮ್ ಬುದ್ಧ ನಗರ',
    'Kanpur Nagar': 'ಕಾನ್ಪುರ ನಗರ',
    'Pune': 'ಪುಣೆ',
    'Nagpur': 'ನಾಗಪುರ',
    'Chhatrapati Sambhajinagar': 'ಛತ್ರಪತಿ ಸಂಭಾಜಿನಗರ',
    'Nashik': 'ನಾಸಿಕ್',
    'Bengaluru Urban': 'ಬೆಂಗಳೂರು ನಗರ',
    'Mysuru': 'ಮೈಸೂರು',
    'Dharwad': 'ಧಾರವಾಡ',
    'Dakshina Kannada': 'ದಕ್ಷಿಣ ಕನ್ನಡ',
    'Ahmedabad': 'ಅಹಮದಾಬಾದ್',
    'Surat': 'ಸೂರತ್',
    'Vadodara': 'ವಡೋದರಾ',
    'Rajkot': 'ರಾಜಕೋಟ್',
    'Coimbatore': 'ಕೊಯಮತ್ತೂರು'
  },
  bn: {
    'Gorakhpur': 'গোরক্ষপুর',
    'Lucknow': 'লখনউ',
    'Varanasi': 'বারাণসী',
    'Gautam Buddha Nagar': 'গৌতম বুদ্ধ নগর',
    'Kanpur Nagar': 'কানপুর নগর',
    'Pune': 'পুনে',
    'Nagpur': 'নাগপুর',
    'Chhatrapati Sambhajinagar': 'ছত্রপতি সম্ভাজিনগর',
    'Nashik': 'নাসিক',
    'Bengaluru Urban': 'বেঙ্গালুরু নগর',
    'Mysuru': 'মহীশূর',
    'Dharwad': 'ধারওয়াদ',
    'Dakshina Kannada': 'দক্ষিণ কন্নড়',
    'Ahmedabad': 'আহমেদাবাদ',
    'Surat': 'সুরাট',
    'Vadodara': 'ভাদোদরা',
    'Rajkot': 'রাজকোট',
    'Coimbatore': 'কোয়েম্বাটুর'
  }
};

export const districtNameToHi = districtNamesLocalized.hi;

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
  if (lang !== 'en') {
    if (type === 'districts') {
      const map = districtNamesLocalized[lang];
      if (map && map[strKey]) return map[strKey];
      if (map) {
        const match = Object.entries(map).find(([k]) => k.toLowerCase() === strKey.toLowerCase());
        if (match) return match[1];
      }
    }
    if (type === 'states') {
      const map = stateNamesLocalized[lang];
      if (map && map[strKey]) return map[strKey];
      if (map) {
        const match = Object.entries(map).find(([k]) => k.toLowerCase() === strKey.toLowerCase());
        if (match) return match[1];
      }
    }
    const hiMap = referenceData[type];
    if (hiMap && hiMap[strKey]) {
      return hiMap[strKey];
    }
  }
  return fallback || strKey;
}

export function localizeSector(sector: string, lang: Language = 'en'): string {
  if (lang !== 'en' && referenceData.sectors[sector]) {
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
  if (lang !== 'en') {
    if (item.titleHi && (lang === 'hi' || lang === 'mr')) return item.titleHi;
    if (item.nameHi && (lang === 'hi' || lang === 'mr')) return item.nameHi;
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
  'Vulnerability Remediation': 'भेद्यता निवारण',
  'Technical Diagnostics': 'तकनीकी निदान',
  'Standard Compliance': 'मानक अनुपालन',
  'Preventive Maintenance': 'निवारक रखरखाव'
};

export function localizeSkill(skill: string, lang: Language = 'en'): string {
  if (lang !== 'en' && localizedSkills[skill]) {
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
  if (lang !== 'en' && localizedQualifications[qual]) {
    return localizedQualifications[qual];
  }
  return qual;
}
