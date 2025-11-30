export type TabStatus = 'pending' | 'done' | 'dismissed' | 'bookmarked' | 'saved-to-notion';
export type SessionStatus = 'pending' | 'to-do' | 'organised' | 'archived';

export interface Tab {
  id: string;
  title: string;
  url: string;
  status: TabStatus;
  favIconUrl?: string;
}

export interface Session {
  id: string;
  timestamp: number;
  status: SessionStatus;
  tabs: Tab[];
}

export interface SessionMetadata {
  id: string;
  timestamp: number;
  status: SessionStatus;
  tabCount: number;
  pendingTabCount: number;
}

export interface NotionDatabaseMapping {
  databaseId: string;
  databaseName: string;
  titleField: string;
  urlField: string;
  tagField?: string;
}

export interface NotionConfig {
  token?: string;
  databases: Record<string, NotionDatabaseMapping>;
}

export interface Note {
  sessionId: string;
  tabId: string;
  text: string;
}

export interface StorageData {
  sessions: Session[];
  notionConfig: NotionConfig;
  notes: Note[];
}

