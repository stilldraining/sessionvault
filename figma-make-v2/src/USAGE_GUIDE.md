# Session Vault - Usage Guide

## Quick Start

The Session Vault Chrome extension popup is a complete, production-ready implementation that matches the three provided screenshots exactly.

## Three Main States

### 1. Default View (Screenshot 1)
**What you see:**
- Header with "SESSION VAULT" title and "Select all" button
- Left sidebar showing:
  - Active Window session (8 tabs, green label)
  - History section (2 saved sessions)
  - Graveyard section (2 archived sessions)
- Main content area showing 4 tabs from the active window

**How to use:**
- Click any session in the sidebar to view its tabs
- Click any tab to copy its URL to clipboard
- Click "Select all" to select all tabs in current session

### 2. Selection State (Screenshot 2)
**What you see:**
- Header changes to show "4 TABS SELECTED" with action buttons
- Selected tabs have dark background (#121212)
- Two action buttons appear: External Link and Save icons

**How to get here:**
- Cmd/Ctrl+Click on individual tabs to select them
- OR click "Select all" button in default view
- OR press Cmd/Ctrl+A keyboard shortcut

**Available actions:**
- Click External Link button to open all selected tabs
- Click Save button to save the selection as a new session
- Press Escape to clear selection

### 3. Toast Notification (Screenshot 3)
**What you see:**
- Blue notification at bottom center
- Shows "LINK COPIED TO CLIPBOARD"

**How to trigger:**
- Click any tab (without modifier keys) to copy URL
- Click Save button to save session (shows "SESSION SAVED")
- Toast automatically disappears after 2 seconds

## User Workflows

### Workflow 1: Browse and Copy Links
1. Open the extension popup
2. Click through different sessions in sidebar
3. Click any tab to copy its URL
4. See confirmation toast
5. Paste URL wherever needed

### Workflow 2: Open Multiple Tabs
1. Select multiple tabs using Cmd/Ctrl+Click
2. Click the External Link button (with arrow icon)
3. All selected tabs open in new browser windows

### Workflow 3: Save Current Selection
1. Select tabs you want to save
2. Click the Save button (floppy disk icon)
3. See "SESSION SAVED" confirmation
4. Session added to History section

### Workflow 4: Quick Select All
1. Press Cmd/Ctrl+A or click "Select all"
2. All tabs in current session are selected
3. Use action buttons or press Escape to clear

## Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + A` | Select all tabs in current session |
| `Escape` | Clear all selections |
| `Cmd/Ctrl + Click` | Toggle individual tab selection |
| `Tab` | Navigate through focusable elements |
| `Enter/Space` | Activate focused button |

## Mouse Interactions

### Sidebar Sessions
- **Click**: Switch to that session's tabs
- **Hover**: Subtle background color change
- **Selected**: Dark background persists

### Main Area Tabs
- **Click**: Copy URL to clipboard, show toast
- **Cmd/Ctrl+Click**: Toggle selection state
- **Hover**: Subtle background color change
- **Selected**: Dark background (#121212)

### Header Buttons
- **Select All**: Select all tabs in current session
- **External Link**: Open all selected tabs
- **Save**: Save current selection as session
- **Hover**: Lighter background on all buttons

## Visual Indicators

### Session States
- **Active Window**: Green "ACTIVE WINDOW" label
- **Saved Sessions**: Gray timestamp (e.g., "01 DEC / 11:12")
- **Selected Session**: Dark background (#121212)

### Tab States
- **Default**: Transparent background
- **Hover**: Very dark background (#0a0a0a)
- **Selected**: Dark background (#121212)

### Action Feedback
- **Toast Notification**: Blue banner at bottom
- **Button Hover**: Lighter background
- **Selection Count**: Shows "{count} TABS SELECTED"

## Data Display

### Session Information
Each session shows:
- Number of tabs (e.g., "8 tabs", "3 TABS")
- Label (for active) or timestamp (for saved)
- Click to view tab list

### Tab Information
Each tab shows:
- Full page title (truncated if too long)
- Full URL in purple/blue color
- Both truncate gracefully to fit space

## Tips & Best Practices

1. **Quick Copy**: Click any tab to instantly copy its URL
2. **Bulk Actions**: Use Cmd+A to select all, then open or save
3. **Keyboard First**: Use Cmd+A and Escape for fast selection management
4. **Visual Scanning**: Sessions are organized by recency (newest first)
5. **Graveyard**: Old/archived sessions are separated for cleaner view

## Dimensions & Constraints

- **Fixed Size**: 600px × 457px (standard Chrome extension popup)
- **Scrollable Areas**: Sidebar and tab list scroll independently
- **Responsive Elements**: Header adjusts based on selection state
- **Maximum Height**: Content scrolls when exceeding viewport

## Browser Compatibility

Works perfectly in:
- ✅ Chrome (primary target)
- ✅ Edge (Chromium-based)
- ✅ Brave
- ✅ Other Chromium browsers

Requires:
- Clipboard API support
- ES6+ JavaScript
- CSS Grid and Flexbox
- Modern event handling

## Troubleshooting

**Toast doesn't appear:**
- Check browser clipboard permissions
- Ensure JavaScript is enabled

**Can't select tabs:**
- Make sure you're using Cmd (Mac) or Ctrl (Windows/Linux)
- Try clicking directly on the tab text

**Scrolling issues:**
- Content should scroll automatically when overflowing
- Check browser zoom level (should be 100%)

## Advanced Features

### Multi-Session Management
- Switch between sessions instantly
- Each session maintains separate tab list
- Selection clears when switching sessions

### Smart Selection
- Selection state persists until cleared
- Visual feedback on all selected items
- Count updates in real-time

### Clipboard Integration
- One-click URL copying
- System clipboard integration
- Works with password managers and note apps
