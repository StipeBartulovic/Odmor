// src/app/api/locations/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, setDoc, doc, writeBatch } from 'firebase/firestore';
import type { GeoJSONFeature, GeoJSONFeatureCollection, GeoJSONPoint, GeoJSONFeatureProperties } from '@/components/sections/InteractiveMap';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET /api/locations - vrati sve lokacije kao GeoJSON FeatureCollection
export async function GET() {
  try {
    const locationsCollection = collection(db, "locations");
    const snapshot = await getDocs(locationsCollection);
    
    const features: GeoJSONFeature[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        type: "Feature",
        id: doc.id, // Firestore document ID
        geometry: data.geometry as GeoJSONPoint,
        properties: data.properties as GeoJSONFeatureProperties,
      };
    });

    const featureCollection: GeoJSONFeatureCollection = {
      type: "FeatureCollection",
      features: features,
    };
    return NextResponse.json(featureCollection, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching locations from Firestore:", error);
    return NextResponse.json({ error: "Interna greška servera prilikom dohvaćanja lokacija" }, { status: 500, headers: corsHeaders });
  }
}

// POST /api/locations - dodaj novu lokaciju ili ažuriraj postojeću na temelju properties.ID
export async function POST(request: Request) {
  try {
    // Proširujemo tip da uključimo opcionalni properties.ID
    const featureData = await request.json() as Omit<GeoJSONFeature, 'id'> & { properties: { ID?: string } & GeoJSONFeatureProperties };

    // Osnovna validacija GeoJSON strukture
    if (!featureData || typeof featureData !== 'object' || featureData.type !== 'Feature' || !featureData.geometry || !featureData.properties) {
      return NextResponse.json({ error: "Neispravan GeoJSON Feature format" }, { status: 400, headers: corsHeaders });
    }
    if (typeof featureData.geometry !== 'object' || featureData.geometry === null || typeof featureData.properties !== 'object' || featureData.properties === null) {
        return NextResponse.json({ error: "GeoJSON Feature mora imati definirane 'geometry' i 'properties' objekte." }, { status: 400, headers: corsHeaders });
    }

    const customId = featureData.properties.ID; // Custom ID iz properties objekta
    const locationsCollectionRef = collection(db, "locations");

    if (customId) {
      // Ako je customId (properties.ID) prisutan, pokušaj pronaći postojeći dokument
      const q = query(locationsCollectionRef, where("properties.ID", "==", customId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Dokument s ovim customId postoji, ažuriraj ga
        const existingDoc = querySnapshot.docs[0];
        // Koristimo Firestore ID postojećeg dokumenta za ažuriranje
        await setDoc(doc(db, "locations", existingDoc.id), featureData, { merge: true });
        return NextResponse.json({ message: "Postojeća lokacija ažurirana", id: existingDoc.id, customId: customId }, { status: 200, headers: corsHeaders });
      } else {
        // Ne postoji dokument s ovim customId, kreiraj novi.
        // Firestore će generirati novi ID dokumenta. featureData (uključujući properties.ID) će biti spremljen.
        const newDocRef = await addDoc(locationsCollectionRef, featureData);
        return NextResponse.json({ message: "Nova lokacija kreirana s custom ID-om", id: newDocRef.id, customId: customId }, { status: 201, headers: corsHeaders });
      }
    } else {
      // Nije pružen customId (properties.ID), samo kreiraj novi dokument
      // Firestore će generirati novi ID dokumenta.
      const newDocRef = await addDoc(locationsCollectionRef, featureData);
      return NextResponse.json({ message: "Nova lokacija kreirana (custom ID nije pružen)", id: newDocRef.id }, { status: 201, headers: corsHeaders });
    }

  } catch (error) {
    console.error("Error processing POST /api/locations:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Neispravan JSON format u tijelu zahtjeva" }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Interna greška servera prilikom obrade zahtjeva" }, { status: 500, headers: corsHeaders });
  }
}
