// src/app/local-highlights/page.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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

const fallbackHighlights: LocalHighlight[] = [
  {
    id: 'fallback-tiktok-1',
    title: 'Adventures in Croatia by @cosinessandadventures',
    platform: 'TikTok',
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
    embedUrl: 'https://www.tiktok.com/embed/v2/7411791667910511905', 
    externalUrl: 'https://www.tiktok.com/@emigrantochka/video/7411791667910511905',
    username: 'emigrantochka',
    description: 'Capturing amazing travel experiences.',
    category: 'travel',
    location: 'Various Locations',
  },
  {
    id: 'fallback-tiktok-3',
    title: 'Croatian Scenery by @msurinaa',
    platform: 'TikTok',
    embedUrl: 'https://www.tiktok.com/embed/v2/7499780431143914774', 
    externalUrl: 'https://www.tiktok.com/@msurinaa/video/7499780431143914774',
    username: 'msurinaa',
    description: 'Beautiful views from Croatia.',
    category: 'scenery',
    location: 'Croatia',
  }
];


export default function LocalHighlightsPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();
  const [highlights, setHighlights] = useState<LocalHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [observedVideoId, setObservedVideoId] = useState<string | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const videoRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setObservedVideoId(entry.target.id);
        // Attempt to play video - NOTE: This may not work due to iframe cross-origin restrictions
        const videoElement = entry.target.querySelector('iframe');
        videoElement?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } else {
        // Attempt to pause video
        const videoElement = entry.target.querySelector('iframe');
        videoElement?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    });
  }, []);

  useEffect(() => {
    if (highlights.length > 0 && typeof window !== 'undefined') {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.75, // 75% of the video is visible
      });

      videoRefs.current.forEach(videoEl => {
        if (videoEl && observerRef.current) {
          observerRef.current.observe(videoEl);
        }
      });

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
        videoRefs.current.clear();
      };
    }
  }, [highlights, handleIntersection]);

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
    <div className="flex flex-col h-screen bg-background"> {/* Changed min-h-screen to h-screen for full height */}
      <AppHeader />
      {/* Main content area for scrollable videos. Header and Footer are outside this scrollable area. */}
      <main className="flex-1 overflow-y-auto snap-y snap-mandatory"> {/* flex-1 to take remaining space, overflow-y-auto for scrolling */}
        {/* This div acts as the scroll container for video sections */}
        <div className="relative"> 
          {isLoading ? (
            <section className="h-screen flex flex-col items-center justify-center snap-start"> {/* Each section is full height */}
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-lg text-muted-foreground">{t('loading')}</p>
            </section>
          ) : highlights.length > 0 ? (
            highlights.map((highlight) => (
              <section 
                key={highlight.id}
                id={highlight.id}
                ref={el => el ? videoRefs.current.set(highlight.id, el) : videoRefs.current.delete(highlight.id)}
                className="h-screen w-full flex items-center justify-center snap-start relative" /* Full viewport height and snap */
              >
                <HighlightCard 
                  highlight={highlight} 
                  isObserved={observedVideoId === highlight.id} 
                />
              </section>
            ))
          ) : (
            <section className="h-screen flex flex-col items-center justify-center text-center snap-start p-4">
              <VideoOff className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">{t('noHighlights')}</p>
            </section>
          )}
        </div>
      </main>
      {/* Footer is not part of the scrollable video area if we want full-screen videos taking all main space */}
      {/* If footer should be visible, it needs to be outside the flex-1 main or the main needs fixed height */}
      {/* For true TikTok style, footer might be overlaid or not present */}
      {/* 
      <footer className="py-4 bg-muted text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} odmarAI. {t('footerRights')}
          </p>
        </div>
      </footer> 
      */}
    </div>
  );
}
