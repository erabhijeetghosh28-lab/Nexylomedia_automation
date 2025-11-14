import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
export declare class TenantUsage extends BaseEntity {
    tenant: Tenant;
    projectCount: number;
    domainCount: number;
    memberCount: number;
    orgAdminCount: number;
    automationRunsThisMonth: number;
    lastCalculatedAt?: Date | null;
}
//# sourceMappingURL=TenantUsage.d.ts.map