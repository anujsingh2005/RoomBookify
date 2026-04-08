@echo off
REM RoomBookify Diagnostic Script for Windows

echo.
echo ================================================
echo   RoomBookify Network Diagnostics
echo ================================================
echo.

REM Check 1: Node.js
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js not found. Install from https://nodejs.org/
) else (
    echo OK Node.js found:
    node --version
)
echo.

REM Check 2: MySQL Service
echo [2/5] Checking MySQL Service...
sc query MySQL80 >nul 2>&1
if errorlevel 1 (
    sc query MySQL57 >nul 2>&1
    if errorlevel 1 (
        echo X MySQL service not found
        echo   Try: services.msc and look for MySQL
    ) else (
        echo OK MySQL57 found
    )
) else (
    sc query MySQL80 | find "RUNNING" >nul
    if errorlevel 1 (
        echo X MySQL80 is NOT running
        echo   Start it: net start MySQL80
    ) else (
        echo OK MySQL80 is running
    )
)
echo.

REM Check 3: Port 5000
echo [3/5] Checking Port 5000 (Backend)...
netstat -ano | findstr :5000 >nul
if errorlevel 1 (
    echo X Port 5000 is NOT in use - Backend not running
    echo   Solution: Start backend with: cd backend ^&^& npm start
) else (
    echo OK Port 5000 is in use
)
echo.

REM Check 4: Port 3000
echo [4/5] Checking Port 3000 (Frontend)...
netstat -ano | findstr :3000 >nul
if errorlevel 1 (
    echo X Port 3000 is NOT in use - Frontend not running
    echo   Solution: Start frontend with: cd frontend ^&^& npm run dev
) else (
    echo OK Port 3000 is in use
)
echo.

REM Check 5: Backend Health
echo [5/5] Testing Backend API...
for /f %%i in ('powershell -Command "(Invoke-WebRequest -Uri http://localhost:5000/api/health -ErrorAction SilentlyContinue).StatusCode" 2^>nul') do set STATUS=%%i
if "%STATUS%"=="200" (
    echo OK Backend is responding
    echo   Try login now at http://localhost:3000
) else (
    echo X Backend is not responding
    echo   Make sure backend is running: cd backend ^&^& npm start
)
echo.

echo ================================================
echo   Diagnostic Complete
echo ================================================
echo.
pause
