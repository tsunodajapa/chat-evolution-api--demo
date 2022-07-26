import { NextFunction, Request, Response } from 'express';
import AppError from "../AppError";

function responseError(error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}

export default responseError;
