# NOVA AI Learning Platform - Specification

## 1. Project Overview

**NOVA** is an interactive AI learning platform where users build a rocket piece-by-piece as they progress through 10 AI learning phases. The platform combines gamification, 3D visualization, and hands-on AI demonstrations to create an engaging learning experience.

**Core Metaphor**: Learning AI concepts = Building rocket parts → Launching into deep space

---

## 2. User Journey

### Onboarding
1. User signs up / logs in
2. Sees the space universe map with locked phases
3. Starts Phase 1: Foundations
4. Completes first lesson → Earns first rocket part
5. Rocket appears in the 3D space environment

### Learning Loop (Per Phase)
1. **Learn**: Interactive lesson with animations
2. **Visualize**: Live AI demo (PyTorch model running)
3. **Build**: Hands-on project (cumulative NOVA AI project)
4. **Quiz**: Assessment to unlock next phase
5. **Reward**: Rocket part + XP + streak bonus

### Progression
- Complete all 10 phases → Fully built rocket
- Launch rocket → Victory animation
- Unlock advanced content / community features

---

## 3. Core Features

### 3.1 Space Universe Map (Dashboard)
**Component**: `SpaceUniverse`

- **3D Environment**: Three.js scene with:
  - Starfield background
  - Planets/stations representing each phase
  - User's rocket in center
  - Animated connections between phases
  
- **Interactions**:
  - Click planet → Enter phase
  - Hover → Show phase info (name, progress, XP reward)
  - Drag to rotate view
  - Zoom in/out

- **Visual States**:
  - Locked (grayed out, locked icon)
  - In Progress (pulsing, highlighted)
  - Completed (checkmark, glowing)

### 3.2 Rocket Builder
**Component**: `Rocket`

- **Parts** (10 total, one per phase):
  1. Foundation/Base
  2. Engine Core
  3. Fuel Tank
  4. Navigation System
  5. Payload Bay
  6. Solar Panels
  7. Communication Array
  8. Stabilizers
  9. Heat Shield
  10. Apex/Nose Cone

- **Display**:
  - 3D model in space (Three.js)
  - 2D progress bar showing completion
  - Part names + unlock dates
  - Animation when new part added (Framer Motion)

- **Mechanics**:
  - Parts unlock sequentially
  - Each part has unique 3D model
  - Rocket grows visually as user progresses
  - Final rocket is fully assembled and ready to launch

### 3.3 Learning Phases (10 Total)
**Component**: `LearningPhase`

Each phase contains:

#### Content Structure
```
Phase {
  id: 1-10
  name: string
  description: string
  rocketPart: string
  xpReward: number
  
  lessons: [
    {
      title: string
      content: string (markdown)
      duration: number (minutes)
      videoUrl?: string
    }
  ]
  
  aiDemo: {
    title: string
    description: string
    modelType: string (e.g., "neural_network", "cnn", "nlp")
    interactiveElements: [...]
  }
  
  project: {
    title: string
    description: string
    tasks: [
      {
        id: string
        title: string
        description: string
        codeTemplate: string
      }
    ]
  }
  
  quiz: {
    questions: [
      {
        id: string
        question: string
        options: string[]
        correctAnswer: number
        explanation: string
      }
    ]
    passingScore: number (e.g., 70)
  }
}
```

#### Phase Details

| Phase | Topic | Rocket Part | Key Concepts |
|-------|-------|-------------|--------------|
| 1 | Foundations | Base | What is AI, ML vs DL, history |
| 2 | Neural Networks | Engine Core | Neurons, layers, activation functions |
| 3 | Deep Learning | Fuel Tank | Backprop, optimization, loss functions |
| 4 | Computer Vision | Navigation System | CNNs, image processing, object detection |
| 5 | NLP | Payload Bay | Tokenization, embeddings, transformers intro |
| 6 | Reinforcement Learning | Solar Panels | Q-learning, policy gradient, rewards |
| 7 | Transformers | Communication Array | Attention, BERT, GPT architecture |
| 8 | Fine-tuning | Stabilizers | Transfer learning, prompt engineering |
| 9 | Deployment | Heat Shield | Model serving, optimization, inference |
| 10 | Advanced | Apex Cone | Cutting-edge: diffusion, multimodal, etc |

### 3.4 AI Visualizations
**Component**: `AIVisualization` (per phase)

Live demonstrations using PyTorch models:

- **Phase 1**: Neural network activation visualization
- **Phase 2**: Neuron firing patterns (animated)
- **Phase 3**: Loss curve during training (real-time)
- **Phase 4**: CNN feature maps (image processing)
- **Phase 5**: Word embeddings in 3D space (t-SNE)
- **Phase 6**: Q-learning agent playing game
- **Phase 7**: Attention heatmaps on text
- **Phase 8**: Model performance before/after fine-tuning
- **Phase 9**: Inference latency comparison
- **Phase 10**: Generative model output (images/text)

**Tech**: D3.js for charts, Three.js for 3D, WebGL for real-time rendering

### 3.5 Cumulative Project: NOVA AI
**Component**: `ProjectBuilder`

A single project that evolves across all 10 phases:

