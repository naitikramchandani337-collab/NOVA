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
  email:        string;
  photoURL:     string;
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
  totalXP:          number;
  level:            number;
  currentPhase:     number;
  completedPhases:  number[];
  completedLessons: string[];
  streak:           number;
  lastActiveDate:   string;
  rocketParts:      string[];
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
export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      displayName: data.displayName || 'Commander',
      email:       data.email || '',
      photoURL:    data.photoURL || '',
      title:       'Space Cadet',
      bio:         '',
      country:     '',
      rocketName:  'Nova-1',
      joinedAt:    serverTimestamp(),
      lastActive:  serverTimestamp(),
      isPublic:    true,
    });
    // Create progress doc
    await setDoc(doc(db, 'progress', uid), { uid, ...DEFAULT_PROGRESS });
    // Create settings doc
    await setDoc(doc(db, 'settings', uid), DEFAULT_SETTINGS);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), { ...data, lastActive: serverTimestamp() });
}

// ── Progress ──────────────────────────────────────────────
export async function getUserProgress(uid: string): Promise<UserProgress> {
  const snap = await getDoc(doc(db, 'progress', uid));
  if (!snap.exists()) {
    const def = { uid, ...DEFAULT_PROGRESS };
    await setDoc(doc(db, 'progress', uid), def);
    return def;
  }
  return snap.data() as UserProgress;
}

export function subscribeToProgress(uid: string, cb: (p: UserProgress) => void): Unsubscribe {
  return onSnapshot(doc(db, 'progress', uid), snap => {
    if (snap.exists()) cb(snap.data() as UserProgress);
  });
}

export async function addXP(uid: string, amount: number) {
  const ref = doc(db, 'progress', uid);
  await updateDoc(ref, { totalXP: increment(amount) });
  // Recalculate level
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const xp = snap.data().totalXP;
    const newLevel = Math.floor(xp / 500) + 1;
    await updateDoc(ref, { level: newLevel });
  }
}

export async function completeLesson(uid: string, lessonId: string, xpReward: number) {
  const ref = doc(db, 'progress', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const completed = data.completedLessons || [];
  if (completed.includes(lessonId)) return;
  await updateDoc(ref, {
    completedLessons: [...completed, lessonId],
    totalXP: increment(xpReward),
  });
}

export async function completePhase(uid: string, phaseId: number, partName: string) {
  const ref = doc(db, 'progress', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const phases = data.completedPhases || [];
  const parts  = data.rocketParts || [];
  if (phases.includes(phaseId)) return;
  await updateDoc(ref, {
    completedPhases: [...phases, phaseId],
    rocketParts:     [...parts, partName],
    currentPhase:    phaseId + 1,
    totalXP:         increment(200),
  });
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
  const ref = doc(db, 'progress', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const today = new Date().toDateString();
  const last  = data.lastActiveDate;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (last === today) return; // already updated today
  const newStreak = last === yesterday ? (data.streak || 0) + 1 : 1;
  await updateDoc(ref, { streak: newStreak, lastActiveDate: today });
}

// ── Settings ──────────────────────────────────────────────
export async function getUserSettings(uid: string): Promise<UserSettings> {
  const snap = await getDoc(doc(db, 'settings', uid));
  if (!snap.exists()) {
    await setDoc(doc(db, 'settings', uid), DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...snap.data() } as UserSettings;
}

export async function updateUserSettings(uid: string, data: Partial<UserSettings>) {
  const ref = doc(db, 'settings', uid);
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
    collection(db, 'progress'),
    orderBy('totalXP', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({ rank: i + 1, ...d.data() }));
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
