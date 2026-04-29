import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RocketPart } from './rocketData';
import { RocketParticles } from './RocketParticles';

interface RocketPartMeshProps {
  part: RocketPart;
  isUnlocked: boolean;
  isCurrent: boolean;
  isNewlyUnlocked: boolean;
  onClick: (part: RocketPart) => void;
  onHover: (part: RocketPart | null) => void;
  launchProgress: number;
}

export function RocketPartMesh({
  part, isUnlocked, isCurrent, isNewlyUnlocked,
  onClick, onHover, launchProgress,
}: RocketPartMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    if (isNewlyUnlocked) {
      meshRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.008) * 0.08);
    } else if (isCurrent) {
      meshRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.004) * 0.03);
    } else {
      meshRef.current.scale.setScalar(hovered ? 1.06 : 1.0);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = isUnlocked ? 0.12 + Math.sin(Date.now() * 0.003) * 0.06 : 0;
    }
  });

  const getGeometry = () => {
    switch (part.shape) {
      case 'cone':   return <coneGeometry args={[part.scale[0], part.scale[1] * 1.5, 24]} />;
      case 'sphere': return <sphereGeometry args={[part.scale[0], 24, 24]} />;
      case 'box':    return <boxGeometry args={[part.scale[0], part.scale[1], part.scale[2]]} />;
      default:       return <cylinderGeometry args={[part.scale[0] * 0.5, part.scale[0] * 0.5, part.scale[1], 32]} />;
    }
  };

  const getColor           = () => isNewlyUnlocked ? '#f0f0f0' : isUnlocked ? '#c0c8d4' : '#2a2d35';
  const getEmissiveColor   = () => isNewlyUnlocked ? part.glowColor : isCurrent ? part.glowColor : isUnlocked && hovered ? part.glowColor : isUnlocked ? '#8899aa' : '#000000';
  const getEmissiveIntensity = () => isNewlyUnlocked ? 0.6 : isCurrent ? 0.35 : hovered && isUnlocked ? 0.3 : isUnlocked ? 0.08 : 0;
  const getOpacity         = () => isUnlocked ? 1 : 0.35;
  const getRoughness       = () => isUnlocked ? 0.15 : 0.7;
  const getMetalness       = () => isUnlocked ? 0.95 : 0.3;

  return (
    <group position={part.position}>
      {/* Outer glow sphere */}
      {isUnlocked && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[Math.max(...part.scale) * 1.4, 16, 16]} />
          <meshBasicMaterial color={part.glowColor} transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {/* Main part mesh */}
      <mesh
        ref={meshRef}
        onClick={() => isUnlocked && onClick(part)}
        onPointerEnter={() => { setHovered(true); onHover(part); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setHovered(false); onHover(null); document.body.style.cursor = 'default'; }}
        castShadow receiveShadow
      >
        {getGeometry()}
        <meshStandardMaterial
          color={getColor()}
          emissive={getEmissiveColor()}
          emissiveIntensity={getEmissiveIntensity()}
          transparent={!isUnlocked}
          opacity={getOpacity()}
          roughness={getRoughness()}
          metalness={getMetalness()}
          envMapIntensity={isUnlocked ? 1.5 : 0.2}
        />
      </mesh>

      {/* Orange accent rings on unlocked cylinders */}
      {isUnlocked && part.shape === 'cylinder' && (
        <>
          <mesh position={[0, part.scale[1] * 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[part.scale[0] * 0.52, 0.025, 8, 32]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, -part.scale[1] * 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[part.scale[0] * 0.52, 0.025, 8, 32]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
          </mesh>
        </>
      )}

      {/* Teal accent for cone/sphere */}
      {isUnlocked && (part.shape === 'cone' || part.shape === 'sphere') && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[part.scale[0] * 0.6, 0.02, 8, 32]} />
          <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
        </mesh>
      )}

      {/* Particles on newly unlocked */}
      <RocketParticles position={[0, 0, 0]} color={part.glowColor} active={isNewlyUnlocked} />

      {/* Current phase pulsing ring */}
      {isCurrent && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Math.max(...part.scale) * 0.9, 0.04, 8, 32]} />
          <meshBasicMaterial color={part.glowColor} transparent opacity={0.7} />
        </mesh>
      )}

      {/* Locked indicator ring */}
      {!isUnlocked && !isCurrent && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Math.max(...part.scale) * 0.6, 0.015, 8, 32]} />
          <meshBasicMaterial color="#374151" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
