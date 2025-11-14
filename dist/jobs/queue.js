"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queues = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const connection = new ioredis_1.default(env_1.env.redisUrl);
exports.queues = {
    pagespeed: new bullmq_1.Queue("pagespeed", { connection }),
    gptFix: new bullmq_1.Queue("gptFix", { connection }),
    prospect: new bullmq_1.Queue("prospect", { connection }),
    reports: new bullmq_1.Queue("reports", { connection }),
};
//# sourceMappingURL=queue.js.map