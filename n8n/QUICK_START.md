# Quick Start n8n - Step by Step

## ✅ Current Status: Starting n8n

### Option 1: Start with npx (Easiest - No Installation)

Open a **new terminal/PowerShell window** and run:

```powershell
cd n8n
npx n8n
```

**OR** use the batch file:
```cmd
n8n\start_n8n_npx.bat
```

### Option 2: Start with npm (If you have n8n installed globally)

```powershell
cd n8n
n8n start
```

### Option 3: Start with Docker (If Docker is running)

```powershell
cd n8n
docker-compose up -d
```

---

## 📍 Access n8n

Once started, open your browser:

**URL:** http://localhost:5678

**Default Login:**
- Username: `admin`
- Password: `changeme`

⚠️ **IMPORTANT:** Change the password immediately after first login!

---

## ✅ Next Steps After n8n Starts

### Step 1: Configure Database Credentials

1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential** → Select **Microsoft SQL Server**
3. Configure:
   - **Host:** `localhost` (or your SQL Server host)
   - **Database:** `nexylo`
   - **User:** `nexylo`
   - **Password:** `Nexylomedia@25`
   - **Port:** `1433`
4. Save as: `mssql-credentials`

### Step 2: Import Workflows

1. In n8n, click **Workflows** → **Import from File**
2. Import these workflows one by one:
   - `n8n/workflows/sitemap-discovery.json`
   - `n8n/workflows/page-audit.json`
   - `n8n/workflows/seo-autopilot-audit-scheduler.json`
   - `n8n/workflows/seo-autopilot-domain-verification.json`
   - `n8n/workflows/seo-autopilot-crawl-trigger.json`

### Step 3: Configure Environment Variables (Optional)

For PageSpeed and OpenAI APIs:
1. Go to **Settings** → **Environment Variables**
2. Add:
   - `PAGESPEED_API_KEY` = your Google PageSpeed API key
   - `OPENAI_API_KEY` = your OpenAI API key (optional)

### Step 4: Activate Workflows

1. Open each imported workflow
2. Click the **Active** toggle to enable the workflow
3. Save the workflow

### Step 5: Test Connection from Flask API

The Flask API will automatically trigger n8n workflows when you:
- Create a domain and trigger sitemap discovery
- Trigger a page audit

Test by calling:
```bash
POST /api/seo/domains/<id>/discover-pages
POST /api/seo/pages/<id>/audit
```

---

## 🔧 Troubleshooting

### n8n won't start
- Check if port 5678 is already in use
- Try a different port: `npx n8n --port 5679`
- Check Node.js is installed: `node --version`

### Can't access n8n
- Make sure n8n is running (check terminal output)
- Try http://127.0.0.1:5678 instead of localhost
- Check firewall settings

### Database connection fails
- Verify SQL Server is running
- Check credentials match `config.py`
- Test connection from Flask app first

### Workflows not triggering
- Check workflow is **Active** (toggle in n8n UI)
- Verify webhook URLs match Flask API endpoints
- Check Flask API `N8N_BASE_URL` in `config.py`

---

## 📝 Configuration Files

- **n8n config:** `n8n/config.json` (reference only)
- **Flask config:** `config.py` (N8N_BASE_URL, N8N_ENABLED)
- **Workflows:** `n8n/workflows/*.json`

---

## ✅ Verification Checklist

- [ ] n8n is running and accessible at http://localhost:5678
- [ ] Logged in and changed default password
- [ ] MSSQL credentials configured
- [ ] Workflows imported and activated
- [ ] Environment variables set (if using PageSpeed/OpenAI)
- [ ] Flask API can trigger workflows (test from API)

---

**Ready?** Open a new terminal and run `npx n8n` from the `n8n` directory!

