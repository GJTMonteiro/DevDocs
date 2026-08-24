import { eq } from 'drizzle-orm';

import { db } from '../config/database.js';
import { users } from '../db/schema/users.js';
import { userPreferences } from '../db/schema/userPreferences.js';

const DEFAULT_USER_PREFERENCES = {
  theme: 'dark' as const,
  emailNotifications: true,
  documentationUpdates: true,
  mentions: true,
  aiAssistant: true,
  contextAwareResponses: true,
};

export const getUserSettings = async (userId: string) => {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      userCreatedAt: users.createdAt,
      userUpdatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error('User not found.');
  }

  let [preferences] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (!preferences) {
    [preferences] = await db
      .insert(userPreferences)
      .values({
        userId,
        ...DEFAULT_USER_PREFERENCES,
      })
      .returning();
  }

  return {
    userId: user.id,
    name: user.name,
    email: user.email,

    theme: preferences.theme,
    emailNotifications: preferences.emailNotifications,
    documentationUpdates: preferences.documentationUpdates,
    mentions: preferences.mentions,
    aiAssistant: preferences.aiAssistant,
    contextAwareResponses: preferences.contextAwareResponses,

    createdAt: user.userCreatedAt,
    updatedAt: preferences.updatedAt,
  };
};

export interface UpdateUserSettingsInput {
  name?: string;
  email?: string;
  theme?: 'dark' | 'light' | 'system';
  emailNotifications?: boolean;
  documentationUpdates?: boolean;
  mentions?: boolean;
  aiAssistant?: boolean;
  contextAwareResponses?: boolean;
}

export const updateUserSettings = async (
  userId: string,
  input: UpdateUserSettingsInput,
) => {
  const current = await getUserSettings(userId);

  const result = await db.transaction(async (tx) => {
    if (input.name !== undefined || input.email !== undefined) {
      await tx
        .update(users)
        .set({
          ...(input.name !== undefined && {
            name: input.name,
          }),
          ...(input.email !== undefined && {
            email: input.email,
          }),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }

    const [updatedPreferences] = await tx
      .update(userPreferences)
      .set({
        theme: input.theme ?? current.theme,
        emailNotifications:
          input.emailNotifications ?? current.emailNotifications,
        documentationUpdates:
          input.documentationUpdates ?? current.documentationUpdates,
        mentions: input.mentions ?? current.mentions,
        aiAssistant: input.aiAssistant ?? current.aiAssistant,
        contextAwareResponses:
          input.contextAwareResponses ?? current.contextAwareResponses,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId))
      .returning();

    return updatedPreferences;
  });

  return {
    userId,
    name: input.name ?? current.name,
    email: input.email ?? current.email,

    theme: result.theme,
    emailNotifications: result.emailNotifications,
    documentationUpdates: result.documentationUpdates,
    mentions: result.mentions,
    aiAssistant: result.aiAssistant,
    contextAwareResponses: result.contextAwareResponses,

    createdAt: current.createdAt,
    updatedAt: result.updatedAt,
  };
};
