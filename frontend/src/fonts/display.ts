// src/fonts/display.ts — default: free fallback, active today per §4.2
import { Barlow_Condensed } from 'next/font/google';

export const displayFont = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-display',
  preload: true,
  adjustFontFallback: true,
});
