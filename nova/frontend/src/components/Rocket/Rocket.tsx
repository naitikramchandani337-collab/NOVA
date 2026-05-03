import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRocketStore } from '@/store/rocketStore';
import { useProgressStore } from '@/store/progressStore';
import { PHASES } from '@/config/phases';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Float, PerspectiveCamera, Environment, Sparkles } from '@react-three/drei';

function RocketPart({ part, index }: { part: any; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !part.unlocked) return;
    // Base floating motion is handled by <Float />
  });

  // Different geometry based on part ID for a "premium" feel
  const geometry = useMemo(() => {
    switch (part.id) {
      case 'body': return <cylinderGeometry args={[0.5, 0.5, 3, 32]} />;
      case 'fuel_tank': return <cylinderGeometry args={[0.6, 0.6, 1.5, 32]} />;
      case 'engine': return <coneGeometry args={[0.7, 1, 32]} />;
      case 'brain_core': return <sphereGeometry args={[0.4, 32, 32]} />;
      case 'power_systems': return <torusGeometry args={[0.8, 0.05, 16, 100]} />;
      case 'navigation_system': return <boxGeometry args={[0.2, 1, 0.2]} />;
      case 'consciousness': return <octahedronGeometry args={[0.5]} />;
      case 'payload': return <boxGeometry args={[0.8, 0.8, 0.8]} />;
      case 'boosters': return <cylinderGeometry args={[0.2, 0.2, 1, 16]} />;
      default: return <cylinderGeometry args={[0.5, 0.5, 1, 16]} />;
    }
  }, [part.id]);

  if (!part.unlocked) return null;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={part.position}
        scale={1}
      >
        {geometry}
        <meshStandardMaterial
          color={part.color}
          emissive={part.color}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

function RocketScene() {
  const parts = useRocketStore(state => state.parts);
  const completedCount = useProgressStore(state => state.completedPhases.length);
  const totalPhases = PHASES.length;
  
  // Rocket "climbs" based on progress
  const climbOffset = (completedCount / totalPhases) * 4;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#3b82f6" />
      
      <group position={[0, -2 + climbOffset, 0]}>
        {parts.map((part, index) => (
          <RocketPart key={part.id} part={part} index={index} />
        ))}
      </group>
      
      <Sparkles count={50} scale={10} size={1} speed={0.4} opacity={0.2} />
    </>
  );
}

export default function Rocket() {
  const completionPercentage = useRocketStore(
    state => state.getCompletionPercentage()
  );
  const isLaunching = useRocketStore(state => state.isLaunching);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[400px] pointer-events-none z-40 overflow-hidden">
      <Canvas gl={{ alpha: true }} shadows>
        <AnimatePresence>
            {!isLaunching && <RocketScene />}
        </AnimatePresence>
        <Environment preset="city" />
      </Canvas>

      {/* Progress HUD */}
      <div className="absolute bottom-12 right-12 text-right">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">System Integrity</span>
            <div className="text-3xl font-black text-white italic">{Math.round(completionPercentage)}%</div>
          </motion.div>
      </div>
    </div>
  );
}
