"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = exports.HttpError = void 0;
const logger_1 = require("../utils/logger");
class HttpError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.HttpError = HttpError;
const notFoundHandler = (req, res, next) => {
    const error = new HttpError(404, `Route ${req.method} ${req.path} not found`);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, req, res, _next) => {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err instanceof HttpError ? err.message : "Internal server error";
    logger_1.logger.error("Request failed %s %s -> %d %s", req.method, req.path, status, message, {
        stack: err instanceof Error ? err.stack : undefined,
    });
    res.status(status).json({
        error: {
            message,
        },
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map