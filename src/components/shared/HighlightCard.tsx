// src/components/shared/HighlightCard.tsx
'use client';

import type { LocalHighlight } from '@/services/localHighlights';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink, Instagram, PlayCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext'; // Assuming you might add translations later

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

// Add translations if needed, e.g., for "View on"
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
  // Placeholder for isMounted to prevent hydration errors if translations were complex
  // const [isMounted, setIsMounted] = useState(false);
  // useEffect(() => setIsMounted(true), []);

  const t = (fieldKey: keyof typeof cardTranslations): string => {
    // Basic translation lookup, assuming selectedLanguage is available
    // @ts-ignore
    return cardTranslations[fieldKey]?.[selectedLanguage] || cardTranslations[fieldKey]?.['en'] || String(fieldKey);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-xl rounded-xl bg-card">
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
      <CardContent className="p-0 bg-black"> {/* bg-black helps with iframe letterboxing */}
        <div
          className="w-full relative"
          // TikToks are often 9:16. Instagram can be 1:1, 4:5, or 9:16 for reels.
          // This attempts to create a responsive container.
          // Using a fixed aspect ratio might be better if all videos are similar.
          // For simplicity, a common social media video aspect ratio (e.g. 9:16, then controlled by max-height)
          style={{ 
            paddingBottom: '177.77%', /* 9:16 Aspect Ratio */
            maxHeight: '70vh', /* Limit height on larger screens */
            height: 0, /* Required for padding-bottom trick to work */
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
