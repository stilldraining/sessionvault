import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { TabList } from "./components/TabList";
import { Toast } from "./components/Toast";
import { SaveSheet } from "./components/SaveSheet";

export type TabItem = {
  id: string;
  title: string;
  url: string;
  savedToNotion?: boolean;
};

export type SessionItem = {
  id: string;
  tabCount: number;
  timestamp?: string;
  label?: string;
  isActive?: boolean;
  isGraveyard?: boolean;
  tabs: TabItem[];
};

export default function App() {
  const [selectedTabIds, setSelectedTabIds] = useState<Set<string>>(new Set());
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSaveSheetOpen, setIsSaveSheetOpen] = useState(false);

  // Mock data for sessions - now as state
  const [sessions, setSessions] = useState<SessionItem[]>([
    {
      id: "active",
      tabCount: 8,
      label: "ACTIVE WINDOW",
      isActive: true,
      tabs: [
        { id: "tab1", title: "Loaded (formerly CDKeys) / Your #1 Digital Game Store", url: "https://loaded.com" },
        { id: "tab2", title: "Iconly Pro", url: "https://web.iconly.pro/?keyword=folder" },
        { id: "tab3", title: "Traf", url: "https://tr.af/" },
        { id: "tab4", title: "Iconly Pro Lifetime Access 40,000+ icons. Flat, 3D, Animated.", url: "https://iconly.gumroad.com/l/iconlyprolifetime" },
      ],
    },
    {
      id: "history1",
      tabCount: 3,
      timestamp: "01 DEC / 11:12",
      tabs: [
        { id: "h1-tab1", title: "Example Tab 1", url: "https://example1.com" },
        { id: "h1-tab2", title: "Example Tab 2", url: "https://example2.com" },
        { id: "h1-tab3", title: "Example Tab 3", url: "https://example3.com" },
      ],
    },
    {
      id: "history2",
      tabCount: 4,
      timestamp: "01 DEC / 09:32",
      tabs: [
        { id: "h2-tab1", title: "Sample Tab 1", url: "https://sample1.com" },
        { id: "h2-tab2", title: "Sample Tab 2", url: "https://sample2.com" },
        { id: "h2-tab3", title: "Sample Tab 3", url: "https://sample3.com" },
        { id: "h2-tab4", title: "Sample Tab 4", url: "https://sample4.com" },
      ],
    },
    {
      id: "history3",
      tabCount: 8,
      timestamp: "29 NOV / 14:43",
      tabs: [],
    },
    {
      id: "graveyard1",
      tabCount: 12,
      timestamp: "01 DEC / 12:67",
      isGraveyard: true,
      tabs: [],
    },
    {
      id: "graveyard2",
      tabCount: 8,
      timestamp: "29 NOV / 14:43",
      isGraveyard: true,
      tabs: [],
    },
  ]);

  const activeSession = sessions.find((s) => s.id === (selectedSessionId || "active"));
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
    if (!activeSession) return;
    const allTabIds = new Set(activeSession.tabs.map((tab) => tab.id));
    setSelectedTabIds(allTabIds);
  };

  const handleClearSelection = () => {
    setSelectedTabIds(new Set());
  };

  const handleTabClick = (tab: TabItem) => {
    // Copy URL to clipboard - Chrome extension compatible method
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
  };

  const handleOpenLinks = () => {
    // If tabs are selected, open only selected tabs
    if (selectedTabIds.size > 0) {
      const selectedTabs = activeSession?.tabs.filter((tab) => selectedTabIds.has(tab.id));
      if (selectedTabs && selectedTabs.length > 0) {
        selectedTabs.forEach((tab) => {
          window.open(tab.url, "_blank");
        });
      }
    } else if (isHistorySession && activeSession) {
      // If history session is selected but no tabs selected, open all tabs in that session
      activeSession.tabs.forEach((tab) => {
        window.open(tab.url, "_blank");
      });
    }
  };

  const handleSaveSession = () => {
    setIsSaveSheetOpen(true);
  };

  const handleCloseSaveSheet = () => {
    setIsSaveSheetOpen(false);
  };

  const handleSaveToNotion = () => {
    // Mark selected tabs as saved to Notion
    if (selectedTabIds.size > 0 && activeSession) {
      setSessions((prevSessions) =>
        prevSessions.map((session) => {
          if (session.id === activeSession.id) {
            return {
              ...session,
              tabs: session.tabs.map((tab) =>
                selectedTabIds.has(tab.id)
                  ? { ...tab, savedToNotion: true }
                  : tab
              ),
            };
          }
          return session;
        })
      );
      
      // Clear selection
      setSelectedTabIds(new Set());
    }
    
    setIsSaveSheetOpen(false);
    setToastMessage("TABS SAVED TO NOTION");
    setShowToast(true);
  };

  const handleDeleteSession = () => {
    if (!activeSession || !isHistorySession) return;

    // Move the session to graveyard
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === activeSession.id) {
          return {
            ...session,
            isGraveyard: true,
          };
        }
        return session;
      })
    );

    setToastMessage("SESSION MOVED TO GRAVEYARD");
    setShowToast(true);
  };

  const handleReviveSession = () => {
    if (!activeSession || !isGraveyardSession) return;

    // Move the session back to history
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === activeSession.id) {
          return {
            ...session,
            isGraveyard: false,
          };
        }
        return session;
      })
    );

    setToastMessage("SESSION REVIVED");
    setShowToast(true);
  };

  const handleMoveToActive = () => {
    if (!activeSession || !isHistorySession || selectedTabIds.size === 0) return;

    // Get the tabs to move
    const tabsToMove = activeSession.tabs.filter((tab) => selectedTabIds.has(tab.id));
    
    // Check if all tabs are being moved
    const isMovingAllTabs = selectedTabIds.size === activeSession.tabs.length;

    // Update sessions
    setSessions((prevSessions) => {
      return prevSessions
        .map((session) => {
          // Update the active window session - add tabs and increase count
          if (session.isActive) {
            return {
              ...session,
              tabs: [...session.tabs, ...tabsToMove],
              tabCount: session.tabCount + tabsToMove.length,
            };
          }
          // Update the current history session - remove tabs and decrease count
          if (session.id === activeSession.id) {
            const remainingTabs = session.tabs.filter((tab) => !selectedTabIds.has(tab.id));
            return {
              ...session,
              tabs: remainingTabs,
              tabCount: remainingTabs.length,
            };
          }
          return session;
        })
        .filter((session) => {
          // Remove the history session if all tabs were moved
          if (isMovingAllTabs && session.id === activeSession.id) {
            return false;
          }
          return true;
        });
    });

    // If all tabs were moved, navigate to active window
    if (isMovingAllTabs) {
      setSelectedSessionId(null);
    }

    // Clear selection
    setSelectedTabIds(new Set());

    // Show toast
    setToastMessage("MOVED TO ACTIVE WINDOW");
    setShowToast(true);
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
  }, [selectedTabIds.size, activeSession]);

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
          selectedSessionId={selectedSessionId || "active"}
          onSessionSelect={handleSessionSelect}
        />
        <TabList
          tabs={activeSession?.tabs || []}
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