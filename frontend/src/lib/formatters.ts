/**
 * KaushalYuva Canonical Localized Formatting Helpers (§3.3)
 * Handles Indian numbering system, Hindi compact units, currency, percentages, dates, and relative time.
 */

import { Language } from './i18n';

const COMPACT_UNITS: Record<Language, { cr: string; lk: string; k: string }> = {
  en: { cr: 'Cr', lk: 'L', k: 'K' },
  hi: { cr: 'करोड़', lk: 'लाख', k: 'हज़ार' },
  mr: { cr: 'कोटी', lk: 'लाख', k: 'हजार' },
  ta: { cr: 'கோடி', lk: 'லட்சம்', k: 'ஆயிரம்' },
  te: { cr: 'కోట్లు', lk: 'లక్షలు', k: 'వేలు' },
  kn: { cr: 'ಕೋಟಿ', lk: 'ಲಕ್ಷ', k: 'ಸಾವಿರ' },
  bn: { cr: 'কোটি', lk: 'লাখ', k: 'হাজার' },
};

function getLocale(lang: Language): string {
  switch (lang) {
    case 'hi': return 'hi-IN-u-nu-latn';
    case 'mr': return 'mr-IN-u-nu-latn';
    case 'ta': return 'ta-IN-u-nu-latn';
    case 'te': return 'te-IN-u-nu-latn';
    case 'kn': return 'kn-IN-u-nu-latn';
    case 'bn': return 'bn-IN-u-nu-latn';
    default: return 'en-IN';
  }
}

/**
 * Format a number using Indian grouping and appropriate locale.
 * Keeps compact values and suffixes strictly unbroken on one line.
 */
export function formatNumber(
  val: number, 
  lang: Language = 'en', 
  options: { compact?: boolean; maximumFractionDigits?: number } = {}
): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  const { compact = false, maximumFractionDigits = 1 } = options;
  const units = COMPACT_UNITS[lang] || COMPACT_UNITS.en;

  if (compact) {
    const abs = Math.abs(val);
    if (abs >= 10000000) {
      const cr = (val / 10000000).toFixed(maximumFractionDigits).replace(/\.0$/, '');
      return lang === 'en' ? `${cr}\u00A0${units.cr}` : `${cr}\u00A0${units.cr}`;
    }
    if (abs >= 100000) {
      const lk = (val / 100000).toFixed(maximumFractionDigits).replace(/\.0$/, '');
      return lang === 'en' ? `${lk}${units.lk}` : `${lk}\u00A0${units.lk}`;
    }
    if (abs >= 1000) {
      const k = (val / 1000).toFixed(maximumFractionDigits).replace(/\.0$/, '');
      return lang === 'en' ? `${k}${units.k}` : `${k}\u00A0${units.k}`;
    }
  }

  const locale = getLocale(lang);
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(val);
}

/**
 * Format currency in Indian Rupees (INR) with compact Hindi/English/regional denominations.
 */
export function formatCurrency(
  val: number, 
  lang: Language = 'en',
  options: { compact?: boolean; maximumFractionDigits?: number } = { compact: true }
): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  const { compact = true, maximumFractionDigits = 2 } = options;
  const units = COMPACT_UNITS[lang] || COMPACT_UNITS.en;

  if (compact) {
    const abs = Math.abs(val);
    if (abs >= 10000000) {
      const cr = (val / 10000000).toFixed(maximumFractionDigits).replace(/\.00$/, '');
      return `₹${cr}\u00A0${units.cr}`;
    }
    if (abs >= 100000) {
      const lk = (val / 100000).toFixed(maximumFractionDigits).replace(/\.00$/, '');
      return lang === 'en' ? `₹${lk}L` : `₹${lk}\u00A0${units.lk}`;
    }
  }

  const locale = getLocale(lang);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}

/**
 * Format percentages with proper sign handling.
 */
export function formatPercent(
  val: number, 
  lang: Language = 'en',
  options: { maximumFractionDigits?: number } = {}
): string {
  if (isNaN(val) || val === null || val === undefined) return '0%';
  const { maximumFractionDigits = 1 } = options;
  const locale = getLocale(lang);
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits }).format(val)}%`;
}

/**
 * Format ISO dates or date strings into localized month/year or full date.
 */
export function formatDate(
  dateInput: string | Date, 
  lang: Language = 'en',
  formatType: 'short' | 'medium' | 'monthYear' = 'medium'
): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const locale = getLocale(lang);

  if (formatType === 'monthYear') {
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(date);
  }
  if (formatType === 'short') {
    return new Intl.DateTimeFormat(locale, { month: 'numeric', day: 'numeric', year: '2-digit' }).format(date);
  }
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

/**
 * Format relative time (e.g. "2 hours ago" / "2 घंटे पहले").
 */
export function formatRelativeTime(
  minutesAgo: number, 
  lang: Language = 'en'
): string {
  const locale = getLocale(lang);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (minutesAgo < 60) {
    return rtf.format(-Math.round(minutesAgo), 'minute');
  }
  const hours = Math.round(minutesAgo / 60);
  if (hours < 24) {
    return rtf.format(-hours, 'hour');
  }
  const days = Math.round(hours / 24);
  return rtf.format(-days, 'day');
}
