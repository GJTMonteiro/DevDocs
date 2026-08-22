import type { Request, Response } from 'express';

import {
  createCollection,
  deleteCollection,
  getCollectionById,
  getCollections,
  updateCollection,
} from '../services/collections.service.js';

const VALID_COLORS = ['blue', 'purple', 'green', 'yellow'] as const;

type CollectionColor = (typeof VALID_COLORS)[number];

export const getCollectionsController = async (req: Request, res: Response) => {
  const userId =
    typeof req.query.userId === 'string' ? req.query.userId : undefined;

  const search =
    typeof req.query.search === 'string' ? req.query.search : undefined;

  const result = await getCollections(userId, search);

  return res.status(200).json({
    data: result,
  });
};

export const getCollectionByIdController = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: 'Invalid collection id.',
    });
  }

  const collection = await getCollectionById(id);

  if (!collection) {
    return res.status(404).json({
      error: 'Collection not found.',
    });
  }

  return res.status(200).json({
    data: collection,
  });
};

export const createCollectionController = async (
  req: Request,
  res: Response,
) => {
  const { name, description, color, createdBy } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      error: 'Name is required.',
    });
  }

  if (!createdBy || typeof createdBy !== 'string') {
    return res.status(400).json({
      error: 'createdBy is required.',
    });
  }

  if (color !== undefined && !VALID_COLORS.includes(color as CollectionColor)) {
    return res.status(400).json({
      error: 'Invalid collection color.',
    });
  }

  const collection = await createCollection({
    name: name.trim(),

    description:
      typeof description === 'string' && description.trim()
        ? description.trim()
        : null,

    color: color as CollectionColor | undefined,

    createdBy,
  });

  return res.status(201).json({
    data: collection,
  });
};

export const updateCollectionController = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: 'Invalid collection id.',
    });
  }

  const { name, description, color } = req.body;

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return res.status(400).json({
      error: 'Invalid collection name.',
    });
  }

  if (color !== undefined && !VALID_COLORS.includes(color as CollectionColor)) {
    return res.status(400).json({
      error: 'Invalid collection color.',
    });
  }

  const collection = await updateCollection(id, {
    ...(name !== undefined && {
      name: name.trim(),
    }),

    ...(description !== undefined && {
      description:
        typeof description === 'string' && description.trim()
          ? description.trim()
          : null,
    }),

    ...(color !== undefined && {
      color: color as CollectionColor,
    }),
  });

  if (!collection) {
    return res.status(404).json({
      error: 'Collection not found.',
    });
  }

  return res.status(200).json({
    data: collection,
  });
};

export const deleteCollectionController = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: 'Invalid collection id.',
    });
  }

  const collection = await deleteCollection(id);

  if (!collection) {
    return res.status(404).json({
      error: 'Collection not found.',
    });
  }

  return res.status(204).send();
};
