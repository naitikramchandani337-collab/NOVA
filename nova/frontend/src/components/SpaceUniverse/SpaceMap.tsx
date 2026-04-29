import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Phase } from '@types/index';

interface SpaceMapProps {
  phases: Phase[];
  onPhaseClick: (phaseId: number) => void;
}

export const SpaceMap: React.FC<SpaceMapProps> = ({ phases, onPhaseClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x0a0e27, 1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02 });
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      starsVertices.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starsVertices), 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Add planets for each phase
    phases.forEach((phase, index) => {
      const angle = (index / phases.length) * Math.PI * 2;
      const radius = 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const geometry = new THREE.SphereGeometry(0.3, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: phase.completed ? 0x4ade80 : 0x6b7dff,
        emissive: phase.completed ? 0x22c55e : 0x3a4dff,
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(x, y, 0);
      planet.userData = { phaseId: phase.id };
      scene.add(planet);
    });

    // Add lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate stars
      stars.rotation.x += 0.0001;
      stars.rotation.y += 0.0001;

      // Rotate planets
      scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.phaseId) {
          child.rotation.x += 0.005;
          child.rotation.y += 0.005;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Handle clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object instanceof THREE.Mesh && intersects[i].object.userData.phaseId) {
          onPhaseClick(intersects[i].object.userData.phaseId);
          break;
        }
      }
    };
    containerRef.current.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('click', handleClick);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [phases, onPhaseClick]);

  return <div ref={containerRef} className="w-full h-full" />;
};
