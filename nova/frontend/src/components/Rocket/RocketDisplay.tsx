import React from 'react';
import { motion } from 'framer-motion';
import { RocketPart, RocketPartType } from '@types/index';

interface RocketDisplayProps {
  parts: string[]; // This will now be an array of part IDs from Firestore
  totalPhases: number;
}

const ROCKET_PARTS_METADATA: Record<string, { name: string; icon: string }> = {
  'body': { name: 'Main Fuselage', icon: '🏗️' },
  'fuel_tank': { name: 'Fuel Reservoirs', icon: '🛢️' },
  'engine': { name: 'Ion Engine', icon: '🚀' },
  'guidance_system': { name: 'Guidance Array', icon: '📡' },
  'brain_core': { name: 'AI Brain Core', icon: '🧠' },
  'navigation_system': { name: 'Nav Array', icon: '🗺️' },
  'consciousness': { name: 'Consciousness Link', icon: '✨' },
  'payload': { name: 'Payload Module', icon: '📦' },
  'boosters': { name: 'RL Boosters', icon: '🔥' },
  'full_assembly': { name: 'Control Rig', icon: '⚙️' },
  'power_systems': { name: 'Power Cell', icon: '⚡' },
  'vision_sensors': { name: 'Nose Cone', icon: '👁️' },
};

export const RocketDisplay: React.FC<RocketDisplayProps> = ({ parts, totalPhases }) => {
  const unlockedCount = parts.length;
  const progress = (unlockedCount / totalPhases) * 100;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Rocket Visual */}
      <motion.div
        className="relative w-32 h-64 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full flex flex-col items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.3)]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="text-5xl drop-shadow-2xl">🚀</div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-blue-500 rounded-full blur-2xl opacity-40" />
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Rocket Progress</span>
          <span className="text-sm font-black text-blue-400">
            {unlockedCount}/{totalPhases}
          </span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Parts List */}
      <div className="w-full space-y-2">
        {Object.entries(ROCKET_PARTS_METADATA).map(([id, meta], index) => {
          const isUnlocked = parts.includes(id);
          return (
            <motion.div
              key={id}
              className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-3 border transition-all ${
                isUnlocked
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-white/5 border-white/5 text-zinc-600 opacity-60'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${isUnlocked ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                {meta.icon}
              </div>
              <span className="flex-1">{meta.name}</span>
              {isUnlocked && <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded-full">ACTIVE</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
