import type { Request, Response } from 'express';

import {
  getUserProfile,
  updateUserProfile,
} from '../services/profile.service.js';

const DEV_USER_ID = '00ad7e9c-46c4-4657-aaf3-2749c7d9549d';

export const getProfile = async (_req: Request, res: Response) => {
  try {
    const profile = await getUserProfile(DEV_USER_ID);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Failed to load profile:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load profile.',
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Name is required.',
      });

      return;
    }

    if (typeof email !== 'string' || !email.trim()) {
      res.status(400).json({
        success: false,
        message: 'Email is required.',
      });

      return;
    }

    if (typeof role !== 'string' || !role.trim()) {
      res.status(400).json({
        success: false,
        message: 'Role is required.',
      });

      return;
    }

    const profile = await updateUserProfile(DEV_USER_ID, {
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
    });

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Failed to update profile:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
};
