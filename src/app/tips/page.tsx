// src/app/tips/page.tsx
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
  Loader2, ChevronLeft, ChevronRight
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
      'Croatia is home to the world\'s smallest town, Hum.',
      'The necktie (cravat) was invented in Croatia.',
      'The Dalmatian dog breed originates from the Dalmatia region of Croatia.',
      'Nikola Tesla, the famous inventor, was born in Smiljan, Croatia.',
      'The Walls of Ston are the longest preserved fortification system in Europe after Hadrian\'s Wall.',
      'Croatia has over 1,200 islands, islets, and crags, but only about 50 are inhabited.',
      'The popular HBO series Game of Thrones filmed many scenes in Dubrovnik and Split.',
      'The Amphitheatre in Pula is one of the six largest surviving Roman arenas in the World.',
      'Zadar has a unique Sea Organ that plays music using the power of the waves.',
      'The island of Hvar is known for its lavender fields and is one of the sunniest spots in Europe.'
    ],
    it: [
      'La Croazia ospita la città più piccola del mondo, Hum.',
      'La cravatta è stata inventata in Croazia.',
      'La razza canina dalmata è originaria della regione della Dalmazia in Croazia.',
      'Nikola Tesla, il famoso inventore, è nato a Smiljan, in Croazia.',
      'Le Mura di Ston sono il sistema di fortificazione conservato più lungo d\'Europa dopo il Vallo di Adriano.',
      'La Croazia ha oltre 1.200 isole, isolotti e scogli, ma solo circa 50 sono abitati.',
      'La popolare serie HBO Game of Thrones ha girato molte scene a Dubrovnik e Spalato.',
      'L\'Anfiteatro di Pola è una delle sei arene romane più grandi sopravvissute al mondo.',
      'Zara ha un Organo Marino unico che suona musica usando la forza delle onde.',
      'L\'isola di Hvar è nota per i suoi campi di lavanda ed è uno dei luoghi più soleggiati d\'Europa.'
    ],
    de: [
      'Kroatien ist die Heimat der kleinsten Stadt der Welt, Hum.',
      'Die Krawatte wurde in Kroatien erfunden.',
      'Die Hunderasse Dalmatiner stammt aus der Region Dalmatien in Kroatien.',
      'Nikola Tesla, der berühmte Erfinder, wurde in Smiljan, Kroatien, geboren.',
      'Die Mauern von Ston sind nach dem Hadrianswall das längste erhaltene Befestigungssystem Europas.',
      'Kroatien hat über 1.200 Inseln, Inselchen und Klippen, aber nur etwa 50 sind bewohnt.',
      'Die beliebte HBO-Serie Game of Thrones drehte viele Szenen in Dubrovnik und Split.',
      'Das Amphitheater in Pula ist eine der sechs größten erhaltenen römischen Arenen der Welt.',
      'Zadar hat eine einzigartige Meeresorgel, die Musik mit der Kraft der Wellen spielt.',
      'Die Insel Hvar ist bekannt für ihre Lavendelfelder und einer der sonnigsten Orte Europas.'
    ],
    pl: [
      'Chorwacja jest domem najmniejszego miasta na świecie, Hum.',
      'Krawat został wynaleziony w Chorwacji.',
      'Rasa psów dalmatyńczyk pochodzi z regionu Dalmacji w Chorwacji.',
      'Nikola Tesla, słynny wynalazca, urodził się w Smiljanie w Chorwacji.',
      'Mury w Ston są najdłuższym zachowanym systemem fortyfikacyjnym w Europie po Murze Hadriana.',
      'Chorwacja ma ponad 1200 wysp, wysepek i skał, ale tylko około 50 jest zamieszkanych.',
      'Popularny serial HBO Gra o Tron kręcił wiele scen w Dubrowniku i Splicie.',
      'Amfiteatr w Puli jest jedną z sześciu największych zachowanych aren rzymskich na świecie.',
      'Zadar ma unikalne Organy Morskie, które grają muzykę za pomocą siły fal.',
      'Wyspa Hvar znana jest z pól lawendy i jest jednym z najbardziej słonecznych miejsc w Europie.'
    ],
    fr: [
      'La Croatie abrite la plus petite ville du monde, Hum.',
      'La cravate a été inventée en Croatie.',
      'La race de chien dalmatien est originaire de la région de Dalmatie en Croatie.',
      'Nikola Tesla, le célèbre inventeur, est né à Smiljan, en Croatie.',
      'Les murailles de Ston sont le plus long système de fortification conservé en Europe après le mur d\'Hadrien.',
      'La Croatie compte plus de 1 200 îles, îlots et récifs, mais seulement une cinquantaine sont habités.',
      'La célèbre série HBO Game of Thrones a tourné de nombreuses scènes à Dubrovnik et Split.',
      'L\'amphithéâtre de Pula est l\'une des six plus grandes arènes romaines subsistantes au monde.',
      'Zadar possède un orgue marin unique qui joue de la musique grâce à la force des vagues.',
      'L\'île de Hvar est connue pour ses champs de lavande et est l\'un des endroits les plus ensoleillés d\'Europe.'
    ],
    es: [
      'Croacia alberga la ciudad más pequeña del mundo, Hum.',
      'La corbata (cravat) se inventó en Croacia.',
      'La raza de perro dálmata es originaria de la región de Dalmacia en Croacia.',
      'Nikola Tesla, el famoso inventor, nació en Smiljan, Croacia.',
      'Las Murallas de Ston son el sistema de fortificación conservado más largo de Europa después del Muro de Adriano.',
      'Croacia tiene más de 1.200 islas, islotes y peñascos, pero solo unas 50 están habitadas.',
      'La popular serie de HBO Juego de Tronos filmó muchas escenas en Dubrovnik y Split.',
      'El Anfiteatro de Pula es una de las seis arenas romanas más grandes que se conservan en el mundo.',
      'Zadar tiene un Órgano Marino único que reproduce música utilizando la fuerza de las olas.',
      'La isla de Hvar es conocida por sus campos de lavanda y es uno de los lugares más soleados de Europa.'
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
  },
  previousFact: {
    en: 'Previous', it: 'Precedente', de: 'Vorherige', pl: 'Poprzedni', fr: 'Précédent', es: 'Anterior'
  },
  nextFact: {
    en: 'Next', it: 'Successivo', de: 'Nächste', pl: 'Następny', fr: 'Suivant', es: 'Siguiente'
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
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

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
  
  const localizedDidYouKnowContent: string[] = t('didYouKnowContent') as string[];

  const nextFact = () => {
    setCurrentFactIndex((prevIndex) => (prevIndex + 1) % localizedDidYouKnowContent.length);
  };

  const prevFact = () => {
    setCurrentFactIndex((prevIndex) => (prevIndex - 1 + localizedDidYouKnowContent.length) % localizedDidYouKnowContent.length);
  };


  if (!isMounted || currentYear === null) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-xl text-muted-foreground mt-4">{t('loading') as string}</p>
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
          <CardContent className="p-4 md:p-6 text-muted-foreground space-y-3">
            <div className="relative">
              <p className="text-base text-center min-h-[60px] flex items-center justify-center">
                {localizedDidYouKnowContent[currentFactIndex]}
              </p>
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" size="sm" onClick={prevFact} className="rounded-lg shadow-sm">
                  <ChevronLeft className="h-4 w-4 mr-1" /> {t('previousFact') as string}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentFactIndex + 1} / {localizedDidYouKnowContent.length}
                </span>
                <Button variant="outline" size="sm" onClick={nextFact} className="rounded-lg shadow-sm">
                  {t('nextFact') as string} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            <p className="text-xs italic mt-6 pt-3 border-t border-muted/20">{t('moreTipsFooter') as string}</p>
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
