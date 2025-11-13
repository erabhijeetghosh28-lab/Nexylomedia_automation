import type { Request, Response, NextFunction } from "express";
import { HttpError } from "./errorHandler";
import { membershipRepository } from "../repositories/membershipRepository";

export const requireTenantContext = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.auth?.userId) {
    throw new HttpError(401, "Unauthorized");
  }

  if (req.auth.tenantId) {
    return next();
  }

  const membership = await membershipRepository().findOne({
    where: { user: { id: req.auth.userId } },
    relations: ["tenant"],
  });

  if (!membership) {
    throw new HttpError(403, "No tenant access");
  }

  req.auth = {
    ...req.auth,
    tenantId: membership.tenant.id,
    role: membership.role,
  };
  next();
};

