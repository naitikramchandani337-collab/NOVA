import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserStats, Phase, Leaderboard } from '@types/index';
import api from '@utils/api';
import { useAuth } from './authContext';

interface ProgressContextType {
  stats: UserStats | null;
  phases: Phase[];
  leaderboard: Leaderboard | null;
  isLoading: boolean;
  fetchStats: () => Promise<void>;
  fetchPhases: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  completePhase: (phaseId: number, quizScore: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await api.get<UserStats>('/user/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchPhases = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await api.get<Phase[]>('/phases', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhases(response.data);
    } catch (error) {
      console.error('Failed to fetch phases:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchLeaderboard = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await api.get<Leaderboard>('/gamification/leaderboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const completePhase = useCallback(
    async (phaseId: number, quizScore: number) => {
      if (!token) return;
      setIsLoading(true);
      try {
        await api.post(
          `/phases/${phaseId}/complete`,
          { quiz_score: quizScore },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchStats();
        await fetchPhases();
      } catch (error) {
        console.error('Failed to complete phase:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchStats, fetchPhases]
  );

  return (
    <ProgressContext.Provider
      value={{
        stats,
        phases,
        leaderboard,
        isLoading,
        fetchStats,
        fetchPhases,
        fetchLeaderboard,
        completePhase,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};
