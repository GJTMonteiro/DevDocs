import { Router } from 'express';

import {
  createDocumentController,
  deleteAllDocumentsController,
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

/*
 * DELETE ALL DOCUMENTS
 * Must be before /:id
 */
router.delete('/', deleteAllDocumentsController);

router.delete('/:id', deleteDocumentController);

router.get('/:id', getDocumentByIdController);

export default router;
