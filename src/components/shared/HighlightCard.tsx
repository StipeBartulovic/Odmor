// src/components/shared/HighlightCard.tsx
'use client';

import type { LocalHighlight } from '@/services/localHighlights';
import { Button } from '@/components/ui/button';
import { ExternalLink, Instagram, PlayCircle, Youtube, Film, Loader2, VideoOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

const PlatformIcon = ({ platform }: { platform: 'TikTok' | 'Instagram' | 'YouTube' }) => {
  if (platform === 'Instagram') {
    return <Instagram className="h-5 w-5" />;
  }
  if (platform === 'YouTube') {
    return <Youtube className="h-5 w-5" />;
  }
  return <Film className="h-5 w-5" />; 
};

interface HighlightCardProps {
  highlight: LocalHighlight;
  isInitiallyVisible?: boolean; // To eager load the first video
}

const cardTranslations = {
  viewOn: {
    en: 'View on', it: 'Guarda su', de: 'Ansehen auf', pl: 'Zobacz na', fr: 'Voir sur', es: 'Ver en'
  },
  loadingVideo: {
    en: 'Loading video...', it: 'Caricamento video...', de: 'Video lädt...', pl: 'Ładowanie wideo...', fr: 'Chargement de la vidéo...', es: 'Cargando vídeo...'
  },
  failedToLoad: {
    en: 'Video unavailable', it: 'Video non disponibile', de: 'Video nicht verfügbar', pl: 'Wideo niedostępne', fr: 'Vidéo indisponible', es: 'Vídeo no disponible'
  }
};

export function HighlightCard({ highlight, isInitiallyVisible = false }: HighlightCardProps) {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [iframeKey, setIframeKey] = useState(() => `iframe-${highlight.id}-${Date.now()}`);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [loadIframe, setLoadIframe] = useState(isInitiallyVisible); // Load iframe if initially visible
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIframeKey(`iframe-${highlight.id}-${Date.now()}`);
    setIsLoadingIframe(true); // Reset loading state when highlight changes
    setIframeError(false); // Reset error state
    // If the new highlight is meant to be initially visible (e.g. it's the first one), load it.
    // Otherwise, rely on IntersectionObserver.
    setLoadIframe(isInitiallyVisible); 
  }, [highlight.id, isInitiallyVisible]);
  
  useEffect(() => {
    if (isInitiallyVisible || !cardRef.current || loadIframe) {
      // If already set to load (e.g. initially visible or already triggered by observer)
      // or if no ref (should not happen), do nothing here.
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadIframe(true);
          observer.unobserve(entry.target); // Stop observing once visible
        }
      },
      { threshold: 0.1 } // Load when 10% of the card is visible
    );

    observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
      observer.disconnect();
    };
  }, [highlight.id, isInitiallyVisible, loadIframe]); // Add loadIframe to dependencies


  const t = (fieldKey: keyof typeof cardTranslations): string => {
    if (!isMounted) return cardTranslations[fieldKey]?.['en'] || String(fieldKey);
    const langToUse = selectedLanguage;
    // @ts-ignore
    return cardTranslations[fieldKey]?.[langToUse] || cardTranslations[fieldKey]?.['en'] || String(fieldKey);
  };
  
  const handleIframeLoad = () => {
    setIsLoadingIframe(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIsLoadingIframe(false);
    setIframeError(true);
  };

  if (!isMounted) {
    return (
        <div ref={cardRef} className="w-full h-full relative bg-muted animate-pulse flex items-center justify-center rounded-lg overflow-hidden">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div ref={cardRef} className="w-full h-full relative bg-black overflow-hidden shadow-xl rounded-lg">
      {loadIframe ? (
        <>
          {isLoadingIframe && !iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
              <Loader2 className="h-10 w-10 animate-spin text-white mb-2" />
              <p className="text-sm text-gray-300">{t('loadingVideo')}</p>
            </div>
          )}
          {iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
              <VideoOff className="h-10 w-10 text-destructive mb-2" />
              <p className="text-sm text-destructive">{t('failedToLoad')}</p>
            </div>
          )}
          <iframe
            key={iframeKey}
            src={highlight.embedUrl}
            title={highlight.title}
            className={clsx(
              "w-full h-full absolute top-0 left-0 border-0",
              (isLoadingIframe || iframeError) && "opacity-0" // Hide iframe while loading or if error
            )}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="eager" 
            referrerPolicy="no-referrer"
            onLoad={handleIframeLoad}
            onError={handleIframeError} 
          />
        </>
      ) : (
        // Placeholder before iframe is loaded (for non-initiallyVisible cards)
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
          <PlayCircle className="h-16 w-16 text-primary/50 mb-2" />
          <p className="text-sm text-muted-foreground px-4 text-center">{highlight.title}</p>
        </div>
      )}

      {/* Overlay: Shown whether iframe is loading, loaded, or placeholder is visible */}
      <div className={clsx(
          "absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent space-y-1.5 sm:space-y-2",
          iframeError && "from-black/90 via-black/70" // Darker gradient if video failed
        )}>
        <h2 className="text-base sm:text-lg font-bold text-white drop-shadow-md truncate">{highlight.title}</h2>
        {(highlight.username || highlight.location) && (
          <p className="text-xs sm:text-sm text-gray-200 drop-shadow-sm truncate">
            {highlight.username && `@${highlight.username}`}
            {highlight.username && highlight.location && ' - '}
            {highlight.location}
          </p>
        )}
        {highlight.description && (
          <p className="text-xs sm:text-sm text-gray-100 line-clamp-2 drop-shadow-sm">{highlight.description}</p>
        )}
        <Button asChild variant="outline" size="xs" className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm">
          <a href={highlight.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            <PlatformIcon platform={highlight.platform as 'TikTok' | 'Instagram' | 'YouTube'} />
            <span className="ml-2 text-xs sm:text-sm">{t('viewOn')} {highlight.platform}</span>
            <ExternalLink className="ml-auto h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

