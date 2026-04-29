import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Search, UserPlus, Users, Trophy,
  Activity, Check, X, Rocket, Zap, Flame,
  Star, Clock, UserCheck, UserX, Loader2,
} from 'lucide-react';
import api from '@/services/api';

type Tab = 'friends' | 'requests' | 'search' | 'leaderboard' | 'activity';

interface Friend {
  user_id: string; username: string; display_name: string;
  avatar_url: string; title: string; level: number;
  current_phase: number; streak_days: number; total_xp: number;
  friendship_since?: string;
}

interface FriendRequest {
  request_id: string; sender_id: string; sender_name: string;
  sender_avatar: string; sender_level: number; sender_title: string; sent_at: string;
}

interface SearchResult {
  user_id: string; username: string; display_name: string;
  avatar_url: string; title: string; level: number;
  current_phase: number; is_friend: boolean; request_pending: boolean;
}

interface LeaderboardEntry {
  rank: number; user_id: string; display_name: string;
  avatar_url: string; title: string; total_xp: number;
  level: number; current_phase: number; streak_days: number; is_you: boolean;
}

interface ActivityItem {
  id: string; user_id: string; display_name: string;
  avatar_url: string; type: string; title: string;
  description: string; xp_earned: number; phase?: number; created_at: string;
}

