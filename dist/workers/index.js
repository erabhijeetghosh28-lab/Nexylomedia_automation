"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const queues = ["pagespeed", "gptFix", "prospect", "reports"];
queues.forEach((queueName) => {
    const worker = new bullmq_1.Worker(queueName, async (job) => {
        logger_1.logger.info("Worker %s received job %s", queueName, job.id);
        // Placeholder handler
    }, {
        connection: env_1.env.redisUrl,
    });
    worker.on("completed", (job) => {
        logger_1.logger.info("Worker %s completed job %s", queueName, job.id);
    });
    worker.on("failed", (job, err) => {
        logger_1.logger.error("Worker %s failed job %s: %s", queueName, job?.id, err.message);
    });
});
logger_1.logger.info("Workers initialised for queues: %s", queues.join(", "));
//# sourceMappingURL=index.js.map