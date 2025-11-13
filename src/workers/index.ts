import { Worker } from "bullmq";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const queues = ["pagespeed", "gptFix", "prospect", "reports"];

queues.forEach((queueName) => {
  const worker = new Worker(
    queueName,
    async (job) => {
      logger.info("Worker %s received job %s", queueName, job.id);
      // Placeholder handler
    },
    {
      connection: env.redisUrl,
    } as any,
  );

  worker.on("completed", (job) => {
    logger.info("Worker %s completed job %s", queueName, job.id);
  });

  worker.on("failed", (job, err) => {
    logger.error("Worker %s failed job %s: %s", queueName, job?.id, err.message);
  });
});

logger.info("Workers initialised for queues: %s", queues.join(", "));

