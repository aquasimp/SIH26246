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
  Maximize2
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFocusMode?: () => void;
}

export function CommandPalette({ open, onOpenChange, onToggleFocusMode }: CommandPaletteProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { setSelectedDistrict, setSelectedOccupationNco } = useApp();

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
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-2xl overlay rounded-2xl border border-[var(--border-strong)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="National Intelligence Command Palette" className="w-full">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
            <Search className="w-4 h-4 text-[var(--text-faint)]" />
            <Command.Input
              placeholder="Search intelligence, districts, NCO codes, policy presets... (Esc to close)"
              className="w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-hidden"
              autoFocus
            />
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--text-faint)] bg-[var(--glass)] border border-[var(--border)] rounded-md">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-96 overflow-y-auto p-2 text-xs space-y-1">
            <Command.Empty className="p-6 text-center text-sm text-[var(--text-muted)]">
              No matching intelligence, districts, or actions found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading={<span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] block">Hero Presets & Actions</span>}>
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
                  <strong className="block text-[var(--text)]">Load Recommendation #01 Preset</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">97 seats • ₹18.31L cost • 6.2% alone • 15.6% combo closure • donor score 52</span>
                </div>
                <kbd className="text-[10px] font-mono text-[var(--text-faint)] bg-[var(--glass)] px-1.5 py-0.5 rounded border border-[var(--border)]">Preset</kbd>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)] transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                <div className="flex-1">
                  <strong className="block text-[var(--text)]">Toggle Color Theme</strong>
                  <span className="text-[11px] text-[var(--text-muted)]">Switch between Graphite Dark and Ivory Light</span>
                </div>
              </Command.Item>

              {onToggleFocusMode && (
                <Command.Item
                  onSelect={() => handleSelect(onToggleFocusMode)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)] transition-colors"
                >
                  <Maximize2 className="w-4 h-4 text-[var(--brand)]" />
                  <div className="flex-1">
                    <strong className="block text-[var(--text)]">Toggle Focus Mode</strong>
                    <span className="text-[11px] text-[var(--text-muted)]">Maximize primary analytical surface for demonstration</span>
                  </div>
                </Command.Item>
              )}
            </Command.Group>

            {/* Navigation Routes */}
            <Command.Group heading={<span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] block mt-2">Intelligence Routes</span>}>
              <Command.Item
                onSelect={() => handleSelect(() => router.push('/overview'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Compass className="w-4 h-4 text-[var(--brand)]" />
                <span>Overview Dashboard</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/forecasts'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <FileText className="w-4 h-4 text-[var(--brand)]" />
                <span>Demand Forecasts (3M / 6M / 12M Out-of-Sample)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/gaps'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <ShieldAlert className="w-4 h-4 text-[var(--severe)]" />
                <span>Skill Gaps & Structural Shortages</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/recommendations'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Sparkles className="w-4 h-4 text-[var(--brand-secondary)]" />
                <span>Government Priority Recommendations</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/scenarios'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>Scenario Studio (Interactive Policy Sandbox)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/districts'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <MapPin className="w-4 h-4 text-[var(--brand)]" />
                <span>District Intelligence Explorer</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => router.push('/occupations'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Briefcase className="w-4 h-4 text-[var(--brand)]" />
                <span>Occupations Directory & NCO Dossiers</span>
              </Command.Item>
            </Command.Group>

            {/* Districts Quick Jump */}
            <Command.Group heading={<span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] block mt-2">Districts</span>}>
              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedDistrict('gorakhpur');
                  router.push('/districts/gorakhpur');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--severe)]" />
                <span>Gorakhpur, Uttar Pradesh (Severe Shortage • Gap 94)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedDistrict('pune');
                  router.push('/districts/pune');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--brand)]" />
                <span>Pune, Maharashtra (Automotive & EV Hub)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedDistrict('bengaluru_urban');
                  router.push('/districts/bengaluru_urban');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--brand)]" />
                <span>Bengaluru Urban, Karnataka (AI & Electronics)</span>
              </Command.Item>
            </Command.Group>

            {/* Occupations Quick Jump */}
            <Command.Group heading={<span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] block mt-2">Key Occupations (NCO)</span>}>
              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedOccupationNco('7126.0101');
                  router.push('/occupations/7126.0101');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Briefcase className="w-3.5 h-3.5 text-[var(--severe)]" />
                <span>Solar PV Installer (NCO 7126.0101 • Severe Shortage)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedOccupationNco('5223.0101');
                  router.push('/occupations/5223.0101');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Briefcase className="w-3.5 h-3.5 text-[var(--balanced)]" />
                <span>Retail Sales Associate (NCO 5223.0101 • Donor Trade)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => {
                  setSelectedOccupationNco('7233.0102');
                  router.push('/occupations/7233.0102');
                })}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--glass-strong)] cursor-pointer aria-selected:bg-[var(--glass-strong)]"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>EV Service Technician (NCO 7233.0102)</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
