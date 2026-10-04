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
  alerts: EarlyWarningAlert[];
  acknowledgeAlert: (id: string) => void;
  recommendations: Recommendation[];
  approveRecommendation: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('gorakhpur');
  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [selectedOccupationNco, setSelectedOccupationNco] = useState<string>('7126.0101'); // Solar PV
  const [forecastHorizon, setForecastHorizon] = useState<ForecastHorizon>('6M');
  const [datasetMode, setDatasetMode] = useState<'sih' | 'synthetic'>('sih');
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeEvidence, setActiveEvidence] = useState<Recommendation | null>(null);
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(EARLY_WARNING_ALERTS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(RECOMMENDATIONS);

  const t = translations[language];

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
      alerts,
      acknowledgeAlert,
      recommendations,
      approveRecommendation
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
