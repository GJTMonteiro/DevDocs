import { eq } from 'drizzle-orm';

import { db } from '../config/database.js';

import { users } from '../db/schema/users.js';

interface UpdateUserProfileInput {
  name: string;
  email: string;
  role: string;
}

export const getUserProfile = async (userId: string) => {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateUserProfileInput,
) => {
  const [updatedUser] = await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      role: data.role,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  if (!updatedUser) {
    throw new Error('User not found.');
  }

  return updatedUser;
};
