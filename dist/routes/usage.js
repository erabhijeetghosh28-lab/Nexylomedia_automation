"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usageRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const tenantContext_1 = require("../middleware/tenantContext");
const usageService_1 = require("../services/usageService");
const featureService_1 = require("../services/featureService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.usageRouter = (0, express_1.Router)();
exports.usageRouter.use(auth_1.requireAuth);
exports.usageRouter.use(tenantContext_1.requireTenantContext);
// GET /api/usage?tenantId= - Get usage for tenant
exports.usageRouter.get("/", async (req, res, next) => {
    try {
        const tenantId = req.query.tenantId || req.auth?.tenantId;
        if (!tenantId) {
            throw new errorHandler_1.HttpError(400, "tenantId is required");
        }
        // Check permissions - only org_admin, super_admin, or own tenant
        if (req.auth?.role !== "super_admin" &&
            req.auth?.tenantId !== tenantId) {
            throw new errorHandler_1.HttpError(403, "Cannot view usage for another tenant");
        }
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const usage = await usageService_1.usageService.getUsageForPeriod(tenantId, periodStart, periodEnd);
        res.json({
            tenantId,
            period: {
                start: periodStart,
                end: periodEnd,
            },
            usage,
        });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/feature-status/:featureKey?tenantId= - Get feature status
exports.usageRouter.get("/feature-status/:featureKey", async (req, res, next) => {
    try {
        const featureKey = req.params.featureKey;
        const tenantId = req.query.tenantId || req.auth?.tenantId;
        if (!tenantId) {
            throw new errorHandler_1.HttpError(400, "tenantId is required");
        }
        // Check permissions
        if (req.auth?.role !== "super_admin" &&
            req.auth?.tenantId !== tenantId) {
            throw new errorHandler_1.HttpError(403, "Cannot view feature status for another tenant");
        }
        const status = await (0, featureService_1.getFeatureStatus)(tenantId, featureKey);
        res.json({
            featureKey,
            tenantId,
            ...status,
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=usage.js.map