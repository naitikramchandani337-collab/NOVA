// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, UserInfo } from '@/services/authService';
import { useProgressStore } from './progressStore';

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        const data = await authService.login(email, password);
        localStorage.setItem('nova_token', data.access_token);
        const user = await authService.getMe();
        set({ token: data.access_token, user, isAuthenticated: true, isLoading: false });
      },

      register: async (email, username, password) => {
        set({ isLoading: true });
        const data = await authService.register(email, username, password);
        localStorage.setItem('nova_token', data.access_token);
        const user = await authService.getMe();
        set({ token: data.access_token, user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem('nova_token');
        // Reset progress store too
        useProgressStore.getState();
        set({ token: null, user: null, isAuthenticated: false });
      },

      loadUser: async () => {
        const token = localStorage.getItem('nova_token');
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }
        try {
          set({ isLoading: true });
          const user = await authService.getMe();
          set({ token, user, isAuthenticated: true, isLoading: false });
        } catch {
          // Backend offline or token expired — just clear silently, don't crash
          localStorage.removeItem('nova_token');
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'nova-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
