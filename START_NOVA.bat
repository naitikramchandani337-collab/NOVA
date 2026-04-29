@echo off
title NOVA Launch Sequence
echo ==========================================
echo 🚀 STARTING NOVA LAUNCH SEQUENCE 🚀
echo ==========================================

:: Step 1: Start Backend
echo [1/2] Uplink: Starting Backend Core...
echo [!] Clearing port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    taskkill /PID %%a /F >nul 2>&1
)
start cmd /k "cd nova\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
echo [OK] Backend initialization started in separate window.

:: Step 2: Start Frontend
echo [2/2] Guidance: Starting Frontend UI...
start cmd /k "cd nova\frontend && npm run dev"
echo [OK] Frontend initialization started in separate window.

echo ==========================================
echo ✅ ALL SYSTEMS GO!
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:8000
echo ==========================================
pause
