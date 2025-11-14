import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entities/Tenant";
import { TenantPlan } from "../entities/TenantPlan";
import { TenantQuota } from "../entities/TenantQuota";
import { User } from "../entities/User";
import { UserTenant } from "../entities/UserTenant";
import { tenantPlanRepository } from "../repositories/tenantPlanRepository";
import { tenantQuotaRepository } from "../repositories/tenantQuotaRepository";
import { tenantUsageRepository } from "../repositories/tenantUsageRepository";
import { HttpError } from "../middleware/errorHandler";
import { ensureTenantQuota, updateTenantUsageCounts } from "./quotaService";
import { createTenant } from "./tenantService";
import { hashPassword } from "../utils/password";

type AdminTenantSummary = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  plan?: {
    id: string;
    code: string;
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    currency: string;
  } | null;
  quota: {
    billingStatus: TenantQuota["billingStatus"];
    maxProjects: number | null;
    maxDomains: number | null;
    maxMembers: number | null;
    maxOrgAdmins: number | null;
    maxAutomationsPerMonth: number | null;
    trialEndsAt: Date | null;
    currentPeriodEndsAt: Date | null;
    apiKeys?: Record<string, string> | null;
  };
  usage: {
    projectCount: number;
    domainCount: number;
    memberCount: number;
    orgAdminCount: number;
    automationRunsThisMonth: number;
    lastCalculatedAt: Date | null;
  };
};

export const listTenantsForAdmin = async (): Promise<AdminTenantSummary[]> => {
  const tenantRepo = AppDataSource.getRepository(Tenant);
  const tenants = await tenantRepo.find({
    relations: ["quota", "quota.plan", "usage"],
    order: { createdAt: "DESC" },
  });

  return tenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    createdAt: tenant.createdAt,
    plan: tenant.quota?.plan
      ? {
          id: tenant.quota.plan.id,
          code: tenant.quota.plan.code,
          name: tenant.quota.plan.name,
          monthlyPrice: Number(tenant.quota.plan.monthlyPrice),
          annualPrice: Number(tenant.quota.plan.annualPrice),
          currency: tenant.quota.plan.currency,
        }
      : null,
    quota: {
      billingStatus: tenant.quota?.billingStatus ?? "trial",
      maxProjects: tenant.quota?.maxProjects ?? null,
      maxDomains: tenant.quota?.maxDomains ?? null,
      maxMembers: tenant.quota?.maxMembers ?? null,
      maxOrgAdmins: tenant.quota?.maxOrgAdmins ?? null,
      maxAutomationsPerMonth: tenant.quota?.maxAutomationsPerMonth ?? null,
      trialEndsAt: tenant.quota?.trialEndsAt ?? null,
      currentPeriodEndsAt: tenant.quota?.currentPeriodEndsAt ?? null,
      apiKeys: tenant.quota?.apiKeys ?? null,
    },
    usage: {
      projectCount: tenant.usage?.projectCount ?? 0,
      domainCount: tenant.usage?.domainCount ?? 0,
      memberCount: tenant.usage?.memberCount ?? 0,
      orgAdminCount: tenant.usage?.orgAdminCount ?? 0,
      automationRunsThisMonth:
        tenant.usage?.automationRunsThisMonth ?? 0,
      lastCalculatedAt: tenant.usage?.lastCalculatedAt ?? null,
    },
  }));
};

export const getTenantDetailForAdmin = async (
  tenantId: string,
): Promise<AdminTenantSummary & { orgAdmin?: { id: string; email: string } | undefined }> => {
  await updateTenantUsageCounts(tenantId);

  const tenant = await AppDataSource.getRepository(Tenant).findOne({
    where: { id: tenantId },
    relations: ["quota", "quota.plan", "usage", "memberships", "memberships.user"],
  });
  if (!tenant) {
    throw new HttpError(404, "Tenant not found");
  }

  const list = await listTenantsForAdmin();
  const detail = list.find((item) => item.id === tenantId);
  if (!detail) {
    throw new HttpError(500, "Unable to load tenant detail");
  }

  // Find org admin user
  const orgAdminMembership = tenant.memberships?.find(
    (m) => m.role === "org_admin",
  );
  const orgAdmin: { id: string; email: string } | undefined = orgAdminMembership?.user
    ? {
        id: orgAdminMembership.user.id,
        email: orgAdminMembership.user.email,
      }
    : undefined;

  return orgAdmin ? { ...detail, orgAdmin } : detail;
};

