// src/fonts/display.ts — DepthWizard Typography System
// Primary UI: Plus Jakarta Sans
// Tactical Display: Space Grotesk
// Monospace/Telemetry: JetBrains Mono
// Devanagari Headings & Body: Khand & Noto Sans Devanagari
import { Plus_Jakarta_Sans, Instrument_Serif, Space_Grotesk, JetBrains_Mono, Noto_Sans_Devanagari, Khand } from 'next/font/google';

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
  preload: true,
});

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
  preload: true,
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
  preload: true,
});

export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-mono',
  preload: true,
});

export const khandFont = Khand({
  subsets: ['devanagari'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-khand',
  preload: true,
});

export const notoDevanagariFont = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-devanagari',
  preload: true,
});

// Backward-compatibility aliases
export const displayFont = spaceGrotesk;
