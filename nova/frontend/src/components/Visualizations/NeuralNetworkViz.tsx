import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function NeuralNetworkViz() {
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % 4);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const layers = [
    { id: 'input', nodes: 3, label: 'Input' },
    { id: 'hidden', nodes: 4, label: 'Hidden' },
    { id: 'output', nodes: 2, label: 'Output' }
  ];

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h3 className="text-white font-black uppercase tracking-tighter text-xl">Neural Brain Firing</h3>
          <p className="text-zinc-500 text-xs">Watch signals flow through NOVA's brain core</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Active</span>
        </div>
      </div>

      <div className="relative h-64 w-full flex justify-between items-center px-12">
        {/* Connection Lines (Background) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {/* Simple connections from input to hidden, hidden to output */}
          {Array.from({ length: 3 }).map((_, i) => 
            Array.from({ length: 4 }).map((_, j) => (
              <line 
                key={`line-ih-${i}-${j}`}
                x1={`${10 + (80/layers.length) * 0.5}%`} 
                y1={`${20 + (60/3) * i}%`}
                x2={`${10 + (80/layers.length) * 1.5}%`}
                y2={`${10 + (80/4) * j}%`}
                stroke="white"
                strokeWidth="1"
              />
            ))
          )}
          {Array.from({ length: 4 }).map((_, i) => 
            Array.from({ length: 2 }).map((_, j) => (
              <line 
                key={`line-ho-${i}-${j}`}
                x1={`${10 + (80/layers.length) * 1.5}%`} 
                y1={`${10 + (80/4) * i}%`}
                x2={`${10 + (80/layers.length) * 2.5}%`}
                y2={`${30 + (40/2) * j}%`}
                stroke="white"
                strokeWidth="1"
              />
            ))
          )}
        </svg>

        {layers.map((layer, lIdx) => (
          <div key={layer.id} className="flex flex-col items-center gap-8 z-10">
            <div className="flex flex-col gap-6">
              {Array.from({ length: layer.nodes }).map((_, nIdx) => (
                <motion.div
                  key={`${layer.id}-${nIdx}`}
                  animate={{ 
                    scale: pulseIndex === lIdx ? [1, 1.2, 1] : 1,
                    backgroundColor: pulseIndex === lIdx ? '#3b82f6' : '#27272a',
                    boxShadow: pulseIndex === lIdx ? '0 0 20px #3b82f6' : 'none'
                  }}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                </motion.div>
              ))}
            </div>
            <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{layer.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Activations</div>
          <div className="text-white font-mono text-xs">ReLU / Softmax</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Parameters</div>
          <div className="text-white font-mono text-xs">128,492</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Type</div>
          <div className="text-white font-mono text-xs">Dense Core</div>
        </div>
      </div>
    </div>
  );
}
