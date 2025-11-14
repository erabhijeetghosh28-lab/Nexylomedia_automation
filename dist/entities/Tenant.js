"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tenant = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const UserTenant_1 = require("./UserTenant");
const Project_1 = require("./Project");
const TenantQuota_1 = require("./TenantQuota");
const TenantUsage_1 = require("./TenantUsage");
const TenantPlan_1 = require("./TenantPlan");
let Tenant = class Tenant extends BaseEntity_1.BaseEntity {
    slug;
    name;
    plan;
    planKey;
    featuresJson;
    memberships;
    projects;
    quota;
    usage;
};
exports.Tenant = Tenant;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Tenant.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tenant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TenantPlan_1.TenantPlan, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "plan_key", referencedColumnName: "key" }),
    __metadata("design:type", Object)
], Tenant.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 64, nullable: true }),
    __metadata("design:type", Object)
], Tenant.prototype, "planKey", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", { nullable: true }),
    __metadata("design:type", Object)
], Tenant.prototype, "featuresJson", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserTenant_1.UserTenant, (membership) => membership.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "memberships", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_1.Project, (project) => project.tenant),
    __metadata("design:type", Array)
], Tenant.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => TenantQuota_1.TenantQuota, (quota) => quota.tenant),
    __metadata("design:type", TenantQuota_1.TenantQuota)
], Tenant.prototype, "quota", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => TenantUsage_1.TenantUsage, (usage) => usage.tenant),
    __metadata("design:type", TenantUsage_1.TenantUsage)
], Tenant.prototype, "usage", void 0);
exports.Tenant = Tenant = __decorate([
    (0, typeorm_1.Entity)({ name: "tenants" })
], Tenant);
//# sourceMappingURL=Tenant.js.map