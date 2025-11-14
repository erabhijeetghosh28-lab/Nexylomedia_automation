"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const tenantContext_1 = require("../middleware/tenantContext");
const projectService_1 = require("../services/projectService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.projectRouter = (0, express_1.Router)();
exports.projectRouter.use(auth_1.requireAuth);
exports.projectRouter.use(tenantContext_1.requireTenantContext);
exports.projectRouter.get("/", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const projects = await (0, projectService_1.listProjectsForTenant)(req.auth.tenantId);
        res.json({ projects });
    }
    catch (error) {
        next(error);
    }
});
exports.projectRouter.get("/:projectId", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const project = await (0, projectService_1.getProjectForTenant)(req.auth.tenantId, req.params.projectId);
        res.json({ project });
    }
    catch (error) {
        next(error);
    }
});
exports.projectRouter.post("/", (0, auth_1.requireRole)("org_admin", "super_admin"), async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const name = toStringValue(req.body?.name);
        const description = toOptionalString(req.body?.description);
        const status = parseProjectStatus(req.body?.status);
        const projectInput = {
            tenantId: req.auth.tenantId,
            createdById: req.auth.userId,
            name,
        };
        if (description !== undefined) {
            projectInput.description = description;
        }
        if (status) {
            projectInput.status = status;
        }
        const project = await (0, projectService_1.createProject)(projectInput);
        res.status(201).json({ project });
    }
    catch (error) {
        next(error);
    }
});
exports.projectRouter.delete("/:projectId", (0, auth_1.requireRole)("org_admin", "super_admin"), async (req, res, next) => {
    try {
        const tenantId = req.auth?.tenantId;
        const projectId = req.params.projectId;
        if (!tenantId || !projectId) {
            throw new errorHandler_1.HttpError(400, "Tenant context or project ID missing");
        }
        await (0, projectService_1.deleteProject)(tenantId, projectId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.projectRouter.get("/:projectId/domains", async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const { projectId } = req.params;
        const domains = await (0, projectService_1.listDomainsForProject)(req.auth.tenantId, projectId);
        res.json({ domains });
    }
    catch (error) {
        next(error);
    }
});
exports.projectRouter.post("/:projectId/domains", (0, auth_1.requireRole)("member", "org_admin", "super_admin"), async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const { projectId } = req.params;
        const host = toStringValue(req.body?.host);
        const notes = toOptionalString(req.body?.notes);
        const domain = await (0, projectService_1.submitProjectDomain)({
            tenantId: req.auth.tenantId,
            projectId,
            submittedById: req.auth.userId,
            host,
            ...(notes !== undefined ? { notes } : {}),
        });
        res.status(201).json({ domain });
    }
    catch (error) {
        next(error);
    }
});
exports.projectRouter.patch("/:projectId/domains/:domainId", (0, auth_1.requireRole)("org_admin", "super_admin"), async (req, res, next) => {
    try {
        if (!req.auth?.tenantId) {
            throw new errorHandler_1.HttpError(400, "Tenant context missing");
        }
        const { projectId, domainId } = req.params;
        const status = parseDomainStatus(req.body?.status);
        const setPrimary = parseBoolean(req.body?.setPrimary);
        const notes = toOptionalString(req.body?.notes);
        const domain = await (0, projectService_1.reviewProjectDomain)({
            tenantId: req.auth.tenantId,
            projectId,
            domainId,
            reviewerId: req.auth.userId,
            status,
            ...(notes !== undefined ? { notes } : {}),
            setPrimary,
        });
        res.json({ domain });
    }
    catch (error) {
        next(error);
    }
});
const parseDomainStatus = (value) => {
    if (typeof value !== "string") {
        throw new errorHandler_1.HttpError(400, "Domain status is required");
    }
    const normalized = value.toLowerCase();
    const allowed = new Set(["approved", "rejected", "suspended"]);
    if (!allowed.has(normalized)) {
        throw new errorHandler_1.HttpError(400, "Invalid domain status");
    }
    return normalized;
};
const parseBoolean = (value) => {
    if (typeof value === "boolean")
        return value;
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (["true", "1", "yes", "y"].includes(normalized))
            return true;
        if (["false", "0", "no", "n", ""].includes(normalized))
            return false;
    }
    return false;
};
const toStringValue = (value) => {
    if (typeof value === "string") {
        return value;
    }
    return "";
};
const toOptionalString = (value) => {
    return typeof value === "string" ? value : undefined;
};
const parseProjectStatus = (value) => {
    if (typeof value !== "string")
        return undefined;
    const normalized = value.trim().toLowerCase();
    if (["active", "paused", "archived"].includes(normalized)) {
        return normalized;
    }
    return undefined;
};
//# sourceMappingURL=projects.js.map