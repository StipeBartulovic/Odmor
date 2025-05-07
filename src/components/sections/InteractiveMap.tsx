'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

const translations = {
  mapTitle: {
    en: 'Trip Highlights Map',
    it: 'Mappa dei Momenti Salienti del Viaggio',
    de: 'Karte der Reisehöhepunkte',
    pl: 'Mapa Najciekawszych Punktów Podróży',
    fr: 'Carte des Points Forts du Voyage',
    es: 'Mapa de los Puntos Destacados del Viaje',
  },
  loading: {
    en: 'Loading map...',
    it: 'Caricamento mappa...',
    de: 'Lade Karte...',
    pl: 'Ładowanie mapy...',
    fr: 'Chargement de la carte...',
    es: 'Cargando mapa...',
  }
};

export function InteractiveMap() {
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
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-background p-6">
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-0 md:p-2">
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg text-muted-foreground">{t('loading')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const localizedMapTitle: ReactNode = t('mapTitle');

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-background p-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
              <MapPin className="h-8 w-8" />
              {localizedMapTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            <div className="aspect-[16/9] w-full rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/d/u/0/embed?mid=1sIFXUnr021_gfhcgthkZ2xSdAGnGl2Q&ehbc=2E312F"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={typeof localizedMapTitle === 'string' ? localizedMapTitle : 'Trip Highlights Map'} 
                className="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
