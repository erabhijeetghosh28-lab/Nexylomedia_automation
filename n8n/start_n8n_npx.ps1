# PowerShell script to start n8n using npx (no installation needed)

Write-Host "Starting n8n using npx (no installation needed)..." -ForegroundColor Cyan
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
Write-Host "Starting n8n (this will download n8n temporarily)..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Access n8n at: http://localhost:5678" -ForegroundColor Cyan
Write-Host "Default credentials: admin / changeme" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop n8n" -ForegroundColor Cyan
Write-Host ""

npx n8n















