"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRepository = void 0;
const data_source_1 = require("../config/data-source");
const Project_1 = require("../entities/Project");
const projectRepository = () => data_source_1.AppDataSource.getRepository(Project_1.Project);
exports.projectRepository = projectRepository;
//# sourceMappingURL=projectRepository.js.map