'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/i18n';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { MatteAlertFeedback } from '@/components/ui/matte-alert-feedback';

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
  const { language, setLanguage, t } = useApp();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notices = (t as unknown as Record<string, Record<string, string>>)?.notices || {};

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
      <div className={`space-y-3 w-full ${className}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 w-full">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors cursor-pointer border text-left min-h-[40px] ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 font-semibold shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex flex-col min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs tracking-tight truncate">
                      {lang.nativeLabel}
                    </span>
                    {lang.isBeta && (
                      <span className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded font-semibold ${
                        isSelected
                          ? 'bg-white/20 text-white dark:text-slate-900'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}>
                        Beta
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] truncate ${isSelected ? 'text-white/80 dark:text-slate-900/80' : 'text-slate-400'}`}>
                    {lang.label}
                  </span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white dark:text-slate-900" />}
              </button>
            );
          })}
        </div>

        {/* Notice 4: Beta language preview alert */}
        {currentOption.isBeta && (
          <MatteAlertFeedback
            variant="info"
            bare={true}
            title={notices.betaLanguageTitle || 'Experimental Language Localization'}
            detail={notices.betaLanguageDetail || 'This language pack is currently in Beta. Terminology is undergoing linguistic verification.'}
            pill={notices.betaLanguagePill || 'Beta Preview'}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button — Locked static width so it never shifts across languages */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between gap-1.5 w-[112px] min-w-[112px] shrink-0 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer h-[34px] shadow-xs"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <Languages className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="font-semibold truncate text-center flex-1">{currentOption.nativeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Menu */}
      {open && (
        <div 
          className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} mt-1.5 w-64 max-h-80 overflow-y-auto overscroll-contain rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-lg p-1.5 z-50 animate-in fade-in duration-150 scrollbar-none`}
          role="listbox"
          tabIndex={-1}
        >
          <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
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
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs">
                        {lang.nativeLabel} <span className="text-[11px] font-normal opacity-70">({lang.label})</span>
                      </span>
                      {lang.isBeta && (
                        <span className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded font-semibold ${
                          isSelected
                            ? 'bg-white/20 text-white dark:text-slate-900'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        }`}>
                          Beta
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] truncate ${isSelected ? 'text-white/80 dark:text-slate-900/80' : 'text-slate-400'}`}>
                      {lang.region}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white dark:text-slate-900" />}
                </button>
              );
            })}
          </div>
          {currentOption.isBeta && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <MatteAlertFeedback
                variant="info"
                bare={true}
                title={notices.betaLanguageTitle || 'Experimental Language Localization'}
                detail={notices.betaLanguageDetail || 'This language pack is currently in Beta. Terminology is undergoing linguistic verification.'}
                pill={notices.betaLanguagePill || 'Beta Preview'}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
