'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { FilterBar } from '@/components/layout/FilterBar';
import { Provenance } from '@/components/common/Provenance';
import { Badge } from '@/components/common/Badge';
import { clsx } from 'clsx';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Check, 
  Sliders, 
  Download, 
  ArrowRight, 
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';
import { getLocalizedEntityName } from '@/lib/i18n';
import { toast } from 'sonner';

export default function AlertsPage() {
  const { alerts, acknowledgeAlert, language, l } = useApp();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter(a => {
    const matchesSev = selectedSeverity === 'all' || a.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || a.type === selectedType;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.titleHi && a.titleHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          a.geography.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.occupation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesType && matchesSearch;
  });

  const handleExport = () => {
    const rows = [
      ['Alert ID', 'Severity', 'Type', 'Title', 'Geography', 'Occupation', 'Trigger', 'Horizon', 'Confidence', 'Recommended Action', 'Status'],
      ...filteredAlerts.map(a => [
        a.id,
        a.severity,
        a.type,
        l(a.title, a.titleHi || a.title),
        getLocalizedEntityName('districts', a.geography, language, a.geographyHi || a.geography),
        getLocalizedEntityName('occupations', a.occupation, language, a.occupationHi || a.occupation),
        l(a.trigger, a.triggerHi || a.trigger),
        a.forecastHorizon,
        `${a.confidence}%`,
        l(a.recommendedAction, a.recommendedActionHi || a.recommendedAction),
        a.acknowledged ? (l('Acknowledged', 'स्वीकृत')) : (l('Active', 'सक्रिय'))
      ])
    ];
    downloadCSV('KaushalYuva_Early_Warnings.csv', rows);
    toast.success(l(`Exported ${alerts.length} early warning alerts to CSV`, `${alerts.length} चेतावनी संकेत CSV में निर्यात किए गए`));
  };

  const getSeverityBadgeText = (sev: string) => {
    if (sev === 'critical') return l('Critical', 'अति गंभीर');
    if (sev === 'warning') return l('Warning', 'चेतावनी');
    if (sev === 'info') return l('Info', 'सूचना');
    return sev;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Provenance type="official" note={l('National Predictive Risk Engine', 'राष्ट्रीय भविष्यसूचक जोखिम इंजन')} />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--severe)]/10 text-[var(--severe)] border border-[var(--severe)]/20">
              {l('35 Anomalies Active', '35 विसंगतियां सक्रिय')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
            {language === 'hi' ? (
              'प्रारंभिक चेतावनी कमान केंद्र'
            ) : (
              <>
                Early Warning &amp; Shortage <span className="title-serif-italic">Alerts</span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            {l('Predictive detection of emerging trade imbalances, saturation hazards, and technological skill obsolescence before structural distress occurs.', 'ढांचागत संकट उत्पन्न होने से पहले उभरते व्यापार असंतुलन, संतृप्ति खतरों और तकनीकी कौशल अप्रचलन का भविष्यसूचक पता लगाना।')}
          </p>
        </div>

        <button
          onClick={handleExport}
          className="btn-liquid-primary py-2 px-4 text-xs font-semibold flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>{l('Export Alert Dossier', 'अलर्ट डोजियर निर्यात करें')}</span>
        </button>
      </div>

      <FilterBar />

      {/* Official Dataset Early Warning Intelligence Banner */}
      <div className="p-4 rounded-2xl glass border border-[var(--border-strong)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[var(--brand)] text-white tracking-wider font-mono">
              {l('MSDE Labour Registry Scan', 'MSDE श्रम रजिस्ट्री स्कैन')}
            </span>
            <span className="font-bold text-[var(--text)]">
              {l('35 Active Anomalies Detected across 16 Districts', '16 जिलों में 35 सक्रिय विसंगतियां पाई गईं')}
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">
            {language === 'en' ? (
              <>
                Of the 6 algorithmic alert categories, <strong>4 categories fire on the official dataset</strong>: <strong>1 Persistent Severe Shortage</strong> (Gorakhpur Solar PV Installer with 3/3 periods at Gap Score 94), <strong>1 Critical Emerging Shortage</strong> (Drone Maintenance in Rajkot), <strong>30 Capacity Inefficiencies</strong> (physical training seats &gt; 2.0× demand, ranked by wasted seats), and <strong>3 Skill Obsolescence Risks</strong> (legacy garments &amp; HVAC). The top prioritized alerts are surfaced below.
              </>
            ) : (
              <>
                {l('Of the 6 algorithmic alert categories, 4 categories fire on the official dataset: 1 Persistent Severe Shortage (Gorakhpur Solar PV Installer with 3/3 periods at Gap Score 94), 1 Critical Emerging Shortage (Drone Maintenance in Rajkot), 30 Capacity Inefficiencies (physical training seats > 2.0x demand), and 3 Skill Obsolescence Risks (legacy garments & HVAC). The top prioritized alerts are surfaced below.', '6 एल्गोरिद्मिक अलर्ट श्रेणियों में से 4 श्रेणियां आधिकारिक डेटासेट पर ट्रिगर होती हैं: 1 सतत गंभीर कमी (गोरखपुर सोलर पीवी इंस्टॉलर, अंतर स्कोर 94 पर 3/3 अवधियां), 1 महत्वपूर्ण उभरती कमी (राजकोट में ड्रोन रखरखाव), 30 क्षमता अक्षमताएं (भौतिक प्रशिक्षण सीटें मांग से 2.0 गुना अधिक), और 3 कौशल अप्रचलन जोखिम (पारंपरिक वस्त्र व एचवीएसी)। शीर्ष प्राथमिकता वाले अलर्ट नीचे प्रदर्शित हैं।')}
              </>
            )}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg glass-strong border border-[var(--border)] text-[11px] font-mono font-bold text-[var(--text)]">
            {l('Algorithmic Ranking', 'एल्गोरिद्मिक रैंकिंग')}
          </span>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="p-3.5 rounded-2xl glass flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider mr-1">
            {l('Severity:', 'गंभीरता:')}
          </span>
          {[
            { id: 'all', label: l('All', 'सभी') },
            { id: 'critical', label: l('Critical', 'अति गंभीर') },
            { id: 'warning', label: l('Warning', 'चेतावनी') },
            { id: 'info', label: l('Info', 'सूचना') }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedSeverity(item.id)}
              className={clsx(
                'px-3 py-1 font-bold rounded-lg transition-all cursor-pointer capitalize text-xs',
                selectedSeverity === item.id
                  ? 'bg-[var(--brand)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={l('Search alerts by geography / trade...', 'भूगोल / ट्रेड द्वारा अलर्ट खोजें...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl liquid-control text-[var(--text)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={clsx(
              'p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between glass',
              alert.acknowledged
                ? 'opacity-70 border-[var(--border)]'
                : alert.severity === 'critical'
                ? 'border-[var(--severe)]/40 shadow-sm'
                : alert.severity === 'warning'
                ? 'border-[var(--warning)]/40'
                : 'border-[var(--border-strong)]'
            )}
          >
            <div>
              {/* Alert Top Line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={clsx(
                    'px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase font-mono tracking-wider',
                    alert.severity === 'critical' ? 'bg-[var(--severe)] text-white' :
                    alert.severity === 'warning' ? 'bg-[var(--warning)] text-white' :
                    'bg-[var(--brand)] text-white'
                  )}>
                    {getSeverityBadgeText(alert.severity)}
                  </span>

                  <span className="text-xs font-bold text-[var(--text)]">
                    {getLocalizedEntityName('districts', alert.geography, language, alert.geographyHi || alert.geography)}
                  </span>

                  <span className="text-xs text-[var(--text-faint)]">•</span>

                  <span className="text-xs font-semibold text-[var(--brand)] bg-[var(--brand)]/10 px-2.5 py-0.5 rounded-md border border-[var(--brand)]/20">
                    {getLocalizedEntityName('occupations', alert.occupation, language, alert.occupationHi || alert.occupation)} (NCO {alert.ncoCode})
                  </span>

                  {alert.wastedSeats && (
                    <span className="text-[10px] font-mono font-bold text-[var(--warning)] bg-[var(--warning)]/10 px-2 py-0.5 rounded-md border border-[var(--warning)]/20">
                      {l(`Excess Capacity: ${alert.wastedSeats} seats`, `अतिरिक्त क्षमता: ${alert.wastedSeats} सीटें`)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--text-faint)] font-mono">
                  <span>{l('Horizon:', 'अवधि:')} <strong className="text-[var(--text)]">{alert.forecastHorizon}</strong></span>
                  <span>{l('Confidence:', 'विश्वसनीयता:')} <strong className="text-[var(--balanced)]">{alert.confidence}%</strong></span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              {/* Title & Trigger */}
              <h3 className="text-base font-bold text-[var(--text)] mb-1.5">
                {l(alert.title, alert.titleHi || alert.title)}
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-3 leading-relaxed">
                <strong className="text-[var(--text)]">{l('Trigger:', 'ट्रिगर:')}</strong> {l(alert.trigger, alert.triggerHi || alert.trigger)}
              </p>

              {/* Context Label Callout */}
              {(alert.contextHi || alert.context) && (
                <div className="p-3.5 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/25 mb-3 text-xs flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[var(--warning)] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block font-mono">
                      {l('Qualitative Intelligence Context', 'गुणात्मक आसूचना संदर्भ')}
                    </span>
                    <p className="text-[var(--text)] font-normal mt-0.5 leading-relaxed">
                      {language === 'en'
                        ? (alert.context || '').replace(/^Context,\s*not model output:\s*/i, '')
                        : l(
                            (alert.context || '').replace(/^Context,\s*not model output:\s*/i, ''),
                            (alert.contextHi || alert.context || '').replace(/^संदर्भ,\s*मॉडल आउटपुट नहीं:\s*/i, '')
                          )}
                    </p>
                  </div>
                </div>
              )}

              {/* Recommended Action Box */}
              <div className="p-3.5 rounded-xl glass-strong border border-[var(--border)] mb-4 text-xs">
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-1 font-mono">
                  {l('Algorithmic Policy Recommendation', 'एल्गोरिद्मिक नीति सिफारिश')}
                </span>
                <p className="text-[var(--text)] font-medium leading-relaxed">
                  {l(alert.recommendedAction, alert.recommendedActionHi || alert.recommendedAction)}
                </p>
              </div>
            </div>

            {/* Alert Action Buttons (Section 22: Acknowledge, Investigate, Simulate, Export) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                {!alert.acknowledged ? (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3.5 py-1.5 rounded-xl liquid-control text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[var(--text)]"
                  >
                    <Check className="w-3.5 h-3.5 text-[var(--balanced)]" />
                    <span>{l('Acknowledge Alert', 'अलर्ट स्वीकार करें')}</span>
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded-xl glass text-[var(--balanced)] text-xs font-bold flex items-center gap-1.5 border border-[var(--balanced)]/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{l('Acknowledged', 'स्वीकृत')}</span>
                  </span>
                )}

                <Link
                  href={`/occupations/${alert.ncoCode}`}
                  className="px-3.5 py-1.5 rounded-xl liquid-control text-xs font-bold text-[var(--text)] flex items-center gap-1.5"
                >
                  <span>{l('Investigate Evidence', 'साक्ष्य की जांच करें')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/scenarios"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{l('Simulate in Studio', 'स्टूडियो में अनुकरण करें')}</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
