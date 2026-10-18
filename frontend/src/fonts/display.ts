// src/fonts/display.ts — DepthWizard & KaushalYuva Visual Identity Typography
// Primary UI: Plus Jakarta Sans
// Display Voice: Instrument Sans
// Editorial Accent: Instrument Serif (italic)
// Data & Monospace: JetBrains Mono
// Indic: Khand & Noto Sans Devanagari, Tamil, Telugu, Kannada, Bengali
import { 
  Plus_Jakarta_Sans, 
  Instrument_Serif, 
  Instrument_Sans, 
  JetBrains_Mono, 
  Noto_Sans_Devanagari, 
  Khand,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Noto_Sans_Kannada,
  Noto_Sans_Bengali
} from 'next/font/google';

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
  preload: true,
});

export const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
  preload: true,
});

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  display: 'swap',
  variable: '--font-serif',
  preload: false,
});

export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-mono',
  preload: true,
});

export const khandFont = Khand({
  subsets: ['devanagari'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-khand',
  preload: false,
});

export const notoDevanagariFont = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-devanagari',
  preload: false,
});

export const notoTamilFont = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-ta',
  preload: false,
});

export const notoTeluguFont = Noto_Sans_Telugu({
  subsets: ['telugu'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-te',
  preload: false,
});

export const notoKannadaFont = Noto_Sans_Kannada({
  subsets: ['kannada'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-kn',
  preload: false,
});

export const notoBengaliFont = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-bn',
  preload: false,
});

// Backward-compatibility aliases
export const displayFont = instrumentSans;
