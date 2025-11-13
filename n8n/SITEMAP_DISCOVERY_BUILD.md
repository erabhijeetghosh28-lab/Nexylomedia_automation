# Building Sitemap Discovery Workflow - Step by Step (Updated with robots.txt)

## What This Workflow Does

1. Receives webhook from Flask API when domain discovery is triggered
2. **Fetches robots.txt to find sitemap URL and check crawl permissions**
3. Verifies crawling is allowed
4. Fetches sitemap.xml from the URL found in robots.txt
5. Parses XML to extract all page URLs
6. Handles sitemap index files (nested sitemaps)
7. Saves discovered pages to `seo_pages` table
8. Updates domain page count, sitemap URL, and robots.txt status
9. Sends callback to Flask API

## Expected Input from Flask API

When Flask triggers this workflow, it sends:
```json
{
  "job_id": 123,
  "organization_id": 1,
  "user_id": 1,
  "job_type": "sitemap_discovery",
  "tool_key": "seo-autopilot",
  "input_data": {
    "domain_id": "domain-nexylomedia-com",
    "domain_url": "https://nexylomedia.com",
    "seo_domain_id": 5
  },
  "callback_url": "http://127.0.0.1:5000/api/webhooks/n8n/callback"
}
```

## Step-by-Step: Building in n8n

### Step 1: Create New Workflow

1. In n8n, click **"Create Workflow"**
2. Name it: **"SEO Sitemap Discovery"**

### Step 2: Add Webhook Trigger

1. Click **"+"** button → Search **"Webhook"**
2. Select **"Webhook"** node
3. Configure:
   - **HTTP Method:** `POST`
   - **Path:** `sitemap-discovery`
   - **Response Mode:** `Response Node` (so we can respond at the end)
4. **Copy the webhook URL** (e.g., `http://localhost:5678/webhook/sitemap-discovery`)
5. Click **"Execute Node"** to activate the webhook

### Step 3: Validate Input Data

1. Add **"Code"** node (search "Code")
2. Connect it after Webhook
3. Add this code:
```javascript
// Extract and validate input data
const data = $input.item.json;

// Validate required fields
if (!data.job_id || !data.organization_id || !data.input_data) {
  throw new Error('Missing required fields: job_id, organization_id, or input_data');
}

const inputData = typeof data.input_data === 'string' 
  ? JSON.parse(data.input_data) 
  : data.input_data;

// Return structured data for next nodes
return {
  json: {
    job_id: data.job_id,
    organization_id: data.organization_id,
    tool_key: data.tool_key || 'seo-autopilot',
    domain_url: inputData.domain_url,
    domain_id: inputData.domain_id,
    seo_domain_id: inputData.seo_domain_id,
    callback_url: data.callback_url || 'http://127.0.0.1:5000/api/webhooks/n8n/callback'
  }
};
```

### Step 4: Fetch robots.txt ⭐ NEW

1. Add **"HTTP Request"** node
2. Connect it after Validate Input
3. Configure:
   - **Method:** `GET`
   - **URL:** `={{ $json.domain_url }}/robots.txt`
   - **Options:**
     - Timeout: `10000` (10 seconds)
     - Follow Redirect: `true`
     - Allow Unauthorized Certificates: `true` (if needed)

### Step 5: Parse robots.txt ⭐ NEW

