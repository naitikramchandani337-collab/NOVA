import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  auth, onAuthChange, signUpWithEmail as firebaseSignUp,
  signInWithEmail, signInWithGoogle as firebaseSignInGoogle,
  logOut, type User, googleProvider,
} from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

interface FirebaseAuthContextType {
  user:            User | null;
  loading:         boolean;
  isAuthenticated: boolean;
  signUp:          (email: string, password: string, displayName: string) => Promise<any>;
  signIn:          (email: string, password: string) => Promise<any>;
  signInGoogle:    () => Promise<any>;
  logout:          () => Promise<void>;
}

const FirebaseAuthCtx = createContext<FirebaseAuthContextType | null>(null);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Creates all Firestore documents for new user
  const createUserDocuments = async (
    uid: string,
    email: string,
    username: string
  ) => {
    try {
      const userRef = doc(db, 'users', uid);
      const existing = await getDoc(userRef);

      // Only create if does not exist
      if (existing.exists()) return;

      const now = serverTimestamp();

      // Profile document
      await setDoc(doc(db, 'users', uid, 'profile', 'data'), {
        username,
        email,
        avatar: 'default',
        bio: '',
        isPublic: true,
        joinedAt: now,
      });

      // Progress document
      await setDoc(doc(db, 'users', uid, 'progress', 'data'), {
        xp: 0,
        level: 1,
        streak: 0,
        currentPhase: 1,
        lastActive: now,
        completedPhases: [],
        completedLessons: [],
      });

      // Settings document
      await setDoc(doc(db, 'users', uid, 'settings', 'data'), {
        theme: 'dark',
        astraMode: 'explain',
        notificationsEnabled: true,
        streakReminders: true,
        friendNotifications: true,
        astraPersonality: 'encouraging',
        astraResponseLength: 'balanced',
        reduceAnimations: false,
        compactMode: false,
      });

      // Rocket document
      await setDoc(doc(db, 'users', uid, 'rocket', 'data'), {
        unlockedParts: [],
        isLaunched: false,
        currentPhase: 1,
        launchDate: null,
      });

      // Also create a top level user document for leaderboard queries
      await setDoc(doc(db, 'users', uid), {
        uid,
        username,
        email,
        xp: 0,
        level: 1,
        streak: 0,
        currentPhase: 1,
        createdAt: now,
      });

      console.log('User documents created successfully');
    } catch (error) {
      console.error('Error creating user documents:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Store token for backend ASTRA calls
        firebaseUser.getIdToken().then(token => localStorage.setItem('token', token));
        
        // Create documents if they don't exist yet
        await createUserDocuments(
          firebaseUser.uid,
          firebaseUser.email || '',
          firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Commander'
        );
      } else {
        localStorage.removeItem('token');
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;
    // Create all user documents in Firestore
    await createUserDocuments(uid, email, username || email.split('@')[0]);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    return await signInWithEmail(email, password);
  };

  const signInGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const uid = result.user.uid;
    const email = result.user.email || '';
    const username = result.user.displayName || email.split('@')[0];
    // Create documents only if first time
    await createUserDocuments(uid, email, username);
    return result;
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
