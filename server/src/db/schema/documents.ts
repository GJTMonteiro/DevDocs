import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { users } from './users.js';
import { collections } from './collections.js';

export const documentVisibilityEnum = pgEnum('document_visibility', [
  'workspace',
  'private',
]);

export const documentStatusEnum = pgEnum('document_status', [
  'draft',
  'published',
  'archived',
]);

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),

  title: text('title').notNull(),

  content: text('content').notNull(),

  collectionId: integer('collection_id').references(() => collections.id, {
    onDelete: 'set null',
  }),

  category: text('category'),

  visibility: documentVisibilityEnum('visibility')
    .notNull()
    .default('workspace'),

  status: documentStatusEnum('status').notNull().default('draft'),

  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.id),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
