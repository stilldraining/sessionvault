import type { Tab } from '../../lib/types';

interface TabCardProps {
  tab: Tab;
  onOpen: () => void;
  onDismiss: () => void;
  onSave: () => void;
}

export default function TabCard({ tab, onOpen, onDismiss, onSave }: TabCardProps) {
  const faviconUrl = tab.favIconUrl || `chrome://favicon/${tab.url}`;

  return (
    <div className={`tab-card ${tab.status === 'done' ? 'tab-card-done' : ''}`}>
      <div className="tab-card-content">
        <img src={faviconUrl} alt="" className="tab-favicon" />
        <div className="tab-info">
          <div className="tab-title">{tab.title}</div>
          <div className="tab-url">{tab.url}</div>
        </div>
        {tab.status === 'done' && (
          <div className="tab-status-badge">Done</div>
        )}
      </div>
      {tab.status === 'pending' && (
        <div className="tab-actions">
          <button className="tab-action-button" onClick={onOpen}>
            Open
          </button>
          <button className="tab-action-button" onClick={onDismiss}>
            Dismiss
          </button>
          <button className="tab-action-button tab-action-primary" onClick={onSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

