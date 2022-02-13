import { Role } from '.prisma/client';
import { Request, Response, NextFunction } from 'express';
import AppError from '../error/app.error';

export function authenticateRole(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokenRequest = req;

    if (roles.indexOf(tokenRequest.user.role) === -1) {
      const error = {
        success: false,
        error: new AppError({ message: 'No tienes permisos para realizar esta acción.', statusCode: 403 }),
      };
      return res.status(403).send(error);
    }

    next();
  };
}
