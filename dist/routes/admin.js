"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminTenantService_1 = require("../services/adminTenantService");
const planService_1 = require("../services/planService");
const featureService_1 = require("../services/featureService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.use(auth_1.requireAuth);
exports.adminRouter.use((0, auth_1.requireRole)("super_admin"));
exports.adminRouter.post("/tenants", async (req, res, next) => {
    try {
        const tenant = await (0, adminTenantService_1.createTenantForAdmin)(req.body ?? {});
        res.status(201).json({ tenant });
    }
    catch (error) {
        next(error);
    }
});
exports.adminRouter.get("/tenants", async (_req, res, next) => {
    try {
        const tenants = await (0, adminTenantService_1.listTenantsForAdmin)();
        res.json({ tenants });
    }
    catch (error) {
        next(error);
    }
});
exports.adminRouter.get("/tenants/:tenantId", async (req, res, next) => {
    try {
        const tenant = await (0, adminTenantService_1.getTenantDetailForAdmin)(req.params.tenantId);
        res.json({ tenant });
    }
    catch (error) {
        next(error);
    }
});
exports.adminRouter.patch("/tenants/:tenantId/quota", async (req, res, next) => {
    try {
        const tenant = await (0, adminTenantService_1.updateTenantQuota)(req.params.tenantId, req.body ?? {});
        res.json({ tenant });
    }
    catch (error) {
        next(error);
    }
});
// Plan management endpoints
exports.adminRouter.get("/plans", async (req, res, next) => {
    try {
        const plans = await (0, planService_1.listPlans)();
        res.json({ plans });
    }
    catch (error) {
        next(error);
    }
});
exports.adminRouter.post("/plans", async (req, res, next) => {
    try {
        // Support both old and new format
        const body = req.body ?? {};
        if (body.code && !body.key) {
            // Old format - use createTenantPlan
            const plan = await (0, adminTenantService_1.createTenantPlan)(body);
            res.status(201).json({ plan });
        }
        else {
            // New format - use createPlan
            const plan = await (0, planService_1.createPlan)(body);
            res.status(201).json({ plan });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.adminRouter.put("/plans/:key", async (req, res, next) => {
    try {
        const plan = await (0, planService_1.updatePlan)(req.params.key, req.body ?? {});
        res.json({ plan });
    }
    catch (error) {
        next(error);
    }
});
exports.adminRouter.get("/plans/:key", async (req, res, next) => {
    try {
        const plan = await (0, planService_1.getPlanByKey)(req.params.key);
        res.json({ plan });
    }
    catch (error) {
        next(error);
    }
});
// Feature override endpoint
exports.adminRouter.post("/tenants/:tenantId/feature-override", async (req, res, next) => {
    try {
        if (!req.auth?.userId) {
            throw new errorHandler_1.HttpError(401, "Unauthorized");
        }
        const { featureKey, enabled, reason } = req.body;
        if (!featureKey || typeof enabled !== "boolean") {
            throw new errorHandler_1.HttpError(400, "featureKey and enabled (boolean) are required");
        }
        await (0, featureService_1.setFeatureOverride)(req.params.tenantId, featureKey, enabled, req.auth.userId, reason);
        res.json({
            message: `Feature '${featureKey}' ${enabled ? "enabled" : "disabled"} for tenant`,
            tenantId: req.params.tenantId,
            featureKey,
            enabled,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.adminRouter.patch("/tenants/:tenantId/org-admin", async (req, res, next) => {
    try {
        const tenant = await (0, adminTenantService_1.updateTenantOrgAdmin)(req.params.tenantId, req.body ?? {});
        res.json({ tenant });
    }
    catch (error) {
        next(error);
    }
});
exports.adminRouter.patch("/tenants/:tenantId/api-keys", async (req, res, next) => {
    try {
        const tenant = await (0, adminTenantService_1.updateTenantApiKeys)(req.params.tenantId, req.body ?? {});
        res.json({ tenant });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=admin.js.map