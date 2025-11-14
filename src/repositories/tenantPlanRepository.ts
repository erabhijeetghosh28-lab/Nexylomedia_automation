import { AppDataSource } from "../config/data-source";
import { TenantPlan } from "../entities/TenantPlan";

export const tenantPlanRepository = () =>
  AppDataSource.getRepository(TenantPlan);



