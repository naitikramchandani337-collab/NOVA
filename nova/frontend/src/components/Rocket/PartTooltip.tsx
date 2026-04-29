import { motion, AnimatePresence } from 'framer-motion';
import type { RocketPart } from './rocketData';

interface PartTooltipProps {
  part: RocketPart | null;
  isUnlocked: boolean;
  isCurrent: boolean;
  unlockedAt?: string;
}

export function PartTooltip({ part, isUnlocked, isCurrent, unlockedAt }: PartTooltipProps) {
  return (
    <AnimatePresence>
      {part && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        >
          <div
            className="rounded-2xl border px-5 py-4 min-w-64 max-w-xs"
            style={{
              background: 'rgba(10, 10, 20, 0.95)',
              backdropFilter: 'blur(16px)',
              borderColor: isUnlocked ? `${part.color}40` : 'rgba(75,85,99,0.4)',
            }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: isUnlocked ? part.color : '#374151',
                  boxShadow: isUnlocked ? `0 0 8px ${part.glowColor}` : 'none',
                }}
              />
              <div className="font-bold text-white text-sm">{part.name}</div>
              <div
                className="ml-auto text-xs px-2 py-0.5 rounded-full border"
                style={{
                  color: isUnlocked ? part.color : '#6b7280',
                  borderColor: isUnlocked ? `${part.color}40` : '#374151',
                  background: isUnlocked ? `${part.color}15` : 'transparent',
                }}
              >
                Phase {part.phase}
              </div>
            </div>

            <div className="text-xs text-teal-400 mb-2">◑ {part.topic}</div>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">{part.description}</p>

            {isUnlocked ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400 font-medium">● Installed</span>
                {unlockedAt && (
                  <span className="text-xs text-gray-600">{new Date(unlockedAt).toLocaleDateString()}</span>
                )}
              </div>
            ) : isCurrent ? (
              <div className="text-xs text-orange-400 font-medium">◑ In Progress — Complete Phase {part.phase} to unlock</div>
            ) : (
              <div className="text-xs text-gray-600">○ Locked — Complete Phase {part.phase - 1} first</div>
            )}

            <div className="mt-2 pt-2 border-t border-gray-800 text-xs text-gray-600">
              ⟡ Unlocks {part.xpReward} XP
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
