
'use client'; // Converted to client component to use LanguageContext

import { AppHeader } from '@/components/shared/AppHeader';
import { AiPromptInterface } from '@/components/sections/AiPromptInterface';
import { InteractiveMap } from '@/components/sections/InteractiveMap';
import { ActivitiesSection } from '@/components/sections/ActivitiesSection';
import { EventsSection } from '@/components/sections/EventsSection';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext'; // Import useLanguage
import type { ReactNode } from 'react';

// Placeholder for translations
const footerTexts: Record<string, string> = {
  en: 'All rights reserved.',
  it: 'Tutti i diritti riservati.',
  de: 'Alle Rechte vorbehalten.',
  pl: 'Wszelkie prawa zastrzeżone.',
  fr: 'Tous droits réservés.',
  es: 'Todos los derechos reservados.',
};


export default function HomePage() {
  const { selectedLanguage } = useLanguage(); // Use the language context

  const currentYear = new Date().getFullYear();
  const localizedFooterText: ReactNode = footerTexts[selectedLanguage] || footerTexts.en;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12 md:space-y-16">
        <AiPromptInterface />
        <InteractiveMap />
        <ActivitiesSection />
        <EventsSection />

        {/* New Tips & Tricks Button Section */}
        <section className="py-8 md:py-12 text-center">
          <Link href="/tips" passHref>
            <Button size="lg" className="rounded-xl shadow-lg px-8 py-6 text-lg" variant="outline">
              <Lightbulb className="mr-3 h-6 w-6 text-accent" />
              Local Tips & Info
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
