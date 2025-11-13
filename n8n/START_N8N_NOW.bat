@echo off
title n8n Server
color 0A
echo.
echo ================================================
echo   Starting n8n Server
echo ================================================
echo.
echo This window must stay open for n8n to work!
echo.
echo Access n8n at: http://localhost:5678
echo Default login: admin / changeme
echo.
echo Press Ctrl+C to stop n8n
echo.
echo ================================================
echo.

cd /d "%~dp0"
npx n8n

pause

