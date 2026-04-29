import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface GradientDescentMountainProps {
  onComplete?: () => void;
}

export const GradientDescentMountain: React.FC<GradientDescentMountainProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [learningRate, setLearningRate] = useState(0.01);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create mountain (paraboloid)
    const mountainGeometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];

    for (let x = -5; x <= 5; x += 0.5) {
      for (let z = -5; z <= 5; z += 0.5) {
        const y = (x * x + z * z) * 0.1;
        vertices.push(x, y, z);
      }
    }

    for (let i = 0; i < 20 * 20 - 1; i++) {
      if ((i + 1) % 21 !== 0) {
        indices.push(i, i + 1, i + 21);
        indices.push(i + 1, i + 22, i + 21);
      }
    }

    mountainGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    mountainGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    mountainGeometry.computeVertexNormals();

    const mountainMaterial = new THREE.MeshPhongMaterial({
      color: 0x6b7dff,
      emissive: 0x3a4dff,
      wireframe: false,
    });

    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    scene.add(mountain);

    // Create ball
    const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({
      color: 0xff6b35,
      emissive: 0xff6b35,
    });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0.1, 0);
    ballRef.current = ball;
    scene.add(ball);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animation loop
    let animationId: number;
    let velocity = { x: 0, z: 0 };

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isPlaying && ballRef.current) {
        const x = ballRef.current.position.x;
        const z = ballRef.current.position.z;

        // Calculate gradient
        const gradX = 2 * x * 0.1;
        const gradZ = 2 * z * 0.1;

        // Update velocity with learning rate
        velocity.x -= gradX * learningRate;
        velocity.z -= gradZ * learningRate;

        // Apply friction
        velocity.x *= 0.95;
        velocity.z *= 0.95;

        // Update position
        ballRef.current.position.x += velocity.x;
        ballRef.current.position.z += velocity.z;

        // Update height based on mountain surface
        const newY = (ballRef.current.position.x ** 2 + ballRef.current.position.z ** 2) * 0.1 + 0.3;
        ballRef.current.position.y = newY;

        // Stop if converged
        if (Math.abs(velocity.x) < 0.001 && Math.abs(velocity.z) < 0.001) {
          setIsPlaying(false);
          onComplete?.();
        }

        setBallPosition({ x: ballRef.current.position.x, y: ballRef.current.position.z });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isPlaying, learningRate, onComplete]);

  const handleReset = () => {
    if (ballRef.current) {
      ballRef.current.position.set(0, 0.1, 0);
      setBallPosition({ x: 0, y: 0 });
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div ref={containerRef} className="w-full h-96 rounded-lg overflow-hidden border border-space-800" />

      <div className="space-y-4 bg-space-900 p-4 rounded-lg border border-space-800">
        {/* Learning Rate Slider */}
        <div>
          <label className="block text-sm text-space-300 mb-2">
            Learning Rate: {learningRate.toFixed(3)}
          </label>
          <input
            type="range"
            min="0.001"
            max="0.1"
            step="0.001"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full"
            disabled={isPlaying}
          />
          <p className="text-xs text-space-400 mt-1">
            {learningRate < 0.01 ? 'Slow convergence' : learningRate > 0.05 ? 'Risk of overshooting' : 'Optimal'}
          </p>
        </div>

        {/* Position Display */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-space-800 p-2 rounded">
            <p className="text-space-400">X Position</p>
            <p className="text-rocket-primary font-bold">{ballPosition.x.toFixed(2)}</p>
          </div>
          <div className="bg-space-800 p-2 rounded">
            <p className="text-space-400">Z Position</p>
            <p className="text-rocket-primary font-bold">{ballPosition.y.toFixed(2)}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-rocket-primary hover:bg-rocket-secondary text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </motion.button>
          <motion.button
            onClick={handleReset}
            className="flex-1 py-2 bg-space-800 hover:bg-space-700 text-space-200 rounded-lg font-bold transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RESET
          </motion.button>
        </div>

        {/* Explanation */}
        <div className="text-xs text-space-400 bg-space-800 p-2 rounded">
          <p className="font-bold text-space-300 mb-1">How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ball rolls down the mountain (loss surface)</li>
            <li>Learning rate controls step size</li>
            <li>Too high = overshooting, too low = slow</li>
            <li>Goal: reach the minimum (0, 0)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
