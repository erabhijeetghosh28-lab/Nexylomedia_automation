# n8n Workflow Automation Setup

n8n is an open-source workflow automation tool that integrates with your Tool Automation Platform.

## What is n8n?

n8n allows you to create automated workflows that connect different services and APIs without writing code. It's like Zapier but self-hosted and open-source.

## Installation Options

### Option 1: Docker (Recommended)

1. **Install Docker Desktop** (if not already installed)
   - Download from: https://www.docker.com/products/docker-desktop

2. **Start n8n using Docker Compose:**
   ```bash
   cd n8n
   docker-compose up -d
   ```

3. **Access n8n:**
   - Open browser: http://localhost:5678
   - Login: admin / changeme (change this!)

### Option 2: npm (Node.js)

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/

2. **Install n8n globally:**
   ```bash
   npm install n8n -g
   ```

3. **Start n8n:**
   ```bash
   n8n start
   ```

4. **Access n8n:**
   - Open browser: http://localhost:5678

### Option 3: Python Package (for integration only)

If you only need to trigger n8n workflows from Python:

```bash
pip install requests
```

## Configuration

1. **Update n8n/config.json** with your settings:
   - API endpoints
   - Database connection
   - Webhook paths

2. **Change default credentials** in `docker-compose.yml`:
   ```yaml
   N8N_BASIC_AUTH_USER=your-username
   N8N_BASIC_AUTH_PASSWORD=your-secure-password
   ```

## Workflow Structure

Workflows are stored in `n8n/workflows/` directory:

- `seo-autopilot-*.json` - SEO Autopilot workflows
- `prospect-radar-*.json` - Prospect Radar workflows
- `marketing-research-*.json` - Marketing Research workflows
- `campaign-management-*.json` - Campaign Management workflows
- `ads-integration-*.json` - Ads Integration workflows

## Integration with Your App

### From Python Backend

```python
from backend.utils.n8n_integration import trigger_workflow

# Trigger a workflow
result = trigger_workflow('seo-autopilot-crawl-trigger', {
    'domain_id': 123,
    'scope': 'full'
})
```

### From Frontend

```javascript
// Trigger workflow via API
fetch('http://127.0.0.1:5000/api/webhooks/trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        workflow: 'seo-autopilot-crawl-trigger',
        data: { domain_id: 123 }
    })
});
```

## Common Workflows

### 1. SEO Autopilot Workflows
- **Crawl Trigger**: Automatically start crawls on schedule
- **Domain Verification**: Verify domains when added
- **Audit Scheduler**: Schedule regular audits
- **Alert Notifications**: Send alerts on critical issues

### 2. Prospect Radar Workflows
- **Lead Enrichment**: Enrich prospect data automatically
- **Lead Scoring**: Score leads based on criteria

### 3. Marketing Research Workflows
- **Keyword Monitoring**: Monitor keyword rankings
- **Competitor Tracking**: Track competitor changes

### 4. Campaign Management Workflows
- **Report Generator**: Auto-generate reports
- **Performance Alerts**: Alert on campaign performance

### 5. Ads Integration Workflows
- **Platform Sync**: Sync data from ad platforms
- **Budget Alerts**: Alert on budget thresholds

## Importing Workflows

1. Open n8n interface: http://localhost:5678
2. Click "Workflows" → "Import from File"
3. Select JSON file from `n8n/workflows/` directory
4. Configure workflow settings

## Webhook Endpoints

Your Flask app provides webhook endpoints at:
- `/api/webhooks/seo` - SEO Autopilot webhooks
- `/api/webhooks/prospect-radar` - Prospect Radar webhooks
- `/api/webhooks/marketing-research` - Marketing Research webhooks
- `/api/webhooks/campaign-management` - Campaign Management webhooks
- `/api/webhooks/ads-integration` - Ads Integration webhooks

## Example: Creating a Workflow

1. Open n8n interface
2. Click "New Workflow"
3. Add nodes:
   - **Webhook** (trigger) - receives data from your app
   - **HTTP Request** - calls your API
   - **Code** - process data
   - **Database** - save to database
   - **Email/Slack** - send notifications
4. Connect nodes and configure
5. Save workflow
6. Export to `n8n/workflows/` directory

## Troubleshooting

### n8n won't start
- Check Docker is running (if using Docker)
- Check port 5678 is not in use
- Check logs: `docker-compose logs n8n`

### Webhooks not working
- Verify Flask server is running
- Check CORS settings
- Verify webhook URL in n8n matches your API

### Can't connect to database
- Update database config in `n8n/config.json`
- Verify database credentials
- Check firewall settings

## Next Steps

1. Start n8n: `docker-compose up -d` (in n8n folder)
2. Access n8n: http://localhost:5678
3. Import workflows from `n8n/workflows/` directory
4. Configure workflows for your use cases
5. Integrate with your Flask API endpoints

