// src/components/shared/HighlightCard.tsx
'use client';

import type { LocalHighlight } from '@/services/localHighlights';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

export function HighlightCard({ highlight }: HighlightCardProps) {
  const { selectedLanguage } = useLanguage();
  // const [isMounted, setIsMounted] = useState(false);
  // useEffect(() => setIsMounted(true), []);

  const t = (fieldKey: keyof typeof cardTranslations): string => {
    // @ts-ignore
    return cardTranslations[fieldKey]?.[selectedLanguage] || cardTranslations[fieldKey]?.['en'] || String(fieldKey);
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden shadow-xl rounded-xl bg-card"> {/* Changed max-w-md to max-w-lg */}
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold leading-tight truncate">{highlight.title}</CardTitle>
        {(highlight.username || highlight.location) && (
          <CardDescription className="text-xs truncate">
            {highlight.username && `@${highlight.username}`}
            {highlight.username && highlight.location && ' - '}
            {highlight.location}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-0 bg-black">
        <div
          className="w-full relative"
          style={{ 
            paddingBottom: '177.77%', /* 9:16 Aspect Ratio for TikTok */
            maxHeight: '80vh', /* Increased maxHeight to allow taller videos */
            height: 0, 
          }}
        >
          <iframe
            src={highlight.embedUrl}
            title={highlight.title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            loading="lazy"
          ></iframe>
        </div>
      </CardContent>
      <CardFooter className="p-3 flex flex-col items-start gap-2">
        {highlight.description && <p className="text-sm text-muted-foreground line-clamp-2">{highlight.description}</p>}
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href={highlight.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
            <PlatformIcon platform={highlight.platform} />
            <span className="ml-2 text-xs sm:text-sm">{t('viewOn')} {highlight.platform}</span>
            <ExternalLink className="ml-auto h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
