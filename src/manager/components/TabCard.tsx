import { useState, useEffect } from 'react';
import type { Tab } from '../../lib/types';

interface TabCardProps {
  tab: Tab;
  isCurrentSession?: boolean;
  isArchived?: boolean;
  isSelected?: boolean;
  isSelectable?: boolean;
  onOpen: () => void;
  onCopyLink: () => void;
  onToggleSelection?: () => void;
  onRestore?: () => void;
}

// Helper function to get reliable favicon URL
function getFaviconUrl(tab: Tab): string {
  // Default fallback icon (dark mode friendly)
  const defaultIcon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23475569" rx="2"/><text x="50%" y="50%" font-size="9" fill="%23cbd5e1" text-anchor="middle" dominant-baseline="middle" font-family="system-ui">?</text></svg>';
  
  if (!tab.url) {
    return defaultIcon;
  }
  
  try {
    const url = tab.url.trim();
    
    // For special URL schemes, use default icon
    if (url.startsWith('chrome://') || 
        url.startsWith('chrome-extension://') || 
        url.startsWith('file://') || 
        url.startsWith('data:') ||
        url.startsWith('about:')) {
      return defaultIcon;
    }
    
    // First, try to use stored favIconUrl if it exists and looks valid
    // Accept any URL format that looks valid (http, https, data, or chrome://favicon)
    if (tab.favIconUrl && tab.favIconUrl.trim()) {
      const trimmed = tab.favIconUrl.trim();
      // Accept any URL that looks valid (not empty, not just whitespace)
      // This includes http://, https://, data:, and chrome://favicon/ URLs
      if (trimmed.length > 0 && 
          (trimmed.startsWith('http://') || 
           trimmed.startsWith('https://') || 
           trimmed.startsWith('data:') ||
           trimmed.startsWith('chrome://favicon/'))) {
        return trimmed;
      }
    }
    
    // If no stored favicon or it's invalid, use chrome://favicon/ API
    // This should work for most regular URLs
    return `chrome://favicon/${url}`;
  } catch (error) {
    // Fallback if URL parsing fails
    return defaultIcon;
  }
}

