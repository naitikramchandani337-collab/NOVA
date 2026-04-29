import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye } from 'lucide-react';

export default function CNNViz() {
  const [scanPos, setScanPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos(prev => (prev + 1) % 16);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const grid = Array.from({ length: 16 }).map((_, i) => Math.random() > 0.7 ? 1 : 0);

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-white font-black uppercase tracking-tighter text-xl">Convolutional Vision</h3>
          <p className="text-zinc-500 text-xs">How filters scan images to detect patterns</p>
        </div>
        <div className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-[10px] text-orange-400 font-bold uppercase tracking-widest">
          Scanning...
        </div>
      </div>

      <div className="flex items-center justify-between gap-8 mb-8">
        {/* Source Image */}
        <div className="flex flex-col items-center gap-4">
           <div className="relative grid grid-cols-4 gap-1 p-2 bg-white/5 rounded-lg border border-white/10">
              {grid.map((val, i) => (
                <div key={i} className={`w-8 h-8 rounded-sm ${val === 1 ? 'bg-white' : 'bg-zinc-900'}`} />
              ))}
              {/* Scanning Box */}
              <motion.div 
                animate={{ 
                  left: `${(scanPos % 4) * 2.25 + 0.5}rem`,
                  top: `${Math.floor(scanPos / 4) * 2.25 + 0.5}rem`
                }}
                className="absolute w-8 h-8 border-2 border-orange-500 shadow-[0_0_15px_#f97316] z-10"
              />
           </div>
           <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Input Pixels</span>
        </div>

        <div className="flex flex-col items-center">
            <motion.div 
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-zinc-700"
            >
              →
            </motion.div>
            <span className="text-[8px] text-zinc-500 font-bold uppercase mt-1 italic">3x3 Filter</span>
        </div>

        {/* Feature Map */}
        <div className="flex flex-col items-center gap-4">
           <div className="grid grid-cols-4 gap-1 p-2 bg-white/5 rounded-lg border border-white/10">
              {grid.map((val, i) => (
                <motion.div 
                  key={i} 
                  animate={{ 
                    opacity: i <= scanPos ? 1 : 0.1,
                    backgroundColor: val === 1 && i <= scanPos ? '#f97316' : '#111'
                  }}
                  className="w-8 h-8 rounded-sm" 
                />
              ))}
           </div>
           <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Feature Map</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <Search className="w-5 h-5 text-zinc-500" />
            <div>
                <p className="text-white text-xs font-bold uppercase">Pattern Recognition</p>
                <p className="text-[10px] text-zinc-500">The filter is currently searching for vertical edges and high-contrast boundaries.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
