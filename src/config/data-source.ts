import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../entities/User";
import { Tenant } from "../entities/Tenant";
import { UserTenant } from "../entities/UserTenant";
import { Project } from "../entities/Project";
import { ProjectDomain } from "../entities/ProjectDomain";
import { SitePage } from "../entities/SitePage";
import { SeoAudit } from "../entities/SeoAudit";
import { SeoIssue } from "../entities/SeoIssue";
import { SeoFix } from "../entities/SeoFix";
import { TenantPlan } from "../entities/TenantPlan";
import { TenantQuota } from "../entities/TenantQuota";
import { TenantUsage } from "../entities/TenantUsage";

export const AppDataSource = new DataSource({
  type: "mssql",
  url: env.databaseUrl,
  entities: [
    User,
    Tenant,
    UserTenant,
    Project,
    ProjectDomain,
    SitePage,
    SeoAudit,
    SeoIssue,
    SeoFix,
    TenantPlan,
    TenantQuota,
    TenantUsage,
  ],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: env.env === "development" ? ["error", "warn"] : false,
  options: {
    encrypt: false,
    trustServerCertificate: true, // Required for local SQL Server connections
    connectTimeout: 30000, // 30 seconds for initial connection
  },
  extra: {
    requestTimeout: 60000, // 60 seconds for query execution (default is 15000ms)
  },
});

export const initializeDatabase = async (): Promise<DataSource> => {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }
  return AppDataSource.initialize();
};

