
// src/components/sections/InteractiveMap.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type mapboxgl from 'mapbox-gl'; // For type usage

// TypeScript interfaces for GeoJSON (kept for future use if we add features)
export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJSONFeatureProperties {
  name: string;
  description?: string;
  [key: string]: any;
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
  missingTokenError: {
    en: 'Mapbox Access Token is missing. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env file.',
    it: 'Token di Accesso Mapbox mancante. Imposta NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN nel tuo file .env.',
    de: 'Mapbox Access Token fehlt. Bitte NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in Ihrer .env-Datei festlegen.',
    pl: 'Brak Tokena Dostępu Mapbox. Ustaw NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN w pliku .env.',
    fr: 'Le jeton d\'accès Mapbox est manquant. Veuillez définir NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN dans votre fichier .env.',
    es: 'Falta el Token de Acceso de Mapbox. Por favor, establece NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN en tu archivo .env.',
  }
};

// Declare mapboxgl for global scope if using CDN
declare global {
  interface Window {
    mapboxgl: typeof mapboxgl;
  }
}

export function InteractiveMap() {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);

  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

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
    if (mapboxLoaded && isMounted && mapContainerRef.current && !mapInstanceRef.current) {
      if (!MAPBOX_ACCESS_TOKEN) {
        console.error('Mapbox Access Token is missing.');
        setMapError(t('missingTokenError'));
        setIsLoadingMap(false);
        return;
      }

      setIsLoadingMap(true);
      setMapError(null);
      
      window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
      const map = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/stipe331/cmayj3i9b009z01s6bq1j0rj1', // Your custom style
        center: [16.440193, 43.508133], // Default center (Split, Croatia)
        zoom: 7, // Default zoom
      });

      map.on('load', () => {
        mapInstanceRef.current = map;
        setIsLoadingMap(false);
        // Add navigation controls
        map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
        // Add fullscreen control
        map.addControl(new window.mapboxgl.FullscreenControl());
        // You can add data loading logic here if needed in the future
        // e.g., map.addSource(...), map.addLayer(...)
      });

      map.on('error', (e) => {
        console.error('Mapbox GL JS error:', e);
        setMapError(t('errorLoadingMap') + (e.error?.message ? ` (${e.error.message})` : ''));
        setIsLoadingMap(false);
      });
      
      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      if(mapContainerRef.current) {
        resizeObserver.observe(mapContainerRef.current);
      }
      
      const windowResizeHandler = () => map.resize();
      window.addEventListener('resize', windowResizeHandler);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        if(mapContainerRef.current) {
            resizeObserver.unobserve(mapContainerRef.current);
        }
        resizeObserver.disconnect();
        window.removeEventListener('resize', windowResizeHandler);
      };
    }
  }, [mapboxLoaded, isMounted, t, MAPBOX_ACCESS_TOKEN]);


  if (!isMounted) {
    return (
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-background p-6">
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full bg-muted flex items-center justify-center" style={{ height: '500px' }}>
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
          href="https://api.mapbox.com/mapbox-gl-js/v3.5.1/mapbox-gl.css" // Updated to a recent version
          rel="stylesheet"
        />
      </Head>
      <Script
        src="https://api.mapbox.com/mapbox-gl-js/v3.5.1/mapbox-gl.js" // Updated to a recent version
        onLoad={() => {
          setMapboxLoaded(true);
        }}
        onError={(e) => {
          console.error('Mapbox GL JS script failed to load:', e);
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
            <CardContent className="p-0">
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
                    background: (isLoadingMap || mapError) ? 'hsl(var(--muted))' : 'transparent'
                  }}
                />
                {(isLoadingMap && !mapError) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 backdrop-blur-sm pointer-events-none">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                    <p className="text-lg text-muted-foreground">{t('loading')}</p>
                  </div>
                )}
                {mapError && (
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
