import { saveSession, saveBackupCapture, getBackupCapture, clearBackupCapture, getSessions } from '../lib/storage';
import type { Session, Tab } from '../lib/types';

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateTabId(): string {
  return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create session from backup - used in startup recovery
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

// Periodic backup capture - saves ALL current tabs every 10 seconds
async function performBackupCapture(): Promise<void> {
  try {
    // Query ALL tabs - this is the key to capturing everything
    const chromeTabs = await chrome.tabs.query({});
    
    console.log(`[SessionVault] Backup capture: Found ${chromeTabs.length} tabs`);
    
    if (chromeTabs.length === 0) {
      // 0 tabs found - browser is closing!
      // If we have a backup with tabs, create a session from it NOW
      const existingBackup = await getBackupCapture();
      if (existingBackup && existingBackup.tabs.length > 0) {
        console.log(`[SessionVault] Browser closing detected! Creating session from backup with ${existingBackup.tabs.length} tabs`);
        await createSessionFromBackup();
      } else {
        console.log('[SessionVault] Browser closing but no backup to save');
      }
      return;
    }

    // Convert Chrome tabs to our Tab format
    const tabs: Tab[] = chromeTabs.map((chromeTab) => ({
      id: generateTabId(),
      title: chromeTab.title || 'Untitled',
      url: chromeTab.url || '',
      status: 'pending',
      favIconUrl: chromeTab.favIconUrl,
    }));

    await saveBackupCapture(tabs);
    console.log(`[SessionVault] Backup saved: ${tabs.length} tabs at ${new Date().toISOString()}`);
    
    // Log tab URLs for debugging (first 5)
    const sampleUrls = tabs.slice(0, 5).map(t => t.url);
    console.log(`[SessionVault] Sample tab URLs: ${sampleUrls.join(', ')}${tabs.length > 5 ? '...' : ''}`);
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
  
  // Just start backup interval - session creation happens when we detect 0 tabs
  startBackupInterval();
  
  console.log('[SessionVault] Background service worker initialized');
}

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

