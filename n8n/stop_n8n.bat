@echo off
echo Stopping n8n...
cd /d %~dp0
docker-compose down
echo.
echo n8n stopped!
pause

