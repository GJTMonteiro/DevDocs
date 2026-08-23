import type { Request, Response } from 'express';

import {
  deleteAllNotifications,
  deleteNotification,
  getUnreadNotifications,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notificationService.js';

/* =========================================
   GET ALL NOTIFICATIONS
========================================= */

export const getNotificationsController = async (
  req: Request,
  res: Response,
) => {
  const userId =
    typeof req.query.userId === 'string' ? req.query.userId : undefined;

  if (!userId) {
    return res.status(400).json({
      error: 'userId is required.',
    });
  }

  const notifications = await getUserNotifications(userId);

  return res.status(200).json({
    data: notifications,
  });
};

/* =========================================
   GET UNREAD NOTIFICATIONS
========================================= */

export const getUnreadNotificationsController = async (
  req: Request,
  res: Response,
) => {
  const userId =
    typeof req.query.userId === 'string' ? req.query.userId : undefined;

  if (!userId) {
    return res.status(400).json({
      error: 'userId is required.',
    });
  }

  const notifications = await getUnreadNotifications(userId);

  return res.status(200).json({
    data: notifications,
  });
};

/* =========================================
   GET UNREAD COUNT
========================================= */

export const getUnreadNotificationCountController = async (
  req: Request,
  res: Response,
) => {
  const userId =
    typeof req.query.userId === 'string' ? req.query.userId : undefined;

  if (!userId) {
    return res.status(400).json({
      error: 'userId is required.',
    });
  }

  const notifications = await getUnreadNotifications(userId);

  return res.status(200).json({
    data: {
      count: notifications.length,
    },
  });
};

/* =========================================
   MARK AS READ
========================================= */

export const markNotificationAsReadController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';

  if (!userId) {
    return res.status(400).json({
      error: 'userId is required.',
    });
  }

  if (typeof id !== 'string' || Array.isArray(id)) {
    return res.status(400).json({
      error: 'Invalid notification id.',
    });
  }

  const notification = await markNotificationAsRead(id, userId);

  if (!notification) {
    return res.status(404).json({
      error: 'Notification not found.',
    });
  }

  return res.status(200).json({
    data: notification,
  });
};

/* =========================================
   MARK ALL AS READ
========================================= */

export const markAllNotificationsAsReadController = async (
  req: Request,
  res: Response,
) => {
  const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';

  if (!userId) {
    return res.status(400).json({
      error: 'userId is required.',
    });
  }

  await markAllNotificationsAsRead(userId);

  return res.status(204).send();
};

/* =========================================
   DELETE NOTIFICATION
========================================= */

export const deleteNotificationController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';

  if (!userId) {
    return res.status(400).json({
      error: 'userId is required.',
    });
  }

  if (typeof id !== 'string' || Array.isArray(id)) {
    return res.status(400).json({
      error: 'Invalid notification id.',
    });
  }

  const notification = await deleteNotification(id, userId);

  if (!notification) {
    return res.status(404).json({
      error: 'Notification not found.',
    });
  }

  return res.status(204).send();
};

/* =========================================
   DELETE ALL NOTIFICATIONS
========================================= */

export const deleteAllNotificationsController = async (
  req: Request,
  res: Response,
) => {
  const userId =
    typeof req.query.userId === 'string' ? req.query.userId : undefined;

  if (!userId) {
    return res.status(400).json({
      error: 'userId is required.',
    });
  }

  await deleteAllNotifications(userId);

  return res.status(204).send();
};
