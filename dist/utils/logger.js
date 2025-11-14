"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const env_1 = require("../config/env");
exports.logger = (0, winston_1.createLogger)({
    level: env_1.env.logLevel,
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: "HH:mm:ss" }), winston_1.format.printf(({ timestamp, level, message, stack }) => `${timestamp} [${level}] ${stack ?? message}`)),
        }),
    ],
});
//# sourceMappingURL=logger.js.map