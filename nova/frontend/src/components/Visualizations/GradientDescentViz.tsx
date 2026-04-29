import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function GradientDescentViz() {
  const [ballPos, setBallPos] = useState({ x: 10, y: 10 });
  const [learningRate, setLearningRate] = useState(0.01);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple quadratic function for the "mountain"
  // f(x) = 0.05 * (x - 50)^2 + 20
  const getY = (x: number) => 0.05 * Math.pow(x - 50, 2) + 20;

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const relativeX = ((x - rect.left) / rect.width) * 100;
    const clampedX = Math.max(0, Math.min(100, relativeX));
    setBallPos({ x: clampedX, y: getY(clampedX) });
  };

  const step = () => {
    setBallPos(prev => {
      // Gradient of f(x) = 0.05 * (x-50)^2 + 20 is f'(x) = 0.1 * (x-50)
      const gradient = 0.1 * (prev.x - 50);
      const newX = prev.x - gradient * learningRate * 50; // scaled for viz
      return { x: newX, y: getY(newX) };
    });
  };

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-white font-black uppercase tracking-tighter text-xl">Gradient Descent Mountain</h3>
          <p className="text-zinc-500 text-xs">Watch your AI find the bottom of the error curve</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-500 uppercase font-black">Learning Rate</div>
          <div className="text-blue-400 font-mono font-bold">{learningRate.toFixed(3)}</div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative h-64 w-full border-b-2 border-white/20 mb-8 overflow-hidden cursor-crosshair"
        onMouseDown={handleDrag}
        onMouseMove={(e) => e.buttons === 1 && handleDrag(e)}
      >
        {/* The Curve (SVG) */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path
            d={`M 0 ${getY(0)} ${Array.from({ length: 101 }, (_, i) => `L ${i} ${getY(i)}`).join(' ')}`}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className="transform scale-[1,-1] translate-y-[200px]"
          />
        </svg>

        {/* The Ball */}
        <motion.div
          animate={{ left: `${ballPos.x}%`, bottom: `${ballPos.y}px` }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute w-6 h-6 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] border-2 border-white -ml-3"
        />

        {/* Floor Label */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-zinc-700 font-black uppercase tracking-widest">
          Global Minimum
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase">
            <span>Aggressive</span>
            <span>Learning Rate</span>
            <span>Cautious</span>
          </div>
          <input 
            type="range" 
            min="0.001" 
            max="0.1" 
            step="0.001"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button 
            onClick={step}
            className="flex-1 py-3 bg-white text-black font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-colors active:scale-95"
          >
            Take Step
          </button>
          <button 
            onClick={() => setBallPos({ x: Math.random() * 100, y: 0 })}
            className="px-6 py-3 border border-white/10 text-white font-black uppercase tracking-widest rounded-lg hover:bg-white/5 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
