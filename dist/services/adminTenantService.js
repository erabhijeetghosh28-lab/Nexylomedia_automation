"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTenantApiKeys = exports.updateTenantOrgAdmin = exports.createTenantForAdmin = exports.createTenantPlan = exports.updateTenantQuota = exports.getTenantDetailForAdmin = exports.listTenantsForAdmin = void 0;
const data_source_1 = require("../config/data-source");
const Tenant_1 = require("../entities/Tenant");
const User_1 = require("../entities/User");
const UserTenant_1 = require("../entities/UserTenant");
const tenantPlanRepository_1 = require("../repositories/tenantPlanRepository");
const tenantQuotaRepository_1 = require("../repositories/tenantQuotaRepository");
const tenantUsageRepository_1 = require("../repositories/tenantUsageRepository");
const errorHandler_1 = require("../middleware/errorHandler");
const quotaService_1 = require("./quotaService");
const tenantService_1 = require("./tenantService");
const password_1 = require("../utils/password");
const listTenantsForAdmin = async () => {
    const tenantRepo = data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
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
            automationRunsThisMonth: tenant.usage?.automationRunsThisMonth ?? 0,
            lastCalculatedAt: tenant.usage?.lastCalculatedAt ?? null,
        },
    }));
};
exports.listTenantsForAdmin = listTenantsForAdmin;
const getTenantDetailForAdmin = async (tenantId) => {
    await (0, quotaService_1.updateTenantUsageCounts)(tenantId);
    const tenant = await data_source_1.AppDataSource.getRepository(Tenant_1.Tenant).findOne({
        where: { id: tenantId },
        relations: ["quota", "quota.plan", "usage", "memberships", "memberships.user"],
    });
    if (!tenant) {
        throw new errorHandler_1.HttpError(404, "Tenant not found");
    }
    const list = await (0, exports.listTenantsForAdmin)();
    const detail = list.find((item) => item.id === tenantId);
    if (!detail) {
        throw new errorHandler_1.HttpError(500, "Unable to load tenant detail");
    }
    // Find org admin user
    const orgAdminMembership = tenant.memberships?.find((m) => m.role === "org_admin");
    const orgAdmin = orgAdminMembership?.user
        ? {
            id: orgAdminMembership.user.id,
            email: orgAdminMembership.user.email,
        }
        : undefined;
    return orgAdmin ? { ...detail, orgAdmin } : detail;
};
exports.getTenantDetailForAdmin = getTenantDetailForAdmin;
const parseNullableDate = (value) => value ? new Date(value) : null;
const updateTenantQuota = async (tenantId, payload) => {
    const quotaRepo = (0, tenantQuotaRepository_1.tenantQuotaRepository)();
    const usageRepo = (0, tenantUsageRepository_1.tenantUsageRepository)();
    const quota = await quotaRepo.findOne({
        where: { tenant: { id: tenantId } },
        relations: ["tenant", "plan"],
    });
    if (!quota) {
        throw new errorHandler_1.HttpError(404, "Tenant quota not found");
    }
    const usage = await usageRepo.findOne({
        where: { tenant: { id: tenantId } },
    });
    if (!usage) {
        throw new errorHandler_1.HttpError(500, "Tenant usage record missing");
    }
    if (payload.planId !== undefined) {
        if (payload.planId === null) {
            quota.plan = null;
        }
        else {
            const plan = await (0, tenantPlanRepository_1.tenantPlanRepository)().findOne({
                where: { id: payload.planId },
            });
            if (!plan) {
                throw new errorHandler_1.HttpError(404, "Plan not found");
            }
            quota.plan = plan;
        }
    }
    const ensureLimit = (current, incoming) => {
        if (incoming == null)
            return;
        if (incoming < current) {
            throw new errorHandler_1.HttpError(400, "New quota cannot be lower than current usage");
        }
    };
    ensureLimit(usage.projectCount, payload.maxProjects);
    ensureLimit(usage.domainCount, payload.maxDomains);
    ensureLimit(usage.memberCount, payload.maxMembers);
    ensureLimit(usage.orgAdminCount, payload.maxOrgAdmins);
    if (payload.maxProjects !== undefined)
        quota.maxProjects = payload.maxProjects;
    if (payload.maxDomains !== undefined)
        quota.maxDomains = payload.maxDomains;
    if (payload.maxMembers !== undefined)
        quota.maxMembers = payload.maxMembers;
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
    return (0, exports.getTenantDetailForAdmin)(tenantId);
};
exports.updateTenantQuota = updateTenantQuota;
const createTenantPlan = async (payload) => {
    const repo = (0, tenantPlanRepository_1.tenantPlanRepository)();
    const existing = await repo.findOne({ where: { code: payload.code } });
    if (existing) {
        throw new errorHandler_1.HttpError(409, "Plan code already exists");
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
exports.createTenantPlan = createTenantPlan;
const createTenantForAdmin = async (payload) => {
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const membershipRepo = data_source_1.AppDataSource.getRepository(UserTenant_1.UserTenant);
    const existingUser = await userRepo.findOne({
        where: { email: payload.orgAdminEmail },
    });
    if (existingUser) {
        throw new errorHandler_1.HttpError(409, "Email already registered");
    }
    const tenant = await (0, tenantService_1.createTenant)(payload.tenantName);
    const passwordHash = await (0, password_1.hashPassword)(payload.orgAdminPassword);
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
    const quotaRepo = (0, tenantQuotaRepository_1.tenantQuotaRepository)();
    const quota = await quotaRepo.findOne({
        where: { tenant: { id: tenant.id } },
        relations: ["plan"],
    });
    if (!quota) {
        throw new errorHandler_1.HttpError(500, "Failed to initialize tenant quota");
    }
    if (payload.planId) {
        const plan = await (0, tenantPlanRepository_1.tenantPlanRepository)().findOne({
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
    return (0, exports.getTenantDetailForAdmin)(tenant.id);
};
exports.createTenantForAdmin = createTenantForAdmin;
const updateTenantOrgAdmin = async (tenantId, payload) => {
    const tenant = await data_source_1.AppDataSource.getRepository(Tenant_1.Tenant).findOne({
        where: { id: tenantId },
        relations: ["memberships", "memberships.user"],
    });
    if (!tenant) {
        throw new errorHandler_1.HttpError(404, "Tenant not found");
    }
    const orgAdminMembership = tenant.memberships?.find((m) => m.role === "org_admin");
    if (!orgAdminMembership || !orgAdminMembership.user) {
        throw new errorHandler_1.HttpError(404, "Org admin not found for this tenant");
    }
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const user = await userRepo.findOne({
        where: { id: orgAdminMembership.user.id },
    });
    if (!user) {
        throw new errorHandler_1.HttpError(404, "User not found");
    }
    if (payload.email) {
        // Check if email is already taken by another user
        const existingUser = await userRepo.findOne({
            where: { email: payload.email },
        });
        if (existingUser && existingUser.id !== user.id) {
            throw new errorHandler_1.HttpError(409, "Email already registered");
        }
        user.email = payload.email;
    }
    if (payload.password) {
        user.passwordHash = await (0, password_1.hashPassword)(payload.password);
    }
    await userRepo.save(user);
    return (0, exports.getTenantDetailForAdmin)(tenantId);
};
exports.updateTenantOrgAdmin = updateTenantOrgAdmin;
const updateTenantApiKeys = async (tenantId, payload) => {
    const quotaRepo = (0, tenantQuotaRepository_1.tenantQuotaRepository)();
    const quota = await quotaRepo.findOne({
        where: { tenant: { id: tenantId } },
    });
    if (!quota) {
        throw new errorHandler_1.HttpError(404, "Tenant quota not found");
    }
    if (payload.apiKeys !== undefined) {
        quota.apiKeys = payload.apiKeys;
    }
    await quotaRepo.save(quota);
    return (0, exports.getTenantDetailForAdmin)(tenantId);
};
exports.updateTenantApiKeys = updateTenantApiKeys;
//# sourceMappingURL=adminTenantService.js.map