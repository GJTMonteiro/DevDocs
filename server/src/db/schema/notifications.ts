import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users.js';
import { documents } from './documents.js';

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  type: text('type').notNull(),

  title: text('title').notNull(),

  message: text('message').notNull(),

  documentId: uuid('document_id').references(() => documents.id, {
    onDelete: 'cascade',
  }),

  isRead: boolean('is_read').notNull().default(false),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
