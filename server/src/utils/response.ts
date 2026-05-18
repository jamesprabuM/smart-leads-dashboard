import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  meta?: PaginationMeta
): void => {
  const body: ApiResponse<T> = { success: true, message, data, meta };
  res.status(statusCode).json(body);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: { field: string; message: string }[]
): void => {
  const body: ApiResponse = { success: false, message, errors };
  res.status(statusCode).json(body);
};
