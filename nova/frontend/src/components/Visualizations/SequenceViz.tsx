import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SequenceViz() {
  const [activeStep, setActiveStep] = useState(0);
  const sequence = ["H", "e", "l", "l", "o"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % sequence.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h3 className="text-white font-black uppercase tracking-tighter text-xl">Recurrent Memory</h3>
          <p className="text-zinc-500 text-xs">Watch how NOVA remembers previous steps in a sequence</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
           <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Hidden State Active</span>
        </div>
      </div>

      <div className="relative flex justify-center items-center gap-4 py-8">
        {sequence.map((char, i) => (
          <div key={i} className="flex flex-col items-center gap-4">
             <motion.div
               animate={{ 
                 scale: activeStep === i ? 1.2 : 1,
                 backgroundColor: activeStep === i ? '#a855f7' : '#18181b',
                 borderColor: activeStep === i ? '#c084fc' : '#27272a'
               }}
               className="w-12 h-12 rounded-xl border flex items-center justify-center text-white font-mono font-bold text-xl"
             >
               {char}
             </motion.div>
             
             {/* Hidden State Connection */}
             <div className="relative h-12 w-12">
                <motion.div 
                  animate={{ 
                    opacity: activeStep === i ? 1 : 0.2,
                    y: activeStep === i ? [0, 5, 0] : 0
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                   <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                   </div>
                </motion.div>
                {i < sequence.length - 1 && (
                  <motion.div 
                    animate={{ 
                      backgroundColor: activeStep === i ? '#a855f7' : '#27272a',
                      opacity: activeStep === i ? 1 : 0.2
                    }}
                    className="absolute top-1/2 left-full w-4 h-0.5"
                  />
                )}
             </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-purple-950/20 border border-purple-900/30 rounded-xl text-center">
        <p className="text-purple-400 text-xs leading-relaxed">
            The <span className="font-bold">Hidden State</span> carries information from 
            <span className="text-white"> "{sequence[activeStep]}"</span> forward to help predict the next character.
        </p>
      </div>
    </div>
  );
}
