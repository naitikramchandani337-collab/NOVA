import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Sparkles } from 'lucide-react';

export default function LaunchSequence({ onComplete }: { onComplete: () => void }) {
  const [countdown, setCountdown] = useState(10);
  const [phase, setPhase] = useState<'countdown' | 'ignite' | 'launch' | 'completed'>('countdown');

  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && phase === 'countdown') {
      setPhase('ignite');
      setTimeout(() => setPhase('launch'), 2000);
    }
  }, [countdown, phase]);

  useEffect(() => {
    if (phase === 'launch') {
        setTimeout(() => {
            setPhase('completed');
            setTimeout(onComplete, 3000);
        }, 5000);
    }
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="text-center"
          >
             <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4">Launch Authorization Confirmed</div>
             <div className="text-9xl font-black text-white italic">{countdown}</div>
          </motion.div>
        )}

        {phase === 'ignite' && (
           <motion.div
            key="ignite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
           >
              <div className="text-2xl font-black text-orange-500 uppercase tracking-widest animate-pulse">Ignition</div>
              <div className="mt-8 flex gap-2">
                 {[1, 2, 3].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 0.2, delay: i * 0.05 }}
                        className="w-1 h-12 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"
                    />
                 ))}
              </div>
           </motion.div>
        )}

        {phase === 'launch' && (
            <motion.div
                key="launch"
                className="relative h-full w-full flex items-center justify-center"
            >
                {/* Environment Streaks */}
                <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -1000 }}
                            animate={{ y: 2000 }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: Math.random() * 2 }}
                            className="absolute w-px h-64 bg-gradient-to-b from-transparent via-white/20 to-transparent"
                            style={{ left: `${Math.random() * 100}%` }}
                        />
                    ))}
                </div>

                <motion.div
                    animate={{ 
                        y: [-20, -1000],
                        scale: [1, 0.5],
                        opacity: [1, 1, 0]
                    }}
                    transition={{ duration: 4, ease: "easeIn" }}
                    className="flex flex-col items-center"
                >
                    <div className="w-12 h-24 bg-white rounded-t-full shadow-[0_0_50px_#fff]" />
                    <div className="w-16 h-40 bg-orange-500 blur-2xl -mt-10 rounded-full animate-pulse" />
                </motion.div>
            </motion.div>
        )}

        {phase === 'completed' && (
            <motion.div
                key="completed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center max-w-md px-6"
            >
                <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-8 animate-bounce" />
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">NOVA is Live</h2>
                <p className="text-zinc-500 font-medium">Your AI has reached the deep galaxy. Mission successful, Engineer.</p>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
