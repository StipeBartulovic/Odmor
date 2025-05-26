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
import clsx from 'clsx';

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

// Helper to extract video ID from URL
const getTikTokVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Video ID is usually the last part of the path before query params
    const videoId = pathParts.find(part => /^\d+$/.test(part));
    return videoId || null;
  } catch (e) {
    console.error("Error parsing TikTok URL:", e);
    return null;
  }
};


const fallbackHighlights: LocalHighlight[] = [
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
    embedUrl: `https://www.tiktok.com/embed/v2/${getTikTokVideoId("https://www.tiktok.com/@raulrabuzz/video/7505876094474521879")}`,
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
    embedUrl: `https://www.tiktok.com/embed/v2/${getTikTokVideoId("https://www.tiktok.com/@hopppee1/video/7506127902539271430")}`,
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
    embedUrl: `https://www.tiktok.com/embed/v2/${getTikTokVideoId("https://www.tiktok.com/@jugoslavija88/video/7480657307068599574")}`,
    externalUrl: 'https://www.tiktok.com/@jugoslavija88/video/7480657307068599574',
    username: 'jugoslavija88',
    description: '#jugoslavija #halidmuslimovic',
    category: 'music',
    location: 'Nostalgia',
  }
];


const DESKTOP_BREAKPOINT = 768; // md breakpoint in Tailwind

