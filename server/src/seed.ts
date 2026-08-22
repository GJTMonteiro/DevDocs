import { db } from './config/database.js';
import { users } from './db/schema/users.js';

const seed = async () => {
  const existingUsers = await db
    .select()
    .from(users)
    .limit(1);

  if (existingUsers.length > 0) {
    console.log('Development user already exists.');
    return;
  }

  const [user] = await db
    .insert(users)
    .values({
      name: 'DevDocs Developer',
      email: 'developer@devdocs.local',
    })
    .returning();

  console.log('Development user created:');
  console.log(user);
};

try {
  await seed();
  process.exit(0);
} catch (error) {
  console.error('Failed to seed database:');
  console.error(error);
  process.exit(1);
}