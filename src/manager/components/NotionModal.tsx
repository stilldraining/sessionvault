import { useState, useEffect } from 'react';
import type { Tab } from '../../lib/types';
import { getNotionConfig, fetchDatabases, createNotionPage } from '../../lib/notion';

interface NotionModalProps {
  tabs: Tab[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function NotionModal({ tabs, onClose, onSuccess }: NotionModalProps) {
  const [notionTags, setNotionTags] = useState('');
  const [notionDatabase, setNotionDatabase] = useState('');
  const [saving, setSaving] = useState(false);
  const [notionConnected, setNotionConnected] = useState(false);
  const [notionDatabases, setNotionDatabases] = useState<Array<{ id: string; title: string }>>([]);
  const [loadingDatabases, setLoadingDatabases] = useState(false);

  useEffect(() => {
    checkNotionConnection();
  }, []);

  useEffect(() => {
    if (notionConnected) {
      loadDatabases();
    }
  }, [notionConnected]);

  async function checkNotionConnection() {
    const config = await getNotionConfig();
    setNotionConnected(!!config.token);
  }

  async function loadDatabases() {
    setLoadingDatabases(true);
    try {
      const dbs = await fetchDatabases();
      setNotionDatabases(dbs);
    } catch (error) {
      console.error('Error loading databases:', error);
    } finally {
      setLoadingDatabases(false);
    }
  }

  async function handleSave() {
    if (!notionConnected || !notionDatabase) {
      alert('Please select a database');
      return;
    }

    if (tabs.length === 0) {
      alert('No tabs to save');
      return;
    }

    setSaving(true);
    try {
      const config = await getNotionConfig();
      const mapping = config.databases[notionDatabase];
      
      if (!mapping) {
        throw new Error('Database mapping not found');
      }

      const tags = notionTags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      // Save all tabs to the same database with the same tags
      for (const tab of tabs) {
        await createNotionPage(
          notionDatabase,
          tab.title,
          tab.url,
          tags,
          mapping
        );
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving to Notion:', error);
      alert(`Failed to save ${tabs.length > 1 ? 'some tabs' : 'tab'} to Notion. Please try again.`);
    } finally {
      setSaving(false);
    }
  }

  if (!notionConnected) {
    return (
      <div className="notion-modal-overlay" onClick={onClose}>
        <div className="notion-modal" onClick={(e) => e.stopPropagation()}>
          <div className="notion-modal-header">
            <h3>Save {tabs.length} {tabs.length === 1 ? 'tab' : 'tabs'} to Notion</h3>
            <button className="notion-modal-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="notion-modal-content">
            <p>Notion is not connected. Please configure Notion in Settings first.</p>
            <button className="notion-modal-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-modal-overlay" onClick={onClose}>
      <div className="notion-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notion-modal-header">
          <h3>Save to Notion</h3>
          <button className="notion-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="notion-modal-content">
          <div className="notion-form">
            <label className="form-label">Database</label>
            {loadingDatabases ? (
              <div>Loading databases...</div>
            ) : (
              <select
                className="form-select"
                value={notionDatabase}
                onChange={(e) => setNotionDatabase(e.target.value)}
              >
                <option value="">Select database...</option>
                {notionDatabases.map((db) => (
                  <option key={db.id} value={db.id}>
                    {db.title}
                  </option>
                ))}
              </select>
            )}
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              value={notionTags}
              onChange={(e) => setNotionTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
          </div>
          <div className="notion-modal-actions">
            <button
              className="notion-modal-button notion-modal-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="notion-modal-button notion-modal-confirm"
              onClick={handleSave}
              disabled={saving || !notionDatabase}
            >
              {saving ? `Saving ${tabs.length} ${tabs.length === 1 ? 'tab' : 'tabs'}...` : `Save ${tabs.length} ${tabs.length === 1 ? 'tab' : 'tabs'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

