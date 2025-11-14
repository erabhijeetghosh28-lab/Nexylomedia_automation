import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireTenantContext } from "../middleware/tenantContext";
import { requireRole } from "../middleware/auth";
import { usageService } from "../services/usageService";
import { getFeatureStatus } from "../services/featureService";
import { HttpError } from "../middleware/errorHandler";

export const usageRouter = Router();

usageRouter.use(requireAuth);
usageRouter.use(requireTenantContext);

// GET /api/usage?tenantId= - Get usage for tenant
usageRouter.get("/", async (req, res, next) => {
  try {
    const tenantId = (req.query.tenantId as string) || req.auth?.tenantId;

    if (!tenantId) {
      throw new HttpError(400, "tenantId is required");
    }

    // Check permissions - only org_admin, super_admin, or own tenant
    if (
      req.auth?.role !== "super_admin" &&
      req.auth?.tenantId !== tenantId
    ) {
      throw new HttpError(403, "Cannot view usage for another tenant");
    }

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const usage = await usageService.getUsageForPeriod(
      tenantId,
      periodStart,
      periodEnd,
    );

    res.json({
      tenantId,
      period: {
        start: periodStart,
        end: periodEnd,
      },
      usage,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/feature-status/:featureKey?tenantId= - Get feature status
usageRouter.get("/feature-status/:featureKey", async (req, res, next) => {
  try {
    const featureKey = req.params.featureKey;
    const tenantId = (req.query.tenantId as string) || req.auth?.tenantId;

    if (!tenantId) {
      throw new HttpError(400, "tenantId is required");
    }

    // Check permissions
    if (
      req.auth?.role !== "super_admin" &&
      req.auth?.tenantId !== tenantId
    ) {
      throw new HttpError(403, "Cannot view feature status for another tenant");
    }

    const status = await getFeatureStatus(tenantId, featureKey);

    res.json({
      featureKey,
      tenantId,
      ...status,
    });
  } catch (error) {
    next(error);
  }
});

