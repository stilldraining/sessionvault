# SessionVault Chrome Extension

A Chrome extension that automatically captures your browser sessions when you close the browser, allowing you to review and save tabs to various destinations including Notion, bookmarks, clipboard, or internal notes.

## Features

- **Automatic Session Capture**: Captures all open tabs when the browser is fully closed
- **Session Management**: Review and manage captured sessions with a dedicated manager interface
- **Multiple Save Destinations**:
  - Save to Notion databases
  - Bookmark tabs
  - Copy links to clipboard
  - Save as internal notes
- **Notion Integration**: Full OAuth support with database mapping and field configuration
- **No Account Required**: Everything is stored locally in your browser

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Chrome browser for testing

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Development Mode

For development with hot reload, use:
```bash
npm run dev
```

This will watch for changes and rebuild automatically. You'll need to reload the extension in Chrome after each build.

## Notion Integration Setup

To use the Notion integration feature, you need to set up a Notion integration:

### Option 1: Internal Integration (Simpler)

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Choose "Internal" integration
4. Give it a name (e.g., "SessionVault")
5. Select the capabilities you need (Read content, Insert content, Update content)
6. Copy the "Internal Integration Token"
7. In the extension settings, you can manually paste this token (this requires modifying the code to add a token input field)

### Option 2: OAuth Integration (Recommended for Production)

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Choose "Public" integration
4. Fill in the OAuth details:
   - Redirect URI: Use `chrome-extension://YOUR_EXTENSION_ID/` (get your extension ID from `chrome://extensions/`)
5. Get your OAuth client ID and secret
6. Update the code in `src/lib/notion.ts` with your client ID
7. Set up a backend server to exchange the OAuth code for an access token (for security)

**Note**: The current implementation includes a placeholder for OAuth. For production use, you should implement a secure server-side token exchange.

### Database Setup

1. Create a Notion database with the following properties:
   - A **Title** field (for the tab title)
   - A **URL** field (for the tab URL)
   - (Optional) A **Multi-select** field (for tags)
2. Share the database with your Notion integration
3. In the extension settings, add a database mapping and configure the field mappings

## Project Structure

```
SessionVault/
├── src/
│   ├── background/          # Service worker for session capture
│   ├── popup/               # Extension popup UI
│   ├── manager/             # Full-page session manager
│   │   ├── views/           # Main views (List, Detail, Settings)
│   │   └── components/      # Reusable components
│   └── lib/                 # Shared utilities (storage, Notion API)
├── public/                  # Static assets (icons)
├── manifest.json            # Chrome extension manifest
└── vite.config.ts          # Vite build configuration
```

## Building for Production

```bash
npm run build
```

The built extension will be in the `dist` folder. You can zip this folder and submit it to the Chrome Web Store.

## Permissions

The extension requires the following permissions:
- `storage`: To save sessions locally
- `tabs`: To capture tab information
- `windows`: To detect browser close events
- `bookmarks`: To save tabs as bookmarks
- `identity`: For Notion OAuth flow
- `https://api.notion.com/*`: To communicate with Notion API

## Limitations

- Session capture relies on Chrome's window close detection, which may not capture sessions in all edge cases (e.g., system crashes)
- Storage is limited to ~10MB (Chrome's limit for `chrome.storage.local`)
- Notion OAuth requires a backend server for secure token exchange in production

## License

MIT

