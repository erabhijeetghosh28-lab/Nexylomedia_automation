"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantUsageRepository = void 0;
const data_source_1 = require("../config/data-source");
const TenantUsage_1 = require("../entities/TenantUsage");
const tenantUsageRepository = () => data_source_1.AppDataSource.getRepository(TenantUsage_1.TenantUsage);
exports.tenantUsageRepository = tenantUsageRepository;
//# sourceMappingURL=tenantUsageRepository.js.map