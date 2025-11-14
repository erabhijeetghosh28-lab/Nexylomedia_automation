import { AppDataSource } from "../config/data-source";
import { SeoFix } from "../entities/SeoFix";

export const seoFixRepository = () => AppDataSource.getRepository(SeoFix);


