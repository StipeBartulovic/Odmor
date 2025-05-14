// src/components/shared/AppHeader.tsx
'use client';

import Link from 'next/link';
import { Lightbulb, Link as LinkIconLucide, MessageSquarePlus, Menu, Film } from 'lucide-react'; // Added Menu and Film
import { AppLogo } from './AppLogo';
import { ThemeToggleButton } from './ThemeToggleButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added Dropdown components
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
    en: 'Local Tips', // Simplified for brevity in menu
    it: 'Consigli Locali',
    de: 'Lokale Tipps',
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
  localHighlightsLink: { // Added translation for Local Highlights
    en: 'Local Highlights',
    it: 'Attrazioni Locali',
    de: 'Lokale Highlights',
    pl: 'Lokalne Atrakcje',
    fr: 'Points Forts', // Shorter for menu
    es: 'Destacados', // Shorter for menu
  },
  tellUsMoreLink: {
    en: 'Tell us more',
    it: 'Dicci di più',
    de: 'Erzähl uns mehr',
    pl: 'Powiedz więcej', // Shorter
    fr: 'Dites-plus', // Shorter
    es: 'Cuéntanos más',
  }
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
            <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            {/* Placeholders for desktop links now effectively hidden on mobile by design */}
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div> {/* LanguageSwitcher placeholder */}
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div> {/* ThemeToggleButton placeholder */}
            <div className="h-10 w-10 bg-muted rounded-md animate-pulse md:hidden"></div> {/* Mobile Menu placeholder */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="py-6 bg-background shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <AppLogo className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            {tAppTitle}
          </h1>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Links */}
          <Link href="/tips" passHref>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm hidden md:inline-flex items-center">
              <Lightbulb className="mr-1 sm:mr-2 h-4 w-4" /> {t('localTipsLink')}
            </Button>
          </Link>
          <Link href="/useful-links" passHref>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm hidden md:inline-flex items-center">
              <LinkIconLucide className="mr-1 sm:mr-2 h-4 w-4" /> {t('usefulLinksLink')}
            </Button>
          </Link>
          <Link href="/local-highlights" passHref>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm hidden md:inline-flex items-center">
              <Film className="mr-1 sm:mr-2 h-4 w-4" /> {t('localHighlightsLink')}
            </Button>
          </Link>
          <Link href="/feedback" passHref>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm hidden md:inline-flex items-center"> {/* Changed from variant="link" and made consistent */}
               <MessageSquarePlus className="mr-1 sm:mr-2 h-4 w-4" /> {t('tellUsMoreLink')}
            </Button>
          </Link>

          {/* Controls */}
          <LanguageSwitcher />
          <ThemeToggleButton />

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/tips" className="flex items-center w-full px-2 py-1.5 text-sm">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    <span>{t('localTipsLink')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/useful-links" className="flex items-center w-full px-2 py-1.5 text-sm">
                    <LinkIconLucide className="mr-2 h-4 w-4" />
                    <span>{t('usefulLinksLink')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/local-highlights" className="flex items-center w-full px-2 py-1.5 text-sm">
                    <Film className="mr-2 h-4 w-4" />
                    <span>{t('localHighlightsLink')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/feedback" className="flex items-center w-full px-2 py-1.5 text-sm">
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                    <span>{t('tellUsMoreLink')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
