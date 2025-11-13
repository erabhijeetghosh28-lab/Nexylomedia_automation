@echo off
echo Starting n8n workflow automation...
echo.

REM Check if Docker is installed and running
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker is not installed or not running!
    echo.
    echo Options:
    echo   1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
    echo   2. Use npm method: start_n8n_npm.bat
    echo   3. Use npx method: start_n8n_npx.bat (no installation)
    echo.
    pause
    exit /b 1
)

echo Docker found!
echo.

REM Navigate to n8n directory
cd /d %~dp0

REM Check if docker-compose.yml exists
if not exist "docker-compose.yml" (
    echo docker-compose.yml not found!
    pause
    exit /b 1
)

echo Starting n8n container...
docker-compose up -d

echo.
echo n8n is starting...
echo.
echo Access n8n at: http://localhost:5678
echo Default credentials: admin / changeme
echo.
echo To stop n8n, run: docker-compose down
echo.
pause

