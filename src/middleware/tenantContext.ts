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

  // Individual users may have tenantId: null
  if (req.auth.tenantId !== undefined) {
    // tenantId can be null for individual users
    if (req.auth.role === "individual" && req.auth.tenantId === null) {
      return next(); // Allow individual users without tenant
    }
    if (req.auth.tenantId) {
      return next();
    }
  }

  const membership = await membershipRepository().findOne({
    where: { user: { id: req.auth.userId } },
    relations: ["tenant", "tenant.plan"],
  });

  if (!membership) {
    // Individual users might not have membership
    if (req.auth.role === "individual") {
      req.auth.tenantId = null;
      return next();
    }
    throw new HttpError(403, "No tenant access");
  }

  if (req.auth) {
    req.auth.tenantId = membership.tenant?.id ?? null;
    req.auth.role = membership.role;
  }
  next();
};

