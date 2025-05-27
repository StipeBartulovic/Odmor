// src/components/shared/AppHeader.tsx
'use client';

import Link from 'next/link';
import { Lightbulb, Link as LinkIconLucide, MessageSquarePlus, Menu, Film } from 'lucide-react';
// Removed AppLogo import
import { ThemeToggleButton } from './ThemeToggleButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

// Removed appTitleTranslations

const headerLinkTranslations = {
  localTipsLink: {
    en: 'Local Tips',
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
  localHighlightsLink: {
    en: 'Local Highlights',
    it: 'Attrazioni Locali',
    de: 'Lokale Highlights',
    pl: 'Lokalne Atrakcje',
    fr: 'Points Forts',
    es: 'Destacados',
  },
  tellUsMoreLink: {
    en: 'Tell us more',
    it: 'Dicci di più',
    de: 'Erzähl uns mehr',
    pl: 'Powiedz więcej',
    fr: 'Dites-plus',
    es: 'Cuéntanos más',
  }
};

export function AppHeader() {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
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
            <div className="h-10 w-auto bg-muted rounded animate-pulse" style={{width: "120px"}}></div> {/* Adjusted placeholder width */}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
            <div className="h-10 w-10 bg-muted rounded-md animate-pulse md:hidden"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="py-6 bg-background shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          {/* Replaced AppLogo and text with img tag */}
          <img 
            src="https://i.imgur.com/3bEOM2h.png" 
            alt="odmarAI Logo" 
            className="h-10 w-auto" // Adjust height as needed, width will scale
            style={{ maxHeight: '40px' }} // Max height to ensure it fits well
          />
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
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm hidden md:inline-flex items-center">
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
