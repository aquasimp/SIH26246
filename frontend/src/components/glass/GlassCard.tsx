'use client';

import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  accentColor?: 'demand' | 'supply' | 'shortage' | 'oversupply' | 'forecast' | 'warning' | 'neutral';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  onClick,
  accentColor = 'neutral'
}) => {
  const accentBorder = {
    demand: 'border-l-4 border-l-orange-500',
    supply: 'border-l-4 border-l-emerald-500',
    shortage: 'border-l-4 border-l-red-500',
    oversupply: 'border-l-4 border-l-indigo-500',
    forecast: 'border-l-4 border-l-blue-500',
    warning: 'border-l-4 border-l-amber-500',
    neutral: ''
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'glass-card rounded-2xl p-5 relative overflow-hidden',
        hoverEffect && 'cursor-pointer',
        accentBorder,
        className
      )}
    >
      {/* Tiny subtle internal glass reflection on top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
