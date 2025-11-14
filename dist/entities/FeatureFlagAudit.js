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
exports.FeatureFlagAudit = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const User_1 = require("./User");
let FeatureFlagAudit = class FeatureFlagAudit extends BaseEntity_1.BaseEntity {
    tenant;
    flagKey;
    enabledBy;
    enabledAt;
    reason;
};
exports.FeatureFlagAudit = FeatureFlagAudit;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "tenant_id" }),
    __metadata("design:type", Tenant_1.Tenant)
], FeatureFlagAudit.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 128 }),
    __metadata("design:type", String)
], FeatureFlagAudit.prototype, "flagKey", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: true, onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "enabled_by_user_id" }),
    __metadata("design:type", Object)
], FeatureFlagAudit.prototype, "enabledBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2", default: () => "GETDATE()" }),
    __metadata("design:type", Date)
], FeatureFlagAudit.prototype, "enabledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: "MAX", nullable: true }),
    __metadata("design:type", Object)
], FeatureFlagAudit.prototype, "reason", void 0);
exports.FeatureFlagAudit = FeatureFlagAudit = __decorate([
    (0, typeorm_1.Entity)({ name: "feature_flag_audit" }),
    (0, typeorm_1.Index)(["tenant", "flagKey"]),
    (0, typeorm_1.Index)(["enabledAt"])
], FeatureFlagAudit);
//# sourceMappingURL=FeatureFlagAudit.js.map