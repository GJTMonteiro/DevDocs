import { eq, ilike, sql } from 'drizzle-orm';

import { db } from '../config/database.js';

import { collections } from '../db/schema/collections.js';

import { documents } from '../db/schema/documents.js';

interface CreateCollectionInput {
  name: string;
  description?: string | null;
  color?: 'blue' | 'purple' | 'green' | 'yellow';
  createdBy: string;
}

interface UpdateCollectionInput {
  name?: string;
  description?: string | null;
  color?: 'blue' | 'purple' | 'green' | 'yellow';
}

export const getCollections = async (userId?: string, search?: string) => {
  const conditions = [];

  if (userId) {
    conditions.push(eq(collections.createdBy, userId));
  }

  if (search?.trim()) {
    conditions.push(ilike(collections.name, `%${search.trim()}%`));
  }

  const result = await db
    .select({
      id: collections.id,
      name: collections.name,
      description: collections.description,
      color: collections.color,
      createdBy: collections.createdBy,
      createdAt: collections.createdAt,
      updatedAt: collections.updatedAt,

      documents: sql<number>`
        count(${documents.id})
      `.mapWith(Number),
    })
    .from(collections)
    .leftJoin(documents, eq(documents.collectionId, collections.id))
    .where(conditions.length ? sql.join(conditions, sql` AND `) : undefined)
    .groupBy(collections.id)
    .orderBy(collections.name);

  return result;
};

export const getCollectionById = async (id: number) => {
  const [collection] = await db
    .select({
      id: collections.id,
      name: collections.name,
      description: collections.description,
      color: collections.color,
      createdBy: collections.createdBy,
      createdAt: collections.createdAt,
      updatedAt: collections.updatedAt,

      documents: sql<number>`
        count(${documents.id})
      `.mapWith(Number),
    })
    .from(collections)
    .leftJoin(documents, eq(documents.collectionId, collections.id))
    .where(eq(collections.id, id))
    .groupBy(collections.id)
    .limit(1);

  return collection ?? null;
};

export const createCollection = async (input: CreateCollectionInput) => {
  const [collection] = await db
    .insert(collections)
    .values({
      name: input.name,
      description: input.description ?? null,
      color: input.color ?? 'blue',
      createdBy: input.createdBy,
    })
    .returning();

  return collection;
};

export const updateCollection = async (
  id: number,
  input: UpdateCollectionInput,
) => {
  const [collection] = await db
    .update(collections)
    .set({
      ...(input.name !== undefined && {
        name: input.name,
      }),

      ...(input.description !== undefined && {
        description: input.description,
      }),

      ...(input.color !== undefined && {
        color: input.color,
      }),

      updatedAt: new Date(),
    })
    .where(eq(collections.id, id))
    .returning();

  return collection ?? null;
};

export const deleteCollection = async (id: number) => {
  const [collection] = await db
    .delete(collections)
    .where(eq(collections.id, id))
    .returning();

  return collection ?? null;
};
