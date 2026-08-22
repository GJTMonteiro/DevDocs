import { pgTable, unique, uuid, text, timestamp, foreignKey, integer, boolean, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const documentStatus = pgEnum("document_status", ['draft', 'published', 'archived'])
export const documentVisibility = pgEnum("document_visibility", ['workspace', 'private'])
export const userLanguage = pgEnum("user_language", ['English', 'Portuguese'])
export const userTheme = pgEnum("user_theme", ['dark', 'light', 'system'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const documents = pgTable("documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	collectionId: integer("collection_id"),
	category: text(),
	visibility: documentVisibility().default('workspace').notNull(),
	status: documentStatus().default('draft').notNull(),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "documents_created_by_users_id_fk"
		}),
]);

export const userPreferences = pgTable("user_preferences", {
	userId: uuid("user_id").primaryKey().notNull(),
	theme: userTheme().default('dark').notNull(),
	language: userLanguage().default('English').notNull(),
	emailNotifications: boolean("email_notifications").default(true).notNull(),
	documentationUpdates: boolean("documentation_updates").default(true).notNull(),
	mentions: boolean().default(true).notNull(),
	aiAssistant: boolean("ai_assistant").default(true).notNull(),
	contextAwareResponses: boolean("context_aware_responses").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_preferences_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const documentFavorites = pgTable("document_favorites", {
	documentId: uuid("document_id").notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documents.id],
			name: "document_favorites_document_id_documents_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "document_favorites_user_id_users_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.documentId, table.userId], name: "document_favorites_document_id_user_id_pk"}),
]);
