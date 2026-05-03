import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket3D } from '../components/Rocket/Rocket3D';
import { LaunchSequence } from '../components/Rocket/LaunchSequence';
import { PartTooltip } from '../components/Rocket/PartTooltip';
import { ROCKET_PARTS, type RocketPart } from '../components/Rocket/rocketData';
import { useRocket } from '../hooks/useRocket';
import { useAstra } from '../components/Astra/AstraContext';

export default function RocketPage() {
  const navigate = useNavigate();
  const { rocketState, loading, showLaunch, setShowLaunch, newlyUnlocked, progressPercent, getPartState } = useRocket();
  const { sendMessage, toggleOpen } = useAstra();

  const [hoveredPart,  setHoveredPart]  = useState<RocketPart | null>(null);
  const [selectedPart, setSelectedPart] = useState<RocketPart | null>(null);

  const handlePartClick = (part: RocketPart) => {
    setSelectedPart(part);
    const partState = getPartState(part.phase);
    if (partState?.isUnlocked) {
      toggleOpen();
      sendMessage(`Tell me about the ${part.name} — Phase ${part.phase}: ${part.topic}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showLaunch && (
          <LaunchSequence rocketState={rocketState} onComplete={() => { setShowLaunch(false); navigate('/universe'); }} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800/60">
          <div>
            <div className="text-xs text-teal-400 tracking-widest uppercase mb-1">◑ Mission Control</div>
            <h1 className="text-2xl font-black">Your Rocket</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl px-5 py-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Build Progress</div>
                <div className="w-32 bg-gray-800 rounded-full h-1.5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1 }} className="h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-teal-400" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{rocketState.unlockedParts}/12</div>
                <div className="text-xs text-gray-500">Parts</div>
              </div>
            </div>
            {rocketState.isLaunched && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowLaunch(true)} className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm" style={{ boxShadow: '0 0 24px rgba(249,115,22,0.4)' }}>
                ✦ Replay Launch
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left — Parts List */}
          <div className="w-72 border-r border-gray-800/60 overflow-y-auto p-4 flex-shrink-0">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">Rocket Components</div>
            <div className="space-y-2">
              {ROCKET_PARTS.map(part => {
                const partState  = getPartState(part.phase);
                const isUnlocked = partState?.isUnlocked ?? false;
                const isCurrent  = partState?.isCurrent  ?? false;
                return (
                  <motion.div
                    key={part.id}
                    whileHover={{ x: 4 }}
                    onClick={() => isUnlocked && handlePartClick(part)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isUnlocked ? 'bg-gray-900 border-gray-700 hover:border-gray-500'
                      : isCurrent ? 'bg-orange-500/5 border-orange-500/20'
                      : 'bg-gray-900/50 border-gray-800 opacity-50'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: isUnlocked ? part.color : isCurrent ? '#f97316' : '#374151', boxShadow: isUnlocked ? `0 0 6px ${part.glowColor}` : 'none' }} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{part.name}</div>
                      <div className="text-xs text-gray-600 truncate">Phase {part.phase} — {part.topic}</div>
                    </div>
                    <div className="text-xs flex-shrink-0">
                      {isUnlocked ? <span className="text-teal-400">●</span> : isCurrent ? <span className="text-orange-400">◑</span> : <span className="text-gray-700">○</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Center — 3D Rocket */}
          <div className="flex-1 relative">
            <Rocket3D
              rocketState={rocketState}
              newlyUnlocked={newlyUnlocked}
              onPartClick={handlePartClick}
              onPartHover={setHoveredPart}
              launching={showLaunch}
              interactive={true}
            />
            <PartTooltip
              part={hoveredPart}
              isUnlocked={hoveredPart ? (getPartState(hoveredPart.phase)?.isUnlocked ?? false) : false}
              isCurrent={hoveredPart ? (getPartState(hoveredPart.phase)?.isCurrent ?? false) : false}
              unlockedAt={hoveredPart ? getPartState(hoveredPart.phase)?.unlockedAt : undefined}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-700 pointer-events-none">
              Drag to rotate · Scroll to zoom · Click parts to inspect
            </div>
            <AnimatePresence>
              {newlyUnlocked && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-6 py-3 rounded-2xl border text-sm font-bold" style={{ background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(16px)', borderColor: `${ROCKET_PARTS.find(p => p.phase === newlyUnlocked)?.color}40`, color: ROCKET_PARTS.find(p => p.phase === newlyUnlocked)?.color }}>
                    ✦ {ROCKET_PARTS.find(p => p.phase === newlyUnlocked)?.name} Installed
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right — Info Panel */}
          <div className="w-72 border-l border-gray-800/60 p-4 flex-shrink-0 overflow-y-auto">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">Mission Status</div>

            {/* Phase grid */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
              <div className="text-xs text-gray-500 mb-3">Phase Progress</div>
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(phase => {
                  const ps   = getPartState(phase);
                  const part = ROCKET_PARTS.find(p => p.phase === phase);
                  return (
                    <div key={phase} className="aspect-square rounded flex items-center justify-center text-xs"
                      style={{
                        background: ps?.isUnlocked ? `${part?.color}25` : ps?.isCurrent ? 'rgba(249,115,22,0.1)' : 'rgba(55,65,81,0.3)',
                        border: `1px solid ${ps?.isUnlocked ? `${part?.color}50` : ps?.isCurrent ? 'rgba(249,115,22,0.3)' : 'rgba(55,65,81,0.5)'}`,
                        color: ps?.isUnlocked ? part?.color : ps?.isCurrent ? '#f97316' : '#374151',
                      }}
                    >
                      {ps?.isUnlocked ? '●' : ps?.isCurrent ? '◑' : '○'}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next component */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
              <div className="text-xs text-gray-500 mb-2">Next Component</div>
              {(() => {
                const nextPart = ROCKET_PARTS.find(p => p.phase === rocketState.currentPhase);
                if (!nextPart) return null;
                return (
                  <>
                    <div className="font-bold text-sm mb-1" style={{ color: nextPart.color }}>{nextPart.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{nextPart.description}</div>
                    <div className="text-xs text-orange-400">◑ Complete Phase {nextPart.phase} to unlock</div>
                  </>
                );
              })()}
            </div>

            {/* ASTRA tip */}
            <div className="rounded-2xl p-4 border" style={{ background: 'rgba(45,212,191,0.05)', borderColor: 'rgba(45,212,191,0.2)' }}>
              <div className="text-xs text-teal-400 font-medium mb-2">✦ ASTRA</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {rocketState.unlockedParts === 0
                  ? 'Complete Phase 1 to install your first rocket component, Commander.'
                  : rocketState.unlockedParts === 12
                  ? 'All systems operational. Your rocket is ready for deep space, Commander.'
                  : `${12 - rocketState.unlockedParts} components remaining. Keep pushing forward, Commander.`}
              </p>
              <button onClick={() => { toggleOpen(); sendMessage(`I am on Phase ${rocketState.currentPhase}. Tell me about my rocket progress.`); }} className="mt-3 text-xs text-teal-400 hover:text-teal-300 transition-colors">
                ◑ Ask ASTRA about your progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
