import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  createTenantForAdmin,
  createTenantPlan,
  getTenantDetailForAdmin,
  listTenantsForAdmin,
  updateTenantQuota,
  updateTenantOrgAdmin,
  updateTenantApiKeys,
} from "../services/adminTenantService";
import {
  listPlans,
  createPlan,
  updatePlan,
  getPlanByKey,
} from "../services/planService";
import { setFeatureOverride } from "../services/featureService";
import { HttpError } from "../middleware/errorHandler";

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(requireRole("super_admin"));

adminRouter.post("/tenants", async (req, res, next) => {
  try {
    const tenant = await createTenantForAdmin(req.body ?? {});
    res.status(201).json({ tenant });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/tenants", async (_req, res, next) => {
  try {
    const tenants = await listTenantsForAdmin();
    res.json({ tenants });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/tenants/:tenantId", async (req, res, next) => {
  try {
    const tenant = await getTenantDetailForAdmin(req.params.tenantId);
    res.json({ tenant });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch(
  "/tenants/:tenantId/quota",
  async (req, res, next) => {
    try {
      const tenant = await updateTenantQuota(req.params.tenantId, req.body ?? {});
      res.json({ tenant });
    } catch (error) {
      next(error);
    }
  },
);

// Plan management endpoints
adminRouter.get("/plans", async (req, res, next) => {
  try {
    const plans = await listPlans();
    res.json({ plans });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/plans", async (req, res, next) => {
  try {
    // Support both old and new format
    const body = req.body ?? {};
    if (body.code && !body.key) {
      // Old format - use createTenantPlan
      const plan = await createTenantPlan(body);
      res.status(201).json({ plan });
    } else {
      // New format - use createPlan
      const plan = await createPlan(body);
      res.status(201).json({ plan });
    }
  } catch (error) {
    next(error);
  }
});

adminRouter.put("/plans/:key", async (req, res, next) => {
  try {
    const plan = await updatePlan(req.params.key, req.body ?? {});
    res.json({ plan });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/plans/:key", async (req, res, next) => {
  try {
    const plan = await getPlanByKey(req.params.key);
    res.json({ plan });
  } catch (error) {
    next(error);
  }
});

// Feature override endpoint
adminRouter.post(
  "/tenants/:tenantId/feature-override",
  async (req, res, next) => {
    try {
      if (!req.auth?.userId) {
        throw new HttpError(401, "Unauthorized");
      }

      const { featureKey, enabled, reason } = req.body;

      if (!featureKey || typeof enabled !== "boolean") {
        throw new HttpError(400, "featureKey and enabled (boolean) are required");
      }

      await setFeatureOverride(
        req.params.tenantId,
        featureKey,
        enabled,
        req.auth.userId,
        reason,
      );

      res.json({
        message: `Feature '${featureKey}' ${enabled ? "enabled" : "disabled"} for tenant`,
        tenantId: req.params.tenantId,
        featureKey,
        enabled,
      });
    } catch (error) {
      next(error);
    }
  },
);

adminRouter.patch(
  "/tenants/:tenantId/org-admin",
  async (req, res, next) => {
    try {
      const tenant = await updateTenantOrgAdmin(req.params.tenantId, req.body ?? {});
      res.json({ tenant });
    } catch (error) {
      next(error);
    }
  },
);

adminRouter.patch(
  "/tenants/:tenantId/api-keys",
  async (req, res, next) => {
    try {
      const tenant = await updateTenantApiKeys(req.params.tenantId, req.body ?? {});
      res.json({ tenant });
    } catch (error) {
      next(error);
    }
  },
);


