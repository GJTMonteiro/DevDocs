const API_URL = 'http://localhost:3000/api';

export type CollectionColor = 'blue' | 'purple' | 'green' | 'yellow';

export interface Collection {
  id: number;
  name: string;
  description: string | null;
  color: CollectionColor;
  createdBy: string;
  documents: number;
  createdAt: string;
  updatedAt: string;
}

interface CollectionsResponse {
  data: Collection[];
}

interface CollectionResponse {
  data: Collection;
}

export const getCollections = async (
  search?: string,
): Promise<Collection[]> => {
  const params = new URLSearchParams();

  if (search?.trim()) {
    params.set('search', search.trim());
  }

  const query = params.toString();

  const response = await fetch(
    `${API_URL}/collections${query ? `?${query}` : ''}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch collections.');
  }

  const result: CollectionsResponse = await response.json();

  return result.data;
};

export interface CreateCollectionInput {
  name: string;
  description?: string | null;
  color?: CollectionColor;
  createdBy: string;
}

export const createCollection = async (
  input: CreateCollectionInput,
): Promise<Collection> => {
  const response = await fetch(`${API_URL}/collections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(result?.error || 'Failed to create collection.');
  }

  const result: CollectionResponse = await response.json();

  return result.data;
};

export interface UpdateCollectionInput {
  name?: string;
  description?: string | null;
  color?: CollectionColor;
}

export const updateCollection = async (
  id: number,
  input: UpdateCollectionInput,
): Promise<Collection> => {
  const response = await fetch(`${API_URL}/collections/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(result?.error || 'Failed to update collection.');
  }

  const result: CollectionResponse = await response.json();

  return result.data;
};

export const deleteCollection = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/collections/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(result?.error || 'Failed to delete collection.');
  }
};

export const getCollectionById = async (id: number): Promise<Collection> => {
  const response = await fetch(`${API_URL}/collections/${id}`);

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(result?.error || 'Failed to fetch collection.');
  }

  const result: CollectionResponse = await response.json();

  return result.data;
};
