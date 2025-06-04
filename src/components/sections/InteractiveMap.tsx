// src/components/sections/InteractiveMap.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Define TypeScript interfaces for GeoJSON (kept for future use if we re-add features)
export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJSONFeatureProperties {
  name: string;
  menu?: string[];
  parking?: string;
  rating?: number;
  images?: string[];
}

export interface GeoJSONFeature {
  type: 'Feature';
  id?: string | number;
  geometry: GeoJSONPoint;
  properties: GeoJSONFeatureProperties;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

const translations = {
  mapTitle: {
    en: 'Interactive Locations Map',
    it: 'Mappa Interattiva delle Località',
    de: 'Interaktive Ortskarte',
    pl: 'Interaktywna Mapa Lokalizacji',
    fr: 'Carte Interactive des Lieux',
    es: 'Mapa Interactivo de Ubicaciones',
  },
  loading: {
    en: 'Loading map...',
    it: 'Caricamento mappa...',
    de: 'Lade Karte...',
    pl: 'Ładowanie mapy...',
    fr: 'Chargement de la carte...',
    es: 'Cargando mapa...',
  },
  errorLoadingMap: {
    en: 'Error loading map. Please try again later.',
    it: 'Errore caricamento mappa. Riprova più tardi.',
    de: 'Fehler beim Laden der Karte. Bitte später erneut versuchen.',
    pl: 'Błąd ładowania mapy. Spróbuj ponownie później.',
    fr: 'Erreur de chargement de la carte. Veuillez réessayer plus tard.',
    es: 'Error al cargar el mapa. Por favor, inténtalo de nuevo más tarde.',
  },
  tileError: {
    en: 'Failed to load map tiles. Please check your network connection.',
    it: 'Errore caricamento porzioni mappa. Controlla la connessione.',
    de: 'Kartenkacheln konnten nicht geladen werden. Netzwerkverbindung prüfen.',
    pl: 'Błąd ładowania kafelków mapy. Sprawdź połączenie sieciowe.',
    fr: 'Échec du chargement des tuiles de la carte. Vérifiez votre connexion réseau.',
    es: 'Error al cargar las teselas del mapa. Comprueba tu conexión de red.',
  },
};

declare var L: any; // Declare L for Leaflet

export function InteractiveMap() {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);

  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const t = useCallback(
    (fieldKey: keyof typeof translations): string => {
      const langToUse = isMounted ? selectedLanguage : 'en';
      // @ts-ignore
      const translation = translations[fieldKey]?.[langToUse] || translations[fieldKey]?.['en'];
      return typeof translation === 'string' ? translation : String(fieldKey);
    },
    [isMounted, selectedLanguage]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (leafletLoaded && isMounted && mapContainerRef.current && !mapRef.current) {
      setIsLoadingMap(true);
      setMapError(null);

      // Delay Leaflet initialization to ensure DOM is fully ready
      const timerId = setTimeout(() => {
        if (mapContainerRef.current && !mapRef.current) { // Double check refs before init
          try {
            console.log('Attempting Leaflet map initialization inside setTimeout...');
            const mapInstance = L.map(mapContainerRef.current, {
              // preferCanvas: true, // Optional: Can try re-enabling if issues persist
            }).setView([44.1, 15.2], 8); // Initial center (Croatia) and zoom level

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
              tileSize: 256,
              zoomOffset: 0,
            }).on('tileerror', (tileErrorEvent: any) => {
                console.error('Tile loading error:', tileErrorEvent.error, tileErrorEvent.tile);
                setMapError(t('tileError'));
            }).addTo(mapInstance);
            
            mapRef.current = mapInstance;

            mapInstance.whenReady(() => {
              console.log("Map is ready. Invalidating size with requestAnimationFrame.");
              requestAnimationFrame(() => {
                if (mapRef.current) {
                  mapRef.current.invalidateSize(true);
                  console.log("Map size invalidated via rAF.");
                }
              });
              setIsLoadingMap(false); 
            });

          } catch (e:any) {
            console.error("Leaflet map initialization error inside setTimeout:", e);
            setMapError(t('errorLoadingMap') + (e.message ? ` (${e.message})` : ''));
            setIsLoadingMap(false);
          }
        }
      }, 0); // setTimeout with 0ms delay

      return () => {
        clearTimeout(timerId); // Clear timeout on cleanup
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          console.log("Leaflet map instance removed on cleanup.");
        }
      };
    }
  }, [leafletLoaded, isMounted, t]);


  // Placeholder for SSR and initial client render
  if (!isMounted) { 
    return (
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-background p-6">
               <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-0"> {/* Ensure no padding on direct parent of map container */}
              <div className="w-full bg-muted flex items-center justify-center" style={{height: '500px'}}>
                 <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin="anonymous" 
        />
      </Head>
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin="anonymous"
        onLoad={() => {
          setLeafletLoaded(true);
          console.log("Leaflet script loaded.");
        }}
        onError={(e) => {
            console.error('Leaflet script failed to load:', e);
            setMapError('Failed to load map library.');
            setIsLoadingMap(false);
        }}
        strategy="afterInteractive"
      />
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-background p-6">
              <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
                <MapPin className="h-8 w-8" />
                {t('mapTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0"> {/* Ensure no padding on direct parent of map container */}
              <div 
                id="interactive-map-container-outer" 
                className="w-full rounded-b-lg overflow-hidden relative bg-muted"
              >
                <div 
                  ref={mapContainerRef}
                  id="interactive-map-container" 
                  style={{ 
                    width: '100%',
                    height: '500px', // Explicit fixed height
                    position: 'relative', 
                    background: (isLoadingMap && !mapRef.current) ? 'hsl(var(--muted))' : 'transparent'
                  }}
                />
                {/* Loading Indicator */}
                {(isLoadingMap && leafletLoaded) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 backdrop-blur-sm pointer-events-none">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                    <p className="text-lg text-muted-foreground">{t('loading')}</p>
                  </div>
                )}
                {/* Error Message Overlay */}
                {mapError && !isLoadingMap && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/20 text-destructive z-10 p-4 text-center backdrop-blur-sm pointer-events-none">
                    <AlertTriangle className="h-10 w-10 mb-2" />
                    <p className="font-semibold">Map Error</p>
                    <p className="text-sm">{mapError}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
