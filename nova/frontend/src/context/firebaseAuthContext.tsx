import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  auth, onAuthChange, signUpWithEmail, signInWithEmail,
  signInWithGoogle, logOut, type User,
} from '../lib/firebase';
import { createUserProfile } from '../lib/firestoreService';

interface FirebaseAuthContextType {
  user:            User | null;
  loading:         boolean;
  isAuthenticated: boolean;
  signUp:          (email: string, password: string, displayName: string) => Promise<void>;
  signIn:          (email: string, password: string) => Promise<void>;
  signInGoogle:    () => Promise<void>;
  logout:          () => Promise<void>;
}

const FirebaseAuthCtx = createContext<FirebaseAuthContextType | null>(null);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        // Store token for backend ASTRA calls
        u.getIdToken().then(token => localStorage.setItem('token', token));
        // Ensure Firestore profile exists
        await createUserProfile(u.uid, {
          displayName: u.displayName || u.email?.split('@')[0] || 'Commander',
          email:       u.email || '',
          photoURL:    u.photoURL || '',
        });
      } else {
        localStorage.removeItem('token');
      }
    });
    return unsub;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    await signUpWithEmail(email, password, displayName);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmail(email, password);
  };

  const signInGoogle = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await logOut();
  };

  return (
    <FirebaseAuthCtx.Provider value={{
      user, loading,
      isAuthenticated: !!user,
      signUp, signIn, signInGoogle, logout,
    }}>
      {children}
    </FirebaseAuthCtx.Provider>
  );
}

export const useFirebaseAuth = () => {
  const ctx = useContext(FirebaseAuthCtx);
  if (!ctx) throw new Error('useFirebaseAuth must be inside FirebaseAuthProvider');
  return ctx;
};