type UpdateTenantQuotaPayload = {
  planId?: string | null;
  maxProjects?: number | null;
  maxDomains?: number | null;
  maxMembers?: number | null;
  maxOrgAdmins?: number | null;
  maxAutomationsPerMonth?: number | null;
  featureFlags?: Record<string, boolean> | null;
  billingStatus?: TenantQuota["billingStatus"];
  trialEndsAt?: string | null;
  currentPeriodEndsAt?: string | null;
  notes?: string | null;
};

const parseNullableDate = (value?: string | null) =>
  value ? new Date(value) : null;

export const updateTenantQuota = async (
  tenantId: string,
  payload: UpdateTenantQuotaPayload,
) => {
  const quotaRepo = tenantQuotaRepository();
  const usageRepo = tenantUsageRepository();
  const quota = await quotaRepo.findOne({
    where: { tenant: { id: tenantId } },
    relations: ["tenant", "plan"],
  });
  if (!quota) {
    throw new HttpError(404, "Tenant quota not found");
  }
  const usage = await usageRepo.findOne({
    where: { tenant: { id: tenantId } },
  });
  if (!usage) {
    throw new HttpError(500, "Tenant usage record missing");
  }

  if (payload.planId !== undefined) {
    if (payload.planId === null) {
      quota.plan = null;
    } else {
      const plan = await tenantPlanRepository().findOne({
        where: { id: payload.planId },
      });
      if (!plan) {
        throw new HttpError(404, "Plan not found");
      }
      quota.plan = plan;
    }
  }

  const ensureLimit = (current: number, incoming?: number | null) => {
    if (incoming == null) return;
    if (incoming < current) {
      throw new HttpError(
        400,
        "New quota cannot be lower than current usage",
      );
    }
  };

  ensureLimit(usage.projectCount, payload.maxProjects);
  ensureLimit(usage.domainCount, payload.maxDomains);
  ensureLimit(usage.memberCount, payload.maxMembers);
  ensureLimit(usage.orgAdminCount, payload.maxOrgAdmins);

  if (payload.maxProjects !== undefined) quota.maxProjects = payload.maxProjects;
  if (payload.maxDomains !== undefined) quota.maxDomains = payload.maxDomains;
  if (payload.maxMembers !== undefined) quota.maxMembers = payload.maxMembers;
  if (payload.maxOrgAdmins !== undefined) {
    quota.maxOrgAdmins = payload.maxOrgAdmins;
  }
  if (payload.maxAutomationsPerMonth !== undefined) {
    quota.maxAutomationsPerMonth = payload.maxAutomationsPerMonth;
  }
  if (payload.featureFlags !== undefined) {
    quota.featureFlags = payload.featureFlags;
  }
  if (payload.billingStatus) {
    quota.billingStatus = payload.billingStatus;
  }
  if (payload.trialEndsAt !== undefined) {
    quota.trialEndsAt = parseNullableDate(payload.trialEndsAt);
  }
  if (payload.currentPeriodEndsAt !== undefined) {
    quota.currentPeriodEndsAt = parseNullableDate(payload.currentPeriodEndsAt);
  }
  if (payload.notes !== undefined) {
    quota.notes = payload.notes ?? null;
  }

  await quotaRepo.save(quota);
  return getTenantDetailForAdmin(tenantId);
};

type CreatePlanPayload = {
  code: string;
  name: string;
  description?: string;
  monthlyPrice?: number;
  annualPrice?: number;
  currency?: string;
};

export const createTenantPlan = async (payload: CreatePlanPayload) => {
  const repo = tenantPlanRepository();
  const existing = await repo.findOne({ where: { code: payload.code } });
  if (existing) {
    throw new HttpError(409, "Plan code already exists");
  }

  const plan = repo.create({
    code: payload.code.toLowerCase(),
    name: payload.name,
    description: payload.description?.trim() ?? null,
    monthlyPrice: payload.monthlyPrice ?? 0,
    annualPrice: payload.annualPrice ?? 0,
    currency: payload.currency ?? "USD",
    isActive: true,
  });
  await repo.save(plan);
  return plan;
};

