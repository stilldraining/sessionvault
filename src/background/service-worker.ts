import { 
  saveSession, 
  getBackupCapture, 
  clearBackupCapture, 
  getSessions,
  saveWindowBackup,
  getWindowBackups,
  getWindowBackup,
  clearWindowBackup,
  clearAllWindowBackups,
} from '../lib/storage';
import type { Session, Tab } from '../lib/types';

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateTabId(): string {
  return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create session from backup - used in startup recovery (legacy single backup)
async function createSessionFromBackup(): Promise<void> {
  try {
    const backup = await getBackupCapture();
    if (!backup || backup.tabs.length === 0) {
      console.log('[SessionVault] No backup available for session creation');
      return;
    }

    console.log(`[SessionVault] Creating session from backup: ${backup.tabs.length} tabs from ${new Date(backup.timestamp).toISOString()}`);

    const session: Session = {
      id: generateSessionId(),
      timestamp: backup.timestamp, // Use backup timestamp, not current time
      status: 'to-do',
      tabs: backup.tabs,
    };

    console.log(`[SessionVault] Saving session to storage: ${session.id}`);
    await saveSession(session);
    
    // Verify session was saved
    const savedSessions = await getSessions();
    const savedSession = savedSessions.find(s => s.id === session.id);
    if (savedSession) {
      console.log(`[SessionVault] ✓ Session verified in storage: ${savedSession.id} with ${savedSession.tabs.length} tabs`);
    } else {
      console.error(`[SessionVault] ✗ Session NOT found in storage after save!`);
    }
    
    await clearBackupCapture();
    
    console.log(`[SessionVault] Session created from backup: ${session.id} with ${session.tabs.length} tabs`);
  } catch (error) {
    console.error('[SessionVault] Error creating session from backup:', error);
    console.error('[SessionVault] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
  }
}

// Create session from a specific window backup
async function createSessionFromWindowBackup(windowId: string, backup: { timestamp: number; tabs: Tab[] }): Promise<void> {
  try {
    if (!backup || backup.tabs.length === 0) {
      console.log(`[SessionVault] No tabs in window ${windowId} backup, skipping`);
      return;
    }

    console.log(`[SessionVault] Creating session from window ${windowId} backup: ${backup.tabs.length} tabs`);

    const session: Session = {
      id: generateSessionId(),
      timestamp: backup.timestamp,
      status: 'to-do',
      tabs: backup.tabs,
    };

    await saveSession(session);
    
    // Verify session was saved
    const savedSessions = await getSessions();
    const savedSession = savedSessions.find(s => s.id === session.id);
    if (savedSession) {
      console.log(`[SessionVault] ✓ Window ${windowId} session saved: ${savedSession.id} with ${savedSession.tabs.length} tabs`);
    } else {
      console.error(`[SessionVault] ✗ Window ${windowId} session NOT found after save!`);
    }
  } catch (error) {
    console.error(`[SessionVault] Error creating session from window ${windowId}:`, error);
  }
}

// Recover all window backups from previous browser session
async function recoverWindowBackups(): Promise<void> {
  try {
    // First, recover any legacy single backup (from older versions)
    const legacyBackup = await getBackupCapture();
    if (legacyBackup && legacyBackup.tabs.length > 0) {
      console.log(`[SessionVault] Recovering legacy backup with ${legacyBackup.tabs.length} tabs`);
      await createSessionFromBackup();
    }
    
    // Now recover per-window backups
    const windowBackups = await getWindowBackups();
    const windowIds = Object.keys(windowBackups);
    
    if (windowIds.length === 0) {
      console.log('[SessionVault] No window backups to recover');
      return;
    }
    
    console.log(`[SessionVault] === RECOVERING ${windowIds.length} WINDOW BACKUP(S) ===`);
    
    for (const windowId of windowIds) {
      const backup = windowBackups[windowId];
      await createSessionFromWindowBackup(windowId, backup);
    }
    
    // Clear all window backups after recovery
    await clearAllWindowBackups();
    console.log('[SessionVault] All window backups recovered and cleared');
  } catch (error) {
    console.error('[SessionVault] Error recovering window backups:', error);
  }
}

// Periodic backup capture - saves tabs PER WINDOW every 10 seconds
async function performBackupCapture(): Promise<void> {
  try {
    // Query all windows
    const windows = await chrome.windows.getAll({ populate: true });
    
    if (windows.length === 0) {
      console.log('[SessionVault] No windows found - browser may be closing');
      return;
    }
    
    let totalTabs = 0;
    
    // Process each window separately
    for (const window of windows) {
      // Skip windows without an ID or without tabs
      if (!window.id || !window.tabs || window.tabs.length === 0) {
        continue;
      }
      
      // Convert Chrome tabs to our Tab format
      const tabs: Tab[] = window.tabs.map((chromeTab) => ({
        id: generateTabId(),
        title: chromeTab.title || 'Untitled',
        url: chromeTab.url || '',
        status: 'pending',
        favIconUrl: chromeTab.favIconUrl,
      }));
      
      // Save backup for this specific window
      await saveWindowBackup(window.id, tabs);
      totalTabs += tabs.length;
    }
    
    console.log(`[SessionVault] Backup saved: ${totalTabs} tabs across ${windows.length} window(s) at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('[SessionVault] Error in backup capture:', error);
  }
}

// Periodic backup capture - runs every 10 seconds
let backupInterval: number | null = null;

function startBackupInterval() {
  // Perform initial backup immediately
  performBackupCapture();
  
  // Set up interval for periodic backups (10 seconds - more frequent = less data loss)
  backupInterval = setInterval(() => {
    performBackupCapture();
  }, 10000) as unknown as number;
  
  console.log('[SessionVault] Backup capture interval started (10s)');
}

function stopBackupInterval() {
  if (backupInterval !== null) {
    clearInterval(backupInterval);
    backupInterval = null;
    console.log('[SessionVault] Backup capture interval stopped');
  }
}

// Service worker initialization - simple and straightforward
async function initializeServiceWorker() {
  console.log('[SessionVault] === SERVICE WORKER INITIALIZING ===');
  
  // Note: We do NOT start the backup interval here!
  // - On browser startup: onStartup fires first, recovers backups, THEN starts interval
  // - On extension install/reload: onInstalled fires and starts interval
  // This prevents the race condition where new window backups get mistaken for old ones
  
  console.log('[SessionVault] Background service worker initialized (waiting for startup/install event)');
}

// Browser startup handler - this only fires when Chrome actually starts
// NOT when the service worker wakes up from being idle
chrome.runtime.onStartup.addListener(async () => {
  console.log('[SessionVault] === BROWSER STARTUP DETECTED ===');
  
  // IMPORTANT: Recover backups FIRST, before starting new backup captures
  // This prevents the race condition where new window tabs get mistaken for old sessions
  await recoverWindowBackups();
  
  console.log('[SessionVault] Startup recovery complete, now starting backup interval');
  
  // NOW it's safe to start the backup interval
  startBackupInterval();
});

console.log('[SessionVault] onStartup listener registered');

// Extension install/reload handler - starts backup interval when onStartup won't fire
chrome.runtime.onInstalled.addListener((details) => {
  console.log(`[SessionVault] === EXTENSION ${details.reason.toUpperCase()} ===`);
  
  // On install or update, there's no previous session to recover
  // Just start the backup interval immediately
  startBackupInterval();
  
  console.log('[SessionVault] Backup interval started after install/update');
});

console.log('[SessionVault] onInstalled listener registered');

// Window close handler - save session when a window is closed
// This is the most reliable method because the service worker is still alive
chrome.windows.onRemoved.addListener(async (windowId) => {
  console.log(`[SessionVault] === WINDOW ${windowId} CLOSED ===`);
  
  try {
    // Get the backup for this specific window
    const backup = await getWindowBackup(windowId);
    
    if (backup && backup.tabs.length > 0) {
      console.log(`[SessionVault] Saving session for window ${windowId} with ${backup.tabs.length} tabs`);
      await createSessionFromWindowBackup(windowId.toString(), backup);
      await clearWindowBackup(windowId);
      console.log(`[SessionVault] Window ${windowId} session saved and backup cleared`);
    } else {
      console.log(`[SessionVault] No backup found for window ${windowId}, skipping`);
    }
  } catch (error) {
    console.error(`[SessionVault] Error saving session for window ${windowId}:`, error);
  }
});

console.log('[SessionVault] windows.onRemoved listener registered');

// Initialize when service worker loads
console.log('[SessionVault] Service worker script executing');
initializeServiceWorker();

// Handle extension icon click - open session manager
// This must be registered at the top level, not inside an async function
chrome.action.onClicked.addListener(async (tab) => {
  console.log('[SessionVault] Extension icon clicked!');
  const managerUrl = chrome.runtime.getURL('manager.html');
  console.log('[SessionVault] Manager URL:', managerUrl);
  
  try {
    // Check if a tab with the manager URL already exists
    const existingTabs = await chrome.tabs.query({
      url: managerUrl,
    });
    
    console.log('[SessionVault] Existing tabs with manager URL:', existingTabs.length);
    
    if (existingTabs.length > 0) {
      // Tab already exists - navigate to it
      const existingTab = existingTabs[0];
      await chrome.tabs.update(existingTab.id!, { active: true });
      
      // Focus the window containing the tab
      if (existingTab.windowId) {
        await chrome.windows.update(existingTab.windowId, { focused: true });
      }
      console.log('[SessionVault] Focused existing manager tab');
    } else {
      // No existing tab - create a new one
      const newTab = await chrome.tabs.create({
        url: managerUrl,
      });
      console.log('[SessionVault] Created new manager tab:', newTab.id);
    }
  } catch (error) {
    console.error('[SessionVault] Error opening session manager:', error);
    // Fallback: try to create a new tab
    try {
      const fallbackTab = await chrome.tabs.create({
        url: managerUrl,
      });
      console.log('[SessionVault] Fallback tab created:', fallbackTab.id);
    } catch (fallbackError) {
      console.error('[SessionVault] Error creating fallback tab:', fallbackError);
    }
  }
});

console.log('[SessionVault] Action onClicked listener registered');

