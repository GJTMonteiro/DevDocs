import { API_URL } from '../api';

export interface AIChatSource {
  id: string;
  title: string;
  category: string | null;
  similarity: number;
}

export interface AIChatResponse {
  answer: string;
  sources: AIChatSource[];
}

interface AIChatAPIResponse {
  data: AIChatResponse;
}

interface AIChatErrorResponse {
  error: string;
}

export const askAI = async (
  message: string,
): Promise<AIChatResponse> => {
  const response = await fetch(`${API_URL}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
    }),
  });

  const data = (await response.json()) as
    | AIChatAPIResponse
    | AIChatErrorResponse;

  if (!response.ok) {
    if ('error' in data) {
      throw new Error(data.error);
    }

    throw new Error('Failed to communicate with AI assistant.');
  }

  if (!('data' in data)) {
    throw new Error('Invalid AI response.');
  }

  return data.data;
};