import { and, eq, sql } from 'drizzle-orm';

import { db } from '../config/database.js';

import { documents } from '../db/schema/documents.js';
import { documentFavorites } from '../db/schema/documentFavorites.js';
import { users } from '../db/schema/users.js';

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

  return document;
};

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
    .orderBy(documents.createdAt);
};

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
    total: Number(result.total),

    published: Number(result.published),

    drafts: Number(result.drafts),

    archived: Number(result.archived),
  };
};

export const toggleDocumentFavorite = async (
  documentId: string,
  userId: string,
) => {
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

  if (existingFavorite) {
    await db
      .delete(documentFavorites)
      .where(
        and(
          eq(documentFavorites.documentId, documentId),
          eq(documentFavorites.userId, userId),
        ),
      );

    return {
      isFavorite: false,
    };
  }

  await db.insert(documentFavorites).values({
    documentId,
    userId,
  });

  return {
    isFavorite: true,
  };
};

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

  return document ?? null;
};

export const deleteDocument = async (id: string) => {
  const [document] = await db
    .delete(documents)
    .where(eq(documents.id, id))
    .returning({
      id: documents.id,
    });

  return document ?? null;
};
