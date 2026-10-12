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
import masterLexiconData from './master_lexicon.json';

export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'bn';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  region: string;
  script: string;
  isBeta?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', region: 'National / Official', script: 'Latin', isBeta: false },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', region: 'Uttar Pradesh & Central', script: 'Devanagari', isBeta: false },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', region: 'Maharashtra', script: 'Devanagari', isBeta: true },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', region: 'Tamil Nadu', script: 'Tamil', isBeta: true },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', region: 'Andhra Pradesh & Telangana', script: 'Telugu', isBeta: true },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', region: 'Karnataka', script: 'Kannada', isBeta: true },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', region: 'West Bengal & Eastern', script: 'Bengali', isBeta: true },
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

export const occupationsLocalized: Record<Language, Record<string, string>> = {
  en: {
    'Solar PV Installer': 'Solar PV Installer',
    'Retail Sales Associate': 'Retail Sales Associate',
    'EV Service Technician': 'EV Service Technician',
    'Drone Maintenance Technician': 'Drone Maintenance Technician',
    'AI/ML Data Annotation Specialist': 'AI/ML Data Annotation Specialist',
    'Data Entry Operator': 'Data Entry Operator',
    'CNC Machine Operator': 'CNC Machine Operator',
    'Sewing Machine Operator': 'Sewing Machine Operator',
    'Community Health Assistant': 'Community Health Assistant',
    'Solar Pump Technician': 'Solar Pump Technician',
    'Cold Storage & HVAC Mechanic': 'Cold Storage & HVAC Mechanic',
    'Automotive Assembly Fitter': 'Automotive Assembly Fitter',
    'Smart Meter Installation Technician': 'Smart Meter Installation Technician',
    'Domestic Electrician & Wireman': 'Domestic Electrician & Wireman',
    'Industrial Automation Technician': 'Industrial Automation Technician',
    'Warehouse Logistics Executive': 'Warehouse Logistics Executive'
  },
  hi: {
    'Solar PV Installer': 'सोलर पीवी इंस्टॉलर',
    'Retail Sales Associate': 'रिटेल सेल्स एसोसिएट',
    'EV Service Technician': 'ईवी सर्विस तकनीशियन',
    'Drone Maintenance Technician': 'ड्रोन रखरखाव तकनीशियन',
    'AI/ML Data Annotation Specialist': 'एआई/एमएल डेटा एनोटेशन विशेषज्ञ',
    'Data Entry Operator': 'डेटा एंट्री ऑपरेटर',
    'CNC Machine Operator': 'सीएनसी मशीन ऑपरेटर',
    'Sewing Machine Operator': 'सिलाई मशीन ऑपरेटर',
    'Community Health Assistant': 'सामुदायिक स्वास्थ्य सहायक',
    'Solar Pump Technician': 'सोलर पंप तकनीशियन',
    'Cold Storage & HVAC Mechanic': 'कोल्ड स्टोरेज एवं एचवीएसी मैकेनिक',
    'Automotive Assembly Fitter': 'ऑटोमोटिव असेंबली फिटर',
    'Smart Meter Installation Technician': 'स्मार्ट मीटर इंस्टॉलेशन तकनीशियन',
    'Domestic Electrician & Wireman': 'घरेलू इलेक्ट्रीशियन एवं वायरमैन',
    'Industrial Automation Technician': 'औद्योगिक स्वचालन तकनीशियन',
    'Warehouse Logistics Executive': 'वेयरहाउस लॉजिस्टिक्स एक्जीक्यूटिव'
  },
  mr: {
    'Solar PV Installer': 'सोलर पीव्ही इन्स्टॉलर',
    'Retail Sales Associate': 'किरकोळ विक्री सहयोगी',
    'EV Service Technician': 'ईव्ही सर्व्हिस तंत्रज्ञ',
    'Drone Maintenance Technician': 'ड्रोन देखभाल तंत्रज्ञ',
    'AI/ML Data Annotation Specialist': 'एआय/एमएल डेटा अ‍ॅनोसेशन तज्ज्ञ',
    'Data Entry Operator': 'डेटा एंट्री ऑपरेटर',
    'CNC Machine Operator': 'सीएनसी मशीन ऑपरेटर',
    'Sewing Machine Operator': 'शिलाई मशीन ऑपरेटर',
    'Community Health Assistant': 'समुदाय आरोग्य सहाय्यक',
    'Solar Pump Technician': 'सोलर पंप तंत्रज्ञ',
    'Cold Storage & HVAC Mechanic': 'कोल्ड स्टोरेज आणि एचव्हीएसी मेकॅनिक',
    'Automotive Assembly Fitter': 'ऑटोमोटिव्ह असेंब्ली फिटर',
    'Smart Meter Installation Technician': 'स्मार्ट मीटर इन्स्टॉलेशन तंत्रज्ञ',
    'Domestic Electrician & Wireman': 'घरगुती इलेक्ट्रिशियन आणि वायरमन',
    'Industrial Automation Technician': 'औद्योगिक ऑटोमेशन तंत्रज्ञ',
    'Warehouse Logistics Executive': 'वेअरहाऊस लॉजिस्टिक्स एक्झिक्युटिव्ह'
  },
  ta: {
    'Solar PV Installer': 'சோலார் பிவி நிறுவுநர்',
    'Retail Sales Associate': 'சில்லறை விற்பனை உதவியாளர்',
    'EV Service Technician': 'இவி சேவை தொழில்நுட்ப வல்லுநர்',
    'Drone Maintenance Technician': 'ட்ரோன் பராமரிப்பு தொழில்நுட்ப வல்லுநர்',
    'AI/ML Data Annotation Specialist': 'ஏஐ/எம்எல் தரவு குறிப்பு நிபுணர்',
    'Data Entry Operator': 'தரவு உள்ளீட்டாளர்',
    'CNC Machine Operator': 'சிஎன்சி இயந்திர இயக்குபவர்',
    'Sewing Machine Operator': 'தையல் இயந்திர இயக்குபவர்',
    'Community Health Assistant': 'சமூக சுகாதார உதவியாளர்',
    'Solar Pump Technician': 'சோலார் பம்ப் தொழில்நுட்ப வல்லுநர்',
    'Cold Storage & HVAC Mechanic': 'குளிர்சாதன சேமிப்பு & எச்விஏசி மெக்கானிக்',
    'Automotive Assembly Fitter': 'வாகன அசெம்பிளி ஃபிட்டர்',
    'Smart Meter Installation Technician': 'ஸ்மார்ட் மீட்டர் நிறுவல் தொழில்நுட்ப வல்லுநர்',
    'Domestic Electrician & Wireman': 'வீட்டு எலக்ட்ரீஷியன் & வயர்மேன்',
    'Industrial Automation Technician': 'தொழில்துறை ஆட்டோமேஷன் தொழில்நுட்ப வல்லுநர்',
    'Warehouse Logistics Executive': 'கிடங்கு தளவாட நிர்வாகி'
  },
  te: {
    'Solar PV Installer': 'సోలార్ పివి ఇన్‌స్టాలర్',
    'Retail Sales Associate': 'రిటైల్ సేల్స్ అసోసియేట్',
    'EV Service Technician': 'ఈవీ సర్వీస్ టెక్నీషియన్',
    'Drone Maintenance Technician': 'డ్రోన్ నిర్వహణ టెక్నీషియన్',
    'AI/ML Data Annotation Specialist': 'ఏఐ/ఎంఎల్ డేటా అనోటేషన్ స్పెషలిస్ట్',
    'Data Entry Operator': 'డేటా ఎంట్రీ ఆపరేటర్',
    'CNC Machine Operator': 'సిఎన్‌సి మెషిన్ ఆపరేటర్',
    'Sewing Machine Operator': 'కుట్టు మిషన్ ఆపరేటర్',
    'Community Health Assistant': 'కమ్యూనిటీ హెల్త్ అసిస్టెంట్',
    'Solar Pump Technician': 'సోలార్ పంప్ టెక్నీషియన్',
    'Cold Storage & HVAC Mechanic': 'కోల్డ్ స్టోరేజ్ & హెచ్‌విఎసి మెకానిక్',
    'Automotive Assembly Fitter': 'ఆటోమోటివ్ అసెంబ్లీ ఫిట్టర్',
    'Smart Meter Installation Technician': 'స్మార్ట్ మీటర్ ఇన్‌స్టాలేషన్ టెక్నీషియన్',
    'Domestic Electrician & Wireman': 'డొమెస్టిక్ ఎలక్ట్రీషియన్ & వైర్‌మ్యాన్',
    'Industrial Automation Technician': 'ఇండస్ట్రియల్ ఆటోమేషన్ టెక్నీషియన్',
    'Warehouse Logistics Executive': 'వేర్‌హౌస్ లాజిస్టిక్స్ ఎగ్జిక్యూటివ్'
  },
  kn: {
    'Solar PV Installer': 'ಸೋಲಾರ್ ಪಿವಿ ಇನ್‌ಸ್ಟಾಲರ್',
    'Retail Sales Associate': 'ಚಿಲ್ಲರೆ ಮಾರಾಟ ಸಹವರ್ತಿ',
    'EV Service Technician': 'ಇವಿ ಸೇವಾ ತಂತ್ರಜ್ಞ',
    'Drone Maintenance Technician': 'ಡ್ರೋನ್ ನಿರ್ವಹಣಾ ತಂತ್ರಜ್ಞ',
    'AI/ML Data Annotation Specialist': 'ಎಐ/ಎಂಎಲ್ ಡೇಟಾ ಟಿಪ್ಪಣಿ ತಜ್ಞ',
    'Data Entry Operator': 'ಡೇಟಾ ಎಂಟ್ರಿ ಆಪರೇಟರ್',
    'CNC Machine Operator': 'ಸಿಎನ್‌ಸಿ ಯಂತ್ರ ಆಪರೇಟರ್',
    'Sewing Machine Operator': 'ಹೊಲಿಗೆ ಯಂತ್ರ ಆಪರೇಟರ್',
    'Community Health Assistant': 'ಸಮುದಾಯ ಆರೋಗ್ಯ ಸಹಾಯಕ',
    'Solar Pump Technician': 'ಸೋಲಾರ್ ಪಂಪ್ ತಂತ್ರಜ್ಞ',
    'Cold Storage & HVAC Mechanic': 'ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ಮತ್ತು ಎಚ್‌ವಿಎಸಿ ಮೆಕ್ಯಾನಿಕ್',
    'Automotive Assembly Fitter': 'ಆಟೋಮೋಟಿವ್ ಅಸೆಂಬ್ಲಿ ಫಿಟ್ಟರ್',
    'Smart Meter Installation Technician': 'ಸ್ಮಾರ್ಟ್ ಮೀಟರ್ ಅಳವಡಿಕೆ ತಂತ್ರಜ್ಞ',
    'Domestic Electrician & Wireman': 'ದೇಶೀಯ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ ಮತ್ತು ವೈರ್‌ಮ್ಯಾನ್',
    'Industrial Automation Technician': 'ಕೈಗಾರಿಕಾ ಯಾಂತ್ರೀಕರಣ ತಂತ್ರಜ್ಞ',
    'Warehouse Logistics Executive': 'ಗೋದಾಮು ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಕಾರ್ಯನಿರ್ವಾಹಕ'
  },
  bn: {
    'Solar PV Installer': 'সোলার পিভি ইনস্টলার',
    'Retail Sales Associate': 'খুচরা বিক্রয় সহযোগী',
    'EV Service Technician': 'ইভি সার্ভিস টেকনিশিয়ান',
    'Drone Maintenance Technician': 'ড্রোন রক্ষণাবেক্ষণ টেকনিশিয়ান',
    'AI/ML Data Annotation Specialist': 'এআই/এমএল ডেটা টীকা বিশেষজ্ঞ',
    'Data Entry Operator': 'ডেটা এন্ট্রি অপারেটর',
    'CNC Machine Operator': 'সিএনসি মেশিন অপারেটর',
    'Sewing Machine Operator': 'সেলাই মেশিন অপারেটর',
    'Community Health Assistant': 'কমিউনিটি স্বাস্থ্য সহকারী',
    'Solar Pump Technician': 'সোলার পাম্প টেকনিশিয়ান',
    'Cold Storage & HVAC Mechanic': 'কোল্ড স্টোরেজ এবং এইচভিএসি মেকানিক',
    'Automotive Assembly Fitter': 'অটোমোটিভ অ্যাসেম্বলি ফিটার',
    'Smart Meter Installation Technician': 'স্মার্ট মিটার ইনস্টলেশন টেকনিশিয়ান',
    'Domestic Electrician & Wireman': 'গার্হস্থ্য ইলেকট্রিশিয়ান ও ওয়্যারম্যান',
    'Industrial Automation Technician': 'শিল্প অটোমেশন টেকনিশিয়ান',
    'Warehouse Logistics Executive': 'গুদাম লজিস্টিক এক্সিকিউটিভ'
  }
};

