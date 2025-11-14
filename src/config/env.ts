import path from "path";
import fs from "fs";
import { config as loadEnv } from "dotenv";

const envFile = process.env.APP_ENV === "test" ? ".env.test" : ".env";
const cwd = process.cwd();
const candidatePaths = [
  path.resolve(cwd, envFile),
  path.resolve(cwd, "..", envFile),
  path.resolve(cwd, "..", "..", envFile),
];

const envPath = candidatePaths.find((filePath) => fs.existsSync(filePath));

if (envPath) {
  loadEnv({ path: envPath });
} else {
  loadEnv(); // fall back to default .env resolution
}

const requiredVars = ["JWT_SECRET", "DATABASE_URL"];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  env: process.env.APP_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  host: process.env.HOST ?? "0.0.0.0",
  logLevel: process.env.LOG_LEVEL ?? "info",
  jwtSecret: process.env.JWT_SECRET as string,
  databaseUrl: process.env.DATABASE_URL as string,
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

