const API_URL = 'http://localhost:3000/api';

export interface UserSettings {
  userId: string;
  name: string;
  email: string;
  theme: 'dark' | 'light' | 'system';
  emailNotifications: boolean;
  documentationUpdates: boolean;
  mentions: boolean;
  aiAssistant: boolean;
  contextAwareResponses: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SettingsResponse {
  success: boolean;
  data: UserSettings;
}

export const getSettings = async (): Promise<UserSettings> => {
  const response = await fetch(`${API_URL}/settings`);

  if (!response.ok) {
    throw new Error('Failed to fetch settings.');
  }

  const result: SettingsResponse = await response.json();

  if (!result.success) {
    throw new Error('Failed to fetch settings.');
  }

  return result.data;
};

export const updateSettings = async (
  settings: Partial<UserSettings>,
): Promise<UserSettings> => {
  const response = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error('Failed to update settings.');
  }

  const result: SettingsResponse = await response.json();

  if (!result.success) {
    throw new Error('Failed to update settings.');
  }

  return result.data;
};
