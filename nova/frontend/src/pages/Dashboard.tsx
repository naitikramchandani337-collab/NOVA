import React, { useEffect } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/Navigation/Header';
import { RocketDisplay } from '@/components/Rocket/RocketDisplay';
import { SpaceMap } from '@/components/SpaceUniverse/SpaceMap';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/utils/animations';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    totalXP, 
    level, 
    currentPhase, 
    completedPhases, 
    streak, 
    rocketParts,
    loadFromFirestore,
    getCurrentLevel
  } = useProgressStore();

  useEffect(() => {
    if (user?.uid) {
      loadFromFirestore(user.uid);
    }
  }, [user, loadFromFirestore]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse font-black tracking-widest uppercase text-xs">Authenticating...</div>
      </div>
    );
  }

  const calculatedLevel = getCurrentLevel();

  return (
    <div className="min-h-screen bg-[#050510]">
      <Header />
      
      <main className="pt-32 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            className="mb-16"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 text-white">
                  Welcome back, <span className="text-blue-500">{user.username}</span>
                </h1>
                <p className="text-zinc-500 font-medium text-lg">
                  Level {calculatedLevel} · {totalXP.toLocaleString()} XP · {completedPhases.length}/10 Phases Complete
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Current Streak</div>
                  <div className="text-2xl font-black italic text-orange-500">{streak} Days</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Space Map */}
            <motion.div
              className="lg:col-span-2 bg-[#0a0a1a] rounded-[32px] border border-white/10 overflow-hidden h-[500px] shadow-2xl relative"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
            >
              <div className="absolute top-6 left-6 z-10">
                <div className="px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                  Galaxy Sector {currentPhase}
                </div>
              </div>
              <SpaceMap
                phases={[]} // Will be loaded from Firestore in next step
                onPhaseClick={(phaseId) => {
                  console.log('Clicked phase:', phaseId);
                }}
              />
            </motion.div>

            {/* Rocket Display */}
            <motion.div
              className="bg-[#0a0a1a] rounded-[32px] border border-white/10 p-8 shadow-2xl"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">Your Rocket</h2>
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                  🚀
                </div>
              </div>
              <RocketDisplay parts={rocketParts} totalPhases={12} />
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            {[
              { label: 'Current Level', value: calculatedLevel, color: 'text-blue-500' },
              { label: 'Total XP', value: totalXP.toLocaleString(), color: 'text-purple-500' },
              { label: 'Phases Completed', value: completedPhases.length, color: 'text-cyan-500' },
              { label: 'Streak Days', value: streak, color: 'text-orange-500' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-[#0a0a1a] rounded-2xl border border-white/10 p-6 shadow-xl hover:border-white/20 transition-all"
              >
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                <p className={`text-3xl font-black italic ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
