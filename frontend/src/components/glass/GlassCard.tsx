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
    demand: 'border-l-4 border-l-amber-500',
    supply: 'border-l-4 border-l-cyan-500',
    shortage: 'border-l-4 border-l-[#ff6600]',
    oversupply: 'border-l-4 border-l-blue-500',
    forecast: 'border-l-4 border-l-[#00c2cb]',
    warning: 'border-l-4 border-l-amber-500',
    neutral: ''
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'hud-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300',
        hoverEffect && 'cursor-pointer hover:border-[#00c2cb]/60 hover:shadow-[0_8px_30px_rgba(0,194,203,0.15)]',
        accentBorder,
        className
      )}
    >
      {/* Subtle top edge specular highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00c2cb]/40 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
