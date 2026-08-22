import { Router } from 'express';

import {
  createDocumentController,
  deleteDocumentController,
  getDocumentByIdController,
  getDocumentStatsController,
  getDocumentsController,
  toggleDocumentFavoriteController,
  updateDocumentController,
} from '../controllers/documents.controller.js';

const router = Router();

router.post('/', createDocumentController);

router.get('/stats', getDocumentStatsController);

router.get('/', getDocumentsController);

router.post('/:id/favorite', toggleDocumentFavoriteController);

router.put('/:id', updateDocumentController);

router.delete('/:id', deleteDocumentController);

router.get('/:id', getDocumentByIdController);

export default router;
