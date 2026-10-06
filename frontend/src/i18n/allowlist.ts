/**
 * KaushalYuva i18n Allow-List (§3.1)
 * Latin acronyms, identifiers, codes, and model names permitted in Hindi mode.
 */

export const ALLOWED_LATIN_TOKENS = new Set([
  // Government bodies & schemes
  'SIH',
  'MSDE',
  'SSDMs',
  'DSCs',
  'ITI',
  'PMKVY',
  'DGT',
  'NCVET',
  'NSDC',
  'NSQF',
  'NOS',
  'QP',

  // Standards & classifications
  'NCO',
  'LGD',
  'NIC',

  // Machine Learning & technical identifiers
  'LightGBM',
  'Random Forest',
  'ARIMA',
  'ETS',
  'Theta',
  'SHAP',
  'WAPE',
  'MASE',
  'RUN-SIH-001',
  'SIH-2026',
  'PS-26246',
  'PS 26246',

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
  'SQLite',

  // Currency & units
  '₹',
  '%',
  'Cr',
  'km',
  'hr',
  'mo',
  '3M',
  '6M',
  '12M',

  // System & brand marks
  'KY',
  'KaushalYuva'
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
  const clean = token.replace(/^[(\[{"'«]+|[)\]}"'».,;:!?%₹]+$/g, '').trim();
  if (!clean || clean.length < 3) return true; // Single/double letter symbols or numbers permitted
  if (/^\d+(\.\d+)?$/.test(clean)) return true; // Numbers permitted
  if (/^\d{4}\.\d{4}$/.test(clean)) return true; // NCO codes (e.g. 7126.0101)
  if (/^[A-Z0-9_\-]+$/.test(clean) && ALLOWED_LATIN_TOKENS.has(clean)) return true;
  return ALLOWED_LATIN_TOKENS.has(clean);
}
