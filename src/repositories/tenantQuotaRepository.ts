import { AppDataSource } from "../config/data-source";
import { TenantQuota } from "../entities/TenantQuota";

export const tenantQuotaRepository = () =>
  AppDataSource.getRepository(TenantQuota);



