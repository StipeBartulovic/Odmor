// src/app/useful-links/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usefulLinksData, type UsefulLinkCategory, type UsefulLinkItem } from '@/data/usefulLinks';
import { 
  ArrowLeft, ExternalLink, Loader2, Mountain, CloudSun, Car, Landmark, Compass, BedDouble, ShieldAlert, Globe2,
  Map as MapIcon, Trees, Route, Thermometer, CloudDrizzle, Wind, TrafficCone, Camera, Ship, Bus, Train, 
  Globe, Building, BookOpen, Navigation, Bike, Footprints, Tent, Hotel, Home, PhoneForwarded, AlertTriangle,
  Languages, Ticket as TicketIcon, Link as LinkIconLucide, RadioTower
} from 'lucide-react'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';

const pageTranslations = {
  title: {
    en: 'Useful Tourist Links for Croatia',
    it: 'Link Turistici Utili per la Croazia',
    de: 'Nützliche Touristenlinks für Kroatien',
    pl: 'Przydatne Linki Turystyczne dla Chorwacji',
    fr: 'Liens Touristiques Utiles pour la Croatie',
    es: 'Enlaces Turísticos Útiles para Croacia',
  },
  subtitle: {
    en: 'Curated resources to help you plan and enjoy your trip to Croatia.',
    it: 'Risorse selezionate per aiutarti a pianificare e goderti il tuo viaggio in Croazia.',
    de: 'Zusammengestellte Ressourcen, die Ihnen bei der Planung und dem Genuss Ihrer Reise nach Kroatien helfen.',
    pl: 'Wyselekcjonowane zasoby, które pomogą Ci zaplanować i cieszyć się podróżą do Chorwacji.',
    fr: 'Ressources organisées pour vous aider à planifier et à profiter de votre voyage en Croatie.',
    es: 'Recursos seleccionados para ayudarte a planificar y disfrutar tu viaje a Croacia.'
  },
  goBackButton: {
    en: 'Go Back',
    it: 'Torna Indietro',
    de: 'Zurück',
    pl: 'Wróć',
    fr: 'Retour',
    es: 'Volver',
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
    en: 'Loading links...',
    it: 'Caricamento link...',
    de: 'Lade Links...',
    pl: 'Ładowanie linków...',
    fr: 'Chargement des liens...',
    es: 'Cargando enlaces...',
  },
  liveNewsPrefix: {
    en: 'Live',
    it: 'Dal Vivo',
    de: 'Live',
    pl: 'Na Żywo',
    fr: 'En Direct',
    es: 'En Vivo',
  },
  liveNewsSuffix: {
    en: 'News',
    it: 'Notizie',
    de: 'Nachrichten',
    pl: 'Wiadomości',
    fr: 'Actualités',
    es: 'Noticias',
  },
  newsItem1: {
    en: 'Traffic accident on Poljička street, use detour.',
    it: 'Incidente stradale in via Poljička, utilizzare la deviazione.',
    de: 'Verkehrsunfall auf der Poljička-Straße, Umleitung benutzen.',
    pl: 'Wypadek drogowy na ulicy Poljičkiej, korzystaj z objazdu.',
    fr: 'Accident de la route rue Poljička, utilisez la déviation.',
    es: 'Accidente de tráfico en la calle Poljička, utilice el desvío.',
  },
  newsItem2: {
    en: 'Žnjan beach opens in 15 days.',
    it: 'La spiaggia di Žnjan apre tra 15 giorni.',
    de: 'Der Strand Žnjan öffnet in 15 Tagen.',
    pl: 'Plaża Žnjan zostanie otwarta za 15 dni.',
    fr: 'La plage de Žnjan ouvre dans 15 jours.',
    es: 'La playa de Žnjan abre en 15 días.',
  },
  newsItem3: {
    en: 'On Sunday, only Kaufland will be open among large supermarkets.',
    it: 'Domenica, tra i grandi supermercati, sarà aperto solo Kaufland.',
    de: 'Am Sonntag hat von den großen Supermärkten nur Kaufland geöffnet.',
    pl: 'W niedzielę spośród dużych supermarketów otwarty będzie tylko Kaufland.',
    fr: 'Dimanche, seul Kaufland sera ouvert parmi les grands supermarchés.',
    es: 'El domingo, solo Kaufland estará abierto entre los grandes supermercados.',
  },
};

