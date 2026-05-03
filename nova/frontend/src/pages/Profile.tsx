import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Star, Zap, Flame, Rocket, Trophy,
  Edit3, Save, X, ChevronLeft, Shield,
  Globe, Clock, BarChart2, BookOpen, Code2,
  MessageSquare, CheckCircle,
} from 'lucide-react';
import { useProgressStore } from '@/store/progressStore';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/firestoreService';

const LEVEL_TITLES = [
  'Data Cadet', 'Algorithm Apprentice', 'Neural Navigator',
  'Gradient Warrior', 'Transformer Mage', 'Model Architect',
  'AI Engineer', 'Deep Mind', 'Research Phantom', 'AI Overlord',
];

const AVATAR_COLORS = [
  '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981',
  '#ef4444', '#ec4899', '#06b6d4', '#f97316',
];

export default function Profile() {
  const navigate  = useNavigate();
  const { totalXP, level, streak, completedPhases, getLevelProgress } = useProgressStore();
  const { user }  = useAuthStore();

  const [editing,     setEditing]     = useState(false);
  const [profile,     setProfile]     = useState<any>(null);
  const [saving,      setSaving]      = useState(false);
  
  // Local edit state
  const [editName,    setEditName]    = useState('');
  const [editBio,     setEditBio]     = useState('');
  const [editAvatar,  setEditAvatar]  = useState('');

  useEffect(() => {
    if (user?.uid) {
      getUserProfile(user.uid).then(p => {
        setProfile(p);
        setEditName(p?.username || user.username);
        setEditBio(p?.bio || '');
        setEditAvatar(p?.avatar || 'default');
      });
    }
  }, [user]);

  const levelTitle   = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  const levelProgress = getLevelProgress();

  const stats = [
    { label: 'Total XP',       value: totalXP.toLocaleString(), Icon: Zap,         color: 'text-blue-500' },
    { label: 'Level',          value: level,                     Icon: Star,        color: 'text-purple-500' },
    { label: 'Streak',         value: `${streak}d`,              Icon: Flame,       color: 'text-orange-500' },
    { label: 'Phases Done',    value: completedPhases.length,    Icon: Rocket,      color: 'text-cyan-500' },
  ];

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    await updateUserProfile(user.uid, {
      username: editName,
      bio: editBio,
      avatar: editAvatar,
    });
    setProfile({ ...profile, username: editName, bio: editBio, avatar: editAvatar });
    setSaving(false);
    setEditing(false);
  };

  if (!profile) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center">
      <div className="text-zinc-600 animate-pulse font-black text-xs uppercase tracking-[0.4em]">Retrieving Credentials...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050510] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#050510]/80 backdrop-blur-3xl border-b border-white/5 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Profile</h1>
        </div>
        <div>
          {editing ? (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="p-2 rounded-2xl hover:bg-white/5 text-zinc-500">
                <X className="w-5 h-5" />
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-3 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20">
                <Save className="w-4 h-4" />
                {saving ? 'Syncing' : 'Save Config'}
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-3 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Avatar + Basic Info */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a0a1a] border border-white/10 rounded-[32px] p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent" />
              
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-[40px] bg-blue-500 flex items-center justify-center text-5xl font-black italic text-white shadow-2xl shadow-blue-500/20 border-4 border-white/10">
                  {editName[0]?.toUpperCase() || 'C'}
                </div>
                {editing && (
                   <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg border-4 border-[#0a0a1a] cursor-pointer">
                      <Edit3 className="w-4 h-4" />
                   </div>
                )}
              </div>

              <div className="relative z-10 w-full">
                {editing ? (
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white text-xl font-black italic text-center focus:outline-none focus:border-blue-500/50 mb-2"
                  />
                ) : (
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">{profile.username}</h2>
                )}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-blue-500 text-white uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                    {levelTitle}
                  </span>
                  <span className="text-xs font-bold text-zinc-600 mt-2">Joined {new Date(profile.joinedAt?.seconds * 1000).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full mt-10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Level Progress</span>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{Math.round(levelProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ label, value, Icon, color }) => (
                <div key={label} className="bg-[#0a0a1a] border border-white/10 rounded-3xl p-6 shadow-xl">
                  <Icon className={`w-5 h-5 mb-3 ${color}`} />
                  <div className="text-2xl font-black italic text-white">{value}</div>
                  <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Bio + Content */}
          <div className="md:col-span-2 space-y-6">
            <Section title="Cognitive Archive (Bio)" Icon={User}>
              {editing ? (
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  rows={4}
                  placeholder="Define your existence in the galaxy..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:outline-none focus:border-blue-500/50 resize-none placeholder-zinc-700"
                />
              ) : (
                <p className="text-zinc-400 text-lg leading-relaxed font-medium italic">
                  "{profile.bio || 'This explorer has not yet defined their mission parameters.'}"
                </p>
              )}
            </Section>

            <Section title="Operational Milestones" Icon={Trophy}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {completedPhases.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                       <Shield className="w-12 h-12 text-zinc-800 mx-auto mb-4 opacity-50" />
                       <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No phases synchronized yet</p>
                    </div>
                  ) : (
                    completedPhases.map(phaseId => (
                      <div key={phaseId} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-blue-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-white font-black italic uppercase text-sm tracking-tight">Phase {phaseId} Synchronized</div>
                          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">MISSION COMPLETE</div>
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </Section>

            <Section title="Galactic Presence" Icon={Globe}>
              <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div>
                   <div className="text-white font-black italic uppercase text-lg mb-1">Global Visibility</div>
                   <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Profile is visible to all explorers</div>
                </div>
                <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                   <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, Icon, children }: { title: string; Icon: React.FC<any>; children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0a1a] border border-white/10 rounded-[32px] p-8 shadow-2xl">
      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
        <Icon className="w-4 h-4 text-blue-500" /> {title}
      </h3>
      {children}
    </div>
  );
}
