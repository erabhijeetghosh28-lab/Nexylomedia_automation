"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationRepository = void 0;
const data_source_1 = require("../config/data-source");
const Integration_1 = require("../entities/Integration");
const integrationRepository = () => data_source_1.AppDataSource.getRepository(Integration_1.Integration);
exports.integrationRepository = integrationRepository;
//# sourceMappingURL=integrationRepository.js.map