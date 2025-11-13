import { createLogger, format, transports } from "winston";
import { env } from "../config/env";

export const logger = createLogger({
  level: env.logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "HH:mm:ss" }),
        format.printf(
          ({ timestamp, level, message, stack }) =>
            `${timestamp} [${level}] ${stack ?? message}`,
        ),
      ),
    }),
  ],
});

