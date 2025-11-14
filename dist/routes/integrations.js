"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const integrationService_1 = require("../services/integrationService");
const errorHandler_1 = require("../middleware/errorHandler");
const integrationRepository_1 = require("../repositories/integrationRepository");
exports.integrationRouter = (0, express_1.Router)();
exports.integrationRouter.use(auth_1.requireAuth);
// GET /api/integrations - List integrations (org admin sees tenant, user sees their own)
exports.integrationRouter.get("/", async (req, res, next) => {
    try {
        const repo = (0, integrationRepository_1.integrationRepository)();
        const where = {};
        if (req.auth?.role === "org_admin" || req.auth?.role === "super_admin") {
            // Org admins see tenant integrations
            if (req.auth.tenantId) {
                where.tenant = { id: req.auth.tenantId };
            }
        }
        else {
            // Users see their own integrations
            if (req.auth?.userId) {
                where.user = { id: req.auth.userId };
            }
        }
        const integrations = await repo.find({
            where,
            relations: ["tenant", "user"],
            order: { createdAt: "DESC" },
        });
        // Return masked keys only
        res.json({
            integrations: integrations.map((integration) => ({
                id: integration.id,
                provider: integration.provider,
                keyMask: (0, integrationService_1.getMaskedKey)(integration),
                scope: integration.scope,
                status: integration.status,
                configJson: integration.configJson,
                createdAt: integration.createdAt,
                updatedAt: integration.updatedAt,
            })),
        });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/integrations - Create integration (org admin creates tenant, user creates personal)
exports.integrationRouter.post("/", async (req, res, next) => {
    try {
        if (!req.auth?.userId) {
            throw new errorHandler_1.HttpError(401, "Unauthorized");
        }
        const { provider, secret, scope, configJson } = req.body;
        if (!provider || !secret) {
            throw new errorHandler_1.HttpError(400, "Provider and secret are required");
        }
        // Determine scope
        let finalScope = scope || "user";
        if (req.auth.role === "org_admin" || req.auth.role === "super_admin") {
            // Org admins can create tenant-scoped integrations
            if (scope === "tenant" && req.auth.tenantId) {
                finalScope = "tenant";
            }
        }
        else {
            // Regular users can only create user-scoped
            finalScope = "user";
        }
        const integration = await (0, integrationService_1.createIntegration)({
            ...(finalScope === "tenant" && req.auth.tenantId ? { tenantId: req.auth.tenantId } : {}),
            ...(finalScope === "user" && req.auth.userId ? { userId: req.auth.userId } : {}),
            provider,
            secret,
            scope: finalScope,
            configJson,
        });
        res.status(201).json({
            integration: {
                id: integration.id,
                provider: integration.provider,
                keyMask: (0, integrationService_1.getMaskedKey)(integration),
                scope: integration.scope,
                status: integration.status,
                configJson: integration.configJson,
                createdAt: integration.createdAt,
                updatedAt: integration.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/integrations/:id/test - Test integration
exports.integrationRouter.post("/:id/test", async (req, res, next) => {
    try {
        const result = await (0, integrationService_1.testIntegration)(req.params.id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
// DELETE /api/integrations/:id - Delete integration
exports.integrationRouter.delete("/:id", async (req, res, next) => {
    try {
        // Verify ownership
        const repo = (0, integrationRepository_1.integrationRepository)();
        const integration = await repo.findOne({
            where: { id: req.params.id },
            relations: ["tenant", "user"],
        });
        if (!integration) {
            throw new errorHandler_1.HttpError(404, "Integration not found");
        }
        // Check permissions
        if (integration.scope === "tenant") {
            if (req.auth?.role !== "org_admin" &&
                req.auth?.role !== "super_admin") {
                throw new errorHandler_1.HttpError(403, "Only org admins can delete tenant integrations");
            }
            if (integration.tenant?.id !== req.auth?.tenantId) {
                throw new errorHandler_1.HttpError(403, "Cannot delete integration from another tenant");
            }
        }
        else {
            if (integration.user?.id !== req.auth?.userId) {
                throw new errorHandler_1.HttpError(403, "Cannot delete another user's integration");
            }
        }
        await (0, integrationService_1.deleteIntegration)(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
// GET /api/me/integrations - User's personal integrations
exports.integrationRouter.get("/me", async (req, res, next) => {
    try {
        if (!req.auth?.userId) {
            throw new errorHandler_1.HttpError(401, "Unauthorized");
        }
        const repo = (0, integrationRepository_1.integrationRepository)();
        const integrations = await repo.find({
            where: {
                user: { id: req.auth.userId },
                scope: "user",
            },
            order: { createdAt: "DESC" },
        });
        res.json({
            integrations: integrations.map((integration) => ({
                id: integration.id,
                provider: integration.provider,
                keyMask: (0, integrationService_1.getMaskedKey)(integration),
                scope: integration.scope,
                status: integration.status,
                configJson: integration.configJson,
                createdAt: integration.createdAt,
                updatedAt: integration.updatedAt,
            })),
        });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/me/integrations - Create user's personal integration
exports.integrationRouter.post("/me", async (req, res, next) => {
    try {
        if (!req.auth?.userId) {
            throw new errorHandler_1.HttpError(401, "Unauthorized");
        }
        const { provider, secret, configJson } = req.body;
        if (!provider || !secret) {
            throw new errorHandler_1.HttpError(400, "Provider and secret are required");
        }
        const integration = await (0, integrationService_1.createIntegration)({
            userId: req.auth.userId,
            provider,
            secret,
            scope: "user",
            configJson,
        });
        res.status(201).json({
            integration: {
                id: integration.id,
                provider: integration.provider,
                keyMask: (0, integrationService_1.getMaskedKey)(integration),
                scope: integration.scope,
                status: integration.status,
                configJson: integration.configJson,
                createdAt: integration.createdAt,
                updatedAt: integration.updatedAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// DELETE /api/me/integrations/:id - Delete user's personal integration
exports.integrationRouter.delete("/me/:id", async (req, res, next) => {
    try {
        if (!req.auth?.userId) {
            throw new errorHandler_1.HttpError(401, "Unauthorized");
        }
        const repo = (0, integrationRepository_1.integrationRepository)();
        const integration = await repo.findOne({
            where: { id: req.params.id },
            relations: ["user"],
        });
        if (!integration) {
            throw new errorHandler_1.HttpError(404, "Integration not found");
        }
        if (integration.user?.id !== req.auth.userId) {
            throw new errorHandler_1.HttpError(403, "Cannot delete another user's integration");
        }
        if (integration.scope !== "user") {
            throw new errorHandler_1.HttpError(403, "Cannot delete tenant integration via this endpoint");
        }
        await (0, integrationService_1.deleteIntegration)(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=integrations.js.map