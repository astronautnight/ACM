import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";

/**
 * Syncs user profile details from Google account authentication into Firestore.
 * Writes to: users/{userId}
 */
export async function syncUserToFirestore(user: User) {
  if (!db) return;
  
  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLoginAt: new Date().toISOString(),
    },
    { merge: true } // Keeps existing custom fields intact if any
  );
}

/**
 * Fetches user profile document.
 */
export async function getUserProfile(userId: string) {
  if (!db) return null;
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
}

/**
 * Updates user profile details in Firestore.
 */
export async function updateUserProfile(
  userId: string,
  data: { year: string; branch: string; section: string }
) {
  if (!db) return;
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, data, { merge: true });
}
