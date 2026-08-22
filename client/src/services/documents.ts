const API_URL = 'http://localhost:3000/api';

export interface CreateDocumentInput {
  title: string;
  content: string;
  collectionId?: number | null;
  category?: string | null;
  visibility?: 'workspace' | 'private';
  createdBy: string;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
  collectionId?: number | null;
  category?: string | null;
  visibility?: 'workspace' | 'private';
  status?: 'draft' | 'published' | 'archived';
}

export interface Document {
  id: string;

  title: string;

  content: string;

  collectionId: number | null;

  category: string | null;

  visibility: 'workspace' | 'private';

  status: 'draft' | 'published' | 'archived';

  createdBy: string;

  createdAt: string;

  updatedAt: string;

  author: {
    id: string;
    name: string;
    email: string;
  };

  isFavorite: boolean;
}

export interface DocumentStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
}

interface CreateDocumentResponse {
  data: Document;
}

interface GetDocumentsResponse {
  data: Document[];
}

interface GetDocumentResponse {
  data: Document;
}

interface GetDocumentStatsResponse {
  data: DocumentStats;
}

interface ToggleFavoriteResponse {
  data: {
    isFavorite: boolean;
  };
}

interface UpdateDocumentResponse {
  data: Document;
}

export const createDocument = async (
  input: CreateDocumentInput,
): Promise<Document> => {
  const response = await fetch(`${API_URL}/documents`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to create document.');
  }

  const result: CreateDocumentResponse = await response.json();

  return result.data;
};

export const getDocuments = async (): Promise<Document[]> => {
  const userId = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

  const response = await fetch(`${API_URL}/documents?userId=${userId}`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to fetch documents.');
  }

  const result: GetDocumentsResponse = await response.json();

  return result.data;
};

export const getDocumentById = async (
  documentId: string,
): Promise<Document> => {
  const userId = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

  const response = await fetch(
    `${API_URL}/documents/${documentId}?userId=${userId}`,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to fetch document.');
  }

  const result: GetDocumentResponse = await response.json();

  return result.data;
};

export const getDocumentStats = async (): Promise<DocumentStats> => {
  const response = await fetch(`${API_URL}/documents/stats`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to fetch document statistics.');
  }

  const result: GetDocumentStatsResponse = await response.json();

  return result.data;
};

export const toggleDocumentFavorite = async (
  documentId: string,
): Promise<boolean> => {
  const userId = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

  const response = await fetch(`${API_URL}/documents/${documentId}/favorite`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      userId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to update favorite.');
  }

  const result: ToggleFavoriteResponse = await response.json();

  return result.data.isFavorite;
};

export const updateDocument = async (
  documentId: string,
  input: UpdateDocumentInput,
): Promise<Document> => {
  const response = await fetch(`${API_URL}/documents/${documentId}`, {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to update document.');
  }

  const result: UpdateDocumentResponse = await response.json();

  return result.data;
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/documents/${documentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to delete document.');
  }
};
