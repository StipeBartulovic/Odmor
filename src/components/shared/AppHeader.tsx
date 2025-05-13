// src/components/shared/AppHeader.tsx
'use client';

import Link from 'next/link';
import { PlaneTakeoff, Lightbulb, Link as LinkIconLucide, Loader2 } from 'lucide-react';
import { ThemeToggleButton } from './ThemeToggleButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

const appTitleTranslations: Record<string, string> = {
  en: 'odmarAI',
  it: 'odmarAI', 
  de: 'odmarAI',
  pl: 'odmarAI',
  fr: 'odmarAI',
  es: 'odmarAI',
};

const headerLinkTranslations = {
  localTipsLink: {
    en: 'Local Tips & Info',
    it: 'Consigli e Info Locali',
    de: 'Lokale Tipps & Infos',
    pl: 'Lokalne Wskazówki',
    fr: 'Conseils Locaux',
    es: 'Consejos Locales',
  },
  usefulLinksLink: {
    en: 'Useful Links',
    it: 'Link Utili',
    de: 'Nützliche Links',
    pl: 'Przydatne Linki',
    fr: 'Liens Utiles',
    es: 'Enlaces Útiles',
  },
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
  
  const tAppTitle: ReactNode = isMounted 
    ? (appTitleTranslations[selectedLanguage] || appTitleTranslations.en)
    : appTitleTranslations.en;

  const t = (fieldKey: keyof typeof headerLinkTranslations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    return headerLinkTranslations[fieldKey]?.[langToUse] || headerLinkTranslations[fieldKey]?.['en'] || String(fieldKey);
  };

  if (!isMounted) {
    // Placeholder for SSR and initial client render to avoid hydration mismatch
    return (
      <header className="py-6 bg-background shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlaneTakeoff className="h-8 w-8 text-primary opacity-50" />
            <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-muted rounded-md animate-pulse hidden md:inline-flex"></div>
            <div className="h-10 w-28 bg-muted rounded-md animate-pulse hidden md:inline-flex"></div>
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div> {/* LanguageSwitcher placeholder */}
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div> {/* ThemeToggleButton placeholder */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="py-6 bg-background shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PlaneTakeoff className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            {tAppTitle}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/tips" passHref>
            <Button variant="ghost" size="sm" className="text-sm hidden md:inline-flex">
              <Lightbulb className="mr-2 h-4 w-4" /> {t('localTipsLink')}
            </Button>
          </Link>
          <Link href="/useful-links" passHref>
            <Button variant="ghost" size="sm" className="text-sm hidden md:inline-flex">
              <LinkIconLucide className="mr-2 h-4 w-4" /> {t('usefulLinksLink')}
            </Button>
          </Link>
          <LanguageSwitcher />
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}