export const severityBandsLocalized: Record<Language, Record<string, string>> = {
  en: {
    'Severe Shortage': 'Severe Shortage',
    'Moderate Shortage': 'Moderate Shortage',
    'Balanced': 'Balanced',
    'Moderate Oversupply': 'Moderate Oversupply',
    'Severe Oversupply': 'Severe Oversupply'
  },
  hi: {
    'Severe Shortage': 'गंभीर कमी',
    'Moderate Shortage': 'मध्यम कमी',
    'Balanced': 'संतुलित',
    'Moderate Oversupply': 'मध्यम अधिशेष',
    'Severe Oversupply': 'अत्यधिक अधिशेष आपूर्ति'
  },
  mr: {
    'Severe Shortage': 'गंभीर तुटवडा',
    'Moderate Shortage': 'मध्यम तुटवडा',
    'Balanced': 'संतुलित',
    'Moderate Oversupply': 'मध्यम अधिशेष',
    'Severe Oversupply': 'अत्यधिक अधिशेष पुरवठा'
  },
  ta: {
    'Severe Shortage': 'கடுமையான பற்றாக்குறை',
    'Moderate Shortage': 'மிதமான பற்றாக்குறை',
    'Balanced': 'சமநிலை',
    'Moderate Oversupply': 'மிதமான மிகை வழங்கல்',
    'Severe Oversupply': 'கடுமையான மிகை வழங்கல்'
  },
  te: {
    'Severe Shortage': 'తీవ్రమైన కొరత',
    'Moderate Shortage': 'మితమైన కొరత',
    'Balanced': 'సమతుల్యత',
    'Moderate Oversupply': 'మితమైన మిగులు సరఫరా',
    'Severe Oversupply': 'అధిక మిగులు సరఫరా'
  },
  kn: {
    'Severe Shortage': 'ತೀವ್ರ ಕೊರತೆ',
    'Moderate Shortage': 'ಮಧ್ಯಮ ಕೊರತೆ',
    'Balanced': 'ಸಮತೋಲಿತ',
    'Moderate Oversupply': 'ಮಧ್ಯಮ ಹೆಚ್ಚುವರಿ ಪೂರೈಕೆ',
    'Severe Oversupply': 'ಅತಿಯಾದ ಹೆಚ್ಚುವರಿ ಪೂರೈಕೆ'
  },
  bn: {
    'Severe Shortage': 'তীব্র ঘাটতি',
    'Moderate Shortage': 'মাঝারি ঘাটতি',
    'Balanced': 'ভারসাম্যপূর্ণ',
    'Moderate Oversupply': 'মাঝারি উদ্বৃত্ত',
    'Severe Oversupply': 'অতিরিক্ত উদ্বৃত্ত সরবরাহ'
  }
};

