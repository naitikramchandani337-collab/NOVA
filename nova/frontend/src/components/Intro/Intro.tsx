import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/store/progressStore';
import { Rocket, Sparkles, MapPin, Target, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Intro() {
  const [step, setStep] = useState(0);
  const setHasSeenIntro = useProgressStore(state => state.setHasSeenIntro);

  const steps = [
    // Screen 1: The Arrival
    {
      type: 'cinematic',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
            className="text-xl md:text-2xl text-blue-200 font-light mb-8"
          >
            Somewhere in the universe...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 2 }}
            className="text-xl md:text-2xl text-blue-100 font-medium mb-8"
          >
            an AI is waiting to be born.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 7, duration: 2 }}
            className="text-2xl md:text-3xl text-white font-bold mb-12"
          >
            That AI is yours.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 10, duration: 1 }}
            onClick={() => setStep(1)}
            className="group flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all transform hover:scale-105"
          >
            LET'S BUILD IT <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      )
    },
    // Screen 2: Your Launch Base
    {
      type: 'launchpad',
      content: (
        <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden">
          {/* Launchpad Ground */}
          <div className="absolute bottom-0 w-full h-1/3 bg-zinc-900 border-t-4 border-zinc-800" />
          
          {/* Empty Rocket Shell */}
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 mb-12"
          >
             <div className="w-24 h-48 border-2 border-zinc-700 rounded-t-full flex items-center justify-center bg-zinc-800/30 backdrop-blur-sm">
                <span className="text-zinc-600 text-xs font-mono uppercase transform -rotate-90">Empty Shell</span>
             </div>
             <div className="flex justify-between -mt-4">
                <div className="w-6 h-12 bg-zinc-800 rounded-bl-lg" />
                <div className="w-6 h-12 bg-zinc-800 rounded-br-lg" />
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="z-20 text-center max-w-md px-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">This is your AI.</h2>
            <p className="text-zinc-400 mb-8">Right now it's nothing. Just an empty shell on a cold launchpad. Let's change that.</p>
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors"
            >
              PREPARE FOR MISSION
            </button>
          </motion.div>
        </div>
      )
    },
    // Screen 3: Your Mission Brief
    {
      type: 'brief',
      content: (
        <div className="flex items-center justify-center h-full px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-zinc-950 border-2 border-blue-900/50 p-8 rounded-xl shadow-2xl shadow-blue-900/20"
          >
            <div className="flex items-center gap-3 mb-8 border-b border-blue-900/30 pb-4">
              <Rocket className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-black tracking-widest text-white uppercase">Mission Brief</h1>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="text-blue-400 text-xs font-bold uppercase tracking-tighter">Mission</h3>
                  <p className="text-white font-medium">Launch an intelligent AI into deep space</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-blue-400 text-xs font-bold uppercase tracking-tighter">Status</h3>
                    <p className="text-white font-medium">Pre-launch</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-blue-400 text-xs font-bold uppercase tracking-tighter">Destination</h3>
                    <p className="text-white font-medium">The Unknown</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="text-blue-400 text-xs font-bold uppercase tracking-tighter">Phases to Complete</h3>
                  <p className="text-white font-medium">10 Core Phases</p>
                </div>
              </div>

              <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-red-400 text-xs leading-relaxed">
                  <span className="font-bold block uppercase mb-1">Warning</span>
                  Skipping phases or ignoring visualizations may cause critical mission failure in deep space environments.
                </p>
              </div>
            </div>

            <button
              onClick={() => setHasSeenIntro(true)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Accept Mission
            </button>
          </motion.div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      {/* Background Stars (Static for now, can be improved) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative h-full w-full"
        >
          {steps[step].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
