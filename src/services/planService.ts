import { AppDataSource } from "../config/data-source";
import { TenantPlan } from "../entities/TenantPlan";
import { HttpError } from "../middleware/errorHandler";
import { tenantPlanRepository } from "../repositories/tenantPlanRepository";

export type CreatePlanParams = {
  key: string;
  code: string;
  name: string;
  description?: string;
  monthlyPrice?: number;
  annualPrice?: number;
  currency?: string;
  allowedFeatures?: Record<string, boolean>;
  quotas?: Record<string, number>;
  isActive?: boolean;
};

export type UpdatePlanParams = Partial<CreatePlanParams>;

export const getPlanByKey = async (key: string): Promise<TenantPlan> => {
  const plan = await tenantPlanRepository().findOne({
    where: { key },
  });

  if (!plan) {
    throw new HttpError(404, `Plan with key '${key}' not found`);
  }

  return plan;
};

export const getPlanById = async (id: string): Promise<TenantPlan> => {
  const plan = await tenantPlanRepository().findOne({
    where: { id },
  });

  if (!plan) {
    throw new HttpError(404, `Plan with id '${id}' not found`);
  }

  return plan;
};

export const listPlans = async (): Promise<TenantPlan[]> => {
  return tenantPlanRepository().find({
    order: { monthlyPrice: "ASC" },
  });
};

export const createPlan = async (
  params: CreatePlanParams,
): Promise<TenantPlan> => {
  const repo = tenantPlanRepository();

  // Check if key already exists
  if (params.key) {
    const existing = await repo.findOne({
      where: { key: params.key },
    });
    if (existing) {
      throw new HttpError(409, `Plan with key '${params.key}' already exists`);
    }
  }

  // Check if code already exists
  const existingCode = await repo.findOne({
    where: { code: params.code },
  });
  if (existingCode) {
    throw new HttpError(409, `Plan with code '${params.code}' already exists`);
  }

  const plan = repo.create({
    key: params.key,
    code: params.code,
    name: params.name,
    description: params.description ?? null,
    monthlyPrice: params.monthlyPrice ?? 0,
    annualPrice: params.annualPrice ?? 0,
    currency: params.currency ?? "USD",
    allowedFeatures: params.allowedFeatures ?? null,
    quotas: params.quotas ?? null,
    isActive: params.isActive ?? true,
  });

  return repo.save(plan);
};

export const updatePlan = async (
  key: string,
  params: UpdatePlanParams,
): Promise<TenantPlan> => {
  const repo = tenantPlanRepository();
  const plan = await getPlanByKey(key);

  // Check if new key conflicts
  if (params.key && params.key !== key) {
    const existing = await repo.findOne({
      where: { key: params.key },
    });
    if (existing) {
      throw new HttpError(409, `Plan with key '${params.key}' already exists`);
    }
  }

  // Check if new code conflicts
  if (params.code && params.code !== plan.code) {
    const existingCode = await repo.findOne({
      where: { code: params.code },
    });
    if (existingCode) {
      throw new HttpError(409, `Plan with code '${params.code}' already exists`);
    }
  }

  // Update fields
  if (params.key !== undefined) plan.key = params.key;
  if (params.code !== undefined) plan.code = params.code;
  if (params.name !== undefined) plan.name = params.name;
  if (params.description !== undefined) plan.description = params.description;
  if (params.monthlyPrice !== undefined) plan.monthlyPrice = params.monthlyPrice;
  if (params.annualPrice !== undefined) plan.annualPrice = params.annualPrice;
  if (params.currency !== undefined) plan.currency = params.currency;
  if (params.allowedFeatures !== undefined)
    plan.allowedFeatures = params.allowedFeatures;
  if (params.quotas !== undefined) plan.quotas = params.quotas;
  if (params.isActive !== undefined) plan.isActive = params.isActive;

  return repo.save(plan);
};

export const deletePlan = async (key: string): Promise<void> => {
  const plan = await getPlanByKey(key);
  await tenantPlanRepository().remove(plan);
};

