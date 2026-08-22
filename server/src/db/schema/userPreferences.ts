import { boolean, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './users.js';

export const themeEnum = pgEnum('user_theme', ['dark', 'light', 'system']);

export const languageEnum = pgEnum('user_language', ['English', 'Portuguese']);

export const userPreferences = pgTable('user_preferences', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  theme: themeEnum('theme').notNull().default('dark'),

  language: languageEnum('language').notNull().default('English'),

  emailNotifications: boolean('email_notifications').notNull().default(true),

  documentationUpdates: boolean('documentation_updates')
    .notNull()
    .default(true),

  mentions: boolean('mentions').notNull().default(true),

  aiAssistant: boolean('ai_assistant').notNull().default(true),

  contextAwareResponses: boolean('context_aware_responses')
    .notNull()
    .default(true),

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
