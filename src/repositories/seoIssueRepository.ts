import { AppDataSource } from "../config/data-source";
import { SeoIssue } from "../entities/SeoIssue";

export const seoIssueRepository = () =>
  AppDataSource.getRepository(SeoIssue);


