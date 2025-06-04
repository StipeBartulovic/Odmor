// src/components/sections/InteractiveMap.tsx
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true); // True initially

  const mapRef = useRef<any>(null); // To store Leaflet map instance
  const geoLayerRef = useRef<any>(null); // To store GeoJSON layer instance

  const t = useCallback(
    (fieldKey: keyof typeof translations): string => {
      const langToUse = isMounted ? selectedLanguage : 'en';
      // @ts-ignore
      const translation = translations[fieldKey]?.[langToUse] || translations[fieldKey]?.['en'];
      return typeof translation === 'string' ? translation : String(fieldKey);
    },
    [isMounted, selectedLanguage]
  );

  const loadLocations = useCallback(async (isInitialLoad = false) => {
    if (!leafletLoaded || !mapRef.current) return;
    
    if (isInitialLoad) {
      setIsLoading(true); // Show loader only for the very first load
    }
    // For subsequent refreshes, don't set isLoading to true to avoid loader flicker
    setError(null);

    try {
      // Use relative path for API call, works for local and deployed (Vercel)
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
            // Using the more detailed popup structure from your original component
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
            // Standard marker, you can customize it later if needed
            return L.marker(latlng);
          }
        }).addTo(mapRef.current);

        // Fit map to bounds of all markers
        if (geoLayerRef.current && geoLayerRef.current.getBounds().isValid()) {
          mapRef.current.fitBounds(geoLayerRef.current.getBounds().pad(0.1));
        }
      } else {
        // No features, maybe set a default view or message
        if (mapRef.current && !isInitialLoad) { // Avoid resetting view if it's just a refresh with no data
             // console.log("No locations to display, keeping current view.");
        }
      }
    } catch (err: any) {
      console.error('Error loading locations:', err);
      setError(t('errorLoading') + (err.message ? ` (${err.message})` : ''));
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  }, [leafletLoaded, t]);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (leafletLoaded && isMounted && !mapRef.current) {
      const mapElement = document.getElementById('interactive-map-container');
      if (mapElement && !mapElement.hasChildNodes()) { 
        try {
          mapRef.current = L.map('interactive-map-container').setView([44.1, 15.2], 10); 
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(mapRef.current);
          loadLocations(true); // Pass true for initial load
        } catch (e) {
          console.error("Leaflet map initialization error:", e);
          setError("Could not initialize map.");
          setIsLoading(false);
        }
      }
    }
  }, [leafletLoaded, isMounted, loadLocations]);

  // Periodic refresh
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || isLoading) return; // Don't refresh if map not ready or initial load in progress
    
    const intervalId = setInterval(() => {
        // console.log("Periodically refreshing locations...");
        loadLocations(false); // Pass false for subsequent refreshes
    }, 60000); // 60 seconds
    
    return () => clearInterval(intervalId);
  }, [loadLocations, leafletLoaded, isLoading]);


  if (!isMounted) { // SSR/Initial mount placeholder
    return (
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-background p-6">
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-0 md:p-2">
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                {/* Placeholder for map area */}
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
              {isLoading && ( // Show loader only on initial load when mapRef might not be ready
                <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="ml-4 text-lg text-muted-foreground">{t('loading')}</p>
                </div>
              )}
              {error && !isLoading && ( // Show error if not loading
                 <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-destructive/10 text-destructive flex flex-col items-center justify-center p-4 text-center">
                    <p className="font-semibold">Map Error</p>
                    <p className="text-sm">{error}</p>
                 </div>
              )}
              <div 
                id="interactive-map-container" 
                className="aspect-[16/9] w-full rounded-lg overflow-hidden"
                // Hide container if initial loading or if error prevents map display
                style={{ display: isLoading || (error && !mapRef.current) ? 'none' : 'block' }} 
              >
                {/* Leaflet map will be mounted here */}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