1. Add **"Code"** node
2. Connect it after Fetch robots.txt
3. Add this code:
```javascript
// Parse robots.txt to find sitemap URL and check crawl permissions
const robotsResponse = $input.item.json;
const domainData = $('Validate Input Data').item.json;

// Get robots.txt content
const robotsContent = robotsResponse.body || robotsResponse.data || '';
const robotsText = typeof robotsContent === 'string' ? robotsContent : JSON.stringify(robotsContent);

// Find sitemap URL(s) - robots.txt can have multiple Sitemap: lines
const sitemapRegex = /^[Ss]itemap:\s*(.+)$/gim;
const sitemapUrls = [];
let match;

while ((match = sitemapRegex.exec(robotsText)) !== null) {
  const sitemapUrl = match[1].trim();
  if (sitemapUrl) {
    // Make URL absolute if relative
    const absoluteUrl = sitemapUrl.startsWith('http') 
      ? sitemapUrl 
      : `${domainData.domain_url}${sitemapUrl.startsWith('/') ? '' : '/'}${sitemapUrl}`;
    sitemapUrls.push(absoluteUrl);
  }
}

// Check if crawling is allowed (check User-agent: * and /)
const userAgentSection = robotsText.split(/^User-agent:/gim);
let crawlingAllowed = true;

// Check for User-agent: * section
for (const section of userAgentSection) {
  if (section.includes('User-agent: *') || section.trim().startsWith('*')) {
    const rules = section.toLowerCase();
    // Check if there's a Disallow: / rule
    if (rules.includes('disallow: /') || rules.includes('disallow:/')) {
      crawlingAllowed = false;
      break;
    }
  }
}

// If no sitemap found in robots.txt, use default
const defaultSitemapUrl = `${domainData.domain_url}/sitemap.xml`;
const sitemapUrl = sitemapUrls.length > 0 ? sitemapUrls[0] : defaultSitemapUrl;

return {
  json: {
    ...domainData,
    sitemap_url: sitemapUrl,
    sitemap_urls: sitemapUrls, // All sitemaps found
    robots_txt_found: robotsResponse.statusCode === 200,
    robots_txt_content: robotsText,
    crawling_allowed: crawlingAllowed,
    robots_txt_allowed: crawlingAllowed
  }
};
```

### Step 6: Check Crawl Permission ⭐ NEW

1. Add **"Code"** node (or use **"IF"** node for conditional)
2. Connect it after Parse robots.txt
3. Add this code:
```javascript
// Check if crawling is allowed
const data = $input.item.json;

if (!data.crawling_allowed) {
  throw new Error('Crawling not allowed by robots.txt - Disallow: / rule found');
}

if (!data.sitemap_url) {
  throw new Error('No sitemap URL found in robots.txt and default sitemap not available');
}

return {
  json: data
};
```

**Alternative:** Use **"IF"** node:
- Condition: `{{ $json.crawling_allowed }}` equals `true`
- True → Continue to Fetch Sitemap
- False → Send error callback

### Step 7: Fetch Sitemap

1. Add **"HTTP Request"** node
2. Connect it after Check Permission
3. Configure:
   - **Method:** `GET`
   - **URL:** `={{ $json.sitemap_url }}` ⭐ (from robots.txt, not hardcoded)
   - **Options:**
     - Timeout: `30000` (30 seconds)
     - Follow Redirect: `true`
     - Allow Unauthorized Certificates: `true`

### Step 8: Parse Sitemap XML

1. Add **"Code"** node
2. Connect it after Fetch Sitemap
3. Add this code:
```javascript
// Parse sitemap XML and extract URLs
const sitemapResponse = $input.item.json;
const domainData = $('Parse robots.txt').item.json;

// Get sitemap content
const xmlContent = sitemapResponse.body || sitemapResponse.data || JSON.stringify(sitemapResponse);
const xmlString = typeof xmlContent === 'string' ? xmlContent : JSON.stringify(xmlContent);

// Check if it's a sitemap index (contains <sitemapindex>)
const isSitemapIndex = xmlString.includes('<sitemapindex') || xmlString.includes('<sitemapindex>');

let urls = [];

if (isSitemapIndex) {
  // Parse sitemap index - extract sitemap URLs
  const sitemapRegex = /<loc[^>]*>(.*?)<\/loc>/gi;
  let match;
  
  while ((match = sitemapRegex.exec(xmlString)) !== null) {
    const sitemapUrl = match[1].trim();
    if (sitemapUrl && sitemapUrl.endsWith('.xml')) {
      urls.push({ type: 'sitemap', url: sitemapUrl });
    }
  }
  
  // For sitemap index, note nested sitemaps exist
  return [{
    json: {
      ...domainData,
      is_sitemap_index: true,
      nested_sitemaps: urls.map(u => u.url),
      note: 'Sitemap index found - contains nested sitemaps. Currently using first sitemap.'
    }
  }];
} else {
  // Parse regular sitemap - extract page URLs
  const urlRegex = /<loc[^>]*>(.*?)<\/loc>/gi;
  let match;
  
  while ((match = urlRegex.exec(xmlString)) !== null) {
    const url = match[1].trim();
    if (url && url.startsWith('http')) {
      urls.push({ type: 'page', url: url });
    }
  }
}

// Limit to first 100 URLs (adjust based on plan limits)
const limitedUrls = urls.filter(u => u.type === 'page').slice(0, 100);

return limitedUrls.map(item => ({
  json: {
    ...domainData,
    page_url: item.url,
    urls_total: urls.filter(u => u.type === 'page').length,
    urls_discovered: limitedUrls.length
  }
}));
```

