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
exports.UserTenant = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const User_1 = require("./User");
const Tenant_1 = require("./Tenant");
let UserTenant = class UserTenant extends BaseEntity_1.BaseEntity {
    user;
    tenant;
    role;
    toolAccess;
};
exports.UserTenant = UserTenant;
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.memberships, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], UserTenant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.memberships, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: "tenant_id" }),
    __metadata("design:type", Tenant_1.Tenant)
], UserTenant.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 32 }),
    __metadata("design:type", String)
], UserTenant.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", { nullable: true }),
    __metadata("design:type", Object)
], UserTenant.prototype, "toolAccess", void 0);
exports.UserTenant = UserTenant = __decorate([
    (0, typeorm_1.Entity)({ name: "user_tenants" }),
    (0, typeorm_1.Unique)(["user", "tenant"])
], UserTenant);
//# sourceMappingURL=UserTenant.js.map