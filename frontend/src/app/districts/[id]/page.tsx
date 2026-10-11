'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { DISTRICTS, OCCUPATIONS, RECOMMENDATIONS } from '@/lib/demoData';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Provenance } from '@/components/common/Provenance';
import { Badge } from '@/components/common/Badge';
import { getLocalizedEntityName, resolveDisplayName } from '@/lib/i18n';
import { clsx } from 'clsx';
import { 
  MapPin, 
  Building2, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  Lightbulb, 
  Sliders, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

export default function DistrictDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const districtId = resolvedParams.id;
  const { language, l } = useApp();

  const d = DISTRICTS.find(item => item.id.toLowerCase() === districtId.toLowerCase()) || DISTRICTS[0];

  const districtRecommendations = RECOMMENDATIONS.filter(r => r.district.toLowerCase() === d.name.toLowerCase());
  const districtOccupations = OCCUPATIONS.filter(o => o.districtConcentrations.some(c => c.district.toLowerCase() === d.name.toLowerCase()));

  const handleExportDistrict = () => {
    const rows = [
      ['District Profile', d.name],
      ['State', d.state],
      ['LGD Code', d.lgdCode],
      ['Demand Index', d.demandIndex],
      ['Effective Supply Index', d.effectiveSupplyIndex],
      ['Gap Score', d.gapScore],
      ['6M Shortage Probability', `${d.shortageProbability6M}%`],
      ['Training Centres', d.trainingCentresCount],
      ['Total Training Seats', d.totalTrainingSeats],
      ['Active Employers', d.activeEmployers],
      ['Top Shortage Trades', d.topShortageTrades.join('; ')],
      ['Top Oversupplied Trades', d.topOversuppliedTrades.join('; ')]
    ];
    downloadCSV(`KaushalPulse_District_${d.name}.csv`, rows);
  };

  const localizedDistrictName = resolveDisplayName(d, language);
  const localizedState = getLocalizedEntityName('states', d.state, language, d.state);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/districts"
          className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--brand)] flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{l('Back to All Districts', 'सभी जिलों पर वापस')}</span>
        </Link>

        <button
          onClick={handleExportDistrict}
          className="px-3.5 py-1.5 rounded-xl liquid-control text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-[var(--brand)]" />
          <span>{l('Export District Brief', 'जिला संक्षिप्त विवरण निर्यात')}</span>
        </button>
      </div>

      {/* Hero District Header (Section 24) */}
      <div className="p-6 sm:p-7 rounded-3xl glass border border-[var(--border)] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold text-[var(--brand)] uppercase tracking-wider">
              {l('India', 'भारत')} → {localizedState} → {localizedDistrictName}
            </span>
            <span className="text-xs font-mono text-[var(--text-faint)]">
              [LGD: {d.lgdCode}]
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight flex items-center gap-3">
            {localizedDistrictName}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            {l('Localised district intelligence assessing training centre capacity, candidate absorption, and employer vacancy signals under MSDE jurisdiction.', 'प्रशिक्षण केंद्र क्षमता, उम्मीदवार अवशोषण और एमएसडीई क्षेत्राधिकार के तहत नियोक्ता रिक्ति संकेतों का आकलन करने वाला स्थानीय जिला खुफिया मंच।')}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/scenarios"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs"
          >
            <Sliders className="w-4 h-4" />
            <span>{l('Simulate District Scenarios', 'जिला परिदृश्य अनुकरण')}</span>
          </Link>
        </div>
      </div>

      {/* 5 Hero Diagnostic Cards (Section 23) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Demand Index */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {l('Demand Index', 'मांग सूचकांक')}
          </span>
          <div className="text-3xl font-extrabold text-[var(--text)] font-mono my-1">
            {d.demandIndex}
          </div>
          <span className="text-[11px] text-orange-500 font-semibold">
            {l('High Labour Demand', 'उच्च श्रम मांग')}
          </span>
        </div>

        {/* Card 2: Effective Supply */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {l('Effective Supply', 'प्रभावी आपूर्ति')}
          </span>
          <div className="text-3xl font-extrabold text-[var(--text)] font-mono my-1">
            {d.effectiveSupplyIndex}
          </div>
          <span className="text-[11px] text-[var(--text-faint)] font-semibold">
            {l('Staged Employable Pool', 'चरणबद्ध रोजगार योग्य पूल')}
          </span>
        </div>

        {/* Card 3: Gap Score */}
        <div className="p-4 rounded-2xl glass border border-[var(--severe)]/40 shadow-xs">
          <span className="text-[10px] font-bold text-[var(--severe)] uppercase tracking-wider block">
            {l('Gap Score', 'अंतर स्कोर')}
          </span>
          <div className="text-3xl font-extrabold text-[var(--severe)] font-mono my-1">
            {d.gapScore}
          </div>
          <span className="text-[11px] text-[var(--severe)] font-semibold">
            {l('Severe Shortage', 'गंभीर कमी')}
          </span>
        </div>

        {/* Card 4: 6M Shortage Probability */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {l('6M Shortage Prob', '६ माह कमी संभावना')}
          </span>
          <div className="text-3xl font-extrabold text-[var(--text)] font-mono my-1">
            {d.shortageProbability6M}%
          </div>
          <span className="text-[11px] text-[var(--severe)] font-semibold">
            {l('Critical Threshold', 'महत्वपूर्ण सीमा')}
          </span>
        </div>

        {/* Card 5: Training Capacity */}
        <div className="p-4 rounded-2xl glass border border-[var(--border)] shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider block">
            {l('Training Capacity', 'प्रशिक्षण क्षमता')}
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[var(--brand)] font-mono my-1">
            {d.totalTrainingSeats} {l('Seats', 'सीटें')}
          </div>
          <span className="text-[11px] text-[var(--text-faint)] font-semibold">
            {d.activeEmployers} {l('Active Employers', 'सक्रिय नियोक्ता')}
          </span>
        </div>
      </div>

      {/* Top Shortage vs Oversupplied Trades (Section 23) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Shortage Trades */}
        <GlassPanel
          title={l('Top Shortage Trades in District', 'जिले में शीर्ष कमी वाले व्यवसाय')}
          subtitle={l('Occupations with acute vacancy backlogs and insufficient training seat pipelines.', 'तीव्र रिक्ति बैकलॉग और अपर्याप्त प्रशिक्षण सीट पाइपलाइन वाले व्यवसाय।')}
        >
          <div className="space-y-3">
            {d.topShortageTrades.map((trade, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl glass-strong border border-[var(--severe)]/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[var(--severe)] text-white font-mono text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-[var(--text)] block">
                      {getLocalizedEntityName('occupations', trade, language, trade)}
                    </strong>
                    <span className="text-[10px] text-[var(--severe)] font-semibold">
                      {l('Deficit requiring urgent seat reallocation', 'तत्काल सीट पुनर्वितरण की आवश्यकता वाला घाटा')}
                    </span>
                  </div>
                </div>

                <Link
                  href="/scenarios"
                  className="px-2.5 py-1 text-[11px] font-bold liquid-control text-[var(--severe)] rounded-lg transition-all"
                >
                  {l('Simulate →', 'अनुकरण करें →')}
                </Link>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Top Oversupplied Trades */}
        <GlassPanel
          title={l('District Capacity Surplus Trades (Seats)', 'जिले में क्षमता अधिशेष व्यवसाय (सीटें)')}
          subtitle={l('Training capacity exceeds local baseline allocation.', 'स्थानीय औद्योगिक अवशोषण से अधिक प्रशिक्षण क्षमता।')}
        >
          <div className="space-y-3">
            {d.topOversuppliedTrades.map((trade, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl glass-strong border border-[var(--oversupply)]/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[var(--oversupply)] text-white font-mono text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-[var(--text)] block">
                      {getLocalizedEntityName('occupations', trade, language, trade)}
                    </strong>
                    <span className="text-[10px] text-[var(--oversupply)] font-semibold">
                      {l('Candidate placement rate falling below 45%', 'उम्मीदवार प्लेसमेंट दर ४५% से कम हो रही है')}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-[var(--oversupply)] glass px-2.5 py-1 rounded-lg border border-[var(--oversupply)]/20 font-mono">
                  {l('Donor Trade', 'दाता व्यवसाय')}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Recommended Government Interventions for this District (Section 24) */}
      <GlassPanel
        title={l(`Recommended Government Interventions for ${localizedDistrictName}`, `${localizedDistrictName} के लिए अनुशंसित सरकारी हस्तक्षेप`)}
        subtitle={l('Ranked policy actions ready for ministerial consideration.', 'मंत्रिस्तरीय विचार के लिए तैयार क्रमबद्ध नीतिगत कार्य।')}
      >
        <div className="space-y-3">
          {districtRecommendations.length > 0 ? (
            districtRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl glass-strong border border-[var(--border)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--brand)] text-white text-[10px] font-bold font-mono">
                      #{rec.rank}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--text)]">
                      {l(rec.title, rec.titleHi || rec.title)}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] max-w-2xl leading-relaxed">
                    {l(rec.reason, rec.reasonHi || rec.reason)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/scenarios"
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{l('Simulate', 'अनुकरण')}</span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-xs text-[var(--text-muted)] italic glass rounded-xl border border-[var(--border)]">
              {l('Recommendation #01 targets Gorakhpur, Uttar Pradesh. View recommendations page for all states.', 'अनुशंसा #01 गोरखपुर, उत्तर प्रदेश को लक्षित करती है। सभी राज्यों के लिए अनुशंसा पृष्ठ देखें।')}
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}
