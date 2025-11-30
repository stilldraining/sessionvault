import { useEffect, useState } from 'react';
import {
  getNotionConfig,
  connectNotion,
  setNotionToken,
  fetchDatabases,
  getDatabaseProperties,
  addDatabaseMapping,
} from '../../lib/notion';
import { clearAllSessions } from '../../lib/storage';
import type { NotionConfig } from '../../lib/types';

export default function Settings() {
  const [config, setConfig] = useState<NotionConfig>({ databases: {} });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [showAddMapping, setShowAddMapping] = useState(false);
  const [availableDatabases, setAvailableDatabases] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedDbForMapping, setSelectedDbForMapping] = useState('');
  const [mappingFields, setMappingFields] = useState({
    titleField: '',
    urlField: '',
    tagField: '',
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [savingToken, setSavingToken] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const currentConfig = await getNotionConfig();
      setConfig(currentConfig);
      
      if (currentConfig.token) {
        await loadDatabases();
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadDatabases() {
    try {
      const dbs = await fetchDatabases();
      setAvailableDatabases(dbs);
    } catch (error) {
      console.error('Error loading databases:', error);
    }
  }

  async function handleConnectNotion() {
    setConnecting(true);
    try {
      await connectNotion();
      await loadConfig();
      await loadDatabases();
    } catch (error) {
      console.error('Error connecting to Notion:', error);
      alert('Failed to connect to Notion. Please check the setup instructions.');
    } finally {
      setConnecting(false);
    }
  }

  async function handleSaveToken() {
    if (!tokenInput.trim()) {
      alert('Please enter a token');
      return;
    }

    setSavingToken(true);
    try {
      await setNotionToken(tokenInput.trim());
      setTokenInput('');
      await loadConfig();
      await loadDatabases();
      alert('Token saved successfully!');
    } catch (error) {
      console.error('Error saving token:', error);
      alert('Failed to save token. Please try again.');
    } finally {
      setSavingToken(false);
    }
  }

  async function handleUpdateToken() {
    if (!tokenInput.trim()) {
      alert('Please enter a token');
      return;
    }

    setSavingToken(true);
    try {
      await setNotionToken(tokenInput.trim());
      setTokenInput('');
      await loadConfig();
      await loadDatabases();
      alert('Token updated successfully!');
    } catch (error) {
      console.error('Error updating token:', error);
      alert('Failed to update token. Please try again.');
    } finally {
      setSavingToken(false);
    }
  }

  async function handleDatabaseSelect(dbId: string) {
    setSelectedDbForMapping(dbId);
    try {
      const properties = await getDatabaseProperties(dbId);
      const propertyNames = Object.keys(properties);
      
      // Try to auto-detect fields
      const titleField = propertyNames.find(
        (name) => properties[name].type === 'title'
      ) || propertyNames[0];
      
      const urlField = propertyNames.find(
        (name) => properties[name].type === 'url'
      ) || propertyNames.find((name) => name.toLowerCase().includes('url')) || '';
      
      const tagField = propertyNames.find(
        (name) => properties[name].type === 'multi_select'
      ) || propertyNames.find((name) => name.toLowerCase().includes('tag')) || '';

      setMappingFields({
        titleField: titleField || '',
        urlField: urlField || '',
        tagField: tagField || '',
      });
    } catch (error) {
      console.error('Error loading database properties:', error);
    }
  }

  async function handleSaveMapping() {
    if (!selectedDbForMapping) return;

    const selectedDb = availableDatabases.find((db) => db.id === selectedDbForMapping);
    if (!selectedDb) return;

    try {
      await addDatabaseMapping(
        selectedDbForMapping,
        selectedDb.title,
        mappingFields.titleField,
        mappingFields.urlField,
        mappingFields.tagField || undefined
      );
      
      await loadConfig();
      setShowAddMapping(false);
      setSelectedDbForMapping('');
      setMappingFields({ titleField: '', urlField: '', tagField: '' });
    } catch (error) {
      console.error('Error saving mapping:', error);
      alert('Failed to save database mapping');
    }
  }

  async function handleClearSessions() {
    try {
      await clearAllSessions();
      setShowClearConfirm(false);
      alert('All sessions cleared');
    } catch (error) {
      console.error('Error clearing sessions:', error);
      alert('Failed to clear sessions');
    }
  }

  if (loading) {
    return (
      <div className="settings-container">
        <div className="loading-state">Loading settings...</div>
      </div>
    );
  }

  const databases = Object.values(config.databases);

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-section">
        <h3 className="settings-section-title">Notion Integration</h3>
        
        {!config.token ? (
          <div className="settings-notion-setup">
            <p>Connect your Notion account to save tabs directly to Notion databases.</p>
            
            <div className="settings-token-input">
              <label className="form-label">Internal Integration Token</label>
              <input
                type="text"
                className="form-input"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter your Notion internal integration token"
              />
              <button
                className="settings-button settings-button-primary"
                onClick={handleSaveToken}
                disabled={savingToken || !tokenInput.trim()}
              >
                {savingToken ? 'Saving...' : 'Save Token'}
              </button>
            </div>

            <div className="settings-oauth-option">
              <p className="settings-divider">or</p>
              <button
                className="settings-button"
                onClick={handleConnectNotion}
                disabled={connecting}
              >
                {connecting ? 'Connecting...' : 'Connect via OAuth (Future)'}
              </button>
            </div>

            <div className="settings-hint">
              <p><strong>Setup Instructions:</strong></p>
              <ol>
                <li>Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer">notion.so/my-integrations</a></li>
                <li>Create a new integration</li>
                <li>Copy the Internal Integration Token</li>
                <li>Paste it above and click "Save Token"</li>
                <li>For OAuth (future), you'll need to set up OAuth credentials</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="settings-notion-connected">
            <div className="settings-status">
              <span className="status-indicator status-connected">●</span>
              <span>Connected to Notion</span>
            </div>
            
            <div className="settings-token-update">
              <label className="form-label">Update Token</label>
              <input
                type="text"
                className="form-input"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter new token to replace current one"
              />
              <button
                className="settings-button"
                onClick={handleUpdateToken}
                disabled={savingToken || !tokenInput.trim()}
              >
                {savingToken ? 'Updating...' : 'Update Token'}
              </button>
            </div>

            <button
              className="settings-button"
              onClick={handleConnectNotion}
              disabled={connecting}
            >
              {connecting ? 'Reconnecting...' : 'Reconnect via OAuth (Future)'}
            </button>
          </div>
        )}

        {config.token && (
          <div className="settings-databases">
            <div className="settings-databases-header">
              <h4>Database Mappings</h4>
              <button
                className="settings-button settings-button-small"
                onClick={() => setShowAddMapping(true)}
              >
                Add Mapping
              </button>
            </div>

            {showAddMapping && (
              <div className="settings-mapping-form">
                <label className="form-label">Select Database</label>
                <select
                  className="form-select"
                  value={selectedDbForMapping}
                  onChange={(e) => handleDatabaseSelect(e.target.value)}
                >
                  <option value="">Choose a database...</option>
                  {availableDatabases.map((db) => (
                    <option key={db.id} value={db.id}>
                      {db.title}
                    </option>
                  ))}
                </select>

                {selectedDbForMapping && (
                  <>
                    <label className="form-label">Title Field</label>
                    <input
                      type="text"
                      className="form-input"
                      value={mappingFields.titleField}
                      onChange={(e) =>
                        setMappingFields({ ...mappingFields, titleField: e.target.value })
                      }
                      placeholder="Field name for title"
                    />

                    <label className="form-label">URL Field</label>
                    <input
                      type="text"
                      className="form-input"
                      value={mappingFields.urlField}
                      onChange={(e) =>
                        setMappingFields({ ...mappingFields, urlField: e.target.value })
                      }
                      placeholder="Field name for URL"
                    />

                    <label className="form-label">Tag Field (optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={mappingFields.tagField}
                      onChange={(e) =>
                        setMappingFields({ ...mappingFields, tagField: e.target.value })
                      }
                      placeholder="Field name for tags"
                    />

                    <div className="form-actions">
                      <button
                        className="settings-button"
                        onClick={() => {
                          setShowAddMapping(false);
                          setSelectedDbForMapping('');
                          setMappingFields({ titleField: '', urlField: '', tagField: '' });
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="settings-button settings-button-primary"
                        onClick={handleSaveMapping}
                        disabled={!mappingFields.titleField || !mappingFields.urlField}
                      >
                        Save Mapping
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {databases.length > 0 && (
              <div className="settings-databases-list">
                {databases.map((mapping) => (
                  <div key={mapping.databaseId} className="settings-database-item">
                    <div className="database-item-header">
                      <strong>{mapping.databaseName}</strong>
                    </div>
                    <div className="database-item-fields">
                      <div>Title: {mapping.titleField}</div>
                      <div>URL: {mapping.urlField}</div>
                      {mapping.tagField && <div>Tags: {mapping.tagField}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="settings-section settings-section-danger">
        <h3 className="settings-section-title">Danger Zone</h3>
        <div className="settings-clear-sessions">
          <p>Clear all saved sessions. This action cannot be undone.</p>
          {!showClearConfirm ? (
            <button
              className="settings-button settings-button-danger"
              onClick={() => setShowClearConfirm(true)}
            >
              Clear All Sessions
            </button>
          ) : (
            <div className="clear-confirm">
              <p>Are you sure? This will delete all sessions.</p>
              <div className="form-actions">
                <button
                  className="settings-button"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="settings-button settings-button-danger"
                  onClick={handleClearSessions}
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

