import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { documents } from './documents.js';

export const documentChunks = pgTable('document_chunks', {
  id: uuid('id').defaultRandom().primaryKey(),

  documentId: uuid('document_id')
    .notNull()
    .references(() => documents.id, {
      onDelete: 'cascade',
    }),

  content: text('content').notNull(),

  chunkIndex: integer('chunk_index').notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
