import { desc, gt, sql } from 'drizzle-orm';

import { db } from '../config/database.js';
import { embeddings } from '../db/schema/embeddings.js';
import { documents } from '../db/schema/documents.js';
import { generateEmbedding } from './embeddings.js';

export interface SimilarChunk {
  embeddingId: string;
  chunkId: string;
  documentId: string;
  title: string;
  category: string | null;
  content: string;
  similarity: number;
}

const MIN_SIMILARITY = 0.35;
const STRONG_SIMILARITY = 0.5;
const MAX_RESULTS = 5;
const MAX_CHUNKS_PER_DOCUMENT = 2;

export const searchSimilarChunks = async (
  query: string,
  limit = MAX_RESULTS,
): Promise<SimilarChunk[]> => {
  const message = query.trim();

  if (!message) {
    return [];
  }

  const embedding = await generateEmbedding(message);
  const embeddingVector = `[${embedding.join(',')}]`;

  const similarity = sql<number>`
    1 - (
      ${embeddings.embedding} <=> ${embeddingVector}::vector
    )
  `;

  const safeLimit = Math.min(Math.max(limit, 1), MAX_RESULTS);

  /*
   * Retrieve additional candidates so we can apply
   * document diversity after the similarity search.
   */
  const candidateLimit = Math.min(safeLimit * 3, MAX_RESULTS * 3);

  const results = await db
    .select({
      embeddingId: embeddings.id,
      chunkId: embeddings.chunkId,
      documentId: embeddings.documentId,
      title: documents.title,
      category: documents.category,
      content: embeddings.content,
      similarity,
    })
    .from(embeddings)
    .innerJoin(documents, sql`${embeddings.documentId} = ${documents.id}`)
    .where(
      gt(
        sql<number>`
          1 - (
            ${embeddings.embedding} <=> ${embeddingVector}::vector
          )
        `,
        MIN_SIMILARITY,
      ),
    )
    .orderBy(desc(similarity))
    .limit(candidateLimit);

  /*
   * Remove duplicated chunks.
   */
  const uniqueChunks = Array.from(
    new Map(results.map((result) => [result.chunkId, result])).values(),
  );

  /*
   * If there are no relevant chunks, return an empty result.
   */
  if (uniqueChunks.length === 0) {
    return [];
  }

  /*
   * Require at least one strong semantic match.
   *
   * This prevents the RAG system from returning weakly
   * related chunks when the user's question does not
   * have a sufficiently relevant match in the documentation.
   */
  if ((uniqueChunks[0]?.similarity ?? 0) < STRONG_SIMILARITY) {
    return [];
  }

  /*
   * Limit the number of chunks coming from
   * the same document.
   */
  const documentChunkCounts = new Map<string, number>();
  const diverseChunks: SimilarChunk[] = [];

  for (const chunk of uniqueChunks) {
    const currentCount = documentChunkCounts.get(chunk.documentId) ?? 0;

    if (currentCount >= MAX_CHUNKS_PER_DOCUMENT) {
      continue;
    }

    documentChunkCounts.set(chunk.documentId, currentCount + 1);

    diverseChunks.push(chunk);

    if (diverseChunks.length >= safeLimit) {
      break;
    }
  }

  return diverseChunks;
};
