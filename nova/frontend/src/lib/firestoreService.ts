/**
 * firestoreService.ts
 * All Firestore operations — replaces the FastAPI backend for user data.
 * ASTRA AI chat still goes to the backend.
 */

import {
  doc, getDoc, setDoc, updateDoc, collection,
  addDoc, getDocs, query, where, orderBy,
  limit, deleteDoc, serverTimestamp, increment,
  onSnapshot, type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

// ── Types ─────────────────────────────────────────────────
export interface UserProfile {
  uid:          string;
  displayName:  string;
  username:     string;
  email:        string;
  photoURL:     string;
  avatar:       string;
  title:        string;
  bio:          string;
  country:      string;
  rocketName:   string;
  joinedAt:     any;
  lastActive:   any;
  isPublic:     boolean;
}

export interface UserProgress {
  uid:              string;
  username:         string;
  totalXP:          number;
  xp?:              number; // For compatibility with user's schema
  level:            number;
  currentPhase:     number;
  completedPhases:  number[];
  completedLessons: string[];
  streak:           number;
  lastActiveDate:   string;
  rocketParts:      string[]; // Merged from rocket/data unlockedParts
}

export interface UserSettings {
  theme:            string;
  accentColor:      string;
  fontSize:         string;
  reduceAnimations: boolean;
  compactMode:      boolean;
  astraMode:        string;
  astraResponseLen: string;
  autoSuggestions:  boolean;
  confusionDetect:  boolean;
  celebrations:     boolean;
  pace:             string;
  difficulty:       string;
  quizAttempts:     string;
  leaderboard:      string;
  showStreak:       boolean;
  showXP:           boolean;
  allowFriends:     string;
  notifyFriends:    boolean;
  notifyAchieve:    boolean;
  notifyStreak:     boolean;
}

// ── Default values ────────────────────────────────────────
const DEFAULT_PROGRESS: Omit<UserProgress, 'uid'> = {
  username: '',
  totalXP: 0, level: 1, currentPhase: 1,
  completedPhases: [], completedLessons: [],
  streak: 0, lastActiveDate: '', rocketParts: [],
};

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark', accentColor: 'teal', fontSize: 'medium',
  reduceAnimations: false, compactMode: false,
  astraMode: 'explain', astraResponseLen: 'balanced',
  autoSuggestions: true, confusionDetect: true, celebrations: true,
  pace: 'normal', difficulty: 'beginner', quizAttempts: 'standard',
  leaderboard: 'global', showStreak: true, showXP: true,
  allowFriends: 'everyone', notifyFriends: true,
  notifyAchieve: true, notifyStreak: true,
};

// ── User Profile ──────────────────────────────────────────
export async function createUserProfile(uid: string, data: { displayName: string; email: string; photoURL?: string }) {
  // This is now mostly handled in firebaseAuthContext.tsx via createUserDocuments
  // But we'll keep a minimal version here for compatibility if needed.
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  
  if (!snap.exists()) {
    const timestamp = serverTimestamp();
    await setDoc(userRef, {
      uid,
      displayName: data.displayName,
      username: data.displayName,
      email: data.email,
      photoURL: data.photoURL || '',
      joinedAt: timestamp,
      xp: 0, level: 1, streak: 0, currentPhase: 1,
    });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'profile', 'data'));
  if (snap.exists()) {
    return { uid, ...snap.data() } as UserProfile;
  }
  // Fallback to top-level if profile/data missing
  const topSnap = await getDoc(doc(db, 'users', uid));
  return topSnap.exists() ? (topSnap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid, 'profile', 'data'), { ...data, lastActive: serverTimestamp() });
  // Also update top-level if username changed
  if (data.username || data.displayName) {
    await updateDoc(doc(db, 'users', uid), { 
      username: data.username || data.displayName,
      displayName: data.displayName || data.username 
    });
  }
}

// ── Progress ──────────────────────────────────────────────
export async function getUserProgress(uid: string): Promise<UserProgress> {
  const progressSnap = await getDoc(doc(db, 'users', uid, 'progress', 'data'));
  const rocketSnap   = await getDoc(doc(db, 'users', uid, 'rocket', 'data'));
  
  const progressData = progressSnap.exists() ? progressSnap.data() : DEFAULT_PROGRESS;
  const rocketData   = rocketSnap.exists() ? rocketSnap.data() : { unlockedParts: [] };

  return {
    uid,
    username: progressData.username || '',
    totalXP: progressData.xp || progressData.totalXP || 0,
    xp: progressData.xp || 0,
    level: progressData.level || 1,
    streak: progressData.streak || 0,
    currentPhase: progressData.currentPhase || 1,
    completedPhases: progressData.completedPhases || [],
    completedLessons: progressData.completedLessons || [],
    lastActiveDate: progressData.lastActiveDate || '',
    rocketParts: rocketData.unlockedParts || progressData.rocketParts || [],
  } as UserProgress;
}

export function subscribeToProgress(uid: string, cb: (p: UserProgress) => void): Unsubscribe {
  // Simple version: just listen to progress/data
  return onSnapshot(doc(db, 'users', uid, 'progress', 'data'), async snap => {
    if (snap.exists()) {
      const p = await getUserProgress(uid);
      cb(p);
    }
  });
}

