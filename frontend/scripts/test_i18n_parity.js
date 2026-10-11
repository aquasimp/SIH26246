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
const hiEntries = getFlattenedEntries(hi);

const enMap = new Map(enEntries.map(e => [e.key, e.value]));
const hiMap = new Map(hiEntries.map(e => [e.key, e.value]));

let errors = [];

// 1. Check if key sets differ
for (const key of enMap.keys()) {
  if (!hiMap.has(key)) {
    errors.push(`Missing key in hi.json: ${key}`);
  }
}
for (const key of hiMap.keys()) {
  if (!enMap.has(key)) {
    errors.push(`Extra key in hi.json not in en.json: ${key}`);
  }
}

// 2. Check if a hi value equals its en value (unless in allowlist)
for (const [key, enVal] of enMap.entries()) {
  if (hiMap.has(key)) {
    const hiVal = hiMap.get(key);
    if (hiVal.trim() === enVal.trim()) {
      const words = hiVal.trim().split(/\s+/);
      const isNumericOrUnit = /^[\d.,%+\-\s]+$/.test(hiVal.trim());
      const isAllowed = isNumericOrUnit || ALLOWLIST.has(hiVal.trim()) || (words.length <= 2 && ALLOWLIST.has(words[0]));
      if (!isAllowed) {
        errors.push(`Untranslated parity error for key '${key}': '${hiVal}' equals English value without being on allowlist.`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`i18n Parity Test FAILED with ${errors.length} error(s):`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`i18n Parity Test PASSED: All ${enEntries.length} keys match and all Hindi values are properly localized!`);
  process.exit(0);
}
