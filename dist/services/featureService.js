"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFeatureOverride = exports.getFeatureStatus = exports.getFeatureSource = exports.isFeatureEnabled = void 0;
const data_source_1 = require("../config/data-source");
const Tenant_1 = require("../entities/Tenant");
const errorHandler_1 = require("../middleware/errorHandler");
const usageService_1 = require("./usageService");
const isFeatureEnabled = async (tenantId, featureKey) => {
    const status = await (0, exports.getFeatureStatus)(tenantId, featureKey);
    return status.enabled;
};
exports.isFeatureEnabled = isFeatureEnabled;
const getFeatureSource = async (tenantId, featureKey) => {
    const status = await (0, exports.getFeatureStatus)(tenantId, featureKey);
    return status.source;
};
exports.getFeatureSource = getFeatureSource;
const getFeatureStatus = async (tenantId, featureKey) => {
    const tenantRepo = data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
    const tenant = await tenantRepo.findOne({
        where: { id: tenantId },
        relations: ["plan"],
    });
    if (!tenant) {
        throw new errorHandler_1.HttpError(404, "Tenant not found");
    }
    // Check tenant override first
    if (tenant.featuresJson && featureKey in tenant.featuresJson) {
        const enabled = tenant.featuresJson[featureKey] === true;
        return {
            enabled,
            source: "override",
        };
    }
    // Check plan default
    if (tenant.planKey && tenant.plan) {
        const plan = tenant.plan;
        const planAllowed = plan.allowedFeatures?.[featureKey] === true;
        // Check quota if feature is enabled
        let quotaLeft;
        if (planAllowed && plan.quotas) {
            // Try to find quota metric for this feature
            const quotaKey = `${featureKey}_runs_month`; // e.g., "seo_runs_month"
            const quotaLimit = plan.quotas[quotaKey];
            if (quotaLimit !== undefined) {
                const usage = await usageService_1.usageService.getUsage(tenantId, quotaKey, new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
                quotaLeft = Math.max(0, quotaLimit - usage);
            }
        }
        return {
            enabled: planAllowed,
            source: "plan",
            ...(quotaLeft !== undefined ? { quotaLeft } : {}),
        };
    }
    // No plan assigned - feature disabled
    return {
        enabled: false,
        source: null,
    };
};
exports.getFeatureStatus = getFeatureStatus;
const setFeatureOverride = async (tenantId, featureKey, enabled, userId, reason) => {
    const tenantRepo = data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
    const auditRepo = data_source_1.AppDataSource.getRepository((await Promise.resolve().then(() => __importStar(require("../entities/FeatureFlagAudit")))).FeatureFlagAudit);
    const tenant = await tenantRepo.findOne({
        where: { id: tenantId },
    });
    if (!tenant) {
        throw new errorHandler_1.HttpError(404, "Tenant not found");
    }
    // Update features_json
    const featuresJson = tenant.featuresJson ?? {};
    featuresJson[featureKey] = enabled;
    tenant.featuresJson = featuresJson;
    await tenantRepo.save(tenant);
    // Audit log
    const audit = auditRepo.create({
        tenant,
        flagKey: featureKey,
        enabledBy: { id: userId },
        enabledAt: new Date(),
        reason: reason ?? null,
    });
    await auditRepo.save(audit);
};
exports.setFeatureOverride = setFeatureOverride;
//# sourceMappingURL=featureService.js.map