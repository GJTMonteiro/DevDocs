import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '../config/database.js';

import { documents } from '../db/schema/documents.js';

import { documentFavorites } from '../db/schema/documentFavorites.js';

import { users } from '../db/schema/users.js';

import { indexDocument } from '../ai/indexDocument.js';

import { createNotification } from './notificationService.js';

interface CreateDocumentInput {
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

/* =========================================
   CREATE DOCUMENT
========================================= */

export const createDocument = async (input: CreateDocumentInput) => {
  const [document] = await db
    .insert(documents)
    .values({
      title: input.title,
      content: input.content,
      collectionId: input.collectionId ?? null,
      category: input.category ?? null,
      visibility: input.visibility ?? 'workspace',
      createdBy: input.createdBy,
    })
    .returning();

  if (!document) {
    throw new Error('Failed to create document.');
  }

  /*
   * Index the document immediately after creation.
   *
   * This creates:
   * - document chunks
   * - embeddings for each chunk
   *
   * We do not fail document creation if AI indexing fails.
   */

  try {
    await indexDocument(document.id);
  } catch (error) {
    console.error(`Failed to index document "${document.id}":`, error);
  }

  await createNotification({
    userId: document.createdBy,
    type: 'document_created',
    title: 'Document created',
    message: `Your document "${document.title}" was created successfully.`,
    documentId: document.id,
  });

  return document;
};

/* =========================================
   GET DOCUMENTS
========================================= */

export const getDocuments = async (userId?: string) => {
  const favoriteJoin = userId
    ? and(
        eq(documentFavorites.documentId, documents.id),
        eq(documentFavorites.userId, userId),
      )
    : eq(documentFavorites.documentId, documents.id);

  return db
    .select({
      id: documents.id,
      title: documents.title,
      content: documents.content,
      collectionId: documents.collectionId,
      category: documents.category,
      visibility: documents.visibility,
      status: documents.status,
      createdBy: documents.createdBy,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,

      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },

      isFavorite: sql<boolean>`
        ${documentFavorites.documentId} IS NOT NULL
      `,
    })
    .from(documents)
    .leftJoin(users, eq(documents.createdBy, users.id))
    .leftJoin(documentFavorites, favoriteJoin)
    .orderBy(desc(documents.createdAt));
};

/* =========================================
   GET DOCUMENT BY ID
========================================= */

export const getDocumentById = async (id: string, userId?: string) => {
  const favoriteJoin = userId
    ? and(
        eq(documentFavorites.documentId, documents.id),
        eq(documentFavorites.userId, userId),
      )
    : eq(documentFavorites.documentId, documents.id);

  const [document] = await db
    .select({
      id: documents.id,
      title: documents.title,
      content: documents.content,
      collectionId: documents.collectionId,
      category: documents.category,
      visibility: documents.visibility,
      status: documents.status,
      createdBy: documents.createdBy,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,

      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },

      isFavorite: sql<boolean>`
        ${documentFavorites.documentId} IS NOT NULL
      `,
    })
    .from(documents)
    .leftJoin(users, eq(documents.createdBy, users.id))
    .leftJoin(documentFavorites, favoriteJoin)
    .where(eq(documents.id, id))
    .limit(1);

  return document ?? null;
};

/* =========================================
   DOCUMENT STATISTICS
========================================= */

export const getDocumentStats = async () => {
  const [result] = await db
    .select({
      total: sql<number>`
        count(*)
      `,

      published: sql<number>`
        count(*) filter (
          where ${documents.status} = 'published'
        )
      `,

      drafts: sql<number>`
        count(*) filter (
          where ${documents.status} = 'draft'
        )
      `,

      archived: sql<number>`
        count(*) filter (
          where ${documents.status} = 'archived'
        )
      `,
    })
    .from(documents);

  return {
    total: Number(result?.total ?? 0),
    published: Number(result?.published ?? 0),
    drafts: Number(result?.drafts ?? 0),
    archived: Number(result?.archived ?? 0),
  };
};

