@echo off
echo ========================================================
echo       Starting REDDOT Full-Stack Local Servers
echo ========================================================
echo.

echo [1/2] Starting Django Backend on port 8001...
start "REDDOT Backend (Django 8001)" cmd /k "cd /d %~dp0backend && python manage.py runserver 8001"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Vite Server...
start "REDDOT Frontend (Vite 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo Both servers are starting up!
echo Backend:  http://127.0.0.1:8001/api/
echo Frontend: http://localhost:5173/
echo ========================================================
pause
