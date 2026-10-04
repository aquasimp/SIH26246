'use client';

import React, { SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface GlassSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const GlassSelect: React.FC<GlassSelectProps> = ({
  label,
  icon,
  className,
  children,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <select
          className={clsx(
            'w-full appearance-none liquid-control rounded-xl py-2 pr-9 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer',
            icon ? 'pl-9' : 'pl-3.5',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
