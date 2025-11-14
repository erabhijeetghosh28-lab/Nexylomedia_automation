import { AppDataSource } from "../config/data-source";
import { SeoAudit } from "../entities/SeoAudit";

export const seoAuditRepository = () =>
  AppDataSource.getRepository(SeoAudit);


