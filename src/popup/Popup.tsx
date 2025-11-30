import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getSessions } from '../lib/storage';
import '../index.css';
import './popup.css';

function Popup() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Get session counts
      const sessions = await getSessions();
      // Count sessions with 'to-do' status (sessions that need to be organised)
      const toDoSessions = sessions.filter((s) => s.status === 'to-do').length;
      
      setPendingCount(toDoSessions);
    } catch (error) {
      console.error('Error loading popup data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function openManager() {
    const managerUrl = chrome.runtime.getURL('src/manager/manager.html');
    
    try {
      // Check if a tab with the manager URL already exists
      const existingTabs = await chrome.tabs.query({
        url: managerUrl,
      });
      
      if (existingTabs.length > 0) {
        // Tab already exists - navigate to it
        const existingTab = existingTabs[0];
        await chrome.tabs.update(existingTab.id!, { active: true });
        
        // Focus the window containing the tab
        if (existingTab.windowId) {
          await chrome.windows.update(existingTab.windowId, { focused: true });
        }
      } else {
        // No existing tab - create a new one
        await chrome.tabs.create({
          url: managerUrl,
        });
      }
    } catch (error) {
      console.error('Error opening session manager:', error);
      // Fallback: try to create a new tab
      try {
        await chrome.tabs.create({
          url: managerUrl,
        });
      } catch (fallbackError) {
        console.error('Error creating fallback tab:', fallbackError);
      }
    }
    
    window.close();
  }

  if (loading) {
    return (
      <div className="popup-container">
        <div className="popup-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <div className="popup-stats">
        <div className="stat-item">
          <div className="stat-label">Sessions to organise</div>
          <div className="stat-value">{pendingCount}</div>
        </div>
      </div>
      <button className="popup-button" onClick={openManager}>
        Browse Sessions
      </button>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}

