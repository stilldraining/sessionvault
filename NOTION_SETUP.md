# Notion Integration Setup Guide

This guide will help you set up the Notion integration for SessionVault.

## Quick Start (Internal Integration)

The simplest way to get started is using an Internal Integration:

1. **Create Integration**
   - Go to https://www.notion.so/my-integrations
   - Click "New integration"
   - Select "Internal"
   - Name it "SessionVault"
   - Grant permissions: "Read content", "Insert content", "Update content"
   - Click "Submit"

2. **Get Your Token**
   - Copy the "Internal Integration Token" (starts with `secret_`)
   - This token will be used to authenticate API requests

3. **Create a Database**
   - Create a new Notion database
   - Add these properties:
     - **Title** (Title type) - for tab titles
     - **URL** (URL type) - for tab URLs
     - **Tags** (Multi-select type, optional) - for tags
   - Share the database with your integration:
     - Click "..." menu on the database
     - Select "Connections"
     - Add your "SessionVault" integration

4. **Configure in Extension**
   - Open SessionVault Settings
   - Connect to Notion (you may need to manually enter the token in the code for now)
   - Add a database mapping
   - Map the fields: Title → Title field, URL → URL field, Tags → Tags field

## OAuth Setup (For Production)

For a production-ready OAuth flow, you'll need:

1. **Create Public Integration**
   - Go to https://www.notion.so/my-integrations
   - Create a "Public" integration
   - Set OAuth redirect URI: `chrome-extension://YOUR_EXTENSION_ID/`
   - Get your OAuth client ID and secret

2. **Backend Server Required**
   - OAuth token exchange must happen server-side for security
   - Create an endpoint that:
     - Receives the OAuth code from the extension
     - Exchanges it for an access token using your client secret
     - Returns the token to the extension
   - Update `src/lib/notion.ts` to call your backend

3. **Update Extension Code**
   - Replace `YOUR_NOTION_CLIENT_ID` in `src/lib/notion.ts`
   - Update the token exchange function to call your backend

## Current Implementation Status

The current code includes:
- ✅ Notion API client functions
- ✅ Database fetching
- ✅ Page creation
- ✅ Field mapping
- ⚠️ OAuth flow (needs backend for token exchange)
- ⚠️ Token input UI (can be added manually)

## Manual Token Entry (Temporary Workaround)

Until OAuth is fully set up, you can manually add your token:

1. Open Chrome DevTools in the extension
2. Go to Console
3. Run:
   ```javascript
   chrome.storage.local.set({
     notionConfig: {
       token: 'your_secret_token_here',
       databases: {}
     }
   });
   ```
4. Reload the extension

## Testing the Integration

1. Connect to Notion in Settings
2. Add a database mapping
3. Try saving a tab to Notion from a session
4. Check your Notion database - the page should appear

## Troubleshooting

**"Notion not connected"**
- Make sure you've set the token in storage
- Check that the token is valid and not expired

**"Database mapping not found"**
- Ensure you've added a database mapping in Settings
- Verify the database ID matches

**"Failed to create Notion page"**
- Check that the database is shared with your integration
- Verify field mappings are correct
- Ensure field types match (Title, URL, Multi-select)

**OAuth errors**
- Verify redirect URI matches your extension ID
- Check that OAuth flow is properly configured
- Ensure backend server is running (if using OAuth)

