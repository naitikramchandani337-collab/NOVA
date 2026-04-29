// src/types/index.ts

export interface Phase {
  id: number;
  name: string;
  title: string;
  description: string;
  environment: 'earth' | 'atmosphere' | 'orbit' | 'moon' | 'space' | 'galaxy';
  color: string;
  position: number; // Y position in universe
  rocketPart: RocketPartType;
  lessons: Lesson[];
  unlockXP: number;
}

export interface PracticeExercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Resource {
  title: string;
  url: string;
}

export interface Lesson {
  id: string;
  phaseId: number;
  title: string;
  description: string;
  content: string;
  codeExample?: string;
  visualization?: VisualizationType;
  xpReward: number;
  estimatedMinutes: number;
  practiceExercises?: PracticeExercise[];
  quiz?: QuizQuestion[];
  resources?: Resource[];
  keyTakeaways?: string[];
  realWorldConnections?: string[];
}

export type RocketPartType =
  | 'body'
  | 'fuel_tank'
  | 'engine'
  | 'guidance_system'
  | 'brain_core'
  | 'power_systems'
  | 'vision_sensors'
  | 'memory_units'
  | 'ai_consciousness'
  | 'advanced_systems'
  | 'production_engine'
  | 'launch_systems';

export interface RocketPart {
  id: RocketPartType;
  name: string;
  unlocked: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
}

export type VisualizationType =
  | 'gradient_descent'
  | 'neural_network'
  | 'loss_curve'
  | 'attention'
  | 'tensor'
  | 'cnn_vision';

export interface UserProgress {
  userId: string;
  currentPhase: number;
  completedPhases: number[];
  completedLessons: string[];
  totalXP: number;
  level: number;
  streak: number;
  lastActive: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export type LevelTitle =
  | 'Data Cadet'
  | 'Algorithm Apprentice'
  | 'Neural Navigator'
  | 'Gradient Warrior'
  | 'Transformer Mage'
  | 'Model Architect'
  | 'AI Engineer'
  | 'Deep Mind'
  | 'Research Phantom'
  | 'AI Overlord';
