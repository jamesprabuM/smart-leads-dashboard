import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';
import { AppError } from '../utils/AppError';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Not authorized', 401));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError('Forbidden: insufficient permissions', 403));
      return;
    }
    next();
  };
};
