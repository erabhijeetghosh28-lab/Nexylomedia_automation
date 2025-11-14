export type QuotaCheckResult = {
    allowed: boolean;
    quotaLeft: number;
    quotaLimit: number;
    currentUsage: number;
};
declare class UsageService {
    increment(tenantId: string, metricKey: string, amount?: number): Promise<void>;
    checkQuota(tenantId: string, metricKey: string): Promise<QuotaCheckResult>;
    getUsage(tenantId: string, metricKey: string, periodStart: Date, periodEnd: Date): Promise<number>;
    getUsageForPeriod(tenantId: string, periodStart: Date, periodEnd: Date): Promise<Record<string, number>>;
}
export declare const usageService: UsageService;
export {};
//# sourceMappingURL=usageService.d.ts.map