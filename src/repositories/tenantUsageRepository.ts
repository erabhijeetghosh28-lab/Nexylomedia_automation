import { AppDataSource } from "../config/data-source";
import { TenantUsage } from "../entities/TenantUsage";

export const tenantUsageRepository = () =>
  AppDataSource.getRepository(TenantUsage);



