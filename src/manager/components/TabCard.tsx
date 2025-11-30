import type { Tab } from '../../lib/types';

interface TabCardProps {
  tab: Tab;
  isCurrentSession?: boolean;
  onOpen: () => void;
  onCopyLink: () => void;
  onBookmark: () => void;
  onSaveToNotion: () => void;
  onClose?: () => void;
  onRestore?: () => void;
}

export default function TabCard({
  tab,
  isCurrentSession = false,
  onOpen,
  onCopyLink,
  onBookmark,
  onSaveToNotion,
  onClose,
  onRestore,
}: TabCardProps) {
  const faviconUrl = tab.favIconUrl || `chrome://favicon/${tab.url}`;
  const isDismissed = tab.status === 'dismissed';

  return (
    <div className={`tab-card ${tab.status === 'done' ? 'tab-card-done' : ''} ${isDismissed ? 'tab-card-dismissed' : ''}`}>
      <div className="tab-card-content">
        <img src={faviconUrl} alt="" className="tab-favicon" />
        <div className="tab-info">
          <div className="tab-title">{tab.title}</div>
          <div className="tab-url">{tab.url}</div>
        </div>
        {tab.status === 'done' && !isDismissed && (
          <div className="tab-status-badge">Done</div>
        )}
        {isDismissed && (
          <div className="tab-status-badge tab-status-dismissed">Dismissed</div>
        )}
      </div>
      {isDismissed ? (
        <div className="tab-actions">
          <button className="tab-action-icon-button" onClick={onRestore} title="Restore">
            ↻
          </button>
        </div>
      ) : (
        <div className="tab-actions">
          <button className="tab-action-icon-button" onClick={onOpen} title="Open">
            ↗
          </button>
          <button className="tab-action-icon-button" onClick={onCopyLink} title="Copy Link">
            📋
          </button>
          <button className="tab-action-icon-button" onClick={onBookmark} title="Bookmark">
            🔖
          </button>
          <button className="tab-action-text-button" onClick={onSaveToNotion} title="Save to Notion">
            Save to Notion
          </button>
          {!isCurrentSession && onClose && (
            <button className="tab-action-icon-button tab-action-close" onClick={onClose} title="Close">
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}

