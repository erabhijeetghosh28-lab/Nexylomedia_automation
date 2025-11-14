"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usageLogRepository = void 0;
const data_source_1 = require("../config/data-source");
const UsageLog_1 = require("../entities/UsageLog");
const usageLogRepository = () => data_source_1.AppDataSource.getRepository(UsageLog_1.UsageLog);
exports.usageLogRepository = usageLogRepository;
//# sourceMappingURL=usageLogRepository.js.map