import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
import { TenantPlan } from "./TenantPlan";
export type BillingStatus = "trial" | "active" | "past_due" | "suspended" | "cancelled";
export declare class TenantQuota extends BaseEntity {
    tenant: Tenant;
    plan?: TenantPlan | null;
    maxProjects?: number | null;
    maxDomains?: number | null;
    maxMembers?: number | null;
    maxOrgAdmins?: number | null;
    maxAutomationsPerMonth?: number | null;
    featureFlags?: Record<string, boolean> | null;
    billingStatus: BillingStatus;
    trialEndsAt?: Date | null;
    currentPeriodEndsAt?: Date | null;
    notes?: string | null;
    apiKeys?: Record<string, string> | null;
}
//# sourceMappingURL=TenantQuota.d.ts.map