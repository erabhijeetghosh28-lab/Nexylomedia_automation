"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureFlagAuditRepository = void 0;
const data_source_1 = require("../config/data-source");
const FeatureFlagAudit_1 = require("../entities/FeatureFlagAudit");
const featureFlagAuditRepository = () => data_source_1.AppDataSource.getRepository(FeatureFlagAudit_1.FeatureFlagAudit);
exports.featureFlagAuditRepository = featureFlagAuditRepository;
//# sourceMappingURL=featureFlagAuditRepository.js.map