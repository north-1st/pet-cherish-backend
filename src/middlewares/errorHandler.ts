import { ErrorRequestHandler } from 'express';
import { isHttpError } from 'http-errors';

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let errorMessage = 'An unknown error occurred';
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({
    status: false,
    message: errorMessage,
  });
};

export default errorHandler;
