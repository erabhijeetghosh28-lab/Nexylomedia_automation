import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entities/Tenant";
import { HttpError } from "../middleware/errorHandler";
import { getPlanByKey } from "./planService";
import { usageService } from "./usageService";

// Import usageService after it's defined

export type FeatureStatus = {
  enabled: boolean;
  source: "plan" | "override" | null;
  quotaLeft?: number;
};

export const isFeatureEnabled = async (
  tenantId: string,
  featureKey: string,
): Promise<boolean> => {
  const status = await getFeatureStatus(tenantId, featureKey);
  return status.enabled;
};

export const getFeatureSource = async (
  tenantId: string,
  featureKey: string,
): Promise<"plan" | "override" | null> => {
  const status = await getFeatureStatus(tenantId, featureKey);
  return status.source;
};

export const getFeatureStatus = async (
  tenantId: string,
  featureKey: string,
): Promise<FeatureStatus> => {
  const tenantRepo = AppDataSource.getRepository(Tenant);
  const tenant = await tenantRepo.findOne({
    where: { id: tenantId },
    relations: ["plan"],
  });

  if (!tenant) {
    throw new HttpError(404, "Tenant not found");
  }

  // Check tenant override first
  if (tenant.featuresJson && featureKey in tenant.featuresJson) {
    const enabled = tenant.featuresJson[featureKey] === true;
    return {
      enabled,
      source: "override",
    };
  }

  // Check plan default
  if (tenant.planKey && tenant.plan) {
    const plan = tenant.plan;
    const planAllowed = plan.allowedFeatures?.[featureKey] === true;

    // Check quota if feature is enabled
    let quotaLeft: number | undefined;
    if (planAllowed && plan.quotas) {
      // Try to find quota metric for this feature
      const quotaKey = `${featureKey}_runs_month`; // e.g., "seo_runs_month"
      const quotaLimit = plan.quotas[quotaKey];
      if (quotaLimit !== undefined) {
        const usage = await usageService.getUsage(
          tenantId,
          quotaKey,
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        );
        quotaLeft = Math.max(0, quotaLimit - usage);
      }
    }

    return {
      enabled: planAllowed,
      source: "plan",
      ...(quotaLeft !== undefined ? { quotaLeft } : {}),
    };
  }

  // No plan assigned - feature disabled
  return {
    enabled: false,
    source: null,
  };
};

export const setFeatureOverride = async (
  tenantId: string,
  featureKey: string,
  enabled: boolean,
  userId: string,
  reason?: string,
): Promise<void> => {
  const tenantRepo = AppDataSource.getRepository(Tenant);
  const auditRepo = AppDataSource.getRepository(
    (await import("../entities/FeatureFlagAudit")).FeatureFlagAudit,
  );

  const tenant = await tenantRepo.findOne({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new HttpError(404, "Tenant not found");
  }

  // Update features_json
  const featuresJson = tenant.featuresJson ?? {};
  featuresJson[featureKey] = enabled;
  tenant.featuresJson = featuresJson;
  await tenantRepo.save(tenant);

  // Audit log
  const audit = auditRepo.create({
    tenant,
    flagKey: featureKey,
    enabledBy: { id: userId } as any,
    enabledAt: new Date(),
    reason: reason ?? null,
  });
  await auditRepo.save(audit);
};

