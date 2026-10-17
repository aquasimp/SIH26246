'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { Provenance } from '@/components/common/Provenance';
import { clsx } from 'clsx';
import { 
  Settings, 
  Shield, 
  Globe, 
  Sparkles, 
  Database, 
  CheckCircle2, 
  Sliders, 
  Cpu
} from 'lucide-react';
import { LanguageSelector } from '@/components/layout/LanguageSelector';

export default function SettingsPage() {
  const { demoMode, setDemoMode, language, setLanguage, t, l } = useApp();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Provenance type="official" note={l('System Administration & Environment', 'सिस्टम प्रशासन और वातावरण')} />
          <span className="telemetry-chip">
            {l('Runtime v1.0', 'रनटाइम v1.0')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
          {language === 'hi' ? (
            'सेटिंग्स और इंजन कॉन्फ़िगरेशन'
          ) : (
            <>
              Settings &amp; Engine <span className="title-serif-italic">Configuration</span>
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          {l('Configure deterministic evaluation runtime modes, offline demo constraints, language preferences, and algorithmic weighting thresholds.', 'नियतात्मक मूल्यांकन रनटाइम मोड, ऑफ़लाइन डेमो प्रतिबंध, भाषा प्राथमिकताएं और एल्गोरिदमिक भार सीमाएं कॉन्फ़िगर करें।')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Demo Mode (Section 50) */}
        <div className="p-6 rounded-2xl liquid-glass-card hud-corner-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {l('Offline Hackathon Demo Mode', 'ऑफ़लाइन हैकथॉन डेमो मोड')}
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {l('Deterministic Seeded Sandbox', 'नियतात्मक सैंडबॉक्स')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setDemoMode(!demoMode)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xl font-mono text-xs font-extrabold transition-all cursor-pointer',
                  demoMode ? 'bg-amber-500 text-white shadow-xs' : 'liquid-control text-slate-600 dark:text-slate-300'
                )}
              >
                {demoMode ? (l('ENABLED [ON]', 'सक्रिय [चालू]')) : (l('DISABLED', 'निष्क्रिय'))}
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {l('When enabled, KaushalYuva uses guaranteed offline deterministic datasets across Gorakhpur, Lucknow, Pune, and Bengaluru, ensuring 100% reproducible scenarios without external network API variance.', 'सक्षम होने पर, कौशलयुवा गोरखपुर, लखनऊ, पुणे और बेंगलुरु में गारंटीकृत ऑफ़लाइन नियतात्मक डेटासेट का उपयोग करता है, जिससे बाहरी नेटवर्क API भिन्नता के बिना 100% पुनरुत्पादनीय परिदृश्य सुनिश्चित होते हैं।')}
            </p>

            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{l('Deterministic reproducible results for SIH jury', 'SIH जूरी के लिए नियतात्मक पुनरुत्पादनीय परिणाम')}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{l("Visible 'Demo Dataset' watermark active", 'दृश्यमान डेमो डेटासेट वॉटरमार्क सक्रिय')}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{l('Zero external network latency dependency', 'शून्य बाहरी नेटवर्क लेटेंसी निर्भरता')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Language & Localization */}
        <div className="p-6 rounded-2xl liquid-glass-card hud-corner-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {l('Multilingual Language Localization (7 Languages)', 'बहुभाषी भाषा स्थानीयकरण (7 अनुसूचित भाषाएं)')}
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {l('EN, HI, MR, TA, TE, KN, BN Official Schemas', 'अंग्रेजी, हिन्दी, मराठी, தமிழ், తెలుగు, ಕನ್ನಡ, বাংলা')}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {l(
                'Switch complete system dictionary and administrative terminology across 7 scheduled Indian languages for ministerial planners, state skill directorates, and District Skill Committees.',
                'मंत्रालयीय योजनाकारों, राज्य निदेशालयों और ज़िला कौशल समितियों (DSCs) के लिए संपूर्ण सिस्टम शब्दकोश 7 अनुसूचित भारतीय भाषाओं में तुरंत बदलें।'
              )}
            </p>

            <LanguageSelector variant="pills" />
          </div>
        </div>

        {/* Card 3: Model Engine Weights */}
        <div className="p-6 rounded-2xl liquid-glass-card hud-corner-card md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {l('Model Hyperparameters & Staged Pipeline Factors', 'मॉडल हाइपरपैरामीटर और चरणबद्ध आपूर्ति कारक')}
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {l('Pipeline Weights: Staged Supply Conversion Formula', 'पाइपलाइन वेट: चरणबद्ध आपूर्ति रूपांतरण सूत्र')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl liquid-control">
              <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">
                {l('Seat Utilization', 'सीट उपयोग')}
              </span>
              <strong className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">92%</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                {l('Enrolled / Total Seats', 'नामांकित / कुल सीटें')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl liquid-control">
              <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">
                {l('Certification Rate', 'प्रमाणन दर')}
              </span>
              <strong className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">88%</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                {l('Assessed & Passed', 'मूल्यांकन और उत्तीर्ण')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl liquid-control">
              <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">
                {l('Labor Participation', 'श्रम भागीदारी')}
              </span>
              <strong className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">82%</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                {l('Active Job Seekers', 'सक्रिय नौकरी चाहने वाले')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl liquid-control">
              <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">
                {l('Employability Factor', 'रोजगार योग्यता कारक')}
              </span>
              <strong className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">78%</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                {l('Effective Employable', 'प्रभावी रोजगार योग्य')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
