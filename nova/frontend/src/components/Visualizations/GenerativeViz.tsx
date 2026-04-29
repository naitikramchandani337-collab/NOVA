import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

export default function GenerativeViz() {
  const [iteration, setIteration] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const startGeneration = () => {
    setIsGenerating(true);
    setIteration(0);
  };

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setIteration(prev => {
        if (prev >= 10) {
          setIsGenerating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Simulated "morphed" pixels
  const getPixelColor = (i: number) => {
    if (iteration === 0) return 'bg-zinc-900';
    if (iteration === 10) return i % 3 === 0 ? 'bg-indigo-500' : 'bg-purple-500';
    const progress = iteration / 10;
    return Math.random() > progress ? 'bg-zinc-800' : 'bg-indigo-900';
  };

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h3 className="text-white font-black uppercase tracking-tighter text-xl">Generative Diffusion</h3>
          <p className="text-zinc-500 text-xs">Transforming pure noise into complex patterns</p>
        </div>
        <div className="flex items-center gap-2">
           <Zap className={`w-4 h-4 ${isGenerating ? 'text-yellow-400 animate-pulse' : 'text-zinc-700'}`} />
           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Iteration {iteration}/10</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="grid grid-cols-8 gap-1 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
            {Array.from({ length: 64 }).map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: isGenerating ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.01 }}
                    className={`w-6 h-6 rounded-sm transition-colors duration-500 ${getPixelColor(i)}`}
                />
            ))}
        </div>

        <button 
          onClick={startGeneration}
          disabled={isGenerating}
          className="group flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" />
          {isGenerating ? 'Synthesizing...' : 'Generate New Pattern'}
        </button>
      </div>

      <div className="mt-8 p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-xl">
        <p className="text-indigo-400 text-xs leading-relaxed text-center">
            NOVA is reversing the diffusion process, removing noise to reveal the underlying structure it was trained to recognize.
        </p>
      </div>
    </div>
  );
}
