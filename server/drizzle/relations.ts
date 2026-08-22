import { relations } from "drizzle-orm/relations";
import { users, documents, userPreferences, documentFavorites } from "./schema";

export const documentsRelations = relations(documents, ({one, many}) => ({
	user: one(users, {
		fields: [documents.createdBy],
		references: [users.id]
	}),
	documentFavorites: many(documentFavorites),
}));

export const usersRelations = relations(users, ({many}) => ({
	documents: many(documents),
	userPreferences: many(userPreferences),
	documentFavorites: many(documentFavorites),
}));

export const userPreferencesRelations = relations(userPreferences, ({one}) => ({
	user: one(users, {
		fields: [userPreferences.userId],
		references: [users.id]
	}),
}));

export const documentFavoritesRelations = relations(documentFavorites, ({one}) => ({
	document: one(documents, {
		fields: [documentFavorites.documentId],
		references: [documents.id]
	}),
	user: one(users, {
		fields: [documentFavorites.userId],
		references: [users.id]
	}),
}));