import type { Request, Response, NextFunction } from "express";
import { HttpError } from "./errorHandler";
import { isFeatureEnabled } from "../services/featureService";

export const tenantFeatureGuard = (featureKey: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth?.tenantId) {
      throw new HttpError(400, "Tenant context required for feature check");
    }

    try {
      const enabled = await isFeatureEnabled(req.auth.tenantId, featureKey);
      if (!enabled) {
        return res.status(403).json({
          error: `Feature '${featureKey}' is disabled on your plan. Contact Super Admin or upgrade.`,
          feature: featureKey,
          upgradeLink: "/admin/plans",
        });
      }
      next();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(500, "Failed to check feature status");
    }
  };
};

