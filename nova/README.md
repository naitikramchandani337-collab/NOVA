# NOVA - AI Learning Platform

Build a rocket-powered AI system and launch it into deep space. Every concept learned = a new rocket part built. Every phase completed = rocket flies higher.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Local Development

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Update .env with your database credentials
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### Docker Setup
```bash
docker-compose up
```

This starts:
- PostgreSQL on port 5432
- Backend on port 8000
- Frontend on port 5173

## 📁 Project Structure

```
nova/
├── frontend/          # React + Three.js frontend
├── backend/           # FastAPI + PyTorch backend
├── docs/              # Documentation
├── docker-compose.yml # Docker configuration
└── README.md
```

## 🎮 Features

### Core Features
- **Space Universe Map**: Interactive 3D dashboard with 10 learning phases
- **Rocket Builder**: Visual rocket that builds piece-by-piece as you progress
- **10 Learning Phases**: From AI Foundations to Advanced Techniques
- **Live AI Visualizations**: PyTorch models running in real-time
- **Cumulative Project**: Build NOVA AI system across all phases
- **Gamification**: XP, levels, streaks, achievements, leaderboards

### Tech Stack
- **Frontend**: React, TypeScript, Three.js, Framer Motion, D3.js, TailwindCSS
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, PyTorch
- **DevOps**: Docker, Docker Compose

## 📚 Learning Phases

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

## 🎯 Getting Started with Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
npm run type-check   # Check TypeScript
```

### Backend Development
```bash
cd backend
uvicorn app.main:app --reload  # Start dev server
pytest                          # Run tests
```

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Learning Phases](./docs/PHASES.md)
- [Full Specification](./NOVA_SPEC.md)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🌟 Roadmap

- [ ] Phase 0: Setup & Infrastructure
- [ ] Phase 1: Core Features (Auth, Dashboard, Phase 1)
- [ ] Phase 2: 3D Environment & Rocket
- [ ] Phase 3: Learning System & Visualizations
- [ ] Phase 4: Gamification
- [ ] Phase 5: Advanced Features
- [ ] Phase 6: Polish & Deployment

## 💬 Support

For questions or issues, please open an issue on GitHub or contact the team.

---

**Built with ❤️ for AI learners everywhere**
