"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoIssueRepository = void 0;
const data_source_1 = require("../config/data-source");
const SeoIssue_1 = require("../entities/SeoIssue");
const seoIssueRepository = () => data_source_1.AppDataSource.getRepository(SeoIssue_1.SeoIssue);
exports.seoIssueRepository = seoIssueRepository;
//# sourceMappingURL=seoIssueRepository.js.map