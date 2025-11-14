import { Tenant } from "../entities/Tenant";
import { TenantQuota } from "../entities/TenantQuota";
import { TenantUsage } from "../entities/TenantUsage";
export declare const DEFAULT_BILLING_STATUS: TenantQuota["billingStatus"];
export type QuotaCheckType = "project" | "domain" | "maxMembers" | "maxOrgAdmins";
export declare const ensureTenantQuota: (tenantId: string) => Promise<{
    quota: TenantQuota;
    usage: TenantUsage;
}>;
export declare const ensureCapacityOrThrow: (tenantId: string, type: QuotaCheckType) => Promise<void>;
export declare const incrementUsage: (tenantId: string, delta: Partial<Pick<TenantUsage, "projectCount" | "domainCount">>) => Promise<void>;
export declare const decrementUsage: (tenantId: string, delta: Partial<Pick<TenantUsage, "projectCount" | "domainCount">>) => Promise<void>;
export declare const ensureQuotaAndUsage: (tenant: Tenant) => Promise<void>;
export declare const updateTenantUsageCounts: (tenantId: string) => Promise<void>;
//# sourceMappingURL=quotaService.d.ts.map