import { User } from "../entities/User";
import { TenantRole } from "../entities/UserTenant";
export type AuthResponse = {
    token: string;
    user: User;
    tenantId?: string;
    role?: TenantRole;
};
export declare const signup: (params: {
    email: string;
    password: string;
    tenantName: string;
    role?: TenantRole;
}) => Promise<AuthResponse>;
export declare const login: (params: {
    email: string;
    password: string;
}) => Promise<AuthResponse>;
//# sourceMappingURL=authService.d.ts.map