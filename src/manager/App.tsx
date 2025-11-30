import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { SelectionProvider, useSelection } from './contexts/SelectionContext';
import { SessionActionsProvider, useSessionActions } from './contexts/SessionActionsContext';
import SessionsSidebar from './components/SessionsSidebar';
import SessionDetail from './views/SessionDetail';
import Settings from './views/Settings';
import { getSessionMetadata, getCurrentSession } from '../lib/storage';
import { useEffect, useState } from 'react';
import '../index.css';
import './manager.css';

function NavigationActions() {
  const location = useLocation();
  const isSessionPage = location.pathname.startsWith('/session/') && location.pathname !== '/session';
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCurrentSession, setIsCurrentSession] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<'pending' | 'to-do' | 'organised' | 'archived' | null>(null);

  const { selectedTabs, hasSelection, pendingTabIds, selectAll, clearSelection, onBulkBookmark, onBulkSaveToNotion, onBulkDismiss } = useSelection();
  const { onRestoreWindow, onArchiveSession, onDeleteSession, onRestoreSession } = useSessionActions();

  // Extract session ID from pathname
  useEffect(() => {
    if (isSessionPage) {
      const match = location.pathname.match(/\/session\/(.+)$/);
      const id = match ? match[1] : null;
      setSessionId(id);
      setIsCurrentSession(id === 'current');
      
      // Load session metadata to check status
      if (id && id !== 'current') {
        getSessionMetadata().then(sessions => {
          const session = sessions.find(s => s.id === id);
          setSessionStatus(session?.status || null);
        });
      } else {
        setSessionStatus(null);
      }
    }
  }, [location.pathname, isSessionPage]);

  if (!isSessionPage) {
    return null;
  }

  const canSelectAll = pendingTabIds.length > 0 && !hasSelection;
  const isArchived = sessionStatus === 'archived';
  const isOrganised = sessionStatus === 'organised';
  // Only show session actions in header for organised sessions (archived sessions show buttons in completion message)
  const showSessionActions = !isCurrentSession && !hasSelection && isOrganised && 
    onRestoreWindow && onArchiveSession && onDeleteSession;
  const showSelectAll = canSelectAll && isCurrentSession;

  return (
    <div className="nav-actions">
      {hasSelection ? (
        <>
          <span className="nav-selection-count">
            {selectedTabs.size} tab{selectedTabs.size !== 1 ? 's' : ''} selected
          </span>
          <div className="nav-bulk-actions">
            <button 
              className="nav-action-button nav-action-bookmark" 
              onClick={onBulkBookmark}
              disabled={!onBulkBookmark}
            >
              Bookmark
            </button>
            <button 
              className="nav-action-button nav-action-notion" 
              onClick={onBulkSaveToNotion}
              disabled={!onBulkSaveToNotion}
            >
              Save to Notion
            </button>
            <button 
              className="nav-action-button nav-action-dismiss" 
              onClick={onBulkDismiss}
              disabled={!onBulkDismiss}
            >
              Dismiss
            </button>
            <button className="nav-action-button nav-action-clear" onClick={clearSelection}>
              Clear
            </button>
          </div>
        </>
      ) : showSessionActions ? (
        <div className="nav-bulk-actions">
          <button 
            className="nav-action-button nav-action-restore" 
            onClick={onRestoreWindow}
          >
            Restore Tabs
          </button>
          <button 
            className="nav-action-button nav-action-archive" 
            onClick={onArchiveSession}
          >
            Archive Session
          </button>
          <button 
            className="nav-action-button nav-action-delete" 
            onClick={onDeleteSession}
          >
            Delete Session
          </button>
        </div>
      ) : showSelectAll ? (
        <button 
          className="nav-action-button nav-action-select-all" 
          onClick={() => selectAll(pendingTabIds)}
        >
          Select All
        </button>
      ) : null}
    </div>
  );
}

function Navigation() {
  return (
    <nav className="manager-nav">
      <div className="nav-left">
        <h1 className="nav-title">SessionVault</h1>
      </div>
      <NavigationActions />
    </nav>
  );
}

function SessionLayout() {
  return (
    <div className="session-layout">
      <SessionsSidebar />
      <main className="session-main-content">
        <Routes>
          <Route path=":id" element={<SessionDetail />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <SelectionProvider>
        <SessionActionsProvider>
          <div className="manager-app">
            <Navigation />
            <Routes>
              <Route path="/" element={<Navigate to="/session/current" replace />} />
              <Route path="/session/*" element={<SessionLayout />} />
              <Route path="/settings" element={
                <main className="manager-main">
                  <Settings />
                </main>
              } />
            </Routes>
          </div>
        </SessionActionsProvider>
      </SelectionProvider>
    </HashRouter>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

