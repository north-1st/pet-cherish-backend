import { ErrorRequestHandler, RequestHandler } from 'express';
import { isHttpError } from 'http-errors';

interface ErrorResponse {
  status: boolean;
  message: string;
  stack?: string;
}

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let errorMessage = 'An unknown error occurred';
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  const response: ErrorResponse = {
    status: false,
    message: errorMessage,
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    status: false,
    message: `That route does not exist - ${req.originalUrl}`,
  });
};
