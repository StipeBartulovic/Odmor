'use client';

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { tipsData, type TipCategory, type Tip } from '@/data/tips';
import { 
  Globe, Lightbulb, Wrench, CarFront, PlugZap, Utensils, Umbrella, Info, ExternalLink,
  ShieldAlert, Droplets, Landmark, Activity as ActivityIcon, Clock, Smartphone, Phone, TrafficCone, Ship, Bike, Squirrel,
  Power, BatteryCharging, Plug, Coins, Receipt, CigaretteOff, MessageSquare, Languages, Sun, Footprints, Ticket, ArrowLeft,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';

const pageTranslations = {
  title: {
    en: 'Travel Smart: Everything They Don’t Tell You in the Brochure',
    it: 'Viaggia Intelligente: Tutto Quello che Non Ti Dicono nella Brochure',
    de: 'Reise Clever: Alles, was Sie in der Broschüre nicht finden',
    pl: 'Podróżuj Mądrze: Wszystko, czego nie mówią w broszurze',
    fr: 'Voyagez Malin : Tout ce qu\'on ne vous dit pas dans la brochure',
    es: 'Viaja Inteligente: Todo lo que no te cuentan en el folleto',
  },
  subtitle: {
    en: 'Practical, non-touristy knowledge to help you feel more confident and informed during your stay in Croatia.',
    it: 'Conoscenze pratiche e non turistiche per aiutarti a sentirti più sicuro e informato durante il tuo soggiorno in Croazia.',
    de: 'Praktisches Wissen abseits der Touristenpfade, damit Sie sich während Ihres Aufenthalts in Kroatien sicherer und informierter fühlen.',
    pl: 'Praktyczna, nieturystyczna wiedza, która pomoże Ci poczuć się pewniej i być lepiej poinformowanym podczas pobytu w Chorwacji.',
    fr: 'Des connaissances pratiques et non touristiques pour vous aider à vous sentir plus confiant et informé pendant votre séjour en Croatie.',
    es: 'Conocimientos prácticos y no turísticos para ayudarte a sentirte más seguro e informado durante tu estancia en Croacia.',
  },
  goBackButton: {
    en: 'Go Back',
    it: 'Torna Indietro',
    de: 'Zurück',
    pl: 'Wróć',
    fr: 'Retour',
    es: 'Volver',
  },
  didYouKnowTitle: {
    en: 'Did You Know?',
    it: 'Lo Sapevi?',
    de: 'Wussten Sie schon?',
    pl: 'Czy Wiesz, Że?',
    fr: 'Le Saviez-Vous ?',
    es: '¿Sabías Que?',
  },
  didYouKnowContent: {
    en: [
      'This section can be updated with interesting local quirks, customs, or fun facts about Croatia!',
      'Croatia is home to the world\'s smallest town, Hum.',
      'The necktie (cravat) was invented in Croatia.',
      'The Dalmatian dog breed originates from the Dalmatia region of Croatia.'
    ],
    it: [
      'Questa sezione può essere aggiornata con interessanti stranezze locali, costumi o curiosità sulla Croazia!',
      'La Croazia ospita la città più piccola del mondo, Hum.',
      'La cravatta è stata inventata in Croazia.',
      'La razza canina dalmata è originaria della regione della Dalmazia in Croazia.'
    ],
    de: [
      'Dieser Abschnitt kann mit interessanten lokalen Eigenheiten, Bräuchen oder lustigen Fakten über Kroatien aktualisiert werden!',
      'Kroatien ist die Heimat der kleinsten Stadt der Welt, Hum.',
      'Die Krawatte wurde in Kroatien erfunden.',
      'Die Hunderasse Dalmatiner stammt aus der Region Dalmatien in Kroatien.'
    ],
    pl: [
      'Ta sekcja może być aktualizowana o ciekawe lokalne dziwactwa, zwyczaje lub zabawne fakty o Chorwacji!',
      'Chorwacja jest domem najmniejszego miasta na świecie, Hum.',
      'Krawat został wynaleziony w Chorwacji.',
      'Rasa psów dalmatyńczyk pochodzi z regionu Dalmacji w Chorwacji.'
    ],
    fr: [
      'Cette section peut être mise à jour avec des bizarreries locales intéressantes, des coutumes ou des faits amusants sur la Croatie !',
      'La Croatie abrite la plus petite ville du monde, Hum.',
      'La cravate a été inventée en Croatie.',
      'La race de chien dalmatien est originaire de la région de Dalmatie en Croatie.'
    ],
    es: [
      '¡Esta sección se puede actualizar con peculiaridades locales interesantes, costumbres o datos divertidos sobre Croacia!',
      'Croacia alberga la ciudad más pequeña del mundo, Hum.',
      'La corbata (cravat) se inventó en Croacia.',
      'La raza de perro dálmata es originaria de la región de Dalmacia en Croacia.'
    ]
  },
  moreTipsFooter: {
    en: 'More tips and user suggestions can be added here in the future.',
    it: 'Altri suggerimenti e proposte degli utenti potranno essere aggiunti qui in futuro.',
    de: 'Weitere Tipps und Benutzervorschläge können hier in Zukunft hinzugefügt werden.',
    pl: 'W przyszłości można tu dodać więcej wskazówek i sugestii użytkowników.',
    fr: 'D\'autres conseils et suggestions d\'utilisateurs pourront être ajoutés ici à l\'avenir.',
    es: 'Se pueden agregar más consejos y sugerencias de usuarios aquí en el futuro.'
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
    en: 'Loading tips...',
    it: 'Caricamento consigli...',
    de: 'Lade Tipps...',
    pl: 'Ładowanie wskazówek...',
    fr: 'Chargement des conseils...',
    es: 'Cargando consejos...',
  }
};

const getIcon = (iconName?: string): React.ElementType => {
  if (!iconName) return Lightbulb;
  switch (iconName) {
    case 'Globe': return Globe;
    case 'Lightbulb': return Lightbulb;
    case 'Wrench': return Wrench;
    case 'CarFront': return CarFront;
    case 'PlugZap': return PlugZap;
    case 'Utensils': return Utensils;
    case 'Umbrella': return Umbrella;
    case 'Info': return Info;
    case 'ShieldAlert': return ShieldAlert;
    case 'Droplets': return Droplets;
    case 'Landmark': return Landmark;
    case 'ActivityIcon': return ActivityIcon;
    case 'Clock': return Clock;
    case 'Smartphone': return Smartphone;
    case 'Phone': return Phone;
    case 'TrafficCone': return TrafficCone;
    case 'Ship': return Ship;
    case 'Bike': return Bike;
    case 'Squirrel': return Squirrel;
    case 'Power': return Power;
    case 'BatteryCharging': return BatteryCharging;
    case 'Plug': return Plug;
    case 'Coins': return Coins;
    case 'Receipt': return Receipt;
    case 'CigaretteOff': return CigaretteOff;
    case 'MessageSquare': return MessageSquare;
    case 'Languages': return Languages;
    case 'Sun': return Sun;
    case 'Footprints': return Footprints;
    case 'Ticket': return Ticket;
    default: return Lightbulb;
  }
};

export default function TipsPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  const t = (fieldKey: keyof typeof pageTranslations, contentKey?: keyof typeof pageTranslations[keyof typeof pageTranslations]): string | string[] => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    const fieldTranslations = pageTranslations[fieldKey];

    if (contentKey && typeof fieldTranslations === 'object' && fieldTranslations.hasOwnProperty(contentKey)) {
        // @ts-ignore
      return fieldTranslations[contentKey][langToUse] || fieldTranslations[contentKey]['en'];
    }
    // @ts-ignore
    return fieldTranslations[langToUse] || fieldTranslations['en'];
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
        <p className="text-xl text-muted-foreground mt-4">{t('loading') as string}</p>
      </div>
    );
  }

  const localizedDidYouKnowContent: string[] = t('didYouKnowContent') as string[];


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()} className="rounded-lg shadow-sm">
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('goBackButton') as string}
          </Button>
        </div>

        <header className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
            <Globe className="h-10 w-10" />
            {t('title') as string}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle') as string}
          </p>
        </header>

        <div className="space-y-8">
          {tipsData.map((category: TipCategory) => (
            <Card key={getLocalizedText(category.title)} className="shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-muted/30 p-4 md:p-6">
                <CardTitle className="text-xl md:text-2xl font-semibold text-secondary flex items-center gap-3">
                  {React.createElement(getIcon(category.icon), { className: "h-7 w-7" })}
                  {getLocalizedText(category.title)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="multiple" className="w-full">
                  {category.tips.map((tip: Tip, index: number) => (
                    <AccordionItem 
                      key={`${getLocalizedText(category.title)}-${index}`}
                      value={`item-${getLocalizedText(category.title).replace(/\s+/g, '-')}-${index}`} 
                      className="border-b last:border-b-0"
                    >
                      <AccordionTrigger className="text-base md:text-lg font-medium hover:no-underline py-3 px-4 md:px-6 text-left">
                        <div className="flex items-center gap-2 w-full">
                          {tip.icon && React.createElement(getIcon(tip.icon), { className: "h-5 w-5 text-primary shrink-0" })}
                          <span className="flex-grow">{getLocalizedText(tip.title)}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm md:text-base text-muted-foreground pt-1 pb-3 px-4 md:px-6 space-y-2">
                        <p>{getLocalizedText(tip.description)}</p>
                        {tip.link && (
                          <Link
                            href={tip.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-accent hover:underline"
                          >
                            {getLocalizedText(tip.link.text)} <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-xl rounded-xl mt-12">
          <CardHeader className="bg-muted/30 p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl font-semibold text-secondary flex items-center gap-3">
              <Info className="h-7 w-7" />
              {t('didYouKnowTitle') as string}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 text-muted-foreground space-y-2">
            <p>{localizedDidYouKnowContent[0]}</p>
            <ul className="list-disc list-inside space-y-1">
              {localizedDidYouKnowContent.slice(1).map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
            <p className="text-xs italic mt-4">{t('moreTipsFooter') as string}</p>
          </CardContent>
        </Card>

      </main>
      <footer className="py-8 bg-muted text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Stibar. {t('footerRights') as string}
          </p>
        </div>
      </footer>
    </div>
  );
}
