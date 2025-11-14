import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entities/Tenant";
import { TenantQuota } from "../entities/TenantQuota";
import { TenantUsage } from "../entities/TenantUsage";
import { tenantQuotaRepository } from "../repositories/tenantQuotaRepository";
import { tenantUsageRepository } from "../repositories/tenantUsageRepository";
import { HttpError } from "../middleware/errorHandler";

export const DEFAULT_BILLING_STATUS: TenantQuota["billingStatus"] = "trial";

export type QuotaCheckType = "project" | "domain" | "maxMembers" | "maxOrgAdmins";

export const ensureTenantQuota = async (
  tenantId: string,
): Promise<{ quota: TenantQuota; usage: TenantUsage }> => {
  const quotaRepo = tenantQuotaRepository();
  const usageRepo = tenantUsageRepository();

  const quota = await quotaRepo.findOne({
    where: { tenant: { id: tenantId } },
    relations: ["plan"],
  });
  const usage = await usageRepo.findOne({
    where: { tenant: { id: tenantId } },
  });

  if (!quota || !usage) {
    throw new HttpError(500, "Tenant quota configuration not found");
  }

  return { quota, usage };
};

const hasCapacity = (current: number, max?: number | null) =>
  max == null || current < max;

export const ensureCapacityOrThrow = async (
  tenantId: string,
  type: QuotaCheckType,
) => {
  const { quota, usage } = await ensureTenantQuota(tenantId);

  if (quota.billingStatus === "suspended") {
    throw new HttpError(
      403,
      "Tenant is suspended. Please update billing to continue.",
    );
  }

  switch (type) {
    case "project":
      if (!hasCapacity(usage.projectCount, quota.maxProjects)) {
        throw new HttpError(
          402,
          "Project limit reached. Please upgrade your plan or contact support.",
        );
      }
      break;
    case "domain":
      if (!hasCapacity(usage.domainCount, quota.maxDomains)) {
        throw new HttpError(
          402,
          "Domain limit reached. Please upgrade your plan or contact support.",
        );
      }
      break;
    case "maxMembers":
      if (!hasCapacity(usage.memberCount, quota.maxMembers)) {
        throw new HttpError(
          402,
          "Member limit reached. Please upgrade your plan or contact support.",
        );
      }
      break;
    case "maxOrgAdmins":
      if (!hasCapacity(usage.orgAdminCount, quota.maxOrgAdmins)) {
        throw new HttpError(
          402,
          "Org admin limit reached. Please upgrade your plan or contact support.",
        );
      }
      break;
    default:
      throw new HttpError(500, "Unsupported quota check");
  }
};

export const incrementUsage = async (
  tenantId: string,
  delta: Partial<Pick<TenantUsage, "projectCount" | "domainCount">>,
) => {
  const usageRepo = tenantUsageRepository();
  const usage = await usageRepo.findOne({
    where: { tenant: { id: tenantId } },
  });
  if (!usage) {
    throw new HttpError(500, "Tenant usage record missing");
  }

  if (delta.projectCount) {
    usage.projectCount += delta.projectCount;
  }
  if (delta.domainCount) {
    usage.domainCount += delta.domainCount;
  }
  usage.lastCalculatedAt = new Date();
  await usageRepo.save(usage);
};

export const decrementUsage = async (
  tenantId: string,
  delta: Partial<Pick<TenantUsage, "projectCount" | "domainCount">>,
) => {
  const usageRepo = tenantUsageRepository();
  const usage = await usageRepo.findOne({
    where: { tenant: { id: tenantId } },
  });
  if (!usage) {
    throw new HttpError(500, "Tenant usage record missing");
  }

  if (delta.projectCount) {
    usage.projectCount = Math.max(0, usage.projectCount - delta.projectCount);
  }
  if (delta.domainCount) {
    usage.domainCount = Math.max(0, usage.domainCount - delta.domainCount);
  }
  usage.lastCalculatedAt = new Date();
  await usageRepo.save(usage);
};

export const ensureQuotaAndUsage = async (tenant: Tenant) => {
  const quotaRepo = tenantQuotaRepository();
  const usageRepo = tenantUsageRepository();
  const existingQuota = await quotaRepo.findOne({
    where: { tenant: { id: tenant.id } },
  });
  const existingUsage = await usageRepo.findOne({
    where: { tenant: { id: tenant.id } },
  });

  if (!existingQuota) {
    const quota = quotaRepo.create({
      tenant,
      billingStatus: DEFAULT_BILLING_STATUS,
    });
    await quotaRepo.save(quota);
  }

  if (!existingUsage) {
    const usage = usageRepo.create({
      tenant,
      projectCount: 0,
      domainCount: 0,
      memberCount: 0,
      orgAdminCount: 0,
      automationRunsThisMonth: 0,
      lastCalculatedAt: new Date(),
    });
    await usageRepo.save(usage);
  }
};

export const updateTenantUsageCounts = async (tenantId: string) => {
  const tenant = await AppDataSource.getRepository(Tenant).findOne({
    where: { id: tenantId },
    relations: ["projects", "projects.domains", "memberships", "memberships.user"],
  });
  if (!tenant) return;

  const usageRepo = tenantUsageRepository();
  const usage = await usageRepo.findOne({
    where: { tenant: { id: tenantId } },
  });
  if (!usage) return;

  usage.projectCount = tenant.projects?.length ?? 0;
  usage.domainCount =
    tenant.projects?.reduce(
      (total, project) => total + (project.domains?.length ?? 0),
      0,
    ) ?? 0;
  usage.memberCount =
    tenant.memberships?.filter((membership) => membership.role === "member")
      ?.length ?? 0;
  usage.orgAdminCount =
    tenant.memberships?.filter((membership) => membership.role === "org_admin")
      ?.length ?? 0;
  usage.lastCalculatedAt = new Date();

  await usageRepo.save(usage);
};


