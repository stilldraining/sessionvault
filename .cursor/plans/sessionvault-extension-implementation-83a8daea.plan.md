<!-- 83a8daea-39f0-4019-a038-9525390feb7d 7e111df3-acaa-40bb-b3a5-f40afe5862f4 -->
# SessionVault Chrome Extension Implementation Plan

## Project Structure

```
SessionVault/
├── public/
│   └── icons/ (extension icons)
├── src/
│   ├── background/
│   │   └── service-worker.ts (session capture logic)
│   ├── popup/
│   │   ├── Popup.tsx
│   │   └── popup.css
│   ├── manager/
│   │   ├── App.tsx (router setup)
│   │   ├── views/
│   │   │   ├── SessionsList.tsx
│   │   │   ├── SessionDetail.tsx
│   │   │   └── Settings.tsx
│   │   ├── components/
│   │   │   ├── SaveMenu.tsx
│   │   │   ├── TabCard.tsx
│   │   │   └── SessionCard.tsx
│   │   └── manager.css
│   ├── lib/
│   │   ├── storage.ts (chrome.storage wrappers)
│   │   ├── notion.ts (Notion API client)
│   │   └── types.ts (TypeScript interfaces)
│   └── components/ (shared Shadcn components)
├── manifest.json
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Implementation Steps

### 1. Project Setup

- Initialize npm project with TypeScript
- Install dependencies: React, React Router, Vite, Shadcn UI, Chrome types
- Configure Vite for Chrome extension (multi-entry: popup, manager, background)
- Set up TypeScript config for Chrome extension environment
- Create manifest.json v3 with required permissions

### 2. Core Types & Storage Layer

- Define TypeScript interfaces in `src/lib/types.ts`:
  - `Session`, `Tab`, `NotionConfig`, `Note`
- Implement `src/lib/storage.ts`:
  - Wrappers for chrome.storage.local
  - Functions: `getSessions()`, `saveSession()`, `updateSession()`, `getNotionConfig()`, `saveNotionConfig()`, `getNotes()`, `saveNote()`

### 3. Background Service Worker (Session Capture)

- Implement `src/background/service-worker.ts`:
  - Listen to `chrome.windows.onRemoved`
  - On window removal: check `chrome.windows.getAll()`
  - If zero windows remain: query all tabs with `chrome.tabs.query({})`
  - Create session object with unique ID, timestamp, status: 'pending'
  - Extract tab data: id, title, url, status: 'pending'
  - Save to chrome.storage.local.sessions array
  - Handle edge cases (crashes, multiple windows closing)

### 4. Popup View

- Create `src/pupup/Popup.tsx`:
  - Load session counts from storage on mount
  - Display: pending count, completed count, open tabs count
  - "Open Session Manager" button opens manager page
  - Minimal styling, quick load

### 5. Manager Page - Routing & Layout

- Set up React Router in `src/manager/App.tsx`:
  - Routes: `/` (SessionsList), `/session/:id` (SessionDetail), `/settings` (Settings)
  - Navigation component with back button and settings icon
  - Base layout with consistent styling

### 6. Sessions List View

- Implement `src/manager/views/SessionsList.tsx`:
  - Load all sessions from storage, sort by newest first
  - Display using SessionCard component (timestamp, tab count, status badge)
  - Filter dropdown: All/Pending/Completed
  - Click session → navigate to detail view
  - Settings icon in top right
  - Empty state message for first-time users
  - Virtual scrolling if >50 sessions

### 7. Session Detail View

- Implement `src/manager/views/SessionDetail.tsx`:
  - Load session by ID from route param
  - Display tabs in list/table with TabCard component
  - Per tab: favicon, title, URL, status indicator
  - Actions per tab: Open (chrome.tabs.create), Dismiss (update status, save), Save (open SaveMenu)
  - Progress indicator: "x of y tabs processed"
  - "Mark session complete" button (only if tabs remain)
  - Back button to list
  - Real-time updates to storage on any action

### 8. Save Menu Component

- Implement `src/manager/components/SaveMenu.tsx`:
  - Sheet/Dialog component (Shadcn)
  - Options: Save to Notion, Copy link, Bookmark, Save as note
  - State management for selected destination
  - Conditional rendering based on selection
  - For Notion: tag input, database selector, confirm button
  - For note: textarea, save button
  - On confirm: execute save action, update tab status, close menu

### 9. Notion Integration

- Implement `src/lib/notion.ts`:
  - OAuth flow: open auth window, handle callback, store token
  - API functions: `fetchDatabases()`, `createPage()`, `mapFields()`
  - Field mapping UI in Settings
- OAuth setup instructions:
  - Create Notion integration at notion.so/my-integrations
  - Get OAuth client ID/secret
  - Configure redirect URI
  - Store credentials securely

### 10. Settings View

- Implement `src/manager/views/Settings.tsx`:
  - Notion connection status
  - Connect/Reconnect button
  - Database list with mappings
  - Add new database mapping form
  - Field mapping UI (title, URL, tag fields)
  - "Clear all sessions" button (with confirmation)
  - Display current notionConfig

### 11. Supporting Features

- Bookmark integration: `chrome.bookmarks.create()` in SaveMenu
- Clipboard integration: `navigator.clipboard.writeText()` in SaveMenu
- Internal notes: store in chrome.storage.local.notes, display in SessionDetail
- Favicon fetching: use tab favIconUrl or fallback to `chrome://favicon/` protocol

