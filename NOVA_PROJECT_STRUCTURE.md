# NOVA - AI Learning Platform
## Project Structure Overview

```
nova/
├── frontend/                          # React + Three.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SpaceUniverse/        # Main 3D space environment
│   │   │   ├── Rocket/               # Rocket builder & display
│   │   │   ├── LearningPhase/        # Phase content & AI viz
│   │   │   ├── Gamification/         # XP, levels, streaks
│   │   │   └── Navigation/           # UI navigation
│   │   ├── scenes/                   # Three.js scenes
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── context/                  # React context (user, progress)
│   │   ├── utils/                    # Helpers, animations
│   │   ├── styles/                   # Global styles
│   │   ├── pages/                    # Page components
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                           # FastAPI + PyTorch backend
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry
│   │   ├── models/                   # Pydantic models
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── progress.py
│   │   │   ├── phases.py
│   │   │   ├── ai_demos.py
│   │   │   └── gamification.py
│   │   ├── services/
│   │   │   ├── user_service.py
│   │   │   ├── phase_service.py
│   │   │   ├── ai_service.py         # PyTorch AI demos
│   │   │   └── gamification_service.py
│   │   ├── database/
│   │   │   ├── models.py             # SQLAlchemy models
│   │   │   └── db.py
│   │   └── config.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── docs/                              # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── PHASES.md
│
├── docker-compose.yml
└── README.md
```

## Key Features by Component

### Frontend (React + Three.js)
- **SpaceUniverse**: Interactive 3D space map with planets/stations
- **Rocket**: Visual rocket builder, updates as user completes phases
- **LearningPhase**: Content delivery + live AI visualizations
- **Gamification**: XP tracker, level progression, streak counter
- **Animations**: Framer Motion for smooth transitions

### Backend (FastAPI + PyTorch)
- **User Management**: Auth, progress tracking
- **Phase Content**: 10 learning phases with structured content
- **AI Demos**: PyTorch models for live demonstrations
- **Gamification**: XP calculation, level system, streak logic
- **Data Viz**: D3.js-ready data endpoints

### Database
- Users (auth, profile, stats)
- Progress (phases completed, XP, level)
- Rocket Parts (unlocked components)
- Streaks (daily/weekly tracking)
- Phase Content (lessons, quizzes, projects)

## 10 Learning Phases

1. **Foundations** - What is AI?
2. **Neural Networks** - Building blocks
3. **Deep Learning** - Going deeper
4. **Computer Vision** - Seeing like machines
5. **NLP** - Understanding language
6. **Reinforcement Learning** - Learning by doing
7. **Transformers** - Modern architecture
8. **Fine-tuning** - Customizing models
9. **Deployment** - Taking to production
10. **Advanced** - Cutting-edge techniques

Each phase includes:
- Interactive lessons
- Live AI visualization
- Hands-on project (cumulative NOVA AI project)
- Quiz/assessment
- Rocket part unlock
