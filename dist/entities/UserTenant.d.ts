import { BaseEntity } from "./BaseEntity";
import { User } from "./User";
import { Tenant } from "./Tenant";
export type TenantRole = "super_admin" | "org_admin" | "member" | "individual";
export declare class UserTenant extends BaseEntity {
    user: User;
    tenant: Tenant;
    role: TenantRole;
    toolAccess?: Record<string, boolean> | null;
}
//# sourceMappingURL=UserTenant.d.ts.map