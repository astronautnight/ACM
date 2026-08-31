"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  syncUserToFirestore,
  getUserProfile,
  updateUserProfile,
  isProfileComplete,
  UserProfile,
} from "@/lib/users";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

/* ------------------------------------------------------------------ */
/*  Context value                                                      */
/* ------------------------------------------------------------------ */
interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveProfile: (data: { year: string; branch: string; section: string }) => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  isConfigured: false,
  showOnboarding: false,
  setShowOnboarding: () => {},
  signInGoogle: async () => {},
  logout: async () => {},
  saveProfile: async () => {},
  refreshProfile: async () => null,
});

export const useAuth = () => useContext(AuthContext);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const isConfigured = isFirebaseConfigured();

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return null;
    }
    try {
      const p = await getUserProfile(user.uid);
      setProfile(p);
      return p;
    } catch (err) {
      console.error("Failed to refresh profile:", err);
      return null;
    }
  }, [user]);

  /* Listen to Firebase auth state */
  useEffect(() => {
    if (isConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          try {
            const { profile: syncedProfile } = await syncUserToFirestore(firebaseUser);
            setProfile(syncedProfile);
            if (!isProfileComplete(syncedProfile)) {
              setShowOnboarding(true);
            }
          } catch (err) {
            console.warn("Could not sync user profile to Firestore:", err);
          }
        } else {
          setProfile(null);
          setShowOnboarding(false);
        }
        setLoading(false);
      });
      return unsubscribe;
    }
    setLoading(false);
  }, [isConfigured]);

  /* ---- Google Sign-In ---- */
  const signInGoogle = useCallback(async () => {
    if (!auth) {
      console.error("Firebase is not configured. Add your credentials to .env.local");
      return;
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      try {
        const { profile: syncedProfile } = await syncUserToFirestore(result.user);
        setProfile(syncedProfile);
        if (!isProfileComplete(syncedProfile)) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.warn("Could not sync user profile to Firestore (check your Firestore Security Rules):", err);
      }
    }
  }, []);

  /* ---- Save Profile (Year, Branch, Section) ---- */
  const saveProfile = useCallback(async (data: { year: string; branch: string; section: string }) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    setProfile((prev) => ({
      ...(prev || {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      }),
      year: data.year,
      branch: data.branch,
      section: data.section,
    }));
    setShowOnboarding(false);
  }, [user]);

  /* ---- Logout ---- */
  const logout = useCallback(async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setProfile(null);
    setShowOnboarding(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured,
        showOnboarding,
        setShowOnboarding,
        signInGoogle,
        logout,
        saveProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

