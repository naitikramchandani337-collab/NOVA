@echo off
title NOVA ASTRA Backend
echo ==========================================
echo 🚀 STARTING ASTRA BACKEND 🚀
echo ==========================================

echo [1/2] Clearing flight deck: Killing port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo [2/2] Ignition: Starting mini_astra server...
.\venv\Scripts\python.exe mini_astra.py

pause
