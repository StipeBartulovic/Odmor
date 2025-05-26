
// src/app/local-highlights/page.tsx
'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import Head from 'next/head';
import { AppHeader } from '@/components/shared/AppHeader';
import { HighlightCard } from '@/components/shared/HighlightCard';
import type { LocalHighlight } from '@/services/localHighlights';
import { getLocalHighlights } from '@/services/localHighlights';
import { Loader2, ArrowLeft, ArrowRight, VideoOff, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

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
  loadingInitial: {
    en: 'Loading highlights...',
    it: 'Caricamento attrazioni...',
    de: 'Lade Highlights...',
    pl: 'Ładowanie atrakcji...',
    fr: 'Chargement des points forts...',
    es: 'Cargando destacados...',
  },
  loadingMore: {
    en: 'Loading more...',
    it: 'Caricamento altri...',
    de: 'Lade mehr...',
    pl: 'Ładowanie więcej...',
    fr: 'Chargement de plus...',
    es: 'Cargando más...',
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
  previousButton: {
    en: 'Previous', it: 'Precedente', de: 'Vorherige', pl: 'Poprzedni', fr: 'Précédent', es: 'Anterior'
  },
  nextButton: {
    en: 'Next', it: 'Successivo', de: 'Nächste', pl: 'Następny', fr: 'Suivant', es: 'Siguiente'
  },
  loadMoreButton: {
    en: 'Load More Highlights',
    it: 'Carica Altre Attrazioni',
    de: 'Weitere Highlights laden',
    pl: 'Załaduj Więcej Atrakcji',
    fr: 'Charger Plus de Points Forts',
    es: 'Cargar Más Destacados',
  }
};

const initialFallbackHighlights: LocalHighlight[] = [
  {
    id: 'fallback-tiktok-cosinessandadventures',
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
    id: 'fallback-tiktok-msurinaa',
    title: 'Croatian Coastal Charm by @msurinaa',
    platform: 'TikTok',
    embedUrl: 'https://www.tiktok.com/embed/v2/7499780431143914774',
    externalUrl: 'https://www.tiktok.com/@msurinaa/video/7499780431143914774',
    username: 'msurinaa',
    description: 'Beautiful views from the Croatian coast.',
    category: 'travel',
    location: 'Croatia',
  },
  {
    id: 'fallback-tiktok-emigrantochka',
    title: 'Travel Moments by @emigrantochka',
    platform: 'TikTok',
    embedUrl: 'https://www.tiktok.com/embed/v2/7411791667910511905',
    externalUrl: 'https://www.tiktok.com/@emigrantochka/video/7411791667910511905',
    username: 'emigrantochka',
    description: 'Capturing travel experiences.',
    category: 'travel',
    location: 'Croatia',
  }
];

const HIGHLIGHTS_PAGE_SIZE = 5;

const PageFooter = memo(({ currentYear, t }: { currentYear: number; t: (key: keyof typeof pageTranslations) => string }) => (
  <footer className="py-8 bg-muted text-center">
    <div className="container mx-auto px-4">
      <p className="text-sm text-muted-foreground">
        &copy; {currentYear} odmarAI. {t('footerRights')}
      </p>
    </div>
  </footer>
));
PageFooter.displayName = 'PageFooter';


export default function LocalHighlightsPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  
  const [allFetchedHighlights, setAllFetchedHighlights] = useState<LocalHighlight[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLastDoc, setCurrentLastDoc] = useState<QueryDocumentSnapshot<unknown> | null>(null);
  const [hasMoreToFetch, setHasMoreToFetch] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  const {
    data: initialQueryData,
    isLoading: isLoadingInitialQuery,
    isError: isErrorInitialQuery,
  } = useQuery({
    queryKey: ['localHighlights', 'initial'],
    queryFn: () => getLocalHighlights(HIGHLIGHTS_PAGE_SIZE, null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isMounted, // Only run query when mounted
  });

  useEffect(() => {
    if (initialQueryData) {
      setAllFetchedHighlights(initialQueryData.highlights);
      setCurrentLastDoc(initialQueryData.newLastDoc);
      setHasMoreToFetch(initialQueryData.highlights.length === HIGHLIGHTS_PAGE_SIZE && !!initialQueryData.newLastDoc);
    }
  }, [initialQueryData]);

  const displayedHighlights = useMemo(() => {
    // Combine fetched highlights with fallbacks, ensuring fallbacks are only added if no fetched data or to supplement
    let combined: LocalHighlight[];
    if (allFetchedHighlights.length === 0 && !isLoadingInitialQuery) {
      combined = [...initialFallbackHighlights];
    } else {
      // Ensure fallbacks are unique if they are also fetched
      const fallbackToAdd = initialFallbackHighlights.filter(fb => !allFetchedHighlights.find(fh => fh.id === fb.id));
      combined = [...allFetchedHighlights, ...fallbackToAdd];
    }
    return Array.from(new Map(combined.map(item => [item.id, item])).values())
      .filter(h => h.embedUrl && !h.embedUrl.includes('null'));
  }, [allFetchedHighlights, isLoadingInitialQuery]);


  const t = useCallback((fieldKey: keyof typeof pageTranslations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    const translation = pageTranslations[fieldKey]?.[langToUse as keyof typeof pageTranslations[keyof typeof pageTranslations]] || pageTranslations[fieldKey]?.['en'];
    return typeof translation === 'string' ? translation : String(fieldKey);
  }, [isMounted, selectedLanguage]);
  
  const handleLoadMore = useCallback(async () => {
    if (!hasMoreToFetch || isLoadingMore || !currentLastDoc) return;
    setIsLoadingMore(true);
    try {
      const { highlights: newHighlights, newLastDoc } = await getLocalHighlights(HIGHLIGHTS_PAGE_SIZE, currentLastDoc);
      setAllFetchedHighlights(prev => [...prev, ...newHighlights]);
      setCurrentLastDoc(newLastDoc);
      setHasMoreToFetch(newHighlights.length === HIGHLIGHTS_PAGE_SIZE && !!newLastDoc);
    } catch (error) {
      console.error("Error loading more highlights:", error);
      setHasMoreToFetch(false); // Stop trying if there's an error
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMoreToFetch, isLoadingMore, currentLastDoc]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= displayedHighlights.length && hasMoreToFetch && !isLoadingMore) {
        handleLoadMore(); // Attempt to load more if at the end and more might be available
        return prevIndex; // Stay on current until more are loaded
      }
      return newIndex < displayedHighlights.length ? newIndex : prevIndex;
    });
  }, [displayedHighlights.length, hasMoreToFetch, isLoadingMore, handleLoadMore]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displayedHighlights.length) % displayedHighlights.length);
  }, [displayedHighlights.length]);


  const currentHighlight = displayedHighlights[currentIndex];
  const firstHighlightEmbedUrl = displayedHighlights.length > 0 ? displayedHighlights[0].embedUrl : (initialFallbackHighlights.length > 0 ? initialFallbackHighlights[0].embedUrl : null);

  if (!isMounted || currentYear === null || (isLoadingInitialQuery && allFetchedHighlights.length === 0 && displayedHighlights.length === 0) ) {
     return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <p className="text-xl text-muted-foreground mt-4">{t('loadingInitial')}</p>
          </div>
        </main>
        {isMounted && currentYear !== null && <PageFooter currentYear={currentYear} t={t} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {firstHighlightEmbedUrl && (
        <Head>
          <link rel="preload" href={firstHighlightEmbedUrl} as="document" type="text/html" />
        </Head>
      )}
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-4">
           <Button variant="outline" onClick={() => router.push('/')} className="rounded-lg shadow-sm">
             <ArrowLeft className="mr-2 h-5 w-5" />
             {t('goBackButton')}
           </Button>
        </div>

        {isErrorInitialQuery && (
             <div className="flex flex-col items-center justify-center text-center flex-grow py-10">
                <VideoOff className="h-16 w-16 text-destructive mb-4" />
                <p className="text-xl text-muted-foreground">Error loading highlights.</p>
            </div>
        )}

        {!isErrorInitialQuery && displayedHighlights.length > 0 && currentHighlight ? (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="w-full aspect-[9/16] sm:aspect-video rounded-lg shadow-xl overflow-hidden mb-6 bg-muted">
              <HighlightCard 
                highlight={currentHighlight}
                isInitiallyVisible={currentIndex === 0} // Only first card is initially visible for eager load
              />
            </div>
            <div className="flex justify-between w-full max-w-xs sm:max-w-sm items-center mb-6">
              <Button 
                variant="outline" 
                onClick={handlePrevious} 
                disabled={displayedHighlights.length <= 1 && !hasMoreToFetch}
                className="rounded-lg shadow-sm"
                aria-label={t('previousButton')}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t('previousButton')}
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {displayedHighlights.length}
                {hasMoreToFetch && !isLoadingMore && "+"}
                {isLoadingMore && <Loader2 className="ml-1 h-4 w-4 animate-spin inline-block"/>}
              </span>
              <Button 
                variant="outline" 
                onClick={handleNext} 
                disabled={!hasMoreToFetch && currentIndex === displayedHighlights.length -1 }
                className="rounded-lg shadow-sm"
                aria-label={t('nextButton')}
              >
                {t('nextButton')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
             {hasMoreToFetch && (
              <Button 
                onClick={handleLoadMore} 
                disabled={isLoadingMore}
                variant="secondary"
                className="rounded-lg shadow-md mt-4"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('loadingMore')}
                  </>
                ) : (
                   <>
                    <Download className="mr-2 h-5 w-5" />
                    {t('loadMoreButton')}
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          !isLoadingInitialQuery && !isErrorInitialQuery && ( // Only show "no highlights" if not loading and no error
            <div className="flex flex-col items-center justify-center text-center flex-grow py-10">
              <VideoOff className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">{t('noHighlights')}</p>
            </div>
          )
        )}
      </main>
      {isMounted && currentYear !== null && <PageFooter currentYear={currentYear} t={t} />}
    </div>
  );
}