function Avatar({ name, url, size = 10 }: { name: string; url?: string; size?: number }) {
  const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];
  const color  = colors[(name.charCodeAt(0) || 0) % colors.length];
  return (
    <div
      className={`w-${size} h-${size} rounded-2xl flex items-center justify-center text-white font-black flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, fontSize: size * 1.6 }}
    >
      {(name[0] || '?').toUpperCase()}
    </div>
  );
}

function FriendCard({ friend, onRemove }: { friend: Friend; onRemove: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all"
    >
      <Avatar name={friend.display_name} size={10} />
      <div className="flex-1 min-w-0">
        <div className="text-white font-bold text-sm truncate">{friend.display_name}</div>
        <div className="text-zinc-500 text-xs">{friend.title}</div>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-[10px] text-zinc-600">
            <Star className="w-3 h-3 text-cyan-400" /> Lv.{friend.level}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-600">
            <Rocket className="w-3 h-3 text-purple-400" /> Phase {friend.current_phase}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-600">
            <Flame className="w-3 h-3 text-orange-400" /> {friend.streak_days}d
          </span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-yellow-400 font-black text-sm">{friend.total_xp.toLocaleString()}</div>
        <div className="text-zinc-600 text-[10px]">XP</div>
        <button
          onClick={() => onRemove(friend.user_id)}
          className="mt-1 p-1 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all"
        >
          <UserX className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Friends() {
  const navigate = useNavigate();
  const [tab,          setTab]          = useState<Tab>('friends');
  const [friends,      setFriends]      = useState<Friend[]>([]);
  const [requests,     setRequests]     = useState<FriendRequest[]>([]);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [leaderboard,  setLeaderboard]  = useState<LeaderboardEntry[]>([]);
  const [activity,     setActivity]     = useState<ActivityItem[]>([]);
  const [loading,      setLoading]      = useState(false);

  useEffect(() => { loadFriends(); loadRequests(); }, []);
  useEffect(() => { if (tab === 'leaderboard') loadLeaderboard(); }, [tab]);
  useEffect(() => { if (tab === 'activity') loadActivity(); }, [tab]);

  const loadFriends = async () => {
    try { const r = await api.get('/api/friends/'); setFriends(r.data); } catch {}
  };
  const loadRequests = async () => {
    try { const r = await api.get('/api/friends/requests'); setRequests(r.data); } catch {}
  };
  const loadLeaderboard = async () => {
    try { const r = await api.get('/api/friends/leaderboard/friends'); setLeaderboard(r.data); } catch {}
  };
  const loadActivity = async () => {
    try { const r = await api.get('/api/friends/activity/feed'); setActivity(r.data); } catch {}
  };

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const r = await api.get(`/api/friends/search/${q}`);
      setSearchResults(r.data);
    } catch {}
  };

  const sendRequest = async (userId: string) => {
    try {
      await api.post('/api/friends/request', { receiver_id: userId });
      setSearchResults(prev => prev.map(u => u.user_id === userId ? { ...u, request_pending: true } : u));
    } catch {}
  };

  const acceptRequest = async (requestId: string) => {
    try {
      await api.post(`/api/friends/accept/${requestId}`);
      setRequests(prev => prev.filter(r => r.request_id !== requestId));
      loadFriends();
    } catch {}
  };

  const declineRequest = async (requestId: string) => {
    try {
      await api.post(`/api/friends/decline/${requestId}`);
      setRequests(prev => prev.filter(r => r.request_id !== requestId));
    } catch {}
  };

  const removeFriend = async (friendId: string) => {
    try {
      await api.delete(`/api/friends/${friendId}`);
      setFriends(prev => prev.filter(f => f.user_id !== friendId));
    } catch {}
  };

  const TABS: { id: Tab; label: string; Icon: React.FC<any>; badge?: number }[] = [
    { id: 'friends',     label: 'Friends',     Icon: Users,   badge: friends.length  },
    { id: 'requests',    label: 'Requests',    Icon: UserPlus, badge: requests.length },
    { id: 'search',      label: 'Search',      Icon: Search   },
    { id: 'leaderboard', label: 'Leaderboard', Icon: Trophy   },
    { id: 'activity',    label: 'Activity',    Icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black text-white">Friends</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-white/5">
        {TABS.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              tab === id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {badge !== undefined && badge > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-black text-[9px] font-black flex items-center justify-center">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-3">

        {/* Friends Tab */}
        {tab === 'friends' && (
          <AnimatePresence>
            {friends.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 font-medium">No friends yet</p>
                <p className="text-zinc-600 text-sm mt-1">Search for cadets to add</p>
                <button onClick={() => setTab('search')} className="mt-4 px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-sm font-medium">
                  Find Friends
                </button>
              </motion.div>
            ) : (
              friends.map(f => <FriendCard key={f.user_id} friend={f} onRemove={removeFriend} />)
            )}
          </AnimatePresence>
        )}

        {/* Requests Tab */}
        {tab === 'requests' && (
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="text-center py-16">
                <UserPlus className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 font-medium">No pending requests</p>
              </div>
            ) : (
              requests.map(r => (
                <motion.div key={r.request_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl"
                >
                  <Avatar name={r.sender_name} size={10} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm">{r.sender_name}</div>
                    <div className="text-zinc-500 text-xs">{r.sender_title} · Lv.{r.sender_level}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => acceptRequest(r.request_id)}
                      className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => declineRequest(r.request_id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Search Tab */}
        {tab === 'search' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search by username..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {searchResults.map(u => (
              <motion.div key={u.user_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl"
              >
                <Avatar name={u.display_name} size={10} />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm">{u.display_name}</div>
                  <div className="text-zinc-500 text-xs">{u.title} · Phase {u.current_phase}</div>
                </div>
                {u.is_friend ? (
                  <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                    <UserCheck className="w-3.5 h-3.5" /> Friends
                  </span>
                ) : u.request_pending ? (
                  <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-lg">Pending</span>
                ) : (
                  <button onClick={() => sendRequest(u.user_id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-medium hover:bg-cyan-500/30 transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Add
                  </button>
                )}
              </motion.div>
            ))}

            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm">No cadets found for "{searchQuery}"</div>
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {tab === 'leaderboard' && (
          <div className="space-y-2">
            {leaderboard.length === 0 ? (
              <div className="text-center py-16">
                <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 font-medium">Add friends to see the leaderboard</p>
              </div>
            ) : (
              leaderboard.map((e, i) => (
                <motion.div key={e.user_id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    e.is_you
                      ? 'bg-cyan-500/10 border-cyan-500/20'
                      : 'bg-white/[0.03] border-white/5'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    e.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                    e.rank === 2 ? 'bg-zinc-400/20 text-zinc-300' :
                    e.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/5 text-zinc-500'
                  }`}>
                    {e.rank}
                  </div>

                  <Avatar name={e.display_name} size={9} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm truncate">{e.display_name}</span>
                      {e.is_you && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">YOU</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-zinc-600">Lv.{e.level}</span>
                      <span className="text-[10px] text-zinc-600">Phase {e.current_phase}</span>
                      <span className="flex items-center gap-0.5 text-[10px] text-zinc-600">
                        <Flame className="w-2.5 h-2.5 text-orange-400" />{e.streak_days}d
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-yellow-400 font-black">{e.total_xp.toLocaleString()}</div>
                    <div className="text-zinc-600 text-[10px]">XP</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Activity Tab */}
        {tab === 'activity' && (
          <div className="space-y-3">
            {activity.length === 0 ? (
              <div className="text-center py-16">
                <Activity className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 font-medium">No activity yet</p>
                <p className="text-zinc-600 text-sm mt-1">Add friends to see their learning activity</p>
              </div>
            ) : (
              activity.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl"
                >
                  <Avatar name={a.display_name} size={9} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm">
                      <span className="font-bold">{a.display_name}</span>
                      <span className="text-zinc-400"> {a.title}</span>
                    </div>
                    {a.description && <div className="text-zinc-500 text-xs mt-0.5">{a.description}</div>}
                    <div className="flex items-center gap-3 mt-1">
                      {a.xp_earned > 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-yellow-400">
                          <Zap className="w-3 h-3" /> +{a.xp_earned} XP
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                        <Clock className="w-3 h-3" />
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
