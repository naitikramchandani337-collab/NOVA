// src/context/progressContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { useAuthStore } from '@/store/authStore';
import { UserStats, Leaderboard } from '@/types';
import { getLeaderboard } from '@/lib/firestoreService';

interface ProgressContextType {
  stats: UserStats | null;
  leaderboard: Leaderboard | null;
  loading: boolean;
  refreshStats: () => Promise<void>;
  refreshLeaderboard: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  const progress = useProgressStore();
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStats = async () => {
    if (user?.uid) {
      await progress.loadFromFirestore(user.uid);
    }
  };

  const refreshLeaderboard = async () => {
    try {
      const entries = await getLeaderboard(50);
      // Map Firestore entries to LeaderboardEntry type
      const mappedEntries = entries.map((e: any) => ({
        username: e.username || 'Unknown',
        rank: e.rank,
        total_xp: e.totalXP || 0,
        current_level: e.level || 1,
        phases_completed: e.completedPhases?.length || 0,
      }));

      setLeaderboard({
        entries: mappedEntries,
        user_rank: null, // Would need more complex query for actual rank
        total_users: entries.length,
      });
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshStats(), refreshLeaderboard()]);
      setLoading(false);
    };
    if (user) {
      init();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Map progress store to UserStats interface for compatibility
  const stats: UserStats | null = user ? {
    user: {
      username: user.username,
      email: user.email,
    },
    progress: {
      total_xp: progress.totalXP,
      current_level: progress.level,
      streak_days: progress.streak,
    },
    phases_completed: progress.completedPhases.length,
    rocket_parts_unlocked: progress.rocketParts,
  } : null;

  return (
    <ProgressContext.Provider value={{
      stats,
      leaderboard,
      loading,
      refreshStats,
      refreshLeaderboard,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
