import React, { useRef, useMemo, useEffect, Component } from 'react';

// Error boundary to catch WebGL/Three.js crashes silently
class ThreeErrorBoundary extends Component<
  { children: React.ReactNode },
  { crashed: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { crashed: false };
  }
  static getDerivedStateFromError() {
    return { crashed: true };
  }
  render() {
    if (this.state.crashed) {
      return <div className="w-full h-full bg-black" />;
    }
    return this.props.children;
  }
}
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, useTexture, Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Constants
const MOON_TEXTURE_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg';

const FresnelShader = {
  uniforms: {
    c: { value: 0.3 },
    p: { value: 4.5 },
    glowColor: { value: new THREE.Color(0x4466ff) },
    viewVector: { value: new THREE.Vector3() },
    atmoPulse: { value: 1.0 }
  },
  vertexShader: `
    varying float intensity;
    void main() {
      vec3 vNormal = normalize(normalMatrix * normal);
      vec3 vNormel = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
      intensity = pow(0.3 - dot(vNormal, vNormel), 4.5);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    uniform float atmoPulse;
    varying float intensity;
    void main() {
      vec3 glow = glowColor * intensity * atmoPulse;
      gl_FragColor = vec4(glow, 1.0);
    }
  `
};

function CinematicMoon() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const moonTexture = useTexture(MOON_TEXTURE_URL);

  useEffect(() => {
    if (!groupRef.current) return;

    // --- Cinematic Timeline ---
    const tl = gsap.timeline();
    
    // Initial State: Moon below screen, dark
    gsap.set(groupRef.current.position, { y: -12, z: 2 });
    gsap.set(groupRef.current.rotation, { x: 0.5 });

    // Sequence
    tl.to(groupRef.current.position, {
      y: -3, // Rises to bottom-ish part of screen
      z: 0,
      duration: 6,
      ease: "power3.out",
      delay: 1
    })
    .to(groupRef.current.rotation, {
      x: 0,
      duration: 7,
      ease: "power2.inOut"
    }, "<");

  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      // Very slow rotation
      meshRef.current.rotation.y += 0.0005;
      
      // Interactive Parallax (Mouse Influence)
      const targetX = state.mouse.x * 0.1;
      const targetY = state.mouse.y * 0.1;
      meshRef.current.rotation.y += 0.05 * (targetX - meshRef.current.rotation.y);
      meshRef.current.rotation.x += 0.05 * (targetY - meshRef.current.rotation.x);
    }
    
    if (glowRef.current) {
      // Face camera
      glowRef.current.lookAt(state.camera.position);
      // Pulse glow
      const material = glowRef.current.material as THREE.ShaderMaterial;
      material.uniforms.atmoPulse.value = 0.8 + Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere ref={meshRef} args={[3.5, 64, 64]}>
        <meshStandardMaterial 
          map={moonTexture}
          bumpMap={moonTexture}
          bumpScale={0.05}
          roughness={0.9} 
          metalness={0.1} 
        />
      </Sphere>
      
      <Sphere ref={glowRef} args={[3.8, 64, 64]}>
        <shaderMaterial
          attach="material"
          {...FresnelShader}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
        />
      </Sphere>
    </group>
  );
}

function Debris() {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      // Faster parallax for foreground debris
      ref.current.position.y = -state.mouse.y * 0.5;
      ref.current.position.x = -state.mouse.x * 0.5;
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#88aaff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

function StarLayer() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      // Slow background parallax
      ref.current.position.y = -state.mouse.y * 0.1;
      ref.current.position.x = -state.mouse.x * 0.1;
    }
  });

  return (
    <group ref={ref}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

export default function MoonScene() {
  return (
    <ThreeErrorBoundary>
      <div className="w-full h-full min-h-screen bg-black">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <color attach="background" args={['#000000']} />
          <fogExp2 attach="fog" args={['#000000', 0.001]} />
          
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-5, -2, 2]} intensity={2} color="#4466ff" />
          
          <StarLayer />
          
          <React.Suspense fallback={null}>
            <CinematicMoon />
          </React.Suspense>
          
          <Debris />
        </Canvas>
      </div>
    </ThreeErrorBoundary>
  );
}
