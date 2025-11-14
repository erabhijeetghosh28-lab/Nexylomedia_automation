import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireTenantContext } from "../middleware/tenantContext";
import { requireRole } from "../middleware/auth";
import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entities/Tenant";
import { getFeatureStatus } from "../services/featureService";
import { HttpError } from "../middleware/errorHandler";

export const tenantRouter = Router();

tenantRouter.use(requireAuth);
tenantRouter.use(requireTenantContext);

// GET /api/tenant - View current tenant plan & features
tenantRouter.get("/", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId) {
      throw new HttpError(400, "Tenant context missing");
    }

    const tenantRepo = AppDataSource.getRepository(Tenant);
    const tenant = await tenantRepo.findOne({
      where: { id: req.auth.tenantId },
      relations: ["plan", "quota", "usage"],
    });

    if (!tenant) {
      throw new HttpError(404, "Tenant not found");
    }

    res.json({
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        planKey: tenant.planKey,
        plan: tenant.plan
          ? {
              key: tenant.plan.key,
              name: tenant.plan.name,
              allowedFeatures: tenant.plan.allowedFeatures,
              quotas: tenant.plan.quotas,
            }
          : null,
        featuresJson: tenant.featuresJson,
        quota: tenant.quota
          ? {
              maxProjects: tenant.quota.maxProjects,
              maxDomains: tenant.quota.maxDomains,
              maxMembers: tenant.quota.maxMembers,
              maxOrgAdmins: tenant.quota.maxOrgAdmins,
              maxAutomationsPerMonth: tenant.quota.maxAutomationsPerMonth,
              billingStatus: tenant.quota.billingStatus,
            }
          : null,
        usage: tenant.usage
          ? {
              projectCount: tenant.usage.projectCount,
              domainCount: tenant.usage.domainCount,
              memberCount: tenant.usage.memberCount,
              orgAdminCount: tenant.usage.orgAdminCount,
              automationRunsThisMonth: tenant.usage.automationRunsThisMonth,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/tenant/plan - Request plan change (org admin only)
tenantRouter.put(
  "/plan",
  requireRole("org_admin", "super_admin"),
  async (req, res, next) => {
    try {
      if (!req.auth?.tenantId) {
        throw new HttpError(400, "Tenant context missing");
      }

      const { planKey } = req.body;

      if (!planKey) {
        throw new HttpError(400, "planKey is required");
      }

      const tenantRepo = AppDataSource.getRepository(Tenant);
      const tenant = await tenantRepo.findOne({
        where: { id: req.auth.tenantId },
      });

      if (!tenant) {
        throw new HttpError(404, "Tenant not found");
      }

      // Verify plan exists
      const { getPlanByKey } = await import("../services/planService");
      await getPlanByKey(planKey);

      tenant.planKey = planKey;
      await tenantRepo.save(tenant);

      res.json({
        message: "Plan change requested. Super Admin approval may be required.",
        tenant: {
          id: tenant.id,
          planKey: tenant.planKey,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

