import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PHASES } from '@/config/phases';
import { useProgressStore } from '@/store/progressStore';
import { useRocketStore } from '@/store/rocketStore';
import { Rocket as RocketIcon, Lock, CheckCircle2, ChevronUp, FileCode } from 'lucide-react';
import CodebaseViewer from '@/components/Codebase/CodebaseViewer';

export default function Universe() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCodeOpen, setIsCodeOpen] = React.useState(false);
  
  const completedPhases = useProgressStore(state => state.completedPhases);
  const currentPhase = useProgressStore(state => state.currentPhase);
  const canAccessPhase = useProgressStore(state => state.canAccessPhase);
  const completionPercentage = useRocketStore(state => state.getCompletionPercentage());

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative h-screen bg-nova-firefly overflow-hidden">
      {/* Scrollable Map Content */}
      <div 
        ref={containerRef}
        className="relative z-10 h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        <div className="flex flex-col">
          {PHASES.map((phase, index) => {
            const isCompleted = completedPhases.includes(phase.id);
            const isCurrent = currentPhase === phase.id;
            const isLocked = !canAccessPhase(phase.id);

            return (
              <section
                key={phase.id}
                className="relative h-screen w-full flex items-center justify-center snap-start"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className={`relative z-20 flex flex-col items-center max-w-lg text-center px-6 py-12 rounded-3xl backdrop-blur-xl border border-white/10 ${
                    isLocked ? 'bg-black/40 grayscale' : 'bg-black/20'
                  }`}
                >
                   {/* Level Indicator */}
                   <div className="absolute -top-6 px-4 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-xl text-[10px] font-black tracking-widest text-white/60 uppercase">
                     Phase {phase.id} — {phase.environment.replace('_', ' ')}
                   </div>

                   {/* Visual Node */}
                   <div 
                    className={`relative w-24 h-24 mb-6 rounded-full flex items-center justify-center transition-all duration-700 ${
                      isCurrent ? 'ring-4 ring-white ring-offset-4 ring-offset-black/50 shadow-[0_0_50px_rgba(255,255,255,0.3)]' : ''
                    }`}
                    style={{ 
                      background: isLocked ? '#111' : `radial-gradient(circle at center, ${phase.color} 0%, transparent 70%)`,
                    }}
                   >
                     <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${
                        isLocked ? 'text-zinc-700' : 'text-white'
                      }`}
                      style={{ 
                        background: isLocked ? '#222' : phase.color,
                        boxShadow: isCurrent ? `0 0 30px ${phase.color}` : 'none'
                      }}
                     >
                       {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : isLocked ? <Lock className="w-8 h-8" /> : phase.id}
                     </div>
                   </div>

                   <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">{phase.title}</h2>
                   <p className="text-zinc-400 text-sm mb-8 leading-relaxed">{phase.description}</p>

                   {!isLocked ? (
                     <button
                      onClick={() => navigate(`/phase/${phase.id}`)}
                      className="group relative px-10 py-4 overflow-hidden rounded-xl font-black tracking-widest text-white transition-all active:scale-95"
                      style={{ backgroundColor: phase.color }}
                     >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative">{isCurrent ? 'CONTINUE MISSION' : 'REVISIT PHASE'}</span>
                     </button>
                   ) : (
                     <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                       <Lock className="w-4 h-4" /> Locked by Command
                     </div>
                   )}
                </motion.div>

                {/* Connecting Line */}
                {index < PHASES.length - 1 && (
                  <div className="absolute top-[80%] left-1/2 w-px h-[40vh] -translate-x-1/2 bg-gradient-to-b from-white/20 to-transparent" />
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* Sticky Rocket Progress Overlay */}
      <div className="fixed right-12 bottom-12 z-50 flex flex-col items-end gap-4">
          <button 
            onClick={() => setIsCodeOpen(true)}
            className="flex items-center gap-3 px-6 py-4 bg-nova-cornflower hover:bg-nova-poloBlue text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-nova-cornflower/20 active:scale-95"
          >
            <FileCode className="w-5 h-5" />
            View NOVA Code
          </button>

          <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-right">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">AI Rocket Status</h4>
              <div className="text-2xl font-black text-white mb-2">{Math.round(completionPercentage)}% Built</div>
              <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    className="h-full bg-nova-cornflower"
                  />
              </div>
          </div>
          
          <button 
            onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-xl text-white transition-colors"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
      </div>

      <CodebaseViewer isOpen={isCodeOpen} onClose={() => setIsCodeOpen(false)} />
    </div>
  );
}
