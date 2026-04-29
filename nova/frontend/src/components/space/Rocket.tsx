import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Cone, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function EngineFire() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const pos = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 1] = -Math.random() * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime();
      pointsRef.current.position.y = -1.2 + Math.sin(time * 20) * 0.05;
      pointsRef.current.scale.setScalar(1 + Math.sin(time * 10) * 0.2);
    }
  });

  return (
    <Points ref={pointsRef} positions={particles} stride={3}>
      <PointMaterial
        transparent
        color="#ff6600"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Rocket() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation on Y axis
      groupRef.current.rotation.y += 0.01;
      // Slight floating motion
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
    }
  });

  return (
    <group ref={groupRef} scale={0.5}>
      {/* Main Body */}
      <Cylinder args={[0.4, 0.4, 2, 32]}>
        <meshStandardMaterial color="#cccccc" metalness={1} roughness={0.2} />
      </Cylinder>
      
      {/* Nose Cone */}
      <Cone args={[0.4, 1, 32]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#ee0000" metalness={0.8} roughness={0.3} />
      </Cone>
      
      {/* Fins */}
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          <mesh position={[0.5, -0.7, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.1, 0.6, 0.4]} />
            <meshStandardMaterial color="#ee0000" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Engine Base Ring */}
      <Cylinder args={[0.45, 0.45, 0.1, 32]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#333333" metalness={1} roughness={0.1} />
      </Cylinder>

      {/* Engine Glow */}
      <pointLight position={[0, -1.2, 0]} intensity={2} color="#00ffff" />
      <EngineFire />
      
      {/* Pulsing Engine Halo */}
      <mesh position={[0, -1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
