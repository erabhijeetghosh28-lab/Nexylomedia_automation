@echo off
echo Starting n8n using npm...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    echo After installing Node.js, run this command:
    echo   npm install -g n8n
    echo   n8n start
    pause
    exit /b 1
)

echo Node.js found!
echo.

REM Check if n8n is installed globally
n8n --version >nul 2>&1
if errorlevel 1 (
    echo n8n is not installed globally.
    echo Installing n8n globally...
    echo.
    npm install -g n8n
    if errorlevel 1 (
        echo Failed to install n8n!
        pause
        exit /b 1
    )
)

echo Starting n8n...
echo.
echo Access n8n at: http://localhost:5678
echo Default credentials: admin / changeme
echo.
echo Press Ctrl+C to stop n8n
echo.

n8n start

pause















