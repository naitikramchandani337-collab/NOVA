# 🚀 Run NOVA Now - Quick Start Guide

## Step 1: Start PostgreSQL (if not already running)

Open PowerShell and run:
```powershell
docker run --name nova-postgres -e POSTGRES_USER=nova_user -e POSTGRES_PASSWORD=nova_password -e POSTGRES_DB=nova_db -p 5432:5432 -d postgres:15-alpine
```

**Note**: If you get an error about the container already existing, run:
```powershell
docker start nova-postgres
```

## Step 2: Start Backend

Open a new PowerShell window and navigate to the backend:
```powershell
cd C:\Users\Asus\Desktop\NOVA\nova\backend
```

Activate the virtual environment:
```powershell
.\venv\Scripts\Activate.ps1
```

Start the backend server:
```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

## Step 3: Start Frontend

Open another PowerShell window and navigate to the frontend:
```powershell
cd C:\Users\Asus\Desktop\NOVA\nova\frontend
```

Start the frontend dev server:
```powershell
npm run dev
```

You should see:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

## Step 4: Open in Browser

1. Open your browser and go to: **http://localhost:5173**
2. Click "Start Learning"
3. Click on "Phase 1: Programming Foundation"
4. Explore the lessons!

## Testing Phase 1 Lessons

### Lesson 1: "What is Programming?"
- Read the content about programming fundamentals
- View the Python code example
- Try the practice exercise: "Print Your Name"
- Take the quiz (2 questions)
- Check out the resources

### Lesson 2: "Variables and Data Types"
- Learn about variables and data types
- View code examples with different data types
- Try 2 practice exercises
- Take the quiz (3 questions)
- Complete the phase!

## Troubleshooting

### Backend won't start
- Make sure PostgreSQL is running: `docker ps` (should show nova-postgres)
- Check if port 8000 is in use: `netstat -ano | findstr :8000`
- Try a different port: `python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001`

### Frontend won't start
- Make sure you're in the frontend directory
- Try: `npm install` first
- Check if port 5173 is in use
- Try: `npm run dev -- --port 5174`

### Database connection error
- Verify PostgreSQL is running: `docker ps`
- Check .env file has correct credentials
- Restart PostgreSQL: `docker restart nova-postgres`

### Changes not showing
- Hard refresh browser: `Ctrl + Shift + R`
- Clear browser cache
- Restart frontend: `Ctrl + C` then `npm run dev`

## What's New in Phase 1

✅ **2 Complete Lessons**
- Lesson 1: What is Programming? (100 XP)
- Lesson 2: Variables and Data Types (150 XP)

✅ **Interactive Features**
- Content with code examples
- Practice exercises with hints and solutions
- Interactive quizzes with scoring
- External resources
- Key takeaways and real-world connections

✅ **Full UI**
- Tabbed interface (Content, Practice, Quiz, Resources)
- Progress bar and lesson counter
- Previous/Next navigation
- Beautiful dark theme with phase colors

## Next Steps

After testing Phase 1:
1. Try completing both lessons
2. Check your XP increases
3. Return to Universe to see progress
4. More phases coming soon!

## Need Help?

- Check the browser console for errors: `F12` → Console tab
- Check backend logs in the terminal
- Verify all services are running: `docker ps` and check terminal windows
- Make sure you're using the correct URLs:
  - Frontend: http://localhost:5173
  - Backend: http://127.0.0.1:8000
  - Backend Docs: http://127.0.0.1:8000/docs
