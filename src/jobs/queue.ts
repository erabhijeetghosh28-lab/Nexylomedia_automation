import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env";

const connection = new IORedis(env.redisUrl);

export const queues = {
  pagespeed: new Queue("pagespeed", { connection }),
  gptFix: new Queue("gptFix", { connection }),
  prospect: new Queue("prospect", { connection }),
  reports: new Queue("reports", { connection }),
};

