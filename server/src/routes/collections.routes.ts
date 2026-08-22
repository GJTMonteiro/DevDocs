import { Router } from 'express';

import {
  createCollectionController,
  deleteCollectionController,
  getCollectionByIdController,
  getCollectionsController,
  updateCollectionController,
} from '../controllers/collections.controller.js';

const router = Router();

router.get('/', getCollectionsController);

router.get('/:id', getCollectionByIdController);

router.post('/', createCollectionController);

router.put('/:id', updateCollectionController);

router.delete('/:id', deleteCollectionController);

export default router;
