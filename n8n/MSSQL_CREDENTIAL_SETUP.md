# Setting Up MSSQL Credential in n8n with SSL Ignore

## Step-by-Step Guide

1. **Go to Credentials Tab**
   - In n8n UI, click on **"Credentials"** tab (top navigation bar)

2. **Add New Credential**
   - Click **"Add Credential"** button
   - Search for: **"Microsoft SQL Server"**
   - Select it

3. **Fill in Connection Details:**
   - **Host:** `localhost` (or your SQL Server address from config.py)
   - **Database:** `nexylo`
   - **User:** `nexylo`
   - **Password:** `Nexylomedia@25`
   - **Port:** `1433`
   
4. **⚠️ IMPORTANT - Enable SSL Ignore:**
   - Look for **"Options"** or **"Additional Options"** section
   - Find **"Trust Server Certificate"** or **"Encrypt"** option
   - **Toggle ON** or **Check** the box for:
     - ✅ **"Trust Server Certificate"** 
     - OR set **"Encrypt"** to **"false"** (depending on n8n version)
   - This is equivalent to the `TrustServerCertificate=yes` in your Flask connection string

5. **Test Connection**
   - Click **"Test Connection"** button
   - Should show: "Connection successful" or green checkmark

6. **Save Credential**
   - Name it: **`mssql-credentials`** (this is what workflows will reference)
   - Click **"Save"**

## Alternative Method (If Options Not Visible)

If you don't see the SSL/Encrypt options:
1. In the credential, look for **"Connection String"** or **"Additional Parameters"** field
2. Add: `TrustServerCertificate=yes;Encrypt=false;`
3. Or use connection string format:
   ```
   Server=localhost;Database=nexylo;User Id=nexylo;Password=Nexylomedia@25;TrustServerCertificate=yes;
   ```

## Verification

After saving, you should see `mssql-credentials` in your credentials list. This can now be used in workflow nodes.

