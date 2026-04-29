// src/services/progressService.ts
import { api } from './api';

export interface BackendProgress {
  current_phase: number;
  total_xp: number;
  current_level: number;
  streak_days: number;
  last_activity_date: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  total_xp: number;
  current_level: number;
  phases_completed: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  user_rank: number | null;
  total_users: number;
}

export interface BackendAchievement {
  achievement_key: string;
  achievement_name: string;
  description: string;
  unlocked_at: string;
}

export const progressService = {
  async getProgress(): Promise<BackendProgress> {
    const response = await api.get<BackendProgress>('/api/user/progress');
    return response.data;
  },

  async completePhase(phaseId: number, quizScore: number): Promise<void> {
    await api.post(`/api/phases/${phaseId}/complete`, null, {
      params: { quiz_score: quizScore },
    });
  },

  async getAllPhases() {
    const response = await api.get('/api/phases/');
    return response.data;
  },

  async getLeaderboard(): Promise<LeaderboardResponse> {
    const response = await api.get<LeaderboardResponse>('/api/gamification/leaderboard');
    return response.data;
  },

  async getAchievements(): Promise<BackendAchievement[]> {
    const response = await api.get<BackendAchievement[]>('/api/user/achievements');
    return response.data;
  },
};