export const sectorsLocalized: Record<Language, Record<string, string>> = {
  en: {
    'Aerospace & Drone Tech': 'Aerospace & Drone Tech',
    'Agriculture & Farm Tech': 'Agriculture & Farm Tech',
    'Automotive & Electric Mobility': 'Automotive & Electric Mobility',
    'Capital Goods & Precision Engineering': 'Capital Goods & Precision Engineering',
    'Construction & Infrastructure': 'Construction & Infrastructure',
    'Electronics & Hardware': 'Electronics & Hardware',
    'Food Processing & Cold Chain': 'Food Processing & Cold Chain',
    'Green Jobs & Renewable Energy': 'Green Jobs & Renewable Energy',
    'Healthcare & Allied Services': 'Healthcare & Allied Services',
    'IT-ITeS & Digital Services': 'IT-ITeS & Digital Services',
    'Logistics & Supply Chain': 'Logistics & Supply Chain',
    'Retail & E-Commerce': 'Retail & E-Commerce',
    'Textiles & Handlooms': 'Textiles & Handlooms',
  },
  hi: {
    'Aerospace & Drone Tech': 'एयरोस्पेस एवं ड्रोन तकनीक',
    'Agriculture & Farm Tech': 'कृषि एवं फार्म तकनीक',
    'Automotive & Electric Mobility': 'ऑटोमोटिव एवं इलेक्ट्रिक मोबिलिटी',
    'Capital Goods & Precision Engineering': 'पूंजीगत सामान एवं सटीक इंजीनियरिंग',
    'Construction & Infrastructure': 'निर्माण एवं बुनियादी ढांचा',
    'Electronics & Hardware': 'इलेक्ट्रॉनिक्स एवं हार्डवेयर',
    'Food Processing & Cold Chain': 'खाद्य प्रसंस्करण एवं कोल्ड चेन',
    'Green Jobs & Renewable Energy': 'हरित नौकरियां एवं नवीकरणीय ऊर्जा',
    'Healthcare & Allied Services': 'स्वास्थ्य सेवा एवं संबद्ध सेवाएं',
    'IT-ITeS & Digital Services': 'आईटी-आईटीईएस एवं डिजिटल सेवाएं',
    'Logistics & Supply Chain': 'रसद एवं आपूर्ति श्रृंखला',
    'Retail & E-Commerce': 'खुदरा एवं ई-कॉमर्स',
    'Textiles & Handlooms': 'वस्त्र एवं हथकरघा',
  },
  mr: {
    'Aerospace & Drone Tech': 'एरोस्पेस आणि ड्रोन तंत्रज्ञान',
    'Agriculture & Farm Tech': 'कृषी आणि फार्म तंत्रज्ञान',
    'Automotive & Electric Mobility': 'ऑटोमोटिव्ह आणि इलेक्ट्रिक मोबिलिटी',
    'Capital Goods & Precision Engineering': 'भांडवली वस्तू आणि प्रिसिजन अभियांत्रिकी',
    'Construction & Infrastructure': 'बांधकाम आणि पायाभूत सुविधा',
    'Electronics & Hardware': 'इलेक्ट्रॉनिक्स आणि हार्डवेअर',
    'Food Processing & Cold Chain': 'अन्न प्रक्रिया आणि कोल्ड चेन',
    'Green Jobs & Renewable Energy': 'हरित रोजगार आणि नवीकरणीय ऊर्जा',
    'Healthcare & Allied Services': 'आरोग्यसेवा आणि संलग्न सेवा',
    'IT-ITeS & Digital Services': 'आयटी-आयटीईएस आणि डिजिटल सेवा',
    'Logistics & Supply Chain': 'लॉजिस्टिक्स आणि पुरवठा साखळी',
    'Retail & E-Commerce': 'किरकोळ विक्री आणि ई-कॉमर्स',
    'Textiles & Handlooms': 'वस्त्रोद्योग आणि हातमाग',
  },
  ta: {
    'Aerospace & Drone Tech': 'விண்வெளி & ட்ரோன் தொழில்நுட்பம்',
    'Agriculture & Farm Tech': 'விவசாயம் & பண்ணைத் தொழில்நுட்பம்',
    'Automotive & Electric Mobility': 'வாகனம் & மின்சார இயக்கம்',
    'Capital Goods & Precision Engineering': 'மூலதனப் பொருட்கள் & துல்லியப் பொறியியல்',
    'Construction & Infrastructure': 'கட்டுமானம் & உள்கட்டமைப்பு',
    'Electronics & Hardware': 'மின்னணுவியல் & வன்பொருள்',
    'Food Processing & Cold Chain': 'உணவு பதப்படுத்துதல் & குளிர் சங்கிலி',
    'Green Jobs & Renewable Energy': 'பசுமைப் பணிகள் & புதுப்பிக்கத்தக்க ஆற்றல்',
    'Healthcare & Allied Services': 'சுகாதாரம் & அதனுடன் இணைந்த சேவைகள்',
    'IT-ITeS & Digital Services': 'ஐடி-ஐடிஇஎஸ் & டிஜிட்டல் சேவைகள்',
    'Logistics & Supply Chain': 'தளவாடங்கள் & விநியோகச் சங்கிலி',
    'Retail & E-Commerce': 'சில்லறை விற்பனை & இ-காமர்ஸ்',
    'Textiles & Handlooms': 'ஜவுளி & கைத்தறி',
  },
  te: {
    'Aerospace & Drone Tech': 'ఏరోస్పేస్ & డ్రోన్ టెక్నాలజీ',
    'Agriculture & Farm Tech': 'వ్యవసాయం & వ్యవసాయ సాంకేతికత',
    'Automotive & Electric Mobility': 'ఆటోమోటివ్ & ఎలక్ట్రిక్ మొబిలిటీ',
    'Capital Goods & Precision Engineering': 'క్యాపిటల్ గూడ్స్ & ప్రెసిషన్ ఇంజనీరింగ్',
    'Construction & Infrastructure': 'నిర్మాణం & మౌలిక సదుపాయాలు',
    'Electronics & Hardware': 'ఎలక్ట్రానిక్స్ & హార్డ్‌వేర్',
    'Food Processing & Cold Chain': 'ఫుడ్ ప్రాసెసింగ్ & కోల్డ్ చైన్',
    'Green Jobs & Renewable Energy': 'గ్రీన్ జాబ్స్ & పునరుత్పాదక ఇంధనం',
    'Healthcare & Allied Services': 'హెల్త్‌కేర్ & అనుబంధ సేవలు',
    'IT-ITeS & Digital Services': 'ఐటీ-ఐటీఈఎస్ & డిజిటల్ సేవలు',
    'Logistics & Supply Chain': 'లాజిస్టిక్స్ & సరఫరా గొలుసు',
    'Retail & E-Commerce': 'రిటైల్ & ఇ-కామర్స్',
    'Textiles & Handlooms': 'టెక్స్‌టైల్స్ & చేనేత',
  },
  kn: {
    'Aerospace & Drone Tech': 'ಏರೋಸ್ಪೇಸ್ ಮತ್ತು ಡ್ರೋನ್ ತಂತ್ರಜ್ಞಾನ',
    'Agriculture & Farm Tech': 'ಕೃಷಿ ಮತ್ತು ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ',
    'Automotive & Electric Mobility': 'ಆಟೋಮೋಟಿವ್ ಮತ್ತು ಎಲೆಕ್ಟ್ರಿಕ್ ಮೊಬಿಲಿಟಿ',
    'Capital Goods & Precision Engineering': 'ಬಂಡವಾಳ ಸರಕುಗಳು ಮತ್ತು ನಿಖರ ಎಂಜಿನಿಯರಿಂಗ್',
    'Construction & Infrastructure': 'ನಿರ್ಮಾಣ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ',
    'Electronics & Hardware': 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಹಾರ್ಡ್‌ವೇರ್',
    'Food Processing & Cold Chain': 'ಆಹಾರ ಸಂಸ್ಕರಣೆ ಮತ್ತು ಕೋಲ್ಡ್ ಚೈನ್',
    'Green Jobs & Renewable Energy': 'ಹಸಿರು ಉದ್ಯೋಗಗಳು ಮತ್ತು ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ',
    'Healthcare & Allied Services': 'ಆರೋಗ್ಯ ರಕ್ಷಣೆ ಮತ್ತು ಸಂಬಂಧಿತ ಸೇವೆಗಳು',
    'IT-ITeS & Digital Services': 'ಐಟಿ-ಐಟಿಇಎಸ್ ಮತ್ತು ಡಿಜಿಟಲ್ ಸೇವೆಗಳು',
    'Logistics & Supply Chain': 'ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮತ್ತು ಪೂರೈಕೆ ಸರಪಳಿ',
    'Retail & E-Commerce': 'ಚಿಲ್ಲರೆ ಮತ್ತು ಇ-ಕಾಮರ್ಸ್',
    'Textiles & Handlooms': 'ಜವಳಿ ಮತ್ತು ಕೈಮಗ್ಗ',
  },
  bn: {
    'Aerospace & Drone Tech': 'মহাকাশ ও ড্রোন প্রযুক্তি',
    'Agriculture & Farm Tech': 'কৃষি ও খামার প্রযুক্তি',
    'Automotive & Electric Mobility': 'স্বয়ংচালিত ও বৈদ্যুতিক গতিশীলতা',
    'Capital Goods & Precision Engineering': 'মূলধনী পণ্য ও নির্ভুল প্রকৌশল',
    'Construction & Infrastructure': 'নির্মাণ ও অবকাঠামো',
    'Electronics & Hardware': 'ইলেকট্রনিক্স ও হার্ডওয়্যার',
    'Food Processing & Cold Chain': 'খাদ্য প্রক্রিয়াকরণ ও কোল্ড চেইন',
    'Green Jobs & Renewable Energy': 'সবুজ কর্মসংস্থান ও পুনর্নবীকরণযোগ্য শক্তি',
    'Healthcare & Allied Services': 'স্বাস্থ্যসেবা ও সহযোগী পরিষেবা',
    'IT-ITeS & Digital Services': 'আইটি-আইটিইএস ও ডিজিটাল পরিষেবা',
    'Logistics & Supply Chain': 'লজিস্টিকস ও সরবরাহ শৃঙ্খলা',
    'Retail & E-Commerce': 'খুচরা বিক্রয় ও ই-কমার্স',
    'Textiles & Handlooms': 'বস্ত্র ও তাঁত শিল্প',
  }
};

