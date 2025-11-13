# PowerShell script to start n8n

Write-Host "Starting n8n workflow automation..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed or not running!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  1. Install Docker Desktop from https://www.docker.com/products/docker-desktop"
    Write-Host "  2. Use npm method: start_n8n_npm.ps1"
    Write-Host "  3. Use npx method: start_n8n_npx.ps1 (no installation)"
    Write-Host ""
    exit 1
}

Write-Host ""

# Navigate to n8n directory
Set-Location $PSScriptRoot

# Check if docker-compose.yml exists
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "docker-compose.yml not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Starting n8n container..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "n8n is starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Access n8n at: http://localhost:5678" -ForegroundColor Cyan
Write-Host "Default credentials: admin / changeme" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop n8n, run: docker-compose down" -ForegroundColor Cyan
Write-Host ""

