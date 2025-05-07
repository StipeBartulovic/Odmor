'use client';

import { PlaneTakeoff } from 'lucide-react';
import { ThemeToggleButton } from './ThemeToggleButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';

const appTitleTranslations: Record<string, string> = {
  en: 'Stibar',
  it: 'Stibar', 
  de: 'Stibar',
  pl: 'Stibar',
  fr: 'Stibar',
  es: 'Stibar',
};

export function AppHeader() {
  const { selectedLanguage } = useLanguage();
  
  const currentTitle: ReactNode = appTitleTranslations[selectedLanguage] || appTitleTranslations.en;

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