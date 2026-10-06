'use client';

import React from 'react';
import clsx from 'clsx';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  eyebrow?: string;
  index?: string;
  className?: string;
  highlight?: string;
  dataGlyph?: boolean;
}

/**
 * Signal Rule + Index Eyebrow component (§4.5)
 */
export function SignalEyebrow({ index, text, className }: { index?: string; text?: string; className?: string }) {
  if (!index && !text) return null;
  return (
    <div className={clsx('space-y-1.5 mb-2.5', className)}>
      <div className="signal-rule w-full" aria-hidden="true" />
      <div className="eyebrow flex items-center gap-2">
        {index && <span className="font-mono font-bold text-[var(--brand)]">{index}</span>}
        {index && text && <span className="text-[var(--text-faint)]">/</span>}
        {text && <span>{text}</span>}
      </div>
    </div>
  );
}

/**
 * Hero inline chart data glyph (~300 bytes, baseline aligned) (§4.5)
 */
export function InlineChartGlyph({ className }: { className?: string }) {
  return (
    <svg 
      className={clsx('inline-block h-[0.72em] w-[2.2em] ml-2 -mb-0.5 align-baseline text-[var(--brand)]', className)} 
      viewBox="0 0 64 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Historical solid sparkline */}
      <path 
        d="M2 18 L16 14 L30 19 L44 9" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Forecast dashed projection */}
      <path 
        d="M44 9 L54 4 L62 2" 
        stroke="var(--forecast, #3F51C7)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeDasharray="4 3" 
      />
      {/* Target point indicator */}
      <circle cx="62" cy="2" r="2.5" fill="var(--brand)" />
    </svg>
  );
}

/**
 * Display H1 for Hero (§4.4)
 */
export function Display({ children, eyebrow, index, className, dataGlyph, ...props }: HeadingProps) {
  return (
    <div className="group">
      <SignalEyebrow index={index} text={eyebrow} />
      <h1 className={clsx('display', className)} {...props}>
        {children}
        {dataGlyph && <InlineChartGlyph />}
      </h1>
    </div>
  );
}

/**
 * Page-level primary H1 (§4.4)
 */
export function H1({ children, eyebrow, index, className, dataGlyph, ...props }: HeadingProps) {
  return (
    <div className="group">
      <SignalEyebrow index={index} text={eyebrow} />
      <h1 className={clsx('h1', className)} {...props}>
        {children}
        {dataGlyph && <InlineChartGlyph />}
      </h1>
    </div>
  );
}

/**
 * Section-level H2 with Signal Rule (§4.4, §4.5)
 */
export function H2({ children, eyebrow, index, className, ...props }: HeadingProps) {
  return (
    <div className="group">
      <SignalEyebrow index={index} text={eyebrow} />
      <h2 className={clsx('h2', className)} {...props}>
        {children}
      </h2>
    </div>
  );
}