- **Phase 1**: Set up Python environment, import libraries
- **Phase 2**: Build a simple neural network from scratch
- **Phase 3**: Train the network on MNIST dataset
- **Phase 4**: Add CNN layers for image classification
- **Phase 5**: Integrate NLP preprocessing pipeline
- **Phase 6**: Add RL agent for decision-making
- **Phase 7**: Replace with Transformer architecture
- **Phase 8**: Fine-tune on custom dataset
- **Phase 9**: Deploy model as API
- **Phase 10**: Add advanced features (multimodal, etc)

**Output**: Fully functional AI system by end of course

### 3.6 Gamification System
**Component**: `Gamification`

#### XP System
- Lesson completion: 10 XP
- Quiz passing: 25 XP
- Project task: 15 XP
- Bonus: Streak multiplier (1.1x per day, max 2x)

#### Levels
- Level = 100 XP
- Levels 1-10 (one per phase)
- Level-up unlocks cosmetic rewards (rocket skins, space themes)

#### Streaks
- Daily streak: Log in and complete one activity
- Weekly streak: Complete 5 activities in a week
- Streak bonuses: 1.1x XP per day (max 2x at 10 days)
- Streak freeze: Use once per month to maintain streak

#### Leaderboard
- Global leaderboard (top 100 users)
- Weekly leaderboard (resets every Monday)
- Sorting: XP, level, streak length

#### Achievements
- "First Steps" - Complete Phase 1
- "Rocket Scientist" - Complete Phase 5
- "AI Master" - Complete all 10 phases
- "Speedrunner" - Complete all phases in 30 days
- "Consistent Learner" - 30-day streak
- "Quiz Master" - 100% on all quizzes

---

## 4. Technical Architecture

### Frontend Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js** - 3D rendering
- **Framer Motion** - Animations
- **D3.js** - Data visualizations
- **Axios** - HTTP client
- **Zustand** - State management
- **TailwindCSS** - Styling

### Backend Stack
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **PyTorch** - ML models
- **Pydantic** - Data validation
- **JWT** - Authentication
- **Docker** - Containerization

### Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- User Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  current_phase INT,
  total_xp INT DEFAULT 0,
  current_level INT DEFAULT 1,
  streak_days INT DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Phase Completion
CREATE TABLE phase_completion (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  phase_id INT,
  completed_at TIMESTAMP,
  quiz_score INT,
  xp_earned INT,
  UNIQUE(user_id, phase_id)
);

-- Rocket Parts
CREATE TABLE rocket_parts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  phase_id INT,
  unlocked_at TIMESTAMP,
  UNIQUE(user_id, phase_id)
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  achievement_key VARCHAR,
  unlocked_at TIMESTAMP,
  UNIQUE(user_id, achievement_key)
);
```

---

## 5. API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### User Progress
- `GET /api/user/progress` - Get user progress
- `GET /api/user/stats` - Get user stats (XP, level, streak)
- `GET /api/user/achievements` - Get unlocked achievements

### Phases
- `GET /api/phases` - List all phases
- `GET /api/phases/{id}` - Get phase details
- `POST /api/phases/{id}/start` - Start phase
- `POST /api/phases/{id}/complete` - Mark phase complete

### AI Demos
- `GET /api/phases/{id}/demo` - Get demo data
- `POST /api/phases/{id}/demo/run` - Run live demo
- `GET /api/phases/{id}/demo/results` - Get demo results

### Gamification
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/weekly` - Get weekly leaderboard
- `POST /api/streak/freeze` - Use streak freeze

### Project
- `GET /api/project/status` - Get project progress
- `POST /api/project/task/{id}/submit` - Submit task
- `GET /api/project/code` - Get current code

---

## 6. Implementation Phases

### Phase 0: Setup (Week 1)
- [ ] Initialize React + Vite frontend
- [ ] Initialize FastAPI backend
- [ ] Set up PostgreSQL database
- [ ] Configure Docker & docker-compose
- [ ] Set up CI/CD pipeline

### Phase 1: Core Infrastructure (Week 2-3)
- [ ] User authentication (JWT)
- [ ] Database models & migrations
- [ ] Basic API endpoints
- [ ] React context for state management
- [ ] Basic styling with TailwindCSS

### Phase 2: 3D Environment (Week 4-5)
- [ ] Three.js scene setup
- [ ] Space universe map
- [ ] Rocket 3D model
- [ ] Phase 1 content & quiz

### Phase 3: Learning System (Week 6-8)
- [ ] Lesson components
- [ ] Quiz system
- [ ] Phase 2-5 content
- [ ] AI visualizations (D3.js)

### Phase 4: Gamification (Week 9)
- [ ] XP system
- [ ] Level progression
- [ ] Streak tracking
- [ ] Leaderboard
- [ ] Achievements

### Phase 5: Advanced Features (Week 10-11)
- [ ] Phase 6-10 content
- [ ] PyTorch AI demos
- [ ] Cumulative project system
- [ ] Advanced visualizations

### Phase 6: Polish & Deploy (Week 12)
- [ ] Performance optimization
- [ ] Testing & QA
- [ ] Documentation
- [ ] Deployment to production

---

## 7. Success Metrics

- User retention: 70% after 1 week
- Average time per phase: 45 minutes
- Quiz pass rate: 80%+
- User engagement: 5+ logins per week
- Community: 1000+ users in first month

---

## 8. Future Enhancements

- Multiplayer challenges
- AI-powered tutoring
- Mobile app (React Native)
- Community forums
- Certification program
- Advanced analytics dashboard
- Integration with Hugging Face models
- Real-time collaboration on projects
