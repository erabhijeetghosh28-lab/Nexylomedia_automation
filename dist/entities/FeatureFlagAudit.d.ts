import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
import { User } from "./User";
export declare class FeatureFlagAudit extends BaseEntity {
    tenant: Tenant;
    flagKey: string;
    enabledBy?: User | null;
    enabledAt: Date;
    reason?: string | null;
}
//# sourceMappingURL=FeatureFlagAudit.d.ts.map