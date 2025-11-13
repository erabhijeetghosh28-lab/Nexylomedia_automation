# n8n Setup for Multi-Tenant System

This guide explains how to set up n8n workflows for the multi-tenant tool access system.

## Prerequisites

1. **n8n installed** (see `INSTALL_N8N.md`)
2. **Database credentials** configured (MSSQL)
3. **API credentials**:
   - PageSpeed Insights API key
   - OpenAI API key (for GPT features)

## Workflow Files

Two workflow files are provided:

1. **`sitemap-discovery.json`** - Discovers sitemap and saves pages to database
2. **`page-audit.json`** - Audits individual pages using PageSpeed API and optional GPT analysis

## Import Workflows

1. Open n8n: `http://localhost:5678`
2. Click **"Workflows"** → **"Import from File"**
3. Import `sitemap-discovery.json` and `page-audit.json`

## Configure Credentials

### 1. MSSQL Database Credentials

1. Go to **Credentials** → **Add Credential**
2. Select **Microsoft SQL Server**
3. Configure:
   - **Host**: Your SQL Server host (e.g., `localhost`)
   - **Database**: `nexylo`
   - **User**: `nexylo`
   - **Password**: `Nexylomedia@25`
   - **Port**: `1433`

Save as: `mssql-credentials`

### 2. PageSpeed Insights API

1. Get API key from: https://developers.google.com/speed/docs/insights/v5/get-started
2. Add as environment variable: `PAGESPEED_API_KEY`
   - Or configure in n8n settings → Environment Variables

### 3. OpenAI API (Optional, for GPT features)

1. Get API key from: https://platform.openai.com/api-keys
2. Go to **Credentials** → **Add Credential**
3. Select **OpenAI**
4. Enter your API key
5. Save as: `openai-credentials`

**Note**: GPT node is disabled by default. Enable it only when org has `gpt` tool enabled.

## Workflow Configuration

### Sitemap Discovery Workflow

1. **Webhook URL**: Configure the webhook path as `sitemap-discovery`
2. **Database Node**: Ensure MSSQL credentials are set
3. **Save Pages Node**: Configure to save discovered pages

The workflow:
- Receives job data from Flask API
- Validates tool access (done by API, but double-checked)
- Fetches sitemap.xml
- Parses URLs
- Saves to database
- Sends callback to `/api/webhook/n8n/callback`

### Page Audit Workflow

1. **Webhook URL**: Configure as `page-audit`
2. **PageSpeed API Node**: Uses `PAGESPEED_API_KEY` from environment
3. **GPT Analysis Node**: 
   - Disabled by default
   - Only enabled when `gpt_enabled: true` in job data
   - Uses `temperature=0.0` and `maxTokens=1000` for deterministic output

The workflow:
- Receives job with list of pages
- Splits into individual page tasks
- Calls PageSpeed API for each page
- Optionally calls GPT for analysis (if enabled)
- Aggregates results
- Sends callback with page_tasks array

## Environment Variables

Add these to n8n environment (Settings → Environment Variables):

```bash
PAGESPEED_API_KEY=your_pagespeed_api_key
OPENAI_API_KEY=your_openai_api_key  # Optional
```

## Testing Workflows

### Test Sitemap Discovery

```bash
curl -X POST http://localhost:5678/webhook/sitemap-discovery \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": 1,
    "organization_id": 1,
    "tool_key": "seo-autopilot",
    "input_data": {
      "url": "https://example.com"
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
    "tool_key": "seo-autopilot",
    "gpt_enabled": false,
    "input_data": {
      "pages": ["https://example.com", "https://example.com/about"]
    },
    "callback_url": "http://127.0.0.1:5000/api/webhook/n8n/callback"
  }'
```

## Important Notes

1. **Tool Access Validation**: The Flask API validates `canUseTool` before triggering workflows. n8n workflows also include validation nodes as a safety check.

2. **GPT Features**: GPT analysis is only performed when:
   - `gpt_enabled: true` in job data
   - Organization has `gpt` tool enabled
   - OpenAI credentials are configured

3. **Callback URL**: Workflows must send results to `/api/webhook/n8n/callback` to update `audit_jobs` and `page_tasks` tables.

4. **Error Handling**: Workflows should handle errors gracefully and send error status to callback.

5. **Quota Enforcement**: Quota is checked and reserved by Flask API before triggering workflow. n8n should not make additional quota checks, but should respect access grants.

## Troubleshooting

- **Workflow not triggering**: Check n8n is running and webhook URL is correct
- **Database connection errors**: Verify MSSQL credentials and network access
- **PageSpeed API errors**: Check API key is valid and quota not exceeded
- **GPT errors**: Verify OpenAI credentials and that GPT is enabled for org
- **Callback failures**: Ensure Flask API is accessible from n8n

