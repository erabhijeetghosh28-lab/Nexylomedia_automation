# n8n Setup Checklist

## ✅ Completed
- [x] n8n server started and accessible at http://localhost:5678
- [x] n8n UI opened and workflows dashboard visible

## 📋 Next Steps

### Step 1: Configure MSSQL Database Credentials

1. In n8n UI, click on **"Credentials"** tab (top navigation)
2. Click **"Add Credential"** button
3. Search for **"Microsoft SQL Server"** and select it
4. Fill in the connection details:
   - **Host:** `localhost` (or your SQL Server host from config.py)
   - **Database:** `nexylo`
   - **User:** `nexylo`
   - **Password:** `Nexylomedia@25`
   - **Port:** `1433`
   - **Additional Options:** Leave defaults (or check "Trust Server Certificate" if needed)
5. Click **"Save"** or **"Test Connection"** first to verify
6. Name the credential: `mssql-credentials` (this is what workflows will reference)

### Step 2: Import Workflow Files

1. In n8n UI, go to **"Workflows"** tab
2. Click **"Create Workflow"** → **"Import from File"** (or use the import icon)
3. Import these files one by one from `n8n/workflows/`:
   
   **Priority Workflows (SEO Autopilot):**
   - `sitemap-discovery.json` - Discovers sitemaps and pages
   - `page-audit.json` - Audits individual pages with PageSpeed
   - `seo-autopilot-audit-scheduler.json` - Scheduled audits
   - `seo-autopilot-crawl-trigger.json` - Crawl trigger
   - `seo-autopilot-domain-verification.json` - Domain verification
   
   **Optional (Other Tools):**
   - `prospect-radar-lead-enrichment.json`
   - `marketing-research-keyword-monitoring.json`
   - `campaign-management-report-generator.json`
   - `ads-integration-sync.json`

4. After importing each workflow, you'll need to:
   - Update MSSQL credential reference to use `mssql-credentials` you just created
   - Check webhook URLs match Flask API endpoints
   - Save the workflow

### Step 3: Activate Workflows

1. For each imported workflow:
   - Open the workflow
   - Toggle the **"Inactive"** switch to **"Active"** (top right or in workflow settings)
   - Save the workflow

### Step 4: Configure Environment Variables (Optional)

If you want to use PageSpeed or OpenAI APIs:

1. In n8n, go to **Settings** (gear icon) → **Environment Variables**
2. Add:
   - `PAGESPEED_API_KEY` = `your-google-pagespeed-api-key`
   - `OPENAI_API_KEY` = `your-openai-api-key` (optional, for GPT features)

### Step 5: Test Connection from Flask API

1. Make sure Flask API is running (`python app.py`)
2. Check `config.py` has correct n8n settings:
   ```python
   N8N_BASE_URL = 'http://localhost:5678'
   N8N_ENABLED = True
   ```
3. Test by triggering a workflow:
   - Create a domain: `POST /api/seo/domains`
   - Trigger sitemap discovery: `POST /api/seo/domains/<id>/discover-pages`

### Step 6: Verify Webhook URLs

Check that workflows have correct webhook URLs:
- Flask callback: `http://127.0.0.1:5000/api/webhooks/n8n/callback`
- Webhook paths should match what Flask API expects

---

## 🔧 Troubleshooting

### Can't connect to database
- Verify SQL Server is running
- Check credentials match `config.py`
- Test connection from Flask app first
- Ensure "Trust Server Certificate" is checked if using self-signed cert

### Workflows not triggering
- Verify workflow is **Active** (toggle switch)
- Check webhook URL in workflow matches Flask API
- Verify Flask API `N8N_BASE_URL` is correct
- Check n8n execution logs for errors

### Import errors
- Make sure all required credentials are configured first
- Some workflows may need manual adjustment of node configurations
- Check for missing environment variables

---

## 📝 Current Database Settings (from config.py)

```
DB_SERVER: localhost (or your SQL Server)
DB_NAME: nexylo
DB_USERNAME: nexylo
DB_PASSWORD: Nexylomedia@25
DB_PORT: 1433
```

Use these same values when configuring n8n MSSQL credential.

---

## ✅ Completion Criteria

- [ ] MSSQL credential created and tested
- [ ] All SEO Autopilot workflows imported
- [ ] Workflows are activated (toggle to Active)
- [ ] Flask API can successfully trigger workflows
- [ ] Webhook callbacks working (check audit_jobs table updates

