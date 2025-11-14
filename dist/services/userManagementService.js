"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleDefinitions = exports.getAvailableTools = exports.updateUserToolAccess = exports.removeUserFromTenant = exports.updateUserRole = exports.listUsersInTenant = exports.createUserForTenant = void 0;
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const UserTenant_1 = require("../entities/UserTenant");
const Tenant_1 = require("../entities/Tenant");
const errorHandler_1 = require("../middleware/errorHandler");
const password_1 = require("../utils/password");
const quotaService_1 = require("./quotaService");
const userRepository = () => data_source_1.AppDataSource.getRepository(User_1.User);
const userTenantRepository = () => data_source_1.AppDataSource.getRepository(UserTenant_1.UserTenant);
const tenantRepository = () => data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
/**
 * Create a new user and assign them to a tenant with a specific role
 */
const createUserForTenant = async (params) => {
    const { tenantId, email, password, displayName, role, createdById, toolAccess } = params;
    // Verify tenant exists
    const tenant = await tenantRepository().findOne({
        where: { id: tenantId },
    });
    if (!tenant) {
        throw new errorHandler_1.HttpError(404, "Tenant not found");
    }
    // Check if user already exists
    let user = await userRepository().findOne({
        where: { email: email.toLowerCase() },
    });
    if (user) {
        // Check if user is already a member of this tenant
        const existingMembership = await userTenantRepository().findOne({
            where: {
                user: { id: user.id },
                tenant: { id: tenantId },
            },
        });
        if (existingMembership) {
            throw new errorHandler_1.HttpError(400, "User is already a member of this tenant");
        }
    }
    else {
        // Create new user
        const passwordHash = await (0, password_1.hashPassword)(password);
        const newUser = userRepository().create({
            email: email.toLowerCase(),
            passwordHash,
            displayName: displayName ?? null,
        });
        user = await userRepository().save(newUser);
    }
    // Check quota for members
    if (role === "member") {
        await (0, quotaService_1.ensureCapacityOrThrow)(tenantId, "maxMembers");
    }
    else if (role === "org_admin") {
        await (0, quotaService_1.ensureCapacityOrThrow)(tenantId, "maxOrgAdmins");
    }
    // Create membership
    const membership = userTenantRepository().create({
        user,
        tenant,
        role,
        toolAccess: params.toolAccess || null,
    });
    await userTenantRepository().save(membership);
    return {
        id: user.id,
        email: user.email,
        displayName: user.displayName || null,
        role,
        toolAccess: membership.toolAccess || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.createUserForTenant = createUserForTenant;
/**
 * List all users in a tenant
 */
const listUsersInTenant = async (tenantId) => {
    const memberships = await userTenantRepository().find({
        where: { tenant: { id: tenantId } },
        relations: ["user"],
        order: { createdAt: "DESC" },
    });
    return memberships.map((membership) => ({
        id: membership.user.id,
        email: membership.user.email,
        displayName: membership.user.displayName || null,
        role: membership.role,
        toolAccess: membership.toolAccess || null,
        createdAt: membership.user.createdAt,
        updatedAt: membership.user.updatedAt,
    }));
};
exports.listUsersInTenant = listUsersInTenant;
/**
 * Update a user's role in a tenant
 */
const updateUserRole = async (params) => {
    const { tenantId, userId, role, updatedById } = params;
    // Verify tenant exists
    const tenant = await tenantRepository().findOne({
        where: { id: tenantId },
    });
    if (!tenant) {
        throw new errorHandler_1.HttpError(404, "Tenant not found");
    }
    // Find membership
    const membership = await userTenantRepository().findOne({
        where: {
            user: { id: userId },
            tenant: { id: tenantId },
        },
        relations: ["user"],
    });
    if (!membership) {
        throw new errorHandler_1.HttpError(404, "User not found in this tenant");
    }
    // Prevent changing own role if you're the only org_admin
    if (membership.role === "org_admin" && role !== "org_admin") {
        const orgAdminCount = await userTenantRepository().count({
            where: {
                tenant: { id: tenantId },
                role: "org_admin",
            },
        });
        if (orgAdminCount === 1 && membership.user.id === updatedById) {
            throw new errorHandler_1.HttpError(400, "Cannot change your own role. You are the only org admin.");
        }
    }
    // Check quota if changing to org_admin
    if (role === "org_admin" && membership.role !== "org_admin") {
        await (0, quotaService_1.ensureCapacityOrThrow)(tenantId, "maxOrgAdmins");
    }
    // Update role and tool access if provided
    membership.role = role;
    if (params.toolAccess !== undefined) {
        membership.toolAccess = params.toolAccess;
    }
    await userTenantRepository().save(membership);
    return {
        id: membership.user.id,
        email: membership.user.email,
        displayName: membership.user.displayName || null,
        role: membership.role,
        toolAccess: membership.toolAccess || null,
        createdAt: membership.user.createdAt,
        updatedAt: membership.user.updatedAt,
    };
};
exports.updateUserRole = updateUserRole;
/**
 * Remove a user from a tenant
 */
const removeUserFromTenant = async (tenantId, userId, removedById) => {
    // Find membership
    const membership = await userTenantRepository().findOne({
        where: {
            user: { id: userId },
            tenant: { id: tenantId },
        },
        relations: ["user"],
    });
    if (!membership) {
        throw new errorHandler_1.HttpError(404, "User not found in this tenant");
    }
    // Prevent removing yourself if you're the only org_admin
    if (membership.role === "org_admin" && membership.user.id === removedById) {
        const orgAdminCount = await userTenantRepository().count({
            where: {
                tenant: { id: tenantId },
                role: "org_admin",
            },
        });
        if (orgAdminCount === 1) {
            throw new errorHandler_1.HttpError(400, "Cannot remove yourself. You are the only org admin.");
        }
    }
    await userTenantRepository().remove(membership);
};
exports.removeUserFromTenant = removeUserFromTenant;
/**
 * Update a user's tool access in a tenant
 */
const updateUserToolAccess = async (params) => {
    const { tenantId, userId, toolAccess, updatedById } = params;
    // Verify tenant exists
    const tenant = await tenantRepository().findOne({
        where: { id: tenantId },
    });
    if (!tenant) {
        throw new errorHandler_1.HttpError(404, "Tenant not found");
    }
    // Find membership
    const membership = await userTenantRepository().findOne({
        where: {
            user: { id: userId },
            tenant: { id: tenantId },
        },
        relations: ["user"],
    });
    if (!membership) {
        throw new errorHandler_1.HttpError(404, "User not found in this tenant");
    }
    // Update tool access
    membership.toolAccess = toolAccess;
    await userTenantRepository().save(membership);
    return {
        id: membership.user.id,
        email: membership.user.email,
        displayName: membership.user.displayName || null,
        role: membership.role,
        toolAccess: membership.toolAccess || null,
        createdAt: membership.user.createdAt,
        updatedAt: membership.user.updatedAt,
    };
};
exports.updateUserToolAccess = updateUserToolAccess;
/**
 * Get available tools for the platform
 */
const getAvailableTools = () => {
    return [
        {
            id: "seo_autopilot",
            name: "SEO Autopilot",
            description: "Run SEO audits, detect issues, and generate AI-powered fixes",
            defaultForRoles: ["org_admin"],
        },
        {
            id: "project_management",
            name: "Project Management",
            description: "Create and manage projects and domains",
            defaultForRoles: ["org_admin"],
        },
        {
            id: "domain_management",
            name: "Domain Management",
            description: "Submit and manage domain submissions",
            defaultForRoles: ["org_admin", "member"],
        },
        {
            id: "ai_fixes",
            name: "AI Fixes",
            description: "Generate AI-powered fixes for SEO issues",
            defaultForRoles: ["org_admin"],
        },
    ];
};
exports.getAvailableTools = getAvailableTools;
/**
 * Get role definitions and permissions
 */
const getRoleDefinitions = () => {
    return {
        super_admin: {
            name: "Super Admin",
            description: "Platform-level administrator with full access to all tenants and system controls.",
            permissions: [
                "Manage all tenants",
                "Create and manage billing plans",
                "Adjust quotas and billing",
                "Access all tenant data",
                "System configuration",
            ],
            defaultToolAccess: ["All tools"],
        },
        org_admin: {
            name: "Org Admin",
            description: "Organization administrator with full control over their tenant workspace, members, and projects.",
            permissions: [
                "Manage team members",
                "Create and manage projects",
                "Assign roles and permissions",
                "Manage API keys",
                "View usage and quotas",
                "Approve domain submissions",
                "Configure tool access for members",
            ],
            defaultToolAccess: [
                "seo_autopilot",
                "project_management",
                "domain_management",
                "ai_fixes",
            ],
        },
        member: {
            name: "Member",
            description: "Team member with access to assigned projects and tools based on org admin settings.",
            permissions: [
                "View assigned projects",
                "Submit domains for approval",
                "Run SEO audits (if enabled)",
                "View audit results",
                "Generate AI fixes (if enabled)",
            ],
            defaultToolAccess: ["domain_management"],
        },
        individual: {
            name: "Individual",
            description: "Solo user with personal workspace. Manages their own API keys and plan.",
            permissions: [
                "Manage personal API keys",
                "View personal usage",
                "Run SEO audits (if enabled)",
                "Generate AI fixes (if enabled)",
            ],
            defaultToolAccess: ["domain_management"],
        },
    };
};
exports.getRoleDefinitions = getRoleDefinitions;
//# sourceMappingURL=userManagementService.js.map