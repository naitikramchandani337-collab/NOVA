import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Search, UserPlus, Users, Trophy,
  Activity, Check, X, Rocket, Zap, Flame,
  Star, Clock, UserCheck, UserX, Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import {
  getFriends, getFriendRequests, sendFriendRequest,
  acceptFriendRequest, searchUsers, UserProfile
} from '@/lib/firestoreService';

type Tab = 'friends' | 'requests' | 'search';

export default function Friends() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tab,          setTab]          = useState<Tab>('friends');
  const [friends,      setFriends]      = useState<any[]>([]);
  const [requests,     setRequests]     = useState<any[]>([]);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading,      setLoading]      = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadFriends();
      loadRequests();
    }
  }, [user]);

  const loadFriends = async () => {
    if (!user?.uid) return;
    const f = await getFriends(user.uid);
    setFriends(f);
  };

  const loadRequests = async () => {
    if (!user?.uid) return;
    const r = await getFriendRequests(user.uid);
    setRequests(r);
  };

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setLoading(true);
    const results = await searchUsers(q);
    setSearchResults(results.filter(u => u.uid !== user?.uid));
    setLoading(false);
  };

  const handleSendRequest = async (toUid: string) => {
    if (!user?.uid) return;
    await sendFriendRequest(user.uid, toUid);
    setSearchResults(prev => prev.map(u => u.uid === toUid ? { ...u, pending: true } : u));
  };

  const handleAccept = async (req: any) => {
    if (!user?.uid) return;
    await acceptFriendRequest(req.id, user.uid, req.from);
    loadRequests();
    loadFriends();
  };

  const TABS = [
    { id: 'friends',  label: 'Squad',     Icon: Users,   badge: friends.length  },
    { id: 'requests', label: 'Signals',    Icon: UserPlus, badge: requests.length },
    { id: 'search',   label: 'Explore',    Icon: Search   },
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#050510]/80 backdrop-blur-3xl border-b border-white/5 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Squadron</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        {/* Tab bar */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-12 pb-4 border-b border-white/5">
          {TABS.map(({ id, label, Icon, badge }) => (
            <button key={id} onClick={() => setTab(id as Tab)}
              className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === id ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}>
              <Icon className="w-4 h-4" />
              {label}
              {badge > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-white text-black text-[9px] font-black">{badge}</span>}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tab === 'friends' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <Users className="w-12 h-12 text-zinc-800 mx-auto mb-4 opacity-50" />
                    <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">No squad members detected</p>
                    <button onClick={() => setTab('search')} className="mt-6 px-6 py-3 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Search Galaxy</button>
                  </div>
                ) : (
                  friends.map(f => <FriendCard key={f.uid} friend={f} />)
                )}
             </div>
          )}

          {tab === 'requests' && (
             <div className="space-y-4">
                {requests.length === 0 ? (
                   <div className="py-20 text-center">
                    <UserPlus className="w-12 h-12 text-zinc-800 mx-auto mb-4 opacity-50" />
                    <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">No incoming signals</p>
                  </div>
                ) : (
                  requests.map(r => (
                    <div key={r.id} className="bg-[#0a0a1a] border border-white/10 rounded-3xl p-6 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-xl font-black italic">
                             ?
                          </div>
                          <div>
                             <div className="text-white font-black italic uppercase">New Signal Received</div>
                             <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">ID: {r.from.slice(0, 8)}...</div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => handleAccept(r)} className="p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                             <Check className="w-5 h-5" />
                          </button>
                          <button className="p-3 rounded-xl bg-white/5 text-zinc-500 hover:bg-white/10 transition-all">
                             <X className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  ))
                )}
             </div>
          )}

          {tab === 'search' && (
            <div className="space-y-6">
               <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="SCANNING GALAXY FOR EXPLORERS..."
                    className="w-full bg-[#0a0a1a] border border-white/10 rounded-3xl pl-16 pr-6 py-5 text-white text-sm font-black italic placeholder:text-zinc-800 focus:outline-none focus:border-blue-500/50 shadow-2xl"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map(u => (
                    <div key={u.uid} className="bg-[#0a0a1a] border border-white/10 rounded-3xl p-6 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-[20px] bg-zinc-900 border border-white/10 flex items-center justify-center text-xl font-black italic text-white group-hover:bg-blue-500 transition-all">
                             {u.displayName[0]?.toUpperCase()}
                          </div>
                          <div>
                             <div className="text-white font-black italic uppercase tracking-tight">{u.displayName}</div>
                             <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Space Cadet</div>
                          </div>
                       </div>
                       {u.pending ? (
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 py-2 bg-white/5 rounded-xl">Signal Sent</span>
                       ) : (
                        <button onClick={() => handleSendRequest(u.uid)} className="p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                          <UserPlus className="w-5 h-5" />
                        </button>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FriendCard({ friend }: { friend: any }) {
  return (
    <div className="bg-[#0a0a1a] border border-white/10 rounded-[32px] p-6 flex items-center gap-4 group hover:border-blue-500/30 transition-all shadow-xl">
       <div className="w-16 h-16 rounded-[24px] bg-blue-500 flex items-center justify-center text-2xl font-black italic text-white shadow-lg shadow-blue-500/20">
          ?
       </div>
       <div className="flex-1">
          <div className="text-white font-black italic uppercase text-lg tracking-tight">Active Explorer</div>
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">SQUAD MEMBER</div>
       </div>
       <div className="text-right">
          <div className="text-blue-500 font-black italic uppercase text-xs">ONLINE</div>
       </div>
    </div>
  );
}
