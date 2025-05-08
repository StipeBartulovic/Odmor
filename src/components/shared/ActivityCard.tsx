"use client";

import type { Activity, SubActivity } from '@/services/activities';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card"; // CardContent removed as it's not directly used, AccordionContent provides similar structure
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { DollarSign, Leaf, Palette, Info, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

interface ActivityCardProps {
  activity: Activity; 
  icon?: React.ElementType;
}

const translations = {
  free: {
    en: 'Free',
    it: 'Gratuito',
    de: 'Kostenlos',
    pl: 'Darmowe',
    fr: 'Gratuit',
    es: 'Gratis',
  },
  paid: {
    en: 'Paid',
    it: 'Pagamento',
    de: 'Bezahlt',
    pl: 'Płatne',
    fr: 'Payant',
    es: 'De Pago',
  },
  detailsPlaceholder: {
    en: 'Further details and provider options available.',
    it: 'Ulteriori dettagli e opzioni del fornitore disponibili.',
    de: 'Weitere Details und Anbieteroptionen verfügbar.',
    pl: 'Dalsze szczegóły i opcje dostawców dostępne.',
    fr: 'Plus de détails et options de fournisseurs disponibles.',
    es: 'Más detalles y opciones de proveedores disponibles.',
  },
  specificLocationsTitle: {
    en: 'Specific locations/options near Split:',
    it: 'Luoghi/opzioni specifici vicino a Spalato:',
    de: 'Spezifische Standorte/Optionen in der Nähe von Split:',
    pl: 'Konkretne lokalizacje/opcje w pobliżu Splitu:',
    fr: 'Lieux/options spécifiques près de Split :',
    es: 'Ubicaciones/opciones específicas cerca de Split:',
  }
};

export function ActivityCard({ activity, icon: IconComponent = Palette }: ActivityCardProps) {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const t = (fieldKey: keyof typeof translations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    return translations[fieldKey][langToUse] || translations[fieldKey]['en'];
  };

  if (!isMounted) {
    return (
      <Card className="shadow-lg rounded-xl">
        <div className="p-4">
          <div className="flex items-center gap-4 w-full">
            <div className="p-3 bg-muted/10 rounded-lg h-14 w-14 animate-pulse"></div>
            <div className="flex-grow text-left">
              <div className="h-5 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/4 mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={activity.name} className="border-b-0">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center gap-4 w-full">
              <div className="p-3 bg-primary/10 rounded-lg">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-grow text-left">
                <h3 className="text-lg font-semibold text-foreground">{activity.name}</h3>
                <Badge variant={activity.isFree ? "secondary" : "default"} className="mt-1 text-xs">
                  {activity.isFree ? <Leaf className="mr-1 h-3 w-3" /> : <DollarSign className="mr-1 h-3 w-3" />}
                  {activity.isFree ? t('free') : t('paid')}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-0">
            <div className="space-y-3">
              {activity.iconUrl && activity.iconUrl.startsWith('https://picsum.photos') && (
                 <Image
                    src={activity.iconUrl}
                    alt={activity.name} 
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full aspect-[16/10]"
                    data-ai-hint={activity.dataAiHint || "activity outdoor"}
                  />
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
              
              {activity.isFree && activity.subActivities && activity.subActivities.length > 0 && (
                <div className="mt-4 pt-3 border-t border-muted/30">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {t('specificLocationsTitle')}
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {activity.subActivities.map((sub, index) => (
                      <li key={index}>
                        <a
                          href={sub.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-primary hover:underline text-sm"
                        >
                          {sub.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground italic pt-2">
                <Info className="h-4 w-4" />
                <span>{t('detailsPlaceholder')}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}