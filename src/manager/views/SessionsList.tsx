import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessionMetadata, getCurrentSession, clearAllSessions } from '../../lib/storage';
import type { SessionMetadata, Session } from '../../lib/types';
import SessionCard from '../components/SessionCard';

type FilterStatus = 'all' | 'pending' | 'to-do' | 'organised';

export default function SessionsList() {
  const [sessions, setSessions] = useState<SessionMetadata[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();

    // Listen for storage changes to auto-refresh sessions
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'local' && changes.sessions) {
        console.log('[SessionsList] Sessions changed in storage, reloading...');
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

  async function handleClearAll() {
    const confirmed = window.confirm(
      'Are you sure you want to clear all saved sessions? This cannot be undone.\n\n(Your current session will remain visible)'
    );
    
    if (confirmed) {
      try {
        await clearAllSessions();
        console.log('[SessionsList] All sessions cleared');
        // Reload sessions to update UI
        await loadSessions();
      } catch (error) {
        console.error('[SessionsList] Error clearing sessions:', error);
        alert('Failed to clear sessions. Please try again.');
      }
    }
  }

  const filteredSessions = sessions.filter((session) => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  // Show current session if filter is 'all' or 'pending'
  const showCurrentSession = currentSession && (filter === 'all' || filter === 'pending');

  if (loading) {
    return (
      <div className="sessions-list-container">
        <div className="loading-state">Loading sessions...</div>
      </div>
    );
  }

  if (sessions.length === 0 && !currentSession) {
    return (
      <div className="sessions-list-container">
        <div className="empty-state">
          <h2>No sessions yet</h2>
          <p>Close your browser to save your first session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sessions-list-container">
      <div className="sessions-header">
        <h2 className="sessions-title">Your Sessions</h2>
        <div className="sessions-header-actions">
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterStatus)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="to-do">To-do</option>
            <option value="organised">Organised</option>
          </select>
          {sessions.length > 0 && (
            <button
              className="clear-all-button"
              onClick={handleClearAll}
              title="Clear all saved sessions"
            >
              Clear All Sessions
            </button>
          )}
        </div>
      </div>
      <div className="sessions-grid">
        {showCurrentSession && (
          <SessionCard
            key="current"
            session={currentSession}
            onClick={() => navigate('/session/current')}
          />
        )}
        {filteredSessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onClick={() => navigate(`/session/${session.id}`)}
          />
        ))}
      </div>
      {filteredSessions.length === 0 && !showCurrentSession && (
        <div className="empty-state">
          <p>No {filter} sessions found.</p>
        </div>
      )}
    </div>
  );
}