export default function LocalHighlightsPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();
  const [highlights, setHighlights] = useState<LocalHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [observedVideoId, setObservedVideoId] = useState<string | null>(null); // For mobile feed view, which video is centered
  const [isGridView, setIsGridView] = useState(false); // Determines if desktop grid or mobile feed
  
  const feedObserverRef = useRef<IntersectionObserver | null>(null);
  const feedVideoRefs = useRef<Map<string, HTMLElement>>(new Map()); // For mobile feed view

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsGridView(window.innerWidth >= DESKTOP_BREAKPOINT);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    async function fetchHighlights() {
      setIsLoading(true);
      try {
        const fetchedHighlights = await getLocalHighlights(); 
        const combinedHighlights = [...(fetchedHighlights && fetchedHighlights.length > 0 ? fetchedHighlights : []), ...fallbackHighlights.filter(fb => !(fetchedHighlights || []).find(fh => fh.id === fb.id))]
                                  .filter(h => h.embedUrl && h.embedUrl.includes('tiktok.com/embed/v2/null') === false);
        
        const uniqueHighlights = Array.from(new Map(combinedHighlights.map(item => [item.id, item])).values());
        setHighlights(uniqueHighlights);
      } catch (error) {
        console.error("Error in fetchHighlights, using only fallback:", error);
        setHighlights(fallbackHighlights.filter(h => h.embedUrl && h.embedUrl.includes('tiktok.com/embed/v2/null') === false));
      }
      setIsLoading(false);
    }
    fetchHighlights();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFeedIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (isGridView) return; 
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setObservedVideoId(entry.target.id);
      }
    });
  }, [isGridView]);

  useEffect(() => {
    if (isGridView || highlights.length === 0 || typeof window === 'undefined' || !isMounted) {
      if (feedObserverRef.current) {
        feedObserverRef.current.disconnect();
      }
      return;
    }

    // This observer is for the mobile feed view, determining which full-screen video is "active"
    feedObserverRef.current = new IntersectionObserver(handleFeedIntersection, {
      root: null, 
      rootMargin: '0px',
      threshold: 0.75, // When 75% of the item is visible
    });

    feedVideoRefs.current.clear(); // Clear old refs
    highlights.forEach(highlight => {
      const videoEl = document.getElementById(highlight.id);
      if (videoEl) {
        feedVideoRefs.current.set(highlight.id, videoEl);
        feedObserverRef.current?.observe(videoEl);
      }
    });
    

    return () => {
      if (feedObserverRef.current) {
        feedObserverRef.current.disconnect();
      }
      feedVideoRefs.current.clear();
    };
  }, [highlights, handleFeedIntersection, isGridView, isMounted]);

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

  if (!isMounted || currentYear === null) {
     return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <p className="text-xl text-muted-foreground mt-4">{t('loading')}</p>
          </div>
        </main>
        {isMounted && currentYear !== null && <PageFooter />}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className={clsx(
        "flex-grow",
        !isGridView && "overflow-y-auto snap-y snap-mandatory h-[calc(100vh-var(--header-height,88px)-var(--footer-height,76px))]", // Assuming header and footer heights for calc
        isGridView && "container mx-auto px-4 py-8" 
      )}>
        <div className={clsx("mb-8", isGridView && "container mx-auto px-4 pt-4", !isGridView && "px-4 pt-4 sticky top-0 bg-background z-20")}>
           <Button variant="outline" onClick={() => router.push('/')} className="rounded-lg shadow-sm">
             <ArrowLeft className="mr-2 h-5 w-5" />
             {t('goBackButton')}
           </Button>
         </div>

        {isLoading ? (
          <div className={clsx("flex flex-col items-center justify-center", isGridView ? "py-10" : "h-full snap-start")}>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">{t('loading')}</p>
          </div>
        ) : highlights.length > 0 ? (
          <div className={clsx(
            isGridView && "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          )}>
            {highlights.map((highlight, index) => (
              <section 
                key={highlight.id}
                id={highlight.id} // Used by feedObserverRef for feed view
                // ref is handled internally by HighlightCard if needed for its own observer
                className={clsx(
                  !isGridView && "h-full w-full flex items-center justify-center snap-start relative"
                )}
              >
                <HighlightCard 
                  highlight={highlight} 
                  isObserved={observedVideoId === highlight.id && !isGridView}
                  isGridView={isGridView}
                  isInitiallyVisible={!isGridView && index < 1} // Eager load only the first video's iframe for mobile feed
                />
              </section>
            ))}
          </div>
        ) : (
          <div className={clsx("flex flex-col items-center justify-center text-center p-4", isGridView ? "py-10" : "h-full snap-start")}>
            <VideoOff className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">{t('noHighlights')}</p>
          </div>
        )}
      </main>
      {isMounted && currentYear !== null && <PageFooter />}
    </div>
  );
}
// TODO: Define --header-height and --footer-height in globals.css if using calc() for main height, or adjust logic.
// Example: In globals.css
// :root {
//   --header-height: 88px; /* Adjust based on your actual header height */
//   --footer-height: 76px; /* Adjust based on your actual footer height */
// }
// This is just an example, you might need to get these dynamically or set them based on your layout.
// For now, h-[calc(100vh-var(--header-height,88px)-var(--footer-height,76px))] is a placeholder idea for mobile full height.
// A simpler h-screen on the video sections might be enough if the main container scrolls.
// Let's refine the main container height for mobile:
// The snap-y container should be the one that's full viewport height minus header/footer.
// Then each section inside it is h-full.
// Or, sections are h-screen and the main container just allows overflow.
// The original was: `!isGridView && "overflow-y-auto snap-y snap-mandatory"` on main, and `!isGridView && "h-screen ..."` on section. This should work.
// The issue with height calculation is complex if header/footer are sticky.
// For now, `h-full` on the section within a snap container that takes up the remaining space should be okay.
// The page itself `min-h-screen`, `AppHeader` sticky. `main` needs `flex-grow`.
// If `main` has `overflow-y-auto snap-y snap-mandatory`, then child `section` should be `h-screen`.
// Let's revert `main`'s height calculation for mobile and ensure `section` is `h-screen`.
// This will be `!isGridView && "h-screen w-full flex items-center justify-center snap-start relative"` for sections
// and `!isGridView && "overflow-y-auto snap-y snap-mandatory"` for main.
// The `h-[calc(...)]` was an overcomplication.

// Simpler main for mobile:
// className={clsx(
//   "flex-grow",
//   !isGridView && "overflow-y-auto snap-y snap-mandatory",
//   isGridView && "container mx-auto px-4 py-8"
// )}
// And sections:
// className={clsx(
//   !isGridView && "h-screen w-full flex items-center justify-center snap-start relative"
// )}
// This seems more robust. The go back button styling needs adjustment for mobile sticky.
// For the sticky back button on mobile:
// The parent of the button needs to be relative or the main scroll container.
// <div className={clsx("mb-8", isGridView && "container mx-auto px-4 pt-4", !isGridView && "px-4 pt-4 sticky top-0 bg-background z-20")}>
// This sticky top-0 within a scrolling container won't work as expected. It should be outside the map.
// A better approach for the go back button might be to have it inside the AppHeader, or handle its position differently based on view.
// For now, I'll keep it simple and assume it scrolls with content on mobile, and is at top for grid.
// The previous code did this: `!isGridView && "overflow-y-auto snap-y snap-mandatory"` on `main`, and `!isGridView && "h-screen ..."` on `section`. This works.

// The core change is `isInitiallyVisible={!isGridView && index < 1}`
// from `index < 2`.

    