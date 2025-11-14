"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const tenantContext_1 = require("../middleware/tenantContext");
const userManagementService_1 = require("../services/userManagementService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.use(auth_1.requireAuth);
exports.userRouter.use(tenantContext_1.requireTenantContext);
// Only org_admin and super_admin can manage users
exports.userRouter.use((0, auth_1.requireRole)("org_admin", "super_admin"));
/**
 * GET /users
 * List all users in the current tenant
 */
exports.userRouter.get("/", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const users = await (0, userManagementService_1.listUsersInTenant)(req.auth.tenantId);
        res.json({ users });
    }
    catch (error) {
        next(error);
    }
});
/**
 * POST /users
 * Create a new user and assign them to the tenant
 */
exports.userRouter.post("/", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId || !req.auth?.userId) {
            throw new errorHandler_1.HttpError(400, "Tenant context or user ID missing");
        }
        const { email, password, displayName, role, toolAccess } = req.body;
        if (!email || !password || !role) {
            throw new errorHandler_1.HttpError(400, "Email, password, and role are required");
        }
        if (!["org_admin", "member"].includes(role)) {
            throw new errorHandler_1.HttpError(400, "Invalid role. Must be 'org_admin' or 'member'");
        }
        const user = await (0, userManagementService_1.createUserForTenant)({
            tenantId: req.auth.tenantId,
            email,
            password,
            displayName,
            role: role,
            toolAccess,
            createdById: req.auth.userId,
        });
        res.status(201).json({ user });
    }
    catch (error) {
        next(error);
    }
});
/**
 * PATCH /users/:userId/role
 * Update a user's role in the tenant
 */
exports.userRouter.patch("/:userId/role", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId || !req.auth?.userId) {
            throw new errorHandler_1.HttpError(400, "Tenant context or user ID missing");
        }
        const { userId } = req.params;
        const { role, toolAccess } = req.body;
        if (!role) {
            throw new errorHandler_1.HttpError(400, "Role is required");
        }
        if (!["org_admin", "member"].includes(role)) {
            throw new errorHandler_1.HttpError(400, "Invalid role. Must be 'org_admin' or 'member'");
        }
        const user = await (0, userManagementService_1.updateUserRole)({
            tenantId: req.auth.tenantId,
            userId,
            role: role,
            toolAccess,
            updatedById: req.auth.userId,
        });
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
});
/**
 * DELETE /users/:userId
 * Remove a user from the tenant
 */
exports.userRouter.delete("/:userId", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId || !req.auth?.userId) {
            throw new errorHandler_1.HttpError(400, "Tenant context or user ID missing");
        }
        const { userId } = req.params;
        await (0, userManagementService_1.removeUserFromTenant)(req.auth.tenantId, userId, req.auth.userId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
/**
 * PATCH /users/:userId/tool-access
 * Update a user's tool access
 */
exports.userRouter.patch("/:userId/tool-access", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId || !req.auth?.userId) {
            throw new errorHandler_1.HttpError(400, "Tenant context or user ID missing");
        }
        const { userId } = req.params;
        const { toolAccess } = req.body;
        if (!toolAccess || typeof toolAccess !== "object") {
            throw new errorHandler_1.HttpError(400, "toolAccess object is required");
        }
        const user = await (0, userManagementService_1.updateUserToolAccess)({
            tenantId: req.auth.tenantId,
            userId,
            toolAccess,
            updatedById: req.auth.userId,
        });
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
});
/**
 * GET /users/roles
 * Get role definitions and permissions
 */
exports.userRouter.get("/roles", async (req, res, next) => {
    try {
        const definitions = (0, userManagementService_1.getRoleDefinitions)();
        res.json({ roles: definitions });
    }
    catch (error) {
        next(error);
    }
});
/**
 * GET /users/tools
 * Get available tools
 */
exports.userRouter.get("/tools", async (req, res, next) => {
    try {
        const tools = (0, userManagementService_1.getAvailableTools)();
        res.json({ tools });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=users.js.map