### 12. UI Polish & Shadcn Components

- Install and configure Shadcn UI
- Create custom components: SessionCard, TabCard
- Apply consistent styling across all views
- Responsive design for manager page
- Loading states and error handling

### 13. Build Configuration

- Configure Vite for multi-entry build
- Output structure: dist/ with popup.html, manager.html, background.js
- Copy manifest.json to dist/
- Set up dev mode with hot reload
- Production build optimization

## Key Files to Create

- `manifest.json` - Extension manifest with permissions (storage, tabs, windows, bookmarks, identity for OAuth)
- `vite.config.ts` - Multi-entry Vite config for extension
- `src/lib/types.ts` - All TypeScript interfaces
- `src/lib/storage.ts` - Storage abstraction layer
- `src/background/service-worker.ts` - Core session capture logic
- `src/popup/Popup.tsx` - Entry point popup
- `src/manager/App.tsx` - Router and main manager app
- `src/manager/views/SessionsList.tsx` - List view
- `src/manager/views/SessionDetail.tsx` - Detail view
- `src/manager/views/Settings.tsx` - Settings view
- `src/manager/components/SaveMenu.tsx` - Save destination menu
- `src/lib/notion.ts` - Notion API integration

## Technical Considerations

- Use Chrome Extension Manifest V3 (service worker, not background page)
- Handle storage limits (chrome.storage.local has ~10MB limit)
- Implement error boundaries for React components
- Add loading states for async operations
- Ensure OAuth flow works in extension context (identity API)
- Test session capture on browser close (may need to use chrome.runtime.onSuspend as fallback)
- Consider performance: virtualize long lists, debounce storage writes

### To-dos

- [ ] Initialize project with Vite, TypeScript, React, and configure for Chrome extension multi-entry build
- [ ] Create TypeScript types and storage abstraction layer (chrome.storage.local wrappers)
- [ ] Implement background service worker for session capture on browser close
- [ ] Build popup view with session counts and manager entry button
- [ ] Set up React Router and base layout for manager page with navigation
- [ ] Implement Sessions List View with filtering and session cards
- [ ] Build Session Detail View with tab actions (open/dismiss/save) and progress tracking
- [ ] Create Save Menu component with all destination options (Notion, bookmark, copy, note)
- [ ] Implement Notion OAuth flow, database selection, field mapping, and page creation
- [ ] Build Settings View with Notion configuration and clear sessions functionality
- [ ] Install Shadcn UI, create custom components, apply styling and handle loading/error states
- [ ] Finalize Vite build configuration, test dev/prod builds, and create extension package