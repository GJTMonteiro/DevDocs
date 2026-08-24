import { Router } from 'express';

import { askAIController } from '../modules/ai/ai.controller.js';

const router = Router();

router.post('/chat', askAIController);

export default router;
