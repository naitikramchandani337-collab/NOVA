import React from 'react';
import { motion } from 'framer-motion';
import { RocketPart } from '@types/index';

interface RocketDisplayProps {
  parts: RocketPart[];
  totalPhases: number;
}

const ROCKET_PARTS_ORDER = [
  'Base',
  'Engine Core',
  'Fuel Tank',
  'Navigation System',
  'Payload Bay',
  'Solar Panels',
  'Communication Array',
  'Stabilizers',
  'Heat Shield',
  'Apex Cone',
];

export const RocketDisplay: React.FC<RocketDisplayProps> = ({ parts, totalPhases }) => {
  const unlockedCount = parts.length;
  const progress = (unlockedCount / totalPhases) * 100;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Rocket Visual */}
      <motion.div
        className="relative w-32 h-64 bg-gradient-to-b from-rocket-primary to-rocket-secondary rounded-full flex flex-col items-center justify-center"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="text-4xl">🚀</div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-rocket-accent rounded-full blur-lg opacity-50" />
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-space-300">Rocket Progress</span>
          <span className="text-sm font-bold text-rocket-primary">
            {unlockedCount}/{totalPhases}
          </span>
        </div>
        <div className="w-full h-3 bg-space-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rocket-primary to-rocket-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Parts List */}
      <div className="w-full max-w-xs space-y-2">
        {ROCKET_PARTS_ORDER.map((partName, index) => {
          const isUnlocked = parts.some((p) => p.part_name === partName);
          return (
            <motion.div
              key={partName}
              className={`p-2 rounded-lg text-sm transition ${
                isUnlocked
                  ? 'bg-space-800 text-rocket-primary'
                  : 'bg-space-900 text-space-500'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="mr-2">{isUnlocked ? '✓' : '○'}</span>
              {partName}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
