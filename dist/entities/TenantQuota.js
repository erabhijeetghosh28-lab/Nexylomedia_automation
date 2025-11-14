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
exports.TenantQuota = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const TenantPlan_1 = require("./TenantPlan");
let TenantQuota = class TenantQuota extends BaseEntity_1.BaseEntity {
    tenant;
    plan;
    maxProjects;
    maxDomains;
    maxMembers;
    maxOrgAdmins;
    maxAutomationsPerMonth;
    featureFlags;
    billingStatus;
    trialEndsAt;
    currentPeriodEndsAt;
    notes;
    apiKeys;
};
exports.TenantQuota = TenantQuota;
__decorate([
    (0, typeorm_1.OneToOne)(() => Tenant_1.Tenant, (tenant) => tenant.quota, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "tenant_id" }),
    __metadata("design:type", Tenant_1.Tenant)
], TenantQuota.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TenantPlan_1.TenantPlan, (plan) => plan.quotas, {
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: "plan_id" }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "maxProjects", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "maxDomains", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "maxMembers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "maxOrgAdmins", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "maxAutomationsPerMonth", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", { nullable: true }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "featureFlags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 16, default: "trial" }),
    __metadata("design:type", String)
], TenantQuota.prototype, "billingStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2", nullable: true }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "trialEndsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2", nullable: true }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "currentPeriodEndsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: "MAX", nullable: true }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", { nullable: true }),
    __metadata("design:type", Object)
], TenantQuota.prototype, "apiKeys", void 0);
exports.TenantQuota = TenantQuota = __decorate([
    (0, typeorm_1.Entity)({ name: "tenant_quotas" }),
    (0, typeorm_1.Unique)(["tenant"])
], TenantQuota);
//# sourceMappingURL=TenantQuota.js.map