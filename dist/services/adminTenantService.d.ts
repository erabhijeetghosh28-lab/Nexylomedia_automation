import { TenantPlan } from "../entities/TenantPlan";
import { TenantQuota } from "../entities/TenantQuota";
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
export declare const listTenantsForAdmin: () => Promise<AdminTenantSummary[]>;
export declare const getTenantDetailForAdmin: (tenantId: string) => Promise<AdminTenantSummary & {
    orgAdmin?: {
        id: string;
        email: string;
    } | undefined;
}>;
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
export declare const updateTenantQuota: (tenantId: string, payload: UpdateTenantQuotaPayload) => Promise<AdminTenantSummary & {
    orgAdmin?: {
        id: string;
        email: string;
    } | undefined;
}>;
type CreatePlanPayload = {
    code: string;
    name: string;
    description?: string;
    monthlyPrice?: number;
    annualPrice?: number;
    currency?: string;
};
export declare const createTenantPlan: (payload: CreatePlanPayload) => Promise<TenantPlan>;
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
export declare const createTenantForAdmin: (payload: CreateTenantPayload) => Promise<AdminTenantSummary>;
export declare const updateTenantOrgAdmin: (tenantId: string, payload: {
    email?: string;
    password?: string;
}) => Promise<AdminTenantSummary & {
    orgAdmin?: {
        id: string;
        email: string;
    } | undefined;
}>;
export declare const updateTenantApiKeys: (tenantId: string, payload: {
    apiKeys?: Record<string, string> | null;
}) => Promise<AdminTenantSummary & {
    orgAdmin?: {
        id: string;
        email: string;
    } | undefined;
}>;
export {};
//# sourceMappingURL=adminTenantService.d.ts.map