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
  bg: string;
  surface: string;
  glass: string;
}

const DEFAULT_DARK_PALETTE: ChartPalette = {
  text: '#E9ECF1',
  textMuted: '#A7AEBB',
  grid: 'rgba(255, 255, 255, 0.08)',
  brand: '#8C9CF5',
  brandSecondary: '#5FC4C9',
  forecast: '#8C9CF5',
  severe: '#FF6600',
  moderate: '#FBBF24',
  balanced: '#38BDF8',
  oversupply: '#818CF8',
  bg: '#090A0C',
  surface: '#14171C',
  glass: 'rgba(255, 255, 255, 0.045)'
};

const DEFAULT_LIGHT_PALETTE: ChartPalette = {
  text: '#14171C',
  textMuted: '#434A57',
  grid: 'rgba(20, 23, 28, 0.08)',
  brand: '#3F51C7',
  brandSecondary: '#12818A',
  forecast: '#3F51C7',
  severe: '#EA580C',
  moderate: '#D97706',
  balanced: '#0284C7',
  oversupply: '#4338CA',
  bg: '#F7F6F2',
  surface: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.66)'
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
        bg: v('--bg', fallback.bg),
        surface: v('--surface-solid', fallback.surface),
        glass: v('--glass', fallback.glass)
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [resolvedTheme]);

  return palette;
}
