# 🚀 NOVA Installation Guide

## Where to Install Everything

### Option 1: Local Development (Recommended for Learning)

#### Step 1: Create Project Directory
```bash
# Windows PowerShell
mkdir C:\Users\YourUsername\Desktop\NOVA
cd C:\Users\YourUsername\Desktop\NOVA

# Or use any location you prefer
mkdir D:\Projects\NOVA
cd D:\Projects\NOVA
```

#### Step 2: Clone or Copy Files
```bash
# If you have git
git clone https://github.com/naitikramchandani337-collab/NOVA.git
cd NOVA

# Or manually copy the nova/ folder here
```

#### Step 3: Install Backend
```bash
cd nova/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env with your settings
```

#### Step 4: Install Frontend
```bash
cd ../frontend

# Install Node dependencies
npm install

# Or use yarn
yarn install
```

#### Step 5: Run Both Servers

**Terminal 1 - Backend:**
```bash
cd nova/backend
venv\Scripts\activate  # Windows
python -m uvicorn app.main:app --reload
# Backend runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd nova/frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

### Option 2: Docker (Recommended for Production)

#### Step 1: Install Docker
- Download: https://www.docker.com/products/docker-desktop
- Install and restart your computer

#### Step 2: Navigate to Project
```bash
cd C:\Users\YourUsername\Desktop\NOVA
cd NOVA
```

#### Step 3: Run with Docker Compose
```bash
# Start all services
docker-compose up

# Services will be available at:
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Database: localhost:5432
```

#### Step 4: Stop Services
```bash
# Press Ctrl+C in terminal
# Or in another terminal:
docker-compose down
```

---

### Option 3: Cloud Deployment

#### Vercel (Frontend)
```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to https://vercel.com
# 3. Import repository
# 4. Deploy automatically
```

#### Heroku (Backend)
```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Deploy
git push heroku main
```

#### AWS (Full Stack)
- Use EC2 for backend
- Use S3 + CloudFront for frontend
- Use RDS for database

---

## Directory Structure After Installation

```
C:\Users\YourUsername\Desktop\NOVA\
├── NOVA/                          (cloned repo)
│   ├── nova/
│   │   ├── frontend/              (React app)
│   │   │   ├── src/
│   │   │   ├── node_modules/      (after npm install)
│   │   │   ├── package.json
│   │   │   └── ...
│   │   │
│   │   ├── backend/               (FastAPI app)
│   │   │   ├── app/
│   │   │   ├── venv/              (after python -m venv venv)
│   │   │   ├── requirements.txt
│   │   │   └── ...
│   │   │
│   │   ├── docs/
│   │   ├── docker-compose.yml
│   │   └── README.md
│   │
│   ├── .kiro/
│   ├── QUICK_START.md
│   ├── IMPLEMENTATION_GUIDE.md
│   └── ... (documentation)
```

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10+, Mac OS 10.14+, Linux
- **RAM**: 4GB
- **Disk**: 2GB free space
- **Internet**: Required for npm/pip packages

### Recommended Requirements
- **OS**: Windows 11, Mac OS 12+, Ubuntu 20.04+
- **RAM**: 8GB+
- **Disk**: 5GB free space
- **Processor**: Intel i5 or equivalent

---

## Prerequisites Installation

### 1. Install Node.js (for Frontend)
- Download: https://nodejs.org/
- Choose LTS version
- Install with default settings
- Verify: `node --version` and `npm --version`

### 2. Install Python (for Backend)
- Download: https://www.python.org/
- Choose Python 3.10 or 3.11
- **Important**: Check "Add Python to PATH" during installation
- Verify: `python --version`

### 3. Install Git (Optional but Recommended)
- Download: https://git-scm.com/
- Install with default settings
- Verify: `git --version`

### 4. Install Docker (Optional)
- Download: https://www.docker.com/products/docker-desktop
- Install and restart computer
- Verify: `docker --version`

---

## Step-by-Step Installation

### For Windows Users

#### Step 1: Open PowerShell
```
Press Windows Key + X
Select "Windows PowerShell (Admin)"
```

#### Step 2: Navigate to Desktop
```powershell
cd Desktop
```

#### Step 3: Create NOVA Directory
```powershell
mkdir NOVA
cd NOVA
```

#### Step 4: Clone Repository
```powershell
git clone https://github.com/naitikramchandani337-collab/NOVA.git
cd NOVA
```

#### Step 5: Install Backend
```powershell
cd nova/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

#### Step 6: Install Frontend
```powershell
cd ../frontend
npm install
```

#### Step 7: Run Backend
```powershell
cd ../backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

#### Step 8: Run Frontend (New PowerShell Window)
```powershell
cd Desktop/NOVA/NOVA/nova/frontend
npm run dev
```

---

### For Mac Users

#### Step 1: Open Terminal
```
Press Cmd + Space
Type "Terminal"
Press Enter
```

#### Step 2: Navigate to Desktop
```bash
cd Desktop
```

#### Step 3: Create NOVA Directory
```bash
mkdir NOVA
cd NOVA
```

#### Step 4: Clone Repository
```bash
git clone https://github.com/naitikramchandani337-collab/NOVA.git
cd NOVA
```

#### Step 5: Install Backend
```bash
cd nova/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

