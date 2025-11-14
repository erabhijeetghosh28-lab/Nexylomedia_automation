# API Keys Setup Guide

## Where to Add Your API Keys

Add your API keys to the `.env` file in the root directory of the project:

```env
# SEO Autopilot API Keys
GEMINI_API_KEY=your_gemini_api_key_here
PAGESPEED_API_KEY=your_pagespeed_api_key_here
```

## Getting Your API Keys

### PageSpeed Insights API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "PageSpeed Insights API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key and add it to `.env` as `PAGESPEED_API_KEY`

### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key and add it to `.env` as `GEMINI_API_KEY`

## How It Works

- **PageSpeed API**: Used for running PageSpeed Insights and Lighthouse audits on your project domains
- **Gemini API**: Used for generating AI-powered fixes for SEO issues found during audits

## Security Note

⚠️ **Never commit your `.env` file to git!** It's already in `.gitignore` for your protection.

## Testing

After adding your keys:
1. Restart your backend server
2. Create a project with an approved primary domain
3. Run a PageSpeed or SEO audit
4. Try generating an AI fix for any issue found

The system will automatically use your API keys when available, and fall back to mock data if keys are missing.


