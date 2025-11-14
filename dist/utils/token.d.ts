import { TenantRole } from "../entities/UserTenant";
export type TokenPayload = {
    userId: string;
    tenantId?: string | null;
    role?: TenantRole;
    scopes?: string[];
    iat?: number;
    exp?: number;
};
export declare const signToken: (payload: TokenPayload, expiresIn?: string) => string;
export declare const verifyToken: (token: string) => TokenPayload;
//# sourceMappingURL=token.d.ts.map