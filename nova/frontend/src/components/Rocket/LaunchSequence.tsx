import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RocketState } from './rocketData';

interface LaunchSequenceProps {
  rocketState: RocketState;
  onComplete: () => void;
}

type LaunchPhase = 'standby' | 'countdown' | 'ignition' | 'launch' | 'space' | 'complete';

export function LaunchSequence({ rocketState, onComplete }: LaunchSequenceProps) {
  const [phase,   setPhase]   = useState<LaunchPhase>('standby');
  const [count,   setCount]   = useState(10);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase('countdown'), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count > 0) {
      const t = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setPhase('ignition');
      setTimeout(() => {
        setShaking(true);
        setTimeout(() => {
          setPhase('launch');
          setTimeout(() => setPhase('space'),    3000);
          setTimeout(() => setPhase('complete'), 6000);
        }, 2000);
      }, 500);
    }
  }, [phase, count]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.8 + 0.2 }}
            animate={
              phase === 'launch' || phase === 'space'
                ? { y: [0, window.innerHeight], opacity: [1, 0] }
                : { opacity: [0.2, 1, 0.2] }
            }
            transition={
              phase === 'launch' || phase === 'space'
                ? { duration: 0.8 + Math.random() * 0.5, delay: Math.random() * 0.5, repeat: Infinity }
                : { duration: 2 + Math.random() * 3, repeat: Infinity }
            }
          />
        ))}
      </div>

      <AnimatePresence>
        {phase === 'standby' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center z-10">
            <div className="text-teal-400 text-sm tracking-widest uppercase mb-3">✦ Mission Status</div>
            <div className="text-white text-4xl font-black mb-2">ALL SYSTEMS GO</div>
            <div className="text-gray-400">Rocket assembly complete. Preparing launch sequence.</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center z-10">
            <div className="text-gray-500 text-sm tracking-widest uppercase mb-4">◑ Launch Countdown</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={count}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-9xl font-black"
                style={{ color: count <= 3 ? '#f97316' : '#ffffff', textShadow: count <= 3 ? '0 0 40px #f97316' : '0 0 20px rgba(255,255,255,0.3)' }}
              >
                {count}
              </motion.div>
            </AnimatePresence>
            <div className="text-gray-500 text-sm mt-4 tracking-widest">T-{count} SECONDS</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'ignition' && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center z-10">
            <motion.div className="text-6xl font-black text-orange-400 mb-4" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.3, repeat: Infinity }} style={{ textShadow: '0 0 40px #f97316' }}>
              IGNITION
            </motion.div>
            <div className="text-gray-400 tracking-widest text-sm">● ENGINE CORE FIRING</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'launch' && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center z-10">
            <motion.div className="text-8xl font-black text-white mb-2" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.2, repeat: Infinity }} style={{ textShadow: '0 0 60px #f97316' }}>
              LAUNCH
            </motion.div>
            <div className="text-orange-400 text-xl tracking-widest">WE HAVE LIFTOFF</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'space' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center z-10">
            <div className="text-teal-400 text-sm tracking-widest uppercase mb-3">✦ Deep Space Achieved</div>
            <div className="text-white text-5xl font-black mb-4">ORBIT CONFIRMED</div>
            <div className="text-gray-400 text-lg">Your AI mastery has reached the stars, Commander.</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'complete' && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 20 }} className="text-center z-10 px-8 max-w-2xl">
            <motion.div className="text-8xl mb-6" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>✦</motion.div>
            <div className="text-teal-400 text-sm tracking-widest uppercase mb-3">Mission Complete</div>
            <h1 className="text-5xl font-black text-white mb-4 leading-tight">You Are An AI Engineer, Commander</h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">12 phases completed. 12 rocket parts assembled. Your knowledge has achieved deep space trajectory.</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[{ label: 'Phases Complete', value: '12/12' }, { label: 'Parts Built', value: '12/12' }, { label: 'XP Earned', value: '1,700+' }].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onComplete} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg shadow-2xl">
              ● Return to Mission Control
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {shaking && phase === 'ignition' && (
        <style>{`body { animation: shake 0.1s infinite; } @keyframes shake { 0% { transform: translate(0,0); } 25% { transform: translate(-3px,3px); } 50% { transform: translate(3px,-3px); } 75% { transform: translate(-3px,-3px); } 100% { transform: translate(3px,3px); } }`}</style>
      )}

      <AnimatePresence>
        {(phase === 'ignition' || phase === 'launch') && (
          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} exit={{ opacity: 0 }} className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.4) 0%, transparent 70%)' }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
