import axios from 'axios';
import type { RocketState } from '../components/Rocket/rocketData';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('nova_token') || ''}`,
  'Content-Type': 'application/json',
});

export const rocketApi = {
  async getRocketState(): Promise<RocketState> {
    try {
      const r = await axios.get(`${BASE}/api/rocket/state`, { headers: headers() });
      return r.data;
    } catch {
      return {
        totalParts: 12,
        unlockedParts: 0,
        currentPhase: 1,
        isLaunched: false,
        parts: Array.from({ length: 12 }, (_, i) => ({
          phase: i + 1,
          isUnlocked: false,
          isCurrent: i === 0,
          unlockedAt: undefined,
        })),
      };
    }
  },

  async unlockPart(phase: number): Promise<void> {
    await axios.post(`${BASE}/api/rocket/unlock`, { phase }, { headers: headers() });
  },

  async getRocketHistory(): Promise<{ phase: number; unlockedAt: string }[]> {
    try {
      const r = await axios.get(`${BASE}/api/rocket/history`, { headers: headers() });
      return r.data;
    } catch {
      return [];
    }
  },
};
