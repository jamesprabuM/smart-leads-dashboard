import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Validation failed', 400, errors);
    return;
  }

  if (err.name === 'CastError') {
    sendError(res, 'Invalid resource ID', 400);
    return;
  }

  if ((err as { code?: number }).code === 11000) {
    sendError(res, 'Duplicate field value', 409);
    return;
  }

  console.error(err);
  sendError(res, 'Internal server error', 500);
};
