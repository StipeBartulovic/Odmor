// src/app/page.tsx
'use client'; 

import { AppHeader } from '@/components/shared/AppHeader';
import { AiPromptInterface } from '@/components/sections/AiPromptInterface';
import { InteractiveMap } from '@/components/sections/InteractiveMap';
import { ActivitiesSection } from '@/components/sections/ActivitiesSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { Lightbulb, Link as LinkIconLucide, Loader2, Film } from 'lucide-react'; // Renamed Link to LinkIconLucide, Added Film
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { HologramButton } from '@/components/shared/HologramButton';
import { PasswordOverlay } from '@/components/shared/PasswordOverlay';

const pageTranslations = {
  tipsButton: {
    en: 'Local Tips & Info',
    it: 'Consigli e Info Locali',
    de: 'Lokale Tipps & Infos',
    pl: 'Lokalne Wskazówki i Informacje',
    fr: 'Conseils et Infos Locales',
    es: 'Consejos e Información Local',
  },
  usefulLinksButton: {
    en: 'Useful Tourist Links',
    it: 'Link Utili per Turisti',
    de: 'Nützliche Touristenlinks',
    pl: 'Przydatne Linki Turystyczne',
    fr: 'Liens Touristiques Utiles',
    es: 'Enlaces Turísticos Útiles',
  },
  localHighlightsButton: { // New translation
    en: 'Local Highlights',
    it: 'Attrazioni Locali',
    de: 'Lokale Highlights',
    pl: 'Lokalne Atrakcje',
    fr: 'Points Forts Locaux',
    es: 'Destacados Locales',
  },
  footerRights: {
    en: 'All rights reserved.',
    it: 'Tutti i diritti riservati.',
    de: 'Alle Rechte vorbehalten.',
    pl: 'Wszelkie prawa zastrzeżone.',
    fr: 'Tous droits réservés.',
    es: 'Todos los derechos reservados.',
  },
  loading: {
    en: 'Loading content...',
    it: 'Caricamento dei contenuti...',
    de: 'Inhalt wird geladen...',
    pl: 'Ładowanie treści...',
    fr: 'Chargement du contenu...',
    es: 'Cargando contenido...',
  }
};

const AUTH_KEY = 'odmarai_authenticated';

export default function HomePage() {
  const { selectedLanguage } = useLanguage(); 
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());
    
    const storedAuth = localStorage.getItem(AUTH_KEY);
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleAuthentication = (password: string): boolean => {
    if (password === '1234') {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true'); 
      return true;
    }
    return false;
  };
  
  const t = (fieldKey: keyof typeof pageTranslations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    const translation = pageTranslations[fieldKey]?.[langToUse] || pageTranslations[fieldKey]?.['en'];
    return typeof translation === 'string' ? translation : String(fieldKey);
  };
  
  if (!isMounted || currentYear === null) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-xl text-muted-foreground mt-4">{t('loading')}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordOverlay onAuthenticate={handleAuthentication} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12 md:space-y-16">
        <AiPromptInterface />
        <InteractiveMap />
        <ActivitiesSection />
        <EventsSection />

        <section className="py-8 md:py-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center flex-wrap gap-6 sm:gap-8">
            <HologramButton
              href="/tips"
              text={t('tipsButton')}
              icon={<Lightbulb />}
              ariaLabel={t('tipsButton')}
            />
            <HologramButton
              href="/useful-links"
              text={t('usefulLinksButton')}
              icon={<LinkIconLucide />} 
              ariaLabel={t('usefulLinksButton')}
            />
            <HologramButton
              href="/local-highlights" // New link
              text={t('localHighlightsButton')} // New translation
              icon={<Film />} // New icon
              ariaLabel={t('localHighlightsButton')}
            />
          </div>
        </section>
      </main>
      <footer className="py-8 bg-muted text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} odmarAI. {t('footerRights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
