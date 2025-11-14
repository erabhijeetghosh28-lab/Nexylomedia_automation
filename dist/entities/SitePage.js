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
exports.SitePage = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Project_1 = require("./Project");
const ProjectDomain_1 = require("./ProjectDomain");
const SeoAudit_1 = require("./SeoAudit");
let SitePage = class SitePage extends BaseEntity_1.BaseEntity {
    project;
    domain;
    fullUrl;
    urlPath;
    status;
    origin;
    httpStatus;
    checksum;
    lastDiscoveredAt;
    lastCrawledAt;
    isIndexed;
    metadata;
    audits;
};
exports.SitePage = SitePage;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, (project) => project.pages, {
        onDelete: "NO ACTION",
    }),
    (0, typeorm_1.JoinColumn)({ name: "project_id" }),
    __metadata("design:type", Project_1.Project)
], SitePage.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProjectDomain_1.ProjectDomain, { nullable: true, onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "domain_id" }),
    __metadata("design:type", Object)
], SitePage.prototype, "domain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 2048 }),
    __metadata("design:type", String)
], SitePage.prototype, "fullUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 1024 }),
    __metadata("design:type", String)
], SitePage.prototype, "urlPath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 16, default: "discovered" }),
    __metadata("design:type", String)
], SitePage.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 16, default: "sitemap" }),
    __metadata("design:type", String)
], SitePage.prototype, "origin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Object)
], SitePage.prototype, "httpStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 64, nullable: true }),
    __metadata("design:type", Object)
], SitePage.prototype, "checksum", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2", nullable: true }),
    __metadata("design:type", Object)
], SitePage.prototype, "lastDiscoveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2", nullable: true }),
    __metadata("design:type", Object)
], SitePage.prototype, "lastCrawledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SitePage.prototype, "isIndexed", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", { nullable: true }),
    __metadata("design:type", Object)
], SitePage.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SeoAudit_1.SeoAudit, (audit) => audit.page),
    __metadata("design:type", Array)
], SitePage.prototype, "audits", void 0);
exports.SitePage = SitePage = __decorate([
    (0, typeorm_1.Entity)({ name: "site_pages" }),
    (0, typeorm_1.Index)(["project", "fullUrl"], { unique: true })
], SitePage);
//# sourceMappingURL=SitePage.js.map