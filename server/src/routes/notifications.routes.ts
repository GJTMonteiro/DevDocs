import { Router } from 'express';

import {
  deleteAllNotificationsController,
  deleteNotificationController,
  getNotificationsController,
  getUnreadNotificationCountController,
  getUnreadNotificationsController,
  markAllNotificationsAsReadController,
  markNotificationAsReadController,
} from '../controllers/notifications.controller.js';

const router = Router();

router.get('/unread/count', getUnreadNotificationCountController);

router.get('/unread', getUnreadNotificationsController);

router.get('/', getNotificationsController);

router.patch('/read-all', markAllNotificationsAsReadController);

router.patch('/:id/read', markNotificationAsReadController);

router.delete('/:id', deleteNotificationController);

router.delete('/', deleteAllNotificationsController);

export default router;
