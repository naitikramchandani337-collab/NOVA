import { useParams, useNavigate } from 'react-router-dom';
import { PHASES } from '@/config/phases';
import { useProgressStore } from '@/store/progressStore';
import { useRocketStore } from '@/store/rocketStore';
import { ChevronLeft, ChevronRight, Cpu, Zap, Brain, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import CodeRunner from '@/components/CodeEditor/CodeRunner';
import NeuralNetworkScene from '@/components/space/NeuralNetworkScene';
import WarpTransition from '@/components/space/WarpTransition';
import Typewriter from '@/components/ui/Typewriter';

// Import visualizations
import GradientDescentViz from '@/components/Visualizations/GradientDescentViz';
import LossCurveViz from '@/components/Visualizations/LossCurveViz';
import NeuralNetworkViz from '@/components/Visualizations/NeuralNetworkViz';
import TensorViz from '@/components/Visualizations/TensorViz';
import CNNViz from '@/components/Visualizations/CNNViz';
import AttentionViz from '@/components/Visualizations/AttentionViz';
import SequenceViz from '@/components/Visualizations/SequenceViz';
import GenerativeViz from '@/components/Visualizations/GenerativeViz';
import DeploymentViz from '@/components/Visualizations/DeploymentViz';

type LessonSection = 'content' | 'practice' | 'quiz' | 'resources';

const VISUALIZATIONS: Record<string, React.ReactNode> = {
  gradient_descent: <GradientDescentViz />,
  loss_curve: <LossCurveViz />,
  neural_network: <NeuralNetworkViz />,
  tensor: <TensorViz />,
  cnn: <CNNViz />,
  attention: <AttentionViz />,
  sequence: <SequenceViz />,
  generative: <GenerativeViz />,
  deployment: <DeploymentViz />,
};

const AssembledText = ({ text }: { text: string }) => {
  return (
    <span className="flex flex-wrap gap-x-[0.1em]">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + (i * 0.03) }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export default function Phase() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<LessonSection>('content');
  const [isWarping, setIsWarping] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [phaseComplete, setPhaseComplete] = useState(false);

  const { scrollYProgress } = useScroll({
    container: containerRef
  });

  const completeLesson = useProgressStore(state => state.completeLesson);
  const completePhase = useProgressStore(state => state.completePhase);
  const unlockPart = useRocketStore(state => state.unlockPart);

  const phase = PHASES.find(p => p.id === Number(phaseId));

  useEffect(() => {
    setIsWarping(true);
    setShowContent(false);
  }, [phaseId]);

  const handleWarpComplete = () => {
    setIsWarping(false);
    setTimeout(() => setShowContent(true), 500);
  };

  if (!phase) return null;

  const currentLesson = phase.lessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === phase.lessons.length - 1;

  const handleNextLesson = async () => {
    if (currentLesson) completeLesson(currentLesson.id, currentLesson.xpReward);
    if (isLastLesson) {
       completePhase(phase.id, phase.rocketPart);
       unlockPart(phase.rocketPart);
       setPhaseComplete(true);
       setTimeout(() => navigate('/universe'), 3000);
    } else {
      setCurrentLessonIndex(prev => prev + 1);
      setCurrentSection('content');
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen bg-nova-firefly overflow-hidden font-inter">
      <AnimatePresence>
        {isWarping && (
          <motion.div 
            key="warp"
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000]"
          >
            <WarpTransition active={true} onComplete={handleWarpComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isWarping && (
        <>
          <div className="fixed inset-0 z-0">
            <NeuralNetworkScene scrollProgress={scrollYProgress.get()} />
          </div>
          
          <div 
            ref={containerRef}
            className="relative z-10 h-screen overflow-y-auto overflow-x-hidden scrollbar-hide"
          >
            <AnimatePresence>
              {showContent && (
                <div className="max-w-7xl mx-auto px-6 py-16 pb-32">
                  {/* Elegant Royal Header */}
                  <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-16 border-b border-white/5 pb-8"
                  >
                    <div>
                      <button onClick={() => navigate('/universe')} className="text-zinc-500 hover:text-nova-cornflower text-[10px] font-mono mb-4 flex items-center gap-2 tracking-[0.3em] uppercase transition-colors">
                        <ChevronLeft className="w-3 h-3" /> [ back to map ]
                      </button>
                      <h1 className="text-5xl font-bold tracking-tight text-white flex items-center gap-4">
                        <AssembledText text={phase.title} />
                        <span className="text-nova-horizon/40 text-sm font-mono tracking-widest px-4 py-1 border border-nova-horizon/20 rounded-full">PHASE {phase.id}</span>
                      </h1>
                    </div>
                    <div className="hidden md:flex gap-6 items-center">
                      <div className="text-right font-mono">
                        <div className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] mb-1">Knowledge Sync</div>
                        <div className="text-2xl font-bold text-nova-cornflower">
                          {Math.round(((currentLessonIndex + 1) / phase.lessons.length) * 100)}%
                        </div>
                      </div>
                      <div className="w-px h-12 bg-white/10" />
                      <Brain className="w-8 h-8 text-nova-poloBlue opacity-50" />
                    </div>
                  </motion.header>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Main Content Panel - Royal Blue / Slate Theme */}
                    <motion.main 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="lg:col-span-8 bg-nova-bigStone/80 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative"
                    >
                      {/* Tabs */}
                      <div className="flex border-b border-white/5 bg-white/2">
                        {(['content', 'practice', 'quiz'] as const).map(tab => (
                          <button
                            key={tab}
                            onClick={() => setCurrentSection(tab)}
                            className={`flex-1 py-6 text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
                              currentSection === tab ? 'text-nova-cornflower border-b-2 border-nova-cornflower bg-nova-cornflower/5' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <div className="p-16">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${currentLessonIndex}-${currentSection}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                          >
                            {currentSection === 'content' && (
                              <div className="space-y-12">
                                <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
                                  {currentLesson.title}
                                </h2>
                                
                                <div className="prose prose-invert max-w-none space-y-6">
                                  {currentLesson.content.split('\n\n').map((paragraph, i) => (
                                    <p key={i} className="text-zinc-400 text-lg leading-relaxed font-medium">
                                      {paragraph}
                                    </p>
                                  ))}
                                </div>

                                {currentLesson.codeExample && (
                                  <div className="relative mt-12 bg-[#050508] rounded-2xl p-10 border border-white/5 shadow-xl">
                                    <div className="flex items-center justify-between mb-6 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                                      <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                        <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                        <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                      </div>
                                      <span>Kernel_Executor_01</span>
                                    </div>
                                    <Typewriter text={currentLesson.codeExample} speed={20} />
                                  </div>
                                )}

                                {phase.visualization && (
                                  <div className="mt-16 p-12 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden">
                                    <h4 className="text-[10px] font-bold text-nova-poloBlue uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-nova-cornflower animate-pulse" />
                                      Neural Visualization System
                                    </h4>
                                    <div className="flex justify-center relative z-10">
                                      {VISUALIZATIONS[phase.visualization]}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {currentSection === 'practice' && (
                               <div className="space-y-8">
                                  {currentLesson.practiceExercises?.map((ex, i) => (
                                    <CodeRunner key={ex.id} {...ex} exerciseIndex={i} />
                                  ))}
                               </div>
                            )}

                            {currentSection === 'quiz' && (
                               <div className="space-y-12 py-12 text-center">
                                  <Brain className="w-16 h-16 text-nova-poloBlue mx-auto opacity-30" />
                                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Synaptic Challenge</h3>
                                  <p className="text-zinc-500 max-w-xs mx-auto text-sm font-medium">
                                    Verify your understanding of the neural pathways before proceeding.
                                  </p>
                                  <button className="px-10 py-4 bg-nova-eastBay hover:bg-nova-horizon rounded-xl text-white font-bold uppercase tracking-widest text-[10px] transition-all">
                                    Start Protocol
                                  </button>
                               </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Footer Navigation */}
                      <div className="px-16 py-10 bg-white/2 border-t border-white/5 flex justify-between items-center">
                        <button 
                          disabled={currentLessonIndex === 0}
                          onClick={() => setCurrentLessonIndex(prev => prev - 1)}
                          className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 hover:text-white disabled:opacity-20 uppercase tracking-[0.2em] transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <button 
                          onClick={handleNextLesson}
                          className="group relative px-12 py-5 bg-nova-cornflower hover:bg-nova-poloBlue text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl transition-all shadow-xl active:scale-95 flex items-center gap-4"
                        >
                          <span>{isLastLesson ? 'Finalize Phase' : 'Next Lesson'}</span> 
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.main>

                    {/* Sidebar */}
                    <motion.aside 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="lg:col-span-4 space-y-8"
                    >
                      <div className="bg-nova-bigStone/60 backdrop-blur-xl border border-white/5 p-12 rounded-3xl shadow-xl">
                         <h3 className="text-[9px] font-bold text-nova-cornflower uppercase tracking-[0.4em] mb-8 border-b border-white/5 pb-6">Phase Insights</h3>
                         <ul className="space-y-6">
                           {currentLesson.keyTakeaways?.map((t, i) => (
                             <motion.li 
                              key={i} 
                              className="flex gap-4 text-sm text-zinc-500 leading-relaxed group"
                             >
                               <div className="mt-1.5 w-1 h-1 rounded-full bg-nova-horizon flex-shrink-0" />
                               {t}
                             </motion.li>
                           ))}
                         </ul>
                      </div>

                      <div className="bg-nova-cornflower/10 border border-nova-cornflower/20 p-10 rounded-3xl text-center">
                        <Zap className="w-8 h-8 text-nova-cornflower mx-auto mb-4" />
                        <div className="text-[10px] font-bold text-nova-cornflower uppercase tracking-[0.3em] mb-1">Synaptic Gain</div>
                        <div className="text-4xl font-bold text-white tracking-tighter">+{currentLesson.xpReward} XP</div>
                      </div>
                    </motion.aside>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* SUCCESS OVERLAY - STANDARD ROYAL VERSION */}
      <AnimatePresence>
        {phaseComplete && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-nova-bigStone border border-nova-horizon/30 p-16 rounded-3xl text-center shadow-[0_0_100px_rgba(90,135,161,0.1)] max-w-md w-full"
             >
                <div className="w-20 h-20 bg-nova-horizon/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-nova-horizon/20">
                  <CheckCircle2 className="w-10 h-10 text-nova-horizon" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Phase Synchronized</h2>
                <p className="text-zinc-500 text-sm font-medium mb-10 leading-relaxed uppercase tracking-widest">
                  Neural pathways established. Proceeding to higher command.
                </p>
                <div className="w-full h-px bg-white/5 mb-8" />
                <div className="text-nova-cornflower font-mono text-xs animate-pulse tracking-[0.5em]">REDIRECTING...</div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
