import { BaseEntity } from "./BaseEntity";
import { UserTenant } from "./UserTenant";
import { Project } from "./Project";
import { TenantQuota } from "./TenantQuota";
import { TenantUsage } from "./TenantUsage";
import { TenantPlan } from "./TenantPlan";
export declare class Tenant extends BaseEntity {
    slug: string;
    name: string;
    plan?: TenantPlan | null;
    planKey?: string | null;
    featuresJson?: Record<string, boolean> | null;
    memberships: UserTenant[];
    projects: Project[];
    quota: TenantQuota;
    usage: TenantUsage;
}
//# sourceMappingURL=Tenant.d.ts.map