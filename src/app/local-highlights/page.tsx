// src/app/local-highlights/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head'; // For preloading
import { AppHeader } from '@/components/shared/AppHeader';
import { HighlightCard } from '@/components/shared/HighlightCard';
import type { LocalHighlight } from '@/services/localHighlights';
import { getLocalHighlights } from '@/services/localHighlights';
import { Loader2, ArrowLeft, ArrowRight, VideoOff, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
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

const getTikTokVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const videoId = pathParts.find(part => /^\d+$/.test(part));
    return videoId || null;
  } catch (e) {
    console.error("Error parsing TikTok URL:", e);
    return null;
  }
};

const initialFallbackHighlights: LocalHighlight[] = [
  {
    id: 'tiktok-cosinessandadventures',
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
    id: 'tiktok-emigrantochka',
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
    id: 'tiktok-msurinaa',
    title: 'Croatian Scenery by @msurinaa',
    platform: 'TikTok',
    embedUrl: 'https://www.tiktok.com/embed/v2/7499780431143914774', 
    externalUrl: 'https://www.tiktok.com/@msurinaa/video/7499780431143914774',
    username: 'msurinaa',
    description: 'Beautiful views from Croatia.',
    category: 'scenery',
    location: 'Croatia',
  },
  {
    id: 'tiktok-raulrabuzz',
    title: 'CR7 Goal by @raulrabuzz',
    platform: 'TikTok',
    embedUrl: `https://www.tiktok.com/embed/v2/${getTikTokVideoId("https://www.tiktok.com/@raulrabuzz/video/7505876094474521879") || 'invalid_id_1'}`,
    externalUrl: 'https://www.tiktok.com/@raulrabuzz/video/7505876094474521879',
    username: 'raulrabuzz',
    description: 'Napokon životna želja #CR7',
    category: 'sports',
    location: 'Stadium',
  },
  {
    id: 'tiktok-hopppee1',
    title: 'Funny Moment by @hopppee1',
    platform: 'TikTok',
    embedUrl: `https://www.tiktok.com/embed/v2/${getTikTokVideoId("https://www.tiktok.com/@hopppee1/video/7506127902539271430") || 'invalid_id_2'}`,
    externalUrl: 'https://www.tiktok.com/@hopppee1/video/7506127902539271430',
    username: 'hopppee1',
    description: 'Osigurala sam sebi mjesto za pakao',
    category: 'comedy',
    location: 'Unknown',
  },
  {
    id: 'tiktok-jugoslavija88',
    title: 'Music by @jugoslavija88',
    platform: 'TikTok',
    embedUrl: `https://www.tiktok.com/embed/v2/${getTikTokVideoId("https://www.tiktok.com/@jugoslavija88/video/7480657307068599574") || 'invalid_id_3'}`,
    externalUrl: 'https://www.tiktok.com/@jugoslavija88/video/7480657307068599574',
    username: 'jugoslavija88',
    description: '#jugoslavija #halidmuslimovic',
    category: 'music',
    location: 'Nostalgia',
  }
].filter(h => !h.embedUrl.includes('invalid_id')); // Filter out invalid ones from fallback


const HIGHLIGHTS_PAGE_SIZE = 5;

