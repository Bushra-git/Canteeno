@echo off
REM Setup script for Canteen Management System Database

set PGPASSWORD=root

echo Terminating active connections to canteen_db...
psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'canteen_db' AND pid <> pg_backend_pid();"

echo Dropping existing database if exists...
psql -U postgres -c "DROP DATABASE IF EXISTS canteen_db;"

echo Creating database...
psql -U postgres -c "CREATE DATABASE canteen_db;"

echo Setting up schema...
psql -U postgres -d canteen_db -f schema.sql

echo Database setup complete!
pause
