import { createServer } from "http";
import { createApp } from "./app";
import { initializeDatabase } from "./config/data-source";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const startServer = async () => {
  try {
    await initializeDatabase();
    const app = createApp();
    const server = createServer(app);

    server.listen(env.port, env.host, () => {
      logger.info("Backend listening on http://%s:%d", env.host, env.port);
    });
  } catch (error) {
    logger.error("Fatal startup error: %s", (error as Error).message, {
      stack: (error as Error).stack,
    });
    process.exit(1);
  }
};

startServer();

