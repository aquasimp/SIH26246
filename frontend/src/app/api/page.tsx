'use client';

import React, { useState } from 'react';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Provenance } from '@/components/common/Provenance';
import { OCCUPATIONS, DISTRICTS, RECOMMENDATIONS } from '@/lib/demoData';
import { downloadCSV, downloadJSON } from '@/lib/exportUtils';
import { useApp } from '@/lib/store';
import { resolveDisplayName } from '@/lib/i18n';
import { 
  DownloadCloud, 
  Copy, 
  Check, 
  FileSpreadsheet
} from 'lucide-react';
import { clsx } from 'clsx';

type ApiTab = 'forecast' | 'gap' | 'recommendation' | 'district' | 'occupation';

export default function ApiExportsPage() {
  const { language, l } = useApp();
  const [activeTab, setActiveTab] = useState<ApiTab>('forecast');
  const [copied, setCopied] = useState(false);

  const getEndpoint = () => {
    switch (activeTab) {
      case 'forecast': return 'GET /api/forecasts?nco=7126.0101&horizon=6M&district=gorakhpur';
      case 'gap': return 'GET /api/gaps?district=gorakhpur&severity=shortage';
      case 'recommendation': return 'GET /api/recommendations?status=pending';
      case 'district': return 'GET /api/districts?state=Uttar+Pradesh';
      case 'occupation': return 'GET /api/occupations?nco=7126.0101';
    }
  };

  const getSampleJson = () => {
    switch (activeTab) {
      case 'forecast':
        return {
          status: 'success',
          pipeline_run: 'RUN-2026-10-04-001',
          occupation: { nco: '7126.0101', title: l('Solar PV Installer', 'सोलर पीवी इंस्टॉलर') },
          district: { name: l('Gorakhpur', 'गोरखपुर'), lgd_code: 178 },
          horizon: '6M',
          model: 'Tri-Model Ensemble Blend (LightGBM + Theta + ETS)',
          confidence: 0.78,
          wape_error: 0.0358,
          time_series: OCCUPATIONS[0].timeSeries.slice(22, 28)
        };
      case 'gap':
        return {
          status: 'success',
          district: l('Gorakhpur', 'गोरखपुर'),
          summary: { shortage_count: 124, balanced_count: 416, oversupply_count: 87 },
          top_gaps: OCCUPATIONS.slice(0, 3).map(o => ({
            nco: o.ncoCode,
            title: resolveDisplayName(o, language),
            current_demand: o.currentDemand,
            effective_supply: o.effectiveSupply,
            gap_score: o.gapScore,
            severity: o.severity,
            shortage_probability: o.shortageProbability6M
          }))
        };
      case 'recommendation':
        return {
          status: 'success',
          count: RECOMMENDATIONS.length,
          recommendations: RECOMMENDATIONS
        };
      case 'district':
        return {
          status: 'success',
          districts: DISTRICTS.slice(0, 4)
        };
      case 'occupation':
        return {
          status: 'success',
          occupation: OCCUPATIONS[0]
        };
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`curl -X GET "https://kaushalyuva.msde.gov.in${getEndpoint().replace('GET ', '')}" -H "Authorization: Bearer msde_demo_token"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const data = getSampleJson();
    const rows = [
      ['KaushalYuva Export Payload', activeTab.toUpperCase()],
      ['Timestamp', new Date().toISOString()],
      ['Payload Raw', JSON.stringify(data)]
    ];
    downloadCSV(`KaushalYuva_${activeTab}_export.csv`, rows);
  };

  const handleDownloadJson = () => {
    downloadJSON(`KaushalYuva_${activeTab}_export.json`, getSampleJson());
  };

  const tabs: { id: ApiTab; label: string }[] = [
    { id: 'forecast', label: l('1. Forecast API', '1. पूर्वानुमान एपीआई') },
    { id: 'gap', label: l('2. Gap Intelligence API', '2. अंतर खुफिया एपीआई') },
    { id: 'recommendation', label: l('3. Recommendation API', '3. सिफारिश एपीआई') },
    { id: 'district', label: l('4. District API', '4. जिला एपीआई') },
    { id: 'occupation', label: l('5. Occupation API', '5. व्यवसाय एपीआई') }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="eyebrow"><span className="eyebrow-bullet" />{l('System & Governance', 'प्रणाली एवं शासन')}</span>
          <Provenance type="official" note={l('Open Government Data & Integration', 'ओपन सरकारी डेटा और एकीकरण')} />
          <span className="telemetry-chip">
            REST v1.0
          </span>
        </div>
        <h1 className="page-title-editorial">
          {language !== 'en' ? (
            l('API & Data Exports Console', 'एपीआई और डेटा निर्यात कंसोल')
          ) : (
            <>
              API &amp; Data Exports <span className="title-serif-italic">Console</span>
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          {l('Programmatic REST endpoints and structured data export facilities enabling inter-departmental integration with Skill India Digital Hub and state skill portals.', 'कौशल भारत डिजिटल हब (SIDH) और राज्य कौशल पोर्टलों के साथ अंतर-विभागीय एकीकरण सक्षम करने वाले प्रोग्रामेटिक REST एंडपॉइंट्स।')}
        </p>
      </div>

      {/* API Navigator & Interactive Console (Section 32) */}
      <GlassPanel
        className="liquid-glass-card hud-corner-card"
        title={l('Interactive Labour Intelligence API Explorer', 'इंटरएक्टिव श्रम खुफिया एपीआई एक्सप्लोरर')}
        subtitle={l('Live payloads conforming to Open Data standards.', 'ओपन डेटा मानकों के अनुरूप लाइव पेलोड।')}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-3.5 py-1.5 rounded-xl liquid-control text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{l('Download CSV', 'CSV डाउनलोड')}</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="btn-liquid-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>{l('Download JSON', 'JSON डाउनलोड')}</span>
            </button>
          </div>
        }
      >
        {/* Navigation Pills */}
        <div className="flex flex-wrap gap-2 pb-4 mb-4 border-b border-[var(--border)]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer font-mono',
                activeTab === tab.id
                  ? 'bg-[var(--brand)] text-white shadow-xs'
                  : 'liquid-control text-[var(--text-muted)] hover:text-[var(--text)]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Endpoint & Copy Bar */}
        <div className="p-3.5 rounded-2xl glass-strong border border-[var(--border)] font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shadow-inner">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded-md bg-[var(--balanced)] text-white font-extrabold text-[10px]">
              GET
            </span>
            <code className="text-[var(--balanced)] truncate font-semibold font-mono bg-transparent border-0 p-0">
              https://kaushalyuva.msde.gov.in{getEndpoint().replace('GET ', '')}
            </code>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded-xl liquid-control text-[var(--text)] text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[var(--balanced)]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (l('cURL Copied!', 'cURL कॉपी हो गया!')) : (l('Copy cURL', 'cURL कॉपी करें'))}</span>
          </button>
        </div>

        {/* Live JSON Preview Window */}
        <div className="relative rounded-2xl bg-[var(--surface-muted)] text-[var(--text)] p-4 font-mono text-xs max-h-96 overflow-y-auto shadow-inner border border-[var(--border)]">
          <pre>{JSON.stringify(getSampleJson(), null, 2)}</pre>
        </div>
      </GlassPanel>
    </div>
  );
}
