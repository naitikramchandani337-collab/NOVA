import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// --- Types ---
interface NodeData {
  id: string;
  position: THREE.Vector3;
  scatterPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  layer: number;
}

interface ConnectionData {
  id: string;
  startNode: NodeData;
  endNode: NodeData;
}

// --- Royal Color Palette ---
const COLORS = {
  idle: '#0E1626',      // Firefly
  active: '#6495ED',    // Cornflower
  firing: '#8DAAD9',    // Polo Blue
  connection: '#414C6B', // East Bay
  signal: '#6495ED',    // Cornflower
  error: '#ef4444',     // Danger
  ripple: '#5A87A1'     // Horizon
};

const LAYERS = [4, 6, 6, 4];

// --- Sub-components ---

function Signal({ start, end, onComplete }: { start: THREE.Vector3, end: THREE.Vector3, onComplete: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = (state.clock.getElapsedTime() * 0.7) % 1; // Slightly slower for 'royal' feel
      meshRef.current.position.lerpVectors(start, end, t);
      if (t > 0.98) onComplete();
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color={COLORS.firing} />
    </mesh>
  );
}

function Connection({ start, end, weight = 1, isBackprop = false }: { start: THREE.Vector3, end: THREE.Vector3, weight?: number, isBackprop?: boolean }) {
  return (
    <Line
      points={[start, end]}
      color={isBackprop ? COLORS.error : COLORS.active}
      lineWidth={weight * 0.3}
      transparent
      opacity={0.15}
    />
  );
}

function NeuralNode({ data, mode, isHighlighted }: { data: NodeData, mode: 'scatter' | 'organized', isHighlighted: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;
    const target = mode === 'organized' ? data.targetPos : data.scatterPos;
    gsap.to(meshRef.current.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 2.5,
      ease: "power3.inOut"
    });
  }, [mode, data]);

  useFrame((state) => {
    if (glowRef.current) {
      const scale = isHighlighted ? 1.8 : 1.2;
      glowRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={data.scatterPos} ref={meshRef as any}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={isHighlighted ? COLORS.firing : COLORS.active} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color={COLORS.active} transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

function Network({ scrollPos }: { scrollPos: number }) {
  const [mode, setMode] = useState<'scatter' | 'organized'>('scatter');
  const [activeSignals, setActiveSignals] = useState<any[]>([]);

  const nodes = useMemo(() => {
    const n: NodeData[] = [];
    LAYERS.forEach((count, layerIndex) => {
      for (let i = 0; i < count; i++) {
        n.push({
          id: `node-${layerIndex}-${i}`,
          layer: layerIndex,
          scatterPos: new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10),
          targetPos: new THREE.Vector3(
            (layerIndex - (LAYERS.length - 1) / 2) * 6,
            (i - (count - 1) / 2) * 3,
            0
          ),
          position: new THREE.Vector3()
        });
      }
    });
    return n;
  }, []);

  const connections = useMemo(() => {
    const c: ConnectionData[] = [];
    for (let l = 0; l < LAYERS.length - 1; l++) {
      const layerNodes = nodes.filter(n => n.layer === l);
      const nextLayerNodes = nodes.filter(n => n.layer === l + 1);
      layerNodes.forEach(start => {
        nextLayerNodes.forEach(end => {
          c.push({ id: `${start.id}-${end.id}`, startNode: start, endNode: end });
        });
      });
    }
    return c;
  }, [nodes]);

  useEffect(() => {
    const timer = setTimeout(() => setMode('organized'), 2000);
    const interval = setInterval(() => {
      if (mode === 'organized') {
        const startNodes = nodes.filter(n => n.layer === 0);
        const randomStart = startNodes[Math.floor(Math.random() * startNodes.length)];
        const nextLayer = nodes.filter(n => n.layer === 1);
        const randomEnd = nextLayer[Math.floor(Math.random() * nextLayer.length)];
        setActiveSignals(prev => [...prev, { id: Math.random().toString(), start: randomStart.targetPos, end: randomEnd.targetPos }]);
      }
    }, 1500);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [mode, nodes]);

  const isBackprop = scrollPos > 0.6;

  return (
    <group>
      {connections.map(conn => (
        <Connection 
          key={conn.id} 
          start={mode === 'organized' ? conn.startNode.targetPos : conn.startNode.scatterPos} 
          end={mode === 'organized' ? conn.endNode.targetPos : conn.endNode.scatterPos} 
          isBackprop={isBackprop}
        />
      ))}
      {nodes.map(node => (
        <NeuralNode key={node.id} data={node} mode={mode} isHighlighted={false} />
      ))}
      {activeSignals.map(sig => (
        <Signal 
          key={sig.id} 
          start={sig.start} 
          end={sig.end} 
          onComplete={() => setActiveSignals(prev => prev.filter(s => s.id !== sig.id))} 
        />
      ))}
    </group>
  );
}

function Rig() {
  useFrame((state) => {
    state.camera.position.x += (state.mouse.x * 2 - state.camera.position.x) * 0.05;
    state.camera.position.y += (-state.mouse.y * 2 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function NeuralNetworkScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="fixed inset-0 z-0 bg-[#0E1626]">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <fogExp2 attach="fog" args={['#0E1626', 0.015]} />
        <Network scrollPos={scrollProgress} />
        <Rig />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] opacity-80" />
    </div>
  );
}
