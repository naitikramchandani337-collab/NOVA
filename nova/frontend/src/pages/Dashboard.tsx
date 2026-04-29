import React, { useEffect } from 'react';
import { useProgress } from '@context/progressContext';
import { Header } from '@components/Navigation/Header';
import { RocketDisplay } from '@components/Rocket/RocketDisplay';
import { SpaceMap } from '@components/SpaceUniverse/SpaceMap';
import { motion } from 'framer-motion';
import { fadeInUp } from '@utils/animations';

export const Dashboard: React.FC = () => {
  const { stats, phases, fetchStats, fetchPhases } = useProgress();

  useEffect(() => {
    fetchStats();
    fetchPhases();
  }, [fetchStats, fetchPhases]);

  if (!stats || phases.length === 0) {
    return (
      <div className="min-h-screen bg-space-950 flex items-center justify-center">
        <div className="text-space-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-950">
      <Header />
      
      <main className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            className="mb-12 text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome back, <span className="text-rocket-primary">{stats.user.username}</span>
            </h1>
            <p className="text-space-300 text-lg">
              Level {stats.progress.current_level} • {stats.progress.total_xp} XP • {stats.phases_completed}/10 Phases
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Space Map */}
            <motion.div
              className="lg:col-span-2 bg-space-900 rounded-lg border border-space-800 overflow-hidden h-96"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
            >
              <SpaceMap
                phases={phases}
                onPhaseClick={(phaseId) => {
                  // Navigate to phase
                  console.log('Clicked phase:', phaseId);
                }}
              />
            </motion.div>

            {/* Rocket Display */}
            <motion.div
              className="bg-space-900 rounded-lg border border-space-800 p-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Your Rocket</h2>
              <RocketDisplay parts={stats.rocket_parts_unlocked as any} totalPhases={10} />
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
              { label: 'Current Level', value: stats.progress.current_level },
              { label: 'Total XP', value: stats.progress.total_xp },
              { label: 'Phases Completed', value: stats.phases_completed },
              { label: 'Streak Days', value: stats.progress.streak_days },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-space-900 rounded-lg border border-space-800 p-4 text-center"
              >
                <p className="text-space-400 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-rocket-primary">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
