# PowerShell script to start n8n using npm

Write-Host "Starting n8n using npm..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if n8n is installed globally
try {
    $n8nVersion = n8n --version 2>&1
    Write-Host "n8n found: $n8nVersion" -ForegroundColor Green
} catch {
    Write-Host "n8n is not installed globally." -ForegroundColor Yellow
    Write-Host "Installing n8n globally..." -ForegroundColor Yellow
    Write-Host ""
    
    npm install -g n8n
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install n8n!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Starting n8n..." -ForegroundColor Green
Write-Host ""
Write-Host "Access n8n at: http://localhost:5678" -ForegroundColor Cyan
Write-Host "Default credentials: admin / changeme" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop n8n" -ForegroundColor Cyan
Write-Host ""

n8n start











