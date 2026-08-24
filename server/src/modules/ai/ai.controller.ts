import type { Request, Response } from 'express';

import {
  askAI,
  type AskAIInput,
} from './ai.service.js';

export const askAIController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { message } = req.body as Partial<AskAIInput>;

    if (typeof message !== 'string') {
      res.status(400).json({
        error: 'Message is required.',
      });

      return;
    }

    const result = await askAI({
      message,
    });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error('AI chat error:', error);

    if (
      error instanceof Error &&
      error.message === 'Message is required.'
    ) {
      res.status(400).json({
        error: error.message,
      });

      return;
    }

    res.status(500).json({
      error: 'Failed to process AI request.',
    });
  }
};