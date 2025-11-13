# Page Audit Workflow - Start Checklist

## ✅ Pre-Import Verification

The workflow is ready to import. All backend endpoints are configured correctly:

### Backend Endpoints (Already Set Up)
- ✅ `/api/internal/seo/audit-page` - Internal SEO audit endpoint
- ✅ `/api/internal/pagespeed/analyze` - Internal PageSpeed endpoint  
- ✅ `/api/webhooks/n8n/callback` - n8n callback endpoint
- ✅ Internal API blueprint registered in `app.py`

### Workflow Configuration
- ✅ Workflow name: `SEO Page Audit - Comprehensive`
- ✅ Webhook path: `page-audit-comprehensive`
- ✅ All nodes properly configured
- ✅ JSON syntax validated

## 📋 Steps to Start

### 1. Import Workflow into n8n
1. Open n8n (usually `http://localhost:5678`)
2. Click **"Workflows"** → **"Import from File"**
3. Select: `n8n/workflows/page-audit-comprehensive.json`
4. Click **"Import"**

### 2. Verify n8n Configuration
Check that n8n can reach your Flask API:
- n8n is running on: `http://localhost:5678` (default)
- Flask API is running on: `http://127.0.0.1:5000` (default)

### 3. Test the Workflow
1. After import, open the workflow in n8n editor
2. Click the **"Webhook"** node
3. Copy the **"Production URL"** or **"Test URL"**
4. You can test by making a POST request to this URL with sample data

### 4. Verify Workflow Activation
- Make sure the workflow is **Active** (toggle switch in top right)
- The webhook should be listening on: `/webhook/page-audit-comprehensive`

## 🔧 Configuration Check

### Flask Config (`config.py`)
```python
N8N_BASE_URL = 'http://localhost:5678'  # Should match your n8n URL
N8N_ENABLED = True  # Should be True
```

### n8n Webhook URL
The workflow expects to call Flask at:
- `http://127.0.0.1:5000/api/internal/seo/audit-page`
- `http://127.0.0.1:5000/api/internal/pagespeed/analyze`
- `http://127.0.0.1:5000/api/webhooks/n8n/callback`

If your Flask is running on a different port/URL, update these URLs in the workflow nodes.

## 🧪 Quick Test

Once imported, you can trigger an audit from your frontend:
1. Go to SEO → Pages
2. Click "Run Audit" on any page
3. Select strategy (mobile/desktop/both)
4. The workflow will automatically:
   - Gather SEO audit data
   - Run PageSpeed for selected strategies
   - Create suggestions from vitals
   - Trigger AI optimization (second workflow)

## ⚠️ Troubleshooting

### If workflow import fails:
- Check that JSON is valid (we've already validated it)
- Make sure you're using a compatible n8n version (0.200+)

### If workflow doesn't trigger:
- Check `N8N_ENABLED` in `config.py` is `True`
- Verify `N8N_BASE_URL` matches your n8n instance
- Check Flask logs for errors

### If internal API calls fail:
- Verify Flask is running on `http://127.0.0.1:5000`
- Check that `internal_bp` is registered in `app.py` (already done)
- Test endpoints manually:
  ```bash
  curl -X POST http://127.0.0.1:5000/api/internal/seo/audit-page \
    -H "Content-Type: application/json" \
    -d '{"page_url":"https://example.com","domain_url":"https://example.com"}'
  ```

## ✅ You're Ready!

The workflow is ready to import and use. No code changes needed - everything is already configured on the backend side!

