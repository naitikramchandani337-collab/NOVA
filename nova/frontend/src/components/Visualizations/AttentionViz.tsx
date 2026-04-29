import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AttentionViz() {
  const [selectedWord, setSelectedWord] = useState(1); // 'cat'
  
  const words = ["The", "cat", "sat", "on", "the", "mat"];
  
  // Simulated attention weights for each word
  const weights = [
    [0.1, 0.1, 0.0, 0.0, 0.7, 0.1], // 'The' attends to 'the'
    [0.1, 0.6, 0.3, 0.0, 0.0, 0.0], // 'cat' attends to itself and 'sat'
    [0.0, 0.3, 0.5, 0.2, 0.0, 0.0], // 'sat' attends to 'cat' and 'on'
    [0.0, 0.0, 0.2, 0.6, 0.0, 0.2], // 'on' attends to 'mat'
    [0.7, 0.0, 0.0, 0.0, 0.2, 0.1], // 'the' attends to 'The'
    [0.0, 0.0, 0.0, 0.3, 0.1, 0.6], // 'mat' attends to 'on'
  ];

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h3 className="text-white font-black uppercase tracking-tighter text-xl">Attention Heatmap</h3>
          <p className="text-zinc-500 text-xs">See which words NOVA focuses on to understand context</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-500 uppercase font-black">Architecture</div>
          <div className="text-teal-400 font-mono font-bold italic">Transformer V1</div>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {/* Sentence View */}
        <div className="flex flex-wrap gap-4 justify-center">
            {words.map((word, i) => (
                <button
                    key={i}
                    onClick={() => setSelectedWord(i)}
                    className={`relative px-6 py-3 rounded-xl font-mono text-lg transition-all duration-500 ${
                        selectedWord === i 
                        ? 'bg-teal-500 text-black font-black scale-110 shadow-[0_0_30px_rgba(20,184,166,0.4)]' 
                        : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                    }`}
                >
                    {word}
                </button>
            ))}
        </div>

        {/* Attention Flow */}
        <div className="relative flex justify-center items-center gap-2 h-32">
            <div className="absolute top-0 text-[8px] text-zinc-700 font-black uppercase tracking-widest mb-4">Attention Weights for "{words[selectedWord]}"</div>
            <div className="flex items-end gap-1 h-full pt-8">
                {weights[selectedWord].map((w, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${w * 100}%` }}
                            className="w-12 bg-gradient-to-t from-teal-900 to-teal-400 rounded-t-sm"
                        />
                        <span className={`text-[10px] font-mono ${w > 0.4 ? 'text-teal-400 font-bold' : 'text-zinc-700'}`}>
                            {words[i]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="mt-12 p-4 bg-teal-950/20 border border-teal-900/30 rounded-xl">
        <p className="text-teal-400 text-xs leading-relaxed">
            <span className="font-black uppercase mr-2">Context Note:</span>
            When processing <span className="font-black underline">"{words[selectedWord]}"</span>, NOVA assigns higher weights to related concepts, allowing it to "remember" previous parts of the sentence without recurrence.
        </p>
      </div>
    </div>
  );
}
