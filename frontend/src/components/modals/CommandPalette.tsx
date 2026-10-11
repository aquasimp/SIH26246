'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useApp } from '@/lib/store';
import { Command } from 'cmdk';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Briefcase, 
  Compass, 
  Sliders, 
  ShieldAlert, 
  Database, 
  Settings, 
  FileText, 
  Moon, 
  Sun,
  Maximize2,
  Home,
  Languages,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';
import { SUPPORTED_LANGUAGES, type Language } from '@/lib/i18n';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFocusMode?: () => void;
}

export function CommandPalette({ open, onOpenChange, onToggleFocusMode }: CommandPaletteProps) {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { setSelectedDistrict, setSelectedOccupationNco, language, setLanguage, t, l} = useApp();

  // Listen for Ctrl+K / Cmd+K and Escape
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleSelect = (callback: () => void) => {
    callback();
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={l("Command Palette", "कमांड पैलेट")}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-2xl overlay rounded-2xl border border-[var(--border-strong)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label={l("National Intelligence Command Palette", "राष्ट्रीय इंटेलिजेंस कमांड पैलेट")} className="w-full">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
            <Search className="w-4 h-4 text-[var(--text-faint)]" />
            <Command.Input
              placeholder={l("Search intelligence, districts, NCO codes, policy presets... (Esc to close)", "इंटेलिजेंस, ज़िले, NCO कोड, नीतियां खोजें... (बंद करने के लिए Esc)")}
              className="w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-hidden"
              autoFocus
            />
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--text-faint)] bg-[var(--glass)] border border-[var(--border)] rounded-md">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2 text-xs space-y-1">
            <Command.Empty className="p-6 text-center text-sm text-[var(--text-muted)]">
              {l("No matching intelligence, districts, or actions found.", "कोई मेल खाता परिणाम नहीं मिला।")}
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading={<span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] block">{l("Quick Actions & Presets", "त्वरित कार्य व प्रीसेट")}</span>}>
              {/* Go to Home */}
              <Command.Item
                onSelect={() => handleSelect(() => router.push('/'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)] transition-colors"
              >
                <Home className="w-4 h-4 text-[var(--brand)]" />
                <div className="flex-1">
                  <strong className="block text-[var(--text)]">{l("Go to KaushalYuva Home", "कौशलयुवा मुख्य पृष्ठ पर जाएं")}</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">{l("MVP landing page & typographic ledger", "एमवीपी लैंडिंग पृष्ठ व विश्लेषणात्मक लेजर")}</span>
                </div>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedDistrict('gorakhpur');
                  setSelectedOccupationNco('7126.0101');
                  router.push('/scenarios?preset=rec01');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div className="flex-1">
                  <strong className="block text-[var(--text)]">{l("Load Recommendation #01 Preset", "अनुशंसा #01 प्रीसेट लोड करें")}</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">{l("97 seats • ₹18.31L cost • 6.2% alone • 15.6% combo closure • donor score 52", "97 सीटें • ₹18.31 लाख लागत • 6.2% एकल • 15.6% संयुक्त भरपाई • डोनर स्कोर 52")}</span>
                </div>
                <kbd className="text-[10px] font-mono text-[var(--text-faint)] bg-[var(--glass)] px-1.5 py-0.5 rounded border border-[var(--border)]">Preset</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)] transition-colors"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                <div className="flex-1">
                  <strong className="block text-[var(--text)]">{l("Toggle Color Theme", "कलर थीम बदलें")}</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">{l("Switch between Graphite Dark and Ivory Light", "डार्क और लाइट थीम के बीच स्विच करें")}</span>
                </div>
              </Command.Item>

              {onToggleFocusMode && (
                <Command.Item
                  onSelect={() => handleSelect(onToggleFocusMode)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)] transition-colors"
                >
                  <Maximize2 className="w-4 h-4 text-[var(--brand)]" />
                  <div className="flex-1">
                    <strong className="block text-[var(--text)]">{l("Toggle Focus Mode", "फोकस मोड टॉगल करें")}</strong>
                    <span className="text-[11px] text-[var(--text-muted)]">{l("Maximize primary analytical surface for demonstration", "विश्लेषणात्मक कार्यक्षेत्र को अधिकतम करें")}</span>
                  </div>
                </Command.Item>
              )}
            </Command.Group>

            {/* Languages */}
            <Command.Group heading={<span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] block mt-2">{l("Languages & Localization", "भाषा एवं स्थानीयकरण")}</span>}>
              {SUPPORTED_LANGUAGES.map((langItem) => {
                const isCurrent = language === langItem.code;
                return (
                  <Command.Item
                    key={langItem.code}
                    value={`language ${langItem.label} ${langItem.nativeLabel} ${langItem.region} ${langItem.code}`}
                    onSelect={() => handleSelect(() => setLanguage(langItem.code))}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)] transition-colors"
                  >
                    <Languages className={clsx("w-4 h-4", isCurrent ? "text-[var(--brand)]" : "text-[var(--text-faint)]")} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="block text-[var(--text)]">{langItem.nativeLabel}</strong>
                        <span className="text-[11px] text-[var(--text-muted)]">({langItem.label})</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-faint)]">{langItem.region}</span>
                    </div>
                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-full border border-[var(--brand)]/20">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <kbd className="text-[10px] font-mono text-[var(--text-faint)] bg-[var(--glass)] px-1.5 py-0.5 rounded border border-[var(--border)]">{langItem.code.toUpperCase()}</kbd>
                    )}
                  </Command.Item>
                );
              })}
            </Command.Group>

            {/* Navigation Routes */}
            <Command.Group heading={<span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] block mt-2">{l("Intelligence Routes", "इंटेलिजेंस मार्ग")}</span>}>
              <Command.Item
                onSelect={() => handleSelect(() => router.push('/overview'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Compass className="w-4 h-4 text-[var(--brand)]" />
                <span>{t.nav.overview}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/forecasts'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <FileText className="w-4 h-4 text-[var(--brand)]" />
                <span>{l("Demand Forecasts (3M / 6M / 12M Out-of-Sample)", "मांग पूर्वानुमान (3M / 6M / 12M आउट-ऑफ़-सैंपल)")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/gaps'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <ShieldAlert className="w-4 h-4 text-[var(--severe)]" />
                <span>{l("Skill Gaps & Structural Shortages", "कौशल अंतराल व संरचनात्मक कमियां")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/recommendations'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Sparkles className="w-4 h-4 text-[var(--brand-secondary)]" />
                <span>{l("Government Priority Recommendations", "सरकारी प्राथमिकता अनुशंसाएं")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/scenarios'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>{l("Scenario Studio (Interactive Policy Sandbox)", "परिदृश्य स्टूडियो (इंटरैक्टिव नीति सैंडबॉक्स)")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/districts'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <MapPin className="w-4 h-4 text-[var(--brand)]" />
                <span>{l("District Intelligence Explorer", "ज़िला इंटेलिजेंस एक्सप्लोरर")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/occupations'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Briefcase className="w-4 h-4 text-[var(--brand)]" />
                <span>{l("Occupations Directory & NCO Dossiers", "व्यवसाय निर्देशिका व NCO डोजियर")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/methodology'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <FileText className="w-4 h-4 text-[var(--brand)]" />
                <span>{l("Model Assumptions & Methodology Specification", "मॉडल धारणाएँ एवं कार्यप्रणाली विनिर्देश")}</span>
              </Command.Item>
            </Command.Group>

            {/* Districts Quick Jump */}
            <Command.Group heading={<span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] block mt-2">{l("Districts", "प्रमुख ज़िले")}</span>}>
              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedDistrict('gorakhpur');
                  router.push('/districts/gorakhpur');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--severe)]" />
                <span>{l("Gorakhpur, Uttar Pradesh (Severe Shortage • Gap 94)", "गोरखपुर, उत्तर प्रदेश (गंभीर कमी • गैप 94)")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedDistrict('pune');
                  router.push('/districts/pune');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--brand)]" />
                <span>{l("Pune, Maharashtra (Automotive & EV Hub)", "पुणे, महाराष्ट्र (ऑटोमोटिव व ईवी हब)")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedDistrict('bengaluru_urban');
                  router.push('/districts/bengaluru_urban');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--brand)]" />
                <span>{l("Bengaluru Urban, Karnataka (AI & Electronics)", "बेंगलुरु अर्बन, कर्नाटक (एआई व इलेक्ट्रॉनिक्स)")}</span>
              </Command.Item>
            </Command.Group>

            {/* Occupations Quick Jump */}
            <Command.Group heading={<span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] block mt-2">{l("Key Occupations (NCO)", "प्रमुख व्यवसाय (NCO)")}</span>}>
              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedOccupationNco('7126.0101');
                  router.push('/occupations/7126.0101');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Briefcase className="w-3.5 h-3.5 text-[var(--severe)]" />
                <span>{l("Solar PV Installer (NCO 7126.0101 • Severe Shortage)", "सोलर पीवी इंस्टॉलर (NCO 7126.0101 • गंभीर कमी)")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedOccupationNco('5223.0101');
                  router.push('/occupations/5223.0101');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Briefcase className="w-3.5 h-3.5 text-[var(--balanced)]" />
                <span>{l("Retail Sales Associate (NCO 5223.0101 • Donor Trade)", "रिटेल सेल्स एसोसिएट (NCO 5223.0101 • डोनर ट्रेड)")}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedOccupationNco('7233.0102');
                  router.push('/occupations/7233.0102');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>{l("EV Service Technician (NCO 7233.0102)", "ईवी सर्विस तकनीशियन (NCO 7233.0102)")}</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