/* =========================================
   TOGGLE FAVORITE
========================================= */

export const toggleDocumentFavorite = async (
  documentId: string,
  userId: string,
) => {
  const [document] = await db
    .select({
      id: documents.id,
      title: documents.title,
    })
    .from(documents)
    .where(eq(documents.id, documentId))
    .limit(1);

  if (!document) {
    throw new Error('Document not found.');
  }

  const [existingFavorite] = await db
    .select()
    .from(documentFavorites)
    .where(
      and(
        eq(documentFavorites.documentId, documentId),
        eq(documentFavorites.userId, userId),
      ),
    )
    .limit(1);

  /* ===============================
     REMOVE FROM FAVORITES
  =============================== */

  if (existingFavorite) {
    await db
      .delete(documentFavorites)
      .where(
        and(
          eq(documentFavorites.documentId, documentId),
          eq(documentFavorites.userId, userId),
        ),
      );

    await createNotification({
      userId,
      type: 'document_unfavorited',
      title: 'Removed from favorites',
      message: `"${document.title}" was removed from your favorites.`,
      documentId: document.id,
    });

    return {
      isFavorite: false,
    };
  }

  /* ===============================
     ADD TO FAVORITES
  =============================== */

  await db.insert(documentFavorites).values({
    documentId,
    userId,
  });

  await createNotification({
    userId,
    type: 'document_favorited',
    title: 'Added to favorites',
    message: `"${document.title}" was added to your favorites.`,
    documentId: document.id,
  });

  return {
    isFavorite: true,
  };
};

/* =========================================
   UPDATE DOCUMENT
========================================= */

export const updateDocument = async (
  id: string,
  input: UpdateDocumentInput,
) => {
  const [document] = await db
    .update(documents)
    .set({
      ...(input.title !== undefined && {
        title: input.title,
      }),

      ...(input.content !== undefined && {
        content: input.content,
      }),

      ...(input.collectionId !== undefined && {
        collectionId: input.collectionId,
      }),

      ...(input.category !== undefined && {
        category: input.category,
      }),

      ...(input.visibility !== undefined && {
        visibility: input.visibility,
      }),

      ...(input.status !== undefined && {
        status: input.status,
      }),

      updatedAt: new Date(),
    })
    .where(eq(documents.id, id))
    .returning();

  if (!document) {
    return null;
  }

  /*
   * Re-index the document after an update.
   *
   * This is especially important when the content changes,
   * because the old chunks and embeddings are no longer valid.
   *
   * indexDocument() removes the old chunks and embeddings
   * and creates new ones based on the current document content.
   */

  try {
    await indexDocument(document.id);
  } catch (error) {
    console.error(`Failed to re-index document "${document.id}":`, error);
  }

  await createNotification({
    userId: document.createdBy,
    type: 'document_updated',
    title: 'Document updated',
    message: `Your document "${document.title}" was updated successfully.`,
    documentId: document.id,
  });

  return document;
};

/* =========================================
   DELETE DOCUMENT
========================================= */

export const deleteDocument = async (id: string) => {
  const [document] = await db
    .select({
      id: documents.id,
      title: documents.title,
      createdBy: documents.createdBy,
    })
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);

  if (!document) {
    return null;
  }

  /*
   * Create the notification before deleting
   * the document because documentId references
   * the documents table.
   */

  await createNotification({
    userId: document.createdBy,
    type: 'document_deleted',
    title: 'Document deleted',
    message: `Your document "${document.title}" was deleted.`,
    documentId: null,
  });

  /*
   * The document chunks and embeddings are deleted
   * automatically through ON DELETE CASCADE.
   */

  await db.delete(documents).where(eq(documents.id, id));

  return {
    id: document.id,
  };
};

/* =========================================
   DELETE ALL DOCUMENTS
========================================= */

export const deleteAllDocuments = async () => {
  const result = await db.delete(documents).returning({
    id: documents.id,
  });

  return {
    deleted: result.length,
  };
};
