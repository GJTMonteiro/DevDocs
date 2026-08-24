import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from 'drizzle-orm/pg-core';

import { documents } from './documents.js';
import { documentChunks } from './documentChunks.js';

export const embeddings = pgTable(
  'embeddings',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    documentId: uuid('document_id')
      .notNull()
      .references(() => documents.id, {
        onDelete: 'cascade',
      }),

    chunkId: uuid('chunk_id')
      .notNull()
      .references(() => documentChunks.id, {
        onDelete: 'cascade',
      }),

    content: text('content').notNull(),

    embedding: vector('embedding', {
      dimensions: 1536,
    }).notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    documentIdIndex: index('embeddings_document_id_idx').on(table.documentId),

    chunkIdIndex: index('embeddings_chunk_id_idx').on(table.chunkId),
  }),
);
