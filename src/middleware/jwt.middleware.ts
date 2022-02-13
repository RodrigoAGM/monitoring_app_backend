import { Response, NextFunction } from 'express';
import AppError from '../error/app.error';
import { tokenManager } from '../utils/token.manager';

export async function authenticateToken(req: any, res: Response, next: NextFunction) {
  // Get current value from authorization header
  const authHeader = req.headers.authorization;

  // Validate that auth header has a value
  if (authHeader === undefined) {
    const message = 'No se ha proporcionado un token de autenticación.';
    return res.status(401).send({
      success: false,
      error: new AppError({ message, statusCode: 401 }),
    });
  }

  // Split the auth header to verify both parts
  const authSplit = authHeader.split(' ');

  // Check if the first part is te Bearer validator
  if (authSplit[0] !== 'Bearer') {
    const message = 'No se ha proporcionado un token de autenticación.';
    return res.status(401).send({
      success: false,
      error: new AppError({ message, statusCode: 401 }),
    });
  }

  // Assign second part to token variable
  const token = authSplit[1];

  try {
    // If token is valid, assign payload to request user
    req.user = await tokenManager.verifyToken(token);
    // Continue with request
    next();
  } catch (error) {
    // Token is not valid
    const message = 'El token de autenticación es inválido.';
    return res.status(401).send({
      success: false,
      error: new AppError({ message, statusCode: 401 }),
    });
  }
}
