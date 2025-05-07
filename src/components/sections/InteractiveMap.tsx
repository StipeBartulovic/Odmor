"use client";

import type { PointOfInterest, Coordinate } from '@/services/map';
import { getPointsOfInterest } from '@/services/map';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MapPin, ShoppingCart, CakeSlice, Hospital, Coffee, Utensils, Mountain, LocateFixed } from 'lucide-react';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Hardcoded lodging location
const lodgingLocation: PointOfInterest = {
  name: "Your Lodging",
  coordinate: { latitude: 34.052235, longitude: -118.243683 }, // Downtown Los Angeles
  description: "This is where you'll be staying.",
  imageUrl: "https://picsum.photos/200/150?random=lodging",
  category: "Lodging",
};

const categoryIcons: { [key: string]: React.ElementType } = {
  'Lodging': LocateFixed,
  'Grocery Store': ShoppingCart,
  'Bakery': CakeSlice,
  'Pharmacy': Hospital,
  'Cafe': Coffee,
  'Restaurant': Utensils,
  'Scenic View': Mountain,
  'Activity': MapPin, // Generic for other activities
  'Default': MapPin,
};

const categoryColors: { [key: string]: string } = {
  'Lodging': '#FF7F50', // Coral (Accent)
  'Grocery Store': '#87CEEB', // Sky Blue (Primary)
  'Bakery': '#87CEEB',
  'Pharmacy': '#87CEEB',
  'Cafe': '#808000', // Olive Green (Secondary)
  'Restaurant': '#808000',
  'Scenic View': '#808000',
  'Activity': '#FF7F50',
  'Default': '#707070',
};

export function InteractiveMap() {
  const [points, setPoints] = useState<PointOfInterest[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PointOfInterest | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Fetch POIs around the lodging location, within a 20km radius for demo
      const fetchedPoints = await getPointsOfInterest(lodgingLocation.coordinate, 20);
      setPoints([lodgingLocation, ...fetchedPoints]);
    }
    if (API_KEY) {
      fetchData();
    }
    // Simulate map readiness slightly after component mount to avoid hydration issues with map rendering.
    const timer = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!API_KEY) {
    return (
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-lg rounded-xl text-center p-8">
            <CardTitle className="text-xl text-destructive mb-4">Google Maps API Key Missing</CardTitle>
            <p>Please add your Google Maps API key to a <code>.env.local</code> file as <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY"</code> to display the map.</p>
            <p className="mt-2 text-sm text-muted-foreground">Make sure to restart your development server after adding the key.</p>
          </Card>
        </div>
      </section>
    );
  }
  
  if (!mapReady) {
    return (
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
                <MapPin className="h-8 w-8" />
                Explore Your Surroundings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[16/9] w-full bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-background p-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
              <MapPin className="h-8 w-8" />
              Explore Your Surroundings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            <div className="aspect-[16/9] w-full rounded-lg overflow-hidden">
              <APIProvider apiKey={API_KEY}>
                <Map
                  defaultCenter={{ lat: lodgingLocation.coordinate.latitude, lng: lodgingLocation.coordinate.longitude }}
                  defaultZoom={12}
                  mapId="wanderai-map"
                  gestureHandling={'greedy'}
                  disableDefaultUI={true}
                  className="w-full h-full"
                >
                  {points.map((point, index) => {
                    const IconComponent = categoryIcons[point.category] || categoryIcons['Default'];
                    const iconColor = categoryColors[point.category] || categoryColors['Default'];
                    return (
                      <AdvancedMarker
                        key={index}
                        position={{ lat: point.coordinate.latitude, lng: point.coordinate.longitude }}
                        onClick={() => setSelectedPoint(point)}
                      >
                        <Pin background={iconColor} borderColor={'#ffffff'} glyphColor={'#ffffff'}>
                           <IconComponent className="h-5 w-5" />
                        </Pin>
                      </AdvancedMarker>
                    );
                  })}

                  {selectedPoint && (
                    <InfoWindow
                      position={{ lat: selectedPoint.coordinate.latitude, lng: selectedPoint.coordinate.longitude }}
                      onCloseClick={() => setSelectedPoint(null)}
                      minWidth={250}
                    >
                      <div className="p-2 space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{selectedPoint.name}</h3>
                        {selectedPoint.imageUrl.startsWith('https://picsum.photos') && (
                           <Image
                            src={selectedPoint.imageUrl}
                            alt={selectedPoint.name}
                            width={200}
                            height={150}
                            className="rounded-md object-cover w-full h-auto"
                            data-ai-hint={`${selectedPoint.category} place`}
                          />
                        )}
                        <p className="text-sm text-muted-foreground">{selectedPoint.description}</p>
                        <p className="text-xs font-medium bg-accent/20 text-accent-foreground px-2 py-1 rounded-full inline-block">{selectedPoint.category}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
