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
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg',
    md: 'text-xs px-3.5 py-2 gap-2 rounded-lg font-medium',
    lg: 'text-sm px-4.5 py-2.5 gap-2.5 rounded-lg font-medium'
  }[size];

  const variantClasses = {
    primary: clsx(
      'bg-slate-900/95 hover:bg-slate-800 text-white',
      'dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white',
      'border border-slate-700/60 dark:border-white/50',
      'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_2px_8px_rgba(15,23,42,0.15)]',
      'hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.30),0_6px_20px_rgba(15,23,42,0.22)]',
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
      'bg-sky-600 hover:bg-sky-700 text-white',
      'border border-sky-500/60',
      'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(2,132,199,0.25)]',
      'hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_6px_20px_rgba(2,132,199,0.35)]',
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
