// src/app/local-highlights/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { HighlightCard } from '@/components/shared/HighlightCard';
import type { LocalHighlight } from '@/services/localHighlights';
import { getLocalHighlights } from '@/services/localHighlights';
import { Loader2, ArrowLeft, ArrowRight, VideoOff } from 'lucide-react';
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
  previousButton: {
    en: 'Previous', it: 'Precedente', de: 'Vorherige', pl: 'Poprzedni', fr: 'Précédent', es: 'Anterior'
  },
  nextButton: {
    en: 'Next', it: 'Successivo', de: 'Nächste', pl: 'Następny', fr: 'Suivant', es: 'Siguiente'
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

export default function LocalHighlightsPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();
  const [highlights, setHighlights] = useState<LocalHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());

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
  }, []);

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
    setCurrentIndex((prevIndex) => (prevIndex + 1) % highlights.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + highlights.length) % highlights.length);
  };

  const currentHighlight = highlights[currentIndex];

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
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-4">
           <Button variant="outline" onClick={() => router.push('/')} className="rounded-lg shadow-sm">
             <ArrowLeft className="mr-2 h-5 w-5" />
             {t('goBackButton')}
           </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-grow py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">{t('loading')}</p>
          </div>
        ) : highlights.length > 0 && currentHighlight ? (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="w-full aspect-[9/16] sm:aspect-video rounded-lg shadow-xl overflow-hidden mb-6">
              <HighlightCard 
                highlight={currentHighlight}
              />
            </div>
            <div className="flex justify-between w-full max-w-xs sm:max-w-sm items-center">
              <Button 
                variant="outline" 
                onClick={handlePrevious} 
                disabled={highlights.length <= 1}
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
                disabled={highlights.length <= 1}
                className="rounded-lg shadow-sm"
                aria-label={t('nextButton')}
              >
                {t('nextButton')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
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
