// src/services/localHighlights.ts
import { collection, getDocs, query, orderBy, type Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface LocalHighlight {
  id: string; // Firestore document ID
  title: string;
  platform: 'TikTok' | 'Instagram';
  embedUrl: string;
  externalUrl: string;
  username?: string;
  description?: string;
  category?: string;
  location?: string;
  createdAt?: Timestamp; // Optional: for sorting or if you add a timestamp in Firestore
}

/**
 * Example Firestore data structure for a document in 'localHighlights' collection:
 * {
 *   title: "Amazing View from Marjan Hill",
 *   platform: "Instagram",
 *   embedUrl: "https://www.instagram.com/p/C2XYZABCDE/embed/",
 *   externalUrl: "https://www.instagram.com/p/C2XYZABCDE/",
 *   username: "split_explorer",
 *   description: "Catching the sunset over Split!",
 *   category: "scenery",
 *   location: "Marjan Hill, Split",
 *   createdAt: serverTimestamp() // Optional
 * }
 * 
 * {
 *   title: "Rafting Fun on Cetina River",
 *   platform: "TikTok",
 *   embedUrl: "https://www.tiktok.com/embed/v2/7345678901234567890", // Replace VIDEO_ID
 *   externalUrl: "https://www.tiktok.com/@adventureclub/video/7345678901234567890",
 *   username: "adventureclub",
 *   description: "Wild ride down the Cetina!",
 *   category: "adventure",
 *   location: "Omiš, Croatia",
 *   createdAt: serverTimestamp() // Optional
 * }
 */

export async function getLocalHighlights(): Promise<LocalHighlight[]> {
  try {
    // Example query: order by 'createdAt' if you add that field. Otherwise, remove orderBy.
    const q = query(collection(db, 'localHighlights'), orderBy('createdAt', 'desc'));
    // If not using createdAt for ordering:
    // const q = query(collection(db, 'localHighlights'));
    
    const querySnapshot = await getDocs(q);
    const highlights: LocalHighlight[] = [];
    querySnapshot.forEach((doc) => {
      highlights.push({ id: doc.id, ...doc.data() } as LocalHighlight);
    });
    return highlights;
  } catch (error) {
    console.error("Error fetching local highlights: ", error);
    // Return an empty array or throw the error, depending on how you want to handle it.
    // For now, returning empty to allow fallback in component.
    return []; 
  }
}
