'use client';

import React from 'react';
import { ExplainabilityFactor } from '@/lib/types';
import { clsx } from 'clsx';
import { 
  TrendingUp, 
  TrendingDown, 
  Briefcase, 
  Building2, 
  Sparkles, 
  Calendar 
} from 'lucide-react';

interface ContributionChartProps {
  factors: ExplainabilityFactor[];
  occupationTitle: string;
}

export const ContributionChart: React.FC<ContributionChartProps> = ({
  factors,
  occupationTitle
}) => {
  const getIcon = (type: ExplainabilityFactor['signalType']) => {
    switch (type) {
      case 'vacancy': return <TrendingUp className="w-4 h-4 text-[var(--balanced)]" />;
      case 'employer': return <Building2 className="w-4 h-4 text-[var(--brand)]" />;
      case 'capex': return <Briefcase className="w-4 h-4 text-[var(--brand-secondary)]" />;
      case 'skill': return <Sparkles className="w-4 h-4 text-[var(--warning)]" />;
      case 'seasonality': return <Calendar className="w-4 h-4 text-[var(--text-faint)]" />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
          <span>Why is demand changing for {occupationTitle}?</span>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20">
            Attribution & Factor Contribution
          </span>
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Decomposition of regional macro-economic drivers, employer hiring activity, and seasonal shifts influencing the ML forecast.
        </p>
      </div>

      <div className="space-y-3">
        {factors.map((factor, index) => {
          const isPositive = factor.impactPercent >= 0;
          const absVal = Math.abs(factor.impactPercent);

          return (
            <div
              key={index}
              className="p-3.5 rounded-2xl glass border border-[var(--border)] transition-all shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl glass-strong shrink-0">
                    {getIcon(factor.signalType)}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[var(--text)]">
                      {factor.name}
                    </span>
                    <span className="text-[10px] text-[var(--text-faint)] font-mono uppercase tracking-wider ml-2">
                      [{factor.signalType}]
                    </span>
                  </div>
                </div>

                <div className={clsx(
                  'px-2.5 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1 self-start sm:self-auto font-mono border',
                  isPositive
                    ? 'bg-[var(--balanced)]/10 text-[var(--balanced)] border-[var(--balanced)]/20'
                    : 'bg-[var(--severe)]/10 text-[var(--severe)] border-[var(--severe)]/20'
                )}>
                  {isPositive ? '+' : ''}{factor.impactPercent}%
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden relative mb-1.5">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    isPositive 
                      ? 'bg-[var(--balanced)]' 
                      : 'bg-[var(--severe)]'
                  )}
                  style={{ width: `${Math.min(100, absVal * 2.5)}%` }}
                />
              </div>

              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                {factor.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
