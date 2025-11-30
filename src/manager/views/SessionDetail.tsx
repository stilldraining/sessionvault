import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionFull, updateSession, getCurrentSession, archiveSession, deleteSession, restoreSession, saveSession } from '../../lib/storage';
import type { Session, Tab, TabStatus } from '../../lib/types';
import TabCard from '../components/TabCard';
import NotionModal from '../components/NotionModal';
import { useSelection } from '../contexts/SelectionContext';
import { useSessionActions } from '../contexts/SessionActionsContext';

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [notionModalOpen, setNotionModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dismissedExpanded, setDismissedExpanded] = useState(false);
  const [actionedExpanded, setActionedExpanded] = useState(false);
  const isCurrentSession = id === 'current';
  const { selectedTabs, toggleSelection, clearSelection, setPendingTabIds, setBulkActions } = useSelection();
  const { setSessionActions } = useSessionActions();

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

  const updateTabStatus = useCallback(async (tabId: string, status: TabStatus) => {
    setSession((currentSession) => {
      if (!currentSession) return currentSession;

      const updatedTabs = currentSession.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, status } : tab
      );

      // Check if ALL tabs have final status (bookmarked, saved-to-notion, or dismissed)
      // 'done' status does not count as a final action
      const allTabsProcessed = updatedTabs.length > 0 && updatedTabs.every((tab) => 
        tab.status === 'bookmarked' || tab.status === 'saved-to-notion' || tab.status === 'dismissed'
      );
      
      // Check if there are any pending tabs
      const hasPendingTabs = updatedTabs.some((tab) => tab.status === 'pending');
      
      // For past sessions, set status based on tab states:
      // - If all tabs are processed, set to 'organised'
      // - If there are pending tabs and session was 'organised', change to 'to-do'
      // - Otherwise, maintain current status (or set to 'to-do' if it's a past session with pending tabs)
      // For current session, keep status as 'pending'
      let newStatus = currentSession.status;
      if (!isCurrentSession) {
        if (allTabsProcessed) {
          newStatus = 'organised';
        } else if (hasPendingTabs) {
          // If there are pending tabs, set to 'to-do' (especially if it was 'organised' before)
          newStatus = 'to-do';
        }
        // If no pending tabs but not all processed, keep current status
      }
      
      const updatedSession: Session = {
        ...currentSession,
        tabs: updatedTabs,
        status: newStatus,
      };

      // For current session, only update local state (don't save to storage)
      if (isCurrentSession) {
        return updatedSession;
      } else {
        // For saved sessions, update storage asynchronously
        updateSession(currentSession.id, updatedSession).catch((error) => {
          console.error('Error updating session:', error);
        });
        return updatedSession;
      }
    });
  }, [isCurrentSession]);

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

  const handleBulkBookmark = useCallback(async () => {
    if (!session || selectedTabs.size === 0) return;

    const tabsToBookmark = session.tabs.filter((tab) => selectedTabs.has(tab.id));
    
    try {
      // Bookmark all selected tabs
      for (const tab of tabsToBookmark) {
        await chrome.bookmarks.create({
          title: tab.title,
          url: tab.url,
        });
        await updateTabStatus(tab.id, 'bookmarked');
      }
      clearSelection();
    } catch (error) {
      console.error('Error bookmarking tabs:', error);
      alert('Failed to bookmark some tabs. Please try again.');
    }
  }, [session, selectedTabs, updateTabStatus, clearSelection]);

  const handleBulkSaveToNotion = useCallback(() => {
    if (selectedTabs.size === 0) return;
    setNotionModalOpen(true);
  }, [selectedTabs]);

  const handleBulkDismiss = useCallback(async () => {
    if (!session || selectedTabs.size === 0) return;

    const tabsToDismiss = session.tabs.filter((tab) => selectedTabs.has(tab.id));
    
    try {
      // Dismiss all selected tabs
      for (const tab of tabsToDismiss) {
        await updateTabStatus(tab.id, 'dismissed');
      }
      clearSelection();
    } catch (error) {
      console.error('Error dismissing tabs:', error);
      alert('Failed to dismiss some tabs. Please try again.');
    }
  }, [session, selectedTabs, updateTabStatus, clearSelection]);

  // Register bulk actions and update pending tab IDs when session changes
  useEffect(() => {
    if (session) {
      const pendingIds = session.tabs
        .filter((tab) => tab.status === 'pending')
        .map((tab) => tab.id);
      setPendingTabIds(pendingIds);
      
      setBulkActions({
        onBulkBookmark: handleBulkBookmark,
        onBulkSaveToNotion: handleBulkSaveToNotion,
        onBulkDismiss: handleBulkDismiss,
      });
    }
  }, [session, selectedTabs, handleBulkBookmark, handleBulkSaveToNotion, handleBulkDismiss, setPendingTabIds, setBulkActions]);

  // Clear selection when session ID changes (not on every render)
  useEffect(() => {
    clearSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleNotionSuccess() {
    if (!session || selectedTabs.size === 0) return;

    const tabsToSave = session.tabs.filter((tab) => selectedTabs.has(tab.id));
    
    try {
      // Mark all selected tabs as saved-to-notion
      for (const tab of tabsToSave) {
        await updateTabStatus(tab.id, 'saved-to-notion');
      }
      setNotionModalOpen(false);
      clearSelection();
    } catch (error) {
      console.error('Error updating tab status:', error);
      alert('Failed to update some tabs. Please try again.');
    }
  }

  function handleRestore(tab: Tab) {
    updateTabStatus(tab.id, 'pending');
  }

  const handleRestoreTabs = useCallback(async () => {
    if (!session || isCurrentSession) return;
    
    try {
      // Only restore tabs that are not actioned (bookmarked/saved-to-notion) or dismissed
      const tabsToRestore = session.tabs.filter(tab => 
        tab.status !== 'dismissed' && 
        tab.status !== 'bookmarked' && 
        tab.status !== 'saved-to-notion'
      );
      
      // Create tabs in the current window
      for (const tab of tabsToRestore) {
        await chrome.tabs.create({ url: tab.url });
      }
    } catch (error) {
      console.error('Error restoring tabs:', error);
      alert('Failed to restore tabs. Please try again.');
    }
  }, [session, isCurrentSession]);

  const handleArchiveSession = useCallback(async () => {
    if (!session || isCurrentSession) return;
    
    try {
      // For History sessions, dismiss all tabs first, then archive
      // Dismiss all tabs that aren't already dismissed, bookmarked, or saved-to-notion
      const updatedTabs = session.tabs.map(tab => {
        if (tab.status !== 'dismissed' && tab.status !== 'bookmarked' && tab.status !== 'saved-to-notion') {
          return { ...tab, status: 'dismissed' as const };
        }
        return tab;
      });
      
      // Update the session with all tabs dismissed, then archive
      const updatedSession: Session = {
        ...session,
        tabs: updatedTabs,
        status: 'archived',
      };
      
      await saveSession(updatedSession);
      
      // Update local state
      setSession(updatedSession);
      
      // Navigate to sessions list
      navigate('/session/current');
    } catch (error) {
      console.error('Error archiving session:', error);
      alert('Failed to archive session. Please try again.');
    }
  }, [session, isCurrentSession, navigate]);

  const handleRestoreSession = useCallback(async () => {
    if (!session || session.status !== 'archived') return;
    
    try {
      await restoreSession(session.id);
      // Reload the session to reflect the restored status
      await loadSession(session.id);
    } catch (error) {
      console.error('Error restoring session:', error);
      alert('Failed to restore session. Please try again.');
    }
  }, [session]);

  const handleDeleteClick = useCallback(() => {
    setDeleteModalOpen(true);
  }, []);

  async function handleDeleteConfirm() {
    if (!session || isCurrentSession) return;
    
    try {
      await deleteSession(session.id);
      setDeleteModalOpen(false);
      // Navigate back to sessions list
      navigate('/session/current');
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session. Please try again.');
    }
  }

  // Register session actions when session is loaded
  useEffect(() => {
    if (session && !isCurrentSession) {
      if (session.status === 'archived') {
        // For archived sessions, show Restore and Delete
        setSessionActions({
          onRestoreSession: handleRestoreSession,
          onDeleteSession: handleDeleteClick,
        });
      } else if (session.status === 'organised') {
        // For organised sessions, show Restore Tabs, Archive, and Delete
        setSessionActions({
          onRestoreWindow: handleRestoreTabs,
          onArchiveSession: handleArchiveSession,
          onDeleteSession: handleDeleteClick,
        });
      } else {
        // For other statuses (to-do, pending), show Restore Tabs, Archive, and Delete
        setSessionActions({
          onRestoreWindow: handleRestoreTabs,
          onArchiveSession: handleArchiveSession,
          onDeleteSession: handleDeleteClick,
        });
      }
    } else {
      setSessionActions({
        onRestoreWindow: undefined,
        onArchiveSession: undefined,
        onDeleteSession: undefined,
        onRestoreSession: undefined,
      });
    }
  }, [session, isCurrentSession, setSessionActions, handleRestoreTabs, handleArchiveSession, handleDeleteClick, handleRestoreSession]);

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

  // Filter tabs: all tabs for display
  const allTabs = session.tabs;
  const dismissedTabs = session.tabs.filter((t) => t.status === 'dismissed');
  const actionedTabs = session.tabs.filter((t) => 
    t.status === 'bookmarked' || t.status === 'saved-to-notion'
  );
  const pendingTabs = session.tabs.filter((t) => t.status === 'pending');
  // Processed tabs are those with final status (bookmarked, saved-to-notion, or dismissed)
  const processedTabs = session.tabs.filter((t) => 
    t.status === 'bookmarked' || t.status === 'saved-to-notion' || t.status === 'dismissed'
  );
  const totalTabs = allTabs.length;
  const processedCount = processedTabs.length;
  
  // Check if all tabs are processed (all have final status)
  const allTabsProcessed = session.tabs.length > 0 && session.tabs.every((tab) =>
    tab.status === 'bookmarked' || tab.status === 'saved-to-notion' || tab.status === 'dismissed'
  );
  
  // A session is archived when it's been explicitly archived (moved to Archived Sessions)
  // Sessions with status 'to-do' or 'organised' stay in History, only 'archived' status goes to Archived Sessions
  const isArchived = session.status === 'archived';
  
  // Always show only pending tabs in main list (even when session is completed)
  // Completed sessions that aren't archived yet should still show accordions
  const activeTabs = session.tabs.filter((t) => t.status !== 'dismissed' && t.status !== 'bookmarked' && t.status !== 'saved-to-notion');

  return (
    <div className="session-detail-container">
      <div className="tabs-list">
        {activeTabs.map((tab) => {
          const isSelectable = !isArchived && tab.status === 'pending';
          return (
            <TabCard
              key={tab.id}
              tab={tab}
              isCurrentSession={isCurrentSession}
              isArchived={isArchived}
              isSelected={selectedTabs.has(tab.id)}
              isSelectable={isSelectable}
              onOpen={() => handleOpen(tab)}
              onCopyLink={() => handleCopyLink(tab)}
              onToggleSelection={() => toggleSelection(tab.id)}
            />
          );
        })}
      </div>

      {/* Show completion message and actions when all tabs are processed (for organised sessions) */}
      {allTabsProcessed && !isCurrentSession && session.status === 'organised' && (
        <div className="session-completion-message">
          <div className="completion-message-text">All tabs organised</div>
          <div className="completion-actions">
            <button className="completion-action-button completion-action-archive" onClick={handleArchiveSession}>
              Archive
            </button>
            <button className="completion-action-button completion-action-delete" onClick={handleDeleteClick}>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Show completion message and actions when all tabs are processed (for archived sessions) */}
      {allTabsProcessed && !isCurrentSession && isArchived && (
        <div className="session-completion-message">
          <div className="completion-message-text">Tabs have been managed</div>
          <div className="completion-actions">
            <button className="completion-action-button completion-action-restore" onClick={handleRestoreSession}>
              Restore Session
            </button>
            <button className="completion-action-button completion-action-delete" onClick={handleDeleteClick}>
              Delete Session
            </button>
          </div>
        </div>
      )}

      {/* Show actioned section when there are actioned tabs (even if session is completed) */}
      {actionedTabs.length > 0 && (
        <div className="actioned-section">
          <button
            className="actioned-section-header"
            onClick={() => setActionedExpanded(!actionedExpanded)}
          >
            <span>Actioned ({actionedTabs.length})</span>
            <span className="actioned-toggle">{actionedExpanded ? '▼' : '▶'}</span>
          </button>
          {actionedExpanded && (
            <div className="actioned-tabs-list">
              {actionedTabs.map((tab) => (
                <TabCard
                  key={tab.id}
                  tab={tab}
                  isCurrentSession={isCurrentSession}
                  isArchived={false}
                  isSelected={false}
                  isSelectable={false}
                  onOpen={() => handleOpen(tab)}
                  onCopyLink={() => handleCopyLink(tab)}
                  onRestore={() => handleRestore(tab)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Show dismissed section when there are dismissed tabs (even if session is completed) */}
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
                  isArchived={false}
                  isSelected={false}
                  isSelectable={false}
                  onOpen={() => handleOpen(tab)}
                  onCopyLink={() => handleCopyLink(tab)}
                  onRestore={() => handleRestore(tab)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {notionModalOpen && selectedTabs.size > 0 && session && (
        <NotionModal
          tabs={session.tabs.filter((tab) => selectedTabs.has(tab.id))}
          onClose={() => {
            setNotionModalOpen(false);
          }}
          onSuccess={handleNotionSuccess}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <div className="delete-modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3>Delete Session</h3>
              <button className="delete-modal-close" onClick={() => setDeleteModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="delete-modal-content">
              <p>Are you sure you want to delete this session? This action cannot be undone.</p>
            </div>
            <div className="delete-modal-actions">
              <button className="delete-modal-button delete-modal-cancel" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="delete-modal-button delete-modal-confirm" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

