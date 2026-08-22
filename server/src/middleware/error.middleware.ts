import type {
  ErrorRequestHandler,
} from 'express';

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  console.error(error);

  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    error: 'Internal server error.',
  });
};