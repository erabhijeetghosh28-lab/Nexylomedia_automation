"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = require("dotenv");
const envFile = process.env.APP_ENV === "test" ? ".env.test" : ".env";
const cwd = process.cwd();
const candidatePaths = [
    path_1.default.resolve(cwd, envFile),
    path_1.default.resolve(cwd, "..", envFile),
    path_1.default.resolve(cwd, "..", "..", envFile),
];
const envPath = candidatePaths.find((filePath) => fs_1.default.existsSync(filePath));
if (envPath) {
    (0, dotenv_1.config)({ path: envPath });
}
else {
    (0, dotenv_1.config)(); // fall back to default .env resolution
}
const requiredVars = ["JWT_SECRET", "DATABASE_URL"];
requiredVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});
exports.env = {
    env: process.env.APP_ENV ?? "development",
    port: Number(process.env.PORT ?? 4000),
    host: process.env.HOST ?? "0.0.0.0",
    logLevel: process.env.LOG_LEVEL ?? "info",
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
    storageProvider: process.env.STORAGE_PROVIDER ?? "minio",
    minio: {
        endpoint: process.env.MINIO_ENDPOINT ?? "http://localhost:9000",
        bucket: process.env.MINIO_BUCKET ?? "nexylomedia-local",
        accessKey: process.env.MINIO_ACCESS_KEY ?? "minioadmin",
        secretKey: process.env.MINIO_SECRET_KEY ?? "minioadmin",
        useSSL: process.env.MINIO_USE_SSL === "true",
    },
    geminiApiKey: process.env.GEMINI_API_KEY ?? "",
    groqApiKey: process.env.GROQ_API_KEY ?? "",
    pageSpeedApiKey: process.env.PAGESPEED_API_KEY ?? "",
    smtp: {
        host: process.env.SMTP_HOST ?? "mailhog-local",
        port: Number(process.env.SMTP_PORT ?? 1025),
    },
};
//# sourceMappingURL=env.js.map