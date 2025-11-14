"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sitePageRepository = void 0;
const data_source_1 = require("../config/data-source");
const SitePage_1 = require("../entities/SitePage");
const sitePageRepository = () => data_source_1.AppDataSource.getRepository(SitePage_1.SitePage);
exports.sitePageRepository = sitePageRepository;
//# sourceMappingURL=sitePageRepository.js.map