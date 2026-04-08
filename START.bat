@echo off
REM RoomBookify Quick Start Script for Windows
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo   RoomBookify - Quick Start
echo ========================================
echo.

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MySQL is running
echo Checking MySQL service...
sc query MySQL80 | find "RUNNING" >nul
if errorlevel 1 (
    echo Warning: MySQL80 service might not be running
    echo You can start it with: net start MySQL80
    echo Continuing anyway...
)

echo.
echo Starting Backend Server...
echo.
cd /d "%~dp0backend"
start cmd /k "npm start"

timeout /t 3 /nobreak

echo.
echo Starting Frontend Server...
echo.
cd /d "%~dp0frontend"
start cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers are starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
