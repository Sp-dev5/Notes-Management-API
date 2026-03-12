import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError, errorResponse } from '../utils/errors.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((error) => ({
      path: error.path.join('.'),
      message: error.message,
    }));

    return res.status(400).json(
      errorResponse(400, 'Validation failed', formattedErrors)
    );
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      errorResponse(err.statusCode, err.message, err.errors)
    );
  }

  if (err.code === 'P2002') {
    return res.status(409).json(
      errorResponse(409, 'Resource already exists')
    );
  }

  return res.status(500).json(
    errorResponse(
      500,
      'Internal server error',
      process.env.NODE_ENV === 'development' ? [err.message] : undefined
    )
  );
}
