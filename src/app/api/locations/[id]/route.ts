// src/app/api/locations/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { GeoJSONFeatureProperties, GeoJSONPoint, GeoJSONFeature } from '@/components/sections/InteractiveMap';

interface UpdatePayload {
  properties?: Partial<GeoJSONFeatureProperties>;
  geometry?: GeoJSONPoint;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
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
  try {
    const docRef = doc(db, "locations", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Lokacija nije pronađena" }, { status: 404, headers: corsHeaders });
    }
    
    const data = docSnap.data();
    const feature: GeoJSONFeature = {
      type: "Feature", // Assuming 'type' is stored or implied
      id: docSnap.id,
      geometry: data.geometry as GeoJSONPoint,
      properties: data.properties as GeoJSONFeatureProperties,
    };
    
    return NextResponse.json(feature, { headers: corsHeaders });
  } catch (error) {
    console.error(`Error fetching location ${id} from Firestore:`, error);
    return NextResponse.json({ error: "Interna greška servera prilikom dohvaćanja lokacije" }, { status: 500, headers: corsHeaders });
  }
}

// PATCH /api/locations/:id - ažuriraj lokaciju
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const updateData = await request.json() as UpdatePayload;
    const docRef = doc(db, "locations", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Lokacija nije pronađena" }, { status: 404, headers: corsHeaders });
    }

    const updateFields: any = {};
    if (updateData.properties) {
      // For nested properties, Firestore needs dot notation or merging carefully
      // Simple approach: overwrite properties field if provided
      updateFields.properties = { ...docSnap.data().properties, ...updateData.properties };
    }
    if (updateData.geometry) {
      updateFields.geometry = updateData.geometry;
    }

    if (Object.keys(updateFields).length === 0) {
        return NextResponse.json({ error: "Nema podataka za ažuriranje" }, { status: 400, headers: corsHeaders });
    }

    await updateDoc(docRef, updateFields);

    return NextResponse.json({ message: "Lokacija ažurirana", id }, { headers: corsHeaders });

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
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const docRef = doc(db, "locations", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Lokacija nije pronađena" }, { status: 404, headers: corsHeaders });
    }
  
    await deleteDoc(docRef);
    return NextResponse.json({ message: "Lokacija obrisana", id }, { headers: corsHeaders });
  } catch (error) {
    console.error(`Error deleting location ${id} from Firestore:`, error);
    return NextResponse.json({ error: "Interna greška servera prilikom brisanja lokacije" }, { status: 500, headers: corsHeaders });
  }
}
