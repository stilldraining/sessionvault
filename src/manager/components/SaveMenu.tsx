import { useState, useEffect } from 'react';
import type { Tab } from '../../lib/types';
import { getNotionConfig, fetchDatabases, createNotionPage } from '../../lib/notion';
import { saveNote } from '../../lib/storage';

interface SaveMenuProps {
  tab: Tab;
  sessionId: string;
  onClose: () => void;
  onSaveComplete: () => void;
}

type SaveDestination = 'notion' | 'bookmark' | 'copy' | 'note' | null;

export default function SaveMenu({
  tab,
  sessionId,
  onClose,
  onSaveComplete,
}: SaveMenuProps) {
  const [destination, setDestination] = useState<SaveDestination>(null);
  const [notionTags, setNotionTags] = useState('');
  const [notionDatabase, setNotionDatabase] = useState('');
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const [notionConnected, setNotionConnected] = useState(false);
  const [notionDatabases, setNotionDatabases] = useState<Array<{ id: string; title: string }>>([]);
  const [loadingDatabases, setLoadingDatabases] = useState(false);

  useEffect(() => {
    checkNotionConnection();
  }, []);

  useEffect(() => {
    if (destination === 'notion' && notionConnected) {
      loadDatabases();
    }
  }, [destination, notionConnected]);

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
    if (!destination) return;

    setSaving(true);
    try {
      switch (destination) {
        case 'notion':
          await saveToNotion();
          break;
        case 'bookmark':
          await saveToBookmark();
          break;
        case 'copy':
          await copyLink();
          break;
        case 'note':
          await saveAsNote();
          break;
      }
      onSaveComplete();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function saveToNotion() {
    if (!notionConnected || !notionDatabase) {
      throw new Error('Notion not configured');
    }

    const config = await getNotionConfig();
    const mapping = config.databases[notionDatabase];
    
    if (!mapping) {
      throw new Error('Database mapping not found');
    }

    const tags = notionTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    await createNotionPage(
      notionDatabase,
      tab.title,
      tab.url,
      tags,
      mapping
    );
  }

  async function saveToBookmark() {
    await chrome.bookmarks.create({
      title: tab.title,
      url: tab.url,
    });
  }

  async function copyLink() {
    await navigator.clipboard.writeText(tab.url);
  }

  async function saveAsNote() {
    await saveNote({
      sessionId,
      tabId: tab.id,
      text: noteText,
    });
  }

  return (
    <div className="save-menu-overlay" onClick={onClose}>
      <div className="save-menu" onClick={(e) => e.stopPropagation()}>
        <div className="save-menu-header">
          <h3>Save Tab</h3>
          <button className="save-menu-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="save-menu-content">
          {!destination ? (
            <div className="save-options">
              <button
                className="save-option-button"
                onClick={() => setDestination('notion')}
                disabled={!notionConnected}
              >
                Save to Notion
                {!notionConnected && <span className="option-hint">(Not connected)</span>}
              </button>
              <button
                className="save-option-button"
                onClick={() => setDestination('bookmark')}
              >
                Bookmark
              </button>
              <button
                className="save-option-button"
                onClick={() => setDestination('copy')}
              >
                Copy Link
              </button>
              <button
                className="save-option-button"
                onClick={() => setDestination('note')}
              >
                Save as Note
              </button>
            </div>
          ) : (
            <div className="save-destination-form">
              {destination === 'notion' && (
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
              )}

              {destination === 'note' && (
                <div className="note-form">
                  <label className="form-label">Note</label>
                  <textarea
                    className="form-textarea"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add your note here..."
                    rows={6}
                  />
                </div>
              )}

              {(destination === 'bookmark' || destination === 'copy') && (
                <div className="save-confirm">
                  <p>Ready to {destination === 'bookmark' ? 'bookmark' : 'copy'} this tab?</p>
                </div>
              )}

              <div className="save-menu-actions">
                <button
                  className="save-action-button save-action-cancel"
                  onClick={() => setDestination(null)}
                  disabled={saving}
                >
                  Back
                </button>
                <button
                  className="save-action-button save-action-confirm"
                  onClick={handleSave}
                  disabled={saving || (destination === 'notion' && !notionDatabase)}
                >
                  {saving ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

