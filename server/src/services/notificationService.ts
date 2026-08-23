import { and, desc, eq } from 'drizzle-orm';

import { db } from '../config/database.js';
import { notifications } from '../db/schema/notifications.js';

interface CreateNotificationInput {
  userId: string;

  type:
    | 'system'
    | 'documentation_update'
    | 'document_created'
    | 'document_updated'
    | 'document_deleted'
    | 'document_favorited'
    | 'document_unfavorited';

  title: string;
  message: string;
  documentId?: string | null;
}

/* =========================================
   CREATE NOTIFICATION
========================================= */

export const createNotification = async (input: CreateNotificationInput) => {
  const [notification] = await db
    .insert(notifications)
    .values({
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      documentId: input.documentId ?? null,
    })
    .returning();

  if (!notification) {
    throw new Error('Failed to create notification.');
  }

  return notification;
};

/* =========================================
   GET ALL NOTIFICATIONS
========================================= */

export const getUserNotifications = async (userId: string) => {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
};

/* =========================================
   GET UNREAD NOTIFICATIONS
========================================= */

export const getUnreadNotifications = async (userId: string) => {
  return db
    .select()
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false)),
    )
    .orderBy(desc(notifications.createdAt));
};

/* =========================================
   MARK NOTIFICATION AS READ
========================================= */

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string,
) => {
  const [notification] = await db
    .update(notifications)
    .set({
      isRead: true,
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId),
      ),
    )
    .returning();

  return notification ?? null;
};

/* =========================================
   MARK ALL NOTIFICATIONS AS READ
========================================= */

export const markAllNotificationsAsRead = async (userId: string) => {
  await db
    .update(notifications)
    .set({
      isRead: true,
    })
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false)),
    );
};

/* =========================================
   DELETE NOTIFICATION
========================================= */

export const deleteNotification = async (
  notificationId: string,
  userId: string,
) => {
  const [notification] = await db
    .delete(notifications)
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId),
      ),
    )
    .returning({
      id: notifications.id,
    });

  return notification ?? null;
};

/* =========================================
   DELETE ALL NOTIFICATIONS
========================================= */

export const deleteAllNotifications = async (userId: string) => {
  const deletedNotifications = await db
    .delete(notifications)
    .where(eq(notifications.userId, userId))
    .returning({
      id: notifications.id,
    });

  return deletedNotifications.length;
};
