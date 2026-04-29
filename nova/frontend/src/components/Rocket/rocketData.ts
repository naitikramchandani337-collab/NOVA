export interface RocketPart {
  id: number;
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
    id: 1, name: 'Engine Core', phase: 1,
    description: 'The heart of the rocket. Powers every system aboard.',
    topic: 'Python Programming', xpReward: 100,
    color: '#d4d8e0', glowColor: '#f97316',
    position: [0, -3.2, 0], scale: [0.9, 0.6, 0.9], shape: 'cylinder',
    astraMessage: '● Engine Core online. Python mastery confirmed. Propulsion systems are go, Commander.',
  },
  {
    id: 2, name: 'Fuel Tanks', phase: 2,
    description: 'Twin fuel tanks providing mathematical precision to thrust.',
    topic: 'Linear Algebra', xpReward: 100,
    color: '#bcc3cf', glowColor: '#818cf8',
    position: [0, -2.4, 0], scale: [1.4, 0.8, 1.4], shape: 'cylinder',
    astraMessage: '◑ Fuel tanks pressurized. Linear algebra vectors computing thrust. Mathematics confirmed.',
  },
  {
    id: 3, name: 'Thrust Nozzles', phase: 3,
    description: 'Neural pathways that direct force into forward momentum.',
    topic: 'Neural Networks', xpReward: 100,
    color: '#a8b0be', glowColor: '#f472b6',
    position: [0, -4.0, 0], scale: [0.6, 0.5, 0.6], shape: 'cone',
    astraMessage: '✦ Thrust nozzles calibrated. Neural networks firing in sequence. Backpropagation confirmed.',
  },
  {
    id: 4, name: 'Lower Hull', phase: 4,
    description: 'Deep structural frame. Built to withstand intense pressure.',
    topic: 'Deep Learning', xpReward: 100,
    color: '#c8cdd6', glowColor: '#2dd4bf',
    position: [0, -1.5, 0], scale: [1.2, 1.0, 1.2], shape: 'cylinder',
    astraMessage: '● Lower hull secured. Deep learning layers structurally sound. Hull integrity at 100 percent.',
  },
  {
    id: 5, name: 'Sensor Array', phase: 5,
    description: 'Eyes of the rocket. Detects and interprets all visual data.',
    topic: 'Computer Vision', xpReward: 100,
    color: '#e0e4ea', glowColor: '#facc15',
    position: [1.2, -1.0, 0], scale: [0.3, 0.3, 0.3], shape: 'sphere',
    astraMessage: '◑ Sensor array online. Computer vision systems detecting all objects. Visual processing confirmed.',
  },
  {
    id: 6, name: 'Middle Hull', phase: 6,
    description: 'Core processing chamber. Where tensors flow.',
    topic: 'PyTorch', xpReward: 100,
    color: '#cfd4dc', glowColor: '#fb923c',
    position: [0, -0.4, 0], scale: [1.1, 1.2, 1.1], shape: 'cylinder',
    astraMessage: '✦ Middle hull assembled. PyTorch tensors flowing through processing core. Autograd active.',
  },
  {
    id: 7, name: 'Communication Dish', phase: 7,
    description: 'Interprets all language signals across the galaxy.',
    topic: 'NLP', xpReward: 100,
    color: '#b8bfcc', glowColor: '#c084fc',
    position: [-1.2, 0.2, 0], scale: [0.4, 0.1, 0.4], shape: 'cylinder',
    astraMessage: '● Communication dish deployed. NLP transformers decoding all transmissions. Language models go.',
  },
  {
    id: 8, name: 'Upper Hull', phase: 8,
    description: 'Advanced architecture housing generative systems.',
    topic: 'Advanced AI', xpReward: 100,
    color: '#d0d5dd', glowColor: '#22d3ee',
    position: [0, 0.9, 0], scale: [0.95, 1.0, 0.95], shape: 'cylinder',
    astraMessage: '◑ Upper hull integrated. GAN and VAE architectures operational. Generative systems confirmed.',
  },
  {
    id: 9, name: 'Guidance Fins', phase: 9,
    description: 'Adaptive fins that learn optimal flight paths.',
    topic: 'Reinforcement Learning', xpReward: 100,
    color: '#adb5c2', glowColor: '#34d399',
    position: [0, -1.8, 0], scale: [2.0, 0.1, 0.3], shape: 'box',
    astraMessage: '✦ Guidance fins extended. Reinforcement learning computing optimal trajectory. Q-learning confirmed.',
  },
  {
    id: 10, name: 'Control Module', phase: 10,
    description: 'Deploys, monitors, and controls all systems from orbit.',
    topic: 'MLOps', xpReward: 100,
    color: '#c4c9d3', glowColor: '#fb7185',
    position: [0, 2.0, 0], scale: [0.8, 0.6, 0.8], shape: 'cylinder',
    astraMessage: '● Control module online. MLOps pipelines deployed. CI/CD monitoring active. All systems go.',
  },
  {
    id: 11, name: 'Payload Bay', phase: 11,
    description: 'Carries the research that will change the world.',
    topic: 'Research', xpReward: 100,
    color: '#bac1cc', glowColor: '#a78bfa',
    position: [0, 2.8, 0], scale: [0.7, 0.6, 0.7], shape: 'cylinder',
    astraMessage: '◑ Payload bay sealed. Research data secured. Scientific mission payload confirmed aboard.',
  },
  {
    id: 12, name: 'Nose Cone', phase: 12,
    description: 'The tip that pierces deep space. Mission complete.',
    topic: 'Capstone', xpReward: 500,
    color: '#e8ecf2', glowColor: '#5eead4',
    position: [0, 3.8, 0], scale: [0.7, 1.2, 0.7], shape: 'cone',
    astraMessage: '✦ NOSE CONE LOCKED. ROCKET ASSEMBLY COMPLETE. INITIATING LAUNCH SEQUENCE, COMMANDER.',
  },
];
