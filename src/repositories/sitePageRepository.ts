import { AppDataSource } from "../config/data-source";
import { SitePage } from "../entities/SitePage";

export const sitePageRepository = () =>
  AppDataSource.getRepository(SitePage);


