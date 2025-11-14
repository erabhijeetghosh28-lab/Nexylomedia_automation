import type { Request, Response, NextFunction } from "express";
import { HttpError } from "./errorHandler";
import {
  findIntegration,
  getIntegrationSecret,
} from "../services/integrationService";
import type { Integration } from "../entities/Integration";

// Extend Express Request to include integration
declare global {
  namespace Express {
    interface Request {
      integration?: Integration;
      integrationSecret?: string;
    }
  }
}

export const requireIntegration = (
  provider: string,
  options?: { allowUserKey?: boolean },
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const allowUserKey = options?.allowUserKey ?? true;

    // Try tenant integration first
    if (req.auth?.tenantId) {
      const tenantIntegration = await findIntegration({
        tenantId: req.auth.tenantId,
        provider,
      });

      if (tenantIntegration) {
        req.integration = tenantIntegration;
        try {
          req.integrationSecret = await getIntegrationSecret(tenantIntegration);
          return next();
        } catch (error) {
          return res.status(500).json({
            error: "Failed to retrieve integration secret",
          });
        }
      }
    }

    // Fallback to user integration if allowed
    if (allowUserKey && req.auth?.userId) {
      const userIntegration = await findIntegration({
        userId: req.auth.userId,
        provider,
      });

      if (userIntegration) {
        req.integration = userIntegration;
        try {
          req.integrationSecret = await getIntegrationSecret(userIntegration);
          return next();
        } catch (error) {
          return res.status(500).json({
            error: "Failed to retrieve integration secret",
          });
        }
      }
    }

    // No integration found
    return res.status(400).json({
      error: `No ${provider} API key configured for this org. Org Admin can add it in Settings → Integrations. You can also add a personal key in Settings → Integrations.`,
      provider,
      helpLink: "/settings/integrations",
    });
  };
};

