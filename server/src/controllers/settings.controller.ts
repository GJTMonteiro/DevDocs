import type { Request, Response } from 'express';

import {
  getUserSettings,
  updateUserSettings,
} from '../services/settings.service.js';

const DEV_USER_ID = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await getUserSettings(DEV_USER_ID);

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Failed to get user settings:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load user settings.',
    });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const {
      theme,
      emailNotifications,
      documentationUpdates,
      mentions,
      aiAssistant,
      contextAwareResponses,
    } = req.body;

    const settings = await updateUserSettings(DEV_USER_ID, {
      theme,
      emailNotifications,
      documentationUpdates,
      mentions,
      aiAssistant,
      contextAwareResponses,
    });

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Failed to update user settings:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update user settings.',
    });
  }
};
