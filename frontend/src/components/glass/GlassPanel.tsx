'use client';

import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  title,
  subtitle,
  action
}) => {
  return (
    <section className={clsx('glass rounded-3xl p-6 sm:p-7 relative overflow-hidden', className)}>
      {/* Top subtle highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--highlight)] to-transparent pointer-events-none" />
      
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--border)]">
          <div>
            {title && (
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
