import { BaseEntity } from "./BaseEntity";
import { Tenant } from "./Tenant";
import { User } from "./User";
export type IntegrationScope = "tenant" | "user";
export type IntegrationStatus = "ok" | "failed" | "untested";
export declare class Integration extends BaseEntity {
    tenant?: Tenant | null;
    user?: User | null;
    provider: string;
    keyMask: string;
    secretRef: string;
    scope: IntegrationScope;
    status: IntegrationStatus;
    configJson?: Record<string, unknown> | null;
}
//# sourceMappingURL=Integration.d.ts.map