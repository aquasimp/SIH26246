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
  alerts: EarlyWarningAlert[];
  acknowledgeAlert: (id: string) => void;
  recommendations: Recommendation[];
  approveRecommendation: (id: string) => void;
  isOfflineFixture: boolean;
  setIsOfflineFixture: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
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
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(EARLY_WARNING_ALERTS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(RECOMMENDATIONS);
  const [isOfflineFixture, setIsOfflineFixture] = useState<boolean>(false);

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
        const src = res.headers.get('X-KaushalPulse-Source');
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
      setLanguage,
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
