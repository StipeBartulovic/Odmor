// src/components/shared/HighlightCard.tsx
'use client';

import type { LocalHighlight } from '@/services/localHighlights';
import { Button } from '@/components/ui/button';
import { ExternalLink, Instagram, PlayCircle, Youtube, Film, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
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
}

const cardTranslations = {
  viewOn: {
    en: 'View on', it: 'Guarda su', de: 'Ansehen auf', pl: 'Zobacz na', fr: 'Voir sur', es: 'Ver en'
  },
  loadingVideo: {
    en: 'Loading video...', it: 'Caricamento video...', de: 'Video lädt...', pl: 'Ładowanie wideo...', fr: 'Chargement de la vidéo...', es: 'Cargando vídeo...'
  }
};

export function HighlightCard({ highlight }: HighlightCardProps) {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // Used to force iframe reload

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Reset iframe key when highlight changes to force reload
  useEffect(() => {
    setIframeKey(prevKey => prevKey + 1);
  }, [highlight.id]);


  const t = (fieldKey: keyof typeof cardTranslations): string => {
    if (!isMounted) return cardTranslations[fieldKey]?.['en'] || String(fieldKey);
    const langToUse = selectedLanguage;
    // @ts-ignore
    return cardTranslations[fieldKey]?.[langToUse] || cardTranslations[fieldKey]?.['en'] || String(fieldKey);
  };
  
  const renderIframe = () => (
    <iframe
        key={iframeKey} // Force re-render when highlight changes
        src={highlight.embedUrl}
        title={highlight.title}
        className="w-full h-full absolute top-0 left-0 border-0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="eager" // Load eagerly since it's the only video
        referrerPolicy="no-referrer" 
      ></iframe>
  );

  if (!isMounted) {
    return (
        <div className="w-full h-full relative bg-muted animate-pulse flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-black overflow-hidden shadow-xl">
      {renderIframe()}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent space-y-1.5 sm:space-y-2">
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
