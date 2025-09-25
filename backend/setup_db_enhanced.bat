@echo off
echo Setting up Canteen Management Database...

REM Check if PostgreSQL is running
psql -U postgres -d postgres -c "SELECT version();" > nul 2>&1
if errorlevel 1 (
    echo PostgreSQL is not running or not accessible.
    echo Please ensure PostgreSQL is installed and running.
    echo Default connection: localhost:5432, user: postgres
    pause
    exit /b 1
)

echo PostgreSQL is running.

REM Drop database if exists and create new one
echo Dropping existing database if it exists...
psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS canteen_db;"

echo Creating new database...
psql -U postgres -d postgres -c "CREATE DATABASE canteen_db;"

REM Check if database was created successfully
psql -U postgres -d canteen_db -c "SELECT current_database();" > nul 2>&1
if errorlevel 1 (
    echo Failed to create database.
    pause
    exit /b 1
)

echo Database created successfully.

REM Run schema
echo Setting up database schema...
psql -U postgres -d canteen_db -f schema.sql

if errorlevel 1 (
    echo Failed to set up database schema.
    pause
    exit /b 1
)

echo Database setup completed successfully!
echo.
echo Database Details:
echo   Name: canteen_db
echo   Host: localhost
echo   Port: 5432
echo   User: postgres
echo.
echo You can now start the backend server with: npm run dev
pause