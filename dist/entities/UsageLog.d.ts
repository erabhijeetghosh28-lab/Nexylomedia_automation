import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
export declare class UsageLog extends BaseEntity {
    tenant: Tenant;
    metricKey: string;
    value: number;
    periodStart: Date;
    periodEnd: Date;
}
//# sourceMappingURL=UsageLog.d.ts.map