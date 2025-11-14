"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantFeatureGuard = void 0;
const errorHandler_1 = require("./errorHandler");
const featureService_1 = require("../services/featureService");
const tenantFeatureGuard = (featureKey) => {
    return async (req, res, next) => {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context required for feature check");
        }
        try {
            const enabled = await (0, featureService_1.isFeatureEnabled)(req.auth.tenantId, featureKey);
            if (!enabled) {
                return res.status(403).json({
                    error: `Feature '${featureKey}' is disabled on your plan. Contact Super Admin or upgrade.`,
                    feature: featureKey,
                    upgradeLink: "/admin/plans",
                });
            }
            next();
        }
        catch (error) {
            if (error instanceof errorHandler_1.HttpError) {
                throw error;
            }
            throw new errorHandler_1.HttpError(500, "Failed to check feature status");
        }
    };
};
exports.tenantFeatureGuard = tenantFeatureGuard;
//# sourceMappingURL=featureGuard.js.map