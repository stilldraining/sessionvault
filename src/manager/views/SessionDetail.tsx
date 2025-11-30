import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionFull, updateSession, getCurrentSession } from '../../lib/storage';
import type { Session, Tab } from '../../lib/types';
import TabCard from '../components/TabCard';
import SaveMenu from '../components/SaveMenu';

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  const isCurrentSession = id === 'current';

  useEffect(() => {
    if (id) {
      loadSession(id);
    }
  }, [id]);

  async function loadSession(sessionId: string) {
    try {
      if (sessionId === 'current') {
        // Load current browser session
        const current = await getCurrentSession();
        if (current) {
          setSession(current);
        }
      } else {
        // Load full session data on demand
        const found = await getSessionFull(sessionId);
        if (found) {
          setSession(found);
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateTabStatus(tabId: string, status: 'pending' | 'done') {
    if (!session) return;

    const updatedTabs = session.tabs.map((tab) =>
      tab.id === tabId ? { ...tab, status } : tab
    );

    const allDone = updatedTabs.every((tab) => tab.status === 'done');
    const updatedSession: Session = {
      ...session,
      tabs: updatedTabs,
      status: allDone ? 'completed' : session.status,
    };

    // For current session, only update local state (don't save to storage)
    if (isCurrentSession) {
      setSession(updatedSession);
    } else {
      await updateSession(session.id, updatedSession);
      setSession(updatedSession);
    }
  }

  async function handleOpen(tab: Tab) {
    if (isCurrentSession && tab.id.startsWith('chrome_')) {
      // For current session, navigate the existing Chrome tab
      const chromeTabId = parseInt(tab.id.replace('chrome_', ''), 10);
      try {
        await chrome.tabs.update(chromeTabId, { active: true });
        // Also bring the window to front
        const chromeTab = await chrome.tabs.get(chromeTabId);
        if (chromeTab.windowId) {
          await chrome.windows.update(chromeTab.windowId, { focused: true });
        }
      } catch (error) {
        console.error('Error navigating to tab:', error);
        // Fallback: open in new tab if the tab was closed
        chrome.tabs.create({ url: tab.url });
      }
    } else {
      // For saved sessions, create a new tab
      chrome.tabs.create({ url: tab.url });
    }
    updateTabStatus(tab.id, 'done');
  }

  function handleDismiss(tab: Tab) {
    updateTabStatus(tab.id, 'done');
  }

  function handleSave(tab: Tab) {
    setSelectedTab(tab);
    setSaveMenuOpen(true);
  }

  async function handleSaveComplete() {
    if (selectedTab) {
      await updateTabStatus(selectedTab.id, 'done');
    }
    setSaveMenuOpen(false);
    setSelectedTab(null);
  }

  async function handleMarkComplete() {
    if (!session) return;

    const updatedTabs = session.tabs.map((tab) => ({
      ...tab,
      status: 'done' as const,
    }));

    const updatedSession: Session = {
      ...session,
      tabs: updatedTabs,
      status: 'completed',
    };

    // For current session, only update local state (don't save to storage)
    if (isCurrentSession) {
      setSession(updatedSession);
    } else {
      await updateSession(session.id, updatedSession);
      setSession(updatedSession);
    }
  }

  if (loading) {
    return (
      <div className="session-detail-container">
        <div className="loading-state">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="session-detail-container">
        <div className="error-state">Session not found</div>
      </div>
    );
  }

  const pendingTabs = session.tabs.filter((t) => t.status === 'pending');
  const doneTabs = session.tabs.filter((t) => t.status === 'done');
  const totalTabs = session.tabs.length;
  const processedCount = doneTabs.length;

  const canMarkComplete = pendingTabs.length > 0 && session.status !== 'completed';

  return (
    <div className="session-detail-container">
      <div className="session-detail-header">
        <div className="session-progress">
          <h2 className="session-detail-title">
            {isCurrentSession ? 'Current Session' : 'Session Details'}
          </h2>
          <div className="progress-indicator">
            {processedCount} of {totalTabs} tabs processed
          </div>
        </div>
        {canMarkComplete && (
          <button className="mark-complete-button" onClick={handleMarkComplete}>
            Mark Session Complete
          </button>
        )}
      </div>

      <div className="tabs-list">
        {session.tabs.map((tab) => (
          <TabCard
            key={tab.id}
            tab={tab}
            onOpen={() => handleOpen(tab)}
            onDismiss={() => handleDismiss(tab)}
            onSave={() => handleSave(tab)}
          />
        ))}
      </div>

      {saveMenuOpen && selectedTab && (
        <SaveMenu
          tab={selectedTab}
          sessionId={session.id}
          onClose={() => {
            setSaveMenuOpen(false);
            setSelectedTab(null);
          }}
          onSaveComplete={handleSaveComplete}
        />
      )}
    </div>
  );
}

