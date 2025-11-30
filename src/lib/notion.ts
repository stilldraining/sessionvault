import type { NotionDatabaseMapping } from './types';
import { getNotionConfig, saveNotionConfig } from './storage';

const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_OAUTH_BASE = 'https://api.notion.com/v1/oauth';

// Re-export storage functions for convenience
export { getNotionConfig, saveNotionConfig };

// Note: In a real implementation, you would need to set up OAuth properly
// For Chrome extensions, you'd typically use chrome.identity API
// This is a simplified version that expects the token to be set manually or via OAuth flow

export async function connectNotion(): Promise<string> {
  // OAuth flow for Chrome extension
  // This uses chrome.identity.launchWebAuthFlow
  return new Promise((resolve, reject) => {
    // For now, we'll use a simplified approach
    // In production, you'd need:
    // 1. Register OAuth app with Notion
    // 2. Get client ID and secret
    // 3. Use chrome.identity.launchWebAuthFlow
    
    const redirectUri = chrome.identity.getRedirectURL();
    const clientId = 'YOUR_NOTION_CLIENT_ID'; // Should be stored securely
    
    const authUrl = `${NOTION_OAUTH_BASE}/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `owner=user`;

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      async (callbackUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!callbackUrl) {
          reject(new Error('No callback URL received'));
          return;
        }

        // Extract code from callback
        const urlParams = new URLSearchParams(callbackUrl.split('?')[1]);
        const code = urlParams.get('code');

        if (!code) {
          reject(new Error('No authorization code received'));
          return;
        }

        // Exchange code for token (this would typically be done server-side)
        // For now, we'll store the code and let the user complete the flow
        // In production, you'd make a server-side call to exchange the code
        
        // For demo purposes, we'll just store a placeholder
        // In real implementation, exchange code for access_token server-side
        const token = await exchangeCodeForToken(code);
        
        const config = await getNotionConfig();
        config.token = token;
        await saveNotionConfig(config);
        
        resolve(token);
      }
    );
  });
}

async function exchangeCodeForToken(_code: string): Promise<string> {
  // This should be done server-side for security
  // For now, return a placeholder
  // In production: POST to your backend which exchanges code for token
  throw new Error('Token exchange must be implemented server-side. See README for setup instructions.');
}

/**
 * Set Notion internal integration token manually
 * This bypasses OAuth and is used for testing with internal integration tokens
 */
export async function setNotionToken(token: string): Promise<void> {
  if (!token || token.trim().length === 0) {
    throw new Error('Token cannot be empty');
  }

  const config = await getNotionConfig();
  config.token = token.trim();
  await saveNotionConfig(config);
}

export async function fetchDatabases(): Promise<Array<{ id: string; title: string }>> {
  const config = await getNotionConfig();
  
  if (!config.token) {
    throw new Error('Notion not connected');
  }

  const response = await fetch(`${NOTION_API_BASE}/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: {
        property: 'object',
        value: 'database',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results.map((db: any) => ({
    id: db.id,
    title: db.title?.[0]?.plain_text || 'Untitled Database',
  }));
}

export async function getDatabaseProperties(databaseId: string): Promise<Record<string, any>> {
  const config = await getNotionConfig();
  
  if (!config.token) {
    throw new Error('Notion not connected');
  }

  const response = await fetch(`${NOTION_API_BASE}/databases/${databaseId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Notion-Version': '2022-06-28',
    },
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.properties;
}

export async function createNotionPage(
  databaseId: string,
  title: string,
  url: string,
  tags: string[],
  mapping: NotionDatabaseMapping
): Promise<void> {
  const config = await getNotionConfig();
  
  if (!config.token) {
    throw new Error('Notion not connected');
  }

  const properties: Record<string, any> = {
    [mapping.titleField]: {
      title: [{ text: { content: title } }],
    },
    [mapping.urlField]: {
      url: url,
    },
  };

  if (mapping.tagField && tags.length > 0) {
    // Try to map tags to multi-select
    properties[mapping.tagField] = {
      multi_select: tags.map((tag) => ({ name: tag.trim() })),
    };
  }

  const response = await fetch(`${NOTION_API_BASE}/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: {
        database_id: databaseId,
      },
      properties,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Notion page: ${error}`);
  }
}

export async function addDatabaseMapping(
  databaseId: string,
  databaseName: string,
  titleField: string,
  urlField: string,
  tagField?: string
): Promise<void> {
  const config = await getNotionConfig();
  
  const mapping: NotionDatabaseMapping = {
    databaseId,
    databaseName,
    titleField,
    urlField,
    tagField,
  };

  config.databases[databaseId] = mapping;
  await saveNotionConfig(config);
}

