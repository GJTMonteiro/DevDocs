import {
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { documents } from './documents.js';
import { users } from './users.js';

export const documentFavorites = pgTable(
  'document_favorites',
  {
    documentId: uuid('document_id')
      .notNull()
      .references(() => documents.id, {
        onDelete: 'cascade',
      }),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [
        table.documentId,
        table.userId,
      ],
    }),
  }),
);