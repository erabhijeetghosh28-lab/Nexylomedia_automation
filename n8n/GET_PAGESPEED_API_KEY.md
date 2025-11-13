# How to Get Google PageSpeed Insights API Key

Follow these steps to get your PageSpeed API key for n8n workflows:

## Step-by-Step Guide

### 1. Go to Google Cloud Console
Visit: **https://console.cloud.google.com/**

Sign in with your Google account.

### 2. Create a New Project (or use existing)
- Click the **project dropdown** at the top (next to "Google Cloud")
- Click **"New Project"**
- Enter a project name: `n8n PageSpeed` (or any name you like)
- Click **"Create"**

**Note:** If you already have a project, skip this step and select your existing project.

### 3. Enable PageSpeed Insights API
- Go to **APIs & Services** → **Library**
- Or direct link: **https://console.cloud.google.com/apis/library**
- Search for **"PageSpeed Insights API"**
- Click on it
- Click **"Enable"** button
- Wait a few seconds for it to activate

### 4. Create API Key
- Go to **APIs & Services** → **Credentials**
- Or direct link: **https://console.cloud.google.com/apis/credentials**
- Click **"+ CREATE CREDENTIALS"** at the top
- Select **"API key"**
- Your API key will be generated automatically
- **Copy the API key** (it looks like: `AIzaSy...`)

### 5. (Optional but Recommended) Restrict Your API Key
- Click on the newly created API key to edit it
- Under **"API restrictions"**, select **"Restrict key"**
- Choose **"PageSpeed Insights API"** from the list
- Click **"Save"**

**Why restrict?** This prevents your API key from being used for other Google services if it gets exposed.

### 6. Check Quotas (Free Tier)
- The PageSpeed Insights API has a **free tier**: **25,000 requests per day**
- This should be more than enough for most use cases
- To check quotas: **APIs & Services** → **PageSpeed Insights API** → **Quotas**

## Quick Links Summary

- **Google Cloud Console**: https://console.cloud.google.com/
- **API Library**: https://console.cloud.google.com/apis/library
- **Credentials Page**: https://console.cloud.google.com/apis/credentials
- **PageSpeed Insights API Documentation**: https://developers.google.com/speed/docs/insights/v5/get-started

## What Your API Key Looks Like

Example: `AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567`

**Keep it secret!** Never commit it to git or share it publicly.

## Next Steps

Once you have your API key:

1. **Add it to n8n** (see `SETUP_N8N_WORKFLOWS.md`)
2. **Test it** using the PageSpeed API directly or through n8n

## Testing Your API Key

You can test your API key using curl:

```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&key=YOUR_API_KEY"
```

Replace `YOUR_API_KEY` with your actual key. If it works, you'll get JSON data back.

