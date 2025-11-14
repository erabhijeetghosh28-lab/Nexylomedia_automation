"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const env_1 = require("./env");
const User_1 = require("../entities/User");
const Tenant_1 = require("../entities/Tenant");
const UserTenant_1 = require("../entities/UserTenant");
const Project_1 = require("../entities/Project");
const ProjectDomain_1 = require("../entities/ProjectDomain");
const SitePage_1 = require("../entities/SitePage");
const SeoAudit_1 = require("../entities/SeoAudit");
const SeoIssue_1 = require("../entities/SeoIssue");
const SeoFix_1 = require("../entities/SeoFix");
const TenantPlan_1 = require("../entities/TenantPlan");
const TenantQuota_1 = require("../entities/TenantQuota");
const TenantUsage_1 = require("../entities/TenantUsage");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mssql",
    url: env_1.env.databaseUrl,
    entities: [
        User_1.User,
        Tenant_1.Tenant,
        UserTenant_1.UserTenant,
        Project_1.Project,
        ProjectDomain_1.ProjectDomain,
        SitePage_1.SitePage,
        SeoAudit_1.SeoAudit,
        SeoIssue_1.SeoIssue,
        SeoFix_1.SeoFix,
        TenantPlan_1.TenantPlan,
        TenantQuota_1.TenantQuota,
        TenantUsage_1.TenantUsage,
    ],
    migrations: ["src/migrations/*.ts"],
    synchronize: false,
    logging: env_1.env.env === "development" ? ["error", "warn"] : false,
    options: {
        encrypt: false,
        connectTimeout: 30000, // 30 seconds for initial connection
    },
    extra: {
        requestTimeout: 60000, // 60 seconds for query execution (default is 15000ms)
    },
});
const initializeDatabase = async () => {
    if (exports.AppDataSource.isInitialized) {
        return exports.AppDataSource;
    }
    return exports.AppDataSource.initialize();
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=data-source.js.map