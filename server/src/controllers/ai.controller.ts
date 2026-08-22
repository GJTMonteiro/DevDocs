import type { Request, Response } from 'express';

import { askAI } from '../modules/ai/ai.service.js';

export const askAIController = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      error: 'Message is required.',
    });
  }

  const result = await askAI({
    message,
  });

  return res.status(200).json({
    data: result,
  });
};
