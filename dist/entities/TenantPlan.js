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
exports.TenantPlan = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const TenantQuota_1 = require("./TenantQuota");
let TenantPlan = class TenantPlan extends BaseEntity_1.BaseEntity {
    code;
    key;
    name;
    description;
    monthlyPrice;
    annualPrice;
    currency;
    isActive;
    allowedFeatures;
    quotas;
    quotasList;
};
exports.TenantPlan = TenantPlan;
__decorate([
    (0, typeorm_1.Column)({ length: 64 }),
    __metadata("design:type", String)
], TenantPlan.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 64, unique: true, nullable: true }),
    __metadata("design:type", Object)
], TenantPlan.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], TenantPlan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 512, nullable: true }),
    __metadata("design:type", Object)
], TenantPlan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], TenantPlan.prototype, "monthlyPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], TenantPlan.prototype, "annualPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 8, default: "USD" }),
    __metadata("design:type", String)
], TenantPlan.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], TenantPlan.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", { nullable: true }),
    __metadata("design:type", Object)
], TenantPlan.prototype, "allowedFeatures", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", { nullable: true }),
    __metadata("design:type", Object)
], TenantPlan.prototype, "quotas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TenantQuota_1.TenantQuota, (quota) => quota.plan),
    __metadata("design:type", Array)
], TenantPlan.prototype, "quotasList", void 0);
exports.TenantPlan = TenantPlan = __decorate([
    (0, typeorm_1.Entity)({ name: "tenant_plans" }),
    (0, typeorm_1.Index)(["code"], { unique: true }),
    (0, typeorm_1.Index)(["key"], { unique: true })
], TenantPlan);
//# sourceMappingURL=TenantPlan.js.map