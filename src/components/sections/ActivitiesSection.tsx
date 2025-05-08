"use client";

import type { Activity } from '@/services/activities';
import { getActivities } from '@/services/activities';
import { useEffect, useState } from 'react';
import { ActivityCard } from '@/components/shared/ActivityCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mountain, Waves, Trees, Building, Ticket, Zap, VenetianMask, Loader2, Landmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';

const translations = {
  sectionTitle: {
    en: 'Things to Do',
    it: 'Cose da Fare',
    de: 'Dinge zu tun',
    pl: 'Co Robić',
    fr: 'Choses à Faire',
    es: 'Cosas que Hacer',
  },
  freeActivitiesTitle: {
    en: 'Free Activities',
    it: 'Attività Gratuite',
    de: 'Kostenlose Aktivitäten',
    pl: 'Darmowe Aktywności',
    fr: 'Activités Gratuites',
    es: 'Actividades Gratuitas',
  },
  paidActivitiesTitle: {
    en: 'Paid Activities',
    it: 'Attività a Pagamento',
    de: 'Bezahlte Aktivitäten',
    pl: 'Płatne Aktywności',
    fr: 'Activités Payantes',
    es: 'Actividades de Pago',
  },
  noFreeActivities: {
    en: 'No free activities listed currently.',
    it: 'Nessuna attività gratuita elencata al momento.',
    de: 'Derzeit sind keine kostenlosen Aktivitäten aufgeführt.',
    pl: 'Obecnie brak darmowych aktywności.',
    fr: 'Aucune activité gratuite répertoriée actuellement.',
    es: 'No hay actividades gratuitas listadas actualmente.',
  },
  noPaidActivities: {
    en: 'No paid activities listed currently.',
    it: 'Nessuna attività a pagamento elencata al momento.',
    de: 'Derzeit sind keine kostenpflichtigen Aktivitäten aufgeführt.',
    pl: 'Obecnie brak płatnych aktywności.',
    fr: 'Aucune activité payante répertoriée actuellement.',
    es: 'No hay actividades de pago listadas actualmente.',
  },
  loading: {
    en: 'Loading activities...',
    it: 'Caricamento attività...',
    de: 'Lade Aktivitäten...',
    pl: 'Ładowanie aktywności...',
    fr: 'Chargement des activités...',
    es: 'Cargando actividades...',
  }
};

const getActivityIcon = (activityName: string): React.ElementType => {
  const lowerName = activityName.toLowerCase();
  if (lowerName.includes('walk') || lowerName.includes('trail') || lowerName.includes('jogging')) return Trees;
  if (lowerName.includes('beach')) return Waves;
  if (lowerName.includes('viewpoint') || lowerName.includes('park')) return Mountain;
  if (lowerName.includes('museum') || lowerName.includes('national park')) return Building;
  if (lowerName.includes('rafting') || lowerName.includes('kayaking') || lowerName.includes('quad') || lowerName.includes('zipline')) return Zap;
  if (lowerName.includes('tour') || lowerName.includes('nightlife') || lowerName.includes('playroom')) return VenetianMask;
  if (lowerName.includes('old town') || lowerName.includes('historic')) return Landmark;
  return Ticket; 
};


export function ActivitiesSection() {
  const { selectedLanguage } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    async function loadActivities() {
      const fetchedActivities = await getActivities();
      // For demo: Add more diverse activities. These names/descriptions would also need translation.
      const demoActivities: Activity[] = [
        { 
          name: "Old Town Walk", 
          description: "Explore the historic streets and landmarks of Split's Old Town.", 
          iconUrl: "https://picsum.photos/300/200?random=oldtown", 
          isFree: true, 
          dataAiHint: "old town", 
          subActivities: [
            { name: "Diocletian's Palace Self-Guided Tour", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Diocletian's+Palace+Split+Croatia" },
            { name: "Stroll along Riva Promenade", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Riva+Promenade+Split+Croatia" },
            { name: "Visit Pjaca (People's Square)", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pjaca+Split+Croatia" }
          ]
        },
        { name: "Zipline Adventure", description: "Soar through the treetops on an exhilarating zipline course.", iconUrl: "https://picsum.photos/300/200?random=zipline", isFree: false, dataAiHint: "zipline forest" },
      ];
      setActivities([...fetchedActivities, ...demoActivities]);
    }
    loadActivities();
  }, []);
  
  const t = (fieldKey: keyof typeof translations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    return translations[fieldKey][langToUse] || translations[fieldKey]['en'];
  };

  if (!isMounted) {
    return (
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl">
            <CardHeader className="bg-muted/50 p-6">
               <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg text-muted-foreground">{t('loading')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }


  const freeActivities = activities.filter(activity => activity.isFree);
  const paidActivities = activities.filter(activity => !activity.isFree);

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl">
          <CardHeader className="bg-muted/50 p-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary">
              {t('sectionTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <Leaf className="h-6 w-6" /> {t('freeActivitiesTitle')}
                </h2>
                {freeActivities.length > 0 ? (
                  <div className="space-y-6">
                    {freeActivities.map((activity, index) => (
                      <ActivityCard key={`free-${index}`} activity={activity} icon={getActivityIcon(activity.name)} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t('noFreeActivities')}</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <Ticket className="h-6 w-6" /> {t('paidActivitiesTitle')}
                </h2>
                {paidActivities.length > 0 ? (
                  <div className="space-y-6">
                    {paidActivities.map((activity, index) => (
                      <ActivityCard key={`paid-${index}`} activity={activity} icon={getActivityIcon(activity.name)} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{t('noPaidActivities')}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Keeping Leaf icon as it's generic
const Leaf = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 20A7 7 0 0 1 4 13H2a10 10 0 0 0 10 10z"/>
    <path d="M12 18c0-5.5 4.5-10 10-10h-2c-4.4 0-8 3.6-8 8v2"/>
  </svg>
);

