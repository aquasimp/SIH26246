'use client';

import React from 'react';
import { DATA_HEALTH_METRIC } from '@/lib/demoData';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Provenance } from '@/components/common/Provenance';
import { useApp } from '@/lib/store';
import { clsx } from 'clsx';
import { 
  ShieldCheck, 
  Database, 
  Activity, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function DataHealthPage() {
  const { language } = useApp();
  const isHi = language === 'hi';
  const m = DATA_HEALTH_METRIC;

  const getLocalizedModelName = (name: string) => {
    if (!isHi) return name;
    if (name.includes('LightGBM Regressor (Production)')) return 'LightGBM समाश्रयण (उत्पादन)';
    if (name.includes('LightGBM Regressor')) return 'LightGBM समाश्रयण';
    if (name.includes('ARIMA Baseline')) return 'ARIMA आधार रेखा';
    if (name.includes('Holt-Winters Seasonal')) return 'Holt-Winters मौसमी';
    if (name.includes('Random Forest Regressor')) return 'Random Forest समाश्रयण';
    if (name.includes('Production Blend')) return 'उत्पादन त्रि-मिश्रण';
    return name;
  };

  const getLocalizedSourceName = (name: string) => {
    if (!isHi) return name;
    if (name.includes('SIH Monthly Intelligence')) return 'SIH मासिक आसूचना विहित डेटासेट';
    if (name.includes('Local Government Directory')) return 'स्थानीय सरकारी निर्देशिका (LGD) मास्टर';
    if (name.includes('National Classification of Occupations')) return 'राष्ट्रीय व्यवसाय वर्गीकरण (NCO-2015)';
    if (name.includes('National Career Service')) return 'राष्ट्रीय करियर सेवा (NCS) API फ़ीड';
    if (name.includes('Skill India Digital Hub')) return 'कौशल भारत डिजिटल हब (SIDH) प्रशिक्षण क्षमता';
    if (name.includes('e-Shram')) return 'ई-श्रम अनौपचारिक श्रम पंजीकरण';
    if (name.includes('NCO-2015')) return 'NCO-2015 / LGD मानकीकरण पदानुक्रम';
    if (name.includes('Periodic Labour Force Survey')) return 'आवधिक श्रम बल सर्वेक्षण (PLFS) जिला बेंचमार्क';
    if (name.includes('National Apprenticeship Promotion Scheme')) return 'राष्ट्रीय शिक्षुता संवर्धन योजना (NAPS)';
    if (name.includes('Private Job Portals')) return 'निजी नौकरी पोर्टल बहु-स्रोत संकलक';
    if (name.includes('MSDE Purvanchal Pilot')) return 'एमएसडीई पूर्वांचल पायलट जमीनी मूल्यांकन';
    if (name.includes('Direct EPFO Payroll')) return 'प्रत्यक्ष ईपीएफओ पेरोल रीयल-टाइम स्ट्रीम';
    if (name.includes('State Directorate of Employment')) return 'राज्य रोजगार एवं प्रशिक्षण निदेशालय (DET) एपीआई';
    if (name.includes('GST E-Way Bill')) return 'जीएसटी ई-वे बिल औद्योगिक परिवहन संकेत';
    return name;
  };

  const getLocalizedRecords = (records: string) => {
    if (!isHi) return records;
    if (records.includes('Districts')) return records.replace('Districts', 'जिले');
    if (records.includes('Trades')) return records.replace('Trades', 'ट्रेड्स');
    if (records === 'Scheduled') return 'अनुसूचित';
    if (records.includes('Vacancy Records')) return records.replace('Vacancy Records', 'रिक्ति रिकॉर्ड');
    if (records.includes('Training Centres')) return records.replace('Training Centres', 'प्रशिक्षण केंद्र');
    if (records.includes('Worker Profiles')) return records.replace('Worker Profiles', 'श्रमिक प्रोफाइल');
    if (records.includes('Occupation Codes')) return records.replace('Occupation Codes', 'व्यवसाय कोड');
    if (records.includes('Survey Samples')) return records.replace('Survey Samples', 'सर्वेक्षण नमूने');
    if (records.includes('Active Contracts')) return records.replace('Active Contracts', 'सक्रिय अनुबंध');
    if (records.includes('Scraped Listings')) return records.replace('Scraped Listings', 'संकलित सूचियां');
    if (records.includes('Local Employer Audits')) return records.replace('Local Employer Audits', 'स्थानीय नियोक्ता ऑडिट');
    if (records.includes('In MoL&E Integration Sandbox')) return 'श्रम मंत्रालय एकीकरण सैंडबॉक्स में';
    if (records.includes('Awaiting State API Gateway')) return 'राज्य एपीआई गेटवे की प्रतीक्षा में';
    if (records.includes('Scheduled Phase-2 Feed')) return 'अनुसूचित चरण-2 फ़ीड';
    return records;
  };

  const getLocalizedType = (type: string) => {
    if (!isHi) return type;
    if (type === 'Public Aggregate') return 'सार्वजनिक संकलन';
    if (type === 'Demo Dataset') return 'डेमो डेटासेट';
    if (type === 'Planned Government Feed') return 'नियोजित सरकारी फ़ीड';
    return type;
  };

  const getLocalizedStatus = (status: string) => {
    if (!isHi) return status;
    if (status === 'Active') return 'सक्रिय';
    if (status === 'Synced') return 'सिंक किया गया';
    if (status === 'Pending') return 'लंबित';
    return status;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Provenance type="official" note={isHi ? 'प्लेटफ़ॉर्म विश्वसनीयता एवं ऑडिट शासन' : 'Platform Trust & Audit Governance'} />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--balanced)]/10 text-[var(--balanced)] border border-[var(--balanced)]/20">
            {isHi ? 'ऑडिट तैयार' : 'Audit Ready'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
          {isHi ? 'डेटा एवं मॉडल स्वास्थ्य शासन' : 'Data & Model Health Governance'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
          {isHi 
            ? 'बहु-स्रोत अंतर्ग्रहण फ़ीड्स, NCO/LGD ऑन्कोलॉजी मैपिंग विश्वसनीयता, मॉडल ड्रिफ्ट मेट्रिक्स और पाइपलाइन रन उद्गम पर व्यापक दृश्यता।' 
            : 'Comprehensive observability over multi-source ingestion feeds, NCO/LGD ontology mapping confidence, model drift metrics, and pipeline run provenance.'}
        </p>
      </div>

      {/* 6 Top Governance KPI Cards (Section 31) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Sources */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {isHi ? 'जुड़े हुए स्रोत' : 'Sources Connected'}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-mono my-1">
            {m.sourcesConnected} / {m.sourcesTotal}
          </div>
          <span className="text-[10px] text-[var(--brand)] font-semibold font-mono">
            {isHi ? 'सक्रिय अंतर्ग्रहण' : 'Active Ingestion'}
          </span>
        </div>

        {/* Metric 2: Freshness */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {isHi ? 'डेटा ताजगी' : 'Data Freshness'}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--balanced)] font-mono my-1">
            {m.freshnessPercent}%
          </div>
          <span className="text-[10px] text-[var(--balanced)] font-semibold font-mono">
            {isHi ? 'SLA के तहत सिंक' : 'Synced Under SLA'}
          </span>
        </div>

        {/* Metric 3: Mapping Confidence */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {isHi ? 'मैपिंग विश्वसनीयता' : 'Mapping Confidence'}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--brand-secondary)] font-mono my-1">
            {m.mappingConfidencePercent}%
          </div>
          <span className="text-[10px] text-[var(--brand-secondary)] font-semibold font-mono">
            {isHi ? 'NCO / LGD संरेखण' : 'NCO / LGD Alignment'}
          </span>
        </div>

        {/* Metric 4: Forecast Confidence */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {isHi ? 'पूर्वानुमान विश्वसनीयता' : 'Forecast Confidence'}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--brand)] font-mono my-1">
            {m.forecastConfidencePercent}%
          </div>
          <span className="text-[10px] text-[var(--brand)] font-semibold font-mono">
            {isHi ? 'उत्पादन त्रि-मिश्रण' : 'Production Tri-Blend'}
          </span>
        </div>

        {/* Metric 5: Data Quality */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {isHi ? 'डेटा गुणवत्ता' : 'Data Quality'}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono my-1">
            {m.dataQualityPercent}%
          </div>
          <span className="text-[10px] text-purple-400 font-semibold font-mono">
            {isHi ? 'सत्यापन उत्तीर्ण' : 'Passes Validation'}
          </span>
        </div>

        {/* Metric 6: Last Run */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {isHi ? 'अंतिम सफल रन' : 'Last Successful Run'}
          </span>
          <div className="text-xs sm:text-sm font-extrabold text-[var(--text)] mt-2 font-mono truncate">
            {m.lastRunId}
          </div>
          <span className="text-[10px] text-[var(--text-faint)] block mt-0.5 font-mono">
            {isHi ? '2026-10-04 (डेटा अक्टूबर 2024 तक)' : m.lastRunTimestamp}
          </span>
        </div>
      </div>

      {/* Model Performance Benchmark Comparison */}
      <GlassPanel
        title={isHi ? 'मॉडल बेंचमार्क मेट्रिक्स एवं बेसलाइन तुलना' : 'Model Benchmark Metrics & Baseline Comparison'}
        subtitle={isHi ? 'सख्त रूप से विलंबित अर्थमितीय संकेतों के साथ 6 रोलिंग उद्गमों पर मूल्यांकन (कोई समकालिक रिसाव नहीं)।' : 'Evaluated across 6 rolling origins with strictly lagged econometric signals (no contemporaneous leakage).'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(m.models || []).map((mod, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl glass-strong border border-[var(--border)] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xs font-extrabold text-[var(--text)] leading-snug">
                    {getLocalizedModelName(mod.name)}
                  </h3>
                  <span className={clsx(
                    'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0',
                    mod.status === 'optimal' ? 'text-[var(--brand)] bg-[var(--brand)]/10 border-[var(--brand)]/20' : 'text-[var(--text-faint)] glass border-[var(--border)]'
                  )}>
                    {isHi ? (mod.status === 'optimal' ? 'इष्टतम' : 'स्वस्थ') : mod.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-2.5">
                  <div className="p-2.5 rounded-xl glass border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--text-faint)] uppercase font-bold block">WAPE</span>
                    <div className="text-xl font-extrabold text-[var(--brand)] font-mono mt-0.5">
                      {mod.wape}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl glass border border-[var(--border)]">
                    <span className="text-[9px] text-[var(--text-faint)] uppercase font-bold block">MAE</span>
                    <div className="text-xl font-extrabold text-[var(--text)] font-mono mt-0.5">
                      {mod.mae}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[var(--text-faint)] font-mono pt-2 border-t border-[var(--border)]">
                {isHi ? 'अंतिम प्रशिक्षित:' : 'Last Trained:'} {mod.lastTrained}
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Multi-Horizon Rolling-Origin Backtest Table (Item 1 Hardening Requirement) */}
      <GlassPanel
        title={isHi ? 'रोलिंग-ओरिजिन वॉक-फॉरवर्ड बैकटेस्ट (6 उद्गम × क्षितिज 3M / 6M / 12M)' : 'Rolling-Origin Walk-Forward Backtest (6 Origins × Horizons 3M / 6M / 12M)'}
        subtitle={isHi ? 'अनुभवजन्य आउट-ऑफ-सैंपल मूल्यांकन: प्रति क्षितिज 1,536 ट्रेड-जिला अवलोकनों में WAPE, MASE और 80%/95% अंतराल कवरेज।' : 'Empirical out-of-sample evaluation: WAPE, MASE, and 80%/95% interval coverage across 1,536 trade-district observations per horizon.'}
        action={
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--balanced)]/10 text-[var(--balanced)] border border-[var(--balanced)]/20 flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isHi ? 'शून्य-रिसाव सत्यापित' : 'Zero-Leakage Verified'}
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-faint)] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">{isHi ? 'पूर्वानुमान क्षितिज' : 'Forecast Horizon'}</th>
                <th className="py-3 px-3">{isHi ? 'मॉडल / बेसलाइन' : 'Model / Baseline'}</th>
                <th className="py-3 px-3 text-right">WAPE (%)</th>
                <th className="py-3 px-3 text-right">MASE</th>
                <th className="py-3 px-3 text-right">{isHi ? '80% अंतराल कवरेज' : '80% Interval Coverage'}</th>
                <th className="py-3 px-3 text-right">{isHi ? '95% अंतराल कवरेज' : '95% Interval Coverage'}</th>
                <th className="py-3 px-3 text-right">{isHi ? 'नमूना अवलोकन' : 'Sample Observations'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {m.backtestHorizons?.map((row, idx) => {
                const isProduction = row.model.includes('Production');
                const isHorizonStart = idx % 5 === 0;

                return (
                  <tr 
                    key={idx} 
                    className={clsx(
                      'hover:bg-[var(--brand)]/5 transition-colors',
                      isProduction ? 'bg-[var(--brand)]/10 font-semibold' : '',
                      isHorizonStart ? 'border-t-2 border-[var(--border-strong)]' : ''
                    )}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[var(--text)]">
                      {isHorizonStart ? (
                        <span className="px-2 py-0.5 rounded-md glass text-[var(--text)] text-[11px] border border-[var(--border)]">
                          {row.horizon} {isHi ? 'क्षितिज' : 'Horizon'}
                        </span>
                      ) : (
                        <span className="text-[var(--text-faint)] pl-2">↳</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={clsx(
                        isProduction ? 'text-[var(--brand)] font-bold' : 'text-[var(--text-muted)]'
                      )}>
                        {getLocalizedModelName(row.model)}
                      </span>
                      {isProduction && (
                        <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20 font-mono">
                          {isHi ? 'उत्पादन मिश्रण' : 'Production Blend'}
                        </span>
                      )}
                    </td>
                    <td className={clsx('py-2.5 px-3 text-right font-mono font-bold', isProduction ? 'text-[var(--brand)]' : 'text-[var(--text)]')}>
                      {row.wape.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[var(--text)]">
                      {row.mase.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[var(--text)]">
                      <span className={clsx(
                        'px-1.5 py-0.5 rounded text-[11px] font-semibold border',
                        Math.abs(row.coverage_80 - 80) <= 3.5 ? 'bg-[var(--balanced)]/10 text-[var(--balanced)] border-[var(--balanced)]/20' : 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20'
                      )}>
                        {row.coverage_80.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[var(--text)]">
                      <span className={clsx(
                        'px-1.5 py-0.5 rounded text-[11px] font-semibold border',
                        Math.abs(row.coverage_95 - 95) <= 2.5 ? 'bg-[var(--balanced)]/10 text-[var(--balanced)] border-[var(--balanced)]/20' : 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20'
                      )}>
                        {row.coverage_95.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[var(--text-faint)]">
                      {row.sample_count.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3.5 p-3.5 rounded-xl glass-strong border border-[var(--border)] text-[11px] text-[var(--text-muted)] leading-relaxed">
          <strong className="text-[var(--text)] block mb-1">
            {isHi ? 'प्रणाली एवं महत्वपूर्ण मॉडल सीमा प्रकटीकरण:' : 'Methodology & Critical Model Limitation Disclosure:'}
          </strong>
          {isHi ? (
            <>
              आधिकारिक SIH मासिक डेटासेट पर 1,536 श्रृंखला-क्षितिज अवलोकनों पर 6 वॉक-फॉरवर्ड लौकिक उद्गमों (<span className="font-mono">2023-05-01</span> से <span className="font-mono">2023-10-01</span>) में मूल्यांकित। मॉडल सख्ती से t-1 विलंबित इनपुट (शून्य रिसाव) के साथ प्रशिक्षित। 
              <span className="block mt-1 font-semibold text-[var(--text)]">
                सीमा: केवल LightGBM सभी क्षितिजों में सर्वोत्तम एकल मॉडल नहीं है।
              </span>
              Theta 3M (4.93% बनाम 5.67% WAPE) और 6M (5.91% बनाम 7.11% WAPE) पर LightGBM से बेहतर प्रदर्शन करता है, जबकि ETS 12M (3.92% बनाम 5.29% WAPE) पर बेहतर प्रदर्शन करता है। इसलिए उत्पादन पूर्वानुमान बिना किसी पूर्वाग्रह के आउट-ऑफ-फ़ोल्ड व्युत्क्रम-WAPE भारित <strong>त्रि-मॉडल पहनावा मिश्रण (LightGBM + Theta + ETS)</strong> को तैनात करते हैं, जो अच्छी तरह से कैलिब्रेट किए गए 80% (~79.2%) और 95% (~95.8%) अंतराल कवरेज को बनाए रखते हुए सबसे कम समग्र त्रुटि (12M पर 3.46% WAPE) प्राप्त करते हैं।
            </>
          ) : (
            <>
              Evaluated across 6 walk-forward temporal origins (<span className="font-mono">2023-05-01</span> through <span className="font-mono">2023-10-01</span>) on the SIH dummy dataset across 1,536 series-horizon observations. Models trained strictly with $t-1$ lagged inputs (zero leakage). 
              <span className="block mt-1 font-semibold text-[var(--text)]">
                Limitation: LightGBM alone is not the best single model across horizons.
              </span>
              Theta outperforms LightGBM at 3M (4.93% vs 5.67% WAPE) and 6M (5.91% vs 7.11% WAPE), while ETS outperforms at 12M (3.92% vs 5.29% WAPE). Production forecasts therefore deploy an out-of-fold inverse-WAPE weighted <strong>Tri-Model Ensemble Blend (LightGBM + Theta + ETS)</strong> without look-ahead bias, achieving the lowest overall error (3.46% WAPE at 12M) while maintaining well-calibrated 80% (~79.2%) and 95% (~95.8%) interval coverage.
            </>
          )}
        </div>
      </GlassPanel>

      {/* Connected Feeds Table (Section 31 & 51) */}
      <GlassPanel
        title={isHi ? 'अंतर्ग्रहीत डेटा स्रोत एवं उद्गम रजिस्ट्री' : 'Ingested Data Sources & Provenance Registry'}
        subtitle={isHi ? 'अनिवार्य धारा 51 वर्गीकरण: सार्वजनिक संकलन, डेमो डेटासेट और नियोजित सरकारी फ़ीड।' : 'Mandatory Section 51 classification: Public Aggregate, Demo Dataset, and Planned Government Feeds.'}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-faint)] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">{isHi ? 'डेटा स्रोत विवरण' : 'Data Source Description'}</th>
                <th className="py-3 px-3">{isHi ? 'डेटा वर्गीकरण' : 'Data Classification'}</th>
                <th className="py-3 px-3">{isHi ? 'सिंक स्थिति' : 'Sync Status'}</th>
                <th className="py-3 px-3">{isHi ? 'रिकॉर्ड्स अंतर्ग्रहीत' : 'Records Ingested'}</th>
                <th className="py-3 px-3 text-right">{isHi ? 'क्वेरी लेटेंसी' : 'Query Latency'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {(m.sources || []).map((src, idx) => (
                <tr key={idx} className="hover:bg-[var(--brand)]/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-[var(--text)]">
                    {getLocalizedSourceName(src.name)}
                  </td>
                  <td className="py-3 px-3">
                    <span className={clsx(
                      'px-2 py-0.5 rounded-md text-[10px] font-bold border font-mono',
                      src.type === 'Public Aggregate' ? 'bg-[var(--balanced)]/10 text-[var(--balanced)] border-[var(--balanced)]/20' :
                      src.type === 'Demo Dataset' ? 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20' :
                      'glass text-[var(--text-muted)] border-[var(--border)]'
                    )}>
                      {getLocalizedType(src.type)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={clsx(
                      'inline-flex items-center gap-1 font-semibold text-[11px]',
                      src.status === 'Active' ? 'text-[var(--balanced)]' :
                      src.status === 'Synced' ? 'text-[var(--brand)]' :
                      'text-[var(--text-faint)]'
                    )}>
                      {src.status === 'Active' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {getLocalizedStatus(src.status)}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[var(--text)]">
                    {getLocalizedRecords(src.records)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[var(--text-faint)]">
                    {src.latency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
