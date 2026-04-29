import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
  count?: number;
  speed?: number;
  launching?: boolean;
}

export function StarField({ count = 800, speed = 0.0005, launching = false }: StarFieldProps) {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      sizes[i] = Math.random() * 2 + 0.5;
    }
    return { positions, sizes };
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    const s = launching ? speed * 80 : speed;
    meshRef.current.rotation.y += s;
    meshRef.current.rotation.x += s * 0.3;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-size"     array={sizes}     count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#ffffff" transparent opacity={launching ? 1 : 0.8} sizeAttenuation />
    </points>
  );
}
