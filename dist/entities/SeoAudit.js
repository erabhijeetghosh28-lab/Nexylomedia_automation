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
exports.SeoAudit = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Project_1 = require("./Project");
const SitePage_1 = require("./SitePage");
const SeoIssue_1 = require("./SeoIssue");
let SeoAudit = class SeoAudit extends BaseEntity_1.BaseEntity {
    project;
    page;
    type;
    status;
    trigger;
    runner;
    score;
    summary;
    error;
    rawResult;
    jobId;
    startedAt;
    completedAt;
    issues;
};
exports.SeoAudit = SeoAudit;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, (project) => project.audits, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "project_id" }),
    __metadata("design:type", Project_1.Project)
], SeoAudit.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SitePage_1.SitePage, (page) => page.audits, {
        nullable: true,
        onDelete: "SET NULL",
    }),
    (0, typeorm_1.JoinColumn)({ name: "page_id" }),
    __metadata("design:type", Object)
], SeoAudit.prototype, "page", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 20 }),
    __metadata("design:type", String)
], SeoAudit.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 20, default: "pending" }),
    __metadata("design:type", String)
], SeoAudit.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 20, default: "manual" }),
    __metadata("design:type", String)
], SeoAudit.prototype, "trigger", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 10, default: "mock" }),
    __metadata("design:type", String)
], SeoAudit.prototype, "runner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], SeoAudit.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 512, nullable: true }),
    __metadata("design:type", Object)
], SeoAudit.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 1024, nullable: true }),
    __metadata("design:type", Object)
], SeoAudit.prototype, "error", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", { nullable: true }),
    __metadata("design:type", Object)
], SeoAudit.prototype, "rawResult", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 128, nullable: true }),
    __metadata("design:type", Object)
], SeoAudit.prototype, "jobId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2", nullable: true }),
    __metadata("design:type", Object)
], SeoAudit.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2", nullable: true }),
    __metadata("design:type", Object)
], SeoAudit.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SeoIssue_1.SeoIssue, (issue) => issue.audit, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], SeoAudit.prototype, "issues", void 0);
exports.SeoAudit = SeoAudit = __decorate([
    (0, typeorm_1.Entity)({ name: "seo_audits" }),
    (0, typeorm_1.Index)(["project", "type", "status"])
], SeoAudit);
//# sourceMappingURL=SeoAudit.js.map