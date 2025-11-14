import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserTenant, TenantRole } from "../entities/UserTenant";
import { Tenant } from "../entities/Tenant";
import { HttpError } from "../middleware/errorHandler";
import { hashPassword } from "../utils/password";
import { ensureCapacityOrThrow } from "./quotaService";

const userRepository = () => AppDataSource.getRepository(User);
const userTenantRepository = () => AppDataSource.getRepository(UserTenant);
const tenantRepository = () => AppDataSource.getRepository(Tenant);

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
export const createUserForTenant = async (
  params: CreateUserParams,
): Promise<UserSummary> => {
  const { tenantId, email, password, displayName, role, createdById, toolAccess } = params;

  // Verify tenant exists
  const tenant = await tenantRepository().findOne({
    where: { id: tenantId },
  });
  if (!tenant) {
    throw new HttpError(404, "Tenant not found");
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
      throw new HttpError(400, "User is already a member of this tenant");
    }
  } else {
    // Create new user
    const passwordHash = await hashPassword(password);
    const newUser = userRepository().create({
      email: email.toLowerCase(),
      passwordHash,
      displayName: displayName ?? null,
    });
    user = await userRepository().save(newUser);
  }

  // Check quota for members
  if (role === "member") {
    await ensureCapacityOrThrow(tenantId, "maxMembers");
  } else if (role === "org_admin") {
    await ensureCapacityOrThrow(tenantId, "maxOrgAdmins");
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

/**
 * List all users in a tenant
 */
export const listUsersInTenant = async (
  tenantId: string,
): Promise<UserSummary[]> => {
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

/**
 * Update a user's role in a tenant
 */
export const updateUserRole = async (
  params: UpdateUserRoleParams,
): Promise<UserSummary> => {
  const { tenantId, userId, role, updatedById } = params;

  // Verify tenant exists
  const tenant = await tenantRepository().findOne({
    where: { id: tenantId },
  });
  if (!tenant) {
    throw new HttpError(404, "Tenant not found");
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
    throw new HttpError(404, "User not found in this tenant");
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
      throw new HttpError(
        400,
        "Cannot change your own role. You are the only org admin.",
      );
    }
  }

  // Check quota if changing to org_admin
  if (role === "org_admin" && membership.role !== "org_admin") {
    await ensureCapacityOrThrow(tenantId, "maxOrgAdmins");
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

/**
 * Remove a user from a tenant
 */
export const removeUserFromTenant = async (
  tenantId: string,
  userId: string,
  removedById: string,
): Promise<void> => {
  // Find membership
  const membership = await userTenantRepository().findOne({
    where: {
      user: { id: userId },
      tenant: { id: tenantId },
    },
    relations: ["user"],
  });

  if (!membership) {
    throw new HttpError(404, "User not found in this tenant");
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
      throw new HttpError(
        400,
        "Cannot remove yourself. You are the only org admin.",
      );
    }
  }

  await userTenantRepository().remove(membership);
};

/**
 * Update a user's tool access in a tenant
 */
export const updateUserToolAccess = async (
  params: UpdateUserToolAccessParams,
): Promise<UserSummary> => {
  const { tenantId, userId, toolAccess, updatedById } = params;

  // Verify tenant exists
  const tenant = await tenantRepository().findOne({
    where: { id: tenantId },
  });
  if (!tenant) {
    throw new HttpError(404, "Tenant not found");
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
    throw new HttpError(404, "User not found in this tenant");
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

/**
 * Get available tools for the platform
 */
export const getAvailableTools = (): Array<{
  id: string;
  name: string;
  description: string;
  defaultForRoles: TenantRole[];
}> => {
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

/**
 * Get role definitions and permissions
 */
export const getRoleDefinitions = (): Record<
  TenantRole,
  {
    name: string;
    description: string;
    permissions: string[];
    defaultToolAccess: string[];
  }
> => {
  return {
    super_admin: {
      name: "Super Admin",
      description:
        "Platform-level administrator with full access to all tenants and system controls.",
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
      description:
        "Organization administrator with full control over their tenant workspace, members, and projects.",
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
      description:
        "Team member with access to assigned projects and tools based on org admin settings.",
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
      description:
        "Solo user with personal workspace. Manages their own API keys and plan.",
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

