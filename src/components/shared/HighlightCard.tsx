// src/components/shared/HighlightCard.tsx
'use client';

import type { LocalHighlight } from '@/services/localHighlights';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Instagram, PlayCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper for platform icon
const PlatformIcon = ({ platform }: { platform: 'TikTok' | 'Instagram' }) => {
  if (platform === 'Instagram') {
    return <Instagram className="h-5 w-5" />;
  }
  return <PlayCircle className="h-5 w-5" />; // Generic for TikTok
};

interface HighlightCardProps {
  highlight: LocalHighlight;
  isObserved: boolean; 
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
};

export function HighlightCard({ highlight, isObserved }: HighlightCardProps) {
  const { selectedLanguage } = useLanguage();

  const t = (fieldKey: keyof typeof cardTranslations): string => {
    // @ts-ignore
    return cardTranslations[fieldKey]?.[selectedLanguage] || cardTranslations[fieldKey]?.['en'] || String(fieldKey);
  };

  return (
    <Card className="w-full h-full relative bg-black overflow-hidden shadow-xl rounded-none">
      <iframe
        src={highlight.embedUrl}
        title={highlight.title}
        className="absolute top-0 left-0 w-full h-full border-0 max-w-none"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        loading="lazy"
      ></iframe>

      {/* Overlay for Information */}
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
            <PlatformIcon platform={highlight.platform} />
            <span className="ml-2 text-xs sm:text-sm">{t('viewOn')} {highlight.platform}</span>
            <ExternalLink className="ml-auto h-4 w-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
}
