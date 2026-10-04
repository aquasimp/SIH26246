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
      case 'vacancy': return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'employer': return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'capex': return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case 'skill': return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'seasonality': return <Calendar className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Why is demand changing for {occupationTitle}?</span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Attribution & Factor Contribution
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
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
              className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 hover:bg-white transition-all shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-slate-100 shrink-0">
                    {getIcon(factor.signalType)}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      {factor.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider ml-2">
                      [{factor.signalType}]
                    </span>
                  </div>
                </div>

                <div className={clsx(
                  'px-2.5 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1 self-start sm:self-auto font-mono',
                  isPositive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                )}>
                  {isPositive ? '+' : ''}{factor.impactPercent}%
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative mb-1.5">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    isPositive 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                      : 'bg-gradient-to-r from-red-500 to-orange-500'
                  )}
                  style={{ width: `${Math.min(100, absVal * 2.5)}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {factor.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
