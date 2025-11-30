import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSessionMetadata, getCurrentSession } from '../../lib/storage';
import type { SessionMetadata, Session } from '../../lib/types';

export default function SessionsSidebar() {
  const [sessions, setSessions] = useState<SessionMetadata[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract session ID from pathname (e.g., /session/current or /session/abc123)
  const pathMatch = location.pathname.match(/\/session\/(.+)$/);
  const activeSessionId = pathMatch ? pathMatch[1] : null;

  useEffect(() => {
    loadSessions();

    // Listen for storage changes to auto-refresh sessions
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'local' && changes.sessions) {
        console.log('[SessionsSidebar] Sessions changed in storage, reloading...');
        loadSessions();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  async function loadSessions() {
    try {
      // Fetch current session
      const current = await getCurrentSession();
      setCurrentSession(current);

      // Use metadata for list view to reduce memory usage
      const allSessions = await getSessionMetadata();
      // Sort by newest first
      const sorted = allSessions.sort((a, b) => b.timestamp - a.timestamp);
      setSessions(sorted);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  // Separate sessions: current session, history (all past non-archived), and archived
  const historySessions = sessions.filter((s) => s.status !== 'archived' && s.id !== 'current');
  const archivedSessions = sessions.filter((s) => s.status === 'archived');

  function handleSessionClick(sessionId: string) {
    navigate(`/session/${sessionId}`);
  }

  if (loading) {
    return (
      <div className="sessions-sidebar">
        <div className="sessions-sidebar-content">
          <div className="loading-state">Loading sessions...</div>
        </div>
      </div>
    );
  }

  const hasSessions = sessions.length > 0 || currentSession;
  const hasHistorySessions = historySessions.length > 0;
  const hasArchivedSessions = archivedSessions.length > 0;

  return (
    <div className="sessions-sidebar">
      <div className="sessions-sidebar-content">
        {!hasSessions ? (
          <div className="empty-state">
            <p>No sessions yet</p>
            <p className="empty-state-hint">Close your browser to save your first session.</p>
          </div>
        ) : (
          <>
            {/* Active Session - Always at top */}
            {currentSession && (
              <div className="sessions-sidebar-section">
                <div className="sessions-sidebar-list">
                  <SessionSidebarItem
                    session={currentSession}
                    isActive={activeSessionId === 'current'}
                    onClick={() => handleSessionClick('current')}
                  />
                </div>
              </div>
            )}

            {/* History - All past sessions */}
            {hasHistorySessions && (
              <div className="sessions-sidebar-section">
                <div className="sessions-sidebar-section-header">
                  <h3 className="sessions-sidebar-section-title">History</h3>
                </div>
                <div className="sessions-sidebar-list">
                  {historySessions.map((session) => (
                    <SessionSidebarItem
                      key={session.id}
                      session={session}
                      isActive={activeSessionId === session.id}
                      onClick={() => handleSessionClick(session.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Archived Sessions (Completed) */}
            {hasArchivedSessions && (
              <div className="sessions-sidebar-section">
                <div className="sessions-sidebar-section-header">
                  <h3 className="sessions-sidebar-section-title">Archived</h3>
                </div>
                <div className="sessions-sidebar-list">
                  {archivedSessions.map((session) => (
                    <SessionSidebarItem
                      key={session.id}
                      session={session}
                      isActive={activeSessionId === session.id}
                      onClick={() => handleSessionClick(session.id)}
                      isArchived={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="sessions-sidebar-footer">
        <button
          className="sidebar-settings-button"
          onClick={() => navigate('/settings')}
          aria-label="Settings"
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
}

interface SessionSidebarItemProps {
  session: Session | SessionMetadata;
  isActive: boolean;
  onClick: () => void;
  isArchived?: boolean;
}

function SessionSidebarItem({ session, isActive, onClick, isArchived = false }: SessionSidebarItemProps) {
  const isCurrentSession = session.id === 'current';
  
  // Format date as "DD MMM, HH:mm" (e.g., "15 Jan, 14:30")
  const date = new Date(session.timestamp);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedDate = `${day} ${month}, ${hours}:${minutes}`;

  // Support both full Session and SessionMetadata
  const totalTabs = 'tabCount' in session ? session.tabCount : session.tabs.length;
  const pendingTabs = 'pendingTabCount' in session 
    ? session.pendingTabCount 
    : session.tabs.filter((t) => t.status === 'pending').length;

  // Current Session: Title + "X tabs"
  if (isCurrentSession) {
    return (
      <div
        className={`session-sidebar-item ${isActive ? 'session-sidebar-item-active' : ''} session-sidebar-item-current`}
        onClick={onClick}
      >
        <div className="session-sidebar-item-header">
          <div className="session-sidebar-item-title">Active Window</div>
        </div>
        <div className="session-sidebar-item-body">
          <div className="session-sidebar-item-subtitle">
            {totalTabs} {totalTabs === 1 ? 'tab' : 'tabs'}
          </div>
        </div>
      </div>
    );
  }

  // Archived Sessions: Title (date) + "Y tabs"
  if (isArchived) {
    return (
      <div
        className={`session-sidebar-item ${isActive ? 'session-sidebar-item-active' : ''} session-sidebar-item-archived`}
        onClick={onClick}
      >
        <div className="session-sidebar-item-header">
          <div className="session-sidebar-item-title">{formattedDate}</div>
        </div>
        <div className="session-sidebar-item-body">
          <div className="session-sidebar-item-subtitle">
            {totalTabs} {totalTabs === 1 ? 'tab' : 'tabs'}
          </div>
        </div>
      </div>
    );
  }

  // History Sessions: Title (date) + Subtitle ("X tabs") + Badge ("To-do" or "Organised")
  const isOrganised = session.status === 'organised';
  
  return (
    <div
      className={`session-sidebar-item ${isActive ? 'session-sidebar-item-active' : ''}`}
      onClick={onClick}
    >
      <div className="session-sidebar-item-header">
        <div className="session-sidebar-item-title">{formattedDate}</div>
        <div className={`session-sidebar-item-badge ${isOrganised ? 'session-sidebar-item-badge-completed' : 'session-sidebar-item-badge-in-progress'}`}>
          {isOrganised ? 'Organised' : 'To-do'}
        </div>
      </div>
      <div className="session-sidebar-item-body">
        <div className="session-sidebar-item-subtitle">
          {totalTabs} {totalTabs === 1 ? 'tab' : 'tabs'}
        </div>
      </div>
    </div>
  );
}

