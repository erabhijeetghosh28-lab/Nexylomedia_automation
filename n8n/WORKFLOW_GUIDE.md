# Building n8n Workflows - Complete Guide

## Overview

n8n workflows connect different services and automate tasks. For your Tool Automation Platform, workflows can:
- Trigger actions from your Flask app
- Process data and call your APIs
- Schedule automated tasks
- Send notifications
- Integrate with external services

## Basic Workflow Structure

```
[Trigger] → [Process Data] → [Action]
```

Example:
```
[Webhook] → [Process] → [HTTP Request to Flask] → [Send Email]
```

## Step-by-Step: Creating Your First Workflow

### Example 1: SEO Crawl Trigger Workflow

**Purpose:** Automatically start a crawl when triggered from Flask

1. **Open n8n**: http://localhost:5678
2. **Click "New Workflow"**
3. **Add Webhook Node** (Trigger):
   - Click "+" button → Search "Webhook"
   - Method: POST
   - Path: `/webhook/seo-crawl-trigger`
   - Copy the "Webhook URL" (you'll need this for Flask)
   - Click "Execute Node" to activate webhook

4. **Add Code Node** (Process):
   - Search "Code" node
   - Add code to process incoming data:
   ```javascript
   const data = $input.item.json;
   
   return {
     json: {
       project_id: data.project_id || 1,
       domain_id: data.domain_id,
       scope: data.scope || 'full',
       timestamp: new Date().toISOString()
     }
   };
   ```

5. **Add HTTP Request Node** (Call Your API):
   - Search "HTTP Request"
   - Method: POST
   - URL: `http://127.0.0.1:5000/api/jobs`
   - Authentication: None (or add Bearer token if needed)
   - Body: Use JSON from previous node
   - Send Headers: Add `Content-Type: application/json`

6. **Save Workflow**: Click "Save" (top right)
7. **Activate Workflow**: Toggle "Active" switch (top right)

### Example 2: SEO Webhook Receiver Workflow

**Purpose:** Receive webhook from n8n and process in Flask

1. **Add Webhook Node**:
   - Method: POST
   - Path: `/webhook/seo-crawl-complete`
   - Activate webhook

2. **Add HTTP Request Node**:
   - Method: POST
   - URL: `http://127.0.0.1:5000/api/webhooks/seo`
   - Body: Pass through webhook data

3. **Add IF Node** (Conditional):
   - Check if crawl was successful
   - Route to different actions based on result

## Triggering Workflows from Flask

### Method 1: Using Python Code

```python
from backend.utils.n8n_integration import trigger_workflow

# Trigger a workflow
result = trigger_workflow('seo-crawl-trigger', {
    'project_id': 1,
    'domain_id': 5,
    'scope': 'full'
})
```

### Method 2: Using API Endpoint

```python
# In your Flask route
import requests

response = requests.post(
    'http://127.0.0.1:5000/api/webhooks/trigger',
    json={
        'workflow': 'seo-crawl-trigger',
        'data': {
            'project_id': 1,
            'domain_id': 5,
            'scope': 'full'
        }
    }
)
```

### Method 3: Direct HTTP Request

```bash
curl -X POST http://127.0.0.1:5000/api/webhooks/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": "seo-crawl-trigger",
    "data": {
      "project_id": 1,
      "domain_id": 5
    }
  }'
```

## Workflow Patterns

### Pattern 1: Scheduled Automation

**Use Case:** Run crawls every day at 2 AM

1. Add **Cron** node (trigger)
   - Cron Expression: `0 2 * * *` (2 AM daily)
2. Add **HTTP Request** to call your API
3. Add **IF** node to check results
4. Add **Email** node for notifications

### Pattern 2: Event-Driven

**Use Case:** When domain is added, verify it automatically

1. Flask app triggers workflow: `trigger_workflow('domain-verify', {'domain_id': X})`
2. Workflow calls verification API
3. Workflow calls Flask webhook with results
4. Flask updates database

### Pattern 3: Data Processing Pipeline

**Use Case:** Process crawl results and extract data

1. Webhook receives crawl data
2. **Code** node processes/extracts data
3. **HTTP Request** sends processed data to Flask
4. **Database** node saves results (or HTTP to Flask API)

### Pattern 4: Notification Chain

**Use Case:** Alert when critical issues found

1. **Webhook** receives issue alert
2. **IF** node checks severity
3. **Email** node sends notification
4. **Slack/Discord** node sends message
5. **HTTP Request** logs to Flask

## Common n8n Nodes You'll Use

### Trigger Nodes
- **Webhook**: Receive HTTP requests from Flask
- **Cron**: Schedule tasks (daily, weekly, etc.)
- **Manual Trigger**: Test workflows manually

### Action Nodes
- **HTTP Request**: Call Flask APIs or external services
- **Code**: Process data with JavaScript/Python
- **Email**: Send emails
- **Slack/Discord**: Send messages
- **Database**: Direct database operations (if configured)

### Logic Nodes
- **IF**: Conditional logic
- **Switch**: Multiple conditions
- **Merge**: Combine data from multiple branches
- **Wait**: Pause workflow

## Practical Examples

### Example A: Automated Daily SEO Crawl

```
[Cron: Daily 2 AM]
  ↓
[HTTP Request: GET /api/projects]
  ↓
[Code: Extract active domains]
  ↓
[Loop: For each domain]
  ↓
[HTTP Request: POST /api/jobs (start crawl)]
  ↓
[Wait: 5 minutes]
  ↓
[HTTP Request: GET /api/jobs/{id} (check status)]
  ↓
[IF: Status = completed]
  ↓
[Email: Send crawl report]
```

### Example B: Domain Verification Workflow

```
[Webhook: domain-verify]
  ↓
[HTTP Request: Verify domain ownership]
  ↓
[Code: Process verification result]
  ↓
[HTTP Request: POST /api/webhooks/seo]
  Body: {
    "event_type": "domain_verified",
    "domain_id": {{$json.domain_id}},
    "verified": {{$json.verified}}
  }
```

### Example C: Issue Alert Workflow

```
[Webhook: seo-issue-detected]
  ↓
[IF: severity = critical]
  ↓
[HTTP Request: POST /api/webhooks/seo]
  Body: {
    "event_type": "issue_detected",
    "issue": {{$json}}
  }
  ↓
[Email: Send alert]
  ↓
[Slack: Post to channel]
```

## Testing Workflows

1. **Test Manually**:
   - Click "Execute Workflow" button
   - Or use "Manual Trigger" node

2. **Test with Sample Data**:
   - Click node → "Test Step"
   - Add sample JSON data
   - Execute to see output

3. **Test from Flask**:
   ```python
   trigger_workflow('your-workflow-name', {
       'test': True,
       'data': 'sample'
   })
   ```

## Best Practices

1. **Name Your Workflows Clearly**: `seo-daily-crawl`, `domain-verification`
2. **Add Descriptions**: Explain what each workflow does
3. **Use Error Handling**: Add "On Error" workflow branches
4. **Log Everything**: Log workflow executions
5. **Test Before Production**: Test with sample data first
6. **Document Webhook URLs**: Save webhook URLs for Flask integration

## Getting Webhook URLs

After creating a Webhook node:
1. Click the Webhook node
2. Find "Webhook URL" in the node settings
3. Copy the full URL (e.g., `http://localhost:5678/webhook/seo-crawl-trigger`)
4. Use this URL in your Flask code

## Workflow Templates Location

Pre-made workflow templates are in: `n8n/workflows/`

Import them:
1. In n8n: Click "Workflows" → "Import from File"
2. Select JSON file from `workflows/` folder
3. Customize for your needs

## Next Steps

1. Start n8n: `n8n start` or use the batch files
2. Create your first workflow using the examples above
3. Test the workflow manually
4. Connect it to your Flask app
5. Monitor and iterate















