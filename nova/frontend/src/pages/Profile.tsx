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
import api from '@/services/api';

const LEVEL_TITLES = [
  'Space Cadet', 'Algorithm Apprentice', 'Neural Navigator',
  'Gradient Warrior', 'Transformer Mage', 'Model Architect',
  'AI Engineer', 'Deep Mind', 'Research Phantom', 'AI Overlord',
];

const AVATAR_COLORS = [
  '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981',
  '#ef4444', '#ec4899', '#3b82f6', '#f97316',
];

export default function Profile() {
  const navigate  = useNavigate();
  const { totalXP, level, streak, completedPhases, getLevelProgress } = useProgressStore();
  const { user }  = useAuthStore();

  const [editing,     setEditing]     = useState(false);
  const [avatarColor, setAvatarColor] = useState('#06b6d4');
  const [displayName, setDisplayName] = useState(user?.username || 'Commander');
  const [bio,         setBio]         = useState('');
  const [country,     setCountry]     = useState('');
  const [rocketName,  setRocketName]  = useState('Nova-1');
  const [saving,      setSaving]      = useState(false);

  const levelTitle   = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  const levelProgress = getLevelProgress();

  const stats = [
    { label: 'Total XP',       value: totalXP.toLocaleString(), Icon: Zap,         color: 'text-yellow-400' },
    { label: 'Level',          value: level,                     Icon: Star,        color: 'text-cyan-400'   },
    { label: 'Streak',         value: `${streak}d`,              Icon: Flame,       color: 'text-orange-400' },
    { label: 'Phases Done',    value: completedPhases.length,    Icon: Rocket,      color: 'text-purple-400' },
    { label: 'Lessons',        value: '—',                       Icon: BookOpen,    color: 'text-green-400'  },
    { label: 'Code Runs',      value: '—',                       Icon: Code2,       color: 'text-blue-400'   },
    { label: 'ASTRA Chats',    value: '—',                       Icon: MessageSquare, color: 'text-pink-400' },
    { label: 'Achievements',   value: '—',                       Icon: Trophy,      color: 'text-amber-400'  },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/api/profile/me', { display_name: displayName, bio, country, rocket_name: rocketName });
    } catch { /* offline — save locally */ }
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black text-white">My Profile</h1>
        <div className="ml-auto">
          {editing ? (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400">
                <X className="w-4 h-4" />
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-sm transition-all disabled:opacity-50">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium rounded-xl text-sm transition-all">
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-8 space-y-6">
        {/* Avatar + Name */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)` }}
            >
              {(displayName[0] || 'C').toUpperCase()}
            </div>
            {editing && (
              <div className="absolute -bottom-2 -right-2 flex gap-1 flex-wrap w-28">
                {AVATAR_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setAvatarColor(c)}
                    className="w-5 h-5 rounded-full border-2 transition-all"
                    style={{ backgroundColor: c, borderColor: avatarColor === c ? 'white' : 'transparent' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Name + title */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                maxLength={30}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xl font-black focus:outline-none focus:border-cyan-500/50 mb-2"
              />
            ) : (
              <h2 className="text-2xl font-black text-white mb-1">{displayName}</h2>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 font-bold">
                {levelTitle}
              </span>
              <span className="text-xs text-zinc-500">@{user?.username}</span>
            </div>

            {/* Level progress */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Lv.{level}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs text-zinc-500">Lv.{level + 1}</span>
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
        >
          <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> About
          </h3>
          {editing ? (
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={250}
              rows={3}
              placeholder="Tell the galaxy about yourself..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50 resize-none placeholder-zinc-600"
            />
          ) : (
            <p className="text-zinc-400 text-sm">{bio || 'No bio yet. Click Edit to add one.'}</p>
          )}

          <div className="mt-3 flex gap-4">
            {editing ? (
              <input
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="Country"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
            ) : country ? (
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Globe className="w-3.5 h-3.5" /> {country}
              </span>
            ) : null}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5" /> Stats
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {stats.map(({ label, value, Icon, color }) => (
              <div key={label} className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
                <div className="text-white font-black text-lg leading-none">{value}</div>
                <div className="text-zinc-600 text-[10px] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rocket Name */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
        >
          <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Rocket className="w-3.5 h-3.5" /> My Rocket
          </h3>
          {editing ? (
            <input
              value={rocketName}
              onChange={e => setRocketName(e.target.value)}
              maxLength={30}
              placeholder="Name your rocket"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50"
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-white font-bold">{rocketName}</div>
                <div className="text-zinc-500 text-xs">{completedPhases.length}/12 parts unlocked</div>
              </div>
            </div>
          )}

          {/* Parts progress */}
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full"
                style={{
                  backgroundColor: i < completedPhases.length ? '#6366f1' : 'rgba(255,255,255,0.05)'
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5" /> Achievements
          </h3>
          {completedPhases.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center">
              <Shield className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-zinc-500 text-sm">Complete phases to unlock achievements</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {completedPhases.map(phaseId => (
                <div key={phaseId} className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <div className="text-white text-xs font-bold">Phase {phaseId}</div>
                  <div className="text-zinc-600 text-[10px]">Completed</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
