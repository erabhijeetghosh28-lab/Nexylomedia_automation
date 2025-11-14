import { AppDataSource } from "../config/data-source";
import { UsageLog } from "../entities/UsageLog";

export const usageLogRepository = () =>
  AppDataSource.getRepository(UsageLog);

