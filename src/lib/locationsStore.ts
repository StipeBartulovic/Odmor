// src/lib/locationsStore.ts
import type { GeoJSONFeature } from '@/components/sections/InteractiveMap'; // Ensure types are exported from InteractiveMap

// In-memory store for locations.
// In a real application, this would be replaced with a database.
export let locationsDb: GeoJSONFeature[] = [
  // Example initial data (optional)
  {
    type: 'Feature',
    id: 'example-1',
    geometry: {
      type: 'Point',
      coordinates: [16.3738, 48.2082], // Longitude, Latitude (e.g., Vienna)
    },
    properties: {
      name: 'Caffe Bar "Kod Starog"',
      menu: ['Kava', 'Pivo', 'Sokovi', 'Rakija'],
      parking: 'Nema vlastiti, javni parking u blizini',
      rating: 4.7,
      images: ['https://placehold.co/600x400.png'],
    },
  },
  {
    type: 'Feature',
    id: 'example-2',
    geometry: {
      type: 'Point',
      coordinates: [15.2278, 44.1194], // Zadar
    },
    properties: {
      name: 'Morske Orgulje',
      menu: ['Zvuk valova', 'Zalazak sunca'],
      parking: 'Javni parking uz obalu (naplata)',
      rating: 4.9,
      images: ['https://placehold.co/600x400.png'],
    },
  },
];

// Helper function to generate a unique ID (if not provided by client)
export const generateId = (): string => Date.now().toString() + Math.random().toString(36).substring(2, 9);
