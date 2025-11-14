"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireIntegration = void 0;
const integrationService_1 = require("../services/integrationService");
const requireIntegration = (provider, options) => {
    return async (req, res, next) => {
        const allowUserKey = options?.allowUserKey ?? true;
        // Try tenant integration first
        if (req.auth?.tenantId) {
            const tenantIntegration = await (0, integrationService_1.findIntegration)({
                tenantId: req.auth.tenantId,
                provider,
            });
            if (tenantIntegration) {
                req.integration = tenantIntegration;
                try {
                    req.integrationSecret = await (0, integrationService_1.getIntegrationSecret)(tenantIntegration);
                    return next();
                }
                catch (error) {
                    return res.status(500).json({
                        error: "Failed to retrieve integration secret",
                    });
                }
            }
        }
        // Fallback to user integration if allowed
        if (allowUserKey && req.auth?.userId) {
            const userIntegration = await (0, integrationService_1.findIntegration)({
                userId: req.auth.userId,
                provider,
            });
            if (userIntegration) {
                req.integration = userIntegration;
                try {
                    req.integrationSecret = await (0, integrationService_1.getIntegrationSecret)(userIntegration);
                    return next();
                }
                catch (error) {
                    return res.status(500).json({
                        error: "Failed to retrieve integration secret",
                    });
                }
            }
        }
        // No integration found
        return res.status(400).json({
            error: `No ${provider} API key configured for this org. Org Admin can add it in Settings → Integrations. You can also add a personal key in Settings → Integrations.`,
            provider,
            helpLink: "/settings/integrations",
        });
    };
};
exports.requireIntegration = requireIntegration;
//# sourceMappingURL=integrationGuard.js.map