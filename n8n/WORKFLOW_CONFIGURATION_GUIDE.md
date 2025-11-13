# n8n Workflow Configuration Guide

## ✅ Current Status
All workflows are successfully imported and visible in n8n!

## 📋 Next Steps: Configure Each Workflow

### ⚠️ Important: Update MSSQL Credentials

Each workflow with database nodes needs to use your `mssql-credentials`. Here's how:

### Step 1: Configure Database Nodes

For each workflow that has database queries, you need to:

1. **Open the workflow** in n8n
2. **Click on each database node** (nodes with `?` icon that say "Check Database" or "Get Pending Audits" or "Save Pages to DB")
3. **Set Credential**: 
   - Click on the credential dropdown
   - Select **`mssql-credentials`** (the one you created earlier)
4. **Save the node**
5. **Save the workflow**

**Workflows that need MSSQL credential:**
- ✅ SEO Autopilot - Audit Scheduler (Get Pending Audits node)
- ✅ SEO Sitemap Discovery (Check Database, Save Pages to DB nodes)
- ❓ Others - check each database node

### Step 2: Verify Webhook Paths

Make sure webhook paths match what Flask API expects:

1. **SEO Autopilot - Crawl Trigger:**
   - Webhook path should be: `seo-crawl-trigger` or `seo-autopilot-crawl-trigger`
   - This is triggered from Flask when you call domain discovery

2. **SEO Autopilot - Domain Verification:**
   - Webhook path should be: `domain-verification` or `seo-autopilot-domain-verification`

3. **Page Audit Workflow:**
   - Webhook path: `page-audit` (this one should already work)

4. **Sitemap Discovery:**
   - Webhook path: `sitemap-discovery` (this one should already work)

**To check/update webhook paths:**
- Click on the Webhook node
- Check "Path" field
- Update if needed
- Save

### Step 3: Verify Callback URLs

All workflows should call back to Flask API:

- **Callback URL:** `http://127.0.0.1:5000/api/webhooks/n8n/callback`

**Check these nodes:**
- "Callback to Flask" nodes
- "Send Callback" nodes
- "Respond to Webhook" nodes

Update if they point to a different URL.

### Step 4: Activate Workflows

1. **Open each workflow**
2. **Toggle "Active" switch** (top right, or in workflow settings)
3. **Save**

**Recommended activation order:**
1. ✅ Sitemap Discovery (should already be active if working)
2. ✅ Page Audit (should already be active if working)
3. ⚠️ SEO Autopilot - Crawl Trigger (activate after configuring)
4. ⚠️ SEO Autopilot - Domain Verification (activate after configuring)
5. ⚠️ SEO Autopilot - Audit Scheduler (activate after configuring - runs on schedule)

### Step 5: Test Workflows

#### Test 1: Sitemap Discovery
```bash
# From Flask API
POST /api/seo/domains/<domain_id>/discover-pages
```

#### Test 2: Page Audit
```bash
# From Flask API
POST /api/seo/pages/<page_id>/audit
```

#### Test 3: Crawl Trigger (Manual)
Trigger from n8n UI:
- Open "SEO Autopilot - Crawl Trigger"
- Click "Execute Workflow" button
- Or use webhook: `POST http://localhost:5678/webhook/seo-crawl-trigger`

### Step 6: Check for Environment Variables

If workflows use PageSpeed or OpenAI APIs, you need environment variables:

1. In n8n, go to **Settings** (gear icon) → **Environment Variables**
2. Add:
   - `PAGESPEED_API_KEY` = your Google PageSpeed API key
   - `OPENAI_API_KEY` = your OpenAI API key (optional)

## 🔧 Troubleshooting

### Database Connection Errors
- Verify `mssql-credentials` is set in all database nodes
- Test connection from credential page
- Check that SQL Server is running

### Webhook Not Triggering
- Verify workflow is **Active**
- Check webhook path matches Flask API calls
- Verify Flask API `N8N_BASE_URL` is correct in `config.py`

### Callback Failures
- Verify Flask API is running on `http://127.0.0.1:5000`
- Check callback URL in workflow nodes
- Verify `/api/webhooks/n8n/callback` endpoint exists in Flask

### Schedule Not Working
- For "Audit Scheduler", check schedule trigger is configured
- Default is daily at midnight - adjust in Schedule Trigger node

## 📝 Workflow Summary

| Workflow | Status | Webhook Path | Purpose |
|----------|--------|--------------|---------|
| Sitemap Discovery | ✅ Imported | `sitemap-discovery` | Discovers pages from sitemap |
| Page Audit | ✅ Imported | `page-audit` | Audits pages with PageSpeed |
| Crawl Trigger | ✅ Imported | `seo-crawl-trigger` | Triggers domain crawling |
| Domain Verification | ✅ Imported | `domain-verification` | Verifies domain accessibility |
| Audit Scheduler | ✅ Imported | Schedule (daily) | Scheduled audits |

## ✅ Completion Checklist

- [ ] All database nodes configured with `mssql-credentials`
- [ ] Webhook paths verified
- [ ] Callback URLs point to `http://127.0.0.1:5000/api/webhooks/n8n/callback`
- [ ] Environment variables set (if using PageSpeed/OpenAI)
- [ ] All workflows activated
- [ ] Tested at least one workflow from Flask API

