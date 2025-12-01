import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Header } from "./components/Header";
import { Sidebar, SessionItem } from "./components/Sidebar";
import { TabList, TabItem } from "./components/TabList";
import { Toast } from "./components/Toast";
import { SaveSheet } from "./components/SaveSheet";
import { 
  getSessions, 
  getCurrentSession, 
  archiveSession, 
  restoreSession,
  deleteSession,
  updateSession,
  getSessionFull
} from "../lib/storage";
import type { Session, Tab } from "../lib/types";
import "../index.css";
import "./popup.css";

// Convert storage Session to UI SessionItem
function sessionToSessionItem(session: Session, isActive: boolean = false): SessionItem {
  const date = new Date(session.timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return {
    id: session.id,
    tabCount: session.tabs.length,
    timestamp: `${day} ${month} / ${hours}:${minutes}`,
    label: isActive ? "ACTIVE WINDOW" : undefined,
    isActive,
    isGraveyard: session.status === 'archived',
  };
}

// Convert storage Tab to UI TabItem
function tabToTabItem(tab: Tab): TabItem {
  return {
    id: tab.id,
    title: tab.title,
    url: tab.url,
    savedToNotion: tab.status === 'saved-to-notion',
  };
}

function Popup() {
  const [selectedTabIds, setSelectedTabIds] = useState<Set<string>>(new Set());
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>("current");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSaveSheetOpen, setIsSaveSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Sessions state
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeSessionTabs, setActiveSessionTabs] = useState<TabItem[]>([]);

  // Load sessions from storage
  useEffect(() => {
    loadSessions();
  }, []);

  // Load tabs when selected session changes
  useEffect(() => {
    if (selectedSessionId) {
      loadSessionTabs(selectedSessionId);
    }
  }, [selectedSessionId]);

  async function loadSessions() {
    try {
      setLoading(true);
      
      // Get current browser session (active tabs)
      const currentSession = await getCurrentSession();
      
      // Get stored sessions
      const storedSessions = await getSessions();
      
      const sessionItems: SessionItem[] = [];
      
      // Add current session first
      if (currentSession) {
        sessionItems.push(sessionToSessionItem(currentSession, true));
      }
      
      // Add stored sessions (non-archived as history, archived as graveyard)
      storedSessions.forEach(session => {
        sessionItems.push(sessionToSessionItem(session, false));
      });
      
      setSessions(sessionItems);
      
      // Load tabs for initially selected session
      if (selectedSessionId) {
        await loadSessionTabs(selectedSessionId);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSessionTabs(sessionId: string) {
    try {
      if (sessionId === 'current') {
        // Load current browser tabs
        const currentSession = await getCurrentSession();
        if (currentSession) {
          setActiveSessionTabs(currentSession.tabs.map(tabToTabItem));
        } else {
          setActiveSessionTabs([]);
        }
      } else {
        // Load stored session tabs
        const session = await getSessionFull(sessionId);
        if (session) {
          setActiveSessionTabs(session.tabs.map(tabToTabItem));
        } else {
          setActiveSessionTabs([]);
        }
      }
    } catch (error) {
      console.error('Error loading session tabs:', error);
      setActiveSessionTabs([]);
    }
  }

  const activeSession = sessions.find((s) => s.id === selectedSessionId);
  const isHistorySession = activeSession && !activeSession.isActive && !activeSession.isGraveyard;
  const isGraveyardSession = activeSession && activeSession.isGraveyard;

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setSelectedTabIds(new Set());
  };

  const handleTabSelect = (tabId: string) => {
    setSelectedTabIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tabId)) {
        newSet.delete(tabId);
      } else {
        newSet.add(tabId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allTabIds = new Set(activeSessionTabs.map((tab) => tab.id));
    setSelectedTabIds(allTabIds);
  };

  const handleClearSelection = () => {
    setSelectedTabIds(new Set());
  };

  const handleTabClick = (tab: TabItem) => {
    // Copy URL to clipboard
    navigator.clipboard.writeText(tab.url).then(() => {
      setToastMessage("LINK COPIED TO CLIPBOARD");
      setShowToast(true);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = tab.url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setToastMessage("LINK COPIED TO CLIPBOARD");
        setShowToast(true);
      } catch (err) {
        console.error('Failed to copy:', err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  };

  const handleOpenLinks = async () => {
    // Get tabs to open
    const tabsToOpen = selectedTabIds.size > 0
      ? activeSessionTabs.filter((tab) => selectedTabIds.has(tab.id))
      : activeSessionTabs;
    
    if (tabsToOpen.length > 0) {
      // Open each URL in a new tab
      for (const tab of tabsToOpen) {
        await chrome.tabs.create({ url: tab.url, active: false });
      }
      setToastMessage(`OPENED ${tabsToOpen.length} TAB${tabsToOpen.length > 1 ? 'S' : ''}`);
      setShowToast(true);
    }
  };

  const handleSaveSession = () => {
    setIsSaveSheetOpen(true);
  };

  const handleCloseSaveSheet = () => {
    setIsSaveSheetOpen(false);
  };

  const handleSaveToNotion = () => {
    // TODO: Implement actual Notion save
    // For now just show feedback
    setIsSaveSheetOpen(false);
    setToastMessage("TABS SAVED TO NOTION");
    setShowToast(true);
    setSelectedTabIds(new Set());
  };

  const handleDeleteSession = async () => {
    if (!selectedSessionId || selectedSessionId === 'current') return;

    try {
      // Archive the session (move to graveyard)
      await archiveSession(selectedSessionId);
      
      // Reload sessions
      await loadSessions();
      
      setToastMessage("SESSION MOVED TO GRAVEYARD");
      setShowToast(true);
    } catch (error) {
      console.error('Error archiving session:', error);
    }
  };

  const handleReviveSession = async () => {
    if (!selectedSessionId || selectedSessionId === 'current') return;

    try {
      // Restore the session from archive
      await restoreSession(selectedSessionId);
      
      // Reload sessions
      await loadSessions();
      
      setToastMessage("SESSION REVIVED");
      setShowToast(true);
    } catch (error) {
      console.error('Error restoring session:', error);
    }
  };

  const handleMoveToActive = async () => {
    if (!selectedSessionId || selectedSessionId === 'current' || selectedTabIds.size === 0) return;

    try {
      // Get selected tabs
      const selectedTabs = activeSessionTabs.filter((tab) => selectedTabIds.has(tab.id));
      
      // Open each tab in the browser
      for (const tab of selectedTabs) {
        await chrome.tabs.create({ url: tab.url, active: false });
      }
      
      // Clear selection
      setSelectedTabIds(new Set());
      
      setToastMessage("MOVED TO ACTIVE WINDOW");
      setShowToast(true);
    } catch (error) {
      console.error('Error moving tabs to active window:', error);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + A: Select all tabs
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        handleSelectAll();
      }
      // Escape: Clear selection
      if (e.key === "Escape" && selectedTabIds.size > 0) {
        e.preventDefault();
        handleClearSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTabIds.size, activeSessionTabs]);

  if (loading) {
    return <div className="popup-loading">Loading...</div>;
  }

  return (
    <div className="bg-black flex flex-col h-[457px] w-[600px] relative overflow-hidden">
      <Header
        selectedCount={selectedTabIds.size}
        onSelectAll={handleSelectAll}
        onOpenLinks={handleOpenLinks}
        onSaveSession={handleSaveSession}
        onDeleteSession={handleDeleteSession}
        onReviveSession={handleReviveSession}
        onMoveToActive={handleMoveToActive}
        isHistorySession={isHistorySession}
        isGraveyardSession={isGraveyardSession}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sessions={sessions}
          selectedSessionId={selectedSessionId || "current"}
          onSessionSelect={handleSessionSelect}
        />
        <TabList
          tabs={activeSessionTabs}
          selectedTabIds={selectedTabIds}
          onTabSelect={handleTabSelect}
          onTabClick={handleTabClick}
          onClearSelection={handleClearSelection}
          isGraveyardSession={isGraveyardSession}
        />
      </div>
      {showToast && <Toast message={toastMessage} />}
      <SaveSheet isOpen={isSaveSheetOpen} onClose={handleCloseSaveSheet} onSave={handleSaveToNotion} />
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
