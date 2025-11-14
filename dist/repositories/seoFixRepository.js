"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoFixRepository = void 0;
const data_source_1 = require("../config/data-source");
const SeoFix_1 = require("../entities/SeoFix");
const seoFixRepository = () => data_source_1.AppDataSource.getRepository(SeoFix_1.SeoFix);
exports.seoFixRepository = seoFixRepository;
//# sourceMappingURL=seoFixRepository.js.map