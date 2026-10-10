'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  ForecastHorizon, 
  EarlyWarningAlert, 
  Recommendation 
} from './types';
import { Language, translations } from './i18n';
import { EARLY_WARNING_ALERTS, RECOMMENDATIONS } from './demoData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  selectedState: string;
  setSelectedState: (s: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (d: string) => void;
  selectedSector: string;
  setSelectedSector: (sec: string) => void;
  selectedOccupationNco: string;
  setSelectedOccupationNco: (nco: string) => void;
  forecastHorizon: ForecastHorizon;
  setForecastHorizon: (h: ForecastHorizon) => void;
  datasetMode: 'sih' | 'synthetic';
  setDatasetMode: (m: 'sih' | 'synthetic') => void;
  demoMode: boolean;
  setDemoMode: (m: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeEvidence: Recommendation | null;
  setActiveEvidence: (r: Recommendation | null) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  notificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  focusMode: boolean;
  setFocusMode: (val: boolean) => void;
  toggleFocusMode: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  alerts: EarlyWarningAlert[];
  acknowledgeAlert: (id: string) => void;
  recommendations: Recommendation[];
  approveRecommendation: (id: string) => void;
  isOfflineFixture: boolean;
  setIsOfflineFixture: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children, initialLanguage }: { children: ReactNode; initialLanguage?: Language }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (initialLanguage === 'en' || initialLanguage === 'hi') return initialLanguage;
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )kaushalyuva-lang=([^;]*)/);
      const cookieLang = match ? decodeURIComponent(match[1]) : null;
      if (cookieLang === 'en' || cookieLang === 'hi') return cookieLang;
      try {
        const local = localStorage.getItem('kaushalyuva-lang');
        if (local === 'en' || local === 'hi') return local;
      } catch {}
      const docLang = (typeof document !== 'undefined' ? document.documentElement.lang : null) as Language;
      if (docLang === 'en' || docLang === 'hi') return docLang;
    }
    return 'en';
  });
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('gorakhpur');
  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [selectedOccupationNco, setSelectedOccupationNco] = useState<string>('7126.0101'); // Solar PV Installer
  const [forecastHorizon, setForecastHorizon] = useState<ForecastHorizon>('6M');
  const [datasetMode, setDatasetMode] = useState<'sih' | 'synthetic'>('sih');
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeEvidence, setActiveEvidence] = useState<Recommendation | null>(null);
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(EARLY_WARNING_ALERTS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(RECOMMENDATIONS);
  const [isOfflineFixture, setIsOfflineFixture] = useState<boolean>(false);

  // One-time silent migration from kaushalpulse-* to kaushalyuva-* storage keys (§2)
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const keysToMigrate: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('kaushalpulse-')) {
            keysToMigrate.push(key);
          }
        }
        keysToMigrate.forEach(oldKey => {
          const newKey = oldKey.replace('kaushalpulse-', 'kaushalyuva-');
          const val = localStorage.getItem(oldKey);
          if (val !== null) {
            localStorage.setItem(newKey, val);
            localStorage.removeItem(oldKey);
          }
        });

        // Initialize language from storage or document lang
        const savedLang = (localStorage.getItem('kaushalyuva-lang') || 
                           document.documentElement.lang) as Language;
        if (savedLang === 'en' || savedLang === 'hi') {
          setLanguage(savedLang);
        }
      }
    } catch {
      // Storage access restricted in private browsing
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('kaushalyuva-lang', lang);
      document.cookie = `kaushalyuva-lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch {}
  };

  // Esc key exits Focus Mode
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode]);

  React.useEffect(() => {
    fetch('/api/overview')
      .then(res => {
        const src = res.headers.get('X-KaushalYuva-Source') || res.headers.get('X-KaushalPulse-Source');
        if (src === 'offline-fixture') {
          setIsOfflineFixture(true);
        } else {
          return res.json().then(data => {
            if (data?.is_offline_fixture) {
              setIsOfflineFixture(true);
            }
          });
        }
      })
      .catch(() => setIsOfflineFixture(true));
  }, []);

  const t = translations[language];

  const toggleFocusMode = () => setFocusMode(prev => !prev);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const approveRecommendation = (id: string) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t,
      selectedState,
      setSelectedState,
      selectedDistrict,
      setSelectedDistrict,
      selectedSector,
      setSelectedSector,
      selectedOccupationNco,
      setSelectedOccupationNco,
      forecastHorizon,
      setForecastHorizon,
      datasetMode,
      setDatasetMode,
      demoMode,
      setDemoMode,
      searchQuery,
      setSearchQuery,
      activeEvidence,
      setActiveEvidence,
      copilotOpen,
      setCopilotOpen,
      notificationOpen,
      setNotificationOpen,
      commandPaletteOpen,
      setCommandPaletteOpen,
      focusMode,
      setFocusMode,
      toggleFocusMode,
      mobileMenuOpen,
      setMobileMenuOpen,
      alerts,
      acknowledgeAlert,
      recommendations,
      approveRecommendation,
      isOfflineFixture,
      setIsOfflineFixture
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
