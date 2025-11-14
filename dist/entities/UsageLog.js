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
exports.UsageLog = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
let UsageLog = class UsageLog extends BaseEntity_1.BaseEntity {
    tenant;
    metricKey;
    value;
    periodStart;
    periodEnd;
};
exports.UsageLog = UsageLog;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "tenant_id" }),
    __metadata("design:type", Tenant_1.Tenant)
], UsageLog.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 128 }),
    __metadata("design:type", String)
], UsageLog.prototype, "metricKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], UsageLog.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2" }),
    __metadata("design:type", Date)
], UsageLog.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2" }),
    __metadata("design:type", Date)
], UsageLog.prototype, "periodEnd", void 0);
exports.UsageLog = UsageLog = __decorate([
    (0, typeorm_1.Entity)({ name: "usage_logs" }),
    (0, typeorm_1.Index)(["tenant", "metricKey", "periodStart"]),
    (0, typeorm_1.Index)(["tenant", "periodStart", "periodEnd"])
], UsageLog);
//# sourceMappingURL=UsageLog.js.map