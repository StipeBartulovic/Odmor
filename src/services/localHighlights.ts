// src/services/localHighlights.ts
import { collection, getDocs, query, orderBy, type Timestamp, limit, startAfter, type DocumentSnapshot, type QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface LocalHighlight {
  id: string; // Firestore document ID
  title: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube'; // Added YouTube
  embedUrl: string;
  externalUrl: string;
  username?: string;
  description?: string;
  category?: string;
  location?: string;
  createdAt?: Timestamp; 
}

/**
 * Retrieves a paginated list of local highlights.
 *
 * @param pageSize The number of highlights to fetch per page.
 * @param lastDoc The last document snapshot from the previous fetch, for pagination.
 * @returns A promise that resolves to an object containing highlights and the last document snapshot.
 */
export async function getLocalHighlights(
  pageSize: number = 5, 
  lastDoc: QueryDocumentSnapshot<unknown> | null = null
): Promise<{ highlights: LocalHighlight[], newLastDoc: QueryDocumentSnapshot<unknown> | null }> {
  try {
    const highlightsRef = collection(db, 'localHighlights');
    let q;

    if (lastDoc) {
      q = query(highlightsRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(pageSize));
    } else {
      q = query(highlightsRef, orderBy('createdAt', 'desc'), limit(pageSize));
    }
    
    const querySnapshot = await getDocs(q);
    const highlights: LocalHighlight[] = [];
    querySnapshot.forEach((doc) => {
      highlights.push({ id: doc.id, ...doc.data() } as LocalHighlight);
    });

    const newLastDocSnapshot = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

    return { highlights, newLastDoc: newLastDocSnapshot };
  } catch (error) {
    console.error("Error fetching local highlights: ", error);
    return { highlights: [], newLastDoc: null }; 
  }
}