import { ErrorRequestHandler, RequestHandler } from 'express';
import createHttpError, { isHttpError } from 'http-errors';

export const errorHandler: ErrorRequestHandler = (error, req, res) => {
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

export const notFoundHandler: RequestHandler = (req, res, next) => {
  next(createHttpError(404, 'Endpoint not found'));
};
