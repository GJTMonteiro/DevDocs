import { eq } from 'drizzle-orm';

import { db } from '../config/database.js';
import { documents } from '../db/schema/documents.js';
import { documentChunks } from '../db/schema/documentChunks.js';
import { embeddings } from '../db/schema/embeddings.js';

import { splitIntoChunks } from './chunking.js';
import { generateEmbedding } from './embeddings.js';

export const indexDocument = async (documentId: string) => {
  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId))
    .limit(1);

  if (!document) {
    throw new Error('Document not found.');
  }

  const chunks = splitIntoChunks(document.content, 100, 20);

  if (chunks.length === 0) {
    return {
      chunks: [],
      embeddings: [],
    };
  }

  // Remove previous embeddings.
  await db.delete(embeddings).where(eq(embeddings.documentId, documentId));

  // Remove previous chunks.
  await db
    .delete(documentChunks)
    .where(eq(documentChunks.documentId, documentId));

  // Create document chunks.
  const insertedChunks = await db
    .insert(documentChunks)
    .values(
      chunks.map((chunk) => ({
        documentId: document.id,
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
      })),
    )
    .returning();

  // Generate and store an embedding for each chunk.
  const insertedEmbeddings = [];

  for (const chunk of insertedChunks) {
    const embedding = await generateEmbedding(chunk.content);

    const [insertedEmbedding] = await db
      .insert(embeddings)
      .values({
        documentId: document.id,
        chunkId: chunk.id,
        content: chunk.content,
        embedding,
      })
      .returning();

    insertedEmbeddings.push(insertedEmbedding);
  }

  return {
    chunks: insertedChunks,
    embeddings: insertedEmbeddings,
  };
};
