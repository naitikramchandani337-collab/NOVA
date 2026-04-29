/**
 * progressStore.ts
 * Zustand store that syncs with Firestore.
 * Local state is the source of truth for UI; Firestore is the source of truth for persistence.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getUserProgress, addXP, completeLesson,
  completePhase, updateStreak, subscribeToProgress,
  type UserProgress,
} from '@/lib/firestoreService';
import { auth } from '@/lib/firebase';

interface ProgressState {
  // Local state (mirrors Firestore)
  totalXP:          number;
  level:            number;
  currentPhase:     number;
  completedPhases:  number[];
  completedLessons: string[];
  streak:           number;
  rocketParts:      string[];
  hasSeenIntro:     boolean;

  // Actions
  loadFromFirestore:  (uid: string) => Promise<void>;
  addXP:              (amount: number) => Promise<void>;
  completeLesson:     (lessonId: string, xpReward: number) => Promise<void>;
  completePhase:      (phaseId: number, partName: string) => Promise<void>;
  updateStreak:       () => Promise<void>;
  setHasSeenIntro:    (seen: boolean) => void;

  // Computed
  getCurrentLevel:    () => number;
  getLevelProgress:   () => number;
  getNextLevelXP:     () => number;
  canAccessPhase:     (phaseId: number) => boolean;
}

const XP_PER_LEVEL = [0, 500, 1500, 3000, 6000, 10000, 15000, 22000, 32000, 50000];

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      totalXP: 0, level: 1, currentPhase: 1,
      completedPhases: [], completedLessons: [],
      streak: 0, rocketParts: [], hasSeenIntro: false,

      loadFromFirestore: async (uid: string) => {
        try {
          const p = await getUserProgress(uid);
          set({
            totalXP:          p.totalXP,
            level:            p.level,
            currentPhase:     p.currentPhase,
            completedPhases:  p.completedPhases,
            completedLessons: p.completedLessons,
            streak:           p.streak,
            rocketParts:      p.rocketParts,
          });
        } catch (e) {
          console.error('Failed to load progress from Firestore:', e);
        }
      },

      addXP: async (amount: number) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        set(s => ({ totalXP: s.totalXP + amount }));
        await addXP(uid, amount);
      },

      completeLesson: async (lessonId: string, xpReward: number) => {
        const uid = auth.currentUser?.uid;
        const { completedLessons } = get();
        if (!uid || completedLessons.includes(lessonId)) return;
        set(s => ({
          completedLessons: [...s.completedLessons, lessonId],
          totalXP: s.totalXP + xpReward,
        }));
        await completeLesson(uid, lessonId, xpReward);
      },

      completePhase: async (phaseId: number, partName: string) => {
        const uid = auth.currentUser?.uid;
        const { completedPhases } = get();
        if (!uid || completedPhases.includes(phaseId)) return;
        set(s => ({
          completedPhases: [...s.completedPhases, phaseId],
          rocketParts:     [...s.rocketParts, partName],
          currentPhase:    phaseId + 1,
          totalXP:         s.totalXP + 200,
        }));
        await completePhase(uid, phaseId, partName);
      },

      updateStreak: async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        await updateStreak(uid);
        // Reload streak from Firestore
        const p = await getUserProgress(uid);
        set({ streak: p.streak });
      },

      setHasSeenIntro: (seen: boolean) => set({ hasSeenIntro: seen }),

      getCurrentLevel: () => {
        const xp = get().totalXP;
        for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
          if (xp >= XP_PER_LEVEL[i]) return i + 1;
        }
        return 1;
      },

      getLevelProgress: () => {
        const xp    = get().totalXP;
        const level = get().getCurrentLevel();
        const min   = XP_PER_LEVEL[level - 1] || 0;
        const max   = XP_PER_LEVEL[level] || min + 1000;
        return Math.min(Math.max(((xp - min) / (max - min)) * 100, 0), 100);
      },

      getNextLevelXP: () => {
        const level = get().getCurrentLevel();
        return XP_PER_LEVEL[level] || 999999;
      },

      canAccessPhase: (phaseId: number) => {
        if (phaseId === 1) return true;
        return get().completedPhases.includes(phaseId - 1);
      },
    }),
    { name: 'nova-progress-v2' }
  )
);
