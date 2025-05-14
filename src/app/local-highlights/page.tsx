// src/app/local-highlights/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { HighlightCard } from '@/components/shared/HighlightCard';
import type { LocalHighlight } from '@/services/localHighlights';
import { getLocalHighlights } from '@/services/localHighlights';
import { Loader2, ArrowLeft, VideoOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const pageTranslations = {
  title: {
    en: 'Local Highlights',
    it: 'Attrazioni Locali',
    de: 'Lokale Highlights',
    pl: 'Lokalne Atrakcje',
    fr: 'Points Forts Locaux',
    es: 'Destacados Locales',
  },
  subtitle: {
    en: 'Discover inspiring moments and activities shared by others.',
    it: 'Scopri momenti e attività stimolanti condivisi da altri.',
    de: 'Entdecken Sie inspirierende Momente und Aktivitäten, die von anderen geteilt werden.',
    pl: 'Odkryj inspirujące momenty i aktywności udostępnione przez innych.',
    fr: 'Découvrez des moments inspirants et des activités partagées par d\'autres.',
    es: 'Descubre momentos inspiradores y actividades compartidas por otros.',
  },
  loading: {
    en: 'Loading highlights...',
    it: 'Caricamento attrazioni...',
    de: 'Lade Highlights...',
    pl: 'Ładowanie atrakcji...',
    fr: 'Chargement des points forts...',
    es: 'Cargando destacados...',
  },
  noHighlights: {
    en: 'No local highlights found at the moment. Check back soon!',
    it: 'Nessuna attrazione locale trovata al momento. Torna presto!',
    de: 'Im Moment wurden keine lokalen Highlights gefunden. Schauen Sie bald wieder vorbei!',
    pl: 'Obecnie nie znaleziono lokalnych atrakcji. Sprawdź wkrótce!',
    fr: 'Aucun point fort local trouvé pour le moment. Revenez bientôt !',
    es: 'No se encontraron destacados locales en este momento. ¡Vuelve pronto!',
  },
  goBackButton: { 
    en: 'Go Back', 
    it: 'Torna Indietro', 
    de: 'Zurück', 
    pl: 'Wróć', 
    fr: 'Retour', 
    es: 'Volver' 
  },
   footerRights: { 
    en: 'All rights reserved.', 
    it: 'Tutti i diritti riservati.', 
    de: 'Alle Rechte vorbehalten.', 
    pl: 'Wszelkie prawa zastrzeżone.', 
    fr: 'Tous droits réservés.', 
    es: 'Todos los derechos reservados.' 
  },
};

// Updated fallback data with known working examples
const fallbackHighlights: LocalHighlight[] = [
  {
    id: 'fallback-insta-1',
    title: 'Beautiful Croatian Coastline',
    platform: 'Instagram',
    // Example of a public, embeddable Instagram post
    embedUrl: 'https://www.instagram.com/p/C9Z6Xq8IGXh/embed/', 
    externalUrl: 'https://www.instagram.com/p/C9Z6Xq8IGXh/',
    username: 'croatiafulloflife',
    description: 'Discover the stunning Adriatic coast. #CroatiaFullOfLife',
    location: 'Adriatic Sea, Croatia',
    category: 'scenery',
  },
  {
    id: 'fallback-tiktok-1',
    title: 'Adventures in Croatia by @cosinessandadventures',
    platform: 'TikTok',
    // Using one of the user's provided URLs that is embeddable
    embedUrl: 'https://www.tiktok.com/embed/v2/7388936115308268833', 
    externalUrl: 'https://www.tiktok.com/@cosinessandadventures/video/7388936115308268833',
    username: 'cosinessandadventures',
    description: 'Exploring the natural beauty and adventures in Croatia.',
    category: 'travel',
    location: 'Croatia',
  },
   {
    id: 'fallback-tiktok-2',
    title: 'Travel Moments by @emigrantochka',
    platform: 'TikTok',
    // Using another of the user's provided URLs that is embeddable
    embedUrl: 'https://www.tiktok.com/embed/v2/7411791667910511905', 
    externalUrl: 'https://www.tiktok.com/@emigrantochka/video/7411791667910511905',
    username: 'emigrantochka',
    description: 'Capturing amazing travel experiences.',
    category: 'travel',
    location: 'Various Locations',
  },
];


export default function LocalHighlightsPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();
  const [highlights, setHighlights] = useState<LocalHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());

    async function fetchHighlights() {
      setIsLoading(true);
      try {
        const fetchedHighlights = await getLocalHighlights();
        if (fetchedHighlights && fetchedHighlights.length > 0) {
          setHighlights(fetchedHighlights);
        } else {
          // Use fallback data if Firebase returns empty or there's an issue
          console.log("Using fallback highlights as Firebase returned empty or there was an issue fetching.");
          setHighlights(fallbackHighlights);
        }
      } catch (error) {
        console.error("Error in fetchHighlights, using fallback:", error);
        setHighlights(fallbackHighlights);
      }
      setIsLoading(false);
    }
    fetchHighlights();
  }, []);

  const t = (fieldKey: keyof typeof pageTranslations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    const translation = pageTranslations[fieldKey]?.[langToUse] || pageTranslations[fieldKey]?.['en'];
    return typeof translation === 'string' ? translation : String(fieldKey);
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
      <main className="flex-grow container mx-auto px-2 py-8 sm:px-4">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.push('/')} className="rounded-lg shadow-sm">
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('goBackButton')}
          </Button>
        </div>
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{t('title')}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{t('subtitle')}</p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">{t('loading')}</p>
          </div>
        ) : highlights.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {highlights.map((highlight) => (
              <HighlightCard key={highlight.id} highlight={highlight} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <VideoOff className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">{t('noHighlights')}</p>
          </div>
        )}
      </main>
      <footer className="py-8 bg-muted text-center mt-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} odmarAI. {t('footerRights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
