"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoAuditRepository = void 0;
const data_source_1 = require("../config/data-source");
const SeoAudit_1 = require("../entities/SeoAudit");
const seoAuditRepository = () => data_source_1.AppDataSource.getRepository(SeoAudit_1.SeoAudit);
exports.seoAuditRepository = seoAuditRepository;
//# sourceMappingURL=seoAuditRepository.js.map