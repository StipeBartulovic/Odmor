// src/components/shared/HighlightCard.tsx
'use client';

import type { LocalHighlight } from '@/services/localHighlights';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'; // Keep Card for grid view styling
import { ExternalLink, Instagram, PlayCircle, Youtube, Film } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
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
  clickToWatch: {
    en: 'Click to Watch',
    it: 'Clicca per Guardare',
    de: 'Klicken zum Anschauen',
    pl: 'Kliknij, aby Obejrzeć',
    fr: 'Cliquez pour Regarder',
    es: 'Haz Clic para Ver'
  }
};

export function HighlightCard({ highlight, isObserved, isGridView }: HighlightCardProps) {
  const { selectedLanguage } = useLanguage();
  const [playerVisible, setPlayerVisible] = useState(false);

  const t = (fieldKey: keyof typeof cardTranslations): string => {
    // @ts-ignore
    return cardTranslations[fieldKey]?.[selectedLanguage] || cardTranslations[fieldKey]?.['en'] || String(fieldKey);
  };

  const handlePlaceholderClick = () => {
    if (isGridView) {
      setPlayerVisible(true);
    }
  };

  if (isGridView) {
    return (
      <Card 
        className="aspect-[9/16] w-full rounded-lg shadow-lg overflow-hidden relative bg-background/50 cursor-pointer group transition-all hover:shadow-xl"
        onClick={handlePlaceholderClick}
      >
        {!playerVisible ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-muted/30 group-hover:bg-muted/50 transition-colors">
            <PlayCircle className="h-16 w-16 text-primary/70 mb-3 group-hover:text-primary transition-colors" />
            <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-2">{highlight.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">@{highlight.username || highlight.platform}</p>
            <Button variant="outline" size="sm" className="pointer-events-none bg-background/70">
              {t('clickToWatch')}
            </Button>
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
        {/* Overlay for info - always visible in grid, even on placeholder */}
         <div className={clsx(
            "absolute bottom-0 left-0 right-0 p-3 z-10 space-y-1",
            playerVisible ? "bg-gradient-to-t from-black/70 via-black/40 to-transparent" : "bg-gradient-to-t from-card/80 via-card/50 to-transparent"
          )}>
            {!playerVisible && ( /* Only show title again if placeholder isn't showing it to avoid redundancy */
                 <h2 className="text-sm font-semibold text-foreground drop-shadow-sm truncate">{highlight.title}</h2>
            )}
            <Button 
              asChild 
              variant="outline" 
              size="xs" // Smaller button for grid card
              className={clsx(
                "w-full backdrop-blur-sm text-xs",
                playerVisible ? "bg-white/20 hover:bg-white/30 border-white/30 text-white" : "bg-secondary hover:bg-secondary/80 border-border text-secondary-foreground"
              )}
              onClick={(e) => e.stopPropagation()} // Prevent card click if button is for external link
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
