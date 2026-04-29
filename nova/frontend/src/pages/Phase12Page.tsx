import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Rocket, Trophy, Loader2 } from 'lucide-react';
import TrackSelector from '@/components/capstone/TrackSelector';
import CapstoneChecklist from '@/components/capstone/CapstoneChecklist';
import SubPhaseContent from '@/components/capstone/SubPhaseContent';
import api from '@/services/api';

interface CapstoneStatus {
  track: string | null;
  current_step: number;
  completed_steps: number[];
  is_complete: boolean;
  progress_pct: number;
  track_info: { name: string; description: string; stack: string[] } | null;
}

const SUB_PHASE_META: Record<number, { title: string; description: string }> = {
  1: { title: 'Select Your Track',     description: 'Choose which capstone project you will build.' },
  2: { title: 'Architecture Plan',     description: 'Design your system architecture. ASTRA will review it.' },
  3: { title: 'Data Pipeline',         description: 'Collect, clean, and preprocess your dataset.' },
  4: { title: 'Build the Model',       description: 'Implement your model architecture in code.' },
  5: { title: 'Train and Evaluate',    description: 'Train your model and hit the accuracy threshold.' },
  6: { title: 'Build the API Backend', description: 'Create a FastAPI backend to serve your model.' },
  7: { title: 'Build the Frontend',    description: 'Build a React interface connected to your backend.' },
  8: { title: 'Deploy and Submit',     description: 'Deploy to a live URL and submit your final project.' },
};

export default function Phase12Page() {
  const navigate = useNavigate();
  const [status,      setStatus]      = useState<CapstoneStatus | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [activeStep,  setActiveStep]  = useState(1);
  const [showLaunch,  setShowLaunch]  = useState(false);
  const [astraMsg,    setAstraMsg]    = useState('');

  const loadStatus = async () => {
    try {
      const r = await api.get('/api/phases/12/status');
      setStatus(r.data);
      setActiveStep(r.data.current_step || 1);
    } catch {
      // Not logged in or backend offline — show default
      setStatus({
        track: null, current_step: 1, completed_steps: [],
        is_complete: false, progress_pct: 0, track_info: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStatus(); }, []);

  const handleSelectTrack = async (track: 'A' | 'B' | 'C') => {
    try {
      await api.post('/api/phases/12/select-track', { track });
      await loadStatus();
      setActiveStep(2);
    } catch { /* offline — update locally */ }
  };

  const handleCompleteStep = async (submission: string) => {
    try {
      const r = await api.post('/api/phases/12/complete-step', {
        step: activeStep,
        submission,
      });
      if (r.data.astra_message) {
        setAstraMsg(r.data.astra_message);
        setTimeout(() => setShowLaunch(true), 3000);
      }
      await loadStatus();
    } catch { /* offline */ }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  const isComplete = status?.is_complete ?? false;

  return (
    <>
      {/* Launch overlay */}
      <AnimatePresence>
        {showLaunch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center text-center px-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl"
            >
              <div className="text-6xl mb-6 text-teal-400">✦</div>
              <pre className="text-white font-mono text-sm leading-relaxed whitespace-pre-wrap mb-8 text-left bg-white/5 border border-white/10 rounded-2xl p-6">
                {astraMsg}
              </pre>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowLaunch(false); navigate('/rocket'); }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-lg"
              >
                ● View Your Rocket Launch
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#050510] text-white">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#050510]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-600 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-black text-sm">Phase 12 — Capstone</div>
              <div className="text-gray-500 text-xs">
                {status?.track ? `Track ${status.track}: ${status.track_info?.name}` : 'Final Mission'}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:block text-xs text-gray-500">{status?.progress_pct ?? 0}% complete</div>
            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full"
                animate={{ width: `${status?.progress_pct ?? 0}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* Complete banner */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-teal-500/20 to-indigo-500/20 border border-teal-500/30 flex items-center gap-4"
          >
            <Trophy className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <div>
              <div className="text-white font-black">Phase 12 Complete — You are an AI Engineer</div>
              <div className="text-teal-300/70 text-xs">Nose cone unlocked. Rocket ready for launch.</div>
            </div>
            <button
              onClick={() => navigate('/rocket')}
              className="ml-auto px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm font-bold hover:bg-teal-500/30 transition-all"
            >
              View Rocket
            </button>
          </motion.div>
        )}

        {/* Intro — before track selected */}
        {!status?.track && (
          <div className="max-w-4xl mx-auto px-6 pt-8 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 p-8 rounded-3xl bg-white/[0.02] border border-white/5"
            >
              <div className="text-teal-400 text-xs tracking-widest uppercase mb-3">✦ Final Mission</div>
              <h1 className="text-3xl font-black text-white mb-4 leading-tight">
                You have learned every piece of the puzzle, Commander.
              </h1>
              <p className="text-gray-400 text-base leading-relaxed max-w-2xl mx-auto mb-4">
                Phase 12 is your final mission. You will build a complete AI system — end to end.
                From raw data to a deployed, working product.
              </p>
              <p className="text-gray-500 text-sm">
                No hand-holding. No training wheels. ASTRA is your co-pilot, not your pilot.
                <br />This is what you trained for.
              </p>
            </motion.div>
          </div>
        )}

        {/* Main layout */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Track selector — step 1 */}
          {activeStep === 1 && !status?.track ? (
            <TrackSelector
              selectedTrack={status?.track ?? null}
              onSelect={handleSelectTrack}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              {/* Left — Checklist */}
              <div className="space-y-4">
                <CapstoneChecklist
                  completedSteps={status?.completed_steps ?? []}
                  currentStep={status?.current_step ?? 1}
                  onStepClick={step => {
                    // Allow navigating to completed steps or current step
                    if ((status?.completed_steps ?? []).includes(step) || step === status?.current_step) {
                      setActiveStep(step);
                    }
                  }}
                />

                {/* Track info */}
                {status?.track_info && (
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">◑ Your Track</div>
                    <div className="text-white font-bold text-sm mb-1">
                      Track {status.track}: {status.track_info.name}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {status.track_info.stack.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right — Current step content */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SubPhaseContent
                      step={activeStep}
                      title={SUB_PHASE_META[activeStep]?.title ?? ''}
                      description={SUB_PHASE_META[activeStep]?.description ?? ''}
                      track={status?.track ?? null}
                      isCompleted={(status?.completed_steps ?? []).includes(activeStep)}
                      onComplete={handleCompleteStep}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Step navigation */}
                <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
                  <button
                    onClick={() => setActiveStep(s => Math.max(1, s - 1))}
                    disabled={activeStep <= 1}
                    className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-600 self-center">
                    Step {activeStep} of 8
                  </span>
                  <button
                    onClick={() => setActiveStep(s => Math.min(8, s + 1))}
                    disabled={activeStep >= 8}
                    className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
