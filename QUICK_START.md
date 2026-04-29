# NOVA - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Option 1: Docker (Easiest)

```bash
cd nova
docker-compose up
```

Then open:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Local Development

#### Backend Setup
```bash
cd nova/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Start server
uvicorn app.main:app --reload
```

Backend runs on: http://localhost:8000

#### Frontend Setup (new terminal)
```bash
cd nova/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: http://localhost:5173

## 📝 First Steps

### 1. Create an Account
- Go to http://localhost:5173
- Click "Don't have an account? Register"
- Fill in email, username, password
- Click "Create Account"

### 2. Explore Dashboard
- View your rocket progress
- See the 3D space map
- Check your stats (Level, XP, Phases)

### 3. Test API
- Visit http://localhost:8000/docs
- Try endpoints with "Try it out" button
- Use your auth token from login

## 🔑 Key Files to Know

### Frontend
- `src/App.tsx` - Main app structure
- `src/pages/Dashboard.tsx` - Dashboard page
- `src/context/authContext.tsx` - Auth state
- `src/context/progressContext.tsx` - Progress state

### Backend
- `app/main.py` - FastAPI app
- `app/routes/auth.py` - Authentication
- `app/routes/progress.py` - User progress
- `app/models.py` - Database models

## 🛠️ Common Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
npm run type-check   # Check TypeScript
```

### Backend
```bash
uvicorn app.main:app --reload  # Start dev server
pytest                          # Run tests
```

## 🔗 API Quick Reference

### Auth
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"user","password":"pass"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'
```

### Get User Stats
```bash
curl -X GET http://localhost:8000/api/user/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Phases
```bash
curl -X GET http://localhost:8000/api/phases \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Complete a Phase
```bash
curl -X POST http://localhost:8000/api/phases/1/complete \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quiz_score": 85}'
```

## 📊 Database Setup

### With Docker
Database is automatically created and initialized.

### Local PostgreSQL
```bash
# Create database
createdb nova_db

# Create user
createuser nova_user

# Set password
psql -U postgres -c "ALTER USER nova_user WITH PASSWORD 'nova_password';"

# Grant privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE nova_db TO nova_user;"
```

Then update `.env`:
```
DATABASE_URL=postgresql://nova_user:nova_password@localhost:5432/nova_db
```

## 🎨 Frontend Structure

```
src/
├── pages/           # Full page components
├── components/      # Reusable components
├── context/         # State management
├── utils/           # Helper functions
├── types/           # TypeScript types
└── App.tsx          # Main app
```

## 🔌 Backend Structure

```
app/
├── routes/          # API endpoints
├── models.py        # Database models
├── schemas.py       # Request/response schemas
├── security.py      # Auth & security
├── database.py      # DB setup
├── config.py        # Configuration
└── main.py          # FastAPI app
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5173  # Frontend
lsof -i :8000  # Backend

# Kill process
kill -9 <PID>
```

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check credentials

### Module Not Found
```bash
# Frontend
npm install

# Backend
pip install -r requirements.txt
```

### CORS Error
- Check CORS_ORIGINS in backend .env
- Ensure frontend URL is in allowed origins

## 📚 Documentation

- **IMPLEMENTATION_SUMMARY.md** - Overview of what's been built
- **IMPLEMENTATION_GUIDE.md** - Detailed setup and development guide
- **ARCHITECTURE.md** - System design and architecture
- **NOVA_SPEC.md** - Full feature specification

## 🎯 What's Working

✅ User authentication (register/login)
✅ User progress tracking
✅ Phase management
✅ Rocket part unlocking
✅ XP and level system
✅ Leaderboard
✅ 3D space environment
✅ Dashboard with stats

## 🚧 What's Next

- [ ] Phase content and lessons
- [ ] Quiz system
- [ ] AI visualizations
- [ ] Project builder
- [ ] Achievement system
- [ ] Real-time updates

## 💡 Tips

1. **Use API Docs**: http://localhost:8000/docs for interactive testing
2. **Check Console**: Browser console for frontend errors
3. **Check Logs**: Terminal for backend errors
4. **Use DevTools**: Browser DevTools for debugging
5. **Read Spec**: NOVA_SPEC.md for feature details

## 🔐 Default Credentials

For testing (if seeded):
- Email: test@example.com
- Password: password123

## 📞 Need Help?

1. Check the troubleshooting section above
2. Review IMPLEMENTATION_GUIDE.md
3. Check API documentation at /docs
4. Review existing code for patterns

---

**Ready to build?** Start with the backend setup, then frontend, then explore the dashboard!