### Step 9: Save Pages to Database

1. Add **"Microsoft SQL Server"** node
2. Connect it after Parse Sitemap
3. Configure:
   - **Operation:** `Insert`
   - **Table:** `seo_pages`
   - **Columns:**
     - `domain_id`: `={{ $json.seo_domain_id }}`
     - `page_url`: `={{ $json.page_url }}`
     - `audit_status`: `'pending'`
   - **Credential:** Select `mssql-credentials`
   - **Options:**
     - **Execute Query for Each Item:** `true`

### Step 10: Update Domain

1. Add **"Microsoft SQL Server"** node
2. Connect it after Save Pages
3. Configure:
   - **Operation:** `Execute Query`
   - **Query:**
   ```sql
   UPDATE seo_domains 
   SET pages_count = (SELECT COUNT(*) FROM seo_pages WHERE domain_id = @domain_id),
       last_sitemap_check = GETDATE(),
       sitemap_url = @sitemap_url,
       robots_txt_allowed = @robots_allowed,
       updated_at = GETDATE()
   WHERE id = @domain_id
   ```
   - **Parameters:**
     - `@domain_id`: `={{ $json.seo_domain_id }}`
     - `@sitemap_url`: `={{ $json.sitemap_url }}`
     - `@robots_allowed`: `={{ $json.robots_txt_allowed ? 1 : 0 }}`
   - **Credential:** Select `mssql-credentials`

### Step 11: Send Callback to Flask

1. Add **"HTTP Request"** node
2. Connect it after Update Domain
3. Configure:
   - **Method:** `POST`
   - **URL:** `={{ $('Validate Input Data').item.json.callback_url }}`
   - **Body:**
     - **Body Content Type:** `JSON`
     - **Body:**
     ```json
     {
       "job_id": "={{ $json.job_id }}",
       "status": "completed",
       "output_data": {
         "pages_found": "={{ $json.urls_discovered }}",
         "domain_id": "={{ $json.seo_domain_id }}",
         "sitemap_url": "={{ $json.sitemap_url }}",
         "robots_txt_allowed": "={{ $json.robots_txt_allowed }}"
       }
     }
     ```

### Step 12: Respond to Webhook

1. Add **"Respond to Webhook"** node
2. Connect it after Send Callback
3. Configure:
   - **Respond With:** `JSON`
   - **Response Body:**
   ```json
   {
     "success": true,
     "job_id": "={{ $('Validate Input Data').item.json.job_id }}",
     "message": "Sitemap discovery completed",
     "pages_found": "={{ $json.urls_discovered }}"
   }
   ```

## Final Workflow Structure

```
Webhook → Validate Input → Fetch robots.txt → Parse robots.txt → Check Permission → 
Fetch Sitemap → Parse XML → Save Pages → Aggregate → Update Domain → Send Callback → Respond
```

## Key Improvements

1. ✅ **Checks robots.txt first** to find sitemap URL(s)
2. ✅ **Respects robots.txt rules** - stops if `Disallow: /` is found
3. ✅ **Handles multiple sitemaps** - if robots.txt lists multiple Sitemap: entries
4. ✅ **Handles sitemap index files** - detects nested sitemaps
5. ✅ **Saves sitemap URL to database** - stores discovered sitemap URL
6. ✅ **Saves robots.txt status** - stores whether crawling is allowed

## Testing the Workflow

### Test Payload:
```json
{
  "job_id": 1,
  "organization_id": 1,
  "tool_key": "seo-autopilot",
  "input_data": {
    "domain_url": "https://example.com",
    "domain_id": "domain-example-com",
    "seo_domain_id": 1
  },
  "callback_url": "http://127.0.0.1:5000/api/webhooks/n8n/callback"
}
```

## Important Notes

1. **robots.txt format:**
   ```
   User-agent: *
   Disallow: /
   
   Sitemap: https://example.com/sitemap.xml
   Sitemap: https://example.com/sitemap-blog.xml
   ```

2. **If robots.txt not found (404):** Workflow will use default `/sitemap.xml`

3. **If Disallow: /** is found: Workflow stops and sends error callback

4. **Sitemap Index:** If sitemap contains nested sitemaps, you may need to add logic to fetch all nested sitemaps recursively

5. **Multiple Sitemaps:** If robots.txt has multiple `Sitemap:` entries, workflow uses the first one. You can extend to fetch all.
