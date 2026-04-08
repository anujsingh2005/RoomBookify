@echo off
REM Quick Network Error Verification
echo.
echo Checking what's running...
echo.

echo 1. Checking Port 5000 (Backend):
netstat -ano | findstr :5000 >nul
if errorlevel 1 (
    echo   STOPPED - Backend is NOT running
) else (
    echo   RUNNING - Backend OK
)

echo.
echo 2. Checking Port 3000 (Frontend):
netstat -ano | findstr :3000 >nul
if errorlevel 1 (
    echo   STOPPED - Frontend is NOT running
) else (
    echo   RUNNING - Frontend OK
)

echo.
echo 3. Checking MySQL:
sc query MySQL80 | find "RUNNING" >nul
if errorlevel 1 (
    echo   STOPPED - MySQL is NOT running
    echo   FIX: Open Windows Services (services.msc) and start MySQL80
) else (
    echo   RUNNING - MySQL OK
)

echo.
echo ============================================
echo WHAT TO DO NEXT:
echo ============================================
echo.
echo If BACKEND is STOPPED:
echo   1. Open Command Prompt
echo   2. cd C:\path\to\RoomBookify\backend
echo   3. npm start
echo.
echo If FRONTEND is STOPPED:
echo   1. Open new Command Prompt
echo   2. cd C:\path\to\RoomBookify\frontend
echo   3. npm run dev
echo.
echo If MySQL is STOPPED:
echo   1. Press Win+R
echo   2. Type: services.msc
echo   3. Find MySQL80 or MySQL57
echo   4. Right-click and click START
echo.
echo Then refresh your browser at:
echo   http://localhost:3000
echo.
pause
