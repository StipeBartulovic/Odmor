
// src/components/sections/InteractiveMap.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { useLanguage } from '@/contexts/LanguageContext';

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
};

// Declare Leaflet 'L' type for global scope (available after script load)
declare var L: any;

export function InteractiveMap() {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapRef = useRef<any>(null);
  const geoLayerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null); // Ref for the map container div

  const t = useCallback(
    (fieldKey: keyof typeof translations): string => {
      const langToUse = isMounted ? selectedLanguage : 'en';
      // @ts-ignore
      const translation = translations[fieldKey]?.[langToUse] || translations[fieldKey]?.['en'];
      return typeof translation === 'string' ? translation : String(fieldKey);
    },
    [isMounted, selectedLanguage]
  );

  // Effect for initializing the map
  useEffect(() => {
    if (leafletLoaded && isMounted && !mapRef.current && mapContainerRef.current) {
      if (!mapContainerRef.current.hasChildNodes()) { // Prevent re-initialization
        try {
          mapRef.current = L.map(mapContainerRef.current).setView([44.1, 15.2], 8); // Adjusted default zoom
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(mapRef.current);
          
          mapRef.current.invalidateSize(); // Call invalidateSize after initial setup
          setIsLoading(true); // Set loading for initial data fetch
          // loadLocations will be called by its own useEffect
        } catch (e) {
          console.error("Leaflet map initialization error:", e);
          setError("Could not initialize map.");
          setIsLoading(false);
        }
      }
    }
  }, [leafletLoaded, isMounted]);


  const loadLocations = useCallback(async (isInitialLoad = false) => {
    if (!mapRef.current) { // Ensure map is initialized before loading locations
        // console.log("Map not initialized, skipping loadLocations");
        if(isInitialLoad) setIsLoading(false); // If it's an initial call but map isn't ready, stop loading
        return;
    }
    
    if (isInitialLoad) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch('/api/locations');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch locations: ${response.status} ${errorText}`);
      }
      const data: GeoJSONFeatureCollection = await response.json();

      if (geoLayerRef.current) {
        mapRef.current.removeLayer(geoLayerRef.current);
        geoLayerRef.current = null;
      }

      if (data.features && data.features.length > 0) {
        geoLayerRef.current = L.geoJSON(data, {
          onEachFeature: (feature: GeoJSONFeature, layer: any) => {
            const p = feature.properties;
            const popupContent = `
              <div style="font-family: var(--font-geist-sans), Arial, sans-serif; max-width: 250px; line-height: 1.4;">
                <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 1.1em; color: hsl(var(--primary));">${p.name}</h3>
                ${p.menu && p.menu.length > 0 ? `<p style="margin: 4px 0; font-size: 0.9em;"><strong>Meni:</strong> ${p.menu.join(', ')}</p>` : '<p style="margin: 4px 0; font-size: 0.9em;"><strong>Meni:</strong> Nema podataka</p>'}
                ${p.parking ? `<p style="margin: 4px 0; font-size: 0.9em;"><strong>Parking:</strong> ${p.parking}</p>` : '<p style="margin: 4px 0; font-size: 0.9em;"><strong>Parking:</strong> Nema podataka</p>'}
                ${p.rating !== undefined ? `<p style="margin: 4px 0; font-size: 0.9em;"><strong>Ocjena:</strong> ${p.rating}</p>` : '<p style="margin: 4px 0; font-size: 0.9em;"><strong>Ocjena:</strong> Nema ocjene</p>'}
                ${p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.name}" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 4px; margin-top: 8px;" />` : ''}
              </div>
            `;
            layer.bindPopup(popupContent);
          },
          pointToLayer: function (feature: GeoJSONFeature, latlng: [number, number]) {
            return L.marker(latlng);
          }
        }).addTo(mapRef.current);

        if (geoLayerRef.current && geoLayerRef.current.getBounds().isValid()) {
          mapRef.current.fitBounds(geoLayerRef.current.getBounds().pad(0.1));
        }
        mapRef.current.invalidateSize(); // Invalidate size after fitting bounds
      } else {
        // console.log("No locations to display.");
        // If no features, perhaps zoom to a default wider view or keep current view
        // mapRef.current.setView([44.1, 15.2], 7); // Example: wider view of Croatia
        mapRef.current.invalidateSize();
      }
    } catch (err: any) {
      console.error('Error loading locations:', err);
      setError(t('errorLoading') + (err.message ? ` (${err.message})` : ''));
    } finally {
       setIsLoading(false); // Always set loading to false after attempt
    }
  }, [t]); // Removed mapRef from dependencies as it's a ref

  // Effect for initial data load
  useEffect(() => {
    if (isMounted && leafletLoaded && mapRef.current) {
        loadLocations(true);
    }
  }, [isMounted, leafletLoaded, loadLocations]); // Removed mapRef.current, loadLocations has its own check

  // Effect for periodic refresh
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;
    
    const intervalId = setInterval(() => {
        // console.log("Periodically refreshing locations...");
        loadLocations(false);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [leafletLoaded, loadLocations]); // Removed mapRef.current


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
            <CardContent className="p-0 md:p-2">
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
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
        crossOrigin=""
        onLoad={() => setLeafletLoaded(true)}
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
            <CardContent className="p-0 md:p-2">
              {/* Map container div is always rendered with its aspect ratio styling */}
              <div 
                id="interactive-map-container-outer" // Outer container for loading/error messages
                className="aspect-[16/9] w-full rounded-lg overflow-hidden relative"
              >
                <div 
                  ref={mapContainerRef} // Ref is on the actual map div
                  id="interactive-map-container" 
                  className="w-full h-full" // Map div takes full size of its parent
                />
                {/* Loading State Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 z-10">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
                    <p className="text-lg text-muted-foreground">{t('loading')}</p>
                  </div>
                )}
                {/* Error State Overlay (only if mapRef is not yet initialized or loading failed badly) */}
                {error && !mapRef.current && !isLoading && ( // Ensure isLoading is false to show this only after an attempt
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-destructive z-10 p-4 text-center">
                    <AlertTriangle className="h-10 w-10 mb-2" />
                    <p className="font-semibold">Map Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                 {/* Error message when map is initialized but data loading failed */}
                {error && mapRef.current && !isLoading && (
                    <div className="absolute top-2 left-2 right-2 bg-destructive/80 text-destructive-foreground p-3 rounded-md shadow-lg z-20 text-center text-sm">
                        <AlertTriangle className="inline h-5 w-5 mr-1" /> {error}
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

