export default class AppError extends Error {
  statusCode: number;

  errorCode: number | undefined;

  constructor(data: { message?: string, errorCode?: number, statusCode?: number }) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = data.message || 'Internal Server Error';
    this.statusCode = data.statusCode || 500;
    this.errorCode = data.errorCode;
  }
}
