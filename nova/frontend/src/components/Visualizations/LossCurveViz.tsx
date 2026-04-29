import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LossCurveViz() {
  const [points, setPoints] = useState<{ x: number, y: number }[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [noise, setNoise] = useState(0.2);

  const startTraining = () => {
    setIsTraining(true);
    setPoints([{ x: 0, y: 100 }]);
  };

  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setPoints(prev => {
        if (prev.length > 50) {
          setIsTraining(false);
          return prev;
        }
        const last = prev[prev.length - 1];
        const nextX = last.x + 2;
        // Exponential decay + noise
        const nextY = 100 * Math.exp(-nextX / 20) + (Math.random() - 0.5) * noise * 50;
        return [...prev, { x: nextX, y: Math.max(5, nextY) }];
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isTraining, noise]);

  const pathD = points.length > 0 
    ? `M ${points[0].x * 5} ${100 - points[0].y} ` + points.slice(1).map(p => `L ${p.x * 5} ${100 - p.y}`).join(' ')
    : '';

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-white font-black uppercase tracking-tighter text-xl">Loss Curve Monitor</h3>
          <p className="text-zinc-500 text-xs">Watch your AI's error rate drop as it learns</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-500 uppercase font-black">Status</div>
          <div className={`font-mono font-bold ${isTraining ? 'text-green-400 animate-pulse' : 'text-blue-400'}`}>
            {isTraining ? 'LEARNING...' : 'READY'}
          </div>
        </div>
      </div>

      <div className="relative h-48 w-full border-l-2 border-b-2 border-white/10 mb-8 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 250 100" preserveAspectRatio="none">
          {/* Grid Lines */}
          <line x1="0" y1="25" x2="250" y2="25" stroke="rgba(255,255,255,0.05)" />
          <line x1="0" y1="50" x2="250" y2="50" stroke="rgba(255,255,255,0.05)" />
          <line x1="0" y1="75" x2="250" y2="75" stroke="rgba(255,255,255,0.05)" />
          
          <motion.path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        </svg>

        {/* Labels */}
        <div className="absolute left-2 top-0 text-[8px] text-zinc-700 font-black uppercase">Loss (Error)</div>
        <div className="absolute right-2 bottom-2 text-[8px] text-zinc-700 font-black uppercase">Epochs (Time)</div>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase">
            <span>Clean Data</span>
            <span>Data Noise</span>
            <span>Noisy</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            value={noise}
            onChange={(e) => setNoise(parseFloat(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
        <button 
          onClick={startTraining}
          disabled={isTraining}
          className="px-8 py-3 bg-green-600 text-white font-black uppercase tracking-widest rounded-lg hover:bg-green-500 transition-colors active:scale-95 disabled:opacity-50"
        >
          {isTraining ? 'Training...' : 'Train NOVA'}
        </button>
      </div>
    </div>
  );
}
