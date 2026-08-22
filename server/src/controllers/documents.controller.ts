import type { Request, Response } from 'express';

import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  getDocumentStats,
  toggleDocumentFavorite,
  updateDocument,
} from '../services/documents.service.js';

export const createDocumentController = async (req: Request, res: Response) => {
  const { title, content, collectionId, category, visibility, createdBy } =
    req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      error: 'Title is required.',
    });
  }

  if (!content || typeof content !== 'string') {
    return res.status(400).json({
      error: 'Content is required.',
    });
  }

  if (!createdBy || typeof createdBy !== 'string') {
    return res.status(400).json({
      error: 'createdBy is required.',
    });
  }

  if (
    visibility !== undefined &&
    visibility !== 'workspace' &&
    visibility !== 'private'
  ) {
    return res.status(400).json({
      error: 'Invalid visibility.',
    });
  }

  if (
    collectionId !== undefined &&
    collectionId !== null &&
    (!Number.isInteger(collectionId) || collectionId < 1)
  ) {
    return res.status(400).json({
      error: 'Invalid collectionId.',
    });
  }

  const document = await createDocument({
    title: title.trim(),
    content,
    collectionId: collectionId ?? null,
    category:
      typeof category === 'string' && category.trim() ? category.trim() : null,
    visibility: visibility ?? 'workspace',
    createdBy,
  });

  return res.status(201).json({
    data: document,
  });
};

export const getDocumentsController = async (req: Request, res: Response) => {
  const userId =
    typeof req.query.userId === 'string' ? req.query.userId : undefined;

  const documents = await getDocuments(userId);

  return res.status(200).json({
    data: documents,
  });
};

export const getDocumentByIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  if (typeof id !== 'string' || Array.isArray(id)) {
    return res.status(400).json({
      error: 'Invalid document id.',
    });
  }

  const userId =
    typeof req.query.userId === 'string' ? req.query.userId : undefined;

  const document = await getDocumentById(id, userId);

  if (!document) {
    return res.status(404).json({
      error: 'Document not found.',
    });
  }

  return res.status(200).json({
    data: document,
  });
};

export const getDocumentStatsController = async (
  _req: Request,
  res: Response,
) => {
  const stats = await getDocumentStats();

  return res.status(200).json({
    data: stats,
  });
};

export const toggleDocumentFavoriteController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  if (typeof id !== 'string' || Array.isArray(id)) {
    return res.status(400).json({
      error: 'Invalid document id.',
    });
  }

  const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';

  if (!userId) {
    return res.status(400).json({
      error: 'userId is required.',
    });
  }

  const result = await toggleDocumentFavorite(id, userId);

  return res.status(200).json({
    data: result,
  });
};

export const updateDocumentController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string' || Array.isArray(id)) {
    return res.status(400).json({
      error: 'Invalid document id.',
    });
  }

  const { title, content, collectionId, category, visibility, status } =
    req.body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({
      error: 'Invalid title.',
    });
  }

  if (
    content !== undefined &&
    (typeof content !== 'string' || !content.trim())
  ) {
    return res.status(400).json({
      error: 'Invalid content.',
    });
  }

  if (
    visibility !== undefined &&
    visibility !== 'workspace' &&
    visibility !== 'private'
  ) {
    return res.status(400).json({
      error: 'Invalid visibility.',
    });
  }

  if (
    status !== undefined &&
    status !== 'draft' &&
    status !== 'published' &&
    status !== 'archived'
  ) {
    return res.status(400).json({
      error: 'Invalid status.',
    });
  }

  if (
    collectionId !== undefined &&
    collectionId !== null &&
    (!Number.isInteger(collectionId) || collectionId < 1)
  ) {
    return res.status(400).json({
      error: 'Invalid collectionId.',
    });
  }

  const document = await updateDocument(id, {
    ...(title !== undefined && {
      title: title.trim(),
    }),

    ...(content !== undefined && {
      content,
    }),

    ...(collectionId !== undefined && {
      collectionId,
    }),

    ...(category !== undefined && {
      category:
        typeof category === 'string' && category.trim()
          ? category.trim()
          : null,
    }),

    ...(visibility !== undefined && {
      visibility,
    }),

    ...(status !== undefined && {
      status,
    }),
  });

  if (!document) {
    return res.status(404).json({
      error: 'Document not found.',
    });
  }

  return res.status(200).json({
    data: document,
  });
};

export const deleteDocumentController = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== 'string' || Array.isArray(id)) {
    return res.status(400).json({
      error: 'Invalid document id.',
    });
  }

  const document = await deleteDocument(id);

  if (!document) {
    return res.status(404).json({
      error: 'Document not found.',
    });
  }

  return res.status(204).send();
};