export async function addXP(uid: string, amount: number) {
  const ref = doc(db, 'users', uid, 'progress', 'data');
  const topRef = doc(db, 'users', uid);
  await updateDoc(ref, { xp: increment(amount) });
  await updateDoc(topRef, { xp: increment(amount) });
  
  // Recalculate level
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const xp = snap.data().xp || 0;
    const newLevel = Math.floor(xp / 500) + 1;
    await updateDoc(ref, { level: newLevel });
    await updateDoc(topRef, { level: newLevel });
  }
}

export async function completeLesson(uid: string, lessonId: string, xpReward: number) {
  const ref = doc(db, 'users', uid, 'progress', 'data');
  const topRef = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const completed = data.completedLessons || [];
  if (completed.includes(lessonId)) return;
  await updateDoc(ref, {
    completedLessons: [...completed, lessonId],
    xp: increment(xpReward),
  });
  await updateDoc(topRef, { xp: increment(xpReward) });
}

export async function completePhase(uid: string, phaseId: number, partName: string) {
  const ref = doc(db, 'users', uid, 'progress', 'data');
  const topRef = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const phases = data.completedPhases || [];
  if (phases.includes(phaseId)) return;
  
  await updateDoc(ref, {
    completedPhases: [...phases, phaseId],
    currentPhase:    phaseId + 1,
    xp:         increment(200),
  });
  await updateDoc(topRef, { 
    currentPhase: phaseId + 1,
    xp: increment(200) 
  });

  // Update rocket document
  const rocketRef = doc(db, 'users', uid, 'rocket', 'data');
  const rocketSnap = await getDoc(rocketRef);
  if (rocketSnap.exists()) {
    const rocketData = rocketSnap.data();
    await updateDoc(rocketRef, {
      unlockedParts: [...(rocketData.unlockedParts || []), partName],
      currentPhase: phaseId + 1
    });
  }

  // Log activity
  await addDoc(collection(db, 'activities'), {
    uid, type: 'phase_complete',
    title: `Completed Phase ${phaseId}`,
    description: `Unlocked ${partName}`,
    xpEarned: 200, phase: phaseId,
    createdAt: serverTimestamp(),
  });
}

export async function updateStreak(uid: string) {
  const ref = doc(db, 'users', uid, 'progress', 'data');
  const topRef = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const today = new Date().toDateString();
  const last  = data.lastActiveDate;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (last === today) return; // already updated today
  const newStreak = last === yesterday ? (data.streak || 0) + 1 : 1;
  await updateDoc(ref, { streak: newStreak, lastActiveDate: today });
  await updateDoc(topRef, { streak: newStreak });
}

// ── Settings ──────────────────────────────────────────────
export async function getUserSettings(uid: string): Promise<UserSettings> {
  const snap = await getDoc(doc(db, 'users', uid, 'settings', 'data'));
  if (!snap.exists()) {
    await setDoc(doc(db, 'users', uid, 'settings', 'data'), DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...snap.data() } as UserSettings;
}

export async function updateUserSettings(uid: string, data: Partial<UserSettings>) {
  const ref = doc(db, 'users', uid, 'settings', 'data');
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { ...DEFAULT_SETTINGS, ...data });
  } else {
    await updateDoc(ref, data);
  }
}

// ── Friends ───────────────────────────────────────────────
export async function sendFriendRequest(fromUid: string, toUid: string) {
  await addDoc(collection(db, 'friendRequests'), {
    from: fromUid, to: toUid,
    status: 'pending', createdAt: serverTimestamp(),
  });
}

export async function acceptFriendRequest(requestId: string, uid1: string, uid2: string) {
  await updateDoc(doc(db, 'friendRequests', requestId), { status: 'accepted' });
  // Add to both users' friends subcollection
  await setDoc(doc(db, 'friends', `${uid1}_${uid2}`), {
    users: [uid1, uid2], since: serverTimestamp(),
  });
}

export async function getFriends(uid: string) {
  const q = query(collection(db, 'friends'), where('users', 'array-contains', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

export async function getFriendRequests(uid: string) {
  const q = query(collection(db, 'friendRequests'), where('to', '==', uid), where('status', '==', 'pending'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function searchUsers(searchQuery: string) {
  // Firestore doesn't support full-text search natively
  // This searches by displayName prefix
  const q = query(
    collection(db, 'users'),
    where('displayName', '>=', searchQuery),
    where('displayName', '<=', searchQuery + '\uf8ff'),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as UserProfile);
}

// ── Leaderboard ───────────────────────────────────────────
export async function getLeaderboard(limitCount = 50) {
  const q = query(
    collection(db, 'users'), // Now using top-level users collection
    orderBy('xp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({ rank: i + 1, ...d.data(), totalXP: d.data().xp || 0 }));
}

// ── Activity Feed ─────────────────────────────────────────
export async function getFriendsActivity(friendUids: string[]) {
  if (!friendUids.length) return [];
  const q = query(
    collection(db, 'activities'),
    where('uid', 'in', friendUids.slice(0, 10)),
    orderBy('createdAt', 'desc'),
    limit(30)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Capstone ──────────────────────────────────────────────
export async function getCapstoneProgress(uid: string) {
  const snap = await getDoc(doc(db, 'capstone', uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateCapstoneProgress(uid: string, data: object) {
  const ref = doc(db, 'capstone', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { uid, ...data, startedAt: serverTimestamp() });
  } else {
    await updateDoc(ref, data);
  }
}

// ── Notifications ─────────────────────────────────────────
export async function getNotifications(uid: string) {
  const q = query(
    collection(db, 'notifications'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function markNotificationRead(notifId: string) {
  await updateDoc(doc(db, 'notifications', notifId), { read: true });
}
