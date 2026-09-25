@echo off
echo ===================================================
echo   Loan Default ML Intelligence - Launcher
echo ===================================================
echo.

echo [1/2] Starting Flask ML Inference Backend on port 5000...
start cmd /k "cd /d %~dp0backend && python app.py"

echo [2/2] Starting React + Vite Frontend on port 5173...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting!
echo Frontend will be accessible at: http://localhost:5173
echo Backend API will be accessible at: http://localhost:5000
echo.
pause
