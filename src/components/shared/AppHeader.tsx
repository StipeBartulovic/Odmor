'use client';

import { PlaneTakeoff, Loader2 } from 'lucide-react';
import { ThemeToggleButton } from './ThemeToggleButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

const appTitleTranslations: Record<string, string> = {
  en: 'Stibar',
  it: 'Stibar', 
  de: 'Stibar',
  pl: 'Stibar',
  fr: 'Stibar',
  es: 'Stibar',
};

const loadingTranslations: Record<string, string> = {
  en: 'Loading header...',
  it: 'Caricamento testata...',
  de: 'Lade Kopfzeile...',
  pl: 'Ładowanie nagłówka...',
  fr: 'Chargement de l\'en-tête...',
  es: 'Cargando encabezado...',
};

export function AppHeader() {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const currentTitle: ReactNode = isMounted 
    ? (appTitleTranslations[selectedLanguage] || appTitleTranslations.en)
    : appTitleTranslations.en; // Default to EN for SSR or pre-mount

  if (!isMounted) {
    // Placeholder for SSR and initial client render to avoid hydration mismatch
    return (
      <header className="py-8 bg-background shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlaneTakeoff className="h-10 w-10 text-primary opacity-50" />
            <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-16 bg-muted rounded-full animate-pulse"></div>
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="py-8 bg-background shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PlaneTakeoff className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            {currentTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
