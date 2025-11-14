"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTenantUsageCounts = exports.ensureQuotaAndUsage = exports.decrementUsage = exports.incrementUsage = exports.ensureCapacityOrThrow = exports.ensureTenantQuota = exports.DEFAULT_BILLING_STATUS = void 0;
const data_source_1 = require("../config/data-source");
const Tenant_1 = require("../entities/Tenant");
const tenantQuotaRepository_1 = require("../repositories/tenantQuotaRepository");
const tenantUsageRepository_1 = require("../repositories/tenantUsageRepository");
const errorHandler_1 = require("../middleware/errorHandler");
exports.DEFAULT_BILLING_STATUS = "trial";
const ensureTenantQuota = async (tenantId) => {
    const quotaRepo = (0, tenantQuotaRepository_1.tenantQuotaRepository)();
    const usageRepo = (0, tenantUsageRepository_1.tenantUsageRepository)();
    const quota = await quotaRepo.findOne({
        where: { tenant: { id: tenantId } },
        relations: ["plan"],
    });
    const usage = await usageRepo.findOne({
        where: { tenant: { id: tenantId } },
    });
    if (!quota || !usage) {
        throw new errorHandler_1.HttpError(500, "Tenant quota configuration not found");
    }
    return { quota, usage };
};
exports.ensureTenantQuota = ensureTenantQuota;
const hasCapacity = (current, max) => max == null || current < max;
const ensureCapacityOrThrow = async (tenantId, type) => {
    const { quota, usage } = await (0, exports.ensureTenantQuota)(tenantId);
    if (quota.billingStatus === "suspended") {
        throw new errorHandler_1.HttpError(403, "Tenant is suspended. Please update billing to continue.");
    }
    switch (type) {
        case "project":
            if (!hasCapacity(usage.projectCount, quota.maxProjects)) {
                throw new errorHandler_1.HttpError(402, "Project limit reached. Please upgrade your plan or contact support.");
            }
            break;
        case "domain":
            if (!hasCapacity(usage.domainCount, quota.maxDomains)) {
                throw new errorHandler_1.HttpError(402, "Domain limit reached. Please upgrade your plan or contact support.");
            }
            break;
        case "maxMembers":
            if (!hasCapacity(usage.memberCount, quota.maxMembers)) {
                throw new errorHandler_1.HttpError(402, "Member limit reached. Please upgrade your plan or contact support.");
            }
            break;
        case "maxOrgAdmins":
            if (!hasCapacity(usage.orgAdminCount, quota.maxOrgAdmins)) {
                throw new errorHandler_1.HttpError(402, "Org admin limit reached. Please upgrade your plan or contact support.");
            }
            break;
        default:
            throw new errorHandler_1.HttpError(500, "Unsupported quota check");
    }
};
exports.ensureCapacityOrThrow = ensureCapacityOrThrow;
const incrementUsage = async (tenantId, delta) => {
    const usageRepo = (0, tenantUsageRepository_1.tenantUsageRepository)();
    const usage = await usageRepo.findOne({
        where: { tenant: { id: tenantId } },
    });
    if (!usage) {
        throw new errorHandler_1.HttpError(500, "Tenant usage record missing");
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
exports.incrementUsage = incrementUsage;
const decrementUsage = async (tenantId, delta) => {
    const usageRepo = (0, tenantUsageRepository_1.tenantUsageRepository)();
    const usage = await usageRepo.findOne({
        where: { tenant: { id: tenantId } },
    });
    if (!usage) {
        throw new errorHandler_1.HttpError(500, "Tenant usage record missing");
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
exports.decrementUsage = decrementUsage;
const ensureQuotaAndUsage = async (tenant) => {
    const quotaRepo = (0, tenantQuotaRepository_1.tenantQuotaRepository)();
    const usageRepo = (0, tenantUsageRepository_1.tenantUsageRepository)();
    const existingQuota = await quotaRepo.findOne({
        where: { tenant: { id: tenant.id } },
    });
    const existingUsage = await usageRepo.findOne({
        where: { tenant: { id: tenant.id } },
    });
    if (!existingQuota) {
        const quota = quotaRepo.create({
            tenant,
            billingStatus: exports.DEFAULT_BILLING_STATUS,
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
exports.ensureQuotaAndUsage = ensureQuotaAndUsage;
const updateTenantUsageCounts = async (tenantId) => {
    const tenant = await data_source_1.AppDataSource.getRepository(Tenant_1.Tenant).findOne({
        where: { id: tenantId },
        relations: ["projects", "projects.domains", "memberships", "memberships.user"],
    });
    if (!tenant)
        return;
    const usageRepo = (0, tenantUsageRepository_1.tenantUsageRepository)();
    const usage = await usageRepo.findOne({
        where: { tenant: { id: tenantId } },
    });
    if (!usage)
        return;
    usage.projectCount = tenant.projects?.length ?? 0;
    usage.domainCount =
        tenant.projects?.reduce((total, project) => total + (project.domains?.length ?? 0), 0) ?? 0;
    usage.memberCount =
        tenant.memberships?.filter((membership) => membership.role === "member")
            ?.length ?? 0;
    usage.orgAdminCount =
        tenant.memberships?.filter((membership) => membership.role === "org_admin")
            ?.length ?? 0;
    usage.lastCalculatedAt = new Date();
    await usageRepo.save(usage);
};
exports.updateTenantUsageCounts = updateTenantUsageCounts;
//# sourceMappingURL=quotaService.js.map