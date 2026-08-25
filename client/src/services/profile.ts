import { API_URL } from '../api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileResponse {
  success: boolean;
  data: UserProfile;
  message?: string;
}

export const getProfile = async (): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/api/profile`);

  if (!response.ok) {
    throw new Error(`Profile request failed with status ${response.status}`);
  }

  const result: ProfileResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to load profile.');
  }

  return result.data;
};

export const updateProfile = async (
  name: string,
  email: string,
  role: string,
): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      role,
    }),
  });

  if (!response.ok) {
    throw new Error(`Profile request failed with status ${response.status}`);
  }

  const result: ProfileResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || 'Failed to update profile.');
  }

  return result.data;
};
