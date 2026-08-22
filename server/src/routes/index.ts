import { Router } from 'express';

import aiRoutes from './ai.routes.js';
import documentsRoutes from './documents.routes.js';
import settingsRoutes from './settings.routes.js';

const router = Router();

router.use('/documents', documentsRoutes);

router.use('/ai', aiRoutes);

router.use('/settings', settingsRoutes);

export default router;
