import type { Request, Response } from 'express';

import {
  getUserSettings,
  updateUserSettings,
} from '../services/settings.service.js';

const DEV_USER_ID =
  '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

export const getSettings = async (
  _req: Request,
  res: Response,
) => {
  const settings =
    await getUserSettings(DEV_USER_ID);

  res.status(200).json({
    success: true,
    data: settings,
  });
};

export const updateSettings = async (
  req: Request,
  res: Response,
) => {
  const settings =
    await updateUserSettings(
      DEV_USER_ID,
      req.body,
    );

  res.status(200).json({
    success: true,
    data: settings,
  });
};