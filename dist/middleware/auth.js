"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const token_1 = require("../utils/token");
const errorHandler_1 = require("./errorHandler");
const requireAuth = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw new errorHandler_1.HttpError(401, "Missing authorization header");
    }
    try {
        const token = header.substring("Bearer ".length);
        req.auth = (0, token_1.verifyToken)(token);
        next();
    }
    catch {
        throw new errorHandler_1.HttpError(401, "Invalid or expired token");
    }
};
exports.requireAuth = requireAuth;
const requireRole = (...roles) => (req, _res, next) => {
    if (!req.auth)
        throw new errorHandler_1.HttpError(401, "Unauthorized");
    if (roles.length && !roles.includes(req.auth.role ?? "")) {
        throw new errorHandler_1.HttpError(403, "Forbidden");
    }
    next();
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map