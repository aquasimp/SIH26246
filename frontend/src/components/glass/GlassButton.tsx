'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-[32px] text-xs px-3 gap-1.5 rounded-[var(--radius)]',
    md: 'h-[36px] text-xs px-3.5 gap-2 rounded-[var(--radius)] font-medium',
    lg: 'h-[40px] text-sm px-4.5 gap-2.5 rounded-[var(--radius)] font-medium'
  }[size];

  const variantClasses = {
    primary: clsx(
      'bg-slate-900 text-white hover:bg-slate-800 border border-slate-800',
      'dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:border-white/90',
      'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_2px_8px_rgba(15,23,42,0.12)] dark:shadow-[inset_0_1px_0_0_#ffffff,0_4px_16px_rgba(0,0,0,0.3)]',
      'hover:-translate-y-0.5 active:translate-y-0'
    ),
    secondary: clsx(
      'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-300',
      'border border-slate-200/80 dark:border-slate-800/80',
      'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_1px_3px_rgba(15,23,42,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]',
      'hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-100',
      'hover:-translate-y-0.5 active:translate-y-0'
    ),
    accent: clsx(
      'bg-[var(--accent-soft)] hover:bg-[var(--accent)]/20 text-[var(--accent)]',
      'border border-[var(--accent)]/35 dark:border-[var(--accent)]/45',
      'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_2px_8px_rgba(180,83,15,0.08)]',
      'hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_6px_16px_rgba(180,83,15,0.16)]',
      'hover:-translate-y-0.5 active:translate-y-0'
    ),
    danger: clsx(
      'bg-red-600 hover:bg-red-700 text-white',
      'border border-red-500/60',
      'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(220,38,38,0.2)]',
      'hover:-translate-y-0.5 active:translate-y-0'
    ),
    ghost: clsx(
      'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100',
      'hover:bg-slate-100/80 dark:hover:bg-slate-800/80 backdrop-blur-sm'
    )
  }[variant];

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
        sizeClasses,
        variantClasses,
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
