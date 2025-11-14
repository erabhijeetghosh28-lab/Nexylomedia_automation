import { AppDataSource } from "../config/data-source";
import { ProjectDomain } from "../entities/ProjectDomain";

export const projectDomainRepository = () =>
  AppDataSource.getRepository(ProjectDomain);


