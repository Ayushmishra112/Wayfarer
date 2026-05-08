// src/services/firestoreService.js
// Abstraction layer for Firestore operations
// Handles saving and loading itineraries

import { db, auth } from '../config/firebase';
import { signInAnonymously } from 'firebase/auth';
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'itineraries';

/**
 * Saves a generated itinerary to Firestore.
 * Returns the document ID for future retrieval.
 */
export async function saveItinerary(itinerary, preferences) {
  try {
    // S-2: Authenticate anonymously before writing
    const userCredential = await signInAnonymously(auth);
    const userId = userCredential.user.uid;

    const docRef = await addDoc(collection(db, COLLECTION), {
      userId,
      itinerary,
      preferences,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Firestore save error:', error);
    // Rethrow to let caller handle alerts/UX
    throw error;
  }
}
