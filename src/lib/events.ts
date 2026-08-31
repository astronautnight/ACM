import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const REGISTRATION_STATUS_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Registration status request timed out")), timeoutMs);
    }),
  ]);
}

/**
 * Register a user for an event.
 * Writes to: events/{eventId}/registrations/{userId}
 * And: users/{userId}/registrations/{eventId}
 * And updates users/{userId} registeredEvents array.
 */
export async function registerForEvent(
  eventId: string,
  userId: string,
  userData: {
    displayName: string | null;
    email: string | null;
    year?: string;
    branch?: string;
    section?: string;
  }
) {
  if (!db) throw new Error("Firestore not initialized");
  
  const registeredAt = new Date().toISOString();
  
  // Write to events/{eventId}/registrations/{userId}
  const ref = doc(db, "events", eventId, "registrations", userId);
  await setDoc(ref, {
    ...userData,
    registeredAt,
  });


  // Update user document registeredEvents array
  const userRef = doc(db, "users", userId);
  await setDoc(
    userRef,
    {
      registeredEvents: arrayUnion(eventId),
    },
    { merge: true }
  );
}

/**
 * Unregister a user from an event.
 */
export async function unregisterFromEvent(eventId: string, userId: string) {
  if (!db) throw new Error("Firestore not initialized");
  
  // Delete from events/{eventId}/registrations/{userId}
  const ref = doc(db, "events", eventId, "registrations", userId);
  await deleteDoc(ref);

  // Remove from user document registeredEvents array
  const userRef = doc(db, "users", userId);
  await setDoc(
    userRef,
    {
      registeredEvents: arrayRemove(eventId),
    },
    { merge: true }
  );
}

/**
 * Check if a specific user is registered for an event.
 */
export async function isUserRegistered(
  eventId: string,
  userId: string
): Promise<boolean> {
  if (!db) return false;
  const ref = doc(db, "events", eventId, "registrations", userId);
  const snap = await withTimeout(getDoc(ref), REGISTRATION_STATUS_TIMEOUT_MS);
  return snap.exists();
}

/**
 * Get total registration count for an event.
 */
export async function getRegistrationCount(eventId: string): Promise<number> {
  if (!db) return 0;
  const colRef = collection(db, "events", eventId, "registrations");
  const snap = await withTimeout(getDocs(colRef), REGISTRATION_STATUS_TIMEOUT_MS);
  return snap.size;
}
