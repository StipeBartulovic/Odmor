// src/components/shared/HighlightCard.tsx
'use client';

import type { LocalHighlight } from '@/services/localHighlights';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'; // Removed CardHeader, CardContent, CardFooter
import { ExternalLink, Instagram, PlayCircle, Youtube, Film, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';

// Helper for platform icon
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
  isObserved: boolean; 
  isGridView: boolean;
  isInitiallyVisible?: boolean;
}

const cardTranslations = {
  viewOn: {
    en: 'View on', it: 'Guarda su', de: 'Ansehen auf', pl: 'Zobacz na', fr: 'Voir sur', es: 'Ver en'
  },
  clickToPlay: {
    en: 'Click to Play', it: 'Clicca per Riprodurre', de: 'Zum Abspielen klicken', pl: 'Kliknij, aby Odtworzyć', fr: 'Cliquez pour Lire', es: 'Haz Clic para Reproducir'
  },
  loadingVideo: {
    en: 'Loading video...', it: 'Caricamento video...', de: 'Video lädt...', pl: 'Ładowanie wideo...', fr: 'Chargement de la vidéo...', es: 'Cargando vídeo...'
  }
};

export function HighlightCard({ highlight, isObserved, isGridView, isInitiallyVisible = false }: HighlightCardProps) {
  const { selectedLanguage } = useLanguage();
  const [playerVisible, setPlayerVisible] = useState(isInitiallyVisible && !isGridView);
  const [isMounted, setIsMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isGridView && !isInitiallyVisible && cardRef.current && isMounted) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setPlayerVisible(true); // Load iframe when card is intersecting
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1 } 
      );
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }
  }, [isGridView, isInitiallyVisible, isMounted]);


  const t = (fieldKey: keyof typeof cardTranslations): string => {
    if (!isMounted) return cardTranslations[fieldKey]?.['en'] || String(fieldKey);
    const langToUse = selectedLanguage;
    // @ts-ignore
    return cardTranslations[fieldKey]?.[langToUse] || cardTranslations[fieldKey]?.['en'] || String(fieldKey);
  };

  const handlePlaceholderClick = () => {
    if (isGridView && !playerVisible) {
      setPlayerVisible(true);
    }
  };
  
  const renderIframe = () => (
    <iframe
        src={highlight.embedUrl}
        title={highlight.title}
        className="w-full h-full absolute top-0 left-0 border-0 max-w-none" // Ensure it fills the relative parent
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer" // Recommended for embeds
      ></iframe>
  );

  const renderPlaceholder = (message: string, showPlayIcon: boolean = false) => (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-muted/30 group">
        {showPlayIcon && <PlayCircle className="h-16 w-16 text-primary/60 mb-3 group-hover:text-primary/80 transition-colors" />}
        {!showPlayIcon && playerVisible && isGridView && <Loader2 className="h-12 w-12 animate-spin text-primary mb-3" />}
        <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">{highlight.title}</h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">@{highlight.username || highlight.platform}</p>
        {isGridView && !playerVisible && <p className="text-xs text-primary">{message}</p>}
        {!isGridView && !playerVisible && <Loader2 className="h-8 w-8 animate-spin text-primary mt-2" /> }
    </div>
  );


  if (!isMounted) {
    if (isGridView) {
      return (
        <Card className="aspect-[9/16] w-full rounded-lg shadow-lg overflow-hidden bg-muted animate-pulse">
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="h-16 w-16 bg-muted-foreground/20 rounded-full mb-3"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
          </div>
        </Card>
      );
    }
    return <div ref={cardRef} className="w-full h-full relative bg-black/10 animate-pulse" />;
  }


  if (isGridView) {
    return (
      <Card 
        ref={cardRef}
        className={clsx(
            "aspect-[9/16] w-full rounded-lg shadow-lg overflow-hidden relative group transition-all hover:shadow-xl",
            !playerVisible && "cursor-pointer bg-card hover:bg-muted/70"
        )}
        onClick={handlePlaceholderClick}
      >
        {!playerVisible ? 
            renderPlaceholder(t('clickToPlay'), true) 
            : renderIframe()
        }
         <div className={clsx(
            "absolute bottom-0 left-0 right-0 p-2 z-10 space-y-1",
            playerVisible ? "bg-gradient-to-t from-black/60 via-black/30 to-transparent" : "bg-gradient-to-t from-card/70 via-card/40 to-transparent"
          )}>
            <Button 
              asChild 
              variant="outline" 
              size="xs" 
              className={clsx(
                "w-full backdrop-blur-sm text-xs",
                playerVisible ? "bg-white/20 hover:bg-white/30 border-white/30 text-white" : "bg-background/70 hover:bg-accent/10 border-border text-foreground"
              )}
              onClick={(e) => { 
                e.stopPropagation(); 
              }} 
            >
              <a href={highlight.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                <PlatformIcon platform={highlight.platform as 'TikTok' | 'Instagram' | 'YouTube'} />
                <span>{t('viewOn')} {highlight.platform}</span>
                <ExternalLink className="ml-auto h-3.5 w-3.5" />
              </a>
            </Button>
        </div>
      </Card>
    );
  }

  // Full-screen feed view (mobile)
  return (
    <div ref={cardRef} className="w-full h-full relative bg-black overflow-hidden shadow-xl rounded-none">
      {(!playerVisible && !isInitiallyVisible) ? 
        renderPlaceholder(t('loadingVideo'))
        : renderIframe()
      }
      { (playerVisible || isInitiallyVisible) && ( 
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent space-y-2">
          <h2 className="text-lg font-bold text-white drop-shadow-md truncate">{highlight.title}</h2>
          {(highlight.username || highlight.location) && (
            <p className="text-xs text-gray-200 drop-shadow-sm truncate">
              {highlight.username && `@${highlight.username}`}
              {highlight.username && highlight.location && ' - '}
              {highlight.location}
            </p>
          )}
          {highlight.description && (
            <p className="text-sm text-gray-100 line-clamp-2 drop-shadow-sm">{highlight.description}</p>
          )}
          <Button asChild variant="outline" size="sm" className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm">
            <a href={highlight.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <PlatformIcon platform={highlight.platform as 'TikTok' | 'Instagram' | 'YouTube'} />
              <span className="ml-2 text-xs sm:text-sm">{t('viewOn')} {highlight.platform}</span>
              <ExternalLink className="ml-auto h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
