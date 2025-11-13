import { Queue } from "bullmq";
import { env } from "../config/env";

const connection = env.redisUrl;

export const queues = {
  pagespeed: new Queue("pagespeed", { connection }),
  gptFix: new Queue("gptFix", { connection }),
  prospect: new Queue("prospect", { connection }),
  reports: new Queue("reports", { connection }),
};

