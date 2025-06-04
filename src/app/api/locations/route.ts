// src/app/api/locations/route.ts
import { NextResponse } from 'next/server';
import { locationsDb, generateId } from '@/lib/locationsStore';
import type { GeoJSONFeature, GeoJSONFeatureCollection } from '@/components/sections/InteractiveMap';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET /api/locations - vrati sve lokacije kao GeoJSON FeatureCollection
export async function GET() {
  const featureCollection: GeoJSONFeatureCollection = {
    type: "FeatureCollection",
    features: locationsDb,
  };
  return NextResponse.json(featureCollection, { headers: corsHeaders });
}

// POST /api/locations - dodaj novu lokaciju
export async function POST(request: Request) {
  try {
    const feature = await request.json() as GeoJSONFeature;

    if (!feature || typeof feature !== 'object' || !feature.geometry || !feature.properties) {
      return NextResponse.json({ error: "Neispravan GeoJSON format" }, { status: 400, headers: corsHeaders });
    }

    // Dodaj id ako ne postoji ili ako nije string/broj
    if (!feature.id || (typeof feature.id !== 'string' && typeof feature.id !== 'number')) {
      feature.id = generateId();
    }

    // Osiguraj da ID bude string za konzistentnost
    feature.id = String(feature.id);

    // Provjeri postoji li već lokacija s tim ID-om
    const existingIndex = locationsDb.findIndex(loc => loc.id === feature.id);
    if (existingIndex !== -1) {
        // Ako postoji, ažuriraj je (ponaša se kao UPSERT za jednostavnost s ovim in-memory storeom)
        locationsDb[existingIndex] = feature;
        return NextResponse.json({ message: "Lokacija ažurirana (UPSERT)", id: feature.id }, { status: 200, headers: corsHeaders });
    }


    locationsDb.push(feature);
    return NextResponse.json({ message: "Lokacija dodana", id: feature.id }, { status: 201, headers: corsHeaders });

  } catch (error) {
    console.error("Error processing POST /api/locations:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Neispravan JSON format u tijelu zahtjeva" }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Interna greška servera prilikom obrade zahtjeva" }, { status: 500, headers: corsHeaders });
  }
}
