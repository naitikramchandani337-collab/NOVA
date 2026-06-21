// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useEffect, Suspense } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { FirebaseAuthProvider, useFirebaseAuth } from '@/context/firebaseAuthContext';
import SpaceBackground from '@/components/space/SpaceBackground';
import XPBar from '@/components/ui/XPBar';
import Header from '@/components/Navigation/Header';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Universe from '@/pages/Universe';
import Phase from '@/pages/Phase';
import Leaderboard from '@/pages/Leaderboard';
import Achievements from '@/pages/Achievements';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Friends from '@/pages/Friends';
import RocketPage from '@/pages/RocketPage';
import Phase12Page from '@/pages/Phase12Page';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AstraProvider, useAstra } from '@/components/Astra/AstraContext';
import AstraAvatar from '@/components/Astra/AstraAvatar';
import { ProgressProvider } from '@/context/progressContext';

function AstraContextManagerInner() {
  const location = useLocation();
  const { phaseId } = useParams();
  const { setContext } = useAstra();

  useEffect(() => {
    if (location.pathname.startsWith('/phase/') && phaseId) {
      setContext(Number(phaseId), undefined);
    } else {
      setContext(undefined, undefined);
    }
  }, [location.pathname, phaseId, setContext]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <AstraContextManagerInner />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/universe" element={<ProtectedRoute><Universe /></ProtectedRoute>} />
        <Route path="/phase/12" element={<ProtectedRoute><Phase12Page /></ProtectedRoute>} />
        <Route path="/phase/:phaseId" element={<ProtectedRoute><Phase /></ProtectedRoute>} />
        <Route path="/leaderboard"    element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/achievements"   element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
        <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings"       element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/friends"        element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/rocket"         element={<ProtectedRoute><RocketPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function AppInner() {
  const { user } = useFirebaseAuth();
  const { loadFromFirestore, updateStreak } = useProgressStore();

  useEffect(() => {
    if (user) {
      loadFromFirestore(user.uid);
      updateStreak();
    }
  }, [user?.uid]);

  // Keepalive ping for ASTRA (Render free tier wakes up)
  useEffect(() => {
    const ping = () => {
      import('@/lib/astraClient').then(({ pingAstra }) => pingAstra());
    };
    ping();
    const interval = setInterval(ping, 10 * 60 * 1000); // 10 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-space-black text-white font-space">
      <Suspense fallback={null}>
        <SpaceBackground />
      </Suspense>
      <Header />
      <XPBar />
      <main className="relative z-10 pt-20">
        <AppRoutes />
      </main>
      <AstraAvatar />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FirebaseAuthProvider>
        <ProgressProvider>
          <AstraProvider>
            <AppInner />
          </AstraProvider>
        </ProgressProvider>
      </FirebaseAuthProvider>
    </BrowserRouter>
  );
}
