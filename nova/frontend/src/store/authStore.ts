// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, onAuthChange } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestoreService';

interface AuthUser {
  uid: string;
  email: string;
  username: string;
  photoURL?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,

      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ isLoading: loading }),

      logout: async () => {
        await auth.signOut();
        set({ user: null, isAuthenticated: false, token: null });
        localStorage.removeItem('token');
      },
    }),
    {
      name: 'nova-auth-v2',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Initialize listener
onAuthChange(async (u) => {
  const store = useAuthStore.getState();
  if (u) {
    const token = await u.getIdToken();
    localStorage.setItem('token', token);
    
    // Fetch profile from Firestore
    const profile = await getUserProfile(u.uid);
    
    store.setUser({
      uid: u.uid,
      email: u.email || '',
      username: profile?.displayName || u.displayName || 'Commander',
      photoURL: u.photoURL || undefined,
    });
    store.setToken(token);
  } else {
    store.setUser(null);
    store.setToken(null);
    localStorage.removeItem('token');
  }
  store.setLoading(false);
});
