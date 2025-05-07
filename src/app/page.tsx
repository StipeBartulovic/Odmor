'use client'; // Converted to client component to use LanguageContext

import { AppHeader } from '@/components/shared/AppHeader';
import { AiPromptInterface } from '@/components/sections/AiPromptInterface';
import { InteractiveMap } from '@/components/sections/InteractiveMap';
import { ActivitiesSection } from '@/components/sections/ActivitiesSection';
import { EventsSection } from '@/components/sections/EventsSection';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';

const pageTranslations = {
  tipsButton: {
    en: 'Local Tips & Info',
    it: 'Consigli e Info Locali',
    de: 'Lokale Tipps & Infos',
    pl: 'Lokalne Wskazówki i Informacje',
    fr: 'Conseils et Infos Locales',
    es: 'Consejos e Información Local',
  },
  footerRights: {
    en: 'All rights reserved.',
    it: 'Tutti i diritti riservati.',
    de: 'Alle Rechte vorbehalten.',
    pl: 'Wszelkie prawa zastrzeżone.',
    fr: 'Tous droits réservés.',
    es: 'Todos los derechos reservados.',
  }
};


export default function HomePage() {
  const { selectedLanguage } = useLanguage(); 

  const currentYear = new Date().getFullYear();
  
  const localizedTipsButtonText: ReactNode = pageTranslations.tipsButton[selectedLanguage] || pageTranslations.tipsButton.en;
  const localizedFooterText: ReactNode = pageTranslations.footerRights[selectedLanguage] || pageTranslations.footerRights.en;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12 md:space-y-16">
        <AiPromptInterface />
        <InteractiveMap />
        <ActivitiesSection />
        <EventsSection />

        <section className="py-8 md:py-12 text-center">
          <Link href="/tips" passHref>
            <Button size="lg" className="rounded-xl shadow-lg px-8 py-6 text-lg" variant="outline">
              <Lightbulb className="mr-3 h-6 w-6 text-accent" />
              {localizedTipsButtonText}
            </Button>
          </Link>
        </section>
      </main>
      <footer className="py-8 bg-muted text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Stibar. {localizedFooterText}
          </p>
        </div>
      </footer>
    </div>
  );
}