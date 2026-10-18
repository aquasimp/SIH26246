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
    <section 
      className={clsx(
        'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl backdrop-saturate-150',
        'border border-slate-200/80 dark:border-slate-800/80 rounded-[var(--radius-xl)] p-5 sm:p-6',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_4px_24px_-4px_rgba(15,23,42,0.05)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_-4px_rgba(0,0,0,0.35)]',
        'transition-all duration-300',
        'max-w-full overflow-hidden min-w-0',
        className
      )}
    >
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3.5 border-b border-[var(--border)]">
          <div>
            {title && (
              <h2 className="section-title-editorial text-[var(--brand-ink)]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[var(--fs-small)] text-[var(--text-muted)] mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2 max-w-full flex-wrap">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
