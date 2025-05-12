// src/app/useful-links/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usefulLinksData, type UsefulLinkCategory, type UsefulLinkItem } from '@/data/usefulLinks';
import { 
  ArrowLeft, ExternalLink, Loader2, Mountain, CloudSun, Car, Landmark, Compass, BedDouble, ShieldAlert, Globe2,
  Map as MapIcon, Trees, Route, Thermometer, CloudDrizzle, Wind, TrafficCone, Camera, Ferry, Bus, Train,
  Globe, Building, BookOpen, Navigation, Bike, Footprints, Tent, Hotel, Home, PhoneForwarded, AlertTriangle,
  Languages, Ticket as TicketIcon
} from 'lucide-react'; // Renamed Ticket to TicketIcon
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
    es: 'Recursos seleccionados para ayudarte a planificar y disfrutar tu viaje a Croacia.',
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
  }
};

const getLinkIconElement = (iconName?: string): React.ElementType => {
  if (!iconName) return Globe2; // Default icon
  switch (iconName) {
    case 'Mountain': return Mountain;
    case 'Map': return MapIcon;
    case 'Trees': return Trees;
    case 'Route': return Route;
    case 'CloudSun': return CloudSun;
    case 'Thermometer': return Thermometer;
    case 'CloudDrizzle': return CloudDrizzle;
    case 'Wind': return Wind;
    case 'Car': return Car;
    case 'TrafficCone': return TrafficCone;
    case 'Camera': return Camera;
    case 'Ferry': return Ferry;
    case 'Bus': return Bus;
    case 'Train': return Train;
    case 'Landmark': return Landmark;
    case 'Globe': return Globe;
    case 'Building': return Building;
    case 'BookOpen': return BookOpen;
    case 'Compass': return Compass;
    case 'Navigation': return Navigation;
    case 'Bike': return Bike;
    case 'Footprints': return Footprints;
    case 'BedDouble': return BedDouble;
    case 'Tent': return Tent;
    case 'Hotel': return Hotel;
    case 'Home': return Home;
    case 'ShieldAlert': return ShieldAlert;
    case 'PhoneForwarded': return PhoneForwarded;
    case 'AlertTriangle': return AlertTriangle;
    case 'Globe2': return Globe2;
    case 'Languages': return Languages;
    case 'Ticket': return TicketIcon;
    default: return Globe2;
  }
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
    return pageTranslations[fieldKey]?.[langToUse] || pageTranslations[fieldKey]?.['en'] || fieldKey;
  };
  
  const getLocalizedText = (textObj: Record<string, string> | undefined): string => {
    if (!textObj) return '';
    const langToUse = isMounted ? selectedLanguage : 'en';
    return textObj[langToUse] || textObj.en || '';
  };

  if (!isMounted || currentYear === null) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-xl text-muted-foreground mt-4">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()} className="rounded-lg shadow-sm">
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('goBackButton')}
          </Button>
        </div>

        <header className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
            <Link className="h-10 w-10" /> {/* Using Link from lucide-react */}
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
                      {/* @ts-ignore */}
                      {linkItem.description && <p className="text-xs text-muted-foreground ml-7 -mt-1">{getLocalizedText(linkItem.description)}</p>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <footer className="py-8 bg-muted text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Stibar. {t('footerRights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
