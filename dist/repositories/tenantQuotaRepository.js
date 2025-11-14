"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantQuotaRepository = void 0;
const data_source_1 = require("../config/data-source");
const TenantQuota_1 = require("../entities/TenantQuota");
const tenantQuotaRepository = () => data_source_1.AppDataSource.getRepository(TenantQuota_1.TenantQuota);
exports.tenantQuotaRepository = tenantQuotaRepository;
//# sourceMappingURL=tenantQuotaRepository.js.map