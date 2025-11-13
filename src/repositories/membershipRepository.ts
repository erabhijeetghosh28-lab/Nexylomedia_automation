import { AppDataSource } from "../config/data-source";
import { UserTenant } from "../entities/UserTenant";

export const membershipRepository = () =>
  AppDataSource.getRepository(UserTenant);

