"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = require("./app");
const data_source_1 = require("./config/data-source");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const startServer = async () => {
    try {
        await (0, data_source_1.initializeDatabase)();
        const app = (0, app_1.createApp)();
        const server = (0, http_1.createServer)(app);
        server.listen(env_1.env.port, env_1.env.host, () => {
            logger_1.logger.info("Backend listening on http://%s:%d", env_1.env.host, env_1.env.port);
        });
    }
    catch (error) {
        logger_1.logger.error("Fatal startup error: %s", error.message, {
            stack: error.stack,
        });
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=main.js.map