import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entities/Tenant";
import { slugify } from "../utils/slugify";
import { ensureQuotaAndUsage } from "./quotaService";

export const tenantRepository = () => AppDataSource.getRepository(Tenant);

export const createTenant = async (name: string): Promise<Tenant> => {
  const repository = tenantRepository();
  const tenant = repository.create({
    name,
    slug: `${slugify(name)}-${Date.now()}`,
  });
  const saved = await repository.save(tenant);
  await ensureQuotaAndUsage(saved);
  return saved;
};

export const findTenantById = async (id: string): Promise<Tenant | null> => {
  return tenantRepository().findOne({ where: { id } });
};

