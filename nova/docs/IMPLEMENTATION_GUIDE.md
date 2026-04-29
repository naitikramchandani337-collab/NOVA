# NOVA Implementation Guide

## Project Overview

NOVA is a gamified AI learning platform where users build a rocket piece-by-piece as they progress through 10 learning phases. The platform combines 3D visualization, interactive lessons, live AI demonstrations, and gamification mechanics.

## Architecture

### Frontend (React + Three.js)
- **Framework**: React 18 with TypeScript
- **3D Rendering**: Three.js for space environment
- **Animations**: Framer Motion for smooth transitions
- **State Management**: Zustand (context-based for now)
- **Styling**: TailwindCSS with custom space theme
- **Data Viz**: D3.js for charts and visualizations

### Backend (FastAPI + PyTorch)
- **Framework**: FastAPI with async support
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with bcrypt hashing
- **ML Models**: PyTorch for AI demonstrations
- **API**: RESTful with CORS support

## Project Structure

```
nova/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Rocket/          # Rocket builder & display
│   │   │   ├── SpaceUniverse/   # 3D space environment
│   │   │   ├── Navigation/      # Header & navigation
│   │   │   └── LearningPhase/   # Phase content (TODO)
│   │   ├── pages/
│   │   │   ├── Login.tsx        # Auth page
│   │   │   └── Dashboard.tsx    # Main dashboard
│   │   ├── context/
│   │   │   ├── authContext.tsx  # Auth state
│   │   │   └── progressContext.tsx # Progress state
│   │   ├── utils/
│   │   │   ├── api.ts           # Axios instance
│   │   │   └── animations.ts    # Framer Motion variants
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript types
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── progress.py      # User progress endpoints
│   │   │   ├── phases.py        # Learning phases endpoints
│   │   │   └── gamification.py  # Gamification endpoints
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── security.py          # JWT & password utilities
│   │   ├── database.py          # Database setup
│   │   ├── config.py            # Configuration
│   │   └── main.py              # FastAPI app
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── docs/
│   ├── API.md                   # API documentation
│   ├── ARCHITECTURE.md          # Architecture details
│   ├── PHASES.md                # Phase content
│   └── IMPLEMENTATION_GUIDE.md  # This file
│
├── docker-compose.yml
├── NOVA_SPEC.md                 # Full specification
├── NOVA_PROJECT_STRUCTURE.md    # Project structure
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Local Development Setup

#### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=postgresql://nova_user:nova_password@localhost:5432/nova_db

# Run migrations (if using Alembic)
# alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Docker Setup

```bash
# From project root
docker-compose up

# This starts:
# - PostgreSQL on port 5432
# - Backend on port 8000
# - Frontend on port 5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### User Progress
- `GET /api/user/progress` - Get user progress
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/phases-completed` - Get completed phases
- `GET /api/user/rocket-parts` - Get unlocked rocket parts
- `GET /api/user/achievements` - Get achievements

### Phases
- `GET /api/phases` - List all phases
- `GET /api/phases/{id}` - Get phase details
- `POST /api/phases/{id}/complete` - Complete phase

### Gamification
- `GET /api/gamification/leaderboard` - Get leaderboard
- `GET /api/gamification/stats/xp-breakdown` - Get XP breakdown
- `POST /api/gamification/streak/freeze` - Use streak freeze

## Development Workflow

### Adding a New Component

1. Create component file in `frontend/src/components/`
2. Define TypeScript interfaces in `frontend/src/types/`
3. Use Framer Motion for animations
4. Style with TailwindCSS
5. Export from component index

Example:
```typescript
// src/components/MyComponent/MyComponent.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@utils/animations';

export const MyComponent: React.FC = () => {
  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate">
      {/* Component content */}
    </motion.div>
  );
};
```

### Adding a New API Endpoint

1. Create route file in `backend/app/routes/`
2. Define Pydantic schemas in `backend/app/schemas.py`
3. Add SQLAlchemy models in `backend/app/models.py`
4. Include router in `backend/app/main.py`

Example:
```python
# backend/app/routes/my_route.py
from fastapi import APIRouter, Depends
from app.database import get_db
from app.security import get_current_user

router = APIRouter()

@router.get("/my-endpoint")
async def my_endpoint(current_user = Depends(get_current_user)):
    return {"message": "Hello"}
```

## Key Features Implementation

### 1. Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Token stored in localStorage
- Auto-refresh on app load

### 2. User Progress Tracking
- XP system (100 XP per level)
- Phase completion tracking
- Rocket part unlocking
- Achievement system

### 3. Gamification
- XP rewards per activity
- Level progression
- Daily/weekly streaks
- Global leaderboard
- Achievements

### 4. 3D Space Environment
- Three.js scene with starfield
- Interactive planets for each phase
- Click to navigate to phase
- Responsive to window resize

### 5. Rocket Builder
- Visual rocket display
- Part-by-part unlocking
- Progress bar
- Animation on new part

## Testing

### Frontend Testing
```bash
cd frontend
npm run type-check  # TypeScript checking
npm run lint        # ESLint
```

### Backend Testing
```bash
cd backend
pytest              # Run tests
```

## Deployment

### Production Build

Frontend:
```bash
cd frontend
npm run build
# Output in dist/
```

Backend:
```bash
cd backend
# Use Dockerfile for containerization
docker build -t nova-backend .
```

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@host:5432/nova_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["https://yourdomain.com"]
ENVIRONMENT=production
DEBUG=false
```

**Frontend (.env)**
```
VITE_API_URL=https://api.yourdomain.com
```

## Next Steps

### Phase 1: Core Infrastructure (Week 1-2)
- [x] Project setup
- [x] Database models
- [x] Authentication system
- [x] Basic API endpoints
- [ ] Database migrations (Alembic)
- [ ] Error handling & logging

### Phase 2: Learning System (Week 3-4)
- [ ] Phase content structure
- [ ] Lesson components
- [ ] Quiz system
- [ ] AI visualization components
- [ ] D3.js integration

### Phase 3: Gamification (Week 5)
- [ ] XP calculation
- [ ] Level progression
- [ ] Streak tracking
- [ ] Achievement system
- [ ] Leaderboard UI

### Phase 4: Advanced Features (Week 6-8)
- [ ] PyTorch AI demos
- [ ] Cumulative project system
- [ ] Advanced visualizations
- [ ] Real-time updates (WebSocket)

### Phase 5: Polish & Deploy (Week 9-10)
- [ ] Performance optimization
- [ ] Testing & QA
- [ ] Documentation
- [ ] Deployment

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify credentials

### CORS Errors
- Check CORS_ORIGINS in backend config
- Ensure frontend URL is in allowed origins

### Module Not Found Errors
- Run `npm install` in frontend
- Run `pip install -r requirements.txt` in backend
- Check import paths

## Resources

- [React Documentation](https://react.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Three.js Documentation](https://threejs.org/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [PyTorch Documentation](https://pytorch.org/docs)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - see LICENSE file for details
