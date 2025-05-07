'use client';

import type { LocalEvent } from '@/services/events';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Link as LinkIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

interface EventCardProps {
  event: LocalEvent; 
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = (fieldKey: keyof typeof translations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    return translations[fieldKey][langToUse] || translations[fieldKey]['en'];
  };

  // Event name and description are assumed to come from the `event` prop.
  // For full i18n, these would need to be structured with translations.

  if (!isMounted) {
    // Basic skeleton
    return (
      <Card className="shadow-lg rounded-xl flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 mt-2 animate-pulse"></div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="h-4 bg-muted rounded w-full animate-pulse mb-2"></div>
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
        </CardContent>
        <CardFooter>
          <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-foreground">{event.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground pt-1">
          <CalendarDays className="mr-2 h-4 w-4 text-primary" />
          <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
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
