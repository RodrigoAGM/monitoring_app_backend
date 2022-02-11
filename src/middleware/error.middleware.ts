import { NextFunction, Request, Response } from 'express';
import AppError from '../error/app.error';

const handleError = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) => {
  res.status(err.statusCode).send({ success: false, error: err });
};

export default handleError;
