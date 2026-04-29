import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function TensorViz() {
  const [dim, setDim] = useState(2); // 1D or 2D

  const vector = [1.2, 3.4, 0.8, 2.1];
  const matrix = [
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 1, 0, 0],
    [0, 0, 1, 1]
  ];

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-white font-black uppercase tracking-tighter text-xl">Tensor Space</h3>
          <p className="text-zinc-500 text-xs">Data as stars floating in the PyTorch void</p>
        </div>
        <button 
          onClick={() => setDim(dim === 1 ? 2 : 1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white font-bold hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> {dim}D VIEW
        </button>
      </div>

      <div className="relative h-64 w-full border border-white/5 rounded-xl flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        {/* Particle Stars */}
        <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div 
                    key={i}
                    animate={{ 
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                />
            ))}
        </div>

        <div className="relative flex flex-col gap-4">
          {dim === 1 ? (
             <div className="flex gap-4">
                {vector.map((val, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-[10px] text-blue-400 font-mono font-bold shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                  >
                    {val}
                  </motion.div>
                ))}
             </div>
          ) : (
             <div className="grid grid-cols-4 gap-2">
                {matrix.map((row, i) => row.map((val, j) => (
                  <motion.div
                    key={`${i}-${j}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (i * 4 + j) * 0.05 }}
                    className={`w-10 h-10 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-mono font-bold ${val === 1 ? 'text-indigo-300 bg-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'text-zinc-600'}`}
                  >
                    {val}
                  </motion.div>
                )))}
             </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Rank</div>
          <div className="text-white font-mono text-sm">{dim === 1 ? 'Scalar Vector' : '2D Matrix'}</div>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Shape</div>
          <div className="text-white font-mono text-sm">{dim === 1 ? '[4]' : '[4, 4]'}</div>
        </div>
      </div>
    </div>
  );
}
