import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, User, BookOpen, Bot, Palette,
  Lock, Shield, BarChart2, Mail, Trash2,
  Check, AlertCircle, Loader2, Eye, EyeOff,
  Download, RefreshCw, LogOut, Link, Unlink,
} from 'lucide-react';
import { useFirebaseAuth } from '@/context/firebaseAuthContext';
import {
  updateEmail, updatePassword, sendEmailVerification,
  linkWithPopup, unlink, reauthenticateWithCredential,
  EmailAuthProvider, deleteUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// ── Shared UI ─────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all ${value ? 'bg-cyan-500' : 'bg-white/10'}`}>
      <motion.div animate={{ x: value ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
    </button>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
      <div className="flex-1 mr-4">
        <div className="text-white text-sm font-medium">{label}</div>
        {desc && <div className="text-zinc-500 text-xs mt-0.5">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function Section({ title, Icon, children }: { title: string; Icon: React.FC<any>; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-4">
      <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h3>
      {children}
    </div>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap justify-end">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
            value === o ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-zinc-500 border border-transparent hover:border-white/10'
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
  { id: 'progress',   label: 'Progress',   Icon: BarChart2 },
] as const;

type Tab = typeof TABS[number]['id'];

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useFirebaseAuth();
  const [tab, setTab] = useState<Tab>('account');

  // Account state
  const [newEmail,    setNewEmail]    = useState('');
  const [emailPass,   setEmailPass]   = useState('');
  const [emailMsg,    setEmailMsg]    = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [showDelete,  setShowDelete]  = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Learning state
  const [astraMode,   setAstraMode]   = useState('explain');
  const [pace,        setPace]        = useState('normal');
  const [difficulty,  setDifficulty]  = useState('beginner');
  const [quizAttempts, setQuizAttempts] = useState('standard');

  // ASTRA state
  const [responseLen,  setResponseLen]  = useState('balanced');
  const [autoSuggest,  setAutoSuggest]  = useState(true);
  const [confusionDet, setConfusionDet] = useState(true);
  const [celebrations, setCelebrations] = useState(true);

  // Appearance state
  const [accentColor,  setAccentColor]  = useState('teal');
  const [fontSize,     setFontSize]     = useState('medium');
  const [reduceAnim,   setReduceAnim]   = useState(false);
  const [compactMode,  setCompactMode]  = useState(false);
  const [rocketWidget, setRocketWidget] = useState(true);

  // Privacy state
  const [leaderboard,  setLeaderboard]  = useState('global');
  const [showStreak,   setShowStreak]   = useState(true);
  const [showXP,       setShowXP]       = useState(true);
  const [allowFriends, setAllowFriends] = useState('everyone');

  // Security state
  const [curPass,  setCurPass]  = useState('');
  const [newPass,  setNewPass]  = useState('');
  const [passMsg,  setPassMsg]  = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const isGoogleLinked = user?.providerData.some(p => p.providerId === 'google.com');
  const isEmailLinked  = user?.providerData.some(p => p.providerId === 'password');
  const isVerified     = user?.emailVerified;

  const handleResendVerification = async () => {
    if (!user) return;
    try { await sendEmailVerification(user); setEmailMsg('Verification email sent.'); }
    catch { setEmailMsg('Failed to send. Try again.'); }
  };

  const handleChangeEmail = async () => {
    if (!user || !newEmail || !emailPass) return;
    setEmailLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email!, emailPass);
      await reauthenticateWithCredential(user, cred);
      await updateEmail(user, newEmail);
      setEmailMsg('Email updated. Check your inbox to verify.');
      setNewEmail(''); setEmailPass('');
    } catch (e: any) {
      setEmailMsg(e.code === 'auth/wrong-password' ? 'Wrong password.' : 'Failed to update email.');
    } finally { setEmailLoading(false); }
  };

  const handleLinkGoogle = async () => {
    try { await linkWithPopup(user!, googleProvider); setEmailMsg('Google account linked.'); }
    catch { setEmailMsg('Failed to link Google.'); }
  };

  const handleUnlinkGoogle = async () => {
    try { await unlink(user!, 'google.com'); setEmailMsg('Google account unlinked.'); }
    catch { setEmailMsg('Cannot unlink — you need at least one sign-in method.'); }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE' || !user) return;
    setDeleteLoading(true);
    try { await deleteUser(user); navigate('/'); }
    catch { setDeleteLoading(false); setEmailMsg('Failed to delete. Please sign out and back in first.'); }
  };

  const handleChangePassword = async () => {
    if (!user || !curPass || !newPass) return;
    setPassLoading(true);
    try {
      const cred = EmailAuthProvider.credential(user.email!, curPass);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPass);
      setPassMsg('Password updated.'); setCurPass(''); setNewPass('');
    } catch (e: any) {
      setPassMsg(e.code === 'auth/wrong-password' ? 'Wrong current password.' : 'Failed to update password.');
    } finally { setPassLoading(false); }
  };

  const passStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = passStrength(newPass);
  const strengthColor = ['', '#ef4444', '#f97316', '#facc15', '#22c55e'][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  const ACCENT_COLORS = [
    { id: 'teal',   hex: '#2dd4bf' }, { id: 'orange', hex: '#f97316' },
    { id: 'purple', hex: '#a78bfa' }, { id: 'blue',   hex: '#3b82f6' },
  ];

  // Fake XP chart data
  const xpData = [120, 340, 80, 520, 200, 450, 310];
  const days   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxXP  = Math.max(...xpData);

  return (
    <div className="min-h-screen bg-[#050510] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black text-white">Settings</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                tab === id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>

        {/* ── ACCOUNT ── */}
        {tab === 'account' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {emailMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{emailMsg}
              </div>
            )}

            <Section title="Email" Icon={Mail}>
              <Row label="Current email" desc={user?.email ?? '—'}>
                {isVerified
                  ? <span className="text-xs text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Verified</span>
                  : <button onClick={handleResendVerification} className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors">Resend verification</button>
                }
              </Row>
              <div className="pt-3 space-y-2">
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Change email</div>
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="New email address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50" />
                <input value={emailPass} onChange={e => setEmailPass(e.target.value)} type="password" placeholder="Current password to confirm"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50" />
                <button onClick={handleChangeEmail} disabled={emailLoading || !newEmail || !emailPass}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium hover:bg-cyan-500/30 transition-all disabled:opacity-40">
                  {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Update Email
                </button>
              </div>
            </Section>

            <Section title="Connected Accounts" Icon={Link}>
              <Row label="Google" desc={isGoogleLinked ? 'Connected' : 'Not connected'}>
                {isGoogleLinked
                  ? <button onClick={handleUnlinkGoogle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-all">
                      <Unlink className="w-3.5 h-3.5" /> Unlink
                    </button>
                  : <button onClick={handleLinkGoogle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs hover:bg-white/10 transition-all">
                      <Link className="w-3.5 h-3.5" /> Link Google
                    </button>
                }
              </Row>
              <Row label="Email / Password" desc={isEmailLinked ? 'Set up' : 'Not set up'}>
                <span className={`text-xs ${isEmailLinked ? 'text-green-400' : 'text-zinc-500'}`}>
                  {isEmailLinked ? '● Active' : '○ None'}
                </span>
              </Row>
            </Section>

            <Section title="Danger Zone" Icon={Trash2}>
              <Row label="Delete Account" desc="Permanently delete all your data. Cannot be undone.">
                <button onClick={() => setShowDelete(true)} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-all">
                  Delete
                </button>
              </Row>
            </Section>

            {/* Delete modal */}
            <AnimatePresence>
              {showDelete && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                  onClick={() => setShowDelete(false)}>
                  <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-[#0a0a1a] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm">
                    <div className="text-red-400 font-black text-lg mb-2">Delete Account</div>
                    <p className="text-zinc-400 text-sm mb-4">This will permanently delete your account, all XP, progress, and friends. Type <span className="text-white font-bold">DELETE</span> to confirm.</p>
                    <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="Type DELETE"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-red-500/50 mb-3" />
                    <div className="flex gap-2">
                      <button onClick={() => setShowDelete(false)} className="flex-1 py-2 rounded-xl border border-white/10 text-zinc-400 text-sm hover:bg-white/5 transition-all">Cancel</button>
                      <button onClick={handleDeleteAccount} disabled={deleteInput !== 'DELETE' || deleteLoading}
                        className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                        {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Delete Forever
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── LEARNING ── */}
        {tab === 'learning' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Section title="How NOVA Teaches You" Icon={BookOpen}>
              <Row label="Default ASTRA Mode" desc="Which mode ASTRA starts in">
                <Chips options={['hint', 'explain', 'visualize', 'debug', 'socratic']} value={astraMode} onChange={setAstraMode} />
              </Row>
              <Row label="Learning Pace" desc="How often NOVA reminds you">
                <Chips options={['relaxed', 'normal', 'intense']} value={pace} onChange={setPace} />
              </Row>
              <Row label="Difficulty" desc="How ASTRA explains concepts">
                <Chips options={['beginner', 'intermediate', 'advanced']} value={difficulty} onChange={setDifficulty} />
              </Row>
              <Row label="Quiz Attempts" desc="How many tries per quiz">
                <Chips options={['easy', 'standard', 'hard']} value={quizAttempts} onChange={setQuizAttempts} />
              </Row>
            </Section>
          </motion.div>
        )}

        {/* ── ASTRA ── */}
        {tab === 'astra' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Section title="Customize Your AI Companion" Icon={Bot}>
              <Row label="Response Length" desc="How detailed ASTRA's answers are">
                <Chips options={['brief', 'balanced', 'detailed']} value={responseLen} onChange={setResponseLen} />
              </Row>
              <Row label="Auto Suggestions" desc="Show suggested follow-up questions">
                <Toggle value={autoSuggest} onChange={setAutoSuggest} />
              </Row>
              <Row label="Confusion Detection" desc="ASTRA auto-switches modes when you're stuck">
                <Toggle value={confusionDet} onChange={setConfusionDet} />
              </Row>
              <Row label="Celebrations" desc="XP animations and milestone messages">
                <Toggle value={celebrations} onChange={setCelebrations} />
              </Row>
              <Row label="Reset ASTRA Memory" desc="Clear conversation history and weak topic tracking">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs hover:bg-white/10 transition-all">
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              </Row>
            </Section>
          </motion.div>
        )}

        {/* ── APPEARANCE ── */}
        {tab === 'appearance' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Section title="How NOVA Looks" Icon={Palette}>
              <Row label="Accent Color">
                <div className="flex gap-2">
                  {ACCENT_COLORS.map(({ id, hex }) => (
                    <button key={id} onClick={() => setAccentColor(id)}
                      className="w-6 h-6 rounded-full border-2 transition-all"
                      style={{ backgroundColor: hex, borderColor: accentColor === id ? 'white' : 'transparent' }} />
                  ))}
                </div>
              </Row>
              <Row label="Font Size">
                <Chips options={['small', 'medium', 'large']} value={fontSize} onChange={setFontSize} />
              </Row>
              <Row label="Reduce Animations" desc="Better performance on slower devices">
                <Toggle value={reduceAnim} onChange={setReduceAnim} />
              </Row>
              <Row label="Compact Mode" desc="Smaller spacing, more content visible">
                <Toggle value={compactMode} onChange={setCompactMode} />
              </Row>
              <Row label="Rocket Widget" desc="Show rocket on dashboard">
                <Toggle value={rocketWidget} onChange={setRocketWidget} />
              </Row>
            </Section>
          </motion.div>
        )}

        {/* ── PRIVACY ── */}
        {tab === 'privacy' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Section title="What Others Can See" Icon={Eye}>
              <Row label="Leaderboard Visibility">
                <Chips options={['global', 'friends', 'hidden']} value={leaderboard} onChange={setLeaderboard} />
              </Row>
              <Row label="Show Streak on Profile">
                <Toggle value={showStreak} onChange={setShowStreak} />
              </Row>
              <Row label="Show XP on Profile">
                <Toggle value={showXP} onChange={setShowXP} />
              </Row>
              <Row label="Allow Friend Requests">
                <Chips options={['everyone', 'nobody']} value={allowFriends} onChange={setAllowFriends} />
              </Row>
            </Section>
          </motion.div>
        )}

        {/* ── SECURITY ── */}
        {tab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {passMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{passMsg}
              </div>
            )}

            <Section title="Change Password" Icon={Lock}>
              <div className="space-y-2 pt-1">
                <input value={curPass} onChange={e => setCurPass(e.target.value)} type="password" placeholder="Current password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50" />
                <input value={newPass} onChange={e => setNewPass(e.target.value)} type="password" placeholder="New password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50" />
                {newPass && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all"
                          style={{ backgroundColor: i <= strength ? strengthColor : 'rgba(255,255,255,0.1)' }} />
                      ))}
                    </div>
                    <div className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</div>
                  </div>
                )}
                <button onClick={handleChangePassword} disabled={passLoading || !curPass || !newPass}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium hover:bg-cyan-500/30 transition-all disabled:opacity-40">
                  {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Update Password
                </button>
              </div>
            </Section>

            <Section title="Sessions" Icon={Shield}>
              <Row label="Current Session" desc={`Signed in as ${user?.email}`}>
                <span className="text-xs text-green-400">● Active</span>
              </Row>
              <Row label="Sign Out All Devices" desc="Revokes all active sessions">
                <button onClick={() => logout().then(() => navigate('/'))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-all">
                  <LogOut className="w-3.5 h-3.5" /> Sign Out All
                </button>
              </Row>
            </Section>
          </motion.div>
        )}

        {/* ── PROGRESS ── */}
        {tab === 'progress' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Section title="XP This Week" Icon={BarChart2}>
              <div className="flex items-end gap-2 h-24 mt-2">
                {xpData.map((xp, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(xp / maxXP) * 80}px` }}
                      transition={{ delay: i * 0.06, duration: 0.5 }}
                      className="w-full rounded-t-lg"
                      style={{ background: 'linear-gradient(to top,#2dd4bf,#818cf8)' }}
                    />
                    <span className="text-[9px] text-zinc-600">{days[i]}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-zinc-500 mt-2 text-right">
                Total this week: {xpData.reduce((a, b) => a + b, 0).toLocaleString()} XP
              </div>
            </Section>

            <Section title="Data" Icon={Download}>
              <Row label="Export All Data" desc="Download your XP history, quiz scores, and progress as JSON">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs hover:bg-white/10 transition-all">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </Row>
              <Row label="Completion Certificate" desc="Available when Phase 12 is complete">
                <button disabled className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-600 text-xs opacity-40 cursor-not-allowed">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </Row>
            </Section>

            <Section title="Reset" Icon={RefreshCw}>
              <Row label="Reset All Progress" desc="Nuclear option — deletes all XP, phases, and rocket parts">
                <button className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-all">
                  Reset
                </button>
              </Row>
            </Section>
          </motion.div>
        )}
      </div>
    </div>
  );
}

