const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/en.json'), 'utf8'));
const hi = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/hi.json'), 'utf8'));

// Tiny allowlist: acronyms, codes, units, model names, max 2 words
const ALLOWLIST = new Set([
  'KY',
  'MSDE',
  'SIH',
  'API',
  'CSV',
  'PDF',
  'XLSX',
  'NCO',
  'NSQF',
  'LGD',
  '3M',
  '6M',
  '12M',
  'WAPE',
  'MASE',
  'MAE',
  'RMSE',
  'REST',
  'REST v1.0',
  'N/A',
  'GET',
  'POST',
  'LightGBM',
  'Theta',
  'ETS',
  'Simplex',
  'PuLP',
  'KaushalYuva'
]);

function getFlattenedEntries(obj, prefix = '') {
  let entries = [];
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      entries = entries.concat(getFlattenedEntries(val, fullKey));
    } else {
      entries.push({ key: fullKey, value: String(val) });
    }
  }
  return entries;
}

const enEntries = getFlattenedEntries(en);
const enMap = new Map(enEntries.map(e => [e.key, e.value]));
const langs = ['hi', 'mr', 'ta', 'te', 'kn', 'bn'];
let errors = [];

for (const lang of langs) {
  const langData = JSON.parse(fs.readFileSync(path.join(__dirname, `../messages/${lang}.json`), 'utf8'));
  const langEntries = getFlattenedEntries(langData);
  const langMap = new Map(langEntries.map(e => [e.key, e.value]));

  // 1. Check if key sets differ
  for (const key of enMap.keys()) {
    if (!langMap.has(key)) {
      errors.push(`Missing key in ${lang}.json: ${key}`);
    }
  }
  for (const key of langMap.keys()) {
    if (!enMap.has(key)) {
      errors.push(`Extra key in ${lang}.json not in en.json: ${key}`);
    }
  }

  // 2. Check if a lang value equals its en value (unless in allowlist)
  for (const [key, enVal] of enMap.entries()) {
    if (langMap.has(key)) {
      const val = langMap.get(key);
      if (val.trim() === enVal.trim()) {
        const words = val.trim().split(/\s+/);
        const isNumericOrUnit = /^[\d.,%+\-\s/M]+$/.test(val.trim());
        const isAllowed = isNumericOrUnit || ALLOWLIST.has(val.trim()) || (words.length <= 4 && words.some(w => ALLOWLIST.has(w)));
        if (!isAllowed) {
          errors.push(`Untranslated parity error in ${lang}.json for key '${key}': '${val}' equals English value.`);
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`i18n Parity Test FAILED with ${errors.length} error(s):`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`i18n Parity Test PASSED: All 7 languages (${langs.join(', ')}) match all ${enEntries.length} keys with 100% parity!`);
  process.exit(0);
}
