# PowerShell script to stop n8n

Write-Host "Stopping n8n..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
docker-compose down
Write-Host ""
Write-Host "n8n stopped!" -ForegroundColor Green

