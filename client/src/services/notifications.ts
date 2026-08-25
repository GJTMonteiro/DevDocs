import { API_URL } from '../api';

export interface Notification {
  id: string;
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
  documentId: string | null;
  isRead: boolean;
  createdAt: string;
}

interface GetNotificationsResponse {
  data: Notification[];
}

interface MarkNotificationAsReadResponse {
  data: Notification;
}

interface UnreadCountResponse {
  data: {
    count: number;
  };
}

/* =========================================
   GET USER NOTIFICATIONS
========================================= */

export const getNotifications = async (): Promise<Notification[]> => {
  const userId = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

  const response = await fetch(`${API_URL}/notifications?userId=${userId}`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to fetch notifications.');
  }

  const result: GetNotificationsResponse = await response.json();

  return result.data;
};

/* =========================================
   GET UNREAD NOTIFICATIONS
========================================= */

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const userId = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

  const response = await fetch(
    `${API_URL}/notifications/unread?userId=${userId}`,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to fetch unread notifications.');
  }

  const result: GetNotificationsResponse = await response.json();

  return result.data;
};

/* =========================================
   GET UNREAD COUNT
========================================= */

export const getUnreadNotificationCount = async (): Promise<number> => {
  const userId = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

  const response = await fetch(
    `${API_URL}/notifications/unread/count?userId=${userId}`,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.error || 'Failed to fetch unread notification count.',
    );
  }

  const result: UnreadCountResponse = await response.json();

  return result.data.count;
};

/* =========================================
   MARK NOTIFICATION AS READ
========================================= */

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<Notification> => {
  const userId = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

  const response = await fetch(
    `${API_URL}/notifications/${notificationId}/read`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to mark notification as read.');
  }

  const result: MarkNotificationAsReadResponse = await response.json();

  return result.data;
};

/* =========================================
   MARK ALL AS READ
========================================= */

export const markAllNotificationsAsRead = async (): Promise<void> => {
  const userId = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

  const response = await fetch(`${API_URL}/notifications/read-all`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to mark notifications as read.');
  }
};

/* =========================================
   DELETE NOTIFICATION
========================================= */

export const deleteNotification = async (
  notificationId: string,
): Promise<void> => {
  const userId = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

  const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to delete notification.');
  }
};

/* =========================================
   DELETE ALL NOTIFICATIONS
========================================= */

export const deleteAllNotifications = async (): Promise<void> => {
  const userId = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

  const response = await fetch(`${API_URL}/notifications?userId=${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || 'Failed to delete notifications.');
  }
};
