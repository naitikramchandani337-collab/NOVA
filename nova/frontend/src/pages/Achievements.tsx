import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { progressService, BackendAchievement } from '@/services/progressService';
import { useAuthStore } from '@/store/authStore';
import { useProgressStore } from '@/store/progressStore';
import { Award, Lock, Sparkles, ChevronLeft, Target } from 'lucide-react';

interface AchievementDef {
  key: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const ALL_ACHIEVEMENTS: AchievementDef[] = [
  { key: 'first_steps',        name: 'First Steps',        description: 'Complete Phase 1',                          icon: '🚀', xpReward: 50,  rarity: 'common'    },
  { key: 'math_master',        name: 'Math Master',         description: 'Complete Phase 2: Mathematical Foundation',  icon: '📐', xpReward: 75,  rarity: 'common'    },
  { key: 'deep_diver',         name: 'Deep Diver',          description: 'Complete Phase 3: Deep Learning',            icon: '🧠', xpReward: 100, rarity: 'rare'      },
  { key: 'vision_quest',       name: 'Vision Quest',        description: 'Complete Phase 4: Computer Vision',          icon: '👁️', xpReward: 100, rarity: 'rare'      },
  { key: 'rocket_scientist',   name: 'Rocket Scientist',    description: 'Complete 5 phases',                         icon: '🔬', xpReward: 200, rarity: 'rare'      },
  { key: 'language_lord',      name: 'Language Lord',       description: 'Complete Phase 5: NLP',                     icon: '💬', xpReward: 125, rarity: 'rare'      },
  { key: 'policy_player',      name: 'Policy Player',       description: 'Complete Phase 6: Reinforcement Learning',   icon: '🎮', xpReward: 150, rarity: 'epic'      },
  { key: 'attention_wizard',   name: 'Attention Wizard',    description: 'Complete Phase 7: Transformers',             icon: '✨', xpReward: 175, rarity: 'epic'      },
  { key: 'fine_tuner',         name: 'Fine Tuner',          description: 'Complete Phase 8: Fine-tuning',              icon: '🎛️', xpReward: 200, rarity: 'epic'      },
  { key: 'deployer',           name: 'Deployer',            description: 'Complete Phase 9: Deployment',               icon: '🌐', xpReward: 225, rarity: 'epic'      },
  { key: 'ai_master',          name: 'AI Master',           description: 'Complete all 10 phases',                    icon: '👑', xpReward: 500, rarity: 'legendary' },
  { key: 'speedrunner',        name: 'Speedrunner',         description: 'Complete all phases in 30 days',             icon: '⚡', xpReward: 300, rarity: 'legendary' },
  { key: 'consistent_learner', name: 'Consistent Learner',  description: 'Maintain a 30-day streak',                  icon: '🔥', xpReward: 400, rarity: 'legendary' },
  { key: 'quiz_master',        name: 'Quiz Master',         description: 'Score 100% on all quizzes',                 icon: '🎯', xpReward: 350, rarity: 'legendary' },
];

const RARITY_CONFIG = {
  common:    { color: '#71717a', label: 'Common' },
  rare:      { color: '#3b82f6', label: 'Rare' },
  epic:      { color: '#a855f7', label: 'Epic' },
  legendary: { color: '#eab308', label: 'Legendary' },
};

export default function Achievements() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { completedPhases } = useProgressStore();

  const [unlockedKeys, setUnlockedKeys] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    const local = new Set<string>();
    if (completedPhases.includes(1)) local.add('first_steps');
    if (completedPhases.includes(2)) local.add('math_master');
    if (completedPhases.includes(3)) local.add('deep_diver');
    if (completedPhases.includes(4)) local.add('vision_quest');
    if (completedPhases.includes(5)) { local.add('language_lord'); local.add('rocket_scientist'); }
    if (completedPhases.includes(6)) local.add('policy_player');
    if (completedPhases.includes(7)) local.add('attention_wizard');
    if (completedPhases.includes(8)) local.add('fine_tuner');
    if (completedPhases.includes(9)) local.add('deployer');
    if (completedPhases.length === 10) local.add('ai_master');
    setUnlockedKeys(local);

    if (!isAuthenticated) { setIsLoading(false); return; }

    progressService.getAchievements()
      .then((data: BackendAchievement[]) => {
        data.forEach((a) => local.add(a.achievement_key));
        setUnlockedKeys(new Set(local));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, completedPhases]);

  const filtered = ALL_ACHIEVEMENTS.filter((a) => {
    if (filter === 'unlocked') return unlockedKeys.has(a.key);
    if (filter === 'locked')   return !unlockedKeys.has(a.key);
    return true;
  });

  const unlockedCount = ALL_ACHIEVEMENTS.filter((a) => unlockedKeys.has(a.key)).length;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16">
          <button
            onClick={() => navigate('/universe')}
            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-8"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to universe
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="flex-1">
                <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4">
                    Mission <span className="text-purple-500">Medals</span>
                </h1>
                <p className="text-zinc-500 font-medium max-w-md">
                    Proof of your engineering prowess. Every system built earns a medal of distinction.
                </p>
            </div>
            
            <div className="w-full md:w-72">
                <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                    <span>Campaign Progress</span>
                    <span className="text-white">{unlockedCount}/{ALL_ACHIEVEMENTS.length}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(unlockedCount / ALL_ACHIEVEMENTS.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {(['all', 'unlocked', 'locked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/5 text-zinc-500 hover:bg-white/10 border border-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-white/5 rounded-[32px] animate-pulse border border-white/5" />
              ))
            ) : (
              filtered.map((a, i) => {
                const unlocked = unlockedKeys.has(a.key);
                const config = RARITY_CONFIG[a.rarity];

                return (
                  <motion.div
                    key={a.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`relative p-8 rounded-[32px] border transition-all group overflow-hidden ${
                      unlocked
                      ? 'bg-zinc-950/50 border-white/10 hover:border-white/20'
                      : 'bg-black/40 border-white/5 opacity-40 grayscale'
                    }`}
                  >
                    {/* Rarity Glow */}
                    {unlocked && (
                        <div 
                            className="absolute -top-20 -right-20 w-40 h-40 blur-[80px] rounded-full opacity-20"
                            style={{ background: config.color }}
                        />
                    )}

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`text-4xl ${unlocked ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''}`}>
                                {unlocked ? a.icon : <Lock className="w-8 h-8 text-zinc-700" />}
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: config.color }}>
                                    {config.label}
                                </div>
                                <div className="text-[12px] font-black text-white italic">+{a.xpReward} XP</div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <h3 className={`text-lg font-black uppercase tracking-tighter mb-2 ${unlocked ? 'text-white' : 'text-zinc-600'}`}>
                                {a.name}
                            </h3>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-2">
                                {a.description}
                            </p>
                        </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
