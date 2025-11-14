"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipRepository = void 0;
const data_source_1 = require("../config/data-source");
const UserTenant_1 = require("../entities/UserTenant");
const membershipRepository = () => data_source_1.AppDataSource.getRepository(UserTenant_1.UserTenant);
exports.membershipRepository = membershipRepository;
//# sourceMappingURL=membershipRepository.js.map