export default function TabCard({
  tab,
  isCurrentSession = false,
  isArchived = false,
  isSelected = false,
  isSelectable = false,
  onOpen,
  onCopyLink,
  onToggleSelection,
  onRestore,
}: TabCardProps) {
  // Default fallback icon (dark mode friendly)
  const defaultFavicon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23475569" rx="2"/><text x="50%" y="50%" font-size="9" fill="%23cbd5e1" text-anchor="middle" dominant-baseline="middle" font-family="system-ui">?</text></svg>';
  
  const [faviconUrl, setFaviconUrl] = useState(getFaviconUrl(tab));
  const [hasTriedStored, setHasTriedStored] = useState(false);
  const [hasTriedChromeFavicon, setHasTriedChromeFavicon] = useState(false);
  
  // Update favicon URL when tab changes
  useEffect(() => {
    const newFaviconUrl = getFaviconUrl(tab);
    setFaviconUrl(newFaviconUrl);
    // Reset error tracking when tab changes
    setHasTriedStored(tab.favIconUrl ? newFaviconUrl === tab.favIconUrl : false);
    setHasTriedChromeFavicon(newFaviconUrl.startsWith('chrome://favicon/'));
  }, [tab.url, tab.id, tab.favIconUrl]);
  
  // Handle favicon load errors - try alternatives before falling back to default
  function handleFaviconError() {
    // If we tried stored favIconUrl and it failed, try chrome://favicon/
    if (hasTriedStored && !hasTriedChromeFavicon && tab.url) {
      const url = tab.url.trim();
      if (!url.startsWith('chrome://') && 
          !url.startsWith('chrome-extension://') && 
          !url.startsWith('file://') && 
          !url.startsWith('data:') &&
          !url.startsWith('about:')) {
        setFaviconUrl(`chrome://favicon/${url}`);
        setHasTriedChromeFavicon(true);
        return;
      }
    }
    
    // If we tried chrome://favicon/ and it failed, or we started with it and it failed,
    // try stored favicon if we haven't already
    if (hasTriedChromeFavicon && !hasTriedStored && tab.favIconUrl && tab.favIconUrl.trim()) {
      const trimmed = tab.favIconUrl.trim();
      if (trimmed.length > 0 && 
          (trimmed.startsWith('http://') || 
           trimmed.startsWith('https://') || 
           trimmed.startsWith('data:') ||
           trimmed.startsWith('chrome://favicon/'))) {
        setFaviconUrl(trimmed);
        setHasTriedStored(true);
        return;
      }
    }
    
    // Only use default icon as absolute last resort
    if (faviconUrl !== defaultFavicon) {
      setFaviconUrl(defaultFavicon);
    }
  }
  const hasStatus = tab.status === 'dismissed' || tab.status === 'bookmarked' || tab.status === 'saved-to-notion';
  
  const getStatusLabel = () => {
    switch (tab.status) {
      case 'dismissed':
        return 'Killed';
      case 'bookmarked':
        return 'Bookmarked';
      case 'saved-to-notion':
        return 'Saved to Notion';
      case 'done':
        return 'Done';
      default:
        return null;
    }
  };

  const statusLabel = getStatusLabel();
  
  // In archived sessions, all tabs should show their status
  // For non-archived tabs in actioned/dismissed sections, don't show status badge in content area
  // since the section header already indicates the status and the actions area shows the label
  // For 'done' status, always show the badge
  const showStatus = isArchived || tab.status === 'done';

  function handleCardClick(e: React.MouseEvent) {
    // Don't toggle selection if clicking on action buttons
    if ((e.target as HTMLElement).closest('.tab-actions')) {
      return;
    }
    // Only toggle if selectable and handler exists
    if (isSelectable && onToggleSelection) {
      onToggleSelection();
    }
  }

  return (
    <div 
      className={`tab-card ${tab.status === 'done' ? 'tab-card-done' : ''} ${tab.status === 'dismissed' ? 'tab-card-dismissed' : ''} ${isArchived ? 'tab-card-archived' : ''} ${isSelected ? 'tab-card-selected' : ''} ${isSelectable ? 'tab-card-selectable' : ''}`}
      onClick={handleCardClick}
    >
      <div className="tab-card-content">
        <img 
          src={faviconUrl} 
          alt="" 
          className="tab-favicon" 
          onError={handleFaviconError}
        />
        <div className="tab-info">
          <div className="tab-title">{tab.title}</div>
          <div className="tab-url">{tab.url}</div>
        </div>
        {showStatus && statusLabel && (
          <div className={`tab-status-badge tab-status-${tab.status}`}>{statusLabel}</div>
        )}
      </div>
      {isArchived ? (
        // Archived sessions: read-only, only show Open and Copy Link
        <div className="tab-actions" onClick={(e) => e.stopPropagation()}>
          {statusLabel && <div className="tab-status-label">{statusLabel}</div>}
          <div className="tab-actions-utility">
            <button className="tab-action-icon-button" onClick={onOpen} title="Open">
              ↗
            </button>
            <button className="tab-action-icon-button" onClick={onCopyLink} title="Copy Link">
              📋
            </button>
          </div>
        </div>
      ) : hasStatus ? (
        // Non-archived with status: show status, open/copy icons, and restore button
        <div className="tab-actions" onClick={(e) => e.stopPropagation()}>
          <div className="tab-status-label">{statusLabel}</div>
          <div className="tab-actions-utility">
            <button className="tab-action-icon-button" onClick={onOpen} title="Open">
              ↗
            </button>
            <button className="tab-action-icon-button" onClick={onCopyLink} title="Copy Link">
              📋
            </button>
            {onRestore && (
              <button className="tab-action-icon-button" onClick={onRestore} title="Restore">
                ↻
              </button>
            )}
          </div>
        </div>
      ) : (
        // Pending tabs: only show Open and Copy Link (selection for bulk actions)
        <div className="tab-actions" onClick={(e) => e.stopPropagation()}>
          <div className="tab-actions-utility">
            <button className="tab-action-icon-button" onClick={onOpen} title="Open">
              ↗
            </button>
            <button className="tab-action-icon-button" onClick={onCopyLink} title="Copy Link">
              📋
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

