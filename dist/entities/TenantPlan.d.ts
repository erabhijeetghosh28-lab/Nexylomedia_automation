import { BaseEntity } from "./BaseEntity";
import { TenantQuota } from "./TenantQuota";
export declare class TenantPlan extends BaseEntity {
    code: string;
    key?: string | null;
    name: string;
    description?: string | null;
    monthlyPrice: number;
    annualPrice: number;
    currency: string;
    isActive: boolean;
    allowedFeatures?: Record<string, boolean> | null;
    quotas?: Record<string, number> | null;
    quotasList: TenantQuota[];
}
//# sourceMappingURL=TenantPlan.d.ts.map