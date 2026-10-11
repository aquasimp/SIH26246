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
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-xl',
    md: 'text-sm px-4 py-2 gap-2 rounded-xl',
    lg: 'text-base px-6 py-2.5 gap-2.5 rounded-2xl font-semibold'
  }[size];

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 border border-blue-400/40',
    secondary: 'liquid-control text-[var(--text)] hover:text-[var(--brand)] border border-[var(--border)]',
    accent: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20 border border-emerald-400/40',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 border border-red-400/40',
    ghost: 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-strong)]'
  }[variant];

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
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