const getLinkIconElement = (iconName?: string): React.ElementType => {
  if (!iconName) return Globe2; 
  const iconMap: { [key: string]: React.ElementType } = {
    Mountain,
    Map: MapIcon, // Alias for Map to avoid conflict with JS Map
    Trees,
    Route,
    CloudSun,
    Thermometer,
    CloudDrizzle,
    Wind,
    Car,
    TrafficCone,
    Camera,
    Ship, 
    Bus,
    Train,
    Landmark,
    Globe,
    Building,
    BookOpen,
    Compass,
    Navigation,
    Bike,
    Footprints,
    BedDouble,
    Tent,
    Hotel,
    Home,
    ShieldAlert,
    PhoneForwarded,
    AlertTriangle,
    Globe2,
    Languages,
    Ticket: TicketIcon,
    RadioTower,
  };
  return iconMap[iconName] || Globe2;
};


export default function UsefulLinksPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  const t = (fieldKey: keyof typeof pageTranslations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    const translation = pageTranslations[fieldKey]?.[langToUse] || pageTranslations[fieldKey]?.['en'];
    return typeof translation === 'string' ? translation : String(fieldKey);
  };
  
  const getLocalizedText = (textObj: Record<string, string> | undefined): string => {
    if (!textObj) return '';
    const langToUse = isMounted ? selectedLanguage : 'en';
    return textObj[langToUse] || textObj.en || '';
  };

  const PageFooter = () => (
    <footer className="py-8 bg-muted text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} odmarAI. {t('footerRights')}
        </p>
      </div>
    </footer>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      {(!isMounted || currentYear === null) ? (
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <p className="text-xl text-muted-foreground mt-4">{t('loading')}</p>
          </div>
        </main>
      ) : (
        <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
          <div className="mb-8">
            <Button variant="outline" onClick={() => router.push('/')} className="rounded-lg shadow-sm">
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t('goBackButton')}
            </Button>
          </div>

          <header className="text-center space-y-4 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <LinkIconLucide className="h-10 w-10" /> 
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </header>

          <div className="space-y-8">
            {usefulLinksData.map((category: UsefulLinkCategory) => (
              <Card key={getLocalizedText(category.title)} className="shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="bg-muted/30 p-4 md:p-6">
                  <CardTitle className="text-xl md:text-2xl font-semibold text-secondary flex items-center gap-3">
                    {React.createElement(getLinkIconElement(category.categoryIcon), { className: "h-7 w-7" })}
                    {getLocalizedText(category.title)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-3">
                  <p className="text-muted-foreground text-sm md:text-base">{getLocalizedText(category.description)}</p>
                  <ul className="space-y-2.5">
                    {category.links.map((linkItem: UsefulLinkItem, index: number) => (
                      <li key={`${getLocalizedText(linkItem.text)}-${index}`}>
                        <Link
                          href={linkItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-accent hover:underline hover:text-primary transition-colors duration-200 p-2 rounded-md hover:bg-accent/10 -ml-2"
                        >
                          {React.createElement(getLinkIconElement(linkItem.icon), { className: "h-5 w-5 shrink-0" })}
                          <span className="font-medium">{getLocalizedText(linkItem.text)}</span>
                          <ExternalLink className="h-4 w-4 shrink-0 opacity-70" />
                        </Link>
                        {linkItem.description && <p className="text-xs text-muted-foreground ml-7 -mt-1">{getLocalizedText(linkItem.description)}</p>}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live News Section */}
          <Card className="shadow-xl rounded-xl mt-12 border-2 border-primary animate-pulse">
            <CardHeader className="bg-muted/30 p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl font-semibold text-secondary flex items-center gap-3">
                <RadioTower className="h-7 w-7 text-primary" />
                <span>
                  <span className="animate-pulse text-primary font-bold">{t('liveNewsPrefix')}</span> {t('liveNewsSuffix')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-3 text-muted-foreground">
              <p className="text-sm md:text-base">{t('newsItem1')}</p>
              <p className="text-sm md:text-base">{t('newsItem2')}</p>
              <p className="text-sm md:text-base">{t('newsItem3')}</p>
            </CardContent>
          </Card>
        </main>
      )}
      {isMounted && currentYear !== null && <PageFooter />}
    </div>
  );
}
