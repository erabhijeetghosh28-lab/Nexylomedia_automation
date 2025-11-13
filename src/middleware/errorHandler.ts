import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new HttpError(404, `Route ${req.method} ${req.path} not found`);
  next(error);
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const status = err instanceof HttpError ? err.status : 500;
  const message =
    err instanceof HttpError ? err.message : "Internal server error";

  logger.error("Request failed %s %s -> %d %s", req.method, req.path, status, message, {
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(status).json({
    error: {
      message,
    },
  });
};

