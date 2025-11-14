"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlan = exports.updatePlan = exports.createPlan = exports.listPlans = exports.getPlanById = exports.getPlanByKey = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const tenantPlanRepository_1 = require("../repositories/tenantPlanRepository");
const getPlanByKey = async (key) => {
    const plan = await (0, tenantPlanRepository_1.tenantPlanRepository)().findOne({
        where: { key },
    });
    if (!plan) {
        throw new errorHandler_1.HttpError(404, `Plan with key '${key}' not found`);
    }
    return plan;
};
exports.getPlanByKey = getPlanByKey;
const getPlanById = async (id) => {
    const plan = await (0, tenantPlanRepository_1.tenantPlanRepository)().findOne({
        where: { id },
    });
    if (!plan) {
        throw new errorHandler_1.HttpError(404, `Plan with id '${id}' not found`);
    }
    return plan;
};
exports.getPlanById = getPlanById;
const listPlans = async () => {
    return (0, tenantPlanRepository_1.tenantPlanRepository)().find({
        order: { monthlyPrice: "ASC" },
    });
};
exports.listPlans = listPlans;
const createPlan = async (params) => {
    const repo = (0, tenantPlanRepository_1.tenantPlanRepository)();
    // Check if key already exists
    if (params.key) {
        const existing = await repo.findOne({
            where: { key: params.key },
        });
        if (existing) {
            throw new errorHandler_1.HttpError(409, `Plan with key '${params.key}' already exists`);
        }
    }
    // Check if code already exists
    const existingCode = await repo.findOne({
        where: { code: params.code },
    });
    if (existingCode) {
        throw new errorHandler_1.HttpError(409, `Plan with code '${params.code}' already exists`);
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
exports.createPlan = createPlan;
const updatePlan = async (key, params) => {
    const repo = (0, tenantPlanRepository_1.tenantPlanRepository)();
    const plan = await (0, exports.getPlanByKey)(key);
    // Check if new key conflicts
    if (params.key && params.key !== key) {
        const existing = await repo.findOne({
            where: { key: params.key },
        });
        if (existing) {
            throw new errorHandler_1.HttpError(409, `Plan with key '${params.key}' already exists`);
        }
    }
    // Check if new code conflicts
    if (params.code && params.code !== plan.code) {
        const existingCode = await repo.findOne({
            where: { code: params.code },
        });
        if (existingCode) {
            throw new errorHandler_1.HttpError(409, `Plan with code '${params.code}' already exists`);
        }
    }
    // Update fields
    if (params.key !== undefined)
        plan.key = params.key;
    if (params.code !== undefined)
        plan.code = params.code;
    if (params.name !== undefined)
        plan.name = params.name;
    if (params.description !== undefined)
        plan.description = params.description;
    if (params.monthlyPrice !== undefined)
        plan.monthlyPrice = params.monthlyPrice;
    if (params.annualPrice !== undefined)
        plan.annualPrice = params.annualPrice;
    if (params.currency !== undefined)
        plan.currency = params.currency;
    if (params.allowedFeatures !== undefined)
        plan.allowedFeatures = params.allowedFeatures;
    if (params.quotas !== undefined)
        plan.quotas = params.quotas;
    if (params.isActive !== undefined)
        plan.isActive = params.isActive;
    return repo.save(plan);
};
exports.updatePlan = updatePlan;
const deletePlan = async (key) => {
    const plan = await (0, exports.getPlanByKey)(key);
    await (0, tenantPlanRepository_1.tenantPlanRepository)().remove(plan);
};
exports.deletePlan = deletePlan;
//# sourceMappingURL=planService.js.map