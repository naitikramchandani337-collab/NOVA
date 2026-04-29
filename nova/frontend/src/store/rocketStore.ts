// src/store/rocketStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RocketPart } from '@/types';

// Matching the user's vision of 10 core rocket components
export type RocketPartId = 
  | 'body' 
  | 'fuel_tank' 
  | 'engine' 
  | 'brain_core' 
  | 'power_systems' 
  | 'navigation_system' 
  | 'consciousness' 
  | 'payload' 
  | 'boosters' 
  | 'full_assembly';

interface RocketState {
  parts: RocketPart[];
  isLaunching: boolean;
  launchProgress: number;

  // Actions
  unlockPart: (partId: RocketPartId) => void;
  startLaunch: () => void;
  updateLaunchProgress: (progress: number) => void;

  // Getters
  getUnlockedParts: () => RocketPart[];
  getCompletionPercentage: () => number;
  isPartUnlocked: (partId: RocketPartId) => boolean;
}

const INITIAL_PARTS: RocketPart[] = [
  { id: 'body', name: 'Base Structure', unlocked: false, position: [0, 0, 0], color: '#71717a' },
  { id: 'fuel_tank', name: 'Fuel Tank', unlocked: false, position: [0, -2, 0], color: '#3b82f6' },
  { id: 'engine', name: 'Thruster Engine', unlocked: false, position: [0, -4, 0], color: '#ef4444' },
  { id: 'brain_core', name: 'Brain Core', unlocked: false, position: [0, 2, 0], color: '#8b5cf6' },
  { id: 'power_systems', name: 'Power Matrix', unlocked: false, position: [0, 1, 0], color: '#eab308' },
  { id: 'navigation_system', name: 'Nav Array', unlocked: false, position: [0, 3, 0], color: '#10b981' },
  { id: 'consciousness', name: 'AI Consciousness', unlocked: false, position: [0, 2.5, 0], color: '#f43f5e' },
  { id: 'payload', name: 'Mission Payload', unlocked: false, position: [0, -1, 0], color: '#6366f1' },
  { id: 'boosters', name: 'Turbo Boosters', unlocked: false, position: [0, -3.5, 0], color: '#f97316' },
  { id: 'full_assembly', name: 'Final Hull', unlocked: false, position: [0, 4, 0], color: '#ffffff' }
];

export const useRocketStore = create<RocketState>()(
  persist(
    (set, get) => ({
      parts: INITIAL_PARTS,
      isLaunching: false,
      launchProgress: 0,

      unlockPart: (partId: RocketPartId) => {
        set(state => ({
          parts: state.parts.map(part =>
            part.id === partId ? { ...part, unlocked: true } : part
          )
        }));
      },

      startLaunch: () => {
        set({ isLaunching: true, launchProgress: 0 });
      },

      updateLaunchProgress: (progress: number) => {
        set({ launchProgress: progress });
      },

      getUnlockedParts: () => {
        return get().parts.filter(part => part.unlocked);
      },

      getCompletionPercentage: () => {
        const parts = get().parts;
        const unlockedCount = parts.filter(p => p.unlocked).length;
        return (unlockedCount / parts.length) * 100;
      },

      isPartUnlocked: (partId: RocketPartId) => {
        return get().parts.find(p => (p.id as any) === partId)?.unlocked || false;
      }
    }),
    {
      name: 'nova-rocket'
    }
  )
);
