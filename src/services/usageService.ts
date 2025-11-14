import { AppDataSource } from "../config/data-source";
import { UsageLog } from "../entities/UsageLog";
import { Tenant } from "../entities/Tenant";
import { HttpError } from "../middleware/errorHandler";
import { usageLogRepository } from "../repositories/usageLogRepository";
import { getPlanByKey } from "./planService";

export type QuotaCheckResult = {
  allowed: boolean;
  quotaLeft: number;
  quotaLimit: number;
  currentUsage: number;
};

class UsageService {
  async increment(
    tenantId: string,
    metricKey: string,
    amount: number = 1,
  ): Promise<void> {
    const tenantRepo = AppDataSource.getRepository(Tenant);
    const tenant = await tenantRepo.findOne({
      where: { id: tenantId },
      relations: ["plan"],
    });

    if (!tenant) {
      throw new HttpError(404, "Tenant not found");
    }

    // Get current period (month)
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Check quota before incrementing
    const quotaCheck = await this.checkQuota(tenantId, metricKey);
    if (!quotaCheck.allowed) {
      throw new HttpError(
        429,
        `Quota exceeded for '${metricKey}'. Upgrade plan or wait until period reset.`,
      );
    }

    // Find or create usage log for this period
    const repo = usageLogRepository();
    let log = await repo.findOne({
      where: {
        tenant: { id: tenantId },
        metricKey,
        periodStart,
      },
    });

    if (log) {
      log.value += amount;
    } else {
      log = repo.create({
        tenant: { id: tenantId } as any,
        metricKey,
        value: amount,
        periodStart,
        periodEnd,
      });
    }

    await repo.save(log);
  }

  async checkQuota(
    tenantId: string,
    metricKey: string,
  ): Promise<QuotaCheckResult> {
    const tenantRepo = AppDataSource.getRepository(Tenant);
    const tenant = await tenantRepo.findOne({
      where: { id: tenantId },
      relations: ["plan"],
    });

    if (!tenant) {
      throw new HttpError(404, "Tenant not found");
    }

    // Get quota limit from plan
    let quotaLimit: number | null = null;
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

  async getUsage(
    tenantId: string,
    metricKey: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<number> {
    const repo = usageLogRepository();
    const logs = await repo.find({
      where: {
        tenant: { id: tenantId },
        metricKey,
        periodStart,
      },
    });

    return logs.reduce((sum, log) => sum + log.value, 0);
  }

  async getUsageForPeriod(
    tenantId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<Record<string, number>> {
    const repo = usageLogRepository();
    const logs = await repo.find({
      where: {
        tenant: { id: tenantId },
        periodStart,
      },
    });

    const usage: Record<string, number> = {};
    for (const log of logs) {
      usage[log.metricKey] = (usage[log.metricKey] || 0) + log.value;
    }

    return usage;
  }
}

export const usageService = new UsageService();

