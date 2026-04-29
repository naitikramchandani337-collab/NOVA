import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RocketParticlesProps {
  position: [number, number, number];
  color: string;
  active: boolean;
  launching?: boolean;
}

export function RocketParticles({ position, color, active, launching = false }: RocketParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);
  const count   = launching ? 200 : 30;

  const { positions, velocities } = useMemo(() => {
    const positions  = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = Math.random() * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3]     = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = -(Math.random() * 0.05 + 0.01);
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return { positions, velocities };
  }, [count]);

  const posRef = useRef(positions.slice());

  useFrame(() => {
    if (!meshRef.current || !active) return;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3]     += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      if (pos[i * 3 + 1] < -2) {
        pos[i * 3]     = (Math.random() - 0.5) * 0.5;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={posRef.current} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={launching ? 0.15 : 0.08} color={color} transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

export function EngineFireParticles({ active, launching }: { active: boolean; launching: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const count   = 150;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 0.8;
      arr[i * 3 + 1] = -Math.random() * 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return arr;
  }, []);

  const posRef = useRef(positions.slice());

  const speeds = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = Math.random() * 0.08 + 0.02;
    return arr;
  }, []);

  useFrame(() => {
    if (!meshRef.current || !active) return;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i] * (launching ? 3 : 1);
      if (pos[i * 3 + 1] < (launching ? -6 : -3)) {
        pos[i * 3]     = (Math.random() - 0.5) * 0.8;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={meshRef} position={[0, -3.8, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={posRef.current} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={launching ? 0.2 : 0.12} color={launching ? '#ffffff' : '#f97316'} transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}
