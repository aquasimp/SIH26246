'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { OCCUPATIONS, RECOMMENDATIONS } from '@/lib/demoData';
import { getLocalizedEntityName, resolveDisplayName, localizeSkill, localizeQualification } from '@/lib/i18n';
import { ForecastChart } from '@/components/charts/ForecastChart';
import { ContributionChart } from '@/components/charts/ContributionChart';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { 
  ChevronLeft, 
  Sliders, 
  Download
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

export default function OccupationDetailPage({ params }: { params: Promise<{ nco: string }> }) {
  const resolvedParams = use(params);
  const ncoCode = resolvedParams.nco;
  const { language, l} = useApp();

  const occ = OCCUPATIONS.find(o => o.ncoCode === ncoCode) || OCCUPATIONS[0];
  const rec = RECOMMENDATIONS.find(r => r.toNco === occ.ncoCode || r.fromNco === occ.ncoCode);

  const handleExport = () => {
    const rows = [
      ['Occupation Report', occ.title],
      ['NCO-2015 Code', occ.ncoCode],
      ['Sector', occ.sector],
      ['NSQF Level', occ.nsqfLevel],
      ['Current Demand', occ.currentDemand],
      ['Effective Supply', occ.effectiveSupply],
      ['Net Gap', occ.currentDemand - occ.effectiveSupply],
      ['Gap Score', occ.gapScore],
      ['6M Shortage Probability', `${occ.shortageProbability6M}%`],
      ['6M Forecast Demand', occ.forecastDemand6M],
      ['Training Seats', occ.stagedSupply.trainingSeats],
      ['Enrolled', occ.stagedSupply.enrolled],
      ['Certified', occ.stagedSupply.certified],
      ['Available Labour', occ.stagedSupply.availableLabour],
      ['Effective Employable Supply', occ.stagedSupply.effectiveEmployableSupply],
      ['Average Wage INR', `₹${occ.averageWageINR}`]
    ];
    downloadCSV(`KaushalYuva_Occupation_${occ.ncoCode}.csv`, rows);
  };

  const getLocalizedSeverity = (severity: string) => {
    return getLocalizedEntityName('severityBands', severity, language, severity);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/occupations"
          className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--brand)] flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{l('Back to All Occupations', 'सभी व्यवसायों पर वापस')}</span>
        </Link>

        <button
          onClick={handleExport}
          className="px-3.5 py-1.5 rounded-xl liquid-control text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-[var(--brand)]" />
          <span>{l('Export NCO Profile', 'NCO प्रोफ़ाइल निर्यात करें')}</span>
        </button>
      </div>

      {/* Hero Occupation Header (Section 25) */}
      <div className="p-6 sm:p-7 rounded-3xl glass border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-[var(--brand)] bg-[var(--brand)]/10 px-2.5 py-0.5 rounded-md border border-[var(--brand)]/20">
              NCO-2015: {occ.ncoCode}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              NSQF {l('Level', 'स्तर')} {occ.nsqfLevel}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-medium">
              {l('Sector', 'क्षेत्र')}: {getLocalizedEntityName('sectors', occ.sector, language, occ.sector)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            {resolveDisplayName(occ, language)}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            {l('Detailed occupational intelligence profile mapping real-time industry vacancies to the staged training and certification funnel.', 'उद्योग की वास्तविक समय की रिक्तियों को चरणबद्ध प्रशिक्षण और प्रमाणन फ़नल से जोड़ने वाला विस्तृत व्यावसायिक खुफिया प्रोफ़ाइल।')}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/scenarios"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs"
          >
            <Sliders className="w-4 h-4" />
            <span>{l('Simulate in Scenario Studio', 'परिदृश्य स्टूडियो में अनुकरण')}</span>
          </Link>
        </div>
      </div>

      {/* 5 Core Top Metric Blocks (Section 25) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Metric 1: Current Demand */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {l('Current Demand', 'वर्तमान मांग')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-mono my-1">
            {occ.currentDemand.toLocaleString()}
          </div>
          <span className="text-[11px] text-orange-500 font-semibold">
            +{occ.growthRate6M}% {l('Growth', 'वृद्धि')}
          </span>
        </div>

        {/* Metric 2: Effective Supply */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {l('Effective Supply', 'प्रभावी आपूर्ति')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-mono my-1">
            {occ.effectiveSupply.toLocaleString()}
          </div>
          <span className="text-[11px] text-[var(--text-faint)] font-semibold">
            {l('Employable Pool', 'रोजगार योग्य पूल')}
          </span>
        </div>

        {/* Metric 3: Gap Score */}
        <div className="p-4 rounded-2xl glass border border-[var(--severe)]/40 shadow-xs">
          <span className="text-[10px] font-bold text-[var(--severe)] uppercase tracking-wider block">
            {l('Gap Score', 'अंतर स्कोर')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--severe)] font-mono my-1">
            {occ.gapScore} / 100
          </div>
          <span className="text-[11px] text-[var(--severe)] font-semibold">
            {getLocalizedSeverity(occ.severity)}
          </span>
        </div>

        {/* Metric 4: 6M Forecast Demand */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {l('6M Projected Demand', '6M अनुमानित मांग')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--brand)] font-mono my-1">
            {occ.forecastDemand6M.toLocaleString()}
          </div>
          <span className="text-[11px] text-[var(--brand)] font-semibold">
            {l('LightGBM Projection', 'LightGBM प्रक्षेपण')}
          </span>
        </div>

        {/* Metric 5: Shortage Probability */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {l('Shortage Risk (6M)', 'कमी जोखिम (6M)')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--severe)] font-mono my-1">
            {occ.shortageProbability6M}%
          </div>
          <span className="text-[11px] text-[var(--text-faint)] font-semibold">
            {l('High Severity Signal', 'उच्च गंभीरता संकेत')}
          </span>
        </div>
      </div>

      {/* Staged Labour Supply Funnel (Section 2 & 25) */}
      <GlassPanel
        title={l('Staged Employable Labour Supply Pipeline', 'चरणबद्ध रोजगार योग्य श्रम आपूर्ति पाइपलाइन')}
        subtitle={l('MSDE Architecture: Preserving Training Seats → Enrolled → Certified → Available Labour → Effective Employable Supply.', 'MSDE वास्तुकला: प्रशिक्षण सीटें → नामांकित → प्रमाणित → उपलब्ध श्रम → प्रभावी रोजगार योग्य आपूर्ति।')}
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {l('1. Training Seats', '1. प्रशिक्षण सीटें')}
            </span>
            <div className="text-2xl font-extrabold text-[var(--text)] font-mono my-1">
              {occ.stagedSupply.trainingSeats}
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">
              {l('Authorized Capacity', 'अधिकृत क्षमता')}
            </span>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {l('2. Enrolled Cohort', '2. नामांकित समूह')}
            </span>
            <div className="text-2xl font-extrabold text-[var(--text)] font-mono my-1">
              {occ.stagedSupply.enrolled}
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">
              {l(`Utilization: ${Math.round(occ.stagedSupply.seatUtilizationRate * 100)}%`, `उपयोग: ${Math.round(occ.stagedSupply.seatUtilizationRate * 100)}%`)}
            </span>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {l('3. Certified Pool', '3. प्रमाणित पूल')}
            </span>
            <div className="text-2xl font-extrabold text-[var(--text)] font-mono my-1">
              {occ.stagedSupply.certified}
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">
              {l(`Pass Rate: ${Math.round(occ.stagedSupply.certificationRate * 100)}%`, `उत्तीर्ण दर: ${Math.round(occ.stagedSupply.certificationRate * 100)}%`)}
            </span>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl glass-strong border border-[var(--border)]">
            <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
              {l('4. Available Labour', '4. उपलब्ध श्रम')}
            </span>
            <div className="text-2xl font-extrabold text-[var(--text)] font-mono my-1">
              {occ.stagedSupply.availableLabour}
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">
              {l(`Participation: ${Math.round(occ.stagedSupply.laborParticipationRate * 100)}%`, `भागीदारी: ${Math.round(occ.stagedSupply.laborParticipationRate * 100)}%`)}
            </span>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl glass-strong border border-[var(--balanced)]/30 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-[var(--balanced)] uppercase tracking-wider block">
              {l('5. Effective Supply', '5. प्रभावी आपूर्ति')}
            </span>
            <div className="text-2xl font-extrabold text-[var(--balanced)] font-mono my-1">
              {occ.stagedSupply.effectiveEmployableSupply}
            </div>
            <span className="text-[10px] text-[var(--balanced)] font-semibold">
              {l(`Employability: ${Math.round(occ.stagedSupply.employabilityFactor * 100)}%`, `रोजगार योग्यता: ${Math.round(occ.stagedSupply.employabilityFactor * 100)}%`)}
            </span>
          </div>
        </div>
      </GlassPanel>

      {/* Forecast Chart & Attribution */}
      <GlassPanel
        title={l(`Forecast & Demand Trajectory: ${occ.title}`, `पूर्वानुमान और मांग प्रक्षेपवक्र: ${resolveDisplayName(occ, language)}`)}
        subtitle={l('36-Month Historical trend and forward projections with 95% Confidence Intervals.', '36-महीने का ऐतिहासिक रुझान और 95% विश्वास अंतराल के साथ अग्रिम अनुमान।')}
      >
        <ForecastChart
          data={occ.timeSeries}
          occupationTitle={resolveDisplayName(occ, language)}
          horizon="6M"
          model="lightgbm"
        />
      </GlassPanel>

      {/* Explainability Attribution */}
      <GlassPanel
        title={l('Why is Demand Changing?', 'मांग क्यों बदल रही है?')}
        subtitle={l('Empirical factor decomposition explaining model predictions.', 'मॉडल भविष्यवाणियों की व्याख्या करने वाला अनुभवजन्य कारक अपघटन।')}
      >
        <ContributionChart
          factors={occ.explainability}
          occupationTitle={resolveDisplayName(occ, language)}
        />
      </GlassPanel>

      {/* Skills & Qualification Pack Linkage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassPanel
          title={l('Curriculum & Key Skills Required', 'पाठ्यक्रम और आवश्यक प्रमुख कौशल')}
          subtitle={l('Competency standards verified against employer job listings.', 'नियोक्ता नौकरी लिस्टिंग के खिलाफ सत्यापित योग्यता मानक।')}
        >
          <div className="flex flex-wrap gap-2">
            {occ.keySkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl glass text-[var(--brand)] text-xs font-semibold border border-[var(--brand)]/20"
              >
                {localizeSkill(skill, language)}
              </span>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel
          title={l('National Qualification Packs (NQR / NSQF)', 'राष्ट्रीय योग्यता पैक (NQR / NSQF)')}
          subtitle={l('Formal qualification standards linked to this NCO code.', 'इस NCO कोड से जुड़े औपचारिक योग्यता मानक।')}
        >
          <div className="space-y-2">
            {occ.qualifications.map((qp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl glass-strong border border-[var(--border)] text-xs font-semibold text-[var(--text)] flex items-center justify-between"
              >
                <span>{localizeQualification(qp, language)}</span>
                <span className="text-[10px] font-bold text-[var(--balanced)] bg-[var(--balanced)]/10 px-2 py-0.5 rounded-md border border-[var(--balanced)]/20 font-mono">
                  {l('Approved NSQF', 'स्वीकृत NSQF')}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
