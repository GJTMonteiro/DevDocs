import cors from 'cors';
import express from 'express';

import routes from './routes/index.js';

import healthRoutes from './routes/health.routes.js';

import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json({ limit: '2mb' }));

app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    name: 'DevDocs API',
    status: 'ok',
  });
});

app.use('/api', routes);

app.use('/health', healthRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;