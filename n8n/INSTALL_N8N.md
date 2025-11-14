# Installing n8n

## Option 1: Using Docker (Recommended if you have Docker Desktop)

### Install Docker Desktop
1. Download Docker Desktop for Windows: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Wait for Docker to start (icon in system tray)
4. Then run: `start_n8n.bat`

## Option 2: Using npm (Node.js) - No Docker Needed

### Step 1: Install Node.js (if not installed)
1. Download Node.js: https://nodejs.org/
2. Install the LTS version (recommended)
3. Restart your terminal

### Step 2: Install n8n globally
```bash
npm install -g n8n
```

### Step 3: Start n8n
```bash
n8n start
```

Access at: http://localhost:5678

## Option 3: Using npx (No Installation Needed)

Simply run:
```bash
npx n8n
```

This downloads and runs n8n temporarily.

## Verify Installation

After starting n8n, check:
- Open browser: http://localhost:5678
- Default login: `admin` / `changeme`

## Troubleshooting

### Port 5678 already in use
- Stop other applications using port 5678
- Or change port: `n8n start --port 5679`

### npm not found
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Permission errors (Windows)
- Run terminal as Administrator
- Or use `npx n8n` instead















