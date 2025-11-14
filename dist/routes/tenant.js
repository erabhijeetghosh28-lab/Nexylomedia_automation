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
exports.tenantRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const tenantContext_1 = require("../middleware/tenantContext");
const auth_2 = require("../middleware/auth");
const data_source_1 = require("../config/data-source");
const Tenant_1 = require("../entities/Tenant");
const errorHandler_1 = require("../middleware/errorHandler");
exports.tenantRouter = (0, express_1.Router)();
exports.tenantRouter.use(auth_1.requireAuth);
exports.tenantRouter.use(tenantContext_1.requireTenantContext);
// GET /api/tenant - View current tenant plan & features
exports.tenantRouter.get("/", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const tenantRepo = data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
        const tenant = await tenantRepo.findOne({
            where: { id: req.auth.tenantId },
            relations: ["plan", "quota", "usage"],
        });
        if (!tenant) {
            throw new errorHandler_1.HttpError(404, "Tenant not found");
        }
        res.json({
            tenant: {
                id: tenant.id,
                name: tenant.name,
                slug: tenant.slug,
                planKey: tenant.planKey,
                plan: tenant.plan
                    ? {
                        key: tenant.plan.key,
                        name: tenant.plan.name,
                        allowedFeatures: tenant.plan.allowedFeatures,
                        quotas: tenant.plan.quotas,
                    }
                    : null,
                featuresJson: tenant.featuresJson,
                quota: tenant.quota
                    ? {
                        maxProjects: tenant.quota.maxProjects,
                        maxDomains: tenant.quota.maxDomains,
                        maxMembers: tenant.quota.maxMembers,
                        maxOrgAdmins: tenant.quota.maxOrgAdmins,
                        maxAutomationsPerMonth: tenant.quota.maxAutomationsPerMonth,
                        billingStatus: tenant.quota.billingStatus,
                    }
                    : null,
                usage: tenant.usage
                    ? {
                        projectCount: tenant.usage.projectCount,
                        domainCount: tenant.usage.domainCount,
                        memberCount: tenant.usage.memberCount,
                        orgAdminCount: tenant.usage.orgAdminCount,
                        automationRunsThisMonth: tenant.usage.automationRunsThisMonth,
                    }
                    : null,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// PUT /api/tenant/plan - Request plan change (org admin only)
exports.tenantRouter.put("/plan", (0, auth_2.requireRole)("org_admin", "super_admin"), async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const { planKey } = req.body;
        if (!planKey) {
            throw new errorHandler_1.HttpError(400, "planKey is required");
        }
        const tenantRepo = data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
        const tenant = await tenantRepo.findOne({
            where: { id: req.auth.tenantId },
        });
        if (!tenant) {
            throw new errorHandler_1.HttpError(404, "Tenant not found");
        }
        // Verify plan exists
        const { getPlanByKey } = await Promise.resolve().then(() => __importStar(require("../services/planService")));
        await getPlanByKey(planKey);
        tenant.planKey = planKey;
        await tenantRepo.save(tenant);
        res.json({
            message: "Plan change requested. Super Admin approval may be required.",
            tenant: {
                id: tenant.id,
                planKey: tenant.planKey,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=tenant.js.map