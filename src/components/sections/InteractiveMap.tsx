// src/components/sections/InteractiveMap.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertTriangle } from 'lucide-react'; // Removed Maximize, Minimize
import { useLanguage } from '@/contexts/LanguageContext';
// import { Button } from '@/components/ui/button'; // Commented out as fullscreen is removed for now

// Define TypeScript interfaces for GeoJSON (kept for future use)
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
    en: 'Loading map...', // Simplified message
    it: 'Caricamento mappa...',
    de: 'Lade Karte...',
    pl: 'Ładowanie mapy...',
    fr: 'Chargement de la carte...',
    es: 'Cargando mapa...',
  },
  errorLoading: { // Kept for future GeoJSON loading
    en: 'Error loading locations. Please try again later.',
    it: 'Errore durante il caricamento delle località. Riprova più tardi.',
    de: 'Fehler beim Laden der Standorte. Bitte versuchen Sie es später erneut.',
    pl: 'Błąd podczas ładowania lokalizacji. Spróbuj ponownie później.',
    fr: 'Erreur lors du chargement des lieux. Veuillez réessayer plus tard.',
    es: 'Error al cargar las ubicaciones. Inténtalo de nuevo más tarde.',
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

declare var L: any;

export function InteractiveMap() {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // True until map is ready

  const mapRef = useRef<any>(null);
  // const geoLayerRef = useRef<any>(null); // Commented out for basic map
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const t = useCallback(
    (fieldKey: keyof typeof translations): string => {
      const langToUse = isMounted ? selectedLanguage : 'en';
      const translation = translations[fieldKey]?.[langToUse] || translations[fieldKey]?.['en'];
      return typeof translation === 'string' ? translation : String(fieldKey);
    },
    [isMounted, selectedLanguage]
  );

  // Commented out loadLocations function as we are only showing a basic map
  /*
  const loadLocations = useCallback(
    async (isInitialLoad = false) => {
      // ... (implementation commented out) ...
    },
    [t]
  );
  */

  useEffect(() => {
    if (leafletLoaded && isMounted && mapContainerRef.current && !mapRef.current) {
      setIsLoading(true); // Set loading true before map init
      setError(null);
      try {
        const mapInstance = L.map(mapContainerRef.current, {
          // preferCanvas: true, // Keep commented for now
        }).setView([44.1, 15.2], 8); // Initial center and zoom for Croatia

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          tileSize: 256,
          zoomOffset: 0,
        }).on('tileerror', (tileErrorEvent: any) => {
            console.error('Tile loading error:', tileErrorEvent.error, tileErrorEvent.tile);
            setError(t('tileError'));
            setIsLoading(false); // Stop loading on tile error
        }).addTo(mapInstance);
        
        mapRef.current = mapInstance;

        mapInstance.whenReady(() => {
          console.log("Map is ready. Invalidating size with requestAnimationFrame.");
          requestAnimationFrame(() => {
            if (mapRef.current) {
              mapRef.current.invalidateSize(true);
               // Fallback with setTimeout
              setTimeout(() => {
                if (mapRef.current) {
                  mapRef.current.invalidateSize(true);
                  console.log("Map invalidated with setTimeout fallback after rAF.");
                }
              }, 100);
            }
          });
          setIsLoading(false); // Map is ready and attempted to invalidate
          // loadLocations(true); // Still commented out for basic map
        });

      } catch (e:any) {
        console.error("Leaflet map initialization error:", e);
        setError("Could not initialize map."  + (e.message ? ` (${e.message})` : ''));
        setIsLoading(false);
      }
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        console.log("Leaflet map instance removed.");
      }
    };
  // }, [leafletLoaded, isMounted, loadLocations, t]); // loadLocations removed for basic test
  }, [leafletLoaded, isMounted, t]); // `t` is a dependency for `setError`

  // Commented out ResizeObserver and window resize listener for now to simplify
  /*
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !mapContainerRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
            mapRef.current.invalidateSize(true);
        }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }
    
    const handleWindowResize = () => {
        if (mapRef.current) {
            mapRef.current.invalidateSize(true);
        }
    };
    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      if (mapContainerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(mapContainerRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [leafletLoaded]); 
  */

  // Commented out periodical refresh as we are only showing a basic map
  /*
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return; 
    const intervalId = setInterval(() => {
        // loadLocations(false); 
    }, 60000); 
    return () => clearInterval(intervalId);
  }, [leafletLoaded, loadLocations]);
  */

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) { 
    return (
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-background p-6">
               <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-0"> {/* No padding for map container's parent */}
              <div className="w-full bg-muted flex items-center justify-center" style={{height: '500px'}}> {/* Fixed height for placeholder */}
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
          crossOrigin="" 
        />
      </Head>
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin="anonymous" // Corrected based on previous fix
        onLoad={() => {
          setLeafletLoaded(true);
          console.log("Leaflet script loaded.");
        }}
        onError={() => {
            console.error('Leaflet script failed to load.');
            setError('Failed to load map library.');
            setIsLoading(false);
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
            <CardContent className="p-0"> {/* No padding for map container's parent */}
              <div 
                id="interactive-map-container-outer" 
                className="w-full rounded-b-lg overflow-hidden relative bg-muted" 
              >
                {/* Fullscreen toggle button removed for simplification */}
                <div 
                  ref={mapContainerRef}
                  id="interactive-map-container" 
                  style={{ 
                    width: '100%',
                    height: '500px', // Explicit fixed height
                    position: 'relative', // Needed for Leaflet
                    background: (isLoading && !mapRef.current) ? 'hsl(var(--muted))' : 'transparent' // Show bg only if map not yet init
                  }}
                />
                {(isLoading && leafletLoaded && !mapRef.current) && ( // Show loading only if map not yet initialized
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 backdrop-blur-sm pointer-events-none">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                    <p className="text-lg text-muted-foreground">{t('loading')}</p>
                  </div>
                )}
                 {/* Show specific tile error or general map init error */}
                {error && !isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/20 text-destructive z-10 p-4 text-center backdrop-blur-sm pointer-events-none">
                    <AlertTriangle className="h-10 w-10 mb-2" />
                    <p className="font-semibold">Map Error</p>
                    <p className="text-sm">{error}</p>
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
