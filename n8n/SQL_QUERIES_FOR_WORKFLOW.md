# SQL Queries for Sitemap Discovery Workflow

## Node 1: Get Existing Pages

### Settings:
- **Operation:** Execute Query
- **Query:**
```sql
SELECT page_url 
FROM seo_pages 
WHERE domain_id = @domain_id
```

### Query Parameters:
Click **"Add Parameter"** for each:
- **Name:** `domain_id`
- **Value:** `={{ $json.seo_domain_id }}`
- **Type:** Integer (or leave as default)

### Credential:
- Select: **"Nexylo sql con"**

---

## Node 2: Save Pages to DB

### Settings:
- **Operation:** Insert
- **Table:** `seo_pages`

### Columns (Define Below):
Click **"Add Column"** for each:

1. **Column:** `domain_id`
   - **Value:** `={{ $json.seo_domain_id }}`
   - **Type:** Integer

2. **Column:** `page_url`
   - **Value:** `={{ $json.page_url }}`
   - **Type:** String/Text

3. **Column:** `audit_status`
   - **Value:** `pending` (text, no quotes)
   - **Type:** String/Text

### Options:
- ✅ **Skip Duplicates** (check this box)

### Execute Query for Each Item:
- ✅ **Yes** (so it processes each page URL individually)

### Credential:
- Select: **"Nexylo sql con"**

---

## Node 3: Update Domain

### Settings:
- **Operation:** Execute Query
- **Query:**
```sql
UPDATE seo_domains 
SET 
    pages_count = (SELECT COUNT(*) FROM seo_pages WHERE domain_id = @domain_id),
    last_sitemap_check = GETDATE(),
    sitemap_url = @sitemap_url,
    robots_txt_allowed = @robots_allowed,
    updated_at = GETDATE()
WHERE id = @domain_id
```

### Query Parameters:
Click **"Add Parameter"** for each:

1. **Name:** `domain_id`
   - **Value:** `={{ $json.seo_domain_id }}`
   - **Type:** Integer

2. **Name:** `sitemap_url`
   - **Value:** `={{ Array.isArray($json.sitemap_urls_processed) ? $json.sitemap_urls_processed.join(', ') : ($json.sitemap_urls_processed || '') }}`
   - **Type:** String/Text

3. **Name:** `robots_allowed`
   - **Value:** `={{ $json.robots_txt_allowed ? 1 : 0 }}`
   - **Type:** Integer (or Bit)

### Credential:
- Select: **"Nexylo sql con"**

### Execute Query for Each Item:
- ❌ **No** (only run once after all pages are saved)

---

## Alternative: Simplified Queries (if parameters don't work)

If parameter substitution doesn't work in n8n, you can use direct expression substitution:

### Get Existing Pages (Alternative):
```sql
SELECT page_url 
FROM seo_pages 
WHERE domain_id = {{ $json.seo_domain_id }}
```

### Update Domain (Alternative):
```sql
UPDATE seo_domains 
SET 
    pages_count = (SELECT COUNT(*) FROM seo_pages WHERE domain_id = {{ $json.seo_domain_id }}),
    last_sitemap_check = GETDATE(),
    sitemap_url = '{{ Array.isArray($json.sitemap_urls_processed) ? $json.sitemap_urls_processed.join(", ") : ($json.sitemap_urls_processed || "") }}',
    robots_txt_allowed = {{ $json.robots_txt_allowed ? 1 : 0 }},
    updated_at = GETDATE()
WHERE id = {{ $json.seo_domain_id }}
```

(Note: For Insert operation, you MUST use the column mapping UI, not a raw SQL query)

---

## Quick Reference

| Node | Operation | Table | Key Settings |
|------|-----------|-------|--------------|
| Get Existing Pages | Execute Query | N/A | Parameter: `@domain_id` = `{{ $json.seo_domain_id }}` |
| Save Pages to DB | Insert | `seo_pages` | Columns: domain_id, page_url, audit_status<br>✅ Skip Duplicates<br>✅ Execute for Each Item |
| Update Domain | Execute Query | N/A | Parameters: @domain_id, @sitemap_url, @robots_allowed<br>❌ Execute for Each Item = No |

---

## Testing Tips

1. **Test Get Existing Pages:**
   - Execute the node
   - Should return array of `{page_url: "https://..."}` objects

2. **Test Save Pages:**
   - Execute with sample data
   - Check `seo_pages` table for new entries

3. **Test Update Domain:**
   - Execute the node
   - Check `seo_domains` table - `pages_count` should be updated

---

## Troubleshooting

**If parameters don't work:**
- Try using `{{ }}` instead of `@parameter` syntax
- Make sure values are not null before using in query

**If insert fails:**
- Check that `domain_id` exists in `seo_domains` table
- Verify column names match exactly (case-sensitive)
- Check that `audit_status` value matches allowed values in database

**If query returns nothing:**
- Verify credential connection works
- Test query directly in SQL Server Management Studio
- Check that `seo_domain_id` value is correct

