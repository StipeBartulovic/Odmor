
// src/components/sections/InteractiveMap.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertTriangle, Maximize, Minimize } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type mapboxgl from 'mapbox-gl';
import { Button } from '@/components/ui/button';

// TypeScript interfaces for GeoJSON
export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJSONFeatureProperties {
  name: string;
  description?: string; // General description
  menu?: string[];
  parking?: string;
  rating?: number;
  images?: string[];
  [key: string]: any; // Allow other properties
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
    en: 'Loading map & locations...',
    it: 'Caricamento mappa e località...',
    de: 'Lade Karte & Standorte...',
    pl: 'Ładowanie mapy i lokalizacji...',
    fr: 'Chargement de la carte et des lieux...',
    es: 'Cargando mapa y ubicaciones...',
  },
  errorLoadingMap: {
    en: 'Error loading map. Please try again later.',
    it: 'Errore caricamento mappa. Riprova più tardi.',
    de: 'Fehler beim Laden der Karte. Bitte später erneut versuchen.',
    pl: 'Błąd ładowania mapy. Spróbuj ponownie później.',
    fr: 'Erreur de chargement de la carte. Veuillez réessayer plus tard.',
    es: 'Error al cargar el mapa. Por favor, inténtalo de nuevo más tarde.',
  },
  errorLoadingLocations: {
    en: 'Error loading locations. Please try again later.',
    it: 'Errore durante il caricamento delle località. Riprova più tardi.',
    de: 'Fehler beim Laden der Standorte. Bitte versuchen Sie es später erneut.',
    pl: 'Błąd podczas ładowania lokalizacji. Spróbuj ponownie później.',
    fr: 'Erreur lors du chargement des lieux. Veuillez réessayer plus tard.',
    es: 'Error al cargar las ubicaciones. Inténtalo de nuevo más tarde.',
  },
  missingTokenError: {
    en: 'Mapbox Access Token is missing. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env file.',
    it: 'Token di Accesso Mapbox mancante. Imposta NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN nel tuo file .env.',
    de: 'Mapbox Access Token fehlt. Bitte NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in Ihrer .env-Datei festlegen.',
    pl: 'Brak Tokena Dostępu Mapbox. Ustaw NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN w pliku .env.',
    fr: 'Le jeton d\'accès Mapbox est manquant. Veuillez définir NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN dans votre fichier .env.',
    es: 'Falta el Token de Acceso de Mapbox. Por favor, establece NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN en tu archivo .env.',
  },
  fullscreenEnter: {
    en: 'Enter Fullscreen',
    it: 'Schermo Intero',
    de: 'Vollbild',
    pl: 'Pełny Ekran',
    fr: 'Plein Écran',
    es: 'Pantalla Completa',
  },
  fullscreenExit: {
    en: 'Exit Fullscreen',
    it: 'Esci da Schermo Intero',
    de: 'Vollbild Beenden',
    pl: 'Opuść Pełny Ekran',
    fr: 'Quitter Plein Écran',
    es: 'Salir de Pantalla Completa',
  }
};

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
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const t = useCallback(
    (fieldKey: keyof typeof translations): string => {
      const langToUse = isMounted ? selectedLanguage : 'en';
      const translation = translations[fieldKey]?.[langToUse as keyof typeof translations[keyof typeof translations]] || translations[fieldKey]?.['en'];
      return typeof translation === 'string' ? translation : String(fieldKey);
    },
    [isMounted, selectedLanguage]
  );

  const loadLocations = useCallback(async (map: mapboxgl.Map) => {
    setIsLoadingLocations(true);
    setMapError(null);
    try {
      const response = await fetch('/api/locations');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch locations: ${response.status} ${errorText}`);
      }
      const data: GeoJSONFeatureCollection = await response.json();

      if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
        console.warn('Invalid or empty GeoJSON data received:', data);
        if (map.getSource('locations-data')) {
          (map.getSource('locations-data') as mapboxgl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [] });
        }
        // Don't throw an error for empty valid GeoJSON, just show an empty map.
        // throw new Error('Invalid GeoJSON data format');
        return;
      }
      
      if (map.getSource('locations-data')) {
        (map.getSource('locations-data') as mapboxgl.GeoJSONSource).setData(data);
      } else {
        map.addSource('locations-data', {
          type: 'geojson',
          data: data,
        });
      }

      if (!map.getLayer('location-points')) {
        map.addLayer({
          id: 'location-points',
          type: 'circle',
          source: 'locations-data',
          paint: {
            'circle-radius': 8,
            'circle-color': 'hsl(var(--primary))',
            'circle-stroke-width': 2,
            'circle-stroke-color': 'hsl(var(--background))',
          },
        });

        map.on('mouseenter', 'location-points', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'location-points', () => {
          map.getCanvas().style.cursor = '';
        });

        map.on('click', 'location-points', (e: mapboxgl.MapLayerMouseEvent) => {
          if (popupRef.current) {
            popupRef.current.remove();
          }
          if (!e.features || e.features.length === 0) return;

          const feature = e.features[0] as unknown as GeoJSONFeature; // Cast to our GeoJSONFeature
          const coordinates = (feature.geometry as GeoJSONPoint).coordinates.slice() as [number, number];
          const props = feature.properties as GeoJSONFeatureProperties;

          // Ensure longitude/latitude are numbers
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          
          const name = props.name || 'Unknown Location';
          const menuItems = Array.isArray(props.menu) && props.menu.length > 0 ? props.menu.join(', ') : 'N/A';
          const parkingInfo = props.parking || 'N/A';
          const ratingInfo = props.rating !== undefined ? `${props.rating}/5` : 'N/A';
          const imageHtml = Array.isArray(props.images) && props.images[0] 
            ? `<img src="${props.images[0]}" alt="${name}" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 4px; margin-top: 8px;" data-ai-hint="location image" />` 
            : '';

          const popupContent = `
            <div style="font-family: var(--font-geist-sans), Arial, sans-serif; max-width: 250px; line-height: 1.4;">
              <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 1.1em; color: hsl(var(--primary));">${name}</h3>
              ${props.description ? `<p style="margin: 4px 0; font-size: 0.9em;">${props.description}</p>` : ''}
              <p style="margin: 4px 0; font-size: 0.9em;"><strong>Meni:</strong> ${menuItems}</p>
              <p style="margin: 4px 0; font-size: 0.9em;"><strong>Parking:</strong> ${parkingInfo}</p>
              <p style="margin: 4px 0; font-size: 0.9em;"><strong>Ocjena:</strong> ${ratingInfo}</p>
              ${imageHtml}
            </div>
          `;
          
          popupRef.current = new window.mapboxgl.Popup({ offset: 25, closeButton: true, closeOnClick: true })
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
        });
      }
    } catch (err: any) {
      console.error('Error loading locations:', err);
      setMapError(t('errorLoadingLocations') + (err.message ? ` (${err.message})` : ''));
    } finally {
      setIsLoadingLocations(false);
    }
  }, [t]);

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
      
      try {
        window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        const map = new window.mapboxgl.Map({
          container: mapContainerRef.current!,
          style: 'mapbox://styles/stipe331/cmayj3i9b009z01s6bq1j0rj1',
          center: [16.440193, 43.508133],
          zoom: 7,
        });

        map.on('load', () => {
          mapInstanceRef.current = map;
          setIsLoadingMap(false);
          map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
          map.addControl(new window.mapboxgl.FullscreenControl());
          
          loadLocations(map); // Load locations once map is ready
        });

        map.on('error', (e) => {
          console.error('Mapbox GL JS error:', e);
          setMapError(t('errorLoadingMap') + (e.error?.message ? ` (${e.error.message})` : ''));
          setIsLoadingMap(false);
        });
        
        const resizeObserver = new ResizeObserver(() => {
          map.resize();
        });
        if(mapContainerRef.current) {
          resizeObserver.observe(mapContainerRef.current);
        }
        
        const windowResizeHandler = () => map.resize();
        window.addEventListener('resize', windowResizeHandler);

        // Cleanup function
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
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }
        };
      } catch (e: any) {
        console.error("Mapbox initialization error:", e);
        setMapError(t('errorLoadingMap') + (e.message ? ` (${e.message})` : ''));
        setIsLoadingMap(false);
      }
    }
  }, [mapboxLoaded, isMounted, t, MAPBOX_ACCESS_TOKEN, loadLocations]);

  const toggleFullscreen = useCallback(() => {
    if (!mapContainerRef.current || !mapInstanceRef.current) return;

    const mapDiv = mapContainerRef.current.parentElement; // The one with aspect ratio
    if (!mapDiv) return;

    if (!isFullscreen) {
      if (mapDiv.requestFullscreen) {
        mapDiv.requestFullscreen();
      } else if ((mapDiv as any).webkitRequestFullscreen) { /* Safari */
        (mapDiv as any).webkitRequestFullscreen();
      } else if ((mapDiv as any).msRequestFullscreen) { /* IE11 */
        (mapDiv as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) { /* Safari */
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) { /* IE11 */
        (document as any).msExitFullscreen();
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
      if (mapInstanceRef.current) {
        // Wait for CSS transitions and then invalidate size
        setTimeout(() => mapInstanceRef.current?.resize(), 100);
      }
    };

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
    document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
    document.addEventListener('MSFullscreenChange', fullscreenChangeHandler);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('MSFullscreenChange', fullscreenChangeHandler);
    };
  }, []);


  if (!isMounted) {
    return (
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-background p-6">
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center" style={{ height: '500px' }}>
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
          href="https://api.mapbox.com/mapbox-gl-js/v3.5.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <Script
        src="https://api.mapbox.com/mapbox-gl-js/v3.5.1/mapbox-gl.js"
        onLoad={() => {
          setMapboxLoaded(true);
        }}
        onError={(e) => {
          console.error('Mapbox GL JS script failed to load:', e);
          setMapError(t('errorLoadingMap'));
          setIsLoadingMap(false);
        }}
        strategy="afterInteractive"
      />
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-background p-6">
              <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-8 w-8" />
                  {t('mapTitle')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div
                id="interactive-map-container-outer"
                className="w-full rounded-b-lg overflow-hidden relative bg-muted"
                style={{ height: '500px' }} 
              >
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={toggleFullscreen} 
                    className="absolute top-2 right-12 z-10 bg-background/80 hover:bg-background"
                    aria-label={isFullscreen ? t('fullscreenExit') : t('fullscreenEnter')}
                    title={isFullscreen ? t('fullscreenExit') : t('fullscreenEnter')}
                >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
                <div
                  ref={mapContainerRef}
                  id="interactive-map-container"
                  className="w-full h-full"
                />
                {(isLoadingMap || isLoadingLocations) && !mapError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-20 backdrop-blur-sm pointer-events-none">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                    <p className="text-lg text-muted-foreground">{t('loading')}</p>
                  </div>
                )}
                {mapError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/20 text-destructive z-20 p-4 text-center backdrop-blur-sm pointer-events-none">
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

    