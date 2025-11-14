import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { requireTenantContext } from "../middleware/tenantContext";
import {
  createUserForTenant,
  listUsersInTenant,
  updateUserRole,
  removeUserFromTenant,
  updateUserToolAccess,
  getRoleDefinitions,
  getAvailableTools,
} from "../services/userManagementService";
import { HttpError } from "../middleware/errorHandler";
import type { TenantRole } from "../entities/UserTenant";

export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.use(requireTenantContext);

// Only org_admin and super_admin can manage users
userRouter.use(requireRole("org_admin", "super_admin"));

/**
 * GET /users
 * List all users in the current tenant
 */
userRouter.get("/", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId) {
      throw new HttpError(400, "Tenant context missing");
    }
    const users = await listUsersInTenant(req.auth.tenantId);
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /users
 * Create a new user and assign them to the tenant
 */
userRouter.post("/", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId || !req.auth?.userId) {
      throw new HttpError(400, "Tenant context or user ID missing");
    }

    const { email, password, displayName, role, toolAccess } = req.body;

    if (!email || !password || !role) {
      throw new HttpError(400, "Email, password, and role are required");
    }

    if (!["org_admin", "member"].includes(role)) {
      throw new HttpError(400, "Invalid role. Must be 'org_admin' or 'member'");
    }

    const user = await createUserForTenant({
      tenantId: req.auth.tenantId,
      email,
      password,
      displayName,
      role: role as TenantRole,
      toolAccess,
      createdById: req.auth.userId,
    });

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /users/:userId/role
 * Update a user's role in the tenant
 */
userRouter.patch("/:userId/role", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId || !req.auth?.userId) {
      throw new HttpError(400, "Tenant context or user ID missing");
    }

    const { userId } = req.params;
    const { role, toolAccess } = req.body;

    if (!role) {
      throw new HttpError(400, "Role is required");
    }

    if (!["org_admin", "member"].includes(role)) {
      throw new HttpError(400, "Invalid role. Must be 'org_admin' or 'member'");
    }

    const user = await updateUserRole({
      tenantId: req.auth.tenantId,
      userId,
      role: role as TenantRole,
      toolAccess,
      updatedById: req.auth.userId,
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /users/:userId
 * Remove a user from the tenant
 */
userRouter.delete("/:userId", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId || !req.auth?.userId) {
      throw new HttpError(400, "Tenant context or user ID missing");
    }

    const { userId } = req.params;

    await removeUserFromTenant(
      req.auth.tenantId,
      userId,
      req.auth.userId,
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /users/:userId/tool-access
 * Update a user's tool access
 */
userRouter.patch("/:userId/tool-access", async (req, res, next) => {
  try {
    if (!req.auth?.tenantId || !req.auth?.userId) {
      throw new HttpError(400, "Tenant context or user ID missing");
    }

    const { userId } = req.params;
    const { toolAccess } = req.body;

    if (!toolAccess || typeof toolAccess !== "object") {
      throw new HttpError(400, "toolAccess object is required");
    }

    const user = await updateUserToolAccess({
      tenantId: req.auth.tenantId,
      userId,
      toolAccess,
      updatedById: req.auth.userId,
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /users/roles
 * Get role definitions and permissions
 */
userRouter.get("/roles", async (req, res, next) => {
  try {
    const definitions = getRoleDefinitions();
    res.json({ roles: definitions });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /users/tools
 * Get available tools
 */
userRouter.get("/tools", async (req, res, next) => {
  try {
    const tools = getAvailableTools();
    res.json({ tools });
  } catch (error) {
    next(error);
  }
});

