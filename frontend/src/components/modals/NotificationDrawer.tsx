'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { clsx } from 'clsx';
import { 
  X, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Check, 
  ArrowRight,
  Download,
  Sliders
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

export const NotificationDrawer: React.FC = () => {
  const { notificationOpen, setNotificationOpen, alerts, acknowledgeAlert } = useApp();

  if (!notificationOpen) return null;

  const handleExportAlerts = () => {
    const rows = [
      ['Alert ID', 'Severity', 'Type', 'Title', 'Geography', 'Occupation', 'Trigger', 'Horizon', 'Confidence', 'Recommended Action'],
      ...alerts.map(a => [
        a.id,
        a.severity,
        a.type,
        a.title,
        a.geography,
        a.occupation,
        a.trigger,
        a.forecastHorizon,
        `${a.confidence}%`,
        a.recommendedAction
      ])
    ];
    downloadCSV('KaushalPulse_Active_Alerts.csv', rows);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-white/95 backdrop-blur-xl border-l border-slate-200/90 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-100 text-red-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Early Warning Intelligence Center
              </h3>
              <p className="text-[11px] text-slate-500">
                {alerts.filter(a => !a.acknowledged).length} unacknowledged national alerts
              </p>
            </div>
          </div>

          <button
            onClick={() => setNotificationOpen(false)}
            className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={clsx(
                'p-3.5 rounded-2xl border transition-all shadow-2xs',
                alert.acknowledged
                  ? 'bg-slate-50/80 border-slate-200/60 opacity-60'
                  : alert.severity === 'critical'
                  ? 'bg-red-50/60 border-red-200'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-blue-50/60 border-blue-200'
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={clsx(
                  'text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full',
                  alert.severity === 'critical'
                    ? 'bg-red-600 text-white'
                    : alert.severity === 'warning'
                    ? 'bg-amber-600 text-white'
                    : 'bg-blue-600 text-white'
                )}>
                  {alert.severity}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {alert.timestamp}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                {alert.title}
              </h4>

              <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                {alert.trigger}
              </p>

              <div className="p-2 rounded-xl bg-white/80 border border-slate-200/70 text-[10px] text-slate-700 mb-2.5">
                <strong className="text-slate-900">Action:</strong> {alert.recommendedAction}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                <span className="text-[10px] text-slate-500 font-medium">
                  Confidence: {alert.confidence}%
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href="/scenarios"
                    className="p-1 text-[10px] font-bold text-blue-700 hover:underline flex items-center gap-0.5"
                  >
                    <Sliders className="w-3 h-3" />
                    Simulate
                  </a>

                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2 py-1 text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      Ack
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <button
            onClick={handleExportAlerts}
            className="px-3 py-1.5 rounded-xl liquid-control text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Alerts
          </button>
          <a
            href="/alerts"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Open Alert Command Center →
          </a>
        </div>
      </div>
    </div>
  );
};
