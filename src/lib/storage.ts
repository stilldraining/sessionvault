import type { Session, SessionMetadata, NotionConfig, Note, Tab } from './types';

const STORAGE_KEYS = {
  SESSIONS: 'sessions',
  NOTION_CONFIG: 'notionConfig',
  NOTES: 'notes',
  BACKUP_CAPTURE: 'backupCapture',
  HEARTBEAT: 'heartbeat',
} as const;

// Helper to generate tab IDs for current session
function generateTabId(): string {
  return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize storage structure if needed
async function ensureStorageStructure(): Promise<void> {
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.SESSIONS,
    STORAGE_KEYS.NOTION_CONFIG,
    STORAGE_KEYS.NOTES,
  ]);

  if (!result[STORAGE_KEYS.SESSIONS]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.SESSIONS]: [] });
  }
  if (!result[STORAGE_KEYS.NOTION_CONFIG]) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.NOTION_CONFIG]: { databases: {} },
    });
  }
  if (!result[STORAGE_KEYS.NOTES]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.NOTES]: [] });
  }
}

// Sessions - Lazy Loading Support

/**
 * Get session metadata (lightweight info without full tab data)
 * This reduces memory usage when displaying session lists
 */
export async function getSessionMetadata(): Promise<SessionMetadata[]> {
  await ensureStorageStructure();
  const result = await chrome.storage.local.get(STORAGE_KEYS.SESSIONS);
  const sessions = (result[STORAGE_KEYS.SESSIONS] as Session[]) || [];
  
  return sessions.map((session) => ({
    id: session.id,
    timestamp: session.timestamp,
    status: session.status,
    tabCount: session.tabs.length,
    pendingTabCount: session.tabs.filter((t) => t.status === 'pending').length,
  }));
}

/**
 * Get full session data including all tabs
 * Use this when you need complete session information
 */
export async function getSessionFull(sessionId: string): Promise<Session | null> {
  await ensureStorageStructure();
  const result = await chrome.storage.local.get(STORAGE_KEYS.SESSIONS);
  const sessions = (result[STORAGE_KEYS.SESSIONS] as Session[]) || [];
  return sessions.find((s) => s.id === sessionId) || null;
}

/**
 * Get all sessions with full data
 * For backward compatibility and when full data is needed
 */
export async function getSessions(): Promise<Session[]> {
  await ensureStorageStructure();
  const result = await chrome.storage.local.get(STORAGE_KEYS.SESSIONS);
  return (result[STORAGE_KEYS.SESSIONS] as Session[]) || [];
}

export async function saveSession(session: Session): Promise<void> {
  const sessions = await getSessions();
  const existingIndex = sessions.findIndex((s) => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  
  await chrome.storage.local.set({ [STORAGE_KEYS.SESSIONS]: sessions });
}

export async function updateSession(
  sessionId: string,
  updates: Partial<Session>
): Promise<void> {
  const sessions = await getSessions();
  const index = sessions.findIndex((s) => s.id === sessionId);
  
  if (index >= 0) {
    sessions[index] = { ...sessions[index], ...updates };
    await chrome.storage.local.set({ [STORAGE_KEYS.SESSIONS]: sessions });
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await getSessions();
  const filtered = sessions.filter((s) => s.id !== sessionId);
  await chrome.storage.local.set({ [STORAGE_KEYS.SESSIONS]: filtered });
}

export async function archiveSession(sessionId: string): Promise<void> {
  await updateSession(sessionId, { status: 'archived' });
  // Note: Archived sessions are identified by status 'archived' and are moved to Archived Sessions section
}

export async function restoreSession(sessionId: string): Promise<void> {
  await updateSession(sessionId, { status: 'organised' });
  // Restore archived session back to organised status
}

export async function clearAllSessions(): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.SESSIONS]: [] });
}

/**
 * Get current browser session (all open tabs)
 * Returns a Session object with id "current" that represents live tabs
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const chromeTabs = await chrome.tabs.query({});
    
    if (chromeTabs.length === 0) {
      return null;
    }

    // Convert Chrome tabs to our Tab format
    // For current session, use Chrome tab ID as the tab ID so we can reference the actual tab
    const tabs: Tab[] = chromeTabs.map((chromeTab) => ({
      id: `chrome_${chromeTab.id}`, // Prefix to distinguish from generated IDs
      title: chromeTab.title || 'Untitled',
      url: chromeTab.url || '',
      status: 'pending' as const,
      favIconUrl: chromeTab.favIconUrl,
    }));

    // Create session object with special "current" ID
    const session: Session = {
      id: 'current',
      timestamp: Date.now(),
      status: 'pending',
      tabs,
    };

    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
}

// Notion Config
export async function getNotionConfig(): Promise<NotionConfig> {
  await ensureStorageStructure();
  const result = await chrome.storage.local.get(STORAGE_KEYS.NOTION_CONFIG);
  return (result[STORAGE_KEYS.NOTION_CONFIG] as NotionConfig) || { databases: {} };
}

export async function saveNotionConfig(config: NotionConfig): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.NOTION_CONFIG]: config });
}

// Notes
export async function getNotes(): Promise<Note[]> {
  await ensureStorageStructure();
  const result = await chrome.storage.local.get(STORAGE_KEYS.NOTES);
  return (result[STORAGE_KEYS.NOTES] as Note[]) || [];
}

export async function getNote(sessionId: string, tabId: string): Promise<Note | undefined> {
  const notes = await getNotes();
  return notes.find((n) => n.sessionId === sessionId && n.tabId === tabId);
}

export async function saveNote(note: Note): Promise<void> {
  const notes = await getNotes();
  const existingIndex = notes.findIndex(
    (n) => n.sessionId === note.sessionId && n.tabId === note.tabId
  );
  
  if (existingIndex >= 0) {
    notes[existingIndex] = note;
  } else {
    notes.push(note);
  }
  
  await chrome.storage.local.set({ [STORAGE_KEYS.NOTES]: notes });
}

export async function deleteNote(sessionId: string, tabId: string): Promise<void> {
  const notes = await getNotes();
  const filtered = notes.filter(
    (n) => !(n.sessionId === sessionId && n.tabId === tabId)
  );
  await chrome.storage.local.set({ [STORAGE_KEYS.NOTES]: filtered });
}

// Backup Capture (for session capture safety)
export interface BackupCapture {
  timestamp: number;
  tabs: Tab[];
}

export async function saveBackupCapture(tabs: Tab[]): Promise<void> {
  const backup: BackupCapture = {
    timestamp: Date.now(),
    tabs,
  };
  await chrome.storage.local.set({ [STORAGE_KEYS.BACKUP_CAPTURE]: backup });
}

export async function getBackupCapture(): Promise<BackupCapture | null> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.BACKUP_CAPTURE);
  return (result[STORAGE_KEYS.BACKUP_CAPTURE] as BackupCapture) || null;
}

export async function clearBackupCapture(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEYS.BACKUP_CAPTURE);
}

// Heartbeat (for browser close detection)
export async function saveHeartbeat(): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.HEARTBEAT]: Date.now() });
}

export async function getHeartbeat(): Promise<number | null> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.HEARTBEAT);
  return (result[STORAGE_KEYS.HEARTBEAT] as number) || null;
}

