import { useRef, useEffect, useState, Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { BootSequence } from '@/components/BootSequence';

// ── Moon ─────────────────────────────────────────────────
const MOON_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg';

function MoonMesh() {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useTexture(MOON_URL);
  useFrame(state => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.0005;
    ref.current.rotation.y += 0.04 * (state.mouse.x * 0.08 - ref.current.rotation.y);
    ref.current.rotation.x += 0.04 * (state.mouse.y * 0.08 - ref.current.rotation.x);
  });
  return (
    <Sphere ref={ref} args={[1, 64, 64]}>
      <meshStandardMaterial map={tex} bumpMap={tex} bumpScale={0.05} roughness={0.9} metalness={0.1} />
    </Sphere>
  );
}

function ScrollMoon() {
  const divRef = useRef<HTMLDivElement>(null);
  const sy = useRef(0);
  const raf = useRef<number>(0);
  const cx = useRef(0);
  const cs = useRef(1);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      const e = Math.min(sy.current / 150, 1);
      const sm = e * e * (3 - 2 * e);
      cx.current = lerp(cx.current, sm * 28, 0.065);
      cs.current = lerp(cs.current, 1 - sm * 0.2, 0.065);
      if (divRef.current)
        divRef.current.style.transform = `translate(-50%,-50%) translateX(${cx.current}vw) scale(${cs.current})`;
      raf.current = requestAnimationFrame(tick);
    };
    const onScroll = () => { sy.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <div ref={divRef} className="fixed z-[5] pointer-events-none"
      style={{ top: '50%', left: '50%', width: 500, height: 500, opacity: 0.78, willChange: 'transform' }}>
      <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} style={{ background: 'transparent' }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-5, -2, 2]} intensity={2} color="#4466ff" />
        <Suspense fallback={null}><MoonMesh /></Suspense>
      </Canvas>
    </div>
  );
}

// ── Earth ─────────────────────────────────────────────────
const EARTH_URLS = [
  'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
  'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
  'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
];

function EarthMesh() {
  const ref = useRef<THREE.Mesh>(null);
  const [col, norm, spec] = useTexture(EARTH_URLS);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.04; });
  return (
    <Sphere ref={ref} args={[1, 64, 64]}>
      <meshPhongMaterial map={col} normalMap={norm} specularMap={spec}
        specular={new THREE.Color(0x666666)} shininess={30}
        emissive={new THREE.Color(0x112233)} emissiveIntensity={0.15} />
    </Sphere>
  );
}

function Earth() {
  const divRef = useRef<HTMLDivElement>(null);
  const sy = useRef(0);
  const raf = useRef<number>(0);
  const op = useRef(0);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      op.current = lerp(op.current, Math.min(sy.current / 150, 1) * 0.78, 0.05);
      if (divRef.current) divRef.current.style.opacity = String(op.current);
      raf.current = requestAnimationFrame(tick);
    };
    const onScroll = () => { sy.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <div ref={divRef} className="fixed z-[5] pointer-events-none"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%) translateX(-28vw)', width: 460, height: 460, opacity: 0, willChange: 'opacity' }}>
      <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} style={{ background: 'transparent' }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 5]} intensity={3.0} />
        <directionalLight position={[-3, 2, 3]} intensity={1.2} color="#aaddff" />
        <pointLight position={[0, 5, 4]} intensity={1.5} />
        <Suspense fallback={null}><EarthMesh /></Suspense>
      </Canvas>
    </div>
  );
}

