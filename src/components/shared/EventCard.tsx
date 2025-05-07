'use client';

import type { LocalEvent } from '@/services/events';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Link as LinkIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';

interface EventCardProps {
  event: LocalEvent; // Event name/description would need to be translated upstream
}

const translations = {
  moreInfo: {
    en: 'More Info',
    it: 'Più Info',
    de: 'Mehr Infos',
    pl: 'Więcej Informacji',
    fr: 'Plus d\'Infos',
    es: 'Más Información',
  }
};

export function EventCard({ event }: EventCardProps) {
  const { selectedLanguage } = useLanguage();

  const t = (field: keyof typeof translations): string => {
    // @ts-ignore
    return translations[field][selectedLanguage] || translations[field]['en'];
  };

  // Event name and description are assumed to come from the `event` prop.
  // These would need to be structured with translations for full i18n.

  return (
    <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-foreground">{event.name}</CardTitle> {/* Untranslated from prop */}
        <div className="flex items-center text-sm text-muted-foreground pt-1">
          <CalendarDays className="mr-2 h-4 w-4 text-primary" />
          <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p> {/* Untranslated from prop */}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild className="w-full rounded-lg shadow-sm hover:bg-accent/10">
          <a href={event.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            {t('moreInfo')}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}