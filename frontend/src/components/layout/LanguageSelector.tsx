'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { SUPPORTED_LANGUAGES, Language, LanguageOption } from '@/lib/i18n';
import { Languages, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'pills';
  align?: 'left' | 'right';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'dropdown',
  align = 'right',
  className = ''
}) => {
  const { language, setLanguage } = useApp();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const currentOption = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setOpen(false);
  };

  if (variant === 'pills') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-1.5 w-full ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border text-left min-h-[44px] ${
                isSelected
                  ? 'bg-[var(--brand)] text-white dark:text-slate-950 border-[var(--brand)] shadow-sm font-bold'
                  : 'bg-[var(--surface-solid)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--surface-muted)] shadow-2xs'
              }`}
            >
              <div className="flex flex-col min-w-0 pr-1">
                <span className="font-extrabold text-xs tracking-tight truncate">
                  {lang.nativeLabel}
                </span>
                <span className={`text-[10px] truncate ${isSelected ? 'text-white/80 dark:text-slate-900/80' : 'text-[var(--text-faint)]'}`}>
                  {lang.label}
                </span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white dark:text-slate-950" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="glass-strong inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--border)] hover:border-[#00c2cb]/50 text-xs font-bold text-[var(--text)] transition-colors cursor-pointer min-h-[36px]"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <Languages className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
        <span className="font-extrabold">{currentOption.nativeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-faint)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Menu */}
      {open && (
        <div 
          className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-1.5 w-64 max-h-80 overflow-y-auto overscroll-contain rounded-2xl bg-[var(--surface-solid)] text-[var(--text)] border border-[var(--border)] shadow-2xl ring-1 ring-black/5 dark:ring-white/10 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 scrollbar-none`}
          role="listbox"
          tabIndex={-1}
        >
          <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-faint)] border-b border-[var(--border)] mb-1">
            Official Indian Languages (7)
          </div>
          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[var(--brand)] text-white dark:text-slate-950 shadow-xs font-bold'
                      : 'text-[var(--text)] hover:bg-[var(--surface-muted)]'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-extrabold text-xs">
                      {lang.nativeLabel} <span className="text-[11px] font-normal opacity-75">({lang.label})</span>
                    </span>
                    <span className={`text-[10px] truncate ${isSelected ? 'text-white/80 dark:text-slate-900/80' : 'text-[var(--text-faint)]'}`}>
                      {lang.region}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-white dark:text-slate-950" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
