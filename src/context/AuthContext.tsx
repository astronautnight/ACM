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
import { syncUserToFirestore } from "@/lib/users";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

/* ------------------------------------------------------------------ */
/*  Context value                                                      */
/* ------------------------------------------------------------------ */
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isConfigured: false,
  signInGoogle: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isFirebaseConfigured();

  /* Listen to Firebase auth state */
  useEffect(() => {
    if (isConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
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
        await syncUserToFirestore(result.user);
      } catch (err) {
        console.warn("Could not sync user profile to Firestore (check your Firestore Security Rules):", err);
      }
    }
  }, []);

  /* ---- Logout ---- */
  const logout = useCallback(async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isConfigured, signInGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
