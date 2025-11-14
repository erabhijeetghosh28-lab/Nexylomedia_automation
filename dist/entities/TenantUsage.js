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
exports.TenantUsage = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
let TenantUsage = class TenantUsage extends BaseEntity_1.BaseEntity {
    tenant;
    projectCount;
    domainCount;
    memberCount;
    orgAdminCount;
    automationRunsThisMonth;
    lastCalculatedAt;
};
exports.TenantUsage = TenantUsage;
__decorate([
    (0, typeorm_1.OneToOne)(() => Tenant_1.Tenant, (tenant) => tenant.usage, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "tenant_id" }),
    __metadata("design:type", Tenant_1.Tenant)
], TenantUsage.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], TenantUsage.prototype, "projectCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], TenantUsage.prototype, "domainCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], TenantUsage.prototype, "memberCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], TenantUsage.prototype, "orgAdminCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], TenantUsage.prototype, "automationRunsThisMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2", nullable: true }),
    __metadata("design:type", Object)
], TenantUsage.prototype, "lastCalculatedAt", void 0);
exports.TenantUsage = TenantUsage = __decorate([
    (0, typeorm_1.Entity)({ name: "tenant_usages" }),
    (0, typeorm_1.Unique)(["tenant"])
], TenantUsage);
//# sourceMappingURL=TenantUsage.js.map