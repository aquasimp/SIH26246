'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export interface ChartPalette {
  text: string;
  textMuted: string;
  grid: string;
  brand: string;
  brandSecondary: string;
  forecast: string;
  severe: string;
  moderate: string;
  balanced: string;
  oversupply: string;
  accent: string;
  bg: string;
  surface: string;
  glass: string;
  fontMono: string;
}

const DEFAULT_DARK_PALETTE: ChartPalette = {
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  grid: 'rgba(255, 255, 255, 0.12)',
  brand: '#38BDF8',
  brandSecondary: '#0EA5E9',
  forecast: '#38BDF8',
  severe: '#F87171',
  moderate: '#FBBF24',
  balanced: '#34D399',
  oversupply: '#818CF8',
  accent: '#F59E5B',
  bg: '#0B132B',
  surface: '#0F172A',
  glass: 'rgba(15, 23, 42, 0.75)',
  fontMono: 'var(--font-mono), monospace'
};

const DEFAULT_LIGHT_PALETTE: ChartPalette = {
  text: '#0F172A',
  textMuted: '#334155',
  grid: 'rgba(226, 232, 240, 0.85)',
  brand: '#13213F',
  brandSecondary: '#0369A1',
  forecast: '#0284C7',
  severe: '#DC2626',
  moderate: '#D97706',
  balanced: '#059669',
  oversupply: '#4338CA',
  accent: '#B4530F',
  bg: '#F4F7FB',
  surface: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.75)',
  fontMono: 'var(--font-mono), monospace'
};

export function useChartPalette(): ChartPalette {
  const { resolvedTheme } = useTheme();
  const [palette, setPalette] = useState<ChartPalette>(
    resolvedTheme === 'light' ? DEFAULT_LIGHT_PALETTE : DEFAULT_DARK_PALETTE
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (typeof window === 'undefined') return;
      const s = getComputedStyle(document.documentElement);
      const v = (n: string, fallback: string) => s.getPropertyValue(n).trim() || fallback;

      const isLight = resolvedTheme === 'light';
      const fallback = isLight ? DEFAULT_LIGHT_PALETTE : DEFAULT_DARK_PALETTE;

      setPalette({
        text: v('--text', fallback.text),
        textMuted: v('--text-muted', fallback.textMuted),
        grid: v('--border', fallback.grid),
        brand: v('--brand', fallback.brand),
        brandSecondary: v('--brand-secondary', fallback.brandSecondary),
        forecast: v('--forecast', fallback.forecast),
        severe: v('--severe', fallback.severe),
        moderate: v('--moderate', fallback.moderate),
        balanced: v('--balanced', fallback.balanced),
        oversupply: v('--oversupply', fallback.oversupply),
        accent: v('--accent', fallback.accent),
        bg: v('--bg', fallback.bg),
        surface: v('--surface-solid', fallback.surface),
        glass: v('--glass', fallback.glass),
        fontMono: v('--font-mono-stack', fallback.fontMono)
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [resolvedTheme]);

  return palette;
}