export function isDevanagari(text: string): boolean {
  // Exclude shared punctuation Danda U+0964 and Double Danda U+0965
  return /[\u0900-\u0963\u0966-\u097F]/.test(text);
}

export function isValidTranslationForLang(text: string, lang: Language): boolean {
  if (!text || !text.trim()) return false;
  // Non-Devanagari languages should NEVER contain Devanagari text
  if ((lang === 'ta' || lang === 'te' || lang === 'kn' || lang === 'bn') && isDevanagari(text)) {
    return false;
  }
  return true;
}

export const lgdCodeToDistrictEn: Record<string, string> = {
  '178': 'Gorakhpur',
  '180': 'Lucknow',
  '201': 'Varanasi',
  '168': 'Gautam Buddha Nagar',
  '164': 'Kanpur Nagar',
  '179': 'Kanpur Nagar',
  '485': 'Pune',
  '475': 'Nagpur',
  '488': 'Chhatrapati Sambhajinagar',
  '486': 'Nashik',
  '557': 'Bengaluru Urban',
  '570': 'Mysuru',
  '545': 'Dharwad',
  '560': 'Dakshina Kannada',
  '438': 'Ahmedabad',
  '462': 'Surat',
  '464': 'Vadodara',
  '455': 'Rajkot',
  '602': 'Coimbatore'
};

