import { Router } from 'express';

import aiRoutes from './ai.routes.js';
import collectionsRoutes from './collections.routes.js';
import documentsRoutes from './documents.routes.js';
import notificationsRoutes from './notifications.routes.js';
import settingsRoutes from './settings.routes.js';
import profileRoutes from './profile.js';

const router = Router();

router.use('/documents', documentsRoutes);
router.use('/collections', collectionsRoutes);
router.use('/ai', aiRoutes);
router.use('/settings', settingsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/profile', profileRoutes);

export default router;
