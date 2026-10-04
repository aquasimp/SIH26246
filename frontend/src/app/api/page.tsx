'use client';

import React, { useState } from 'react';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { OCCUPATIONS, DISTRICTS, RECOMMENDATIONS, EARLY_WARNING_ALERTS } from '@/lib/demoData';
import { downloadCSV, downloadJSON } from '@/lib/exportUtils';
import { 
  DownloadCloud, 
  Copy, 
  Check, 
  Terminal, 
  Code, 
  FileSpreadsheet, 
  Database,
  ArrowRight
} from 'lucide-react';
import { clsx } from 'clsx';

export default function ApiExportsPage() {
  const [activeTab, setActiveTab] = useState<'forecast' | 'gap' | 'recommendation' | 'district' | 'occupation'>('forecast');
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
          occupation: { nco: '7126.0101', title: 'Solar PV Installer' },
          district: { name: 'Gorakhpur', lgd_code: 178 },
          horizon: '6M',
          model: 'Global LightGBM Ensemble v3.2',
          confidence: 0.78,
          wape_error: 0.127,
          time_series: OCCUPATIONS[0].timeSeries.slice(22, 28)
        };
      case 'gap':
        return {
          status: 'success',
          district: 'Gorakhpur',
          summary: { shortage_count: 124, balanced_count: 416, oversupply_count: 87 },
          top_gaps: OCCUPATIONS.slice(0, 3).map(o => ({
            nco: o.ncoCode,
            title: o.title,
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
    navigator.clipboard.writeText(`curl -X GET "https://kaushalpulse.msde.gov.in${getEndpoint().replace('GET ', '')}" -H "Authorization: Bearer msde_demo_token"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const data = getSampleJson();
    const rows = [
      ['KaushalPulse Export Payload', activeTab.toUpperCase()],
      ['Timestamp', new Date().toISOString()],
      ['Payload Raw', JSON.stringify(data)]
    ];
    downloadCSV(`KaushalPulse_${activeTab}_export.csv`, rows);
  };

  const handleDownloadJson = () => {
    downloadJSON(`KaushalPulse_${activeTab}_export.json`, getSampleJson());
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            Open Government Data & Integration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          API & Data Exports Console
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Programmatic REST endpoints and structured data export facilities enabling inter-departmental integration with Skill India Digital Hub and state skill portals.
        </p>
      </div>

      {/* API Navigator & Interactive Console (Section 32) */}
      <GlassPanel
        title="Interactive Labour Intelligence API Explorer"
        subtitle="Live payloads conforming to Open Data standards."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-xl liquid-control text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>
        }
      >
        {/* Navigation Pills */}
        <div className="flex flex-wrap gap-2 pb-4 mb-4 border-b border-slate-200/70">
          {[
            { id: 'forecast', label: '1. Forecast API' },
            { id: 'gap', label: '2. Gap Intelligence API' },
            { id: 'recommendation', label: '3. Recommendation API' },
            { id: 'district', label: '4. District API' },
            { id: 'occupation', label: '5. Occupation API' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer',
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'liquid-control text-slate-700 hover:text-slate-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Endpoint & Copy Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 shadow-inner">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-extrabold text-[10px]">
              GET
            </span>
            <span className="text-emerald-400 truncate">
              https://kaushalpulse.msde.gov.in{getEndpoint().replace('GET ', '')}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'cURL Copied!' : 'Copy cURL'}</span>
          </button>
        </div>

        {/* Live JSON Preview Window */}
        <div className="relative rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs max-h-96 overflow-y-auto shadow-inner border border-slate-800">
          <pre>{JSON.stringify(getSampleJson(), null, 2)}</pre>
        </div>
      </GlassPanel>
    </div>
  );
}
