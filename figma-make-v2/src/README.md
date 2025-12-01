# Session Vault - Chrome Extension Popup

A production-ready Chrome extension popup widget for managing browser tab sessions. The popup is designed with exact dimensions of **600px width × 457px height**.

## Features

### Interactive States

1. **Default View**: Shows the session vault with saved sessions and the current active window
2. **Selection Mode**: Select multiple tabs using Cmd/Ctrl+Click, showing action buttons (Open Links, Save Session)
3. **Toast Notifications**: Confirmation feedback when performing actions

### User Interactions

- **Click on a session** (in sidebar): Switch between different saved sessions
- **Click on a tab** (in main area): Copy the URL to clipboard and show toast notification
- **Cmd/Ctrl+Click on a tab**: Toggle selection of that tab
- **Select All button**: Select all tabs in the current session
- **Open Links button**: Opens all selected tabs in new browser windows
- **Save Session button**: Saves the current selection as a session

### Keyboard Shortcuts

- **Cmd/Ctrl + A**: Select all tabs in the current session
- **Escape**: Clear all selections
- **Cmd/Ctrl + Click**: Toggle individual tab selection

### Component Structure

```
App.tsx                    - Main application with state management
├── Header.tsx            - Top header with title and action buttons
├── Sidebar.tsx           - Left sidebar with session list
├── TabList.tsx           - Main content area showing tabs
└── Toast.tsx             - Notification toast component
```

### Data Structure

**SessionItem**: Represents a saved session
- `id`: Unique identifier
- `tabCount`: Number of tabs in session
- `timestamp`: When the session was saved
- `label`: Optional label (e.g., "ACTIVE WINDOW")
- `isActive`: Whether this is the current active session
- `tabs`: Array of TabItem objects

**TabItem**: Represents a browser tab
- `id`: Unique identifier
- `title`: Page title
- `url`: Full URL

### Styling

- Uses Tailwind CSS for styling
- Custom monospace font: "Departure Mono:Regular"
- Dark theme with black background (#000000)
- Accent colors: Blue (#3232ff) for primary actions, Spring green for active state
- Custom scrollbar styling for overflow areas

### Accessibility

- All interactive elements are properly focusable buttons
- Keyboard navigation support
- Title attributes on interactive elements for tooltips
- Semantic HTML structure

## Browser Compatibility

Designed for Chrome extensions but compatible with any modern browser that supports:
- CSS Grid and Flexbox
- ES6+ JavaScript
- React 18+
- Clipboard API

## Development

The component is built with:
- React with TypeScript
- Tailwind CSS v4
- Custom CSS animations for toast notifications