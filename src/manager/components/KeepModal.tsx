import type { Tab } from '../../lib/types';

interface KeepModalProps {
  tab: Tab;
  onClose: () => void;
  onSaveToNotion: () => void;
  onBookmark: () => void;
}

export default function KeepModal({
  tab,
  onClose,
  onSaveToNotion,
  onBookmark,
}: KeepModalProps) {
  return (
    <div className="keep-modal-overlay" onClick={onClose}>
      <div className="keep-modal" onClick={(e) => e.stopPropagation()}>
        <div className="keep-modal-header">
          <h3>Keep Tab</h3>
          <button className="keep-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="keep-modal-content">
          <div className="keep-options">
            <button
              className="keep-option-button"
              onClick={() => {
                onSaveToNotion();
              }}
            >
              Save to Notion
            </button>
            <button
              className="keep-option-button"
              onClick={() => {
                onBookmark();
              }}
            >
              Bookmark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

