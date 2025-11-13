import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import { HttpError } from "./errorHandler";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Missing authorization header");
  }

  try {
    const token = header.substring("Bearer ".length);
    req.auth = verifyToken(token);
    next();
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }
};

export const requireRole =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) throw new HttpError(401, "Unauthorized");
    if (roles.length && !roles.includes(req.auth.role ?? "")) {
      throw new HttpError(403, "Forbidden");
    }
    next();
  };

