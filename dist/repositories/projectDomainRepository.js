"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectDomainRepository = void 0;
const data_source_1 = require("../config/data-source");
const ProjectDomain_1 = require("../entities/ProjectDomain");
const projectDomainRepository = () => data_source_1.AppDataSource.getRepository(ProjectDomain_1.ProjectDomain);
exports.projectDomainRepository = projectDomainRepository;
//# sourceMappingURL=projectDomainRepository.js.map