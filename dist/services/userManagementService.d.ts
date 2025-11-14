import { TenantRole } from "../entities/UserTenant";
export type CreateUserParams = {
    tenantId: string;
    email: string;
    password: string;
    displayName?: string;
    role: TenantRole;
    createdById: string;
};
export type UpdateUserRoleParams = {
    tenantId: string;
    userId: string;
    role: TenantRole;
    toolAccess?: Record<string, boolean>;
    updatedById: string;
};
export type UpdateUserToolAccessParams = {
    tenantId: string;
    userId: string;
    toolAccess: Record<string, boolean>;
    updatedById: string;
};
export type UserSummary = {
    id: string;
    email: string;
    displayName: string | null;
    role: TenantRole;
    toolAccess?: Record<string, boolean> | null;
    createdAt: Date;
    updatedAt: Date;
};
/**
 * Create a new user and assign them to a tenant with a specific role
 */
export declare const createUserForTenant: (params: CreateUserParams) => Promise<UserSummary>;
/**
 * List all users in a tenant
 */
export declare const listUsersInTenant: (tenantId: string) => Promise<UserSummary[]>;
/**
 * Update a user's role in a tenant
 */
export declare const updateUserRole: (params: UpdateUserRoleParams) => Promise<UserSummary>;
/**
 * Remove a user from a tenant
 */
export declare const removeUserFromTenant: (tenantId: string, userId: string, removedById: string) => Promise<void>;
/**
 * Update a user's tool access in a tenant
 */
export declare const updateUserToolAccess: (params: UpdateUserToolAccessParams) => Promise<UserSummary>;
/**
 * Get available tools for the platform
 */
export declare const getAvailableTools: () => Array<{
    id: string;
    name: string;
    description: string;
    defaultForRoles: TenantRole[];
}>;
/**
 * Get role definitions and permissions
 */
export declare const getRoleDefinitions: () => Record<TenantRole, {
    name: string;
    description: string;
    permissions: string[];
    defaultToolAccess: string[];
}>;
//# sourceMappingURL=userManagementService.d.ts.map