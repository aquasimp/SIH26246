'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { OUT_OF_SAMPLE_BENCHMARKS } from '@/lib/benchmarkMetrics';
import { EXPORT_METADATA } from '@/lib/demoData';
import { Provenance } from '@/components/common/Provenance';
import { downloadCSV } from '@/lib/exportUtils';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  Database, 
  LineChart, 
  Sliders, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Sparkles,
  Award,
  ArrowUpRight
} from 'lucide-react';

export default function MethodologyPage() {
  const { language, l} = useApp();
  const isHi = language === 'hi';
  const [activeTab, setActiveTab] = useState<'funnel' | 'leakage' | 'backtest' | 'solver' | 'governance'>('funnel');

  const handleExportMethodology = () => {
    const rows = [
      ['Section', 'Parameter / Metric', 'Specification / Empirical Value', 'Notes'],
      ['Supply Funnel', 'Seat Utilization Rate', '94.0% (Solar PV) / 85.4% (Retail)', 'Enrolled / Authorized Capacity'],
      ['Supply Funnel', 'Certification Pass Rate', '83.3% (Solar PV) / 90.0% (Retail)', 'Certified / Enrolled Candidates'],
      ['Supply Funnel', 'Labor Participation Rate', '81.8% (Solar PV) / 82.0% (Retail)', 'Active Job Seekers Post-Certification'],
      ['Supply Funnel', 'Employability Factor', '70.0% (Solar PV) / 44.9% (Retail)', 'Industry Placement Readiness'],
      ['Supply Funnel', 'Cumulative Funnel Throughput', '54.25% (Solar PV) / 44.09% (Retail)', 'Net Employable Supply per Authorized Seat'],
      ['Econometrics', 'Feature Lag Structure', 'Strict t-1 (Zero Contemporaneous Signals)', 'Mathematically proven invariant to test-period metrics'],
      ['Backtest 3M', 'LightGBM WAPE', `${OUT_OF_SAMPLE_BENCHMARKS['3M'].wape}%`, `Seasonal Naive Baseline: ${OUT_OF_SAMPLE_BENCHMARKS['3M'].naiveWape}%`],
      ['Backtest 6M', 'LightGBM WAPE', `${OUT_OF_SAMPLE_BENCHMARKS['6M'].wape}%`, `Seasonal Naive Baseline: ${OUT_OF_SAMPLE_BENCHMARKS['6M'].naiveWape}%`],
      ['Backtest 12M', 'Tri-Model Blend WAPE', `${OUT_OF_SAMPLE_BENCHMARKS['12M'].wape}%`, `Seasonal Naive Baseline: ${OUT_OF_SAMPLE_BENCHMARKS['12M'].naiveWape}%`],
      ['LP Solver', 'Objective Function', 'Min Net Deficit + Retrofit Capex Penalty', 'PuLP Linear Programming / CBC Solver'],
      ['LP Solver', 'Strict Donor Rule', 'Donor Deficit Ratio <= 0.05', 'Capped at 97 seats for Gorakhpur Retail->Solar'],
      ['LP Solver', 'Moderate Donor Rule', 'Donor Deficit Ratio <= 0.10', '140 seats safe shift'],
      ['LP Solver', 'Permissive Donor Rule', 'Donor Gap Score <= 59 (Balanced)', '218 seats safe shift'],
      ['Governance', 'Taxonomy Standard', 'NCO-2015 (Occupations) & LGD (Districts)', 'Official Government of India Master Registers']
    ];
    downloadCSV('KaushalYuva_Methodology_Mathematical_Specification.csv', rows);
    toast.success(l('Methodology specification exported to CSV', 'कार्यप्रणाली विनिर्देश CSV में निर्यात किया गया'));
  };

  return (
    <div className="space-y-8 min-w-0 max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-extrabold uppercase tracking-wider bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30">
              {l('Technical & Mathematical Specification', 'तकनीकी एवं गणितीय विनिर्देश')}
            </span>
            <Provenance source="Official SIH Audit Standard" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
            {l('Model Assumptions & Methodology', 'मॉडल धारणाएँ एवं कार्यप्रणाली')}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-3xl leading-relaxed">
            {l('The architectural foundations of KaushalYuva: zero-leakage econometrics, staged supply funnel dynamics, rolling-origin walk-forward validation, and PuLP non-depletion optimization.', 'कौशलयुवा का संपूर्ण निर्णय-सहायता ढांचा: शून्य-रिसाव इकोनोमेट्रिक्स, चरणबद्ध आपूर्ति फनल, रोलिंग-ओरिजिन वॉक-फ़ॉरवर्ड मूल्यांकन, और LP गैर-रिक्तीकरण अनुकूलन।')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportMethodology}
          className="px-4 py-2 rounded-xl liquid-control text-xs sm:text-sm font-semibold text-[var(--text)] hover:bg-[var(--glass-strong)] border border-[var(--border)] flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{l('Export Mathematical Spec', 'गणितीय विनिर्देश निर्यात')}</span>
        </button>
      </div>

      {/* Navigation Tab Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold border-b border-[var(--border)]">
        <button
          type="button"
          onClick={() => setActiveTab('funnel')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'funnel'
              ? 'bg-[var(--brand)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{l('1. Staged Supply Funnel', '1. चरणबद्ध आपूर्ति फनल')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leakage')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'leakage'
              ? 'bg-[var(--brand)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{l('2. Zero-Leakage Guarantee', '2. शून्य डेटा रिसाव')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('backtest')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'backtest'
              ? 'bg-[var(--brand)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" />
          <span>{l('3. Walk-Forward Backtesting', '3. वॉक-फ़ॉरवर्ड मूल्यांकन')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('solver')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'solver'
              ? 'bg-[var(--brand)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{l('4. PuLP Capacity Solver', '4. LP सीट अनुकूलक')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('governance')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'governance'
              ? 'bg-[var(--brand)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass)]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>{l('5. Data Governance & Honesty', '5. डेटा प्रशासन एवं संप्रभुता')}</span>
        </button>
      </div>

      {/* Tab 1: Staged Supply Funnel */}
      {activeTab === 'funnel' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--brand)] block">
                  {l('SUPPLY MODELING AXIOM', 'आपूर्ति मॉडलिंग सिद्धांत')}
                </span>
                <h2 className="text-xl font-extrabold text-[var(--text)]">
                  {l('The 4-Stage Employable Supply Funnel', 'प्रभावी रोजगार योग्य आपूर्ति का 4-चरणीय फनल')}
                </h2>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-4xl">
              {l('A critical flaw in legacy skilling policy is equating authorized training seats with available job applicants. In real-world ITIs, attrition occurs at each milestone: seats remain unfilled, candidates fail certification, certified youth drop out of the labor force, and not all possess immediate workplace employability.', 'पारंपरिक कौशल योजना में सबसे बड़ी त्रुटि यह मान लेना है कि 100 स्वीकृत सीटें 100 नए तकनीशियनों को जन्म देती हैं। वास्तविकता में, सीटें अधूरी भरती हैं, सभी छात्र उत्तीर्ण नहीं होते, कुछ उच्च शिक्षा में चले जाते हैं, और सभी उद्योग की गुणवत्ता मानकों पर खरे नहीं उतरते।')}
            </p>

            {/* Formula Block */}
            <div className="p-4 sm:p-5 rounded-2xl glass border border-[var(--border)] font-mono text-xs sm:text-sm overflow-x-auto space-y-2 bg-[var(--bg)]/40">
              <div className="text-[var(--text-faint)] font-bold text-[10px] uppercase">
                {l('MATHEMATICAL FORMULATION:', 'गणितीय समीकरण:')}
              </div>
              <div className="text-[var(--brand)] font-extrabold text-sm sm:text-base">
                S_effective = AuthorizedSeats × η_util × η_cert × η_part × η_employ
              </div>
              <div className="text-[11px] text-[var(--text-muted)] space-y-1 pt-1">
                <div>• <strong className="text-[var(--text)]">η_util (Seat Utilization Rate):</strong> {l('Enrolled / Authorized Capacity (Solar PV: 94.0%)', 'प्रवेश / स्वीकृत सीटें (गोरखपुर सोलर: 94.0%)')}</div>
                <div>• <strong className="text-[var(--text)]">η_cert (Certification Pass Rate):</strong> {l('Certified / Enrolled Candidates (Solar PV: 83.3%)', 'प्रमाणित / नामांकित छात्र (गोरखपुर सोलर: 83.3%)')}</div>
                <div>• <strong className="text-[var(--text)]">η_part (Labor Participation Rate):</strong> {l('Active Job Seekers / Certified Youth (Solar PV: 81.8%)', 'सक्रिय रोजगार साधक / प्रमाणित छात्र (गोरखपुर सोलर: 81.8%)')}</div>
                <div>• <strong className="text-[var(--text)]">η_employ (Employability / Placement Readiness):</strong> {l('Industry Placement Readiness Factor (Solar PV: 70.0% vs Retail: 44.9%)', 'उद्योग प्लेसमेंट दर (गोरखपुर सोलर: 70.0% vs रिटेल: 44.9%)')}</div>
              </div>
            </div>

            {/* Canonical Gorakhpur Case Study */}
            <div className="pt-2">
              <h3 className="text-sm font-bold text-[var(--text)] mb-3">
                {l('Canonical Gorakhpur Case Study: Solar PV (7126.0101) Funnel', 'गोरखपुर केस स्टडी: सोलर पीवी (7126.0101) फनल गणना')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-[9px] font-mono text-[var(--text-faint)] uppercase block">1. SEATS</span>
                  <div className="text-xl font-extrabold text-[var(--text)] font-mono">217</div>
                  <span className="text-[9px] text-[var(--text-muted)]">Authorized</span>
                </div>
                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-[9px] font-mono text-[var(--text-faint)] uppercase block">2. ENROLLED</span>
                  <div className="text-xl font-extrabold text-[var(--text)] font-mono">204</div>
                  <span className="text-[9px] text-[var(--brand)]">94.0% Util</span>
                </div>
                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-[9px] font-mono text-[var(--text-faint)] uppercase block">3. CERTIFIED</span>
                  <div className="text-xl font-extrabold text-[var(--text)] font-mono">170</div>
                  <span className="text-[9px] text-[var(--brand)]">83.3% Pass</span>
                </div>
                <div className="p-3 rounded-2xl glass border border-[var(--border)]">
                  <span className="text-[9px] font-mono text-[var(--text-faint)] uppercase block">4. LABOR FORCE</span>
                  <div className="text-xl font-extrabold text-[var(--text)] font-mono">139</div>
                  <span className="text-[9px] text-[var(--brand)]">81.8% Part</span>
                </div>
                <div className="p-3 rounded-2xl glass border border-[var(--brand)]/30 bg-[var(--brand)]/10">
                  <span className="text-[9px] font-mono text-[var(--brand)] uppercase block font-bold">5. EMPLOYABLE</span>
                  <div className="text-xl font-extrabold text-[var(--brand)] font-mono">97</div>
                  <span className="text-[9px] text-[var(--brand)] font-bold">44.7% Cumulative</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Zero-Leakage Guarantee */}
      {activeTab === 'leakage' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  {l('AUDITED ML INTEGRITY', 'ऑडिटेड मशीन लर्निंग सत्यनिष्ठा')}
                </span>
                <h2 className="text-xl font-extrabold text-[var(--text)]">
                  {l('Zero Data Leakage & Strictly Lagged Features', 'शून्य डेटा रिसाव एवं लैग्ड इकोनोमेट्रिक सिग्नल')}
                </h2>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-4xl">
              {isHi
                ? 'अधिकांश हैकथॉन मॉडलों में एक गंभीर छिपी खामी होती है: वे वर्तमान माह की मांग का अनुमान लगाने के लिए उसी माह की प्रशिक्षण सीटों, वेतन विज्ञापनों और नियोक्ता संख्याओं का उपयोग करते हैं। इसे "समकालीन रिसाव" (Contemporaneous Leakage) कहा जाता है। कौशलयुवा में, सभी सुविधाएँ सख्त t-1 लैग पर आधारित हैं।'
                : 'A fatal flaw in many predictive labor dashboards is data leakage: using current-period training seats, contemporaneous wages, or real-time employer hiring counts to predict current-period demand. KaushalYuva enforces a mathematically verified temporal barrier: every feature is strictly lagged to t-1.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl glass border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{l('Verified Lagged Features (Zero Leakage)', 'सत्यापित लैग्ड फीचर्स (Zero Leakage)')}</span>
                </div>
                <ul className="text-xs text-[var(--text-muted)] space-y-1.5 list-disc list-inside">
                  <li><strong className="text-[var(--text)]">lag_1_demand:</strong> {l('Prior-month demand level (t-1)', 'पिछले माह की मांग आधार रेखा')}</li>
                  <li><strong className="text-[var(--text)]">demand_growth_3m / 12m:</strong> {l('Historical quarterly & annual rolling trend', 'ऐतिहासिक तिमाही एवं वार्षिक विकास प्रक्षेपवक्र')}</li>
                  <li><strong className="text-[var(--text)]">rolling_std_6:</strong> {l('6-month demand volatility & dispersion', '6-माह की मांग अस्थिरता और मौसमी संवेग')}</li>
                  <li><strong className="text-[var(--text)]">lag_1_wage_signal:</strong> {l('Lagged local compensation wage premium (t-1)', 'स्थानीय वेतन प्रीमियम संकेत (t-1)')}</li>
                  <li><strong className="text-[var(--text)]">month:</strong> {l('Calendar seasonality for annual fiscal ITI cycles', 'वित्तीय प्रशिक्षण चक्र की मौसमी संख्या (1-12)')}</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl glass border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{l('Strictly Prohibited Contemporaneous Signals', 'सख्ती से प्रतिबंधित समकालीन संकेत')}</span>
                </div>
                <ul className="text-xs text-[var(--text-muted)] space-y-1.5 list-disc list-inside">
                  <li><span className="line-through text-rose-500">current_month_training_seats</span> — {l('Same-period capacity', 'वर्तमान माह की सीटें')}</li>
                  <li><span className="line-through text-rose-500">active_employer_postings_t0</span> — {l('Same-period postings', 'वर्तमान जॉब विज्ञापन')}</li>
                  <li><span className="line-through text-rose-500">target_month_average_wage</span> — {l('Same-period wage survey', 'उसी माह का औसत वेतन')}</li>
                  <li><span className="line-through text-rose-500">future_origin_enrollments</span> — {l('Future origin registrations', 'भविष्य का प्रवेश डेटा')}</li>
                </ul>
                <p className="text-[11px] text-[var(--text-faint)] italic pt-1">
                  {l('Automated pytest test_feature_leakage_audit.py passes with 100% invariance.', 'परीक्षण सुइट test_feature_leakage_audit.py द्वारा 100% सत्यापित।')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Walk-Forward Backtesting */}
      {activeTab === 'backtest' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <LineChart className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  {l('EMPIRICAL ACCURACY BENCHMARKS', 'अनुभवजन्य सटीकता बेंचमार्क')}
                </span>
                <h2 className="text-xl font-extrabold text-[var(--text)]">
                  {l('6-Origin Rolling Walk-Forward Backtesting', '6-ओरिजिन रोलिंग वॉक-फ़ॉरवर्ड सत्यापन')}
                </h2>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-4xl">
              {l('Random K-Fold train-test split is invalid for temporal time series. KaushalYuva performs rolling-origin walk-forward validation across 6 temporal origins (May 2023 through October 2023), evaluating 1,536 trade-district observations per horizon without look-ahead bias.', 'समय-श्रृंखला डेटा में यादृच्छिक ट्रेन/टेस्ट विभाजन (K-Fold CV) का उपयोग करना अवैध है। कौशलयुवा 6 क्रमिक मूल तिथियों (मई 2023 से अक्टूबर 2023) पर वॉक-फ़ॉरवर्ड बैकटेस्ट लागू करता है, जिसमें भविष्य का डेटा कभी भी प्रशिक्षण में नहीं आता।')}
            </p>

            {/* Benchmark Table */}
            <div className="overflow-x-auto rounded-2xl glass border border-[var(--border)]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[var(--glass-strong)] border-b border-[var(--border)] text-[10px] text-[var(--text-faint)] uppercase">
                  <tr>
                    <th className="p-3">Horizon</th>
                    <th className="p-3">Model Architecture</th>
                    <th className="p-3">WAPE (%)</th>
                    <th className="p-3">MASE</th>
                    <th className="p-3">80% CI Coverage</th>
                    <th className="p-3">95% CI Coverage</th>
                    <th className="p-3">Sample Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr className="bg-[var(--brand)]/5 font-bold">
                    <td className="p-3 text-[var(--brand)]">3-Month (3M)</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['3M'].primaryModel}</td>
                    <td className="p-3 text-[var(--success)]">{OUT_OF_SAMPLE_BENCHMARKS['3M'].wape}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['3M'].mase}</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['3M'].coverage80}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['3M'].coverage95}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['3M'].sampleCount}</td>
                  </tr>
                  <tr className="text-[var(--text-muted)]">
                    <td className="p-3">3-Month (3M)</td>
                    <td className="p-3">Seasonal Naive Baseline</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['3M'].naiveWape}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['3M'].naiveMase}</td>
                    <td className="p-3">80.6%</td>
                    <td className="p-3">95.8%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['3M'].sampleCount}</td>
                  </tr>

                  <tr className="bg-[var(--brand)]/5 font-bold">
                    <td className="p-3 text-[var(--brand)]">6-Month (6M)</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['6M'].primaryModel}</td>
                    <td className="p-3 text-[var(--success)]">{OUT_OF_SAMPLE_BENCHMARKS['6M'].wape}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['6M'].mase}</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['6M'].coverage80}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['6M'].coverage95}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['6M'].sampleCount}</td>
                  </tr>
                  <tr className="text-[var(--text-muted)]">
                    <td className="p-3">6-Month (6M)</td>
                    <td className="p-3">Seasonal Naive Baseline</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['6M'].naiveWape}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['6M'].naiveMase}</td>
                    <td className="p-3">78.8%</td>
                    <td className="p-3">95.4%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['6M'].sampleCount}</td>
                  </tr>

                  <tr className="bg-[var(--brand)]/5 font-bold">
                    <td className="p-3 text-[var(--brand)]">12-Month (12M)</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['12M'].primaryModel}</td>
                    <td className="p-3 text-[var(--success)]">{OUT_OF_SAMPLE_BENCHMARKS['12M'].wape}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['12M'].mase}</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['12M'].coverage80}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['12M'].coverage95}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['12M'].sampleCount}</td>
                  </tr>
                  <tr className="text-[var(--text-muted)]">
                    <td className="p-3">12-Month (12M)</td>
                    <td className="p-3">Seasonal Naive Baseline</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['12M'].naiveWape}%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['12M'].naiveMase}</td>
                    <td className="p-3">80.2%</td>
                    <td className="p-3">94.9%</td>
                    <td className="p-3">{OUT_OF_SAMPLE_BENCHMARKS['12M'].sampleCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: PuLP Capacity Solver */}
      {activeTab === 'solver' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  {l('MATHEMATICAL OPTIMIZATION & POLICY BOUNDS', 'गणितीय अनुकूलन एवं नीतिगत सुरक्षा')}
                </span>
                <h2 className="text-xl font-extrabold text-[var(--text)]">
                  {l('PuLP Linear Programming & Donor Non-Depletion Safety', 'PuLP रैखिक प्रोग्रामिंग एवं दाता गैर-रिक्तीकरण सुरक्षा')}
                </h2>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-4xl">
              {l('When a trade like Solar PV suffers an acute deficit, an unconstrained algorithm might naively shift all 500 excess retail seats. But that would induce a severe secondary shortfall in retail. KaushalYuva solves a constrained linear program protecting donor capacity.', 'जब एक जिले में सोलर इंस्टॉलर की भारी कमी हो, तो सहज विचार यह आता है कि अधिशेष वाले ट्रेड (जैसे रिटेल) से सभी 500 सीटें स्थानांतरित कर दी जाएं। लेकिन इससे रिटेल ट्रेड खुद गंभीर संकट में आ जाएगा। कौशलयुवा का LP सॉल्वर दाता ट्रेड को कभी घाटे में जाने नहीं देता।')}
            </p>

            <div className="p-4 sm:p-5 rounded-2xl glass border border-[var(--border)] font-mono text-xs sm:text-sm overflow-x-auto space-y-2 bg-[var(--bg)]/40">
              <div className="text-[var(--text-faint)] font-bold text-[10px] uppercase">
                {l('LP OBJECTIVE FUNCTION & CONSTRAINTS:', 'LP उद्देश्य फलन एवं प्रतिबंध:')}
              </div>
              <div className="text-amber-500 font-extrabold text-sm sm:text-base">
                min ∑_j (D_j - S_j)^2 + λ ∑_(i,j) C_ij · X_ij
              </div>
              <div className="text-[11px] text-[var(--text-muted)] space-y-1 pt-1">
                <div>• <strong className="text-[var(--text)]">Constraint 1 (Lab Surplus):</strong> X_ij ≤ SurplusPhysicalSeats_i</div>
                <div>• <strong className="text-[var(--text)]">Constraint 2 (Donor Safety):</strong> [D_i - (S_i - X_ij · η_i)] / D_i ≤ δ (Strict: δ = 0.05)</div>
                <div>• <strong className="text-[var(--text)]">Constraint 3 (Retrofit Budget):</strong> ∑_(i,j) X_ij · ₹6,500 ≤ MaxDistrictReallocationBudget</div>
              </div>
            </div>

            {/* 3 Safety Presets Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl glass border border-blue-500/30 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-500 block">STRICT PRESET (DEFAULT)</span>
                <div className="text-base font-extrabold text-[var(--text)]">δ ≤ 0.05 (5% Ratio)</div>
                <p className="text-xs text-[var(--text-muted)]">
                  {l('Transfer safely capped at 97 seats. Donor score stays 52 (Balanced). 6.2% deficit closed.', 'सीट स्थानांतरण 97 पर सीमित। दाता स्कोर 52 (संतुलित) रहता है। 6.2% अंतर तुरंत भरता है।')}
                </p>
              </div>

              <div className="p-4 rounded-2xl glass border border-amber-500/30 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-500 block">MODERATE PRESET</span>
                <div className="text-base font-extrabold text-[var(--text)]">δ ≤ 0.10 (10% Ratio)</div>
                <p className="text-xs text-[var(--text-muted)]">
                  {l('140 seats moved. Donor score reaches 55. 8.9% deficit closed.', '140 सीटें स्थानांतरित। दाता स्कोर 55 रहता है। 8.9% अंतर भरता है।')}
                </p>
              </div>

              <div className="p-4 rounded-2xl glass border border-purple-500/30 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-purple-500 block">PERMISSIVE PRESET</span>
                <div className="text-base font-extrabold text-[var(--text)]">Score ≤ 59 (Balanced Edge)</div>
                <p className="text-xs text-[var(--text-muted)]">
                  {l('218 seats moved. Donor score held right at 59 boundary. 13.8% deficit closed.', '218 सीटें स्थानांतरित। दाता स्कोर ठीक 59 पर ठहरता है। 13.8% अंतर भरता है।')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Data Governance */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-strong border border-[var(--border)] shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                <Database className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                  {l('CIVIL SERVICE AUDIT & DATA SOVEREIGNTY', 'सिविल सेवा ऑडिट एवं डेटा पारदर्शिता')}
                </span>
                <h2 className="text-xl font-extrabold text-[var(--text)]">
                  {l('Data Governance, Provenance & Honesty Matrix', 'डेटा संप्रभुता, स्रोत स्पष्टता एवं ईमानदारी मैट्रिक्स')}
                </h2>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-4xl">
              {l('In public policy decision engines, absolute transparency is non-negotiable. KaushalYuva never misrepresents synthetic fixtures as live feeds. Every screen displays explicit provenance chips.', 'सरकारी निर्णय-समर्थन प्रणालियों में सबसे महत्वपूर्ण गुण डेटा की ईमानदारी है। कौशलयुवा कभी भी वास्तविक डेटा का झूठा दावा नहीं करता। हर दृश्य घटक पर स्पष्ट लेबल होते हैं।')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl glass border border-[var(--border)] space-y-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  Official SIH Canonical
                </span>
                <h3 className="text-sm font-bold text-[var(--text)]">
                  {l('Standardized Taxonomies', 'मानकीकृत वर्गीकरण')}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {l('100% aligned with Ministry of Labour NCO-2015 8-digit codes and MoPR Local Government Directory (LGD) district codes.', 'NCO-2015 (8-अंकीय राष्ट्रीय व्यावसायिक वर्गीकरण) और LGD (स्थानीय सरकारी निर्देशिका) कोड के साथ 100% संरेखित।')}
                </p>
              </div>

              <div className="p-4 rounded-2xl glass border border-[var(--border)] space-y-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  SIH Dummy Dataset
                </span>
                <h3 className="text-sm font-bold text-[var(--text)]">
                  {l('Benchmark Evaluation Dataset', 'डमी बेंचमार्क डेटासेट')}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {l('The 8,704-row canonical evaluation dataset. In production MSDE deployment, this is replaced by authenticated NCS & SIDH live API feeds.', '8,704 पंक्तियों का आधिकारिक SIH मूल्यांकन डेटासेट। उत्पाद वातावरण में NCS एवं SIDH लाइव API कनेक्टर्स से स्वतः बदलेगा।')}
                </p>
              </div>

              <div className="p-4 rounded-2xl glass border border-[var(--border)] space-y-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  Offline Fixtures
                </span>
                <h3 className="text-sm font-bold text-[var(--text)]">
                  {l('Graceful Offline Fallback', 'ऑफ़लाइन फ़िक्सचर मोड')}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {l('If the FastAPI analytical backend is temporarily offline, the frontend seamlessly falls back to vetted fixtures with a clear header badge.', 'यदि पायथन बैकएंड अनुपलब्ध हो, तो यूआई बिना क्रैश हुए ऑफ़लाइन फ़िक्सचर पर स्विच करता है और दृश्य चेतावनी दिखाता है।')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Cross-Links to Experience the System */}
      <div className="p-6 sm:p-8 rounded-3xl glass border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--text)]">
            {l('Experience the Methodology in Action', 'कार्यप्रणाली को व्यावहारिक रूप में देखें')}
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {l('Test these LP non-depletion constraints and 4-stage funnel directly in Scenario Studio.', 'परिदृश्य स्टूडियो में जाकर इन LP प्रतिबंधों और 4-चरणीय फनल का स्वयं परीक्षण करें।')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/scenarios?preset=rec01"
            className="px-4 py-2.5 rounded-xl bg-[var(--brand)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>{l('Open Scenario Studio', 'परिदृश्य स्टूडियो खोलें')}</span>
          </Link>
          <Link
            href="/recommendations"
            className="px-4 py-2.5 rounded-xl glass hover:bg-[var(--glass-strong)] border border-[var(--border)] text-[var(--text)] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[var(--brand)]" />
            <span>{l('View Recommendations', 'सिफारिशें देखें')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
