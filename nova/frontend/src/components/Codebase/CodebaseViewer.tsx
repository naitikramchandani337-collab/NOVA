import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NOVA_CODEBASE } from '@/config/nova-codebase';
import { FileCode, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useProgressStore } from '@/store/progressStore';

interface CodebaseViewerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CodebaseViewer({ isOpen, onClose }: CodebaseViewerProps) {
    const completedPhases = useProgressStore(state => state.completedPhases);
    const [selectedPhase, setSelectedPhase] = React.useState(1);

    const unlockedPhases = Object.keys(NOVA_CODEBASE)
        .map(Number)
        .filter(id => id === 1 || completedPhases.includes(id - 1) || completedPhases.includes(id));

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl h-[80vh] bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
                    >
                        {/* Sidebar: Modules */}
                        <div className="w-full md:w-72 bg-white/5 border-r border-white/10 p-6 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-8">
                                <FileCode className="w-5 h-5 text-blue-500" />
                                <h2 className="text-white font-black uppercase tracking-widest text-sm">NOVA Library</h2>
                            </div>

                            <div className="space-y-2">
                                {Object.entries(NOVA_CODEBASE).map(([id, module]) => {
                                    const phaseId = Number(id);
                                    const isUnlocked = unlockedPhases.includes(phaseId);
                                    const isCompleted = completedPhases.includes(phaseId);

                                    return (
                                        <button
                                            key={id}
                                            disabled={!isUnlocked}
                                            onClick={() => setSelectedPhase(phaseId)}
                                            className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                                                selectedPhase === phaseId 
                                                ? 'bg-blue-600 text-white' 
                                                : isUnlocked 
                                                ? 'hover:bg-white/5 text-zinc-400' 
                                                : 'opacity-30 grayscale cursor-not-allowed'
                                            }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase opacity-60">Phase {id}</span>
                                                <span className="text-xs font-bold truncate">{module.filename}</span>
                                            </div>
                                            {isCompleted && <CheckCircle2 className="w-4 h-4 text-white/50" />}
                                            {!isUnlocked && <X className="w-4 h-4" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content: Code */}
                        <div className="flex-1 flex flex-col min-w-0">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                                <div>
                                    <h3 className="text-white font-bold">{NOVA_CODEBASE[selectedPhase].filename}</h3>
                                    <p className="text-zinc-500 text-xs">{NOVA_CODEBASE[selectedPhase].description}</p>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-auto p-6 bg-[#0d1117] font-mono">
                                <pre className="text-sm leading-relaxed">
                                    <code className="text-blue-300">
                                        {NOVA_CODEBASE[selectedPhase].code}
                                    </code>
                                </pre>
                            </div>

                            <div className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                                    Local Library Status: {completedPhases.length / 10 * 100}% Compiled
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
