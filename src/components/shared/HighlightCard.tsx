// src/components/shared/HighlightCard.tsx
'use client';

import type { LocalHighlight } from '@/services/localHighlights';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Instagram, PlayCircle, Youtube, Film } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

// Helper for platform icon
const PlatformIcon = ({ platform }: { platform: 'TikTok' | 'Instagram' | 'YouTube' }) => {
  if (platform === 'Instagram') {
    return <Instagram className="h-5 w-5" />;
  }
  if (platform === 'YouTube') {
    return <Youtube className="h-5 w-5" />;
  }
  return <Film className="h-5 w-5" />; // Generic for TikTok or others
};

interface HighlightCardProps {
  highlight: LocalHighlight;
  isObserved: boolean; 
  isGridView: boolean;
}

const cardTranslations = {
  viewOn: {
    en: 'View on',
    it: 'Guarda su',
    de: 'Ansehen auf',
    pl: 'Zobacz na',
    fr: 'Voir sur',
    es: 'Ver en'
  },
  // clickToWatch removed as the button is removed, card itself is the trigger
};

export function HighlightCard({ highlight, isObserved, isGridView }: HighlightCardProps) {
  const { selectedLanguage } = useLanguage();
  const [playerVisible, setPlayerVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = (fieldKey: keyof typeof cardTranslations): string => {
    if (!isMounted) return cardTranslations[fieldKey]?.['en'] || String(fieldKey);
    // @ts-ignore
    return cardTranslations[fieldKey]?.[selectedLanguage] || cardTranslations[fieldKey]?.['en'] || String(fieldKey);
  };

  const handlePlaceholderClick = () => {
    if (isGridView) {
      setPlayerVisible(true);
    }
  };

  if (!isMounted) {
    // Skeleton for SSR and initial mount
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
    return (
      <div className="w-full h-full relative bg-black overflow-hidden shadow-xl rounded-none animate-pulse">
         <div className="absolute inset-0 bg-muted/30"></div>
      </div>
    );
  }


  if (isGridView) {
    return (
      <Card 
        className={clsx(
            "aspect-[9/16] w-full rounded-lg shadow-lg overflow-hidden relative group transition-all hover:shadow-xl",
            !playerVisible && "cursor-pointer bg-muted/50 hover:bg-muted/60"
        )}
        onClick={!playerVisible ? handlePlaceholderClick : undefined}
      >
        {!playerVisible ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <PlayCircle className="h-16 w-16 text-primary/60 mb-3 group-hover:text-primary/80 transition-colors" />
            <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">{highlight.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">@{highlight.username || highlight.platform}</p>
          </div>
        ) : (
          <iframe
            src={highlight.embedUrl}
            title={highlight.title}
            className="w-full h-full absolute top-0 left-0 border-0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
        )}
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
                if (!playerVisible) { // If player not visible, this button click should not trigger card click
                    e.stopPropagation(); 
                }
                // Allow link to open normally
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
    <div className="w-full h-full relative bg-black overflow-hidden shadow-xl rounded-none">
      <iframe
        src={highlight.embedUrl}
        title={highlight.title}
        className="absolute top-0 left-0 w-full h-full border-0 max-w-none"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>

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
    </div>
  );
}

