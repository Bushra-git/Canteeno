@echo off
echo =========================================
echo    CANTEENO - Setup and Launch Script
echo =========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if PostgreSQL is accessible
psql -U postgres -c "SELECT version();" >nul 2>&1
if errorlevel 1 (
    echo ERROR: PostgreSQL is not accessible
    echo Please ensure PostgreSQL is installed and running
    echo Default connection: localhost:5432, user: postgres
    pause
    exit /b 1
)

echo [1/5] Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [2/5] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo [3/5] Setting up database...
call setup_db_enhanced.bat
if errorlevel 1 (
    echo ERROR: Failed to setup database
    pause
    exit /b 1
)

echo [4/5] Creating .env file if not exists...
if not exist .env (
    copy .env.example .env
    echo Created .env file from template
    echo Please edit backend\.env with your database credentials
)

cd ..

echo [5/5] Starting services...
echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo =========================================
echo    CANTEENO is starting up!
echo =========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000
echo.
echo Default Login Credentials:
echo Student:  Roll No: 23101A0003, Password: password
echo Admin:    ID: admin, Password: password  
echo Kitchen:  ID: kitchen, Password: password
echo.
echo Press any key to exit this window...
pause >nul