#### Step 6: Install Frontend
```bash
cd ../frontend
npm install
```

#### Step 7: Run Backend
```bash
cd ../backend
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

#### Step 8: Run Frontend (New Terminal Tab)
```bash
cd Desktop/NOVA/NOVA/nova/frontend
npm run dev
```

---

### For Linux Users

#### Step 1: Open Terminal
```bash
Ctrl + Alt + T
```

#### Step 2: Navigate to Home
```bash
cd ~
```

#### Step 3: Create NOVA Directory
```bash
mkdir NOVA
cd NOVA
```

#### Step 4: Clone Repository
```bash
git clone https://github.com/naitikramchandani337-collab/NOVA.git
cd NOVA
```

#### Step 5: Install Backend
```bash
cd nova/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

#### Step 6: Install Frontend
```bash
cd ../frontend
npm install
```

#### Step 7: Run Backend
```bash
cd ../backend
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

#### Step 8: Run Frontend (New Terminal Tab)
```bash
cd ~/NOVA/NOVA/nova/frontend
npm run dev
```

---

## Verify Installation

### Check Backend
```bash
# Should see:
# Uvicorn running on http://127.0.0.1:8000
# Press CTRL+C to quit
```

### Check Frontend
```bash
# Should see:
# VITE v5.0.8  ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

### Open in Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Troubleshooting

### Issue: "python is not recognized"
**Solution**: 
- Python not in PATH
- Reinstall Python and check "Add Python to PATH"
- Or use `python3` instead of `python`

### Issue: "npm is not recognized"
**Solution**:
- Node.js not installed
- Download from https://nodejs.org/
- Restart terminal after installation

### Issue: "venv\Scripts\activate" doesn't work
**Solution**:
- You're on Mac/Linux, use: `source venv/bin/activate`
- Or use: `venv\Scripts\Activate.ps1` on PowerShell

### Issue: "Port 5173 already in use"
**Solution**:
```bash
# Kill process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5173
kill -9 <PID>
```

### Issue: "Port 8000 already in use"
**Solution**:
```bash
# Kill process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :8000
kill -9 <PID>
```

### Issue: "ModuleNotFoundError"
**Solution**:
```bash
# Make sure venv is activated
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Then reinstall:
pip install -r requirements.txt
```

### Issue: "npm ERR! code ERESOLVE"
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

---

## Environment Setup

### Backend .env File
```
# nova/backend/.env
DATABASE_URL=postgresql://nova_user:nova_password@localhost:5432/nova_db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
ENVIRONMENT=development
DEBUG=true
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend .env File (Optional)
```
# nova/frontend/.env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

---

## Running Commands

### Frontend Commands
```bash
cd nova/frontend

npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
npm run type-check   # Check TypeScript
```

### Backend Commands
```bash
cd nova/backend

# Activate venv first
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Then run:
python -m uvicorn app.main:app --reload  # Dev server
pytest                                     # Run tests
```

---

## Database Setup

### Option 1: PostgreSQL Local
```bash
# Install PostgreSQL
# https://www.postgresql.org/download/

# Create database
createdb nova_db

# Create user
createuser nova_user

# Set password
psql -U postgres -c "ALTER USER nova_user WITH PASSWORD 'nova_password';"

# Grant privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE nova_db TO nova_user;"
```

### Option 2: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name nova-postgres \
  -e POSTGRES_USER=nova_user \
  -e POSTGRES_PASSWORD=nova_password \
  -e POSTGRES_DB=nova_db \
  -p 5432:5432 \
  -d postgres:15
```

### Option 3: Docker Compose
```bash
# Already configured in docker-compose.yml
docker-compose up
```

---

## Deployment Checklist

- [ ] Node.js installed
- [ ] Python installed
- [ ] Git installed (optional)
- [ ] Docker installed (optional)
- [ ] Repository cloned
- [ ] Backend venv created
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env files configured
- [ ] Database set up
- [ ] Backend running on :8000
- [ ] Frontend running on :5173
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:8000/docs

---

## Next Steps

1. ✅ Install everything
2. ✅ Run both servers
3. ✅ Open http://localhost:5173
4. ✅ Explore the app
5. ✅ Read QUICK_START.md
6. ✅ Read IMPLEMENTATION_GUIDE.md
7. ✅ Start building features

---

## Support

### Documentation
- QUICK_START.md - Quick setup
- IMPLEMENTATION_GUIDE.md - Detailed guide
- ARCHITECTURE.md - System design
- README.md - Project overview

### Troubleshooting
- Check error messages carefully
- Google the error message
- Check GitHub issues
- Ask in community forums

### Resources
- Node.js: https://nodejs.org/
- Python: https://www.python.org/
- Git: https://git-scm.com/
- Docker: https://www.docker.com/
- PostgreSQL: https://www.postgresql.org/

---

**Status**: Ready to Install

**Estimated Time**: 15-30 minutes

**Difficulty**: Easy

**Support**: Full documentation included
