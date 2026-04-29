import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFirebaseAuth } from '@/context/firebaseAuthContext';
import { motion } from 'framer-motion';
import { Rocket, User, BarChart3, Globe, Medal, Users, Settings, LogOut } from 'lucide-react';

export default function Header() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { isAuthenticated, user, logout } = useFirebaseAuth();

  const navItems = [
    { name: 'Universe',     path: '/universe',     icon: <Globe     className="w-4 h-4" /> },
    { name: 'Rocket',       path: '/rocket',       icon: <Rocket    className="w-4 h-4" /> },
    { name: 'Leaderboard',  path: '/leaderboard',  icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Achievements', path: '/achievements',  icon: <Medal     className="w-4 h-4" /> },
    { name: 'Friends',      path: '/friends',       icon: <Users     className="w-4 h-4" /> },
  ];

  const rightItems = [
    { name: 'Profile',  path: '/profile',  icon: <User     className="w-4 h-4" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <div className="fixed top-6 left-0 right-0 z-[150] px-6 flex justify-center">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-6 px-6 py-3 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl"
      >
        {/* Logo */}
        <div onClick={() => navigate('/universe')} className="flex items-center gap-2 cursor-pointer group">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-black italic tracking-tighter text-white">NOVA</span>
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Main Nav */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                location.pathname === item.path ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}{item.name}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Right Nav */}
        <div className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              {rightItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    location.pathname === item.path ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}{item.name}
                </button>
              ))}
              <button
                onClick={() => logout().then(() => navigate('/'))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all">
                Sign Up
              </button>
            </>
          )}
        </div>
      </motion.nav>
    </div>
  );
}
