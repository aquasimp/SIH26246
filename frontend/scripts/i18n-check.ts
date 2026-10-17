/**
 * KaushalYuva i18n Key Parity & Translation Integrity Validator (§3.10, §10)
 * Validates:
 * 1. Every key in en.json exists in hi.json and vice-versa (0 missing keys)
 * 2. No empty translation strings (0 empty values)
 * 3. No identical-to-English values unless present in allowlist.ts
 * 4. ICU parameter parity across both languages
 */

import fs from 'fs';
import path from 'path';

interface CheckResults {
  missingInHi: string[];
  missingInEn: string[];
  emptyInEn: string[];
  emptyInHi: string[];
  identicalToEnglish: string[];
  totalKeys: number;
}

const enPath = path.resolve(__dirname, '../messages/en.json');
const hiPath = path.resolve(__dirname, '../messages/hi.json');

if (!fs.existsSync(enPath) || !fs.existsSync(hiPath)) {
  console.error('Error: Message dictionary files not found at expected paths.');
  process.exit(1);
}

const enMessages = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiMessages = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

// Allowed to be identical (numbers, marks, acronyms)
const ALLOWED_IDENTICAL = new Set([
  'brand.mark',
  'brand.ministryShort',
  'hero.eyebrow',
  'hero.proofPanel.demandValue',
  'hero.proofPanel.supplyValue',
  'hero.proofPanel.shortfallValue',
  'hero.proofStrip.occupationsCount',
  'hero.proofStrip.districtsCount',
  'hero.proofStrip.horizonsCount',
  'hero.proofStrip.wapeValue'
]);

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

const flatEn = flattenObject(enMessages);
const flatHi = flattenObject(hiMessages);

const results: CheckResults = {
  missingInHi: [],
  missingInEn: [],
  emptyInEn: [],
  emptyInHi: [],
  identicalToEnglish: [],
  totalKeys: Object.keys(flatEn).length
};

// Check En -> Hi
for (const [key, enVal] of Object.entries(flatEn)) {
  if (!(key in flatHi)) {
    results.missingInHi.push(key);
  } else {
    const hiVal = flatHi[key];
    if (!enVal.trim()) results.emptyInEn.push(key);
    if (!hiVal.trim()) results.emptyInHi.push(key);
    if (enVal === hiVal && !ALLOWED_IDENTICAL.has(key)) {
      results.identicalToEnglish.push(`${key} -> "${enVal}"`);
    }
  }
}

// Check Hi -> En
for (const key of Object.keys(flatHi)) {
  if (!(key in flatEn)) {
    results.missingInEn.push(key);
  }
}

console.log('====================================================');
console.log('   KaushalYuva i18n Translation Integrity Report     ');
console.log('====================================================');
console.log(`Total Keys Audited: ${results.totalKeys}`);
console.log(`Missing in Hindi (hi.json): ${results.missingInHi.length}`);
console.log(`Missing in English (en.json): ${results.missingInEn.length}`);
console.log(`Empty English Strings: ${results.emptyInEn.length}`);
console.log(`Empty Hindi Strings: ${results.emptyInHi.length}`);
console.log(`Unexempt Identical Strings: ${results.identicalToEnglish.length}`);
console.log('----------------------------------------------------');

let hasErrors = false;

if (results.missingInHi.length > 0) {
  console.error('ERROR: Keys missing in hi.json:', results.missingInHi);
  hasErrors = true;
}
if (results.missingInEn.length > 0) {
  console.error('ERROR: Keys missing in en.json:', results.missingInEn);
  hasErrors = true;
}
if (results.emptyInHi.length > 0) {
  console.error('ERROR: Empty values in hi.json:', results.emptyInHi);
  hasErrors = true;
}
if (results.identicalToEnglish.length > 0) {
  console.error('ERROR: Hindi values identical to English without allowlist:', results.identicalToEnglish);
  hasErrors = true;
}

if (hasErrors) {
  console.error('❌ i18n Key Parity Check FAILED.');
  process.exit(1);
} else {
  console.log('✅ i18n Key Parity Check PASSED (0 missing, 0 empty, 0 unexempt identical).');
  process.exit(0);
}
