"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usageService = void 0;
const data_source_1 = require("../config/data-source");
const Tenant_1 = require("../entities/Tenant");
const errorHandler_1 = require("../middleware/errorHandler");
const usageLogRepository_1 = require("../repositories/usageLogRepository");
class UsageService {
    async increment(tenantId, metricKey, amount = 1) {
        const tenantRepo = data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
        const tenant = await tenantRepo.findOne({
            where: { id: tenantId },
            relations: ["plan"],
        });
        if (!tenant) {
            throw new errorHandler_1.HttpError(404, "Tenant not found");
        }
        // Get current period (month)
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        // Check quota before incrementing
        const quotaCheck = await this.checkQuota(tenantId, metricKey);
        if (!quotaCheck.allowed) {
            throw new errorHandler_1.HttpError(429, `Quota exceeded for '${metricKey}'. Upgrade plan or wait until period reset.`);
        }
        // Find or create usage log for this period
        const repo = (0, usageLogRepository_1.usageLogRepository)();
        let log = await repo.findOne({
            where: {
                tenant: { id: tenantId },
                metricKey,
                periodStart,
            },
        });
        if (log) {
            log.value += amount;
        }
        else {
            log = repo.create({
                tenant: { id: tenantId },
                metricKey,
                value: amount,
                periodStart,
                periodEnd,
            });
        }
        await repo.save(log);
    }
    async checkQuota(tenantId, metricKey) {
        const tenantRepo = data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
        const tenant = await tenantRepo.findOne({
            where: { id: tenantId },
            relations: ["plan"],
        });
        if (!tenant) {
            throw new errorHandler_1.HttpError(404, "Tenant not found");
        }
        // Get quota limit from plan
        let quotaLimit = null;
        if (tenant.planKey && tenant.plan) {
            quotaLimit = tenant.plan.quotas?.[metricKey] ?? null;
        }
        // If no quota limit, allow unlimited
        if (quotaLimit === null) {
            return {
                allowed: true,
                quotaLeft: Infinity,
                quotaLimit: Infinity,
                currentUsage: 0,
            };
        }
        // Get current usage for this period
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const currentUsage = await this.getUsage(tenantId, metricKey, periodStart, periodEnd);
        const quotaLeft = Math.max(0, quotaLimit - currentUsage);
        return {
            allowed: quotaLeft > 0,
            quotaLeft,
            quotaLimit,
            currentUsage,
        };
    }
    async getUsage(tenantId, metricKey, periodStart, periodEnd) {
        const repo = (0, usageLogRepository_1.usageLogRepository)();
        const logs = await repo.find({
            where: {
                tenant: { id: tenantId },
                metricKey,
                periodStart,
            },
        });
        return logs.reduce((sum, log) => sum + log.value, 0);
    }
    async getUsageForPeriod(tenantId, periodStart, periodEnd) {
        const repo = (0, usageLogRepository_1.usageLogRepository)();
        const logs = await repo.find({
            where: {
                tenant: { id: tenantId },
                periodStart,
            },
        });
        const usage = {};
        for (const log of logs) {
            usage[log.metricKey] = (usage[log.metricKey] || 0) + log.value;
        }
        return usage;
    }
}
exports.usageService = new UsageService();
//# sourceMappingURL=usageService.js.map