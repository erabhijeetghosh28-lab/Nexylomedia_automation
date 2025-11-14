"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTenantContext = void 0;
const errorHandler_1 = require("./errorHandler");
const membershipRepository_1 = require("../repositories/membershipRepository");
const requireTenantContext = async (req, _res, next) => {
    if (!req.auth?.userId) {
        throw new errorHandler_1.HttpError(401, "Unauthorized");
    }
    // Individual users may have tenantId: null
    if (req.auth.tenantId !== undefined) {
        // tenantId can be null for individual users
        if (req.auth.role === "individual" && req.auth.tenantId === null) {
            return next(); // Allow individual users without tenant
        }
        if (req.auth.tenantId) {
            return next();
        }
    }
    const membership = await (0, membershipRepository_1.membershipRepository)().findOne({
        where: { user: { id: req.auth.userId } },
        relations: ["tenant", "tenant.plan"],
    });
    if (!membership) {
        // Individual users might not have membership
        if (req.auth.role === "individual") {
            req.auth.tenantId = null;
            return next();
        }
        throw new errorHandler_1.HttpError(403, "No tenant access");
    }
    if (req.auth) {
        req.auth.tenantId = membership.tenant?.id ?? null;
        req.auth.role = membership.role;
    }
    next();
};
exports.requireTenantContext = requireTenantContext;
//# sourceMappingURL=tenantContext.js.map