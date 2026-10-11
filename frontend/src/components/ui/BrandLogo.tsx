import React from 'react';

export interface BrandLogoProps {
  /** Size variant: sm (28px), md (32px), lg (36px), xl (48px) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional custom container class names */
  className?: string;
  /** Optional image alt text */
  alt?: string;
}

const sizeClasses: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'w-7 h-7 rounded-lg p-0.5',
  md: 'w-8 h-8 rounded-xl p-1',
  lg: 'w-9 h-9 rounded-xl p-1',
  xl: 'w-12 h-12 rounded-2xl p-1.5',
};

/**
 * BrandLogo — Official KaushalYuva emblem with theme-reactive background
 * - Light Mode: Crisp frosted white surface, subtle slate border, soft ambient shadow.
 * - Dark Mode: Deep obsidian-slate glass, glowing cyber-teal border and specular cyan halo.
 * Adapts instantaneously to color theme toggles with zero layout shift or flash.
 */
export function BrandLogo({
  size = 'lg',
  className = '',
  alt = 'KaushalYuva Emblem',
}: BrandLogoProps) {
  const sizeClass = sizeClasses[size] || sizeClasses.lg;

  return (
    <div
      className={`relative shrink-0 overflow-hidden flex items-center justify-center transition-all duration-300 select-none ${sizeClass} 
        bg-white/95 border border-slate-200/90 shadow-xs ring-1 ring-slate-900/5 
        dark:bg-slate-900/90 dark:border-cyan-400/40 dark:shadow-[0_0_14px_rgba(0,229,255,0.28)] dark:ring-0 
        group-hover:scale-105 ${className}`}
    >
      {/* Light Theme: Navy & Gold & Teal emblem against clean light background */}
      <img
        src="/logo.png"
        alt={alt}
        className="w-full h-full object-contain block dark:hidden transition-transform duration-200"
        loading="eager"
        decoding="async"
      />
      {/* Dark Theme: Luminous Platinum & Gold & Teal emblem against cyber dark glass */}
      <img
        src="/logo-dark.png"
        alt={alt}
        className="w-full h-full object-contain hidden dark:block transition-transform duration-200"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
