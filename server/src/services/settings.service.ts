import { eq } from 'drizzle-orm';

import { db } from '../config/database.js';
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
  const [preferences] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (preferences) {
    return preferences;
  }

  const [createdPreferences] = await db
    .insert(userPreferences)
    .values({
      userId,
      ...DEFAULT_USER_PREFERENCES,
    })
    .returning();

  return createdPreferences;
};

export interface UpdateUserSettingsInput {
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

  const nextValues = {
    theme: input.theme ?? current.theme,
    emailNotifications: input.emailNotifications ?? current.emailNotifications,
    documentationUpdates:
      input.documentationUpdates ?? current.documentationUpdates,
    mentions: input.mentions ?? current.mentions,
    aiAssistant: input.aiAssistant ?? current.aiAssistant,
    contextAwareResponses:
      input.contextAwareResponses ?? current.contextAwareResponses,
    updatedAt: new Date(),
  };

  const [updatedPreferences] = await db
    .update(userPreferences)
    .set(nextValues)
    .where(eq(userPreferences.userId, userId))
    .returning();

  return updatedPreferences;
};
