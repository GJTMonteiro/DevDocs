import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { users } from './users.js';

export const collectionColorEnum = pgEnum('collection_color', [
  'blue',
  'purple',
  'green',
  'yellow',
]);

export const collections = pgTable('collections', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),

  name: text('name').notNull(),

  description: text('description'),

  color: collectionColorEnum('color').notNull().default('blue'),

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
