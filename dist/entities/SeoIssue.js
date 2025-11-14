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
exports.SeoIssue = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const SeoAudit_1 = require("./SeoAudit");
const SeoFix_1 = require("./SeoFix");
let SeoIssue = class SeoIssue extends BaseEntity_1.BaseEntity {
    audit;
    code;
    severity;
    category;
    description;
    metricValue;
    threshold;
    recommendation;
    status;
    resolvedAt;
    fixes;
};
exports.SeoIssue = SeoIssue;
__decorate([
    (0, typeorm_1.ManyToOne)(() => SeoAudit_1.SeoAudit, (audit) => audit.issues, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "audit_id" }),
    __metadata("design:type", SeoAudit_1.SeoAudit)
], SeoIssue.prototype, "audit", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128 }),
    __metadata("design:type", String)
], SeoIssue.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 16, default: "medium" }),
    __metadata("design:type", String)
], SeoIssue.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 20, default: "performance" }),
    __metadata("design:type", String)
], SeoIssue.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 512 }),
    __metadata("design:type", String)
], SeoIssue.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Object)
], SeoIssue.prototype, "metricValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4, nullable: true }),
    __metadata("design:type", Object)
], SeoIssue.prototype, "threshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 1024, nullable: true }),
    __metadata("design:type", Object)
], SeoIssue.prototype, "recommendation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 16, default: "open" }),
    __metadata("design:type", String)
], SeoIssue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2", nullable: true }),
    __metadata("design:type", Object)
], SeoIssue.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SeoFix_1.SeoFix, (fix) => fix.issue, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], SeoIssue.prototype, "fixes", void 0);
exports.SeoIssue = SeoIssue = __decorate([
    (0, typeorm_1.Entity)({ name: "seo_issues" }),
    (0, typeorm_1.Index)(["audit", "code"])
], SeoIssue);
//# sourceMappingURL=SeoIssue.js.map