// ── Stars ─────────────────────────────────────────────────
function StarBackground() {
  const [stars] = useState(() => Array.from({ length: 200 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.7 + 0.3, speed: Math.random() * 3 + 2,
  })));
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [s.opacity * 0.4, s.opacity, s.opacity * 0.4] }}
          transition={{ duration: s.speed, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}

// ── Objective Cards ───────────────────────────────────────
const OBJECTIVES = [
  { symbol: '●', title: 'Learn AI From Zero', description: 'No prior experience needed. Start with Python basics and build all the way to cutting-edge AI systems.', details: ['12 structured learning phases', 'Beginner to expert pipeline', 'Hands-on coding in every lesson', 'Real-world project applications'], accentColor: '#f97316', glowColor: 'rgba(249,115,22,0.15)' },
  { symbol: '◑', title: 'Build Your Rocket', description: 'Every phase you complete adds a new component to your personal rocket. Finish all 12 and launch into deep space.', details: ['12 unique rocket parts to unlock', '3D interactive rocket view', 'Full cinematic launch sequence', 'Visual proof of your progress'], accentColor: '#2dd4bf', glowColor: 'rgba(45,212,191,0.15)' },
  { symbol: '✦', title: 'ASTRA AI Companion', description: 'Your personal AI tutor that adapts to how you learn. Five teaching modes that match your style.', details: ['Hint, Explain, Visualize, Debug, Socratic', 'Detects confusion automatically', 'Never gives direct answers on quizzes', 'Celebrates your wins with you'], accentColor: '#818cf8', glowColor: 'rgba(129,140,248,0.15)' },
  { symbol: '⟡', title: 'Earn XP and Level Up', description: 'Gamified progression with experience points, streaks, achievements, and a competitive leaderboard.', details: ['XP for every lesson and quiz', 'Daily streak tracking', 'Achievement badges', 'Friends leaderboard'], accentColor: '#facc15', glowColor: 'rgba(250,204,21,0.15)' },
  { symbol: '◈', title: '12 Expert Phases', description: 'From Python fundamentals to deploying production AI systems. Every phase is a self-contained mission.', details: ['Python ━━ Math ━━ Neural Networks', 'Deep Learning ━━ Computer Vision ━━ PyTorch', 'NLP ━━ Advanced AI ━━ Reinforcement Learning', 'MLOps ━━ Research ━━ Capstone Project'], accentColor: '#ec4899', glowColor: 'rgba(236,72,153,0.15)' },
  { symbol: '⊹', title: 'Community and Friends', description: 'Learn alongside fellow commanders. Add friends, compare progress, and climb the leaderboard together.', details: ['Search and add friends', 'Compare rocket progress', 'Friends-only leaderboard', 'Notifications on milestones'], accentColor: '#38bdf8', glowColor: 'rgba(56,189,248,0.15)' },
];

function ObjectiveCard({ card, index }: { card: typeof OBJECTIVES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const isLeft = index % 2 === 0;
  return (
    <div ref={ref} className={`flex ${isLeft ? 'justify-end pr-4 lg:pr-16' : 'justify-start pl-4 lg:pl-16'} w-full`}>
      <motion.div
        initial={{ opacity: 0, y: 60, x: isLeft ? 80 : -80, scale: 0.92 }}
        animate={visible ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-xl w-full rounded-3xl border p-8"
        style={{ background: 'linear-gradient(135deg,rgba(15,15,25,0.92),rgba(20,20,35,0.96))', borderColor: `${card.accentColor}20`, backdropFilter: 'blur(20px)', transition: 'border-color 0.3s,box-shadow 0.3s' }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = `${card.accentColor}50`; el.style.boxShadow = `0 0 50px ${card.glowColor}`; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = `${card.accentColor}20`; el.style.boxShadow = 'none'; }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-20 rounded-tr-3xl" style={{ background: `radial-gradient(circle at 100% 0%,${card.accentColor}40,transparent 70%)` }} />
        <div className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black" style={{ background: card.accentColor, color: '#000', boxShadow: `0 0 16px ${card.accentColor}60` }}>{index + 1}</div>
        <div className="absolute top-8 left-0 w-1 h-12 rounded-r-full opacity-60" style={{ background: `linear-gradient(to bottom,${card.accentColor},transparent)` }} />
        <div className="text-3xl mb-4" style={{ color: card.accentColor }}>{card.symbol}</div>
        <h3 className="text-2xl font-black text-white mb-3">{card.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{card.description}</p>
        <div className="space-y-3">
          {card.details.map((d, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: card.accentColor }}>▸</span>
              <span className="text-gray-300 text-sm">{d}</span>
            </div>
          ))}
        </div>
        <div className="mt-7 h-px w-full opacity-20" style={{ background: `linear-gradient(to right,transparent,${card.accentColor},transparent)` }} />
      </motion.div>
    </div>
  );
}

// ── Phase Timeline ────────────────────────────────────────
const PHASES = [
  { num: 1, name: 'Python', color: '#f97316' }, { num: 2, name: 'Math', color: '#818cf8' },
  { num: 3, name: 'Neural Nets', color: '#f472b6' }, { num: 4, name: 'Deep Learning', color: '#2dd4bf' },
  { num: 5, name: 'Vision', color: '#facc15' }, { num: 6, name: 'PyTorch', color: '#fb923c' },
  { num: 7, name: 'NLP', color: '#c084fc' }, { num: 8, name: 'Advanced AI', color: '#22d3ee' },
  { num: 9, name: 'RL', color: '#34d399' }, { num: 10, name: 'MLOps', color: '#fb7185' },
  { num: 11, name: 'Research', color: '#a78bfa' }, { num: 12, name: 'Capstone', color: '#5eead4' },
];

function PhaseTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="max-w-5xl mx-auto mt-32 mb-20 px-6">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
        <div className="text-xs text-teal-400 tracking-widest uppercase mb-2">◑ Mission Roadmap</div>
        <h2 className="text-4xl font-black text-white mb-3">12 Phases to Mastery</h2>
        <p className="text-gray-500 max-w-lg mx-auto text-sm">Each phase builds on the last. Complete all 12 to launch your rocket into deep space.</p>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {PHASES.map((p, i) => (
          <motion.div key={p.num} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.06 }}
            className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 transition-all duration-300"
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${p.color}40`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${p.color}15`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}30` }}>{p.num}</div>
              <div><div className="text-white text-sm font-bold">{p.name}</div><div className="text-xs text-gray-600">Phase {p.num}</div></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── CTA ───────────────────────────────────────────────────
function CTASection() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="max-w-2xl mx-auto text-center py-32 px-6">
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={visible ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.6 }}>
        <div className="text-5xl mb-6 text-teal-400">✦</div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Ready For Launch?</h2>
        <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">Join NOVA. Build your rocket. Master AI. Your mission to the stars begins now, Commander.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/register')}
            className="px-10 py-4 rounded-2xl font-bold text-lg text-white shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', boxShadow: '0 0 40px rgba(37,99,235,0.4)' }}>
            ● Begin Mission
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/login')}
            className="px-10 py-4 rounded-2xl font-bold text-lg text-gray-300 bg-gray-900 border border-gray-700 hover:border-gray-500 transition-all">
            ◑ Sign In
          </motion.button>
        </div>
        <div className="mt-8 text-xs text-gray-600">Free to join · No credit card required</div>
      </motion.div>
    </div>
  );
}

// ── Main Landing ──────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [heroVisible, setHeroVisible] = useState(true);
  const [booted, setBooted] = useState(() => !!sessionStorage.getItem('nova_booted'));

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    sessionStorage.setItem('nova_booted', 'true');
  }, []);

  useEffect(() => {
    const fn = () => setHeroVisible(window.scrollY < window.innerHeight * 0.3);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="relative bg-gray-950 min-h-screen overflow-x-hidden">
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: booted ? 1 : 0 }} transition={{ duration: 0.6 }}>
        <StarBackground />
        <ScrollMoon />
        <Earth />

        {/* HERO */}
        <section className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : -40 }} transition={{ duration: 0.4 }} className="text-center max-w-4xl">
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/5 backdrop-blur-sm"
            >
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-xs text-teal-400 tracking-[0.3em] uppercase font-medium">Mission Control Online</span>
            </motion.div>

            {/* Main Title */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }} 
              className="mb-8"
            >
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tighter leading-none" 
                  style={{ 
                    background: 'linear-gradient(to bottom, #ffffff 30%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 80px rgba(59,130,246,0.3)'
                  }}>
                NOVA
              </h1>
              <div className="relative inline-block">
                <span className="block text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300">
                  Master AI. Build Your Rocket. Launch.
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              </div>
            </motion.div>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.8 }} 
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              A gamified space-themed platform that teaches <span className="text-blue-400 font-semibold">Artificial Intelligence</span> from scratch to mastery across <span className="text-teal-400 font-semibold">12 immersive phases</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.1 }} 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(37,99,235,0.6)' }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => navigate('/register')}
                className="group relative px-10 py-4 rounded-2xl font-bold text-lg text-white overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb,#3b82f6)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  Start Mission
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, borderColor: 'rgba(156,163,175,0.5)' }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => navigate('/login')}
                className="px-10 py-4 rounded-2xl font-bold text-lg text-gray-300 bg-gray-900/60 border-2 border-gray-700/50 hover:bg-gray-800/60 backdrop-blur-sm transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-gray-500">◑</span>
                  Sign In
                </span>
              </motion.button>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-16"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Free to join</span>
              </div>
              <div className="w-px h-4 bg-gray-700" />
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>No credit card</span>
              </div>
              <div className="w-px h-4 bg-gray-700" />
              <div className="flex items-center gap-2">
                <span className="text-blue-400">●</span>
                <span>12 AI phases</span>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 2 }} 
              className="mt-8"
            >
              <motion.div 
                animate={{ y: [0, 8, 0] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs text-gray-600 tracking-widest uppercase">Scroll to explore</span>
                <div className="w-px h-10 bg-gradient-to-b from-blue-500/50 via-teal-500/30 to-transparent" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <div className="relative z-20 h-32" />

        <section className="relative z-20 max-w-5xl mx-auto px-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
            <div className="text-xs text-teal-400 tracking-widest uppercase mb-2">✦ Mission Objectives</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">What Is NOVA?</h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">Everything you need to go from complete beginner to AI expert — wrapped in a space mission.</p>
          </motion.div>
        </section>

        <section className="relative z-20 max-w-4xl mx-auto px-6 space-y-16">
          {OBJECTIVES.map((card, i) => <ObjectiveCard key={i} card={card} index={i} />)}
        </section>

        <section className="relative z-20"><PhaseTimeline /></section>

        <section className="relative z-20"><CTASection /></section>

        <section className="relative z-20 border-t border-gray-800/60 py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="NOVA" className="h-6 w-auto" />
            </div>
            <div className="text-gray-700 text-xs">Built for commanders who want to master artificial intelligence</div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

// Settings page is in Settings.tsx
