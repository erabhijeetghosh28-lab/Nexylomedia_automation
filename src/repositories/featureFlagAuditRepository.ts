import { AppDataSource } from "../config/data-source";
import { FeatureFlagAudit } from "../entities/FeatureFlagAudit";

export const featureFlagAuditRepository = () =>
  AppDataSource.getRepository(FeatureFlagAudit);

