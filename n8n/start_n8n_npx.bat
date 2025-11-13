@echo off
echo Starting n8n using npx (no installation needed)...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.
echo Starting n8n (this will download n8n temporarily)...
echo.
echo Access n8n at: http://localhost:5678
echo Default credentials: admin / changeme
echo.
echo Press Ctrl+C to stop n8n
echo.

npx n8n

pause











