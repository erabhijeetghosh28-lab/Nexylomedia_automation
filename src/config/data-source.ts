import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../entities/User";
import { Tenant } from "../entities/Tenant";
import { UserTenant } from "../entities/UserTenant";

export const AppDataSource = new DataSource({
  type: "mssql",
  url: env.databaseUrl,
  entities: [User, Tenant, UserTenant],
  synchronize: false,
  logging: env.env === "development" ? ["error", "warn"] : false,
  options: {
    encrypt: false,
  },
});

export const initializeDatabase = async (): Promise<DataSource> => {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }
  return AppDataSource.initialize();
};

