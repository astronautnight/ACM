import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  year?: string;
  branch?: string;
  section?: string;
  createdAt?: string;
  lastLoginAt?: string;
  registeredEvents?: string[];
}

/**
 * Checks if all required academic profile fields are completed.
 */
export function isProfileComplete(profile: Partial<UserProfile> | null | undefined): boolean {
  if (!profile) return false;
  return Boolean(
    profile.year &&
    profile.year.trim() !== "" &&
    profile.branch &&
    profile.branch.trim() !== "" &&
    profile.section &&
    profile.section.trim() !== ""
  );
}

/**
 * Syncs user profile details from Google account authentication into Firestore.
 * Initializes academic year, branch, and section if new user.
 * Writes to: users/{userId}
 */
export async function syncUserToFirestore(user: User): Promise<{
  isNewUser: boolean;
  profile: UserProfile | null;
}> {
  if (!db) return { isNewUser: false, profile: null };
  
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const now = new Date().toISOString();

  if (!snap.exists()) {
    // New user signup - initialize with empty academic details so fields exist in Firestore
    const newProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
      year: "",
      branch: "",
      section: "",
      createdAt: now,
      lastLoginAt: now,
    };
    await setDoc(userRef, newProfile);
    return { isNewUser: true, profile: newProfile };
  } else {
    // Existing user login - update lastLoginAt and latest auth info
    const existingData = snap.data() as Partial<UserProfile>;
    const updatedData = {
      displayName: user.displayName || existingData.displayName || null,
      email: user.email || existingData.email || null,
      photoURL: user.photoURL || existingData.photoURL || null,
      lastLoginAt: now,
    };
    await setDoc(userRef, updatedData, { merge: true });

    return {
      isNewUser: false,
      profile: {
        ...existingData,
        ...updatedData,
        uid: user.uid,
      } as UserProfile,
    };
  }
}

/**
 * Fetches user profile document.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!db) return null;
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
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
  await setDoc(
    userRef,
    {
      year: data.year.trim(),
      branch: data.branch.trim(),
      section: data.section.trim(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

