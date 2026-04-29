import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { progressService, LeaderboardEntry } from '@/services/progressService';
import { useAuthStore } from '@/store/authStore';
import { useProgressStore } from '@/store/progressStore';
import { Trophy, Medal, Star, ChevronLeft, Search } from 'lucide-react';

const LEVEL_TITLES = [
  'Data Cadet', 'Algorithm Apprentice', 'Neural Navigator', 'Gradient Warrior',
  'Transformer Mage', 'Model Architect', 'AI Engineer', 'Deep Mind',
  'Research Phantom', 'AI Overlord',
];

export default function Leaderboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { xp, level } = useProgressStore();

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    progressService.getLeaderboard()
      .then((data) => {
        setEntries(data.entries);
        setUserRank(data.user_rank);
        setTotalUsers(data.total_users);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16">
          <button
            onClick={() => navigate('/universe')}
            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-8"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to universe
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4">
                    Hall of <span className="text-blue-500">Engineers</span>
                </h1>
                <p className="text-zinc-500 font-medium">
                    The top {totalUsers} explorers building the future of the galaxy.
                </p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <Search className="w-4 h-4 text-zinc-500" />
                <input 
                    placeholder="Search pilots..." 
                    className="bg-transparent border-none outline-none text-sm font-bold placeholder:text-zinc-700 w-32"
                />
            </div>
          </div>
        </div>

        {/* User Card */}
        {isAuthenticated && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-2xl border border-white/10 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent)]" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl font-black italic text-white shadow-lg shadow-blue-600/20">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Your Rank</div>
                <div className="text-2xl font-black uppercase italic tracking-tighter text-white">{user.username}</div>
                <div className="text-xs font-bold text-zinc-500">{LEVEL_TITLES[level - 1] ?? 'Data Cadet'}</div>
              </div>
            </div>
            <div className="flex gap-12 relative z-10 text-center md:text-right">
                <div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total XP</div>
                  <div className="text-3xl font-black italic text-white">{xp.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Global Pos</div>
                  <div className="text-3xl font-black italic text-blue-500">#{userRank ?? '???'}</div>
                </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
              ))
            ) : entries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <Trophy className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-400 font-bold text-lg mb-2">No rankings yet</p>
                <p className="text-zinc-600 text-sm">
                  {isAuthenticated
                    ? 'Complete lessons to earn XP and appear on the leaderboard.'
                    : 'Sign in and start learning to claim your rank.'}
                </p>
              </motion.div>
            ) : (
              entries.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group flex items-center gap-6 p-5 rounded-2xl border transition-all ${
                    user?.username === entry.username
                    ? 'bg-white/10 border-blue-500/50 shadow-lg shadow-blue-500/10'
                    : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="w-12 text-center relative">
                    {entry.rank <= 3 ? (
                      <Trophy className={`w-6 h-6 mx-auto ${
                        entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-zinc-300' : 'text-orange-400'
                      }`} />
                    ) : (
                      <span className="text-sm font-black text-zinc-700 group-hover:text-zinc-500 transition-colors">#{entry.rank}</span>
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center font-bold text-zinc-400 group-hover:text-white transition-colors">
                    {entry.username[0].toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-white">{entry.username}</span>
                        {user?.username === entry.username && <Star className="w-3 h-3 text-blue-500 fill-blue-500" />}
                    </div>
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        {LEVEL_TITLES[entry.current_level - 1] ?? 'Data Cadet'} · {entry.phases_completed} Mission Cycles
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black italic text-white">{entry.total_xp.toLocaleString()}</div>
                    <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">XP CREDITS</div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
