import { AppDataSource } from "../config/data-source";
import { Integration } from "../entities/Integration";

export const integrationRepository = () =>
  AppDataSource.getRepository(Integration);

