"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const tenantContext_1 = require("../middleware/tenantContext");
const featureGuard_1 = require("../middleware/featureGuard");
const integrationGuard_1 = require("../middleware/integrationGuard");
const seoAuditService_1 = require("../services/seoAuditService");
const seoIssueService_1 = require("../services/seoIssueService");
const parsers_1 = require("../utils/parsers");
const errorHandler_1 = require("../middleware/errorHandler");
exports.seoRouter = (0, express_1.Router)();
exports.seoRouter.use(auth_1.requireAuth);
exports.seoRouter.use(tenantContext_1.requireTenantContext);
exports.seoRouter.use((0, featureGuard_1.tenantFeatureGuard)("seo"));
// Audits
exports.seoRouter.post("/projects/:projectId/audits", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const pageId = (0, parsers_1.toOptionalString)(req.body?.pageId);
        const audit = await (0, seoAuditService_1.createAudit)({
            projectId: req.params.projectId,
            type: req.body?.type,
            pageId: pageId ?? null,
            trigger: req.body?.trigger,
        });
        res.status(201).json({ audit });
    }
    catch (error) {
        next(error);
    }
});
exports.seoRouter.get("/projects/:projectId/audits", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const pageId = (0, parsers_1.toOptionalString)(req.query?.pageId);
        const audits = await (0, seoAuditService_1.listAudits)(req.params.projectId, {
            type: req.query?.type,
            status: req.query?.status,
            pageId: pageId ?? null,
        });
        res.json({ audits });
    }
    catch (error) {
        next(error);
    }
});
exports.seoRouter.get("/projects/:projectId/audits/:auditId", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const audit = await (0, seoAuditService_1.getAuditById)(req.params.auditId, req.params.projectId);
        res.json({ audit });
    }
    catch (error) {
        next(error);
    }
});
exports.seoRouter.post("/projects/:projectId/audits/:auditId/run", (0, integrationGuard_1.requireIntegration)("pagespeed"), async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        // Pass integration secret to runAudit
        const apiKey = req.integrationSecret;
        if (!apiKey) {
            throw new errorHandler_1.HttpError(400, "Integration secret not available");
        }
        const audit = await (0, seoAuditService_1.runAudit)(req.params.auditId, apiKey);
        res.json({ audit });
    }
    catch (error) {
        next(error);
    }
});
// Issues
exports.seoRouter.get("/projects/:projectId/audits/:auditId/issues", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const severity = (0, parsers_1.toOptionalString)(req.query?.severity);
        const category = (0, parsers_1.toOptionalString)(req.query?.category);
        const issues = await (0, seoIssueService_1.listIssues)(req.params.auditId, {
            status: req.query?.status,
            severity: severity ?? null,
            category: category ?? null,
        });
        res.json({ issues });
    }
    catch (error) {
        next(error);
    }
});
exports.seoRouter.get("/projects/:projectId/audits/:auditId/issues/:issueId", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const issue = await (0, seoIssueService_1.getIssueById)(req.params.issueId, req.params.auditId);
        res.json({ issue });
    }
    catch (error) {
        next(error);
    }
});
exports.seoRouter.patch("/projects/:projectId/audits/:auditId/issues/:issueId/status", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const issue = await (0, seoIssueService_1.updateIssueStatus)(req.params.issueId, req.body?.status);
        res.json({ issue });
    }
    catch (error) {
        next(error);
    }
});
// Fixes
exports.seoRouter.post("/projects/:projectId/audits/:auditId/issues/:issueId/fixes", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const fix = await (0, seoIssueService_1.createFix)({
            issueId: req.params.issueId,
            provider: req.body?.provider ?? "manual",
            content: req.body?.content ?? {},
            createdById: req.auth.userId,
        });
        res.status(201).json({ fix });
    }
    catch (error) {
        next(error);
    }
});
exports.seoRouter.post("/projects/:projectId/audits/:auditId/issues/:issueId/fixes/generate", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const provider = (req.body?.provider ?? "gpt");
        // Require integration for the specific provider
        const integrationGuard = (0, integrationGuard_1.requireIntegration)(provider);
        await new Promise((resolve, reject) => {
            integrationGuard(req, res, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        const fix = await (0, seoIssueService_1.generateAiFix)(req.params.issueId, provider, req.integrationSecret);
        res.status(201).json({ fix });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=seo.js.map