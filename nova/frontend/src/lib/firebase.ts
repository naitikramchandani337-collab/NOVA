import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'AIzaSyBBUO-FthhH8h7QWmGrNU9aAemZSbs0pY4',
  authDomain:        'nova-28eea.firebaseapp.com',
  projectId:         'nova-28eea',
  storageBucket:     'nova-28eea.firebasestorage.app',
  messagingSenderId: '879460252283',
  appId:             '1:879460252283:web:8a2f1491e90a722bf880de',
  measurementId:     'G-F3KZ9VXTQH',
};

const app          = initializeApp(firebaseConfig);
export const auth  = getAuth(app);
export const db    = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ── Auth helpers ─────────────────────────────────────────
export const signUpWithEmail = (email: string, password: string, displayName: string) =>
  createUserWithEmailAndPassword(auth, email, password).then(async (cred) => {
    await updateProfile(cred.user, { displayName });
    return cred;
  });

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const logOut = () => signOut(auth);

export const onAuthChange = (cb: (user: User | null) => void) =>
  onAuthStateChanged(auth, cb);

export type { User };
