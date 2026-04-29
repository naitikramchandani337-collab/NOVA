# NOVA Architecture

## System Overview

NOVA is a full-stack web application with a React frontend and FastAPI backend, connected through RESTful APIs.

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Application                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Pages (Login, Dashboard, Phases, etc)        │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Components (Rocket, SpaceMap, etc)           │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Context (Auth, Progress)                     │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Three.js / D3.js Visualizations              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes (Auth, Progress, Phases, Gamification)      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services (User, Phase, AI, Gamification)           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Models (SQLAlchemy ORM)                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Security (JWT, Password Hashing)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                        SQL
                            │
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables: Users, Progress, Phases, Achievements      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider
│   └── ProgressProvider
│       ├── Login (public)
│       └── ProtectedRoute
│           ├── Dashboard
│           │   ├── Header
│           │   ├── SpaceMap (Three.js)
│           │   ├── RocketDisplay
│           │   └── StatsGrid
│           ├── Phases
│           │   ├── PhaseList
│           │   └── PhaseDetail
│           │       ├── LessonContent
│           │       ├── AIVisualization (D3.js)
│           │       ├── Quiz
│           │       └── ProjectBuilder
│           └── Leaderboard
```

### State Management

**AuthContext**
- User information
- Authentication token
- Login/Register/Logout functions

**ProgressContext**
- User stats (XP, level, streak)
- Phase completion data
- Rocket parts unlocked
- Achievements

### Data Flow

1. User logs in → Token stored in localStorage
2. Token sent with every API request
3. Backend validates token and returns data
4. Frontend updates context state
5. Components re-render with new data

## Backend Architecture

### Route Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── GET /me
├── /user
│   ├── GET /progress
│   ├── GET /stats
│   ├── GET /phases-completed
│   ├── GET /rocket-parts
│   └── GET /achievements
├── /phases
│   ├── GET /
│   ├── GET /{id}
│   └── POST /{id}/complete
└── /gamification
    ├── GET /leaderboard
    ├── GET /stats/xp-breakdown
    └── POST /streak/freeze
```

### Database Schema

**Users Table**
- id (UUID, PK)
- email (String, unique)
- username (String, unique)
- password_hash (String)
- created_at, updated_at

**UserProgress Table**
- id (UUID, PK)
- user_id (UUID, FK)
- current_phase (Int)
- total_xp (Int)
- current_level (Int)
- streak_days (Int)
- last_activity_date (DateTime)

**PhaseCompletion Table**
- id (UUID, PK)
- user_id (UUID, FK)
- phase_id (Int)
- completed_at (DateTime)
- quiz_score (Int)
- xp_earned (Int)

**RocketPart Table**
- id (UUID, PK)
- user_id (UUID, FK)
- phase_id (Int)
- part_name (String)
- unlocked_at (DateTime)

**Achievement Table**
- id (UUID, PK)
- user_id (UUID, FK)
- achievement_key (String)
- achievement_name (String)
- description (String)
- unlocked_at (DateTime)

### Authentication Flow

```
1. User submits credentials
   ↓
2. Backend hashes password and compares
   ↓
3. If valid, create JWT token
   ↓
4. Return token to frontend
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend sends token in Authorization header
   ↓
7. Backend validates token on each request
   ↓
8. If valid, process request; if invalid, return 401
```

### XP & Gamification System

**XP Rewards**
- Lesson completion: 10 XP
- Quiz passing: 25 XP
- Project task: 15 XP
- Streak bonus: 1.1x per day (max 2x)

**Level Calculation**
- Level = (total_xp // 100) + 1
- Each level requires 100 XP

**Streak System**
- Increments on daily activity
- Resets if no activity for 24 hours
- Can be frozen once per month

## Technology Stack Details

### Frontend

**React 18**
- Functional components with hooks
- Context API for state management
- React Router for navigation

**TypeScript**
- Full type safety
- Better IDE support
- Compile-time error checking

**Three.js**
- 3D rendering
- WebGL support
- Interactive 3D scenes

**Framer Motion**
- Smooth animations
- Gesture support
- Layout animations

**TailwindCSS**
- Utility-first CSS
- Custom space theme
- Responsive design

**D3.js**
- Data visualizations
- Charts and graphs
- Interactive elements

### Backend

**FastAPI**
- Async/await support
- Automatic API documentation
- Built-in validation

**SQLAlchemy**
- ORM for database operations
- Relationship management
- Query optimization

**PostgreSQL**
- Relational database
- ACID compliance
- JSON support

**PyTorch**
- Machine learning models
- Tensor operations
- GPU support (optional)

**Pydantic**
- Data validation
- Serialization
- Type hints

## Security Considerations

### Authentication
- JWT tokens with expiration
- Secure password hashing (bcrypt)
- CORS protection
- HTTPS in production

### Data Protection
- SQL injection prevention (SQLAlchemy)
- XSS protection (React escaping)
- CSRF tokens (if needed)
- Rate limiting (recommended)

### API Security
- Input validation (Pydantic)
- Output sanitization
- Error handling (no sensitive info)
- Logging and monitoring

## Performance Optimization

### Frontend
- Code splitting with React.lazy
- Image optimization
- Lazy loading components
- Memoization with React.memo

### Backend
- Database indexing
- Query optimization
- Caching strategies
- Connection pooling

### General
- CDN for static assets
- Compression (gzip)
- Minification
- Monitoring and profiling

## Deployment Architecture

### Development
- Local PostgreSQL
- npm dev server (Vite)
- uvicorn dev server

### Production
- Docker containers
- Docker Compose orchestration
- Nginx reverse proxy
- PostgreSQL managed service
- Environment-based configuration

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Load balancing
- Database replication
- Cache layer (Redis)

### Vertical Scaling
- Database optimization
- Query caching
- Connection pooling
- Resource allocation

### Future Enhancements
- WebSocket for real-time updates
- Message queue (Celery/RabbitMQ)
- Microservices architecture
- GraphQL API
- Mobile app (React Native)
