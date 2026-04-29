// src/store/progressStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress, Achievement } from '@/types';
import { PHASES } from '@/config/phases';

interface ProgressState extends UserProgress {
  achievements: Achievement[];

  // Actions
  completeLesson: (lessonId: string) => void;
  completePhase: (phaseId: number) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  unlockAchievement: (achievementId: string) => void;
  hasSeenIntro: boolean;
  setHasSeenIntro: (seen: boolean) => void;

  // Getters
  getCurrentLevel: () => number;
  getLevelTitle: () => string;
  getNextLevelXP: () => number;
  canAccessPhase: (phaseId: number) => boolean;
  getLevelProgress: () => number;
}

const XP_PER_LEVEL = [
  0, 500, 1500, 3000, 6000, 10000, 15000, 22000, 32000, 50000
];

const LEVEL_TITLES = [
  'Data Cadet',
  'Algorithm Apprentice',
  'Neural Navigator',
  'Gradient Warrior',
  'Transformer Mage',
  'Model Architect',
  'AI Engineer',
  'Deep Mind',
  'Research Phantom',
  'AI Overlord'
];

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      userId: Math.random().toString(36).substring(2, 15),
      currentPhase: 1,
      completedPhases: [],
      completedLessons: [],
      totalXP: 0,
      level: 1,
      streak: 0,
      lastActive: new Date(),
      achievements: [],
      hasSeenIntro: true,

      setHasSeenIntro: (seen: boolean) => set({ hasSeenIntro: seen }),

      completeLesson: (lessonId: string) => {
        const state = get();
        if (state.completedLessons.includes(lessonId)) return;

        const lesson = PHASES
          .flatMap(p => p.lessons)
          .find(l => l.id === lessonId);

        if (!lesson) return;

        set({
          completedLessons: [...state.completedLessons, lessonId],
          totalXP: state.totalXP + lesson.xpReward
        });

        // Check level up
        const newLevel = get().getCurrentLevel();
        if (newLevel > state.level) {
          set({ level: newLevel });
        }
      },

      completePhase: (phaseId: number) => {
        const state = get();
        if (state.completedPhases.includes(phaseId)) return;

        const phase = PHASES.find(p => p.id === phaseId);
        if (!phase) return;

        set({
          completedPhases: [...state.completedPhases, phaseId],
          currentPhase: phaseId + 1,
          totalXP: state.totalXP + 200 // Bonus for completing phase
        });
      },

      addXP: (amount: number) => {
        const state = get();
        const newXP = state.totalXP + amount;
        set({ totalXP: newXP });

        const newLevel = get().getCurrentLevel();
        if (newLevel > state.level) {
          set({ level: newLevel });
        }
      },

      updateStreak: () => {
        const state = get();
        const lastActive = new Date(state.lastActive);
        const now = new Date();
        const diffDays = Math.floor(
          (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          set({ streak: state.streak + 1, lastActive: now });
        } else if (diffDays > 1) {
          set({ streak: 1, lastActive: now });
        } else {
          set({ lastActive: now });
        }
      },

      unlockAchievement: (achievementId: string) => {
        const state = get();
        const achievement = state.achievements.find(
          a => a.id === achievementId
        );

        if (achievement && !achievement.unlocked) {
          set({
            achievements: state.achievements.map(a =>
              a.id === achievementId
                ? { ...a, unlocked: true, unlockedAt: new Date() }
                : a
            )
          });
        }
      },

      getCurrentLevel: () => {
        const xp = get().totalXP;
        for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
          if (xp >= XP_PER_LEVEL[i]) return i + 1;
        }
        return 1;
      },

      getLevelTitle: () => {
        const level = get().getCurrentLevel();
        return LEVEL_TITLES[level - 1] || 'Unknown';
      },

      getNextLevelXP: () => {
        const level = get().getCurrentLevel();
        return XP_PER_LEVEL[level] || 999999;
      },

      canAccessPhase: (phaseId: number) => {
        const state = get();
        if (phaseId === 1) return true;
        return state.completedPhases.includes(phaseId - 1);
      },

      getLevelProgress: () => {
        const state = get();
        const currentXP = state.totalXP;
        const currentLevel = state.getCurrentLevel();
        const minXP = XP_PER_LEVEL[currentLevel - 1] || 0;
        const maxXP = XP_PER_LEVEL[currentLevel] || (minXP + 1000);
        
        const progress = ((currentXP - minXP) / (maxXP - minXP)) * 100;
        return Math.min(Math.max(progress, 0), 100);
      }
    }),
    {
      name: 'nova-progress'
    }
  )
);
