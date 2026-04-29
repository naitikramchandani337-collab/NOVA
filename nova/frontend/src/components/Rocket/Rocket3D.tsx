import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { ROCKET_PARTS, type RocketPart, type RocketState } from './rocketData';
import { RocketPartMesh } from './RocketParts';
import { StarField } from './StarField';
import { EngineFireParticles } from './RocketParticles';

interface RocketAssemblyProps {
  rocketState: RocketState;
  newlyUnlocked: number | null;
  onPartClick: (part: RocketPart) => void;
  onPartHover: (part: RocketPart | null) => void;
  launching: boolean;
}

function RocketAssembly({ rocketState, newlyUnlocked, onPartClick, onPartHover, launching }: RocketAssemblyProps) {
  const groupRef  = useRef<THREE.Group>(null);
  const launchRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (launching) {
      launchRef.current += delta * 0.8;
      groupRef.current.position.y = launchRef.current * 4;
      groupRef.current.rotation.y += delta * 0.5;
    } else {
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.15;
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {ROCKET_PARTS.map(part => {
        const partState       = rocketState.parts.find(p => p.phase === part.phase);
        const isUnlocked      = partState?.isUnlocked ?? false;
        const isCurrent       = partState?.isCurrent  ?? false;
        const isNewlyUnlocked = newlyUnlocked === part.phase;
        return (
          <RocketPartMesh
            key={part.id}
            part={part}
            isUnlocked={isUnlocked}
            isCurrent={isCurrent}
            isNewlyUnlocked={isNewlyUnlocked}
            onClick={onPartClick}
            onHover={onPartHover}
            launchProgress={launchRef.current}
          />
        );
      })}
      <EngineFireParticles active={rocketState.parts[0]?.isUnlocked ?? false} launching={launching} />
      <pointLight color="#f97316" intensity={launching ? 12 : 3} distance={12} position={[0, -4, 0]} />
    </group>
  );
}

interface Rocket3DProps {
  rocketState: RocketState;
  newlyUnlocked: number | null;
  onPartClick: (part: RocketPart) => void;
  onPartHover: (part: RocketPart | null) => void;
  launching?: boolean;
  interactive?: boolean;
  mini?: boolean;
}

export function Rocket3D({
  rocketState, newlyUnlocked, onPartClick, onPartHover,
  launching = false, interactive = true, mini = false,
}: Rocket3DProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      <PerspectiveCamera makeDefault position={mini ? [0, 0, 14] : [4, 2, 16]} fov={mini ? 32 : 42} />

      {/* Soft white ambient */}
      <ambientLight intensity={0.6} color="#e8edf5" />
      {/* Main key light */}
      <directionalLight position={[8, 12, 8]} intensity={2.5} castShadow color="#ffffff" shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      {/* Teal fill from left */}
      <directionalLight position={[-6, 4, 6]} intensity={1.2} color="#67e8f9" />
      {/* Purple rim from back */}
      <directionalLight position={[0, 3, -8]} intensity={1.0} color="#c4b5fd" />
      {/* Bottom fill */}
      <pointLight position={[0, -6, 4]} intensity={0.8} color="#94a3b8" distance={20} />
      {/* Warm side accent */}
      <pointLight position={[6, 0, 3]} intensity={0.6} color="#fbbf24" distance={15} />
      {/* Cool side accent */}
      <pointLight position={[-6, 0, -3]} intensity={0.5} color="#38bdf8" distance={15} />
      {/* Top spotlight */}
      <spotLight position={[0, 15, 0]} angle={0.4} penumbra={0.5} intensity={1.5} color="#ffffff" castShadow />

      <Suspense fallback={null}>
        {/* HDR environment for metallic reflections */}
        <Environment preset="night" />
        <StarField count={mini ? 300 : 800} launching={launching} />
        <RocketAssembly
          rocketState={rocketState}
          newlyUnlocked={newlyUnlocked}
          onPartClick={onPartClick}
          onPartHover={onPartHover}
          launching={launching}
        />
      </Suspense>

      {interactive && !launching && (
        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={28}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.85}
          enableDamping
          dampingFactor={0.05}
        />
      )}
    </Canvas>
  );
}
