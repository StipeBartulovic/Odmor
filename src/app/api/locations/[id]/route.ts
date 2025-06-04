// src/app/api/locations/[id]/route.ts
import { NextResponse } from 'next/server';
import { locationsDb } from '@/lib/locationsStore';
import type { GeoJSONFeatureProperties, GeoJSONPoint } from '@/components/sections/InteractiveMap';

interface UpdatePayload {
  properties?: Partial<GeoJSONFeatureProperties>;
  geometry?: GeoJSONPoint;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}


// GET /api/locations/:id - vrati specificnu lokaciju
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const location = locationsDb.find(loc => String(loc.id) === id);

  if (!location) {
    return NextResponse.json({ error: "Lokacija nije pronađena" }, { status: 404, headers: corsHeaders });
  }
  return NextResponse.json(location, { headers: corsHeaders });
}


// PATCH /api/locations/:id - ažuriraj lokaciju
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const update = await request.json() as UpdatePayload;
    const index = locationsDb.findIndex(loc => String(loc.id) === id);

    if (index === -1) {
      return NextResponse.json({ error: "Lokacija nije pronađena" }, { status: 404, headers: corsHeaders });
    }

    // Update samo properties i geometry
    if (update.properties) {
      locationsDb[index].properties = { ...locationsDb[index].properties, ...update.properties };
    }
    if (update.geometry) {
      locationsDb[index].geometry = update.geometry;
    }

    return NextResponse.json({ message: "Lokacija ažurirana", id: locationsDb[index].id }, { headers: corsHeaders });

  } catch (error) {
     console.error(`Error processing PATCH /api/locations/${id}:`, error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Neispravan JSON format u tijelu zahtjeva" }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Interna greška servera prilikom ažuriranja lokacije" }, { status: 500, headers: corsHeaders });
  }
}

// DELETE /api/locations/:id - briši lokaciju
export async function DELETE(
  request: Request, // Request object is conventional even if not used directly
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const index = locationsDb.findIndex(loc => String(loc.id) === id);

  if (index === -1) {
    return NextResponse.json({ error: "Lokacija nije pronađena" }, { status: 404, headers: corsHeaders });
  }
  
  const deletedLocation = locationsDb.splice(index, 1);
  return NextResponse.json({ message: "Lokacija obrisana", id: deletedLocation[0].id }, { headers: corsHeaders });
}