export const ncoCodeToOccupationEn: Record<string, string> = {
  '2512.0101': 'AI/ML Data Annotation Specialist',
  '4132.0101': 'Data Entry Operator',
  '5223.0101': 'Retail Sales Associate',
  '3253.0101': 'Community Health Assistant',
  '7126.0101': 'Solar PV Installer',
  '7126.0201': 'Solar Pump Technician',
  '7127.0101': 'Cold Storage & HVAC Mechanic',
  '7212.0101': 'Drone Maintenance Technician',
  '7231.0101': 'Automotive Assembly Fitter',
  '7233.0102': 'EV Service Technician',
  '7411.0101': 'Smart Meter Installation Technician',
  '7411.0201': 'Domestic Electrician & Wireman',
  '7412.0101': 'Industrial Automation Technician',
  '8151.0101': 'CNC Machine Operator',
  '7223.0101': 'CNC Machine Operator',
  '8153.0101': 'Sewing Machine Operator',
  '9333.0101': 'Warehouse Logistics Executive'
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
  if (lang === 'en') return fallback || strKey;

  // Resolve code to canonical English key if numeric code
  let canonicalEn = strKey;
  if (type === 'districts' && lgdCodeToDistrictEn[strKey]) {
    canonicalEn = lgdCodeToDistrictEn[strKey];
  } else if (type === 'occupations' && ncoCodeToOccupationEn[strKey]) {
    canonicalEn = ncoCodeToOccupationEn[strKey];
  }

  // 1. Check specialized typed dictionaries FIRST
  if (type === 'districts') {
    const map = districtNamesLocalized[lang];
    if (map && map[canonicalEn] && isValidTranslationForLang(map[canonicalEn], lang)) return map[canonicalEn];
    if (map) {
      const match = Object.entries(map).find(([k]) => k.toLowerCase() === canonicalEn.toLowerCase());
      if (match && isValidTranslationForLang(match[1], lang)) return match[1];
    }
  }
  if (type === 'states') {
    const map = stateNamesLocalized[lang];
    if (map && map[canonicalEn] && isValidTranslationForLang(map[canonicalEn], lang)) return map[canonicalEn];
    if (map) {
      const match = Object.entries(map).find(([k]) => k.toLowerCase() === canonicalEn.toLowerCase());
      if (match && isValidTranslationForLang(match[1], lang)) return match[1];
    }
  }
  if (type === 'occupations') {
    const map = occupationsLocalized[lang];
    if (map && map[canonicalEn] && isValidTranslationForLang(map[canonicalEn], lang)) return map[canonicalEn];
    if (map) {
      const match = Object.entries(map).find(([k]) => k.toLowerCase() === canonicalEn.toLowerCase());
      if (match && isValidTranslationForLang(match[1], lang)) return match[1];
    }
  }
  if (type === 'sectors') {
    const map = sectorsLocalized[lang];
    if (map && map[canonicalEn] && isValidTranslationForLang(map[canonicalEn], lang)) return map[canonicalEn];
    if (map) {
      const match = Object.entries(map).find(([k]) => k.toLowerCase() === canonicalEn.toLowerCase());
      if (match && isValidTranslationForLang(match[1], lang)) return match[1];
    }
  }
  if (type === 'severityBands') {
    const map = severityBandsLocalized[lang];
    if (map && map[canonicalEn] && isValidTranslationForLang(map[canonicalEn], lang)) return map[canonicalEn];
  }

  // 2. Check MASTER_LEXICON with script validation
  if (MASTER_LEXICON && MASTER_LEXICON[canonicalEn] && MASTER_LEXICON[canonicalEn][lang]) {
    const val = MASTER_LEXICON[canonicalEn][lang];
    if (isValidTranslationForLang(val, lang)) {
      return val;
    }
  }
  if (MASTER_LEXICON && MASTER_LEXICON[strKey] && MASTER_LEXICON[strKey][lang]) {
    const val = MASTER_LEXICON[strKey][lang];
    if (isValidTranslationForLang(val, lang)) {
      return val;
    }
  }

  // 3. Fallback: ONLY return Hindi reference data if lang is 'hi'
  if (lang === 'hi') {
    const hiMap = referenceData[type];
    if (hiMap && hiMap[strKey]) return hiMap[strKey];
    if (hiMap && hiMap[canonicalEn]) return hiMap[canonicalEn];
  }

  return fallback || canonicalEn;
}

