// src/fonts/display.ts — Archivo variable font + Khand + Noto Sans Devanagari + JetBrains Mono
// Strictly <= 4 font files in critical path (< 150 KB budget)
import { Archivo, Khand, Noto_Sans_Devanagari, JetBrains_Mono } from 'next/font/google';

export const displayFont = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
  preload: true,
  adjustFontFallback: true,
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

export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  preload: true,
});
