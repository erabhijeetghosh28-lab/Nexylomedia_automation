"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantPlanRepository = void 0;
const data_source_1 = require("../config/data-source");
const TenantPlan_1 = require("../entities/TenantPlan");
const tenantPlanRepository = () => data_source_1.AppDataSource.getRepository(TenantPlan_1.TenantPlan);
exports.tenantPlanRepository = tenantPlanRepository;
//# sourceMappingURL=tenantPlanRepository.js.map