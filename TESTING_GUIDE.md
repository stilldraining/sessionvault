# SessionVault Testing Guide

This guide will walk you through testing the SessionVault Chrome extension step by step.

## Prerequisites

- Node.js and npm installed
- Google Chrome browser
- A Notion account with an internal integration token (for testing Notion integration)

## Step 1: Build the Extension

1. Open a terminal in the project directory
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. The build output will be in the `dist` folder. This is what you'll load into Chrome.

## Step 2: Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked"
4. Navigate to your project directory and select the `dist` folder
5. The extension should now appear in your extensions list

## Step 3: Verify Extension Installation

1. Look for the SessionVault icon in your Chrome toolbar (should be a black rounded rectangle)
2. Click the icon to open the popup
3. You should see session counts (likely 0 if you haven't closed the browser yet)

## Step 4: Test Session Capture

1. Open several tabs in Chrome (e.g., 3-5 tabs with different websites)
2. Close Chrome completely (all windows)
3. Reopen Chrome
4. Click the SessionVault extension icon
5. You should see a session count in the popup
6. Click "Manage Sessions" to open the full manager page
7. You should see your captured session in the list with the correct number of tabs

## Step 5: Set Up Notion Integration

### 5.1 Get Your Notion Internal Integration Token

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Give it a name (e.g., "SessionVault Test")
4. Select the workspace where your test database is located
5. Click "Submit"
6. Copy the "Internal Integration Token" (starts with `secret_`)

### 5.2 Share Your Database with the Integration

1. Open your Notion database
2. Click the "..." menu in the top-right
3. Select "Add connections" or "Connections"
4. Find and select your integration
5. The integration now has access to your database

### 5.3 Enter Token in Extension Settings

1. In the SessionVault manager page, navigate to "Settings"
2. In the "Notion Integration" section, you should see a token input field
3. Paste your internal integration token
4. Click "Save Token"
5. You should see "Connected to Notion" status

### 5.4 Set Up Database Mapping

1. In Settings, click "Add Mapping" button
2. Select your test database from the dropdown
3. The form should auto-detect fields:
   - **Title Field**: Should auto-select the title field
   - **URL Field**: Should auto-select a URL field (or you can enter it manually)
   - **Tag Field** (optional): Can be left empty or set to a multi-select field
4. Click "Save Mapping"
5. Your database mapping should appear in the list

## Step 6: Test Save Destinations

### 6.1 Test Notion Save

1. Go to a session detail page (click on a session from the list)
2. Click "Save" on any tab
3. Select "Save to Notion"
4. Select your database from the dropdown
5. Optionally add tags (comma-separated)
6. Click "Confirm"
7. Check your Notion database - a new page should appear with the tab's title and URL

### 6.2 Test Bookmark Save

1. Click "Save" on a tab
2. Select "Bookmark"
3. Click "Confirm"
4. Check your Chrome bookmarks - the tab should be bookmarked

### 6.3 Test Copy Link

1. Click "Save" on a tab
2. Select "Copy Link"
3. Click "Confirm"
4. Paste somewhere (Ctrl+V) - the URL should be in your clipboard

### 6.4 Test Save as Note

1. Click "Save" on a tab
2. Select "Save as Note"
3. Enter some text in the note field
4. Click "Confirm"
5. The note should be saved (you can verify this by checking the tab again)

## Step 7: Test Session Management

### 7.1 Test Tab Actions

1. In a session detail page:
   - Click "Open" on a tab - it should open in a new tab
   - Click "Dismiss" on a tab - it should be marked as done
   - Click "Save" on a tab - the save menu should appear

### 7.2 Test Session Status

1. Mark all tabs as done (either by opening, dismissing, or saving them)
2. The session status should automatically change to "completed"
3. Or click "Mark Session Complete" to mark all remaining tabs as done

### 7.3 Test Filtering

1. In the sessions list, use the filter dropdown
2. Select "All" - shows all sessions
3. Select "Pending" - shows only pending sessions
4. Select "Completed" - shows only completed sessions

## Step 8: Test Lazy Loading (Storage Optimization)

1. Create multiple sessions by closing Chrome multiple times with different tabs
2. Open the sessions list
3. The list should load quickly even with many sessions (using metadata only)
4. Click on a session to view details
5. The full session data loads only when you view the detail page
6. This reduces memory usage and improves performance

## Step 9: Test Settings

### 9.1 Test Token Update

1. Go to Settings
2. Enter a new token in the "Update Token" field
3. Click "Update Token"
4. The token should be updated and you should still be connected

### 9.2 Test Clear Sessions

1. In Settings, scroll to "Danger Zone"
2. Click "Clear All Sessions"
3. Confirm the action
4. All sessions should be deleted
5. The sessions list should show "No sessions yet"

## Step 10: Verify Extension Functionality

### Checklist

- [ ] Extension loads without errors
- [ ] Icons display correctly (black rounded rectangles)
- [ ] Popup shows session counts
- [ ] Manager page loads and navigates correctly
- [ ] Sessions are captured on browser close
- [ ] Sessions list displays correctly
- [ ] Session detail page loads full data
- [ ] Tab actions work (open/dismiss/save)
- [ ] Save menu all destinations work
- [ ] Notion integration connects with token
- [ ] Database mapping saves correctly
- [ ] Notion pages are created successfully
- [ ] Settings clear sessions works
- [ ] Lazy loading works (fast list, full data on detail)

## Troubleshooting

### Extension Not Loading

- Check that you selected the `dist` folder, not the root project folder
- Check the browser console for errors (F12 → Console tab)
- Verify the build completed successfully

### Notion Integration Not Working

- Verify your token is correct (starts with `secret_`)
- Ensure your database is shared with the integration
- Check that field names in the mapping match your database exactly
- Check the browser console for API errors

### Sessions Not Capturing

- Make sure you close ALL Chrome windows (not just one)
- Check the service worker console (chrome://extensions → SessionVault → "service worker" link)
- Verify the extension has necessary permissions

### Storage Issues

- Chrome storage has a ~10MB limit
- If you hit the limit, clear old sessions
- Lazy loading helps by only loading full data when needed

## Next Steps

Once testing is complete and everything works:

1. Test with your actual workflow
2. Set up OAuth for production (when ready)
3. Add more database mappings if needed
4. Customize the UI if desired

## Notes

- The extension uses HashRouter for Chrome extension compatibility
- All data is stored in `chrome.storage.local`
- Internal integration tokens work the same as OAuth tokens for API calls
- The multi-database structure is ready for OAuth when you implement it

