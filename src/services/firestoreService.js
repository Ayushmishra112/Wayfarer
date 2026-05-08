// src/services/firestoreService.js
// Abstraction layer for Firestore operations
// Handles saving and loading itineraries

import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'itineraries';

/**
 * Saves a generated itinerary to Firestore.
 * Returns the document ID for future retrieval.
 */
export async function saveItinerary(itinerary, preferences) {
  try {
    // SECURITY NOTE (S-5): Currently, this writes anonymously. 
    // Ensure Firestore Rules restrict writes (e.g. `allow write: if request.auth != null;`)
    // or deploy Firebase Auth before going to production.
    const docRef = await addDoc(collection(db, COLLECTION), {
      itinerary,
      preferences,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Firestore save error:', error);
    // Non-fatal — app works without saving
    return null;
  }
}

