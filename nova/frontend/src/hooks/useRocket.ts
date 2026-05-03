import { useState, useEffect, useCallback } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { useRocketStore } from '@/store/rocketStore';

export function useRocket() {
  const { completedPhases, currentPhase, rocketParts } = useProgressStore();
  const { getCompletionPercentage } = useRocketStore();

  const [loading, setLoading] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<number | null>(null);

  const rocketState = {
    totalParts: 12,
    unlockedParts: completedPhases.length,
    currentPhase: currentPhase,
    isLaunched: completedPhases.length >= 12,
    parts: Array.from({ length: 12 }, (_, i) => ({
      phase: i + 1,
      isUnlocked: completedPhases.includes(i + 1),
      isCurrent: currentPhase === i + 1,
      unlockedAt: completedPhases.includes(i + 1) ? new Date().toISOString() : undefined,
    })),
  };

  const getPartState = useCallback(
    (phase: number) => rocketState.parts.find(p => p.phase === phase),
    [rocketState.parts]
  );

  const progressPercent = getCompletionPercentage();

  return {
    rocketState,
    loading,
    showLaunch,
    setShowLaunch,
    newlyUnlocked,
    getPartState,
    progressPercent,
  };
}
