
'use client';

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';

export interface Language {
  code: string;
  name: string;
  displayName: string; // For display in the dropdown
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', displayName: 'EN' },
  { code: 'it', name: 'Italiano', displayName: 'IT' },
  { code: 'de', name: 'Deutsch', displayName: 'DE' },
  { code: 'pl', name: 'Polski', displayName: 'PL' },
  { code: 'fr', name: 'Français', displayName: 'FR' },
  { code: 'es', name: 'Español', displayName: 'ES' },
];

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: Dispatch<SetStateAction<string>>;
  currentLanguageConfig: Language;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(supportedLanguages[0].code); // Default to English

  const currentLanguageConfig = useMemo(() => {
    return supportedLanguages.find(lang => lang.code === selectedLanguage) || supportedLanguages[0];
  }, [selectedLanguage]);

  const contextValue = useMemo(() => ({
    selectedLanguage,
    setSelectedLanguage,
    currentLanguageConfig
  }), [selectedLanguage, setSelectedLanguage, currentLanguageConfig]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
