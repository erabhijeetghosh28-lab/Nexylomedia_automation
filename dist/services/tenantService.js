"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTenantById = exports.createTenant = exports.tenantRepository = void 0;
const data_source_1 = require("../config/data-source");
const Tenant_1 = require("../entities/Tenant");
const slugify_1 = require("../utils/slugify");
const quotaService_1 = require("./quotaService");
const tenantRepository = () => data_source_1.AppDataSource.getRepository(Tenant_1.Tenant);
exports.tenantRepository = tenantRepository;
const createTenant = async (name) => {
    const repository = (0, exports.tenantRepository)();
    const tenant = repository.create({
        name,
        slug: `${(0, slugify_1.slugify)(name)}-${Date.now()}`,
    });
    const saved = await repository.save(tenant);
    await (0, quotaService_1.ensureQuotaAndUsage)(saved);
    return saved;
};
exports.createTenant = createTenant;
const findTenantById = async (id) => {
    return (0, exports.tenantRepository)().findOne({ where: { id } });
};
exports.findTenantById = findTenantById;
//# sourceMappingURL=tenantService.js.map