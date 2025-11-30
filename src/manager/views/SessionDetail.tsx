import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionFull, updateSession, getCurrentSession } from '../../lib/storage';
import type { Session, Tab, TabStatus } from '../../lib/types';
import TabCard from '../components/TabCard';
import NotionModal from '../components/NotionModal';

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [notionModalOpen, setNotionModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  const [dismissedExpanded, setDismissedExpanded] = useState(false);
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

  async function updateTabStatus(tabId: string, status: TabStatus) {
    if (!session) return;

    const updatedTabs = session.tabs.map((tab) =>
      tab.id === tabId ? { ...tab, status } : tab
    );

    // Check if all non-dismissed tabs are done
    const activeTabs = updatedTabs.filter((tab) => tab.status !== 'dismissed');
    const allDone = activeTabs.length > 0 && activeTabs.every((tab) => tab.status === 'done');
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
    // Open action does not change state
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
  }

  async function handleCopyLink(tab: Tab) {
    // Copy link does not change state
    try {
      await navigator.clipboard.writeText(tab.url);
    } catch (error) {
      console.error('Error copying link:', error);
      alert('Failed to copy link');
    }
  }

  async function handleBookmark(tab: Tab) {
    try {
      await chrome.bookmarks.create({
        title: tab.title,
        url: tab.url,
      });
      // On success, change to done
      await updateTabStatus(tab.id, 'done');
    } catch (error) {
      console.error('Error bookmarking:', error);
      alert('Failed to bookmark');
    }
  }

  function handleSaveToNotion(tab: Tab) {
    setSelectedTab(tab);
    setNotionModalOpen(true);
  }

  async function handleNotionSuccess() {
    if (selectedTab) {
      await updateTabStatus(selectedTab.id, 'done');
    }
    setNotionModalOpen(false);
    setSelectedTab(null);
  }

  function handleClose(tab: Tab) {
    // Only for previous sessions (not current)
    if (!isCurrentSession) {
      updateTabStatus(tab.id, 'dismissed');
    }
  }

  function handleRestore(tab: Tab) {
    updateTabStatus(tab.id, 'pending');
  }

  async function handleMarkComplete() {
    if (!session) return;

    // Mark all non-dismissed tabs as done
    const updatedTabs = session.tabs.map((tab) => ({
      ...tab,
      status: tab.status === 'dismissed' ? tab.status : ('done' as const),
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

  // Filter tabs: active (pending/done) and dismissed
  const activeTabs = session.tabs.filter((t) => t.status !== 'dismissed');
  const dismissedTabs = session.tabs.filter((t) => t.status === 'dismissed');
  const pendingTabs = activeTabs.filter((t) => t.status === 'pending');
  const doneTabs = activeTabs.filter((t) => t.status === 'done');
  const totalTabs = activeTabs.length;
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
        {activeTabs.map((tab) => (
          <TabCard
            key={tab.id}
            tab={tab}
            isCurrentSession={isCurrentSession}
            onOpen={() => handleOpen(tab)}
            onCopyLink={() => handleCopyLink(tab)}
            onBookmark={() => handleBookmark(tab)}
            onSaveToNotion={() => handleSaveToNotion(tab)}
            onClose={!isCurrentSession ? () => handleClose(tab) : undefined}
          />
        ))}
      </div>

      {dismissedTabs.length > 0 && (
        <div className="dismissed-section">
          <button
            className="dismissed-section-header"
            onClick={() => setDismissedExpanded(!dismissedExpanded)}
          >
            <span>Dismissed ({dismissedTabs.length})</span>
            <span className="dismissed-toggle">{dismissedExpanded ? '▼' : '▶'}</span>
          </button>
          {dismissedExpanded && (
            <div className="dismissed-tabs-list">
              {dismissedTabs.map((tab) => (
                <TabCard
                  key={tab.id}
                  tab={tab}
                  isCurrentSession={isCurrentSession}
                  onOpen={() => handleOpen(tab)}
                  onCopyLink={() => handleCopyLink(tab)}
                  onBookmark={() => handleBookmark(tab)}
                  onSaveToNotion={() => handleSaveToNotion(tab)}
                  onRestore={() => handleRestore(tab)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {notionModalOpen && selectedTab && (
        <NotionModal
          tab={selectedTab}
          onClose={() => {
            setNotionModalOpen(false);
            setSelectedTab(null);
          }}
          onSuccess={handleNotionSuccess}
        />
      )}
    </div>
  );
}