export function localizeSector(sector: string, lang: Language = 'en'): string {
  if (lang !== 'en') {
    if (sectorsLocalized[lang] && sectorsLocalized[lang][sector]) {
      const val = sectorsLocalized[lang][sector];
      if (isValidTranslationForLang(val, lang)) return val;
    }
    if (MASTER_LEXICON && MASTER_LEXICON[sector] && MASTER_LEXICON[sector][lang]) {
      const val = MASTER_LEXICON[sector][lang];
      if (isValidTranslationForLang(val, lang)) return val;
    }
    if (lang === 'hi' && referenceData.sectors[sector]) {
      return referenceData.sectors[sector];
    }
  }
  return sector;
}

/**
 * Normalizes entity display string based on current language
 */
export function resolveDisplayName(
  item: { title?: string; name?: string; titleHi?: string; nameHi?: string; ncoCode?: string; lgdCode?: number | string; sector?: string },
  lang: Language = 'en'
): string {
  if (!item) return '';
  if (lang === 'en') return item.title || item.name || '';

  // 1. Direct typed lookups by English title / name / sector
  if (item.name && districtNamesLocalized[lang]?.[item.name]) {
    const val = districtNamesLocalized[lang][item.name];
    if (isValidTranslationForLang(val, lang)) return val;
  }
  if (item.title && occupationsLocalized[lang]?.[item.title]) {
    const val = occupationsLocalized[lang][item.title];
    if (isValidTranslationForLang(val, lang)) return val;
  }
  if (item.sector && sectorsLocalized[lang]?.[item.sector]) {
    const val = sectorsLocalized[lang][item.sector];
    if (isValidTranslationForLang(val, lang)) return val;
  }

  // 2. MASTER_LEXICON lookup
  if (item.title && MASTER_LEXICON?.[item.title]?.[lang]) {
    const val = MASTER_LEXICON[item.title][lang];
    if (isValidTranslationForLang(val, lang)) return val;
  }
  if (item.name && MASTER_LEXICON?.[item.name]?.[lang]) {
    const val = MASTER_LEXICON[item.name][lang];
    if (isValidTranslationForLang(val, lang)) return val;
  }

  // 3. Codes resolution via canonical English
  if (item.ncoCode && ncoCodeToOccupationEn[item.ncoCode]) {
    const occEn = ncoCodeToOccupationEn[item.ncoCode];
    const loc = occupationsLocalized[lang]?.[occEn] || (MASTER_LEXICON?.[occEn]?.[lang]);
    if (loc && isValidTranslationForLang(loc, lang)) return loc;
  }
  if (item.lgdCode && lgdCodeToDistrictEn[String(item.lgdCode)]) {
    const distEn = lgdCodeToDistrictEn[String(item.lgdCode)];
    const loc = districtNamesLocalized[lang]?.[distEn] || (MASTER_LEXICON?.[distEn]?.[lang]);
    if (loc && isValidTranslationForLang(loc, lang)) return loc;
  }

  // 4. Hindi-specific fallback ONLY when lang is 'hi'
  if (lang === 'hi') {
    if (item.titleHi) return item.titleHi;
    if (item.nameHi) return item.nameHi;
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
  if (lang !== 'en') {
    if (MASTER_LEXICON && MASTER_LEXICON[skill] && MASTER_LEXICON[skill][lang]) {
      const val = MASTER_LEXICON[skill][lang];
      if (isValidTranslationForLang(val, lang)) return val;
    }
    if (lang === 'hi' && localizedSkills[skill]) {
      return localizedSkills[skill];
    }
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
  if (lang !== 'en') {
    if (MASTER_LEXICON && MASTER_LEXICON[qual] && MASTER_LEXICON[qual][lang]) {
      const val = MASTER_LEXICON[qual][lang];
      if (isValidTranslationForLang(val, lang)) return val;
    }
    if (lang === 'hi' && localizedQualifications[qual]) {
      return localizedQualifications[qual];
    }
  }
  return qual;
}

export const MASTER_LEXICON: Record<string, Record<Language, string>> = masterLexiconData as unknown as Record<string, Record<Language, string>>;

/**
 * Universal Multilingual Translator (§3.2)
 * Returns the localized version of an English phrase across all 7 supported languages.
 */
export function l(enText: string, lang: Language = 'en', hiFallback?: string): string {
  if (!enText) return '';
  if (lang === 'en') return enText;

  // 1. Check MASTER_LEXICON
  const entry = MASTER_LEXICON[enText];
  if (entry && entry[lang]) {
    const val = entry[lang];
    if (isValidTranslationForLang(val, lang)) {
      return val;
    }
  }

  // 2. Check typed entity dictionaries
  if (occupationsLocalized[lang]?.[enText]) {
    const val = occupationsLocalized[lang][enText];
    if (isValidTranslationForLang(val, lang)) return val;
  }
  if (districtNamesLocalized[lang]?.[enText]) {
    const val = districtNamesLocalized[lang][enText];
    if (isValidTranslationForLang(val, lang)) return val;
  }
  if (stateNamesLocalized[lang]?.[enText]) {
    const val = stateNamesLocalized[lang][enText];
    if (isValidTranslationForLang(val, lang)) return val;
  }
  if (sectorsLocalized[lang]?.[enText]) {
    const val = sectorsLocalized[lang][enText];
    if (isValidTranslationForLang(val, lang)) return val;
  }
  if (severityBandsLocalized[lang]?.[enText]) {
    const val = severityBandsLocalized[lang][enText];
    if (isValidTranslationForLang(val, lang)) return val;
  }

  // 3. Fallback: ONLY return Hindi if the requested language is Hindi!
  if (lang === 'hi') {
    if (hiFallback) return hiFallback;
    if (entry && entry.hi) return entry.hi;
    if (referenceData.districts[enText]) return referenceData.districts[enText];
    if (referenceData.states[enText]) return referenceData.states[enText];
    if (referenceData.sectors[enText]) return referenceData.sectors[enText];
    if (referenceData.occupations[enText]) return referenceData.occupations[enText];
  }

  // For ta, te, kn, bn, mr: NEVER leak Hindi strings! Return enText as clean fallback
  return enText;
}

export function localizeText(enText: string, lang: Language = 'en', hiFallback?: string): string {
  return l(enText, lang, hiFallback);
}


