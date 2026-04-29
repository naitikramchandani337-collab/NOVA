import { useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Rocket3D } from './Rocket3D';
import type { RocketState, RocketPart } from './rocketData';

interface RocketWidgetProps {
  rocketState: RocketState;
}

const noOp = () => {};

export function RocketWidget({ rocketState }: RocketWidgetProps) {
  const navigate = useNavigate();
  const progress = (rocketState.unlockedParts / rocketState.totalParts) * 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate('/rocket')}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-teal-500/30 transition-all relative"
      style={{ height: '320px' }}
    >
      <div className="absolute inset-0">
        <Rocket3D
          rocketState={rocketState}
          newlyUnlocked={null}
          onPartClick={noOp}
          onPartHover={noOp}
          interactive={false}
          mini={true}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4">
          <div className="text-xs text-teal-400 tracking-widest uppercase">◑ Rocket Progress</div>
          <div className="text-white font-bold text-lg mt-0.5">{rocketState.unlockedParts}/12 Parts</div>
        </div>
        <div className="absolute top-4 right-4 text-right">
          <div className="text-xs text-gray-500">Current Phase</div>
          <div className="text-orange-400 font-bold">{rocketState.currentPhase}/12</div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Build Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-teal-400"
            />
          </div>
          <div className="text-xs text-gray-600 text-center mt-2">Click to view full rocket</div>
        </div>
      </div>
    </motion.div>
  );
}