export default function LocalHighlightsPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();
  const [highlights, setHighlights] = useState<LocalHighlight[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastFetchedDoc, setLastFetchedDoc] = useState<QueryDocumentSnapshot<unknown> | null>(null);
  const [hasMoreHighlights, setHasMoreHighlights] = useState(true);
  
  const fetchAndSetHighlights = useCallback(async (lastDocForQuery: QueryDocumentSnapshot<unknown> | null = null) => {
    if (lastDocForQuery === null) setIsLoadingInitial(true); else setIsLoadingMore(true);
    
    try {
      const { highlights: fetchedData, newLastDoc } = await getLocalHighlights(HIGHLIGHTS_PAGE_SIZE, lastDocForQuery);
      
      let combinedHighlights: LocalHighlight[];
      if (lastDocForQuery === null) { // Initial fetch
        // Combine fetched with fallback, ensuring no duplicates from fallback if Firestore has them
        const fallbackToAdd = initialFallbackHighlights.filter(fb => !fetchedData.find(fh => fh.id === fb.id));
        combinedHighlights = [...fetchedData, ...fallbackToAdd];
      } else { // Loading more
        combinedHighlights = [...highlights, ...fetchedData];
      }
      
      const uniqueHighlights = Array.from(new Map(combinedHighlights.map(item => [item.id, item])).values())
                                 .filter(h => h.embedUrl && !h.embedUrl.includes('null')); // Filter out invalid embeds
      
      setHighlights(uniqueHighlights);
      setLastFetchedDoc(newLastDoc);
      setHasMoreHighlights(fetchedData.length === HIGHLIGHTS_PAGE_SIZE);

    } catch (error) {
      console.error("Error in fetchAndSetHighlights, using only fallback if initial:", error);
      if (lastDocForQuery === null) {
        setHighlights(initialFallbackHighlights.filter(h => h.embedUrl && !h.embedUrl.includes('null')));
        setHasMoreHighlights(false); // No Firebase data, so no more to load from there
      }
    } finally {
      if (lastDocForQuery === null) setIsLoadingInitial(false); else setIsLoadingMore(false);
    }
  }, [highlights]); // Added highlights to dependency array for combining on "load more"

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());
    fetchAndSetHighlights(null); // Initial fetch
  }, [fetchAndSetHighlights]); // fetchAndSetHighlights is memoized with useCallback

  const t = (fieldKey: keyof typeof pageTranslations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    const translation = pageTranslations[fieldKey]?.[langToUse] || pageTranslations[fieldKey]?.['en'];
    return typeof translation === 'string' ? translation : String(fieldKey);
  };
  
  const PageFooter = () => (
    <footer className="py-8 bg-muted text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} odmarAI. {t('footerRights')}
        </p>
      </div>
    </footer>
  );

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= highlights.length && hasMoreHighlights && !isLoadingMore) {
        // If at the end and more can be loaded, trigger load more instead of wrapping
        handleLoadMore(); 
        return prevIndex; // Stay on current until more load
      }
      return newIndex % highlights.length; // Loop back if no more to load
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + highlights.length) % highlights.length);
  };

  const handleLoadMore = () => {
    if (hasMoreHighlights && !isLoadingMore) {
      fetchAndSetHighlights(lastFetchedDoc);
    }
  };

  const currentHighlight = highlights[currentIndex];
  const firstHighlightEmbedUrl = highlights.length > 0 ? highlights[0].embedUrl : (initialFallbackHighlights.length > 0 ? initialFallbackHighlights[0].embedUrl : null);


  if (!isMounted || currentYear === null) {
     return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <p className="text-xl text-muted-foreground mt-4">{t('loadingInitial')}</p>
          </div>
        </main>
        {isMounted && currentYear !== null && <PageFooter />}
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

        {isLoadingInitial ? (
          <div className="flex flex-col items-center justify-center flex-grow py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">{t('loadingInitial')}</p>
          </div>
        ) : highlights.length > 0 && currentHighlight ? (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="w-full aspect-[9/16] sm:aspect-video rounded-lg shadow-xl overflow-hidden mb-6">
              <HighlightCard 
                highlight={currentHighlight}
              />
            </div>
            <div className="flex justify-between w-full max-w-xs sm:max-w-sm items-center mb-6">
              <Button 
                variant="outline" 
                onClick={handlePrevious} 
                disabled={highlights.length <= 1 && !hasMoreHighlights} // Disable if only one and no more
                className="rounded-lg shadow-sm"
                aria-label={t('previousButton')}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t('previousButton')}
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {highlights.length}
              </span>
              <Button 
                variant="outline" 
                onClick={handleNext} 
                disabled={highlights.length <= 1 && !hasMoreHighlights && currentIndex === highlights.length -1} // Disable if last and no more
                className="rounded-lg shadow-sm"
                aria-label={t('nextButton')}
              >
                {t('nextButton')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
             {hasMoreHighlights && (
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
          <div className="flex flex-col items-center justify-center text-center flex-grow py-10">
            <VideoOff className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">{t('noHighlights')}</p>
          </div>
        )}
      </main>
      {isMounted && currentYear !== null && <PageFooter />}
    </div>
  );
}
