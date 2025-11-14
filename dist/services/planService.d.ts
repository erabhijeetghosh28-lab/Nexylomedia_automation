import { TenantPlan } from "../entities/TenantPlan";
export type CreatePlanParams = {
    key: string;
    code: string;
    name: string;
    description?: string;
    monthlyPrice?: number;
    annualPrice?: number;
    currency?: string;
    allowedFeatures?: Record<string, boolean>;
    quotas?: Record<string, number>;
    isActive?: boolean;
};
export type UpdatePlanParams = Partial<CreatePlanParams>;
export declare const getPlanByKey: (key: string) => Promise<TenantPlan>;
export declare const getPlanById: (id: string) => Promise<TenantPlan>;
export declare const listPlans: () => Promise<TenantPlan[]>;
export declare const createPlan: (params: CreatePlanParams) => Promise<TenantPlan>;
export declare const updatePlan: (key: string, params: UpdatePlanParams) => Promise<TenantPlan>;
export declare const deletePlan: (key: string) => Promise<void>;
//# sourceMappingURL=planService.d.ts.map