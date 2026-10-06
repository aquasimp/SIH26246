/**
 * KaushalYuva i18n Allow-List
 * STRICT AUDIT: Allowed entries are ONLY acronyms, codes, units, model names, and system marks.
 * ABSOLUTELY NO PROSE WORDS. Every entry must be <= 2 words.
 */

export const ALLOWED_LATIN_TOKENS = new Set([
  // Government bodies & schemes
  'SIH',
  'MSDE',
  'SSDMs',
  'DSCs',
  'ITI',
  'ITIs',
  'PMKVY',
  'PMKK',
  'PMKKs',
  'DGT',
  'NCVET',
  'NSDC',
  'NSQF',
  'NOS',
  'QP',
  'NQR',
  'NCS',
  'SID',
  'LGD',
  'NCO',
  'NIC',
  'IEC',
  'DGCA',
  'OEM',
  'DISCOM',
  'BPO',
  'CRM',
  'ERP',
  'SIDH',
  'DET',
  'GST',
  'EPFO',
  'PLFS',
  'NAPS',
  'MoL',

  // Machine Learning & optimization
  'LP',
  'PuLP',
  'Simplex',
  'LightGBM',
  'Random Forest',
  'Holt-Winters',
  'ARIMA',
  'ETS',
  'Theta',
  'SHAP',
  'TreeSHAP',
  'WAPE',
  'MASE',
  'MAE',
  'RMSE',
  'Pinball',
  'RUN-SIH-001',
  'SIH-2026',
  'PS-26246',
  'v1.0',
  'v2.1',
  'v2.1.0',
  'v2.4',

  // Technical protocols & export formats
  'API',
  'CSV',
  'PDF',
  'JSON',
  'XLSX',
  'HTTP',
  'REST',
  'OpenAPI',
  'Swagger',
  'Curl',
  'cURL',
  'SQLite',
  'GET',
  'POST',
  'REC',
  'RUN',
  'GitHub',
  'Vercel',
  'Next.js',

  // Technical systems & equipment
  'Wireshark',
  'Siemens',
  'Allen Bradley',
  'Modbus',
  'SCADA',
  'PLC',
  'WPM',
  'SOC',
  'SIEM',
  'EDR',
  'CMM',
  'CNC',
  'EHR',
  'BMS',
  'POS',
  'LiDAR',
  'RLHF',
  'SLA',
  'IST',

  // Sector codes & qualification packs
  'SGJ',
  'RAS',
  'ASC',
  'SSC',
  'CSC',
  'AER',
  'HSS',
  'PSS',
  'IAS',

  // Currency & units
  '₹',
  '%',
  'Cr',
  'L',
  'Lakh',
  'Lakhs',
  'km',
  'hr',
  'mo',
  'ms',
  'K',
  'N/A',
  '3M',
  '6M',
  '12M',

  // System marks
  'KY',
  'KaushalYuva',
  'EN'
]);

export const ACRONYM_EXPANSIONS_HI: Record<string, string> = {
  MSDE: 'कौशल विकास एवं उद्यमशीलता मंत्रालय',
  SIH: 'स्मार्ट इंडिया हैकथॉन',
  NCO: 'राष्ट्रीय व्यवसाय वर्गीकरण',
  LGD: 'स्थानीय सरकारी निर्देशिका',
  ITI: 'औद्योगिक प्रशिक्षण संस्थान',
  PMKVY: 'प्रधानमंत्री कौशल विकास योजना',
  NSQF: 'राष्ट्रीय कौशल योग्यता ढांचा',
  API: 'अनुप्रयोग प्रोग्रामिंग इंटरफ़ेस',
  CSV: 'कॉमा-पृथक मान',
  PDF: 'पोर्टेबल दस्तावेज़ प्रारूप',
  WAPE: 'भारित निरपेक्ष प्रतिशत त्रुटि',
  MASE: 'माप-समायोजित निरपेक्ष त्रुटि'
};

/**
 * Checks if a Latin token is permitted in Hindi crawl audit
 */
export function isAllowedLatinToken(token: string): boolean {
  const clean = token.replace(/^[(\[{"'«#\-]+|[)\]}"'».,;:!?%₹#/\-]+$/g, '').trim();
  if (!clean) return true;
  if (/^\d+(\.\d+)?$/.test(clean)) return true; // Numbers permitted
  if (/^\d{4}\.\d{4}$/.test(clean)) return true; // NCO codes (e.g. 7126.0101)
  if (/^REC(-\d+)+$/i.test(clean)) return true; // REC-01, REC-2026-01 format
  if (/^QP-[A-Z0-9_\-\.\/]+$/i.test(clean)) return true; // QP codes (e.g. QP-7126-V1.0)
  if (/^NCO(-[A-Z0-9]+|\/[A-Z0-9]+)?$/i.test(clean)) return true; // NCO, NCO-2015, NCO/LGD
  if (/^t-\d+$/i.test(clean)) return true; // Time lags (t-1, t-6, t-12)
  if (/^\d+(\.\d+)?(ms|[KLM])$/i.test(clean)) return true; // Quantities with units (18.31L, 42ms, 9.0K)
  if (/^RUN-/i.test(clean)) return true; // RUN- prefix
  if (/^ALT-/i.test(clean)) return true; // ALT- alert prefix
  if (/^ALR-/i.test(clean)) return true; // ALR- alert ID prefix (e.g. ALR-2026-UP-001)
  if (/^(http|https|www|\/api|api)/i.test(clean)) return true; // URLs & API endpoints
  if (/^[a-f0-9]{8,64}$/i.test(clean)) return true; // Hex hashes (e.g. dataHash 01b23bfc01b7)
  if (ALLOWED_LATIN_TOKENS.has(clean)) return true;
  for (const item of ALLOWED_LATIN_TOKENS) {
    if (item.toLowerCase() === clean.toLowerCase()) return true;
    // Handle multi-word allowed tokens (e.g., 'Random Forest', 'Allen Bradley')
    if (item.toLowerCase().split(/\s+/).includes(clean.toLowerCase())) return true;
  }
  return false;
}
