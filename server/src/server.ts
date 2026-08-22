import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(`DevDocs API running on http://localhost:${env.port}`);
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down...`);

  server.close(() => {
    console.log('DevDocs API stopped.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));