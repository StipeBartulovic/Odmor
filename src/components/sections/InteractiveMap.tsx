// src/components/sections/InteractiveMap.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertTriangle, Maximize, Minimize } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button'; // Make sure Button is imported

// Define TypeScript interfaces for GeoJSON
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
  // Add any other properties you expect from your API
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
  errorLoading: {
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
  // fullscreenButton: {
  //   en: 'Toggle Fullscreen',
  //   it: 'Attiva/Disattiva Schermo Intero',
  //   de: 'Vollbild umschalten',
  //   pl: 'Przełącz Pełny Ekran',
  //   fr: 'Basculer en Plein Écran',
  //   es: 'Alternar Pantalla Completa',
  // },
};

// Declare Leaflet 'L' type for global scope (available after script load)
declare var L: any;

export function InteractiveMap() {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [isFullscreen, setIsFullscreen] = useState(false);

  const mapRef = useRef<any>(null); // Holds the Leaflet map instance
  // const geoLayerRef = useRef<any>(null); // Holds the GeoJSON layer
  const mapContainerRef = useRef<HTMLDivElement>(null); // Ref to the div where map is initialized

  const t = useCallback(
    (fieldKey: keyof typeof translations): string => {
      const langToUse = isMounted ? selectedLanguage : 'en';
      // @ts-ignore
      const translation = translations[fieldKey]?.[langToUse] || translations[fieldKey]?.['en'];
      return typeof translation === 'string' ? translation : String(fieldKey);
    },
    [isMounted, selectedLanguage]
  );

  // const loadLocations = useCallback(async (isInitialLoad = false) => {
  //   if (!mapRef.current) {
  //     if(isInitialLoad) setIsLoading(false);
  //     return;
  //   }
    
  //   if (isInitialLoad) {
  //     setIsLoading(true);
  //   }
  //   setError(null); 

  //   try {
  //     // const response = await fetch('/api/locations');
  //     // if (!response.ok) {
  //     //   const errorText = await response.text();
  //     //   throw new Error(`Failed to fetch locations: ${response.status} ${errorText}`);
  //     // }
  //     // const data: GeoJSONFeatureCollection = await response.json();
  //     // console.log('Fetched GeoJSON data:', JSON.stringify(data, null, 2));

  //     // if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
  //     //   console.error('Invalid GeoJSON data received from API.');
  //     //   throw new Error('Invalid GeoJSON data received from API.');
  //     // }
  //     // data.features.forEach((feature, index) => {
  //     //   if (
  //     //     !feature || feature.type !== 'Feature' ||
  //     //     !feature.geometry || feature.geometry.type !== 'Point' ||
  //     //     !Array.isArray(feature.geometry.coordinates) ||
  //     //     feature.geometry.coordinates.length !== 2 ||
  //     //     typeof feature.geometry.coordinates[0] !== 'number' || 
  //     //     typeof feature.geometry.coordinates[1] !== 'number'    
  //     //   ) {
  //     //     console.warn(`Invalid GeoJSON feature at index ${index}:`, feature);
  //     //   }
  //     // });


  //     // if (geoLayerRef.current) {
  //     //   mapRef.current.removeLayer(geoLayerRef.current);
  //     //   geoLayerRef.current = null;
  //     // }

  //     // if (data.features && data.features.length > 0) {
  //     //   geoLayerRef.current = L.geoJSON(data, {
  //     //     onEachFeature: (feature: GeoJSONFeature, layer: any) => {
  //     //       const p = feature.properties;
  //     //       const name = p.name || 'Unknown Location';
  //     //       const menuItems = Array.isArray(p.menu) && p.menu.length > 0 ? p.menu.join(', ') : 'Nema podataka';
  //     //       const parkingInfo = p.parking || 'Nema podataka';
  //     //       const ratingInfo = p.rating !== undefined ? String(p.rating) : 'Nema ocjene';
  //     //       const imageHtml = Array.isArray(p.images) && p.images[0] ? `<img src="${p.images[0]}" alt="${name}" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 4px; margin-top: 8px;" data-ai-hint="location image" />` : '';

  //     //       const popupContent = `
  //     //         <div style="font-family: var(--font-geist-sans), Arial, sans-serif; max-width: 250px; line-height: 1.4;">
  //     //           <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 1.1em; color: hsl(var(--primary));">${name}</h3>
  //     //           <p style="margin: 4px 0; font-size: 0.9em;"><strong>Meni:</strong> ${menuItems}</p>
  //     //           <p style="margin: 4px 0; font-size: 0.9em;"><strong>Parking:</strong> ${parkingInfo}</p>
  //     //           <p style="margin: 4px 0; font-size: 0.9em;"><strong>Ocjena:</strong> ${ratingInfo}</p>
  //     //           ${imageHtml}
  //     //         </div>
  //     //       `;
  //     //       layer.bindPopup(popupContent);
  //     //     },
  //     //     pointToLayer: function (feature: GeoJSONFeature, latlng: [number, number]) {
  //     //       return L.marker(latlng); 
  //     //     }
  //     //   }).addTo(mapRef.current);

  //     //   if (geoLayerRef.current && geoLayerRef.current.getBounds().isValid()) {
  //     //     mapRef.current.fitBounds(geoLayerRef.current.getBounds().pad(0.1));
  //     //   }
  //     // } else {
  //     //    if (mapRef.current) {
  //     //       mapRef.current.setView([44.1, 15.2], 7); 
  //     //    }
  //     // }
  //   } catch (err: any) {
  //     console.error('Error loading locations:', err);
  //     setError(t('errorLoading') + (err.message ? ` (${err.message})` : ''));
  //   } finally {
  //     // setIsLoading(false);
  //     // if (mapRef.current) {
  //     //    setTimeout(() => {
  //     //     if (mapRef.current) {
  //     //       mapRef.current.invalidateSize(true); 
  //     //     }
  //     //   }, 350); 
  //     // }
  //   }
  // }, [t]);

  // Effect for initializing the map
  useEffect(() => {
    if (leafletLoaded && isMounted && mapContainerRef.current && !mapRef.current) {
      setIsLoading(true);
      setError(null);
      try {
        const mapInstance = L.map(mapContainerRef.current, {
          preferCanvas: true, 
        }).setView([44.1, 15.2], 8); // Initial center and zoom for Croatia

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          tileSize: 256, 
          zoomOffset: 0,
        }).on('tileerror', (tileErrorEvent: any) => { 
            console.error('Tile loading error:', tileErrorEvent.error, tileErrorEvent.tile);
            setError(t('tileError'));
        }).addTo(mapInstance);
        
        mapRef.current = mapInstance;

        mapInstance.whenReady(() => {
          console.log("Map is ready. Calling invalidateSize and dispatching resize.");
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.invalidateSize(true);
              // loadLocations(true); // Commented out for basic map test
              window.dispatchEvent(new Event("resize")); // Dispatch resize event
            }
          }, 500); // Increased delay
          setIsLoading(false); 
        });

      } catch (e) {
        console.error("Leaflet map initialization error:", e);
        setError("Could not initialize map.");
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
  }, [leafletLoaded, isMounted, t]);


  // Effect for ResizeObserver - Commented out for simplification
  // useEffect(() => {
  //   if (!leafletLoaded || !mapRef.current || !mapContainerRef.current) return;
    
  //   const resizeObserver = new ResizeObserver(() => {
  //       if (mapRef.current) {
  //           mapRef.current.invalidateSize(true);
  //       }
  //   });
  //   if (mapContainerRef.current) {
  //     resizeObserver.observe(mapContainerRef.current);
  //   }
    
  //   return () => {
  //     if (mapContainerRef.current) {
  //       // eslint-disable-next-line react-hooks/exhaustive-deps
  //       resizeObserver.unobserve(mapContainerRef.current);
  //     }
  //     resizeObserver.disconnect();
  //   };
  // }, [leafletLoaded]); 

  // Effect for window resize listener - Commented out for simplification
  // useEffect(() => {
  //   if (!leafletLoaded || !mapRef.current) return;

  //   const mapInstance = mapRef.current;
  //   const handleWindowResize = () => {
  //       if (mapInstance) {
  //           mapInstance.invalidateSize(true);
  //       }
  //   };
  //   window.addEventListener('resize', handleWindowResize);

  //   return () => {
  //     window.removeEventListener('resize', handleWindowResize);
  //   };
  // }, [leafletLoaded]); 

  // Periodical refresh - commented out for basic map test
  // useEffect(() => {
  //   if (!leafletLoaded || !mapRef.current) return; 
    
  //   const intervalId = setInterval(() => {
  //       // loadLocations(false); 
  //   }, 60000); 
    
  //   return () => clearInterval(intervalId);
  // // }, [leafletLoaded, loadLocations]);
  // }, [leafletLoaded]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // const toggleFullscreen = () => {
  //   setIsFullscreen(!isFullscreen);
  //   // Invalidate map size after a short delay to allow CSS transition
  //   setTimeout(() => {
  //     if (mapRef.current) {
  //       mapRef.current.invalidateSize(true);
  //     }
  //   }, 300);
  // };


  if (!isMounted) { 
    return (
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-background p-6">
               <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-0">
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
            <CardContent className="p-0"> {/* Ensure no padding on content holding the map */}
              <div 
                id="interactive-map-container-outer" 
                // className={`relative w-full rounded-b-lg overflow-hidden ${
                //   isFullscreen
                //     ? 'fixed inset-0 z-[1000] !rounded-none'
                //     : 'aspect-[16/9]' 
                // }`}
                // style={isFullscreen ? { backgroundColor: 'hsl(var(--background))' } : {backgroundColor: 'hsl(var(--muted))'}}
                className="relative w-full rounded-b-lg overflow-hidden"
                style={{backgroundColor: 'hsl(var(--muted))'}}
              >
                {/* Fullscreen Toggle Button - Temporarily Commented out
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="absolute top-2 right-2 z-[1001] bg-card hover:bg-card/80 rounded-full shadow-lg"
                  aria-label={t('fullscreenButton')}
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
                */}
                <div 
                  ref={mapContainerRef}
                  id="interactive-map-container" 
                  // className={`w-full ${isFullscreen ? 'h-screen' : 'h-full'}`} 
                  style={{ 
                    width: '100%',
                    height: '500px', // Direct fixed height
                    position: 'relative', 
                    background: (isLoading || error) && !mapRef.current ? 'hsl(var(--muted))' : 'transparent' 
                  }}
                />
                {(isLoading && leafletLoaded) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 backdrop-blur-sm pointer-events-none">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                    <p className="text-lg text-muted-foreground">{t('loading')}</p>
                  </div>
                )}
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
    
