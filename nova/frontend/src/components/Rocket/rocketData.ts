import { RocketPartType } from '@/types';

export interface RocketPart {
  id: RocketPartType;
  name: string;
  phase: number;
  description: string;
  topic: string;
  xpReward: number;
  color: string;
  glowColor: string;
  position: [number, number, number];
  scale: [number, number, number];
  shape: 'cylinder' | 'cone' | 'box' | 'sphere' | 'torus';
  astraMessage: string;
}

export interface RocketState {
  totalParts: number;
  unlockedParts: number;
  currentPhase: number;
  isLaunched: boolean;
  launchDate?: string;
  parts: RocketPartState[];
}

export interface RocketPartState {
  phase: number;
  isUnlocked: boolean;
  isCurrent: boolean;
  unlockedAt?: string;
}

export const ROCKET_PARTS: RocketPart[] = [
  {
    id: 'body', name: 'Main Fuselage', phase: 1,
    description: 'The core structural frame of the NOVA rocket.',
    topic: 'Python Programming', xpReward: 100,
    color: '#d4d8e0', glowColor: '#f97316',
    position: [0, -1, 0], scale: [1, 2, 1], shape: 'cylinder',
    astraMessage: '● Fuselage online. Python mastery confirmed. Structural integrity is go.',
  },
  {
    id: 'fuel_tank', name: 'Fuel Reservoirs', phase: 2,
    description: 'Advanced storage for mathematical energy.',
    topic: 'Linear Algebra', xpReward: 100,
    color: '#bcc3cf', glowColor: '#818cf8',
    position: [0, -3, 0], scale: [1.4, 0.8, 1.4], shape: 'cylinder',
    astraMessage: '◑ Fuel tanks pressurized. Linear algebra vectors computing thrust.',
  },
  {
    id: 'engine', name: 'Ion Engine', phase: 3,
    description: 'The neural propulsion system for deep space travel.',
    topic: 'Neural Networks', xpReward: 100,
    color: '#a8b0be', glowColor: '#f472b6',
    position: [0, -4.5, 0], scale: [0.6, 0.8, 0.6], shape: 'cone',
    astraMessage: '✦ Ion Engine firing. Neural networks controlling ion flow.',
  },
  {
    id: 'guidance_system', name: 'Guidance Array', phase: 4,
    description: 'Deep learning sensors for autonomous navigation.',
    topic: 'Deep Learning', xpReward: 100,
    color: '#c8cdd6', glowColor: '#2dd4bf',
    position: [0, 0, 0], scale: [1.1, 0.2, 1.1], shape: 'cylinder',
    astraMessage: '● Guidance array active. Deep learning models locked on target.',
  },
  {
    id: 'brain_core', name: 'AI Brain Core', phase: 5,
    description: 'The central processing unit of the ASTRA AI.',
    topic: 'Computer Vision', xpReward: 100,
    color: '#e0e4ea', glowColor: '#facc15',
    position: [0, 1.5, 0], scale: [0.5, 0.5, 0.5], shape: 'sphere',
    astraMessage: '◑ Brain core online. Vision sensors streaming data.',
  },
  {
    id: 'navigation_system', name: 'Nav Array', phase: 6,
    description: 'Tensor-based navigation for precise maneuvers.',
    topic: 'PyTorch', xpReward: 100,
    color: '#cfd4dc', glowColor: '#fb923c',
    position: [1.2, 0.5, 0], scale: [0.3, 0.3, 0.3], shape: 'sphere',
    astraMessage: '✦ Nav Array synchronized. PyTorch tensors computing course.',
  },
  {
    id: 'consciousness', name: 'Consciousness Link', phase: 7,
    description: 'NLP module for human-AI interaction.',
    topic: 'NLP', xpReward: 100,
    color: '#b8bfcc', glowColor: '#c084fc',
    position: [-1.2, 0.5, 0], scale: [0.3, 0.3, 0.3], shape: 'sphere',
    astraMessage: '● Consciousness link established. NLP models interpreting intent.',
  },
  {
    id: 'payload', name: 'Payload Module', phase: 8,
    description: 'Carries advanced generative AI research.',
    topic: 'Advanced AI', xpReward: 100,
    color: '#d0d5dd', glowColor: '#22d3ee',
    position: [0, 2.5, 0], scale: [0.8, 1.0, 0.8], shape: 'cylinder',
    astraMessage: '◑ Payload secured. Generative models ready for deployment.',
  },
  {
    id: 'boosters', name: 'RL Boosters', phase: 9,
    description: 'Adaptive boosters that learn from environment.',
    topic: 'Reinforcement Learning', xpReward: 100,
    color: '#adb5c2', glowColor: '#34d399',
    position: [0, -2, 1.5], scale: [0.5, 1.5, 0.5], shape: 'cylinder',
    astraMessage: '✦ RL Boosters primed. Policy gradients optimizing thrust.',
  },
  {
    id: 'full_assembly', name: 'Control Rig', phase: 10,
    description: 'MLOps systems for platform stability.',
    topic: 'MLOps', xpReward: 100,
    color: '#c4c9d3', glowColor: '#fb7185',
    position: [0, 3.5, 0], scale: [0.6, 0.4, 0.6], shape: 'cylinder',
    astraMessage: '● MLOps control rig active. Production systems stabilized.',
  },
  {
    id: 'power_systems', name: 'Power Cell', phase: 11,
    description: 'High-energy research power supply.',
    topic: 'Research', xpReward: 100,
    color: '#bac1cc', glowColor: '#a78bfa',
    position: [0, 0.5, 1.2], scale: [0.2, 0.8, 0.2], shape: 'box',
    astraMessage: '◑ Power cell charged. Research data streaming.',
  },
  {
    id: 'vision_sensors', name: 'Nose Cone', phase: 12,
    description: 'Final assembly. Mission complete.',
    topic: 'Capstone', xpReward: 500,
    color: '#e8ecf2', glowColor: '#5eead4',
    position: [0, 4.2, 0], scale: [0.6, 1.0, 0.6], shape: 'cone',
    astraMessage: '✦ MISSION COMPLETE. ROCKET READY FOR LAUNCH.',
  },
];
