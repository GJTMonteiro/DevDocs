import { Router } from 'express';

import documentsRoutes from './documents.routes.js';

const router = Router();

router.use('/documents', documentsRoutes);

export default router;