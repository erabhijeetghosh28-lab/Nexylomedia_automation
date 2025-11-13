# Setting Up n8n Workflows for SEO Autopilot

Complete guide to import and configure workflows in n8n.

## Prerequisites

- ✅ n8n running at http://localhost:5678
- ✅ PageSpeed API key obtained (see `GET_PAGESPEED_API_KEY.md`)
- ✅ Database credentials ready (MSSQL)

## Step 1: Add PageSpeed API Key to n8n

### Method 1: Environment Variables (Recommended)

1. Open n8n: **http://localhost:5678**
2. Click **Settings** (gear icon) in the left sidebar
3. Go to **Environment Variables**
4. Click **"Add Variable"**
5. Add:
   - **Name**: `PAGESPEED_API_KEY`
   - **Value**: `YOUR_API_KEY_HERE` (paste your key from Google Cloud Console)
6. Click **"Save"**

### Method 2: Add to Workflow Node (Alternative)

If you prefer to add the key directly in the workflow:
1. Open the workflow
2. Click on the **"PageSpeed API"** node
3. In the query parameters, replace `={{ $env.PAGESPEED_API_KEY }}` with your actual key
4. **Note:** This is less secure - Method 1 is preferred

## Step 2: Set Up MSSQL Database Credentials

1. In n8n, go to **Credentials** (left sidebar)
2. Click **"Add Credential"**
3. Search for **"Microsoft SQL Server"**
4. Fill in:
   - **Host**: `localhost` (or your SQL Server address)
   - **Database**: `nexylo`
   - **User**: `nexylo`
   - **Password**: `Nexylomedia@25`
   - **Port**: `1433`
5. Click **"Save"** and name it: `mssql-credentials`

## Step 3: Import Workflows

### Option A: Import from Files

1. In n8n, click **"Workflows"** (left sidebar)
2. Click **"Import from File"** button (top right)
3. Navigate to `n8n/workflows/` directory
4. Import these files:
   - **`sitemap-discovery.json`** - For discovering sitemaps and pages
   - **`page-audit.json`** - For auditing pages with PageSpeed

### Option B: Copy-Paste Workflow JSON

1. Open the workflow JSON file (e.g., `sitemap-discovery.json`)
2. Copy the entire JSON content
3. In n8n, click **"Workflows"** → **"Import from File"** → **"Paste"**
4. Paste the JSON and click **"Import"**

## Step 4: Configure Workflows

### Sitemap Discovery Workflow

After importing `sitemap-discovery.json`:

1. **Activate the Webhook**:
   - Click on the **"Webhook"** node
   - Click **"Execute Node"** to activate it
   - Note the webhook URL: `http://localhost:5678/webhook/sitemap-discovery`

2. **Configure Database Node**:
   - Click on the **"Check Database"** or database nodes
   - Select your `mssql-credentials` from the credentials dropdown

3. **Test the Workflow**:
   - Click **"Execute Workflow"** button (top right)
   - Or use the test data provided

### Page Audit Workflow

After importing `page-audit.json`:

1. **Activate the Webhook**:
   - Click on the **"Webhook"** node
   - Click **"Execute Node"** to activate it
   - Note the webhook URL: `http://localhost:5678/webhook/page-audit`

2. **Verify PageSpeed API Key**:
   - Click on the **"PageSpeed API"** node
   - Ensure it uses `={{ $env.PAGESPEED_API_KEY }}`
   - If you see an error, make sure you added the environment variable in Step 1

3. **Optional: Configure GPT Node** (if using OpenAI):
   - Click on the **"GPT Analysis"** node
   - It's disabled by default (only runs if `gpt_enabled: true` in job data)
   - To enable GPT features:
     - Add OpenAI credentials in n8n
     - Update the workflow to check for GPT access

## Step 5: Activate Workflows

1. For each workflow, toggle the **"Active"** switch (top right)
2. Active workflows will listen for webhook requests
3. You can test them from your Flask app or directly via curl

## Step 6: Test Workflows

### Test Sitemap Discovery

From your terminal:

```bash
curl -X POST http://localhost:5678/webhook/sitemap-discovery \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": 1,
    "organization_id": 1,
    "user_id": 1,
    "tool_key": "seo-autopilot",
    "input_data": {
      "domain_url": "https://example.com",
      "domain_id": "domain-example-com",
      "seo_domain_id": 1
    },
    "callback_url": "http://127.0.0.1:5000/api/webhook/n8n/callback"
  }'
```

### Test Page Audit

```bash
curl -X POST http://localhost:5678/webhook/page-audit \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": 1,
    "organization_id": 1,
    "user_id": 1,
    "tool_key": "seo-autopilot",
    "gpt_enabled": false,
    "input_data": {
      "pages": ["https://example.com", "https://example.com/about"]
    },
    "callback_url": "http://127.0.0.1:5000/api/webhook/n8n/callback"
  }'
```

## Troubleshooting

### PageSpeed API Returns Error

- **Check API key is correct**: Verify in n8n Environment Variables
- **Check API quota**: Make sure you haven't exceeded 25,000 requests/day
- **Check URL format**: URLs must be valid (start with http:// or https://)

### Database Connection Fails

- **Verify SQL Server is running**: Check if port 1433 is accessible
- **Check credentials**: Verify username/password in n8n credentials
- **Check firewall**: Ensure SQL Server allows connections

### Webhook Not Receiving Requests

- **Verify workflow is active**: Toggle should be ON
- **Check webhook URL**: Ensure Flask app is calling the correct URL
- **Check n8n logs**: View logs in n8n interface (bottom panel)

### Workflow Execution Fails

- **Check node errors**: Click on failed nodes to see error messages
- **Verify all credentials**: Ensure MSSQL and API keys are configured
- **Test individual nodes**: Execute nodes one by one to find the issue

## Next Steps

Once workflows are configured and tested:

1. ✅ Workflows are active and receiving webhooks
2. ✅ Test from Flask app using the SEO Autopilot page
3. ✅ Monitor workflow executions in n8n dashboard
4. ✅ Check callbacks are received by Flask app

## Workflow URLs Summary

After activation, your webhook URLs will be:
- **Sitemap Discovery**: `http://localhost:5678/webhook/sitemap-discovery`
- **Page Audit**: `http://localhost:5678/webhook/page-audit`

These URLs are automatically used by your Flask app when triggering workflows.

