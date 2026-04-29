import { useState, useEffect, useCallback } from 'react';
import { rocketApi } from '../services/rocketApi';
import type { RocketState } from '../components/rocket/rocketData';

export function useRocket() {
  const [rocketState, setRocketState] = useState<RocketState>({
    totalParts: 12,
    unlockedParts: 0,
    currentPhase: 1,
    isLaunched: false,
    parts: Array.from({ length: 12 }, (_, i) => ({
      phase: i + 1,
      isUnlocked: false,
      isCurrent: i === 0,
    })),
  });
  const [loading,        setLoading]        = useState(true);
  const [showLaunch,     setShowLaunch]     = useState(false);
  const [newlyUnlocked,  setNewlyUnlocked]  = useState<number | null>(null);

  const loadState = useCallback(async () => {
    try {
      const state = await rocketApi.getRocketState();
      setRocketState(state);
      if (state.isLaunched && !showLaunch) setShowLaunch(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadState(); }, [loadState]);

  const unlockPart = useCallback(async (phase: number) => {
    try {
      await rocketApi.unlockPart(phase);
      setNewlyUnlocked(phase);
      await loadState();
      if (phase === 12) setTimeout(() => setShowLaunch(true), 2000);
      setTimeout(() => setNewlyUnlocked(null), 4000);
    } catch (e) {
      console.error(e);
    }
  }, [loadState]);

  const getPartState = useCallback(
    (phase: number) => rocketState.parts.find(p => p.phase === phase),
    [rocketState]
  );

  const progressPercent = (rocketState.unlockedParts / rocketState.totalParts) * 100;

  return {
    rocketState, loading, showLaunch, setShowLaunch,
    newlyUnlocked, unlockPart, getPartState, progressPercent,
    reload: loadState,
  };
}