type CreateTenantPayload = {
  tenantName: string;
  orgAdminEmail: string;
  orgAdminPassword: string;
  planId?: string | null;
  initialQuota?: {
    maxProjects?: number | null;
    maxDomains?: number | null;
    maxMembers?: number | null;
    maxOrgAdmins?: number | null;
    maxAutomationsPerMonth?: number | null;
  };
};

export const createTenantForAdmin = async (
  payload: CreateTenantPayload,
): Promise<AdminTenantSummary> => {
  const userRepo = AppDataSource.getRepository(User);
  const membershipRepo = AppDataSource.getRepository(UserTenant);

  const existingUser = await userRepo.findOne({
    where: { email: payload.orgAdminEmail },
  });
  if (existingUser) {
    throw new HttpError(409, "Email already registered");
  }

  const tenant = await createTenant(payload.tenantName);
  const passwordHash = await hashPassword(payload.orgAdminPassword);
  const user = userRepo.create({
    email: payload.orgAdminEmail,
    passwordHash,
  });
  await userRepo.save(user);

  const membership = membershipRepo.create({
    user,
    tenant,
    role: "org_admin",
  });
  await membershipRepo.save(membership);

  const quotaRepo = tenantQuotaRepository();
  const quota = await quotaRepo.findOne({
    where: { tenant: { id: tenant.id } },
    relations: ["plan"],
  });
  if (!quota) {
    throw new HttpError(500, "Failed to initialize tenant quota");
  }

  if (payload.planId) {
    const plan = await tenantPlanRepository().findOne({
      where: { id: payload.planId },
    });
    if (plan) {
      quota.plan = plan;
    }
  }

  if (payload.initialQuota) {
    if (payload.initialQuota.maxProjects !== undefined) {
      quota.maxProjects = payload.initialQuota.maxProjects;
    }
    if (payload.initialQuota.maxDomains !== undefined) {
      quota.maxDomains = payload.initialQuota.maxDomains;
    }
    if (payload.initialQuota.maxMembers !== undefined) {
      quota.maxMembers = payload.initialQuota.maxMembers;
    }
    if (payload.initialQuota.maxOrgAdmins !== undefined) {
      quota.maxOrgAdmins = payload.initialQuota.maxOrgAdmins;
    }
    if (payload.initialQuota.maxAutomationsPerMonth !== undefined) {
      quota.maxAutomationsPerMonth = payload.initialQuota.maxAutomationsPerMonth;
    }
  }

  await quotaRepo.save(quota);

  return getTenantDetailForAdmin(tenant.id);
};

export const updateTenantOrgAdmin = async (
  tenantId: string,
  payload: {
    email?: string;
    password?: string;
  },
) => {
  const tenant = await AppDataSource.getRepository(Tenant).findOne({
    where: { id: tenantId },
    relations: ["memberships", "memberships.user"],
  });

  if (!tenant) {
    throw new HttpError(404, "Tenant not found");
  }

  const orgAdminMembership = tenant.memberships?.find(
    (m) => m.role === "org_admin",
  );

  if (!orgAdminMembership || !orgAdminMembership.user) {
    throw new HttpError(404, "Org admin not found for this tenant");
  }

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { id: orgAdminMembership.user.id },
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  if (payload.email) {
    // Check if email is already taken by another user
    const existingUser = await userRepo.findOne({
      where: { email: payload.email },
    });
    if (existingUser && existingUser.id !== user.id) {
      throw new HttpError(409, "Email already registered");
    }
    user.email = payload.email;
  }

  if (payload.password) {
    user.passwordHash = await hashPassword(payload.password);
  }

  await userRepo.save(user);
  return getTenantDetailForAdmin(tenantId);
};

export const updateTenantApiKeys = async (
  tenantId: string,
  payload: {
    apiKeys?: Record<string, string> | null;
  },
) => {
  const quotaRepo = tenantQuotaRepository();
  const quota = await quotaRepo.findOne({
    where: { tenant: { id: tenantId } },
  });

  if (!quota) {
    throw new HttpError(404, "Tenant quota not found");
  }

  if (payload.apiKeys !== undefined) {
    quota.apiKeys = payload.apiKeys;
  }

  await quotaRepo.save(quota);
  return getTenantDetailForAdmin(tenantId);
};


