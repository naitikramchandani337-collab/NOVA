import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, User, BookOpen, Bot, Palette,
  Lock, Shield, BarChart2, Mail, Trash2,
  Check, AlertCircle, Loader2, Eye, EyeOff,
  Download, RefreshCw, LogOut, Link, Unlink,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import {
  updateEmail, updatePassword, sendEmailVerification,
  linkWithPopup, unlink, reauthenticateWithCredential,
  EmailAuthProvider, deleteUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { getUserSettings, updateUserSettings } from '@/lib/firestoreService';

// ── Shared UI ─────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all ${value ? 'bg-blue-500' : 'bg-white/10'}`}>
      <motion.div animate={{ x: value ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
    </button>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex-1 mr-4">
        <div className="text-white text-sm font-bold uppercase tracking-tight">{label}</div>
        {desc && <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function Section({ title, Icon, children }: { title: string; Icon: React.FC<any>; children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0a1a] border border-white/10 rounded-3xl p-6 mb-6 shadow-2xl">
      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
        <Icon className="w-4 h-4 text-blue-500" /> {title}
      </h3>
      {children}
    </div>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap justify-end">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            value === o ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-zinc-500 hover:bg-white/10'
          }`}>
          {o}
        </button>
      ))}
    </div>
  );
}

const TABS = [
  { id: 'account',    label: 'Account',    Icon: User },
  { id: 'learning',   label: 'Learning',   Icon: BookOpen },
  { id: 'astra',      label: 'ASTRA',      Icon: Bot },
  { id: 'appearance', label: 'Appearance', Icon: Palette },
  { id: 'privacy',    label: 'Privacy',    Icon: Eye },
  { id: 'security',   label: 'Security',   Icon: Shield },
] as const;

type Tab = typeof TABS[number]['id'];

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState<Tab>('account');

  // Firestore Settings state
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Account state
  const [newEmail,    setNewEmail]    = useState('');
  const [emailPass,   setEmailPass]   = useState('');
  const [emailMsg,    setEmailMsg]    = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [showDelete,  setShowDelete]  = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Security state
  const [curPass,  setCurPass]  = useState('');
  const [newPass,  setNewPass]  = useState('');
  const [passMsg,  setPassMsg]  = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const firebaseUser = auth.currentUser;

  useEffect(() => {
    if (user?.uid) {
      getUserSettings(user.uid).then(setSettings);
    }
  }, [user]);

  const updateSetting = async (key: string, value: any) => {
    if (!user?.uid) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setIsSaving(true);
    await updateUserSettings(user.uid, { [key]: value });
    setIsSaving(false);
  };

  const isGoogleLinked = firebaseUser?.providerData.some(p => p.providerId === 'google.com');
  const isEmailLinked  = firebaseUser?.providerData.some(p => p.providerId === 'password');
  const isVerified     = firebaseUser?.emailVerified;

  const handleResendVerification = async () => {
    if (!firebaseUser) return;
    try { await sendEmailVerification(firebaseUser); setEmailMsg('Verification email sent.'); }
    catch { setEmailMsg('Failed to send. Try again.'); }
  };

  const handleChangeEmail = async () => {
    if (!firebaseUser || !newEmail || !emailPass) return;
    setEmailLoading(true);
    try {
      const cred = EmailAuthProvider.credential(firebaseUser.email!, emailPass);
      await reauthenticateWithCredential(firebaseUser, cred);
      await updateEmail(firebaseUser, newEmail);
      setEmailMsg('Email updated. Check your inbox to verify.');
      setNewEmail(''); setEmailPass('');
    } catch (e: any) {
      setEmailMsg(e.code === 'auth/wrong-password' ? 'Wrong password.' : 'Failed to update email.');
    } finally { setEmailLoading(false); }
  };

  const handleLinkGoogle = async () => {
    if (!firebaseUser) return;
    try { await linkWithPopup(firebaseUser, googleProvider); setEmailMsg('Google account linked.'); }
    catch { setEmailMsg('Failed to link Google.'); }
  };

  const handleUnlinkGoogle = async () => {
    if (!firebaseUser) return;
    try { await unlink(firebaseUser, 'google.com'); setEmailMsg('Google account unlinked.'); }
    catch { setEmailMsg('Cannot unlink — you need at least one sign-in method.'); }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE' || !firebaseUser) return;
    setDeleteLoading(true);
    try { await deleteUser(firebaseUser); navigate('/'); }
    catch { setDeleteLoading(false); setEmailMsg('Failed to delete. Please sign out and back in first.'); }
  };

  const handleChangePassword = async () => {
    if (!firebaseUser || !curPass || !newPass) return;
    setPassLoading(true);
    try {
      const cred = EmailAuthProvider.credential(firebaseUser.email!, curPass);
      await reauthenticateWithCredential(firebaseUser, cred);
      await updatePassword(firebaseUser, newPass);
      setPassMsg('Password updated.'); setCurPass(''); setNewPass('');
    } catch (e: any) {
      setPassMsg(e.code === 'auth/wrong-password' ? 'Wrong current password.' : 'Failed to update password.');
    } finally { setPassLoading(false); }
  };

  if (!settings) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center">
      <div className="text-zinc-600 animate-pulse font-black text-xs uppercase tracking-[0.4em]">Configuring Systems...</div>
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
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Settings</h1>
        </div>
        {isSaving && <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Syncing...</div>}
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        {/* Tab bar */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-12 pb-4">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                tab === id ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* ── ACCOUNT ── */}
          {tab === 'account' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {emailMsg && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-tight">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{emailMsg}
                </div>
              )}

              <Section title="Email Control" Icon={Mail}>
                <Row label="Current primary" desc={firebaseUser?.email ?? '—'}>
                  {isVerified
                    ? <span className="text-[10px] font-black text-green-500 flex items-center gap-1 uppercase tracking-widest"><Check className="w-4 h-4" /> Verified</span>
                    : <button onClick={handleResendVerification} className="text-[10px] font-black text-orange-500 hover:text-orange-400 transition-colors uppercase tracking-widest underline decoration-2">Verify Now</button>
                  }
                </Row>
                <div className="mt-8 space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Update Email Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="New email address"
                      className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50" />
                    <input value={emailPass} onChange={e => setEmailPass(e.target.value)} type="password" placeholder="Confirm with password"
                      className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50" />
                  </div>
                  <button onClick={handleChangeEmail} disabled={emailLoading || !newEmail || !emailPass}
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-40">
                    {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </Section>

              <Section title="Identity Providers" Icon={Link}>
                <Row label="Google Sync" desc={isGoogleLinked ? 'System connected' : 'Disconnected'}>
                  {isGoogleLinked
                    ? <button onClick={handleUnlinkGoogle} className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                        Unlink Google
                      </button>
                    : <button onClick={handleLinkGoogle} className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all">
                        Link Google
                      </button>
                  }
                </Row>
              </Section>

              <Section title="Critical Actions" Icon={Trash2}>
                <Row label="Decommission Account" desc="Permanently erase all progress, XP, and rocket data.">
                  <button onClick={() => setShowDelete(true)} className="px-6 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all">
                    Initiate
                  </button>
                </Row>
              </Section>
            </motion.div>
          )}

          {/* ── LEARNING ── */}
          {tab === 'learning' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Section title="Cognitive Sync" Icon={BookOpen}>
                <Row label="ASTRA Interaction" desc="Preferred explanation strategy">
                  <Chips options={['hint', 'explain', 'visualize', 'debug', 'socratic']} value={settings.astraMode} onChange={v => updateSetting('astraMode', v)} />
                </Row>
                <Row label="Difficulty" desc="How ASTRA processes concepts">
                  <Chips options={['beginner', 'intermediate', 'advanced']} value={settings.difficulty || 'beginner'} onChange={v => updateSetting('difficulty', v)} />
                </Row>
                <Row label="Quiz Sensitivity" desc="How strict the evaluations are">
                  <Chips options={['relaxed', 'standard', 'hard']} value={settings.quizAttempts || 'standard'} onChange={v => updateSetting('quizAttempts', v)} />
                </Row>
              </Section>
            </motion.div>
          )}

          {/* ── ASTRA ── */}
          {tab === 'astra' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Section title="ASTRA Neural Core" Icon={Bot}>
                <Row label="Response Detail" desc="Output verbosity level">
                  <Chips options={['brief', 'balanced', 'detailed']} value={settings.astraResponseLen || 'balanced'} onChange={v => updateSetting('astraResponseLen', v)} />
                </Row>
                <Row label="Auto-Suggestions" desc="Predictive follow-up queries">
                  <Toggle value={settings.autoSuggestions} onChange={v => updateSetting('autoSuggestions', v)} />
                </Row>
                <Row label="Stall Detection" desc="AI-triggered mode switching when stuck">
                  <Toggle value={settings.confusionDetect} onChange={v => updateSetting('confusionDetect', v)} />
                </Row>
                <Row label="Milestone Celebration" desc="XP and level-up visual effects">
                  <Toggle value={settings.celebrations} onChange={v => updateSetting('celebrations', v)} />
                </Row>
              </Section>
            </motion.div>
          )}

          {/* ── APPEARANCE ── */}
          {tab === 'appearance' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Section title="Visual Interface" Icon={Palette}>
                <Row label="Interface Theme">
                  <Chips options={['dark', 'amoled', 'deep_space']} value={settings.theme} onChange={v => updateSetting('theme', v)} />
                </Row>
                <Row label="Interface Animations" desc="Disable for maximum performance">
                  <Toggle value={!settings.reduceAnimations} onChange={v => updateSetting('reduceAnimations', !v)} />
                </Row>
              </Section>
            </motion.div>
          )}

          {/* ── PRIVACY ── */}
          {tab === 'privacy' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Section title="Signal Privacy" Icon={Eye}>
                <Row label="Leaderboard Scope">
                  <Chips options={['global', 'friends', 'private']} value={settings.leaderboard || 'global'} onChange={v => updateSetting('leaderboard', v)} />
                </Row>
                <Row label="Broadcast Streak" desc="Visible to others on leaderboard">
                  <Toggle value={settings.showStreak} onChange={v => updateSetting('showStreak', v)} />
                </Row>
                <Row label="Broadcast XP" desc="Visible on your global profile">
                  <Toggle value={settings.showXP} onChange={v => updateSetting('showXP', v)} />
                </Row>
              </Section>
            </motion.div>
          )}

          {/* ── SECURITY ── */}
          {tab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {passMsg && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-tight">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{passMsg}
                </div>
              )}

              <Section title="Access Control" Icon={Lock}>
                <div className="space-y-4 pt-2">
                  <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Rotate Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={curPass} onChange={e => setCurPass(e.target.value)} type="password" placeholder="Current password"
                      className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50" />
                    <input value={newPass} onChange={e => setNewPass(e.target.value)} type="password" placeholder="New password"
                      className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500/50" />
                  </div>
                  <button onClick={handleChangePassword} disabled={passLoading || !curPass || !newPass}
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-500 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-40 shadow-xl shadow-blue-500/20">
                    {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Update Password
                  </button>
                </div>
              </Section>

              <Section title="Session Management" Icon={Shield}>
                <Row label="Active Uplink" desc={`Signed in as ${firebaseUser?.email}`}>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Established
                  </span>
                </Row>
                <Row label="Global Sign Out" desc="Terminate all active connections">
                  <button onClick={() => logout().then(() => navigate('/'))}
                    className="px-6 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all">
                    Sign Out All
                  </button>
                </Row>
              </Section>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {showDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowDelete(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0a0a1a] border border-red-500/30 rounded-[32px] p-10 w-full max-w-md shadow-[0_0_100px_rgba(239,68,68,0.1)]">
              <div className="text-red-500 font-black text-2xl uppercase italic tracking-tighter mb-4">Confirm Termination</div>
              <p className="text-zinc-500 text-sm font-medium mb-8 leading-relaxed">
                This will permanently erase your entire mission history, including all XP credits and rocket construction data.
                Type <span className="text-white font-black italic">DELETE</span> to authorize.
              </p>
              <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="Type DELETE"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm font-bold placeholder-zinc-800 focus:outline-none focus:border-red-500/50 mb-6" />
              <div className="flex gap-4">
                <button onClick={() => setShowDelete(false)} className="flex-1 py-4 rounded-2xl border border-white/10 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Abort</button>
                <button onClick={handleDeleteAccount} disabled={deleteInput !== 'DELETE' || deleteLoading}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Authorize
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
