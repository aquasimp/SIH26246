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

  // Close on Escape key
  React.useEffect(() => {
    if (!notificationOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setNotificationOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notificationOpen, setNotificationOpen]);

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
    downloadCSV('KaushalYuva_Active_Alerts.csv', rows);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) setNotificationOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-label="Intelligence Notifications"
    >
      <div className="w-full max-w-md h-full overlay border-l border-[var(--border-strong)] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border)] glass-strong flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--severe)]/10 text-[var(--severe)]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text)]">
                Early Warning Intelligence Center
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                {alerts.filter(a => !a.acknowledged).length} unacknowledged national alerts
              </p>
            </div>
          </div>

          <button
            onClick={() => setNotificationOpen(false)}
            className="p-1.5 rounded-xl liquid-control text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
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
                'p-3.5 rounded-2xl border transition-all glass',
                alert.acknowledged
                  ? 'opacity-60 border-[var(--border)]'
                  : alert.severity === 'critical'
                  ? 'border-[var(--severe)]/40 shadow-xs'
                  : alert.severity === 'warning'
                  ? 'border-[var(--warning)]/40'
                  : 'border-[var(--border)]'
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={clsx(
                  'text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full',
                  alert.severity === 'critical'
                    ? 'bg-[var(--severe)] text-white'
                    : alert.severity === 'warning'
                    ? 'bg-[var(--warning)] text-white'
                    : 'bg-[var(--brand)] text-white'
                )}>
                  {alert.severity}
                </span>
                <span className="text-[10px] text-[var(--text-faint)] font-mono">
                  {alert.timestamp}
                </span>
              </div>

              <h4 className="text-xs font-bold text-[var(--text)] mb-1 leading-snug">
                {alert.title}
              </h4>

              <p className="text-[11px] text-[var(--text-muted)] mb-2 leading-relaxed">
                {alert.trigger}
              </p>

              <div className="p-2 rounded-xl glass-strong border border-[var(--border)] text-[10px] text-[var(--text-muted)] mb-2.5">
                <strong className="text-[var(--text)]">Action:</strong> {alert.recommendedAction}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-faint)] font-mono">
                  Confidence: {alert.confidence}%
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href="/scenarios"
                    className="p-1 text-[10px] font-bold text-[var(--brand)] hover:underline flex items-center gap-0.5"
                  >
                    <Sliders className="w-3 h-3" />
                    Simulate
                  </a>

                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2 py-1 text-[10px] font-bold liquid-control text-[var(--text)] rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3 text-[var(--balanced)]" />
                      Ack
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] glass-strong flex items-center justify-between">
          <button
            onClick={handleExportAlerts}
            className="px-3 py-1.5 rounded-xl liquid-control text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[var(--text)]"
          >
            <Download className="w-3.5 h-3.5 text-[var(--brand)]" />
            Export Alerts
          </button>
          <a
            href="/alerts"
            className="text-xs font-bold text-[var(--brand)] hover:underline flex items-center gap-1"
          >
            Open Command Center →
          </a>
        </div>
      </div>
    </div>
  );
};
