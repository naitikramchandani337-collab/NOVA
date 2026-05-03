import React, { useEffect, useState } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function XPBar() {
  const { totalXP, level, getLevelProgress } = useProgressStore();
  const safeXP = totalXP ?? 0;
  const safeLevel = level ?? 1;
  const [prevXp, setPrevXp] = useState(safeXP);
  const [showNotification, setShowNotification] = useState(false);
  const progress = getLevelProgress() ?? 0;

  useEffect(() => {
    if (safeXP > prevXp) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 3000);
      setPrevXp(safeXP);
      return () => clearTimeout(timer);
    }
  }, [safeXP, prevXp]);

  return (
    <>
      {/* Level / XP Indicator (Top Left) */}
      <div className="fixed top-8 left-8 z-[100] flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600 opacity-10" />
            <span className="text-2xl font-black italic text-white z-10 group-hover:scale-110 transition-transform">
              L{safeLevel}
            </span>
          </div>
          <svg className="absolute -inset-1 w-16 h-16 -rotate-90 pointer-events-none">
            <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
            <motion.circle
              cx="32" cy="32" r="30" fill="none" stroke="#3b82f6" strokeWidth="2"
              strokeDasharray="188.5"
              initial={{ strokeDashoffset: 188.5 }}
              animate={{ strokeDashoffset: 188.5 - (188.5 * progress) / 100 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
        </div>

        <div className="hidden md:block">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">XP Earned</div>
          <div className="text-lg font-black text-white italic tracking-tighter">
            {safeXP.toLocaleString()} <span className="text-zinc-600 text-xs font-bold">TOTAL</span>
          </div>
        </div>
      </div>

      {/* XP Gain Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-24 left-8 z-[110] flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/40"
          >
            <Zap className="w-4 h-4 fill-white" />
            Mission Reward +{safeXP - prevXp} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global XP Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/5 z-[100] overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600"
          animate={{ width: `${progress}%`, filter: showNotification ? 'brightness(2)' : 'brightness(1)' }}
          transition={{ duration: 0.5 }}
          style={{ boxShadow: '0 0 10px rgba(59,130,246,0.5)' }}
        />
      </div>
    </>
  );
}
